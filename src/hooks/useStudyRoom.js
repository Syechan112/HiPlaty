import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useLmsSync } from './useLmsSync';
import { useLmsProgress } from './useLmsProgress';
import { useSavedMaterials } from './useSavedMaterials';
import { useLearningTracker } from './useLearningTracker';
import { useContentViews } from './useContentViews';
import { useMaterialNotes } from './useMaterialNotes';
import { useStudyGroup } from './useStudyGroup';
import { useChat } from './useChat';

export function useStudyRoom() {
  const { data, manualSync } = useLmsSync();
  const { isContentComplete, markContentComplete, calculateBatchProgress } = useLmsProgress();
  const { getSavedBatches, toggleSaveBatch, isBatchSaved } = useSavedMaterials();
  const { incrementView } = useContentViews();
  const { groups, addBatchToGroup, createGroup, inviteFriendToGroup } = useStudyGroup();
  const { friends, addFriend, removeFriend } = useChat();
  const { startLessonTracking, stopLessonTracking } = useLearningTracker();
  const { hasNote } = useMaterialNotes();
  const [searchParams, setSearchParams] = useSearchParams();
  const { batchId: routeBatchId } = useParams();
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState('');
  const [expandedModules, setExpandedModules] = useState({});
  const [isSelectingBatch, setIsSelectingBatch] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isSidebarCompact, setIsSidebarCompact] = useState(false);
  const [studyGroupModalBatch, setStudyGroupModalBatch] = useState(null);

  const [showFriendModal, setShowFriendModal] = useState(false);
  const [addFriendInput, setAddFriendInput] = useState('');
  const [friendModalError, setFriendModalError] = useState('');
  const [friendSubmitting, setFriendSubmitting] = useState(false);
  const [friendSearchFilter, setFriendSearchFilter] = useState('');

  const [deletingBatch, setDeletingBatch] = useState(null);

  const paramBatchId = searchParams.get('batchId') || routeBatchId || '';
  const paramModuleId = searchParams.get('moduleId') || searchParams.get('module') || '';
  const paramContentId = searchParams.get('contentId') || searchParams.get('content') || '';

  const mySavedBatches = useMemo(() => {
    return getSavedBatches(data || []);
  }, [data, getSavedBatches]);

  const [selectedBatchId, setSelectedBatchId] = useState(paramBatchId);
  const [selectedModuleId, setSelectedModuleId] = useState(paramModuleId);
  const [selectedContentId, setSelectedContentId] = useState(paramContentId);

  useEffect(() => {
    if (mySavedBatches.length > 0) {
      const targetBId = paramBatchId || selectedBatchId;
      const activeBatch = (targetBId && mySavedBatches.find(b => String(b.batchId).trim() === String(targetBId).trim())) || mySavedBatches[0];
      const bId = activeBatch.batchId;

      const targetMId = paramModuleId || selectedModuleId;
      let activeModule = targetMId ? activeBatch.modules?.find(m => String(m.moduleId).trim() === String(targetMId).trim()) : null;
      if (!activeModule) {
        activeModule = activeBatch.modules?.[0];
      }

      const targetCId = paramContentId || selectedContentId;
      let activeContent = targetCId ? activeModule?.contents?.find(c => String(c.contentId).trim() === String(targetCId).trim()) : null;
      if (!activeContent && targetCId) {
        for (const mod of activeBatch.modules || []) {
          const found = mod.contents?.find(c => String(c.contentId).trim() === String(targetCId).trim());
          if (found) {
            activeContent = found;
            activeModule = mod;
            break;
          }
        }
      }
      if (!activeContent) {
        activeContent = activeModule?.contents?.[0];
      }

      setSelectedBatchId(bId);
      setSelectedModuleId(activeModule?.moduleId || '');
      setSelectedContentId(activeContent?.contentId || '');

      if (activeModule?.moduleId) {
        setExpandedModules(prev => ({ ...prev, [activeModule.moduleId]: true }));
      }
    }
  }, [mySavedBatches, paramBatchId, paramModuleId, paramContentId]);

  const currentBatch = useMemo(() => {
    return mySavedBatches.find(b => b.batchId === selectedBatchId) || mySavedBatches[0] || null;
  }, [mySavedBatches, selectedBatchId]);

  const currentModule = useMemo(() => {
    if (!currentBatch) return null;
    return currentBatch.modules?.find(m => m.moduleId === selectedModuleId) || currentBatch.modules?.[0] || null;
  }, [currentBatch, selectedModuleId]);

  const currentContent = useMemo(() => {
    if (!currentModule) return null;
    return currentModule.contents?.find(c => c.contentId === selectedContentId) || currentModule.contents?.[0] || null;
  }, [currentModule, selectedContentId]);

  useEffect(() => {
    if (currentContent?.contentId && currentBatch?.batchName) {
      startLessonTracking(currentBatch.batchName, currentContent.contentId);
      incrementView(currentContent.contentId);
    }
    return () => {
      stopLessonTracking();
    };
  }, [currentContent?.contentId, currentBatch?.batchName, startLessonTracking, stopLessonTracking, incrementView]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleSelectContent = (batchId, moduleId, contentId) => {
    setSelectedBatchId(batchId);
    setSelectedModuleId(moduleId);
    setSelectedContentId(contentId);
    setSearchParams({ batchId, moduleId, contentId });
  };

  const handleSwitchBatch = (batch) => {
    const bId = batch.batchId;
    const mId = batch.modules?.[0]?.moduleId || '';
    const cId = batch.modules?.[0]?.contents?.[0]?.contentId || '';
    setSelectedBatchId(bId);
    setSelectedModuleId(mId);
    setSelectedContentId(cId);
    setSearchParams({ batchId: bId, moduleId: mId, contentId: cId });
    setIsSelectingBatch(false);
  };

  const handleRemoveBatch = (batch) => setDeletingBatch(batch);

  const handleConfirmRemoveBatch = async () => {
    if (deletingBatch) {
      await toggleSaveBatch(deletingBatch);
      setToastMessage(`Batch "${deletingBatch.batchName}" telah dihapus dari Ruang Belajar.`);
      setDeletingBatch(null);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleMarkComplete = async (contentId) => {
    await markContentComplete(currentBatch?.batchName, contentId);
    setToastMessage('Selamat! Materi telah selesai dipelajari.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddFriendSubmit = async (e) => {
    e.preventDefault();
    if (!addFriendInput.trim()) return;
    setFriendSubmitting(true);
    setFriendModalError('');
    try {
      const res = await addFriend(addFriendInput.trim());
      if (res.success) {
        setAddFriendInput('');
        setToastMessage(`Berhasil menambahkan ${res.user.name} sebagai teman!`);
        setTimeout(() => setToastMessage(''), 3000);
      } else {
        setFriendModalError(res.message);
      }
    } catch {
      setFriendModalError('Terjadi kesalahan saat menambahkan teman.');
    } finally {
      setFriendSubmitting(false);
    }
  };

  const handleShareToGroup = (groupId) => {
    if (studyGroupModalBatch) {
      addBatchToGroup(groupId, studyGroupModalBatch);
      setStudyGroupModalBatch(null);
      setToastMessage('Batch materi berhasil dibagikan ke grup!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleInviteFriendToStudyGroup = async (friend) => {
    if (!friend) return { success: false, message: 'Data teman tidak ditemukan' };
    const friendId = friend.userId || friend.id;
    const friendName = friend.name || friend.userName || 'Teman';
    const groupName = currentBatch?.batchName 
      ? `Study: ${currentBatch.batchName}`
      : `Study with ${friendName}`;

    try {
      const res = createGroup(groupName, `Kelompok belajar kolaboratif bersama ${friendName}`, 'slate');
      if (res && res.success && res.group) {
        const newGroupId = res.group.id;
        if (currentBatch && currentBatch.batchId) {
          try {
            addBatchToGroup(newGroupId, currentBatch);
          } catch (e) {
            console.warn('Batch add error:', e);
          }
        }
        inviteFriendToGroup(newGroupId, { userId: friendId, name: friendName });
        setToastMessage(`Berhasil membuat Study Group "${groupName}" dan mengirim ajakan ke ${friendName}!`);
        setTimeout(() => setToastMessage(''), 4000);
        return { success: true, groupId: newGroupId, groupName };
      }
      return { success: false, message: res?.message || 'Gagal membuat grup' };
    } catch (err) {
      console.error('handleInviteFriendToStudyGroup error:', err);
      return { success: false, message: 'Terjadi kesalahan sistem' };
    }
  };

  const currentBatchProgress = useMemo(() => {
    if (!currentBatch) return { completed: 0, total: 0, percentage: 0 };
    return calculateBatchProgress(currentBatch.batchName, currentBatch);
  }, [currentBatch, calculateBatchProgress]);

  const allFlatContents = useMemo(() => {
    if (!currentBatch?.modules) return [];
    return currentBatch.modules.flatMap(m => 
      (m.contents || []).map(c => ({ ...c, moduleId: m.moduleId, moduleTitle: m.moduleTitle }))
    );
  }, [currentBatch]);

  const currentContentIndex = useMemo(() => {
    if (!currentContent) return -1;
    return allFlatContents.findIndex(c => c.contentId === currentContent.contentId);
  }, [allFlatContents, currentContent]);

  const prevContent = currentContentIndex > 0 ? allFlatContents[currentContentIndex - 1] : null;
  const nextContent = currentContentIndex >= 0 && currentContentIndex < allFlatContents.length - 1 
    ? allFlatContents[currentContentIndex + 1] 
    : null;

  return {
    data, manualSync, navigate, mySavedBatches, currentBatch, currentModule, currentContent,
    selectedBatchId, selectedModuleId, selectedContentId, expandedModules, toggleModule,
    handleSelectContent, handleSwitchBatch, isSelectingBatch, setIsSelectingBatch,
    isNotesOpen, setIsNotesOpen, isSidebarCompact, setIsSidebarCompact,
    studyGroupModalBatch, setStudyGroupModalBatch, showFriendModal, setShowFriendModal,
    addFriendInput, setAddFriendInput, friendModalError, friendSubmitting,
    friendSearchFilter, setFriendSearchFilter, friends, removeFriend,
    handleAddFriendSubmit, handleShareToGroup, handleInviteFriendToStudyGroup, groups, toastMessage,
    deletingBatch, setDeletingBatch, handleRemoveBatch, handleConfirmRemoveBatch,
    handleMarkComplete, isContentComplete, hasNote, currentBatchProgress,
    calculateBatchProgress, prevContent, nextContent
  };
}
