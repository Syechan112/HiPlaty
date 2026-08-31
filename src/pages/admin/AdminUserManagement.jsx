import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { AdminUsersHeader } from '../../components/admin/users/AdminUsersHeader';
import { AdminUsersTable } from '../../components/admin/users/AdminUsersTable';
import { UserFormModal } from '../../components/admin/users/UserFormModal';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

export function AdminUserManagement() {
  const {
    isAdmin,
    users,
    fetching,
    actionLoading,
    error,
    successMessage,
    searchQuery,
    handleSearchChange,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedUsers,
    filteredUsers,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formData,
    setFormData,
    deletingUser,
    setDeletingUser,
    fetchUsers,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleSubmit,
    handleConfirmDelete
  } = useAdminUsers();

  if (!isAdmin) {
    return (
      <div className="flex h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 max-w-md shadow-xs space-y-3">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <h1 className="text-lg font-bold text-slate-900">Akses Terbatas</h1>
              <p className="text-xs text-slate-500">Halaman ini hanya dapat diakses oleh Administrator.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[1520px] mx-auto space-y-6">
            
            {/* Header */}
            <AdminUsersHeader
              totalUsers={users.length}
              fetching={fetching}
              fetchUsers={fetchUsers}
              handleOpenCreateModal={handleOpenCreateModal}
            />

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 flex items-center gap-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Table */}
            <AdminUsersTable
              filteredUsers={filteredUsers}
              paginatedUsers={paginatedUsers}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              pageSize={10}
              fetching={fetching}
              handleOpenEditModal={handleOpenEditModal}
              setDeletingUser={setDeletingUser}
            />

          </div>
        </main>
      </div>

      {/* Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        actionLoading={actionLoading}
        error={error}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
        title="Hapus Akun Pengguna"
        message={`Apakah Anda yakin ingin menghapus akun "${deletingUser?.name}" (${deletingUser?.email})?\n\nTindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus Akun"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
}