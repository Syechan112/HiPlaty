import {
  Users,
  Layers,
  FileText,
  Bell,
  GraduationCap,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminStatsBentoMobile({
  totalUsers = 0,
  totalStudents = 0,
  totalEducators = 0,
  totalAdmins = 0,
  totalBatches = 0,
  totalModules = 0,
  totalContents = 0,
  allAnnouncements = []
}) {
  const announcementsCount = allAnnouncements?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:hidden">

      {/* Featured */}
      <Link
        to="/admin/users"
        className="
          group col-span-2
          min-h-[150px]
          rounded-2xl
          border border-slate-200/80
          bg-white
          p-4
          transition-all duration-200
          active:scale-[0.99]
          hover:border-slate-300
          hover:shadow-[0_8px_24px_rgba(15,23,42,0.055)]
        "
      >
        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-2.5">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-xl
                bg-slate-50
                text-slate-600
              "
            >
              <Users
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                Total Pengguna
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                Seluruh akun terdaftar
              </p>
            </div>
          </div>

          <ArrowUpRight
            className="
              h-4 w-4
              text-slate-300
              transition-colors
              group-hover:text-slate-600
            "
            strokeWidth={1.8}
          />
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-3xl font-semibold tracking-tight text-slate-950">
              {totalUsers}
            </p>

            <p className="mt-1 text-[11px] font-medium text-slate-400">
              akun terdaftar
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 text-[10px] text-slate-400">
            <span>
              <strong className="font-semibold text-slate-600">
                {totalStudents}
              </strong>{' '}
              Siswa
            </span>

            <span>
              <strong className="font-semibold text-slate-600">
                {totalAdmins}
              </strong>{' '}
              Admin
            </span>
          </div>
        </div>
      </Link>

      {/* Educator */}
      <Link
        to="/admin/users"
        className="
          group
          flex min-h-[132px] flex-col
          rounded-2xl
          border border-slate-200/80
          bg-white
          p-3.5
          transition-all duration-200
          active:scale-[0.99]
          hover:border-slate-300
          hover:shadow-[0_8px_24px_rgba(15,23,42,0.055)]
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <GraduationCap
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </div>

          <span className="text-[9px] font-medium text-slate-400">
            Pengajar
          </span>
        </div>

        <div className="mt-auto pt-5">
          <p className="font-mono text-2xl font-semibold tracking-tight text-slate-950">
            {totalEducators}
          </p>

          <p className="mt-1 text-[11px] font-semibold text-slate-600">
            Educator Aktif
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Pengelola pembelajaran
          </p>
        </div>
      </Link>

      {/* Materi */}
      <Link
        to="/educator/contents"
        className="
          group
          flex min-h-[132px] flex-col
          rounded-2xl
          border border-slate-200/80
          bg-white
          p-3.5
          transition-all duration-200
          active:scale-[0.99]
          hover:border-slate-300
          hover:shadow-[0_8px_24px_rgba(15,23,42,0.055)]
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <FileText
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </div>

          <span className="text-[9px] font-medium text-slate-400">
            {totalModules} Modul
          </span>
        </div>

        <div className="mt-auto pt-5">
          <p className="font-mono text-2xl font-semibold tracking-tight text-slate-950">
            {totalContents}
          </p>

          <p className="mt-1 text-[11px] font-semibold text-slate-600">
            Materi Terbit
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Materi pembelajaran
          </p>
        </div>
      </Link>

      {/* Batch */}
      <Link
        to="/educator/contents"
        className="
          group
          flex min-h-[132px] flex-col
          rounded-2xl
          border border-slate-200/80
          bg-white
          p-3.5
          transition-all duration-200
          active:scale-[0.99]
          hover:border-slate-300
          hover:shadow-[0_8px_24px_rgba(15,23,42,0.055)]
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <Layers
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </div>

          <span className="text-[9px] font-medium text-slate-400">
            Kurikulum
          </span>
        </div>

        <div className="mt-auto pt-5">
          <p className="font-mono text-2xl font-semibold tracking-tight text-slate-950">
            {totalBatches}
          </p>

          <p className="mt-1 text-[11px] font-semibold text-slate-600">
            Batch Kurikulum
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Koleksi pembelajaran
          </p>
        </div>
      </Link>

      {/* Pengumuman */}
      <Link
        to="/admin/announcements"
        className="
          group
          flex min-h-[132px] flex-col
          rounded-2xl
          border border-slate-200/80
          bg-white
          p-3.5
          transition-all duration-200
          active:scale-[0.99]
          hover:border-slate-300
          hover:shadow-[0_8px_24px_rgba(15,23,42,0.055)]
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <Bell
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </div>

          <span className="text-[9px] font-medium text-slate-400">
            Broadcast
          </span>
        </div>

        <div className="mt-auto pt-5">
          <p className="font-mono text-2xl font-semibold tracking-tight text-slate-950">
            {announcementsCount}
          </p>

          <p className="mt-1 text-[11px] font-semibold text-slate-600">
            Pengumuman
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            Informasi platform
          </p>
        </div>
      </Link>

    </div>
  );
}