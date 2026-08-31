import { X, Key } from 'lucide-react';

export function StudyGroupJoinModal({
  isOpen,
  onClose,
  joinIdInput,
  setJoinIdInput,
  modalError,
  handleJoinGroupSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Gabung Grup Belajar</h3>
              <p className="text-[10px] text-slate-400">Masukkan kode unik kelompok belajar</p>
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

        <form onSubmit={handleJoinGroupSubmit} className="space-y-3">
          {modalError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
              {modalError}
            </p>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Kode / ID Grup *</label>
            <input
              type="text"
              required
              value={joinIdInput}
              onChange={(e) => setJoinIdInput(e.target.value)}
              placeholder="Contoh: SG-1234 atau SG-KOMUNITAS-01"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
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
              Gabung Grup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
