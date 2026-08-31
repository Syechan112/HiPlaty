import { X, Search, Plus, FileText, PenTool, ChevronLeft } from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';

export function ContentPickerModal({
  isOpen,
  onClose,
  onCloseAll,
  selectedModule,
  contentPickerSearch,
  setContentPickerSearch,
  modalFilteredContents,
  loadedContentId,
  category,
  handleSelectSpecificContentToEdit,
  handleSelectModuleForNewContent
}) {
  if (!isOpen || !selectedModule) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Kembali ke Daftar Modul"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Pilih Materi untuk Diedit</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[240px] sm:max-w-xs">
                Modul: <strong className="text-slate-700">{selectedModule.moduleTitle}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseAll}
            className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={contentPickerSearch}
              onChange={(e) => setContentPickerSearch(e.target.value)}
              placeholder="Cari judul materi di modul ini..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="button"
            onClick={() => handleSelectModuleForNewContent(selectedModule)}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Tulis materi baru di modul ini"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Tulis Materi Baru</span>
            <span className="sm:hidden">+ Baru</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {modalFilteredContents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">Tidak ada materi ditemukan</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Coba gunakan kata kunci pencarian lain atau tulis materi baru.</p>
            </div>
          ) : (
            modalFilteredContents.map((c, index) => {
              const isSelected = loadedContentId === c.contentId;
              const catInfo = getCategoryInfo(c.category || category);

              return (
                <div
                  key={c.contentId || index}
                  className={`w-full p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : 'bg-white hover:bg-slate-50/80 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="truncate flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {index + 1}
                      </span>
                      <p className="text-xs font-bold truncate">{c.title || c.contentTitle || 'Materi Tanpa Judul'}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${
                        isSelected ? 'bg-white/10 text-white border-white/20' : catInfo.color
                      }`}>
                        {catInfo.label}
                      </span>
                      {c.contentId && (
                        <span className={`text-[10px] font-mono truncate ${
                          isSelected ? 'text-slate-400' : 'text-slate-400'
                        }`}>
                          ID: {c.contentId}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectSpecificContentToEdit(c, selectedModule)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-2xs ${
                      isSelected 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <PenTool className="w-3 h-3" />
                    <span>{isSelected ? 'Sedang Diedit' : 'Edit Materi Ini'}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            ← Kembali ke Modul
          </button>
          <span className="text-[11px] text-slate-400 font-medium">
            {modalFilteredContents.length} materi terdaftar
          </span>
        </div>
      </div>
    </div>
  );
}
