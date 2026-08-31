import { useState } from 'react';
import { X, UserPlus, Copy, Check, Search } from 'lucide-react';

export function StudyGroupInviteModal({
  isOpen,
  onClose,
  activeGroup,
  friends = [],
  inviteFriendToGroup
}) {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  if (!isOpen || !activeGroup) return null;

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeGroup.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredFriends = friends.filter(f => {
    const name = (f.name || f.userName || '').toLowerCase();
    const id = (f.userId || f.id || '').toLowerCase();
    const q = search.toLowerCase();
    return !search || name.includes(q) || id.includes(q);
  });

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Undang Teman ke Grup</h3>
              <p className="text-[10px] text-slate-400">Bagikan kode atau undang teman terdaftar</p>
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

        {/* Group Code Copy Card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kode Unik Grup:</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{activeGroup.id}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyId}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
          </button>
        </div>

        {/* Friend List */}
        <div className="space-y-2 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Daftar Kontak Teman:</span>
            <span className="text-[10px] text-slate-400">{filteredFriends.length} teman</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari teman..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pt-1">
            {filteredFriends.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Belum ada teman terdaftar.</p>
            ) : (
              filteredFriends.map(f => {
                const isMember = activeGroup.members?.some(m => String(m.userId).toLowerCase() === String(f.userId || f.id).toLowerCase());
                return (
                  <div key={f.userId || f.id} className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl flex items-center justify-between text-xs transition-colors">
                    <div className="truncate mr-2">
                      <span className="font-bold text-slate-900 block truncate">{f.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono truncate">{f.userId || f.id}</span>
                    </div>
                    <button
                      type="button"
                      disabled={isMember}
                      onClick={() => {
                        inviteFriendToGroup(activeGroup.id, f);
                        onClose();
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isMember ? 'Sudah Gabung' : 'Undang'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
