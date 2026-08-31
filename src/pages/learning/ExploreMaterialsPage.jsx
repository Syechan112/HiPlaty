import { Sidebar } from '../../components/Sidebar';
import { TopNav } from '../../components/TopNav';
import { ExploreHeader } from '../../components/learning/explore/ExploreHeader';
import { ExploreFilters } from '../../components/learning/explore/ExploreFilters';
import { BatchExploreCard } from '../../components/learning/explore/BatchExploreCard';
import { LessonPreviewModal } from '../../components/learning/explore/LessonPreviewModal';
import { SavedStudentsModal } from '../../components/learning/explore/SavedStudentsModal';
import { ShareGroupModal } from '../../components/learning/explore/ShareGroupModal';
import { useExploreMaterials } from '../../hooks/useExploreMaterials';
import { AlertCircle } from 'lucide-react';

export function ExploreMaterialsPage() {
  const {
    loading,
    error,
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
  } = useExploreMaterials();

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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[1520px] mx-auto space-y-6">
            
            {/* Header */}
            <ExploreHeader
              savedBatchCount={savedBatchCount}
              totalLessonsCount={totalLessonsCount}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-medium">{error}</span>
              </div>
            )}

            {/* Filters and View mode */}
            <ExploreFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              viewMode={viewMode}
              setViewMode={setViewMode}
              savedBatchCount={savedBatchCount}
              totalResults={filteredBatches.length}
            />

            {/* Batches Grid / List */}
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-xs font-medium">
                Memuat materi pembelajaran...
              </div>
            ) : filteredBatches.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-2">
                <p className="font-bold text-slate-700 text-sm">Tidak ada materi ditemukan</p>
                <p className="text-slate-400 text-xs">
                  Coba sesuaikan kata kunci pencarian atau filter kategori yang dipilih.
                </p>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredBatches.map(batch => (
                  <BatchExploreCard
                    key={batch.batchId}
                    batch={batch}
                    viewMode={viewMode}
                    isSyllabusExpanded={Boolean(expandedSyllabus[batch.batchId])}
                    toggleSyllabus={toggleSyllabusCard}
                    handleToggleBatchSave={handleToggleBatchSave}
                    setSelectedPreviewContent={setSelectedPreviewContent}
                    setSelectedPreviewBatch={setSelectedPreviewBatch}
                    setSelectedUsersListBatch={setSelectedUsersListBatch}
                    setStudyGroupModalBatch={setStudyGroupModalBatch}
                  />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Modals */}
      <LessonPreviewModal
        selectedPreviewBatch={selectedPreviewBatch}
        selectedPreviewContent={selectedPreviewContent}
        onClose={() => {
          setSelectedPreviewContent(null);
          setSelectedPreviewBatch(null);
        }}
        handleToggleBatchSave={handleToggleBatchSave}
      />

      <SavedStudentsModal
        selectedUsersListBatch={selectedUsersListBatch}
        onClose={() => setSelectedUsersListBatch(null)}
        getBatchSavedUsers={getBatchSavedUsers}
      />

      <ShareGroupModal
        studyGroupModalBatch={studyGroupModalBatch}
        onClose={() => setStudyGroupModalBatch(null)}
        groups={groups}
        handleShareToGroup={handleShareToGroup}
      />
    </div>
  );
}
