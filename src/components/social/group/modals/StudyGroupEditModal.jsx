import { X, Palette, Check } from 'lucide-react';
import { GROUP_COLORS } from '../../../../utils/studyGroupHelpers';

export function StudyGroupEditModal({
  isOpen,
  onClose,
  activeGroup,
  editGroupName,
  setEditGroupName,
  editGroupDesc,
  setEditGroupDesc,
  editGroupColor,
  setEditGroupColor,
  handleEditGroupSubmit
}) {
  if (!isOpen || !activeGroup) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Edit Detail Grup</h3>
              <p className="text-[10px] text-slate-400">Ubah nama, deskripsi, dan tema warna grup</p>
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

        <form onSubmit={handleEditGroupSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Nama Grup *</label>
            <input
              type="text"
              required
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Deskripsi / Tujuan</label>
            <textarea
              rows={2}
              value={editGroupDesc}
              onChange={(e) => setEditGroupDesc(e.target.value)}
              placeholder="Tuliskan tujuan kelompok belajar ini..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
            />
          </div>

          {/* Color Palette Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Warna Tema Grup</label>
            <div className="grid grid-cols-4 gap-2">
              {GROUP_COLORS.map((c) => {
                const isSelected = (editGroupColor || 'slate') === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setEditGroupColor(c.id)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/15'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center shadow-2xs text-white"
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 truncate">{c.name.split(' ')[1] || c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
