import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { AdminAnnouncementsHeader } from '../../components/admin/announcements/AdminAnnouncementsHeader';
import { AdminAnnouncementsList } from '../../components/admin/announcements/AdminAnnouncementsList';
import { AnnouncementFormModal } from '../../components/admin/announcements/AnnouncementFormModal';
import { useAdminAnnouncementsPage } from '../../hooks/useAdminAnnouncementsPage';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export function AdminAnnouncementsPage() {
  const {
    isAdmin,
    allAnnouncements,
    filteredAnnouncements,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formData,
    setFormData,
    searchQuery,
    setSearchQuery,
    successMessage,
    deletingAnn,
    setDeletingAnn,
    openCreateModal,
    openEditModal,
    handleSubmit,
    handleDelete,
    handleConfirmDelete
  } = useAdminAnnouncementsPage();

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
            <AdminAnnouncementsHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalAnnouncements={allAnnouncements.length}
              openCreateModal={openCreateModal}
            />

            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 flex items-center gap-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* List */}
            <AdminAnnouncementsList
              filteredAnnouncements={filteredAnnouncements}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              openEditModal={openEditModal}
              handleDelete={handleDelete}
            />

          </div>
        </main>
      </div>

      {/* Create / Edit Modal */}
      <AnnouncementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalMode={modalMode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingAnn)}
        onClose={() => setDeletingAnn(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Pengumuman"
        message={`Apakah Anda yakin ingin menghapus pengumuman "${deletingAnn?.title}"?\n\nPengumuman ini tidak akan lagi tampil di dashboard pengguna.`}
        confirmText="Ya, Hapus Pengumuman"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
}
