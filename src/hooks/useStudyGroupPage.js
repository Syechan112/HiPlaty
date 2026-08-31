import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStudyGroup } from './useStudyGroup';
import { useLmsSync } from './useLmsSync';
import { useLmsProgress } from './useLmsProgress';
import { useChat } from './useChat';
import { useAuth } from './useAuth';
import { useSavedMaterials } from './useSavedMaterials';

export function useStudyGroupPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: allBatchesData, manualSync } = useLmsSync();
  const { isContentComplete, markContentComplete } = useLmsProgress();
  const { friends, addFriend } = useChat();
  const { getSavedBatches } = useSavedMaterials();

  const mySavedBatches = useMemo(() => getSavedBatches(allBatchesData), [getSavedBatches, allBatchesData]);

  const {
    currentUserId,
    currentUserName,
    groups,
    activeGroupId,
    setActiveGroupId,
    activeGroup,
    activeGroupMaterials,
    activeGroupMessages,
    createGroup,
    updateGroup,
    joinGroupById,
    inviteFriendToGroup,
    removeMemberFromGroup,
    deleteOrLeaveGroup,
    addBatchToGroup,
    removeBatchFromGroup,
    sendGroupMessage,
    deleteGroupMessage,
    editGroupMessage,
    groupColors
  } = useStudyGroup();

  const [activeTab, setActiveTab] = useState('materials');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [editingMsg, setEditingMsg] = useState(null);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form states
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('slate');

  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupDesc, setEditGroupDesc] = useState('');
  const [editGroupColor, setEditGroupColor] = useState('slate');

  const [joinIdInput, setJoinIdInput] = useState('');
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [customInviteIdInput, setCustomInviteIdInput] = useState('');
  const [copiedInviteText, setCopiedInviteText] = useState(false);
  const [modalError, setModalError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Selected Material within active group
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedContentId, setSelectedContentId] = useState('');
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedGroupCards, setExpandedGroupCards] = useState({});
  const [copiedGroupId, setCopiedGroupId] = useState(false);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    const gId = searchParams.get('groupId');
    if (gId && groups.some(g => g.id === gId)) {
      setActiveGroupId(gId);
    }
  }, [searchParams, groups, setActiveGroupId]);

  useEffect(() => {
    if (activeGroupMaterials.length > 0) {
      const activeBatch = activeGroupMaterials.find(b => b.batchId === selectedBatchId) || activeGroupMaterials[0];
      const bId = activeBatch.batchId;
      const firstModule = activeBatch.modules?.[0];
      const mId = selectedModuleId && activeBatch.modules?.some(m => m.moduleId === selectedModuleId)
        ? selectedModuleId
        : firstModule?.moduleId || '';
      const activeModule = activeBatch.modules?.find(m => m.moduleId === mId) || firstModule;
      const firstContent = activeModule?.contents?.[0];
      const cId = selectedContentId && activeModule?.contents?.some(c => c.contentId === selectedContentId)
        ? selectedContentId
        : firstContent?.contentId || '';

      setSelectedBatchId(bId);
      setSelectedModuleId(mId);
      setSelectedContentId(cId);

      if (mId) {
        setExpandedModules(prev => ({ ...prev, [mId]: true }));
      }
    }
  }, [activeGroupMaterials]);

  const currentBatch = useMemo(() => {
    return activeGroupMaterials.find(b => b.batchId === selectedBatchId) || activeGroupMaterials[0] || null;
  }, [activeGroupMaterials, selectedBatchId]);

  const currentModule = useMemo(() => {
    if (!currentBatch) return null;
    return currentBatch.modules?.find(m => m.moduleId === selectedModuleId) || currentBatch.modules?.[0] || null;
  }, [currentBatch, selectedModuleId]);

  const currentContent = useMemo(() => {
    if (!currentModule) return null;
    return currentModule.contents?.find(c => c.contentId === selectedContentId) || currentModule.contents?.[0] || null;
  }, [currentModule, selectedContentId]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const handleSelectContent = (batchId, moduleId, contentId) => {
    setSelectedBatchId(batchId);
    setSelectedModuleId(moduleId);
    setSelectedContentId(contentId);
  };

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const q = searchQuery.toLowerCase();
    return groups.filter(g => 
      g.name?.toLowerCase().includes(q) || 
      g.description?.toLowerCase().includes(q)
    );
  }, [groups, searchQuery]);

  const isOwner = Boolean(
    activeGroup && (
      String(activeGroup.ownerId || '').toLowerCase() === String(currentUserId).toLowerCase() ||
      String(activeGroup.createdBy || '').toLowerCase() === String(currentUserId).toLowerCase() ||
      activeGroup.members?.some(
        m => String(m.userId).toLowerCase() === String(currentUserId).toLowerCase() && m.role === 'owner'
      )
    )
  );

  const handleCreateGroupSubmit = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const created = createGroup(
      newGroupName.trim(),
      newGroupDesc.trim(),
      newGroupColor
    );
    setNewGroupName('');
    setNewGroupDesc('');
    setNewGroupColor('slate');
    setShowCreateModal(false);
    if (created?.group?.id || created?.id) {
      setActiveGroupId(created?.group?.id || created?.id);
    }
    setToastMessage(`Grup "${newGroupName.trim()}" berhasil dibuat!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleJoinGroupSubmit = (e) => {
    e.preventDefault();
    if (!joinIdInput.trim()) return;
    const res = joinGroupById(joinIdInput.trim());
    if (res.success) {
      setJoinIdInput('');
      setShowJoinModal(false);
      setModalError('');
      setToastMessage('Berhasil bergabung ke grup belajar!');
      setTimeout(() => setToastMessage(''), 3000);
    } else {
      setModalError(res.message);
    }
  };

  const handleEditGroupSubmit = (e) => {
    e.preventDefault();
    if (!editGroupName.trim() || !activeGroup) return;
    updateGroup(activeGroup.id, {
      name: editGroupName.trim(),
      description: editGroupDesc.trim(),
      color: editGroupColor
    });
    setShowEditModal(false);
    setToastMessage('Detail grup berhasil diperbarui.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenEditModal = () => {
    if (!activeGroup) return;
    setEditGroupName(activeGroup.name || '');
    setEditGroupDesc(activeGroup.description || '');
    setEditGroupColor(activeGroup.color || 'slate');
    setShowEditModal(true);
  };

  const handleSendMessage = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const text = inputMessage.trim();
    const targetGroupId = activeGroupId || activeGroup?.id;
    if (!text || !targetGroupId) return;

    if (editingMsg) {
      editGroupMessage(targetGroupId, editingMsg.messageId || editingMsg.id, text);
      setEditingMsg(null);
      setInputMessage('');
      return;
    }

    sendGroupMessage(targetGroupId, text);
    setInputMessage('');

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleStartEditMsg = (msg) => {
    setEditingMsg(msg);
    setInputMessage(msg.messageText || msg.text || '');
    messageInputRef.current?.focus();
  };

  return {
    auth,
    navigate,
    currentUserId,
    currentUserName,
    groups,
    activeGroupId,
    setActiveGroupId,
    activeGroup,
    activeGroupMaterials,
    activeGroupMessages,
    createGroup,
    updateGroup,
    joinGroupById,
    inviteFriendToGroup,
    removeMemberFromGroup,
    deleteOrLeaveGroup,
    addBatchToGroup,
    removeBatchFromGroup,
    sendGroupMessage,
    deleteGroupMessage,
    editGroupMessage,
    groupColors,
    allBatchesData,
    mySavedBatches,
    friends,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    inputMessage,
    setInputMessage,
    editingMsg,
    setEditingMsg,
    showCreateModal,
    setShowCreateModal,
    showJoinModal,
    setShowJoinModal,
    showAddMaterialModal,
    setShowAddMaterialModal,
    showDeleteModal,
    setShowDeleteModal,
    showMembersModal,
    setShowMembersModal,
    showInviteModal,
    setShowInviteModal,
    showEditModal,
    setShowEditModal,
    newGroupName,
    setNewGroupName,
    newGroupDesc,
    setNewGroupDesc,
    newGroupColor,
    setNewGroupColor,
    editGroupName,
    setEditGroupName,
    editGroupDesc,
    setEditGroupDesc,
    editGroupColor,
    setEditGroupColor,
    joinIdInput,
    setJoinIdInput,
    friendSearchQuery,
    setFriendSearchQuery,
    customInviteIdInput,
    setCustomInviteIdInput,
    copiedInviteText,
    setCopiedInviteText,
    modalError,
    setModalError,
    toastMessage,
    selectedBatchId,
    setSelectedBatchId,
    selectedModuleId,
    setSelectedModuleId,
    selectedContentId,
    setSelectedContentId,
    expandedModules,
    toggleModule,
    currentBatch,
    currentModule,
    currentContent,
    handleSelectContent,
    filteredGroups,
    isOwner,
    messagesEndRef,
    messageInputRef,
    handleCreateGroupSubmit,
    handleJoinGroupSubmit,
    handleEditGroupSubmit,
    handleOpenEditModal,
    handleSendMessage,
    handleStartEditMsg
  };
}
