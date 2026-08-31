import { useState } from 'react';
import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { StudyGroupSidebar } from '../../components/social/group/StudyGroupSidebar';
import { StudyGroupHeader } from '../../components/social/group/StudyGroupHeader';
import { StudyGroupMaterialsView } from '../../components/social/group/StudyGroupMaterialsView';
import { StudyGroupDiscussionView } from '../../components/social/group/StudyGroupDiscussionView';
import { StudyGroupModalsContainer } from '../../components/social/group/StudyGroupModalsContainer';
import { useStudyGroupPage } from '../../hooks/useStudyGroupPage';
import { Users, Plus } from 'lucide-react';

export function StudyGroupPage() {
  const [isGroupSidebarOpen, setIsGroupSidebarOpen] = useState(true);
  const groupPage = useStudyGroupPage();
  const {
    groups,
    filteredGroups,
    activeGroupId,
    setActiveGroupId,
    activeGroup,
    activeGroupMaterials,
    activeGroupMessages,
    currentUserId,
    allBatchesData,
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
    editGroupName,
    setEditGroupName,
    editGroupDesc,
    setEditGroupDesc,
    joinIdInput,
    setJoinIdInput,
    friendSearchQuery,
    setFriendSearchQuery,
    customInviteIdInput,
    setCustomInviteIdInput,
    modalError,
    toastMessage,
    selectedBatchId,
    selectedModuleId,
    selectedContentId,
    expandedModules,
    toggleModule,
    currentBatch,
    currentContent,
    handleSelectContent,
    isOwner,
    messagesEndRef,
    messageInputRef,
    handleCreateGroupSubmit,
    handleJoinGroupSubmit,
    handleEditGroupSubmit,
    handleOpenEditModal,
    handleSendMessage,
    handleStartEditMsg,
    addBatchToGroup,
    removeBatchFromGroup,
    inviteFriendToGroup,
    deleteGroupMessage,
    deleteOrLeaveGroup
  } = groupPage;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />

        {toastMessage && (
          <div className="bg-slate-900 text-white px-4 py-2 text-xs font-semibold text-center animate-in slide-in-from-top duration-200">
            {toastMessage}
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Daftar Grup */}
          <StudyGroupSidebar
            groups={groups}
            filteredGroups={filteredGroups}
            activeGroupId={activeGroupId}
            setActiveGroupId={setActiveGroupId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setShowCreateModal={setShowCreateModal}
            setShowJoinModal={setShowJoinModal}
            isOpen={isGroupSidebarOpen}
            onClose={() => setIsGroupSidebarOpen(false)}
          />

          {/* Area Aktif Grup */}
          {!activeGroup ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3 bg-slate-50/50">
              <div className="w-14 h-14 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Pilih atau Buat Grup Belajar</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Belajar bersama teman, diskusikan kurikulum, dan bagikan materi pembelajaran secara kolaboratif.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Grup Pertama</span>
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
              
              {/* Header Grup */}
              <StudyGroupHeader
                activeGroup={activeGroup}
                isOwner={isOwner}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setShowInviteModal={setShowInviteModal}
                setShowMembersModal={setShowMembersModal}
                handleOpenEditModal={handleOpenEditModal}
                setShowDeleteModal={setShowDeleteModal}
                copiedGroupId={groupPage.copiedGroupId}
                setCopiedGroupId={groupPage.setCopiedGroupId}
                isGroupSidebarOpen={isGroupSidebarOpen}
                setIsGroupSidebarOpen={setIsGroupSidebarOpen}
              />

              {/* Konten Tab: Materi atau Forum Diskusi */}
              {activeTab === 'materials' ? (
                <StudyGroupMaterialsView
                  activeGroupMaterials={activeGroupMaterials}
                  setShowAddMaterialModal={setShowAddMaterialModal}
                  selectedBatchId={selectedBatchId}
                  selectedModuleId={selectedModuleId}
                  selectedContentId={selectedContentId}
                  expandedModules={expandedModules}
                  toggleModule={toggleModule}
                  handleSelectContent={handleSelectContent}
                  currentBatch={currentBatch}
                  currentContent={currentContent}
                  removeBatchFromGroup={removeBatchFromGroup}
                  activeGroupMessages={activeGroupMessages}
                  currentUserId={currentUserId}
                  messagesEndRef={messagesEndRef}
                  messageInputRef={messageInputRef}
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  handleSendMessage={handleSendMessage}
                  editingMsg={editingMsg}
                  setEditingMsg={setEditingMsg}
                  handleStartEditMsg={handleStartEditMsg}
                  deleteGroupMessage={deleteGroupMessage}
                  activeGroupId={activeGroupId}
                />
              ) : (
                <StudyGroupDiscussionView
                  activeGroupMessages={activeGroupMessages}
                  currentUserId={currentUserId}
                  messagesEndRef={messagesEndRef}
                  messageInputRef={messageInputRef}
                  inputMessage={inputMessage}
                  setInputMessage={setInputMessage}
                  handleSendMessage={handleSendMessage}
                  editingMsg={editingMsg}
                  setEditingMsg={setEditingMsg}
                  handleStartEditMsg={handleStartEditMsg}
                  deleteGroupMessage={deleteGroupMessage}
                  activeGroupId={activeGroupId}
                />
              )}

            </div>
          )}

        </div>
      </div>

      {/* Semua Modals Terisolasi */}
      <StudyGroupModalsContainer
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        newGroupDesc={newGroupDesc}
        setNewGroupDesc={setNewGroupDesc}
        newGroupColor={groupPage.newGroupColor}
        setNewGroupColor={groupPage.setNewGroupColor}
        handleCreateGroupSubmit={handleCreateGroupSubmit}
        showJoinModal={showJoinModal}
        setShowJoinModal={setShowJoinModal}
        joinIdInput={joinIdInput}
        setJoinIdInput={setJoinIdInput}
        modalError={modalError}
        handleJoinGroupSubmit={handleJoinGroupSubmit}
        showAddMaterialModal={showAddMaterialModal}
        setShowAddMaterialModal={setShowAddMaterialModal}
        savedBatches={groupPage.mySavedBatches}
        activeGroupMaterials={activeGroupMaterials}
        addBatchToGroup={addBatchToGroup}
        activeGroupId={activeGroupId}
        showInviteModal={showInviteModal}
        setShowInviteModal={setShowInviteModal}
        activeGroup={activeGroup}
        friends={friends}
        inviteFriendToGroup={inviteFriendToGroup}
        showMembersModal={showMembersModal}
        setShowMembersModal={setShowMembersModal}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editGroupName={editGroupName}
        setEditGroupName={setEditGroupName}
        editGroupDesc={editGroupDesc}
        setEditGroupDesc={setEditGroupDesc}
        editGroupColor={groupPage.editGroupColor}
        setEditGroupColor={groupPage.setEditGroupColor}
        handleEditGroupSubmit={handleEditGroupSubmit}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        isOwner={isOwner}
        currentUserId={currentUserId}
        removeMemberFromGroup={groupPage.removeMemberFromGroup}
        deleteOrLeaveGroup={deleteOrLeaveGroup}
      />
    </div>
  );
}
