import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLmsSync } from './useLmsSync';
import { useAuth } from './useAuth';
import { generateId } from '../utils/slug';
import { API_URL } from '../config/api';
import { DEFAULT_CATEGORY_ID } from '../config/contentCategories';

export function useEducatorContentManager() {
  const { data, loading, error, manualSync } = useLmsSync();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialBatchId = searchParams.get('batchId') || null;

  const [expandedBatch, setExpandedBatch] = useState(initialBatchId);
  const [expandedModule, setExpandedModule] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const [deletingId, setDeletingId] = useState(null);
  const [deletingContent, setDeletingContent] = useState(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  const [editingBatch, setEditingBatch] = useState(null);
  const [editBatchName, setEditBatchName] = useState('');
  const [editBatchCategory, setEditBatchCategory] = useState(DEFAULT_CATEGORY_ID);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [isUpdatingBatch, setIsUpdatingBatch] = useState(false);
  const [editBatchError, setEditBatchError] = useState('');

  const [deletingBatch, setDeletingBatch] = useState(null);
  const [isDeletingBatch, setIsDeletingBatch] = useState(false);
  const [deleteBatchError, setDeleteBatchError] = useState('');

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q');
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
    const bId = searchParams.get('batchId');
    if (bId) {
      setExpandedBatch(bId);
    }
  }, [searchParams]);

  const currentUserId = String(auth?.userId || '').trim().toLowerCase();
  const isAdmin = auth?.role === 'admin';

  const myBatches = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (isAdmin) return data;
    if (!currentUserId) return [];

    return data.filter(batch => {
      return batch.modules?.some(m => 
        m.contents?.some(c => 
          String(c.userId || '').trim().toLowerCase() === currentUserId
        )
      );
    });
  }, [data, currentUserId, isAdmin]);

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const cleanSearch = searchQuery.trim().toLowerCase();
    
    return data.map(batch => {
      const batchCat = batch.category || 'general';
      const matchesCategory = selectedCategory === 'all' || batchCat === selectedCategory;
      const batchNameMatches = cleanSearch && batch.batchName?.toLowerCase().includes(cleanSearch);

      const filteredModules = batch.modules?.map(module => {
        const moduleNameMatches = cleanSearch && module.moduleTitle?.toLowerCase().includes(cleanSearch);

        const filteredContents = module.contents?.filter(content => {
          const contentOwnerId = String(content.userId || '').trim().toLowerCase();
          const isOwner = isAdmin || (contentOwnerId && contentOwnerId === currentUserId);
          if (!isOwner) return false;

          const contentTitleMatches = cleanSearch && content.title?.toLowerCase().includes(cleanSearch);
          return !cleanSearch || batchNameMatches || moduleNameMatches || contentTitleMatches;
        }) || [];

        return {
          ...module,
          contents: filteredContents
        };
      }).filter(module => module.contents && module.contents.length > 0) || [];
      
      return {
        ...batch,
        modules: filteredModules
      };
    }).filter(batch => {
      const batchCat = batch.category || 'general';
      const matchesCategory = selectedCategory === 'all' || batchCat === selectedCategory;
      return matchesCategory && batch.modules && batch.modules.length > 0;
    });
  }, [data, searchQuery, selectedCategory, currentUserId, isAdmin]);

  const totalStats = useMemo(() => {
    let totalModules = 0;
    let totalContents = 0;
    for (const b of filteredData) {
      totalModules += b.modules?.length || 0;
      for (const m of b.modules || []) {
        totalContents += m.contents?.length || 0;
      }
    }
    return {
      totalBatches: filteredData.length,
      totalModules,
      totalContents
    };
  }, [filteredData]);

  const toggleBatch = (batchId) => {
    setExpandedBatch(prev => prev === batchId ? null : batchId);
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(prev => prev === moduleId ? null : moduleId);
  };

  const handleEditContent = (content) => {
    const contentOwnerId = String(content.userId || '').trim().toLowerCase();
    if (contentOwnerId && contentOwnerId !== currentUserId && !isAdmin) {
      alert('Akses Ditolak: Anda hanya dapat mengedit materi yang Anda buat sendiri.');
      return;
    }
    navigate(`/educator/contents/edit/${content.contentId}`);
  };

  const handleDeleteContent = (content) => {
    const contentOwnerId = String(content.userId || '').trim().toLowerCase();
    if (contentOwnerId && contentOwnerId !== currentUserId && !isAdmin) {
      alert('Akses Ditolak: Anda hanya dapat menghapus materi yang Anda buat sendiri.');
      return;
    }
    setDeletingContent(content);
  };

  const handleConfirmDeleteContent = async () => {
    if (!deletingContent) return;

    const content = deletingContent;
    setDeletingId(content.contentId);
    try {
      const endpointUrl = API_URL;
      const response = await fetch(`${endpointUrl}?action=delete_content`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          contentId: content.contentId,
          title: content.title,
          contentTitle: content.title,
          userId: auth?.userId,
          role: auth?.role
        })
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Gagal menghapus materi.');
      }

      setDeletingContent(null);
      await manualSync();
    } catch (err) {
      setDeleteErrorMessage('Gagal menghapus: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenEditBatch = (batch) => {
    setEditingBatch(batch);
    setEditBatchName(batch.batchName || '');
    setEditBatchCategory(batch.category || (batch.categories && batch.categories[0]) || 'general');
    setEditBatchError('');
  };

  const handleSaveEditBatch = async (e) => {
    e?.preventDefault();
    if (!editingBatch || !editBatchName.trim()) {
      setEditBatchError('Nama Batch kurikulum tidak boleh kosong.');
      return;
    }

    setIsUpdatingBatch(true);
    setEditBatchError('');

    try {
      const endpointUrl = API_URL;
      const response = await fetch(`${endpointUrl}?action=update_batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          batchId: editingBatch.batchId,
          batchName: editBatchName.trim(),
          category: editBatchCategory || DEFAULT_CATEGORY_ID,
          userId: auth?.userId,
          role: auth?.role
        })
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Gagal memperbarui batch.');
      }

      setEditingBatch(null);
      await manualSync();
    } catch (err) {
      setEditBatchError(err.message || 'Terjadi kesalahan saat memperbarui batch.');
    } finally {
      setIsUpdatingBatch(false);
    }
  };

  const handleDeleteBatch = (batch) => {
    setDeletingBatch(batch);
    setDeleteBatchError('');
  };

  const handleConfirmDeleteBatch = async () => {
    if (!deletingBatch) return;

    setIsDeletingBatch(true);
    setDeleteBatchError('');

    try {
      const endpointUrl = API_URL;
      const response = await fetch(`${endpointUrl}?action=delete_batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          batchId: deletingBatch.batchId,
          userId: auth?.userId,
          role: auth?.role
        })
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Gagal menghapus batch.');
      }

      setDeletingBatch(null);
      await manualSync();
    } catch (err) {
      setDeleteBatchError(err.message || 'Gagal menghapus batch.');
    } finally {
      setIsDeletingBatch(false);
    }
  };

  return {
    data,
    loading,
    error,
    manualSync,
    auth,
    navigate,
    expandedBatch,
    setExpandedBatch,
    expandedModule,
    setExpandedModule,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    deletingId,
    deletingContent,
    setDeletingContent,
    deleteErrorMessage,
    editingBatch,
    setEditingBatch,
    editBatchName,
    setEditBatchName,
    editBatchCategory,
    setEditBatchCategory,
    showEditCategoryModal,
    setShowEditCategoryModal,
    isUpdatingBatch,
    editBatchError,
    deletingBatch,
    setDeletingBatch,
    isDeletingBatch,
    deleteBatchError,
    myBatches,
    filteredData,
    totalStats,
    toggleBatch,
    toggleModule,
    handleEditContent,
    handleDeleteContent,
    handleConfirmDeleteContent,
    handleOpenEditBatch,
    handleSaveEditBatch,
    handleDeleteBatch,
    handleConfirmDeleteBatch
  };
}
