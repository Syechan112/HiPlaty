import { X, Users, Calendar } from 'lucide-react';

export function DashboardSavedUsersModal({
  selectedUsersListBatch,
  onClose,
  getBatchSavedUsers
}) {
  if (!selectedUsersListBatch) return null;

  const savedUsers = getBatchSavedUsers(
    selectedUsersListBatch.batchId,
    selectedUsersListBatch.batchName
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Siswa yang Menyimpan</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                {selectedUsersListBatch.batchName}
              </p>
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

        <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-[360px]">
          {savedUsers.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">Belum ada siswa yang menyimpan materi ini.</p>
          ) : (
            savedUsers.map((u, i) => (
              <div key={i} className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {(u.userName || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-slate-900 truncate">{u.userName || 'Siswa'}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{u.userId}</p>
                  </div>
                </div>
                {u.savedAt && (
                  <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-slate-300" />
                    {new Date(u.savedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Total: <strong className="text-slate-900 font-mono">{savedUsers.length}</strong> siswa</span>
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
