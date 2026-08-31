import { useState } from 'react';
import { 
  FolderPlus, 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  MessageSquare, 
  Trash2, 
  Send, 
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { ConfirmModal } from '../../common/ConfirmModal';

export function StudyGroupMaterialsView({
  activeGroupMaterials = [],
  setShowAddMaterialModal,
  selectedBatchId,
  selectedModuleId,
  selectedContentId,
  expandedModules,
  toggleModule,
  handleSelectContent,
  currentBatch,
  currentContent,
  removeBatchFromGroup,
  activeGroupMessages = [],
  currentUserId,
  messagesEndRef,
  messageInputRef,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  activeGroupId
}) {
  const [sidebarTab, setSidebarTab] = useState('syllabus');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [collapsedBatches, setCollapsedBatches] = useState({});
  const [batchToRemove, setBatchToRemove] = useState(null);

  const handleMaterialScroll = (e) => {
    setIsScrolled(e.currentTarget.scrollTop > 30);
  };

  const toggleBatchCollapse = (batchId) => {
    setCollapsedBatches(prev => ({
      ...prev,
      [batchId]: !prev[batchId]
    }));
  };

  const collapseAllBatches = () => {
    const all = {};
    activeGroupMaterials.forEach(b => { all[b.batchId] = true; });
    setCollapsedBatches(all);
  };

  const expandAllBatches = () => setCollapsedBatches({});

  const areAllCollapsed = activeGroupMaterials.length > 0 && 
    activeGroupMaterials.every(b => Boolean(collapsedBatches[b.batchId]));

  const handleConfirmRemoveBatch = () => {
    if (batchToRemove && removeBatchFromGroup) {
      removeBatchFromGroup(activeGroupId, batchToRemove.batchId);
      setBatchToRemove(null);
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white relative">
        
        {!isSidebarOpen && (
          <div className="absolute left-4 top-4 z-30 pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="h-9 px-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white flex items-center shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer active:scale-95 border border-slate-700/50 text-xs font-medium group overflow-hidden"
              title="Buka Silabus & Chat"
            >
              <PanelLeftOpen className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isScrolled 
                    ? 'max-w-0 opacity-0 -translate-x-1 pointer-events-none' 
                    : 'max-w-xs opacity-100 ml-2 translate-x-0'
                }`}
              >
                Kurikulum
              </span>
            </button>
          </div>
        )}

        {/* LEFT SIDEBAR: DUAL MODE (Kurikulum vs Room Chat) with Smooth Slide Transition */}
        <div 
          className={`transition-all duration-300 ease-in-out bg-white flex flex-col shrink-0 h-full overflow-hidden z-20 ${
            isSidebarOpen 
              ? 'w-full md:w-84 lg:w-92 border-r border-slate-200 opacity-100' 
              : 'w-0 opacity-0 border-r-0 pointer-events-none'
          }`}
        >
          {/* Sidebar Header & Mode Switcher */}
          <div className="p-3 bg-slate-50/80 border-b border-slate-100 space-y-2 shrink-0 min-w-[21rem]">
            <div className="flex items-center justify-between gap-1">
              <div className="flex bg-slate-200/80 p-0.5 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSidebarTab('syllabus')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    sidebarTab === 'syllabus' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Kurikulum</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('chat')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    sidebarTab === 'chat' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Live Chat</span>
                  {activeGroupMessages.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5"></span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1">
                {sidebarTab === 'syllabus' && (
                  <button
                    type="button"
                    onClick={() => setShowAddMaterialModal(true)}
                    className="flex items-center gap-1 px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                    title="Tambah materi tersimpan"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span className="hidden sm:inline">+ Materi</span>
                  </button>
                )}
                {/* Close Sidebar button */}
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                  title="Tutup Sidebar (Tampilan Lebih Lega)"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Collapse / Expand control for syllabus */}
            {sidebarTab === 'syllabus' && activeGroupMaterials.length > 0 && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>{activeGroupMaterials.length} Kurikulum</span>
                <button
                  type="button"
                  onClick={areAllCollapsed ? expandAllBatches : collapseAllBatches}
                  className="hover:text-slate-700 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <ChevronsUpDown className="w-3 h-3" />
                  <span>{areAllCollapsed ? 'Buka Semua' : 'Ciutkan Judul'}</span>
                </button>
              </div>
            )}
          </div>

          {/* 1. SYLLABUS LIST VIEW */}
          {sidebarTab === 'syllabus' ? (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-w-[21rem]">
              {activeGroupMaterials.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs space-y-3">
                  <p>Belum ada materi pembelajaran di kelompok ini.</p>
                  <button
                    type="button"
                    onClick={() => setShowAddMaterialModal(true)}
                    className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    + Tambah Materi Tersimpan
                  </button>
                </div>
              ) : (
                activeGroupMaterials.map(batch => {
                  const isBatchCollapsed = Boolean(collapsedBatches[batch.batchId]);
                  return (
                    <div key={batch.batchId} className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition-all">
                      {/* Batch Header */}
                      <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleBatchCollapse(batch.batchId)}
                          className="flex items-center gap-2 truncate flex-1 text-left cursor-pointer group"
                        >
                          <Layers className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-900 shrink-0" />
                          <span className="font-bold text-xs text-slate-900 truncate group-hover:text-slate-700">
                            {batch.batchName}
                          </span>
                          {isBatchCollapsed ? (
                            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setBatchToRemove(batch)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Hapus kurikulum dari grup"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Modules & Lessons */}
                      {!isBatchCollapsed && (
                        <div className="p-2 space-y-1 bg-white">
                          {batch.modules?.map(mod => {
                            const isExpanded = Boolean(expandedModules[mod.moduleId]);
                            return (
                              <div key={mod.moduleId} className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => toggleModule(mod.moduleId)}
                                  className="w-full p-2 text-left flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
                                >
                                  <span className="truncate">{mod.moduleTitle}</span>
                                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                                </button>

                                {isExpanded && (
                                  <div className="pl-3 space-y-0.5 border-l-2 border-slate-100 ml-2">
                                    {mod.contents?.map(c => {
                                      const isSelected = c.contentId === selectedContentId;
                                      return (
                                        <button
                                          key={c.contentId}
                                          type="button"
                                          onClick={() => handleSelectContent(batch.batchId, mod.moduleId, c.contentId)}
                                          className={`w-full p-2 text-left rounded-lg text-xs truncate transition-colors cursor-pointer block ${
                                            isSelected ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
                                          }`}
                                        >
                                          • {c.title}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* 2. LIVE SIDEBAR CHAT VIEW */
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/40 min-w-[21rem]">
              <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
                {activeGroupMessages.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Belum ada pesan di forum. Sapa teman kelompok Anda!
                  </div>
                ) : (
                  activeGroupMessages.map((m, idx) => {
                    const isSystem = Boolean(m.isSystem || m.senderId === 'SYSTEM');
                    const isMe = !isSystem && Boolean(currentUserId) && String(m.senderId).toLowerCase() === String(currentUserId).toLowerCase();
                    const messageId = m.messageId || m.id || `msg-${idx}`;
                    const messageContent = m.messageText || m.text || '';

                    if (isSystem) {
                      return (
                        <div key={messageId} className="p-2 bg-amber-50 border border-amber-200/70 text-amber-900 rounded-xl text-[10px] text-center">
                          {messageContent}
                        </div>
                      );
                    }

                    return (
                      <div key={messageId} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group text-xs`}>
                        <span className="text-[9px] font-bold text-slate-400 mb-0.5">{isMe ? 'Anda' : m.senderName}</span>
                        <div className={`p-2.5 rounded-2xl max-w-[90%] leading-relaxed ${
                          isMe ? 'bg-slate-900 text-white rounded-tr-none shadow-2xs' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs'
                        }`}>
                          <p className="whitespace-pre-wrap">{messageContent}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-1.5">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Diskusikan materi ini..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT MAIN PANEL: ACTIVE MATERIAL VIEWER (WIDE & EXPANDED) */}
        <div 
          onScroll={handleMaterialScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-slate-50/50 relative scroll-smooth"
        >
          
          {!currentContent ? (
            <div className="py-28 text-center text-slate-400 text-xs">
              Pilih materi pada daftar kurikulum untuk mulai membaca dan berdiskusi bersama.
            </div>
          ) : (
            <div className="w-full max-w-6xl mx-auto space-y-6">
              <article className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
                <div className="pb-5 border-b border-slate-100 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{currentBatch?.batchName}</span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{currentContent.title}</h2>
                </div>
                <div 
                  className="rich-article-content prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: currentContent.htmlContent || '<p class="text-slate-400 italic">Belum ada konten teks.</p>' }}
                />
              </article>
            </div>
          )}
        </div>

      </div>

      {/* Confirm Delete Material Modal */}
      <ConfirmModal
        isOpen={Boolean(batchToRemove)}
        onClose={() => setBatchToRemove(null)}
        onConfirm={handleConfirmRemoveBatch}
        title="Hapus Materi dari Kelompok?"
        message={`Apakah Anda yakin ingin menghapus kurikulum "${batchToRemove?.batchName}" dari kelompok belajar ini? Materi ini tetap ada di akun Anda dan dapat ditambahkan kembali kapan saja.`}
        confirmText="Ya, Hapus dari Grup"
        cancelText="Batal"
        type="danger"
      />
    </>
  );
}
