import { useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { TopNav } from '../../components/TopNav';
import { MaterialNotesPanel } from '../../components/learning/MaterialNotesPanel';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { StudyRoomSidebar } from '../../components/learning/study-room/StudyRoomSidebar';
import { StudyRoomContentHeader } from '../../components/learning/study-room/StudyRoomContentHeader';
import { StudyRoomArticleView } from '../../components/learning/study-room/StudyRoomArticleView';
import { StudyRoomBatchSelectModal } from '../../components/learning/study-room/StudyRoomBatchSelectModal';
import { StudyRoomFriendModal } from '../../components/learning/study-room/StudyRoomFriendModal';
import { StudyRoomGroupShareModal } from '../../components/learning/study-room/StudyRoomGroupShareModal';
import { useStudyRoom } from '../../hooks/useStudyRoom';
import { Link } from 'react-router-dom';
import { Compass, BookOpen } from 'lucide-react';

export function StudyRoomPage() {
  const {
    mySavedBatches,
    currentBatch,
    currentModule,
    currentContent,
    selectedBatchId,
    selectedModuleId,
    selectedContentId,
    expandedModules,
    toggleModule,
    handleSelectContent,
    handleSwitchBatch,
    isSelectingBatch,
    setIsSelectingBatch,
    isNotesOpen,
    setIsNotesOpen,
    isSidebarCompact,
    setIsSidebarCompact,
    studyGroupModalBatch,
    setStudyGroupModalBatch,
    showFriendModal,
    setShowFriendModal,
    addFriendInput,
    setAddFriendInput,
    friendModalError,
    friendSubmitting,
    friendSearchFilter,
    setFriendSearchFilter,
    friends,
    removeFriend,
    handleAddFriendSubmit,
    handleShareToGroup,
    handleInviteFriendToStudyGroup,
    groups,
    toastMessage,
    deletingBatch,
    setDeletingBatch,
    handleRemoveBatch,
    handleConfirmRemoveBatch,
    handleMarkComplete,
    isContentComplete,
    hasNote,
    currentBatchProgress,
    calculateBatchProgress,
    prevContent,
    nextContent
  } = useStudyRoom();

  const [isSyllabusDrawerOpen, setIsSyllabusDrawerOpen] = useState(false);

  const isCompleted = currentBatch && currentContent 
    ? isContentComplete(currentBatch.batchName, currentContent.contentId) 
    : false;

  const onSelectContentResponsive = (batchId, moduleId, contentId) => {
    handleSelectContent(batchId, moduleId, contentId);
    setIsSyllabusDrawerOpen(false);
  };

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

        {mySavedBatches.length === 0 ? (
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center max-w-md p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Belum Ada Materi di Ruang Belajar</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih materi pembelajaran dari halaman eksplorasi dan simpan ke ruang belajar Anda.
                </p>
              </div>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Compass className="w-4 h-4" />
                <span>Jelajahi Materi Sekarang</span>
              </Link>
            </div>
          </main>
        ) : (
          <div className="flex-1 flex overflow-hidden relative">
            {/* 1. Kurikulum Sidebar Desktop */}
            <div className="hidden lg:flex shrink-0">
              <StudyRoomSidebar
                mySavedBatches={mySavedBatches}
                currentBatch={currentBatch}
                selectedBatchId={selectedBatchId}
                handleSwitchBatch={handleSwitchBatch}
                selectedModuleId={selectedModuleId}
                selectedContentId={selectedContentId}
                expandedModules={expandedModules}
                toggleModule={toggleModule}
                handleSelectContent={handleSelectContent}
                isContentComplete={isContentComplete}
                hasNote={hasNote}
                isSidebarCompact={isSidebarCompact}
                setIsSidebarCompact={setIsSidebarCompact}
                calculateBatchProgress={calculateBatchProgress}
              />
            </div>

            {/* Kurikulum Sidebar Drawer Mobile & Tablet (< 1024px) */}
            {isSyllabusDrawerOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                <div
                  onClick={() => setIsSyllabusDrawerOpen(false)}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                />
                <div className="relative z-10 w-80 max-w-[85vw] h-full bg-white shadow-2xl animate-in slide-in-from-left duration-250 flex flex-col">
                  <StudyRoomSidebar
                    mySavedBatches={mySavedBatches}
                    currentBatch={currentBatch}
                    selectedBatchId={selectedBatchId}
                    handleSwitchBatch={handleSwitchBatch}
                    selectedModuleId={selectedModuleId}
                    selectedContentId={selectedContentId}
                    expandedModules={expandedModules}
                    toggleModule={toggleModule}
                    handleSelectContent={onSelectContentResponsive}
                    isContentComplete={isContentComplete}
                    hasNote={hasNote}
                    isSidebarCompact={false}
                    setIsSidebarCompact={() => setIsSyllabusDrawerOpen(false)}
                    calculateBatchProgress={calculateBatchProgress}
                  />
                </div>
              </div>
            )}

            {/* 2. Main Article Content Area */}
            <main className="flex-1 overflow-y-auto flex flex-col min-w-0">
              <StudyRoomContentHeader
                currentBatch={currentBatch}
                currentModule={currentModule}
                currentContent={currentContent}
                isNotesOpen={isNotesOpen}
                setIsNotesOpen={setIsNotesOpen}
                setShowFriendModal={setShowFriendModal}
                setStudyGroupModalBatch={setStudyGroupModalBatch}
                setIsSelectingBatch={setIsSelectingBatch}
                handleMarkComplete={handleMarkComplete}
                isCompleted={isCompleted}
                onToggleSyllabus={() => setIsSyllabusDrawerOpen(prev => !prev)}
                isSyllabusOpen={isSyllabusDrawerOpen}
              />

              <div className="p-3 sm:p-6 lg:p-8 flex-1">
                <StudyRoomArticleView
                  currentBatch={currentBatch}
                  currentContent={currentContent}
                  prevContent={prevContent}
                  nextContent={nextContent}
                  handleSelectContent={handleSelectContent}
                  handleMarkComplete={handleMarkComplete}
                  isCompleted={isCompleted}
                />
              </div>
            </main>

            {/* 3. Sliding Notes Panel (Desktop Inline, Mobile/Tablet Drawer) */}
            {isNotesOpen && currentContent && (
              <>
                {/* Desktop view */}
                <div className="hidden lg:flex shrink-0 p-3.5 pl-0">
                  <MaterialNotesPanel
                    contentId={currentContent.contentId}
                    contentTitle={currentContent.title}
                    isOpen={isNotesOpen}
                    onClose={() => setIsNotesOpen(false)}
                  />
                </div>

                {/* Mobile / Tablet Drawer */}
                <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
                  <div
                    onClick={() => setIsNotesOpen(false)}
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                  />
                  <div className="relative z-10 w-full sm:w-96 max-w-[90vw] h-full bg-white shadow-2xl animate-in slide-in-from-right duration-250 flex flex-col">
                    <MaterialNotesPanel
                      contentId={currentContent.contentId}
                      contentTitle={currentContent.title}
                      isOpen={isNotesOpen}
                      onClose={() => setIsNotesOpen(false)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <StudyRoomBatchSelectModal
        isOpen={isSelectingBatch}
        onClose={() => setIsSelectingBatch(false)}
        mySavedBatches={mySavedBatches}
        selectedBatchId={selectedBatchId}
        handleSwitchBatch={handleSwitchBatch}
        handleRemoveBatch={handleRemoveBatch}
      />

      <StudyRoomFriendModal
        isOpen={showFriendModal}
        onClose={() => setShowFriendModal(false)}
        friends={friends}
        currentBatch={currentBatch}
        addFriendInput={addFriendInput}
        setAddFriendInput={setAddFriendInput}
        friendModalError={friendModalError}
        friendSubmitting={friendSubmitting}
        handleAddFriendSubmit={handleAddFriendSubmit}
        handleInviteFriendToStudyGroup={handleInviteFriendToStudyGroup}
        friendSearchFilter={friendSearchFilter}
        setFriendSearchFilter={setFriendSearchFilter}
        removeFriend={removeFriend}
      />

      <StudyRoomGroupShareModal
        studyGroupModalBatch={studyGroupModalBatch}
        onClose={() => setStudyGroupModalBatch(null)}
        groups={groups}
        handleShareToGroup={handleShareToGroup}
      />

      <ConfirmModal
        isOpen={Boolean(deletingBatch)}
        onClose={() => setDeletingBatch(null)}
        onConfirm={handleConfirmRemoveBatch}
        title="Hapus dari Ruang Belajar?"
        message={`Apakah Anda yakin ingin menghapus kelas "${deletingBatch?.batchName}" dari Ruang Belajar Anda? Progres belajar akan tetap tersimpan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
}
