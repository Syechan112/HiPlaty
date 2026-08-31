import { X, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ShareGroupModal({
  studyGroupModalBatch,
  onClose,
  groups,
  handleShareToGroup
}) {
  if (!studyGroupModalBatch) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Bagikan ke Grup Belajar</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                {studyGroupModalBatch.batchName}
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

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 max-h-[340px]">
          {groups.length === 0 ? (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-600 font-bold">Anda belum bergabung di grup mana pun</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Buat atau gabung ke grup belajar terlebih dahulu.</p>
              <Link
                to="/study-group"
                className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                <span>Buka Grup Belajar</span>
              </Link>
            </div>
          ) : (
            groups.map(g => (
              <div key={g.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 text-xs">
                <div className="truncate">
                  <p className="font-bold text-slate-900 truncate">{g.name}</p>
                  <p className="text-[10px] text-slate-400">{g.members?.length || 0} Anggota</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleShareToGroup(g.id)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  Bagikan
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
