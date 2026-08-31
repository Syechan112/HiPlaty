import { ChevronLeft, ChevronRight, CheckCircle2, PanelLeftClose, Plus, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudyRoomSidebarBatchList({
  mySavedBatches = [],
  currentBatch,
  selectedBatchId,
  handleSwitchBatch,
  setViewMode,
  setIsSidebarCompact
}) {
  return (
    <>
      {/* Header Mode Batches */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            {currentBatch && (
              <button
                type="button"
                onClick={() => setViewMode('modules')}
                className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-colors cursor-pointer shadow-2xs shrink-0"
                title="Kembali ke Modul"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div className="truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pilih Kelas</span>
              <h3 className="font-bold text-xs text-slate-900 truncate">Kelas Tersimpan ({mySavedBatches.length})</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarCompact(true)}
            className="p-2 hover:bg-slate-200/60 text-slate-500 hover:text-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Ciutkan Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Batches */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-1 gap-2.5">
          {mySavedBatches.map((b, idx) => {
            const isSelected = String(b.batchId).trim() === String(selectedBatchId).trim();
            const totalMods = b.totalModules || b.modules?.length || 0;
            const totalConts = b.totalContents || b.modules?.reduce((acc, m) => acc + (m.contents?.length || 0), 0) || 0;

            return (
              <div
                key={b.batchId}
                onClick={() => {
                  handleSwitchBatch(b);
                  setViewMode('modules');
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="truncate min-w-0 flex-1">
                    <p className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {b.batchName}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {totalMods} Modul • {totalConts} Materi
                    </p>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer: Tambah Batch */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <Link
          to="/learning/explore"
          className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2 shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>+ Jelajahi Kelas Lain</span>
        </Link>
      </div>
    </>
  );
}
