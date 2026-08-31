import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  PanelLeftClose, 
  PanelLeftOpen,
  Layers,
  Sparkles
} from 'lucide-react';
import { StudyRoomSidebarBatchList } from './StudyRoomSidebarBatchList';

export function StudyRoomSidebar({
  mySavedBatches = [],
  currentBatch,
  selectedBatchId,
  handleSwitchBatch,
  selectedModuleId,
  selectedContentId,
  expandedModules,
  toggleModule,
  handleSelectContent,
  isContentComplete,
  hasNote,
  isSidebarCompact,
  setIsSidebarCompact
}) {
  const [viewMode, setViewMode] = useState('modules'); // 'modules' | 'batches'

  if (!currentBatch && mySavedBatches.length === 0) return null;

  return (
    <aside className={`border-r border-slate-200 bg-white flex flex-col transition-all duration-300 select-none shrink-0 ${
      isSidebarCompact ? 'w-16' : 'w-80 sm:w-88'
    }`}>
      
      {/* 1. VIEW: DAFTAR BATCH / KELAS TERSIMPAN */}
      {viewMode === 'batches' && !isSidebarCompact ? (
        <StudyRoomSidebarBatchList
          mySavedBatches={mySavedBatches}
          currentBatch={currentBatch}
          selectedBatchId={selectedBatchId}
          handleSwitchBatch={handleSwitchBatch}
          setViewMode={setViewMode}
          setIsSidebarCompact={setIsSidebarCompact}
        />
      ) : (
        <>
          {/* 2. VIEW: DAFTAR MODUL DARI BATCH TERPILIH */}
          <div className="p-3.5 border-b border-slate-100 bg-white">
            {!isSidebarCompact ? (
              <div className="space-y-2.5">
                {/* Header Row: Title & Collapse Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider truncate">
                      Struktur Kurikulum
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidebarCompact(true)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Ciutkan Sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>

                {/* Switcher Row: Ganti Kelas Button */}
                <button
                  type="button"
                  onClick={() => setViewMode('batches')}
                  className="w-full text-left p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 transition-all flex items-center justify-between gap-2 cursor-pointer group shadow-2xs"
                  title="Klik untuk memilih atau berpindah kelas"
                >
                  <div className="truncate min-w-0 flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                      Kelas Aktif
                    </span>
                    <p className="font-bold text-xs text-slate-900 truncate mt-0.5">
                      {currentBatch?.batchName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-slate-400 group-hover:text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200/60 text-[10px] font-bold">
                    <span>Ganti</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </button>
              </div>
            ) : (
              /* Compact View Controls */
              <div className="flex flex-col items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsSidebarCompact(false)}
                  className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors cursor-pointer"
                  title="Perluas Sidebar"
                >
                  <PanelLeftOpen className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarCompact(false);
                    setViewMode('batches');
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs cursor-pointer"
                  title={`Kelas: ${currentBatch?.batchName} (Klik untuk ganti kelas)`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Modules List Grid */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-1 gap-2.5">
              {currentBatch?.modules?.map((mod, modIdx) => {
                const isExpanded = Boolean(expandedModules[mod.moduleId]);
                const isCurrentMod = mod.moduleId === selectedModuleId;

                if (isSidebarCompact) {
                  const firstContentId = mod.contents?.[0]?.contentId || '';
                  return (
                    <div key={mod.moduleId} className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (firstContentId) {
                            handleSelectContent(currentBatch.batchId, mod.moduleId, firstContentId);
                          }
                          if (!isExpanded) {
                            toggleModule(mod.moduleId);
                          }
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer shadow-2xs ${
                          isCurrentMod 
                            ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/20' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                        title={`${modIdx + 1}. ${mod.moduleTitle} (${mod.contents?.length || 0} Materi)`}
                      >
                        {modIdx + 1}
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={mod.moduleId} className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.moduleId)}
                      className={`w-full p-3 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isCurrentMod ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCurrentMod ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {modIdx + 1}
                        </div>
                        <span className="font-bold text-slate-800 text-xs truncate">{mod.moduleTitle}</span>
                      </div>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    </button>

                    {isExpanded && (
                      <div className="p-2 bg-slate-50/60 divide-y divide-slate-100 border-t border-slate-100">
                        {mod.contents?.map((c) => {
                          const isSelected = c.contentId === selectedContentId;
                          const isCompleted = isContentComplete(currentBatch.batchName, c.contentId);
                          const noteExists = hasNote(c.contentId);

                          return (
                            <button
                              key={c.contentId}
                              type="button"
                              onClick={() => handleSelectContent(currentBatch.batchId, mod.moduleId, c.contentId)}
                              className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-slate-900 text-white shadow-xs'
                                  : 'hover:bg-white text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                {isCompleted ? (
                                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                ) : (
                                  <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${isSelected ? 'border-white/40' : 'border-slate-300'}`} />
                                )}
                                <span className={`text-xs truncate ${isSelected ? 'font-bold text-white' : 'font-medium'}`}>
                                  {c.title}
                                </span>
                              </div>
                              {noteExists && (
                                <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-amber-300' : 'bg-amber-500'}`} title="Ada catatan" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
