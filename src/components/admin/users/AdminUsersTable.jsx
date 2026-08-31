import { Search, Edit3, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { RoleBadge } from '../../RoleBadge';

export function AdminUsersTable({
  filteredUsers,
  paginatedUsers,
  searchQuery,
  handleSearchChange,
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

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari nama, email, role, atau ID pengguna..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="text-xs text-slate-400 font-medium shrink-0">
          Total: <strong className="text-slate-900 font-mono">{filteredUsers.length}</strong> akun
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Pengguna</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Peran (Role)</th>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {fetching ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400">
                  Memuat data pengguna...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400">
                  Tidak ada pengguna yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((u) => (
                <tr key={u.userId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {(u.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <p className="font-bold text-slate-900 text-xs truncate max-w-[180px]">{u.name || 'Pengguna'}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <RoleBadge role={u.role || 'student'} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{u.userId}</td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(u)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                        title="Edit Pengguna"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingUser(u)}
                        className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredUsers.length > 0 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-slate-500">
            Menampilkan <strong className="text-slate-900 font-mono">{startIndex + 1}</strong> - <strong className="text-slate-900 font-mono">{Math.min(endIndex, filteredUsers.length)}</strong> dari <strong className="text-slate-900 font-mono">{filteredUsers.length}</strong> pengguna
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-bold text-slate-700 bg-white border border-slate-200 rounded-lg font-mono">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
