import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { ProtectedEducatorRoute } from '../../components/ProtectedEducatorRoute';
import { ContentManagerHeader } from '../../components/educator/manager/ContentManagerHeader';
import { ContentManagerFilters } from '../../components/educator/manager/ContentManagerFilters';
import { BatchManagerCard } from '../../components/educator/manager/BatchManagerCard';
import { BatchManagerGridCard } from '../../components/educator/manager/BatchManagerGridCard';
import { EditBatchModal } from '../../components/educator/manager/EditBatchModal';
import { DeleteConfirmationModals } from '../../components/educator/manager/DeleteConfirmationModals';
import { useEducatorContentManager } from '../../hooks/useEducatorContentManager';
import { AlertCircle } from 'lucide-react';

export function EducatorContentManager() {
  const manager = useEducatorContentManager();
  const {
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    filteredData,
    totalStats,
    expandedBatch,
    toggleBatch,
    expandedModule,
    toggleModule,
    handleEditContent,
    handleDeleteContent,
    handleConfirmDeleteContent,
    deletingId,
    deletingContent,
    setDeletingContent,
    editingBatch,
    setEditingBatch,
    editBatchName,
    setEditBatchName,
    editBatchCategory,
    setEditBatchCategory,
    showEditCategoryModal,
    setShowEditCategoryModal,
    handleOpenEditBatch,
    handleSaveEditBatch,
    isUpdatingBatch,
    editBatchError,
    deletingBatch,
    setDeletingBatch,
    isDeletingBatch,
    deleteBatchError,
    handleDeleteBatch,
    handleConfirmDeleteBatch
  } = manager;

  return (
    <ProtectedEducatorRoute>
      <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-[1520px] mx-auto space-y-6">
              
              {/* Header */}
              <ContentManagerHeader
                totalStats={totalStats}
                viewMode={viewMode}
                setViewMode={setViewMode}
              />

              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-medium">{error}</span>
                </div>
              )}

              {/* Filters & Search */}
              <ContentManagerFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                totalResults={filteredData.length}
              />

              {/* Batch List */}
              {loading ? (
                <div className="py-20 text-center text-slate-400 text-xs">
                  Memuat struktur kurikulum...
                </div>
              ) : filteredData.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
                  <p className="font-bold text-slate-700 text-sm">Tidak ada kurikulum ditemukan</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Coba sesuaikan kata kunci pencarian atau kategori yang dipilih.
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredData.map(batch => (
                    <BatchManagerGridCard
                      key={batch.batchId}
                      batch={batch}
                      handleOpenEditBatch={handleOpenEditBatch}
                      handleDeleteBatch={handleDeleteBatch}
                      handleEditContent={handleEditContent}
                      handleDeleteContent={handleDeleteContent}
                      deletingId={deletingId}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredData.map(batch => (
                    <BatchManagerCard
                      key={batch.batchId}
                      batch={batch}
                      isExpanded={expandedBatch === batch.batchId}
                      toggleBatch={toggleBatch}
                      expandedModule={expandedModule}
                      toggleModule={toggleModule}
                      handleOpenEditBatch={handleOpenEditBatch}
                      handleDeleteBatch={handleDeleteBatch}
                      handleEditContent={handleEditContent}
                      handleDeleteContent={handleDeleteContent}
                      deletingId={deletingId}
                    />
                  ))}
                </div>
              )}

            </div>
          </main>
        </div>

        {/* Modal Edit Batch */}
        <EditBatchModal
          editingBatch={editingBatch}
          onClose={() => setEditingBatch(null)}
          editBatchName={editBatchName}
          setEditBatchName={setEditBatchName}
          editBatchCategory={editBatchCategory}
          setEditBatchCategory={setEditBatchCategory}
          showEditCategoryModal={showEditCategoryModal}
          setShowEditCategoryModal={setShowEditCategoryModal}
          handleSaveEditBatch={handleSaveEditBatch}
          isUpdatingBatch={isUpdatingBatch}
          editBatchError={editBatchError}
        />

        {/* Modals Konfirmasi Hapus */}
        <DeleteConfirmationModals
          deletingContent={deletingContent}
          onCloseDeleteContent={() => setDeletingContent(null)}
          onConfirmDeleteContent={handleConfirmDeleteContent}
          deletingBatch={deletingBatch}
          onCloseDeleteBatch={() => setDeletingBatch(null)}
          onConfirmDeleteBatch={handleConfirmDeleteBatch}
          isDeletingBatch={isDeletingBatch}
          deleteBatchError={deleteBatchError}
        />

      </div>
    </ProtectedEducatorRoute>
  );
}
