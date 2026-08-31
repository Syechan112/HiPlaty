import { X, Plus } from 'lucide-react';

export function ModuleSelectModal({
  isOpen,
  onClose,
  moduleSearch,
  setModuleSearch,
  modalFilteredModules,
  selectedModuleId,
  handleModuleSelect,
  handleOpenContentPicker,
  handleSelectModuleForNewContent,
  handleCreateNewModuleFromModal
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Pilih Modul Pembelajaran</h3>
            <p className="text-[11px] text-slate-500">Pilih bab modul untuk diedit atau diisi materi baru</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <input
            type="text"
            value={moduleSearch}
            onChange={(e) => setModuleSearch(e.target.value)}
            placeholder="Cari modul..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
          />
        </div>
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          <button
            type="button"
            onClick={handleCreateNewModuleFromModal}
            className="w-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>+ Buat Bab Modul Baru di Batch Ini</span>
          </button>

          {modalFilteredModules.map((m) => {
            const isSelected = selectedModuleId === m.moduleId;
            const contentsCount = m.contents?.length || 0;
            const firstContentTitle = m.contents?.[0]?.title;

            return (
              <div
                key={m.moduleId}
                className={`w-full p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected 
                    ? 'bg-slate-900 text-white shadow-xs border-slate-900' 
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-800'
                }`}
              >
                <div 
                  onClick={() => handleModuleSelect(m)}
                  className="truncate cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold truncate">{m.moduleTitle}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                      isSelected 
                        ? 'bg-white/20 text-white border-white/20' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {contentsCount} Materi
                    </span>
                  </div>
                  {contentsCount > 0 ? (
                    <p className={`text-[11px] truncate mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {contentsCount === 1 ? (
                        <span>Materi: <strong className="font-semibold">{firstContentTitle || 'Materi'}</strong></span>
                      ) : (
                        <span>Memiliki <strong>{contentsCount} materi</strong> (Klik Edit untuk memilih materi)</span>
                      )}
                    </p>
                  ) : (
                    <p className={`text-[10px] mt-1 ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                      Belum ada materi tersimpan di modul ini
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/30">
                  {contentsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleOpenContentPicker(m)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                        isSelected 
                          ? 'bg-white text-slate-900 hover:bg-slate-100' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                      title="Buka daftar materi untuk diedit"
                    >
                      <span>Edit Materi ({contentsCount})</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleSelectModuleForNewContent(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                      isSelected 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                    title="Tulis materi baru di modul ini (kosongkan editor)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tulis Materi Baru</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
