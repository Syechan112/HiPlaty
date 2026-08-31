import { ConfirmModal } from '../../common/ConfirmModal';
import { StudyGroupCreateModal } from './modals/StudyGroupCreateModal';
import { StudyGroupJoinModal } from './modals/StudyGroupJoinModal';
import { StudyGroupAddMaterialModal } from './modals/StudyGroupAddMaterialModal';
import { StudyGroupInviteModal } from './modals/StudyGroupInviteModal';
import { StudyGroupMembersModal } from './modals/StudyGroupMembersModal';
import { StudyGroupEditModal } from './modals/StudyGroupEditModal';

export function StudyGroupModalsContainer({
  showCreateModal,
  setShowCreateModal,
  newGroupName,
  setNewGroupName,
  newGroupDesc,
  setNewGroupDesc,
  newGroupColor,
  setNewGroupColor,
  handleCreateGroupSubmit,
  showJoinModal,
  setShowJoinModal,
  joinIdInput,
  setJoinIdInput,
  modalError,
  handleJoinGroupSubmit,
  showAddMaterialModal,
  setShowAddMaterialModal,
  savedBatches,
  activeGroupMaterials,
  addBatchToGroup,
  activeGroupId,
  showInviteModal,
  setShowInviteModal,
  activeGroup,
  friends,
  inviteFriendToGroup,
  showMembersModal,
  setShowMembersModal,
  showEditModal,
  setShowEditModal,
  editGroupName,
  setEditGroupName,
  editGroupDesc,
  setEditGroupDesc,
  editGroupColor,
  setEditGroupColor,
  handleEditGroupSubmit,
  showDeleteModal,
  setShowDeleteModal,
  isOwner,
  currentUserId,
  removeMemberFromGroup,
  deleteOrLeaveGroup
}) {
  return (
    <>
      {/* 1. Create Group Modal */}
      <StudyGroupCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        newGroupDesc={newGroupDesc}
        setNewGroupDesc={setNewGroupDesc}
        newGroupColor={newGroupColor}
        setNewGroupColor={setNewGroupColor}
        handleCreateGroupSubmit={handleCreateGroupSubmit}
      />

      {/* 2. Join Group Modal */}
      <StudyGroupJoinModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        joinIdInput={joinIdInput}
        setJoinIdInput={setJoinIdInput}
        modalError={modalError}
        handleJoinGroupSubmit={handleJoinGroupSubmit}
      />

      {/* 3. Add Material Modal */}
      <StudyGroupAddMaterialModal
        isOpen={showAddMaterialModal}
        onClose={() => setShowAddMaterialModal(false)}
        savedBatches={savedBatches}
        activeGroupMaterials={activeGroupMaterials}
        addBatchToGroup={addBatchToGroup}
        activeGroupId={activeGroupId}
      />

      {/* 4. Invite Modal */}
      <StudyGroupInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        activeGroup={activeGroup}
        friends={friends}
        inviteFriendToGroup={inviteFriendToGroup}
      />

      {/* 5. Members Modal (Paginated with 5 items per page & owner management) */}
      <StudyGroupMembersModal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        activeGroup={activeGroup}
        isOwner={isOwner}
        currentUserId={currentUserId}
        removeMemberFromGroup={removeMemberFromGroup}
      />

      {/* 6. Edit Detail & Color Modal (Available for all members) */}
      <StudyGroupEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        activeGroup={activeGroup}
        editGroupName={editGroupName}
        setEditGroupName={setEditGroupName}
        editGroupDesc={editGroupDesc}
        setEditGroupDesc={setEditGroupDesc}
        editGroupColor={editGroupColor}
        setEditGroupColor={setEditGroupColor}
        handleEditGroupSubmit={handleEditGroupSubmit}
      />

      {/* 7. Delete / Leave Confirm Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          deleteOrLeaveGroup(activeGroupId);
          setShowDeleteModal(false);
        }}
        title={isOwner ? "Hapus Grup Belajar?" : "Keluar dari Grup?"}
        message={
          isOwner
            ? `Apakah Anda yakin ingin menghapus grup "${activeGroup?.name}" beserta seluruh materi dan forum diskusinya? Tindakan ini tidak dapat dibatalkan.`
            : `Apakah Anda yakin ingin keluar dari grup "${activeGroup?.name}"?`
        }
        confirmText={isOwner ? "Ya, Hapus Grup" : "Ya, Keluar"}
        cancelText="Batal"
        type="danger"
      />
    </>
  );
}
