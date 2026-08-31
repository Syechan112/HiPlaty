import { X, Search, Users, Calendar } from 'lucide-react';

export function StudentListModal({
  selectedModalItem,
  onClose,
  modalSearchQuery,
  setModalSearchQuery,
  activeModalUsers
}) {
  if (!selectedModalItem) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Daftar Siswa yang Menyimpan</h3>
            <p className="text-[11px] text-slate-500 truncate max-w-[260px] sm:max-w-xs">
              {selectedModalItem.batchName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-slate-50 border-b border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={modalSearchQuery}
              onChange={(e) => setModalSearchQuery(e.target.value)}
              placeholder="Cari nama siswa atau ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="p-3 overflow-y-auto space-y-2 flex-1 max-h-[380px]">
          {activeModalUsers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Tidak ada siswa yang ditemukan.
            </div>
          ) : (
            activeModalUsers.map((u, i) => (
              <div key={i} className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs transition-colors">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {(u.userName || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{u.userName || 'Siswa Tanpa Nama'}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{u.userId}</p>
                  </div>
                </div>
                {u.savedAt && (
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    {new Date(u.savedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Total: <strong className="text-slate-900 font-mono">{activeModalUsers.length}</strong> siswa</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
