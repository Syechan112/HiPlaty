import { Search, UserPlus, Copy, Check, MessageSquare } from 'lucide-react';
import { RoleBadge } from '../../RoleBadge';

export function ChatFriendsSidebar({
  currentUserId,
  copiedMyId,
  handleCopyMyId,
  setShowAddModal,
  searchQuery,
  setSearchQuery,
  filteredFriends,
  activeFriend,
  handleSelectFriend
}) {
  return (
    <div className="w-full md:w-80 lg:w-88 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Top Profile Card */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-slate-900 text-sm">Obrolan Teman</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Teman</span>
          </button>
        </div>

        {/* My ID Card */}
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
          <div className="truncate mr-2">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">ID Anda:</span>
            <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">{currentUserId}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyMyId}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
            title="Salin ID Anda"
          >
            {copiedMyId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari teman mengobrol..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
        {filteredFriends.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs px-4">
            Belum ada teman yang sesuai. Tambahkan teman menggunakan User ID mereka.
          </div>
        ) : (
          filteredFriends.map((f) => {
            const fId = f.userId || f.id;
            const isSelected = (activeFriend?.userId || activeFriend?.id) === fId;
            const unread = Number(f.unreadCount || 0);

            return (
              <button
                key={fId}
                type="button"
                onClick={() => handleSelectFriend(f)}
                className={`w-full p-3 rounded-2xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {(f.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{f.name || 'Teman'}</p>
                    <p className={`text-[10px] font-mono truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {f.lastMessage ? (
                        <span className="font-sans font-medium text-slate-400 truncate block max-w-[140px]">{f.lastMessage}</span>
                      ) : (
                        fId
                      )}
                    </p>
                  </div>
                </div>

                {unread > 0 && (
                  <span className={`min-w-[1.25rem] h-5 px-1.5 rounded-full text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs animate-in zoom-in-75 duration-150 ${
                    isSelected ? 'bg-white text-slate-900' : 'bg-emerald-500'
                  }`}>
                    {unread > 99 ? '99+' : unread}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
