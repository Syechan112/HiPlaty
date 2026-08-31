import { X, Layers, Compass, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudyGroupAddMaterialModal({
  isOpen,
  onClose,
  savedBatches = [],
  activeGroupMaterials = [],
  addBatchToGroup,
  activeGroupId
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tambah Materi Tersimpan</h3>
              <p className="text-[10px] text-slate-400">Pilih kurikulum yang sudah Anda simpan di Ruang Belajar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body List */}
        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          {savedBatches.length === 0 ? (
            <div className="py-12 px-6 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                <Bookmark className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Belum Ada Materi Tersimpan</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Hanya materi yang telah Anda simpan di Ruang Belajar yang dapat dibagikan ke kelompok.
                </p>
              </div>
              <Link
                to="/learning/explore"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Eksplorasi Materi Sekarang</span>
              </Link>
            </div>
          ) : (
            savedBatches.map(b => {
              const isAdded = activeGroupMaterials.some(m => String(m.batchId).trim() === String(b.batchId).trim());
              return (
                <div
                  key={b.batchId}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/70 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <p className="font-bold text-xs text-slate-900 truncate">{b.batchName}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 pl-5.5 font-medium">
                      {b.modules?.length || 0} Modul • {b.modules?.reduce((acc, m) => acc + (m.contents?.length || 0), 0) || 0} Pelajaran
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isAdded}
                    onClick={() => {
                      addBatchToGroup(activeGroupId, b);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                  >
                    {isAdded ? 'Sudah Ada' : '+ Tambahkan'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
