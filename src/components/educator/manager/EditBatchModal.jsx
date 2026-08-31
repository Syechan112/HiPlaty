import { X, Tag, ChevronDown, Layers } from 'lucide-react';
import { getCategoryInfo, CONTENT_CATEGORIES } from '../../../config/contentCategories';

export function EditBatchModal({
  editingBatch,
  onClose,
  editBatchName,
  setEditBatchName,
  editBatchCategory,
  setEditBatchCategory,
  showEditCategoryModal,
  setShowEditCategoryModal,
  handleSaveEditBatch,
  isUpdatingBatch,
  editBatchError
}) {
  if (!editingBatch) return null;

  const catInfo = getCategoryInfo(editBatchCategory);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Edit Batch Kurikulum</h3>
              <p className="text-[11px] text-slate-400 font-mono">ID: {editingBatch.batchId}</p>
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

        <form onSubmit={handleSaveEditBatch} className="p-5 space-y-4">
          {editBatchError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {editBatchError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Nama Batch Kurikulum *
            </label>
            <input
              type="text"
              value={editBatchName}
              onChange={(e) => setEditBatchName(e.target.value)}
              placeholder="Contoh: Web Development 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Kategori Topik *
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
              {CONTENT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setEditBatchCategory(cat.id)}
                  className={`p-2 rounded-lg text-left text-xs font-semibold border transition-all cursor-pointer truncate ${
                    editBatchCategory === cat.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate block">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdatingBatch}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              {isUpdatingBatch ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
