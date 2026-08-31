import { X, UserPlus } from 'lucide-react';

export function AddFriendModal({
  isOpen,
  onClose,
  targetIdInput,
  setTargetIdInput,
  modalFeedback,
  handleAddFriendSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <UserPlus className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tambah Teman Mengobrol</h3>
              <p className="text-[11px] text-slate-400">Masukkan User ID atau Username teman Anda</p>
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

        <form onSubmit={handleAddFriendSubmit} className="p-5 space-y-4">
          {modalFeedback.error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {modalFeedback.error}
            </div>
          )}
          {modalFeedback.success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
              {modalFeedback.success}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">User ID / Username *</label>
            <input
              type="text"
              required
              value={targetIdInput}
              onChange={(e) => setTargetIdInput(e.target.value)}
              placeholder="Contoh: USR-12345 atau budi_santoso"
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-mono"
            />
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
              disabled={modalFeedback.loading || !targetIdInput.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {modalFeedback.loading ? 'Menambahkan...' : 'Tambah Teman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
