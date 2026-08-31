import { BookOpen, ChevronDown } from 'lucide-react';

export function ModulePlacementCard({
  isEditMode,
  useExistingBatch,
  currentBatch,
  useExistingModule,
  setUseExistingModule,
  selectedModuleId,
  setSelectedModuleId,
  newModuleName,
  setNewModuleName,
  setModuleSearch,
  setShowModuleModal,
  setLoadedContentId,
  setContentTitle,
  setHtmlContent
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between space-y-6 hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] transition-all duration-300">
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200/60">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">Modul Pembelajaran</h3>
              <p className="text-xs text-slate-400 font-medium">Bab modul materi di dalam batch</p>
            </div>
          </div>

          {!isEditMode && useExistingBatch && currentBatch?.modules?.length > 0 && (
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUseExistingModule(true)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  useExistingModule 
                    ? 'bg-white text-slate-900 shadow-sm font-bold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pilih Modul
              </button>
              <button
                type="button"
                onClick={() => {
                  setUseExistingModule(false);
                  setSelectedModuleId('');
                  setNewModuleName('');
                  setLoadedContentId('');
                  setContentTitle('');
                  setHtmlContent('');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !useExistingModule 
                    ? 'bg-white text-slate-900 shadow-sm font-bold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                + Modul Baru
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Nama / Judul Modul <span className="text-rose-500">*</span>
            </label>
            {useExistingModule && currentBatch?.modules?.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setModuleSearch('');
                  setShowModuleModal(true);
                }}
                disabled={!currentBatch || !currentBatch.modules?.length}
                className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/80 disabled:bg-slate-100/40 border border-slate-200/80 hover:border-slate-300 disabled:border-slate-200 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer disabled:cursor-not-allowed group shadow-2xs"
              >
                <div className="flex items-center gap-3 truncate mr-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentBatch?.modules?.find(m => m.moduleId === selectedModuleId)?.moduleTitle || 'Pilih Modul...'}
                    </p>
                    {selectedModuleId && (
                      <p className="text-[10px] text-slate-400 font-mono">
                        ID: {selectedModuleId} • {currentBatch?.modules?.find(m => m.moduleId === selectedModuleId)?.contents?.length || 0} Materi terbit
                      </p>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 transition-transform group-hover:translate-y-0.5" />
              </button>
            ) : (
              <input
                type="text"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                placeholder="Ketik judul modul baru..."
                className="w-full px-4 py-3 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-2xs"
              />
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <span>Materi yang Anda buat akan langsung terhubung ke bab modul ini.</span>
        </div>
      </div>
    </div>
  );
}
