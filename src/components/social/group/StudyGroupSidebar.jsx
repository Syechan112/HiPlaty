import { Users, Plus, Key, Search, PanelLeftClose } from 'lucide-react';
import { getGroupColor } from '../../../utils/studyGroupHelpers';

export function StudyGroupSidebar({
  groups,
  filteredGroups,
  activeGroupId,
  setActiveGroupId,
  searchQuery,
  setSearchQuery,
  setShowCreateModal,
  setShowJoinModal,
  isOpen = true,
  onClose
}) {
  return (
    <div 
      className={`transition-all duration-300 ease-in-out bg-white flex flex-col shrink-0 h-full overflow-hidden z-20 ${
        isOpen 
          ? 'w-full md:w-80 lg:w-88 border-r border-slate-200 opacity-100' 
          : 'w-0 opacity-0 border-r-0 pointer-events-none'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-3 min-w-[20rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="font-extrabold text-slate-900 text-sm">Grup Belajar</h2>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowJoinModal(true)}
              className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
              title="Gabung via Kode"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buat</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer ml-0.5"
                title="Tutup Daftar Grup (Tampilan Lebih Lega)"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari grup belajar..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-medium"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1 min-w-[20rem]">
        {filteredGroups.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-2">
            <p>Tidak ada grup yang ditemukan.</p>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="text-slate-900 font-bold hover:underline"
            >
              Buat grup baru sekarang
            </button>
          </div>
        ) : (
          filteredGroups.map(g => {
            const isActive = g.id === activeGroupId;
            const theme = getGroupColor(g.color);
            return (
              <div
                key={g.id}
                onClick={() => setActiveGroupId(g.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'hover:bg-slate-50 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : theme.hex,
                      color: '#ffffff'
                    }}
                  >
                    {(g.name || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className={`font-bold text-xs truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{g.name}</p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                      {g.members?.length || 1} Anggota • {g.materials?.length || 0} Materi
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
