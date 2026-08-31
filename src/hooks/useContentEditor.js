import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLmsSync } from './useLmsSync';
import { useAuth } from './useAuth';
import { generateId } from '../utils/slug';
import { API_URL } from '../config/api';
import { DEFAULT_CATEGORY_ID } from '../config/contentCategories';

export function useContentEditor() {
  const { data, manualSync } = useLmsSync();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const queryBatchId = searchParams.get('batchId');
  const contentId = params.contentId || searchParams.get('contentId');
  const isEditMode = Boolean(contentId);

  const [useExistingBatch, setUseExistingBatch] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [newBatchName, setNewBatchName] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchSearch, setBatchSearch] = useState('');

  const [useExistingModule, setUseExistingModule] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [newModuleName, setNewModuleName] = useState('');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleSearch, setModuleSearch] = useState('');

  const [showContentPickerModal, setShowContentPickerModal] = useState(false);
  const [selectedModuleForContentPicker, setSelectedModuleForContentPicker] = useState(null);
  const [contentPickerSearch, setContentPickerSearch] = useState('');

  const [loadedContentId, setLoadedContentId] = useState(contentId || '');
  const [showConfirmLoadModal, setShowConfirmLoadModal] = useState(false);
  const [pendingLoadContent, setPendingLoadContent] = useState(null);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  const [category, setCategory] = useState(DEFAULT_CATEGORY_ID);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [contentTitle, setContentTitle] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [activeTab, setActiveTab] = useState('editor');

  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const estimatedReadTime = useMemo(() => {
    const text = htmlContent.replace(/<[^>]*>?/gm, '');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 150));
  }, [htmlContent]);

  const myBatches = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (auth?.role === 'admin') return data;
    const currentUserId = String(auth?.userId || '').trim().toLowerCase();
    if (!currentUserId) return [];

    return data.filter(batch => {
      return batch.modules?.some(m => 
        m.contents?.some(c => 
          String(c.userId || '').trim().toLowerCase() === currentUserId
        )
      );
    });
  }, [data, auth?.userId, auth?.role]);

  useEffect(() => {
    if (isEditMode && data && !initialized) {
      let found = false;
      for (const batch of data) {
        for (const module of batch.modules || []) {
          const c = module.contents?.find(item => item.contentId === contentId);
          if (c) {
            if (c.userId && c.userId !== auth?.userId && auth?.role !== 'admin') {
              setError('Akses ditolak: Anda hanya dapat mengedit materi yang Anda buat sendiri.');
              setInitialized(true);
              found = true;
              break;
            }

            setUseExistingBatch(true);
            setSelectedBatchId(batch.batchId);
            setNewBatchName(batch.batchName);

            setUseExistingModule(true);
            setSelectedModuleId(module.moduleId);
            setNewModuleName(module.moduleTitle);

            setCategory(c.category || DEFAULT_CATEGORY_ID);
            setContentTitle(c.title || '');
            setHtmlContent(c.htmlContent || '');
            setLoadedContentId(c.contentId);
            setInitialized(true);
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) {
        setError('Materi pembelajaran tidak ditemukan.');
      }
    } else if (!isEditMode && !initialized && data) {
      if (queryBatchId && myBatches && myBatches.length > 0) {
        const targetBatch = myBatches.find(b => b.batchId === queryBatchId);
        if (targetBatch) {
          setUseExistingBatch(true);
          setSelectedBatchId(targetBatch.batchId);
          if (targetBatch.category) {
            setCategory(targetBatch.category);
          }
          setSelectedModuleId('');
          setNewModuleName('');
          setLoadedContentId('');
          setContentTitle('');
          setHtmlContent('');
          setUseExistingModule(Boolean(targetBatch.modules && targetBatch.modules.length > 0));
        } else {
          setUseExistingBatch(false);
          setUseExistingModule(false);
        }
      } else {
        setUseExistingBatch(false);
        setUseExistingModule(false);
        setSelectedBatchId('');
        setSelectedModuleId('');
        setLoadedContentId('');
        setContentTitle('');
        setHtmlContent('');
      }
      setInitialized(true);
    }
  }, [isEditMode, data, myBatches, contentId, auth, initialized, queryBatchId]);

  const loadContentIntoEditor = (c, mod) => {
    setContentTitle(c.title || '');
    setHtmlContent(c.htmlContent || '');
    setLoadedContentId(c.contentId || '');
    if (c.category) {
      setCategory(c.category);
    }
  };

  const handleOpenContentPicker = (targetModule) => {
    if (!targetModule) return;
    if (!targetModule.contents || targetModule.contents.length === 0) {
      handleSelectModuleForNewContent(targetModule);
      return;
    }
    setSelectedModuleForContentPicker(targetModule);
    setContentPickerSearch('');
    setShowContentPickerModal(true);
  };

  const handleSelectSpecificContentToEdit = (c, targetModule) => {
    if (!c || !targetModule) return;
    setSelectedModuleId(targetModule.moduleId);
    setUseExistingModule(true);
    setShowContentPickerModal(false);
    setShowModuleModal(false);

    const hasUnsavedContent = Boolean(contentTitle.trim() || htmlContent.trim());
    const isDifferent = contentTitle.trim() !== (c.title || '').trim() ||
                        htmlContent.trim() !== (c.htmlContent || '').trim();

    if (hasUnsavedContent && isDifferent) {
      setPendingLoadContent({ module: targetModule, content: c });
      setShowConfirmLoadModal(true);
    } else {
      loadContentIntoEditor(c, targetModule);
    }
  };

  const handleModuleSelect = (targetModule) => {
    if (!targetModule) return;
    if (targetModule.contents && targetModule.contents.length > 0) {
      handleOpenContentPicker(targetModule);
    } else {
      handleSelectModuleForNewContent(targetModule);
    }
  };

  const handleSelectModuleForNewContent = (targetModule) => {
    if (!targetModule) return;
    setUseExistingModule(true);
    setSelectedModuleId(targetModule.moduleId);
    setNewModuleName('');
    setLoadedContentId('');
    setContentTitle('');
    setHtmlContent('');
    setShowContentPickerModal(false);
    setShowModuleModal(false);
  };

  const handleCreateNewModuleFromModal = () => {
    setUseExistingModule(false);
    setSelectedModuleId('');
    setNewModuleName('');
    setLoadedContentId('');
    setContentTitle('');
    setHtmlContent('');
    setShowContentPickerModal(false);
    setShowModuleModal(false);
  };

  const handleBatchSelect = (bId) => {
    setSelectedBatchId(bId);
    const selectedB = myBatches?.find(b => b.batchId === bId);
    if (selectedB) {
      if (selectedB.category) {
        setCategory(selectedB.category);
      }
      setSelectedModuleId('');
      setNewModuleName('');
      setLoadedContentId('');
      setContentTitle('');
      setHtmlContent('');
      if (selectedB.modules?.length > 0) {
        setUseExistingModule(true);
      } else {
        setUseExistingModule(false);
      }
    }
  };

  const currentBatch = useMemo(() => {
    if (useExistingBatch) {
      return myBatches?.find(b => b.batchId === selectedBatchId) || null;
    }
    return null;
  }, [myBatches, useExistingBatch, selectedBatchId]);

  const currentBatchDisplay = useMemo(() => {
    if (useExistingBatch) {
      const found = myBatches?.find(b => b.batchId === selectedBatchId);
      return found ? found.batchName : 'Pilih Batch';
    }
    return newBatchName || 'Batch Baru';
  }, [useExistingBatch, selectedBatchId, myBatches, newBatchName]);

  const currentModuleDisplay = useMemo(() => {
    if (useExistingModule && currentBatch) {
      const found = currentBatch.modules?.find(m => m.moduleId === selectedModuleId);
      return found ? found.moduleTitle : 'Pilih Modul';
    }
    return newModuleName || 'Modul Baru';
  }, [useExistingModule, currentBatch, selectedModuleId, newModuleName]);

  const modalFilteredBatches = useMemo(() => {
    if (!myBatches) return [];
    const q = batchSearch.toLowerCase().trim();
    if (!q) return myBatches;
    return myBatches.filter(b => b.batchName?.toLowerCase().includes(q));
  }, [myBatches, batchSearch]);

  const modalFilteredModules = useMemo(() => {
    if (!currentBatch?.modules) return [];
    const q = moduleSearch.toLowerCase().trim();
    if (!q) return currentBatch.modules;
    return currentBatch.modules.filter(m => m.moduleTitle?.toLowerCase().includes(q));
  }, [currentBatch, moduleSearch]);

  const modalFilteredContents = useMemo(() => {
    if (!selectedModuleForContentPicker?.contents) return [];
    const q = contentPickerSearch.toLowerCase().trim();
    if (!q) return selectedModuleForContentPicker.contents;
    return selectedModuleForContentPicker.contents.filter(c => 
      (c.title || c.contentTitle || '').toLowerCase().includes(q)
    );
  }, [selectedModuleForContentPicker, contentPickerSearch]);

  const handleFormSubmitCheck = (e) => {
    e.preventDefault();
    setError(null);

    if (!contentTitle.trim()) {
      setError('Judul materi pembelajaran wajib diisi.');
      return;
    }

    if (!htmlContent.trim()) {
      setError('Isi materi pembelajaran tidak boleh kosong.');
      return;
    }

    if (useExistingBatch && !selectedBatchId) {
      setError('Silakan pilih Batch kurikulum atau buat Batch baru.');
      return;
    }

    if (!useExistingBatch && !newBatchName.trim()) {
      setError('Nama Batch kurikulum baru wajib diisi.');
      return;
    }

    if (useExistingModule && !selectedModuleId) {
      setError('Silakan pilih Modul pembelajaran atau buat Modul baru.');
      return;
    }

    if (!useExistingModule && !newModuleName.trim()) {
      setError('Nama Modul pembelajaran baru wajib diisi.');
      return;
    }

    setShowSaveConfirmModal(true);
  };

  const executeSave = async () => {
    setShowSaveConfirmModal(false);
    setIsSaving(true);
    setSuccess(false);

    try {
      let finalBatchId = selectedBatchId;
      let finalBatchName = '';
      if (!useExistingBatch) {
        finalBatchId = generateId(newBatchName.trim());
        finalBatchName = newBatchName.trim();
      } else {
        const foundB = myBatches.find(b => b.batchId === selectedBatchId);
        finalBatchName = foundB ? foundB.batchName : selectedBatchId;
      }

      let finalModuleId = selectedModuleId;
      let finalModuleTitle = '';
      if (!useExistingModule) {
        finalModuleId = generateId(newModuleName.trim());
        finalModuleTitle = newModuleName.trim();
      } else {
        const foundM = currentBatch?.modules?.find(m => m.moduleId === selectedModuleId);
        finalModuleTitle = foundM ? foundM.moduleTitle : selectedModuleId;
      }

      const generatedContentId = isEditMode ? contentId : (loadedContentId || generateId(contentTitle.trim()));

      const endpointUrl = API_URL;
      const actionName = (isEditMode || loadedContentId) ? 'update_content' : 'add_content';

      const saveData = {
        batchId: finalBatchId,
        batchName: finalBatchName,
        moduleId: finalModuleId,
        moduleTitle: finalModuleTitle,
        contentId: generatedContentId,
        title: contentTitle.trim(),
        contentTitle: contentTitle.trim(),
        htmlContent: htmlContent.trim(),
        category: category || DEFAULT_CATEGORY_ID,
        userId: auth?.userId || 'USR-ANON',
        userName: auth?.name || 'Educator',
        role: auth?.role || 'educator'
      };

      const res = await fetch(`${endpointUrl}?action=${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(saveData)
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || 'Gagal menyimpan data materi.');
      }

      setSuccess(true);
      await manualSync();

      setTimeout(() => {
        navigate('/educator/contents');
      }, 1200);

    } catch (err) {
      setError(err.message || 'Terjadi kesalahan sistem saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditMode,
    contentId,
    useExistingBatch,
    setUseExistingBatch,
    selectedBatchId,
    setSelectedBatchId,
    newBatchName,
    setNewBatchName,
    showBatchModal,
    setShowBatchModal,
    batchSearch,
    setBatchSearch,
    useExistingModule,
    setUseExistingModule,
    selectedModuleId,
    setSelectedModuleId,
    newModuleName,
    setNewModuleName,
    showModuleModal,
    setShowModuleModal,
    moduleSearch,
    setModuleSearch,
    showContentPickerModal,
    setShowContentPickerModal,
    selectedModuleForContentPicker,
    contentPickerSearch,
    setContentPickerSearch,
    loadedContentId,
    setLoadedContentId,
    showConfirmLoadModal,
    setShowConfirmLoadModal,
    pendingLoadContent,
    showSaveConfirmModal,
    setShowSaveConfirmModal,
    category,
    setCategory,
    showCategoryModal,
    setShowCategoryModal,
    contentTitle,
    setContentTitle,
    htmlContent,
    setHtmlContent,
    activeTab,
    setActiveTab,
    error,
    isSaving,
    success,
    estimatedReadTime,
    myBatches,
    currentBatch,
    currentBatchDisplay,
    currentModuleDisplay,
    modalFilteredBatches,
    modalFilteredModules,
    modalFilteredContents,
    handleBatchSelect,
    handleModuleSelect,
    handleOpenContentPicker,
    handleSelectSpecificContentToEdit,
    handleSelectModuleForNewContent,
    handleCreateNewModuleFromModal,
    loadContentIntoEditor,
    handleFormSubmitCheck,
    executeSave,
    navigate
  };
}
