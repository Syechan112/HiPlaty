import { Search, Edit3, Trash2, ChevronLeft, ChevronRight, X, Users, GraduationCap, Shield } from 'lucide-react';
import { RoleBadge } from '../../RoleBadge';

export function AdminUsersMobileList({
  filteredUsers,
  paginatedUsers,
  searchQuery,
  setSearchQuery,
  handleSearchChange,
  roleFilter = 'all',
  handleRoleFilterChange,
  roleCounts = { all: 0, student: 0, educator: 0, admin: 0 },
  currentPage,
  setCurrentPage,
  totalPages,
  pageSize,
  fetching,
  handleOpenEditModal,
  setDeletingUser
}) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const rolesList = [
    { id: 'all', label: 'Semua', count: roleCounts.all },
    { id: 'student', label: 'Siswa', count: roleCounts.student },
    { id: 'educator', label: 'Educator', count: roleCounts.educator },
    { id: 'admin', label: 'Admin', count: roleCounts.admin }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden sm:hidden">
      {/* Search Bar & Role Filter Chips */}
      <div className="p-3.5 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
            Manajemen Akun
          </span>
          <span className="text-[10px] text-slate-500 font-medium font-mono bg-slate-100 px-2 py-0.5 rounded-md">
            {filteredUsers.length} akun
          </span>
        </div>

        {/* Styled Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari nama, email, role, atau ID..."
            className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium placeholder:text-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && setSearchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              title="Hapus Pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Role Filtering Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {rolesList.map((tab) => {
            const isSelected = roleFilter === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleRoleFilterChange && handleRoleFilterChange(tab.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200/60'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards List */}
      <div className="divide-y divide-slate-100">
        {fetching ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Memuat data pengguna...
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Tidak ada pengguna yang cocok dengan pencarian.
          </div>
        ) : (
          paginatedUsers.map((u) => (
            <div
              key={u.userId}
              className="p-3.5 flex flex-col gap-2.5 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {(u.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {u.name || 'Pengguna'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {u.email}
                    </p>
                  </div>
                </div>

                <RoleBadge role={u.role || 'student'} />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100/60 text-[10px]">
                <div className="text-slate-400 font-mono">
                  ID: <span className="text-slate-600 font-medium">{u.userId}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(u)}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="Edit Pengguna"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingUser(u)}
                    className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="Hapus Pengguna"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Mobile Footer */}
      {filteredUsers.length > 0 && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs">
          <p className="text-slate-400 text-[10px]">
            <strong className="text-slate-900 font-mono">{startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}</strong> dari <strong className="text-slate-900 font-mono">{filteredUsers.length}</strong>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="p-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer shadow-2xs"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 py-0.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg font-mono shadow-2xs">
              {currentPage}/{totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="p-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer shadow-2xs"
              title="Selanjutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
