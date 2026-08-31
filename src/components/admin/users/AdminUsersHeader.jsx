import { Users, UserPlus, RefreshCw } from 'lucide-react';

export function AdminUsersHeader({
  totalUsers,
  fetching,
  fetchUsers,
  handleOpenCreateModal
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10">
            <Users className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manajemen Pengguna</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          Daftar Seluruh Pengguna
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Kelola akun siswa, educator, dan administrator di dalam platform LMS.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={fetching}
          onClick={fetchUsers}
          className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          title="Muat Ulang Data"
        >
          <RefreshCw className={`w-4 h-4 ${fetching ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Pengguna Baru</span>
        </button>
      </div>
    </div>
  );
}
