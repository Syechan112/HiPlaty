import { useState, useMemo } from 'react';
import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { ForumHeader } from '../../components/forum/ForumHeader';
import { ForumTagsFilter } from '../../components/forum/ForumTagsFilter';
import { ForumThreadCard } from '../../components/forum/ForumThreadCard';
import { ForumCreateModal } from '../../components/forum/ForumCreateModal';
import { ForumThreadDetailModal } from '../../components/forum/ForumThreadDetailModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useForum } from '../../hooks/useForum';
import { MessagesSquare, Plus, Sparkles } from 'lucide-react';

export function ForumPage() {
  const {
    threads,
    allCount,
    threadsCountByTag,
    activeUserId,
    activeUserRole,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    activeDetailThread,
    setActiveDetailThreadId,
    showCreateModal,
    setShowCreateModal,
    createThread,
    toggleLike,
    addReply,
    deleteThread
  } = useForum();

  const [threadToDeleteId, setThreadToDeleteId] = useState(null);

  const handleConfirmDelete = () => {
    if (threadToDeleteId) {
      deleteThread(threadToDeleteId);
      setThreadToDeleteId(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Forum Header & Search */}
          <ForumHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            setShowCreateModal={setShowCreateModal}
            totalThreads={allCount}
          />

          {/* Main Content Feed */}
          <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Tag Tabs Filter */}
            <ForumTagsFilter
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              threadsCountByTag={threadsCountByTag}
            />

            {/* Threads List */}
            {threads.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <MessagesSquare className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Belum Ada Diskusi</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {searchQuery.trim() 
                    ? 'Tidak ada diskusi yang cocok dengan kata kunci pencarian Anda.' 
                    : 'Jadilah yang pertama memulai topik diskusi terbuka dalam 24 jam ke depan.'}
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Buat Diskusi Baru</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {threads.map(thread => (
                  <ForumThreadCard
                    key={thread.threadId}
                    thread={thread}
                    currentUserId={activeUserId}
                    userRole={activeUserRole}
                    onLike={toggleLike}
                    onOpenDetail={(id) => setActiveDetailThreadId(id)}
                    onDelete={(id) => setThreadToDeleteId(id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal Buat Diskusi Baru */}
      <ForumCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateThread={createThread}
      />

      {/* Modal Detail & Komentar Diskusi */}
      <ForumThreadDetailModal
        thread={activeDetailThread}
        isOpen={Boolean(activeDetailThread)}
        onClose={() => setActiveDetailThreadId(null)}
        currentUserId={activeUserId}
        onLike={toggleLike}
        onAddReply={addReply}
      />

      {/* Modal Konfirmasi Hapus Diskusi */}
      <ConfirmModal
        isOpen={Boolean(threadToDeleteId)}
        onClose={() => setThreadToDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Diskusi Forum?"
        message="Apakah Anda yakin ingin menghapus topik diskusi ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
}
