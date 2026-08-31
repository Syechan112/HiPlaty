import { Link } from 'react-router-dom';
import { X, Layers, Compass, Trash2 } from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';

export function StudyRoomBatchSelectModal({
  isOpen,
  onClose,
  mySavedBatches,
  selectedBatchId,
  handleSwitchBatch,
  handleRemoveBatch
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Layers className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Ganti Kelas / Batch Materi</h3>
              <p className="text-[11px] text-slate-400">Pilih kurikulum yang telah Anda simpan</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {mySavedBatches.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="font-bold text-slate-700 text-xs">Belum ada materi tersimpan</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Jelajahi materi dan klik simpan untuk belajar.</p>
              <Link
                to="/explore"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Jelajahi Materi</span>
              </Link>
            </div>
          ) : (
            mySavedBatches.map(b => {
              const isSelected = b.batchId === selectedBatchId;
              const catInfo = getCategoryInfo(b.category);
              const lessonCount = b.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0;

              return (
                <div
                  key={b.batchId}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div
                    onClick={() => handleSwitchBatch(b)}
                    className="truncate cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-xs truncate">{b.batchName}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.2 rounded border truncate ${
                        isSelected ? 'bg-white/20 text-white border-white/20' : catInfo.color
                      }`}>
                        {catInfo.label}
                      </span>
                    </div>
                    <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                      {b.modules?.length || 0} Modul • {lessonCount} Materi
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSwitchBatch(b)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-slate-900'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'Sedang Dibuka' : 'Buka'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveBatch(b)}
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white/10 hover:bg-rose-500 text-white border-white/20'
                          : 'bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border-slate-200'
                      }`}
                      title="Hapus dari Ruang Belajar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
