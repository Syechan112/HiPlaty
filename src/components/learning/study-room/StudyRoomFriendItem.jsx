import { MessageCircle, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudyRoomFriendItem({
  friend,
  onSelectForGroup,
  onRemoveFriend
}) {
  const fId = friend.userId || friend.id;
  const name = friend.name || friend.userName || 'Teman';

  return (
    <div className="p-2.5 bg-slate-50 hover:bg-slate-100/90 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-2.5 text-xs transition-all">
      <div 
        onClick={() => onSelectForGroup(friend)}
        className="flex items-center gap-2.5 truncate min-w-0 flex-1 cursor-pointer group"
        title="Klik untuk mengajak membuat Study Group"
      >
        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="truncate min-w-0">
          <p className="font-bold text-slate-900 truncate group-hover:text-slate-700">{name}</p>
          <p className="text-[10px] text-slate-400 font-mono truncate">{fId}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => onSelectForGroup(friend)}
          className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
          title="Ajak Buat Study Group"
        >
          <Users className="w-3 h-3" />
          <span className="hidden sm:inline">Ajak Group</span>
        </button>
        <Link
          to={`/chat?userId=${fId}`}
          className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-colors"
          title="Kirim Pesan Chat"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={() => onRemoveFriend(fId)}
          className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-500 rounded-xl transition-colors cursor-pointer"
          title="Hapus Teman"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
