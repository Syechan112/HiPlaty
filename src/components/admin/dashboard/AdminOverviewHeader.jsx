import { ShieldCheck, RefreshCw, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminOverviewHeader({
  manualSync,
  lmsLoading,
  fetchingUsers,
  fetchUsers
}) {
  const isSyncing = lmsLoading || fetchingUsers;

  return (
    <header className="border-b border-slate-200 pb-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        {/* Header content */}
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <ShieldCheck
              className="h-3.5 w-3.5 text-slate-500"
              strokeWidth={2}
            />
            <span>Super Administrator</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]">
            Pusat Kontrol & Manajemen Sistem
          </h1>

          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-slate-500">
            Pantau aktivitas pengguna, analitik belajar, materi kurikulum,
            dan pengumuman platform.
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

          {/* Sync */}
          <button
            type="button"
            disabled={isSyncing}
            onClick={() => {
              manualSync();
              fetchUsers();
            }}
            className="
              inline-flex h-10 items-center justify-center gap-2
              border border-slate-200
              bg-white
              px-3.5
              text-xs font-semibold text-slate-700
              transition-colors
              hover:border-slate-300
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isSyncing
                  ? 'animate-spin text-slate-500'
                  : 'text-slate-400'
              }`}
              strokeWidth={2}
            />

            <span>
              {isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data'}
            </span>
          </button>

          {/* Users */}
          <Link
            to="/admin/users"
            className="
              inline-flex h-10 items-center justify-center gap-2
              border border-slate-900
              bg-slate-900
              px-4
              text-xs font-semibold text-white
              transition-colors
              hover:bg-slate-800
            "
          >
            <Users
              className="h-3.5 w-3.5"
              strokeWidth={2}
            />

            <span>Kelola Pengguna</span>
          </Link>

        </div>
      </div>
    </header>
  );
}