import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLmsSync } from './useLmsSync';
import { useSavedMaterials } from './useSavedMaterials';
import { useStudyGroup } from './useStudyGroup';
import { useAuth } from './useAuth';

export function useExploreMaterials() {
  const { data, loading, error, manualSync } = useLmsSync();
  const { 
    isBatchSaved, 
    toggleSaveBatch, 
    getBatchSaveCount, 
    getBatchSavedUsers, 
    savedBatchCount 
  } = useSavedMaterials();
  const { groups, activeGroup, addBatchToGroup } = useStudyGroup();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [expandedSyllabus, setExpandedSyllabus] = useState({});
  const [selectedPreviewBatch, setSelectedPreviewBatch] = useState(null);
  const [selectedPreviewContent, setSelectedPreviewContent] = useState(null);
  const [selectedUsersListBatch, setSelectedUsersListBatch] = useState(null);
  const [studyGroupModalBatch, setStudyGroupModalBatch] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const totalLessonsCount = useMemo(() => {
    if (!data || !Array.isArray(data)) return 0;
    return data.reduce((acc, batch) => {
      const bContents = batch.modules?.reduce((mAcc, m) => mAcc + (m.contents?.length || 0), 0) || 0;
      return acc + bContents;
    }, 0);
  }, [data]);

  const processedBatches = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((batch) => {
      let educatorName = 'Educator';
      const batchCat = batch.category || (batch.categories && batch.categories[0]) || 'general';

      for (const m of batch.modules || []) {
        for (const c of m.contents || []) {
          if (c.userName && c.userName.trim()) {
            educatorName = c.userName.trim();
          }
        }
      }

      const totalModules = batch.modules?.length || 0;
      const totalContents = batch.modules?.reduce((acc, m) => acc + (m.contents?.length || 0), 0) || 0;
      const isSaved = isBatchSaved(batch.batchId, batch.batchName);
      const totalSavedUsers = getBatchSaveCount(batch.batchId, batch.batchName);

      return {
        ...batch,
        educatorName,
        category: batchCat,
        categories: [batchCat],
        totalModules,
        totalContents,
        totalSavedUsers,
        isSaved
      };
    });
  }, [data, isBatchSaved, getBatchSaveCount]);

  const filteredBatches = useMemo(() => {
    let list = [...processedBatches];

    if (activeFilter === 'saved') {
      list = list.filter(b => b.isSaved);
    } else if (activeFilter === 'popular') {
      list = list.sort((a, b) => b.totalSavedUsers - a.totalSavedUsers);
    }

    if (selectedCategory !== 'all') {
      list = list.filter(b => b.category === selectedCategory || b.categories?.includes(selectedCategory));
    }

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(batch => {
        const matchBatchName = batch.batchName?.toLowerCase().includes(q);
        const matchEducator = batch.educatorName?.toLowerCase().includes(q);
        const matchModule = batch.modules?.some(m => 
          m.moduleTitle?.toLowerCase().includes(q) ||
          m.contents?.some(c => c.title?.toLowerCase().includes(q))
        );
        return matchBatchName || matchEducator || matchModule;
      });
    }

    return list;
  }, [processedBatches, activeFilter, selectedCategory, searchQuery]);

  const toggleSyllabusCard = (batchId) => {
    setExpandedSyllabus(prev => ({
      ...prev,
      [batchId]: !prev[batchId]
    }));
  };

  const handleToggleBatchSave = async (e, batch) => {
    e.stopPropagation();
    const isNowSaved = await toggleSaveBatch(batch);
    setToastMessage(isNowSaved 
      ? `Batch "${batch.batchName}" berhasil disimpan ke Ruang Belajar.` 
      : `Batch "${batch.batchName}" dihapus dari Ruang Belajar.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleShareToGroup = (groupId) => {
    if (studyGroupModalBatch) {
      addBatchToGroup(groupId, studyGroupModalBatch);
      setStudyGroupModalBatch(null);
      setToastMessage(`Batch "${studyGroupModalBatch.batchName}" berhasil dibagikan ke grup belajar!`);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return {
    data,
    loading,
    error,
    manualSync,
    auth,
    navigate,
    groups,
    savedBatchCount,
    totalLessonsCount,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    expandedSyllabus,
    toggleSyllabusCard,
    selectedPreviewBatch,
    setSelectedPreviewBatch,
    selectedPreviewContent,
    setSelectedPreviewContent,
    selectedUsersListBatch,
    setSelectedUsersListBatch,
    studyGroupModalBatch,
    setStudyGroupModalBatch,
    toastMessage,
    filteredBatches,
    handleToggleBatchSave,
    handleShareToGroup,
    getBatchSavedUsers
  };
}
