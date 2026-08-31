import { Users, Eye, Bookmark, BookOpen, Clock } from 'lucide-react';

export function AnalyticsStatCards({
  uniqueStudentsCount,
  totalViewsCount,
  totalSavesCount,
  totalLessonsCount,
  totalBatchesCount,
  totalReadingMinutes
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

      {/* Large Card - Total Waktu Baca */}
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] lg:row-span-2">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          <Clock
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </div>

        <p className="mt-5 font-mono text-3xl font-bold tracking-tight text-slate-900">
          {totalReadingMinutes}m
        </p>

        <p className="mt-1.5 text-xs font-semibold text-slate-500">
          Total Waktu Baca
        </p>

        <span className="mt-3 rounded-md bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
          Estimasi
        </span>
      </div>

      {/* Siswa Terhubung */}
      <div className="flex min-h-[105px] items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          <Users
            className="h-4 w-4"
            strokeWidth={1.8}
          />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-2xl font-bold tracking-tight text-slate-900">
            {uniqueStudentsCount}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            Siswa Menyimpan
          </p>
        </div>
      </div>

      {/* Total Views */}
      <div className="flex min-h-[105px] items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          <Eye
            className="h-4 w-4"
            strokeWidth={1.8}
          />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-2xl font-bold tracking-tight text-slate-900">
            {totalViewsCount}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            Materi Dilihat
          </p>
        </div>
      </div>

      {/* Total Simpan */}
      <div className="flex min-h-[105px] items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          <Bookmark
            className="h-4 w-4"
            strokeWidth={1.8}
          />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-2xl font-bold tracking-tight text-slate-900">
            {totalSavesCount}
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            Total Disimpan
          </p>
        </div>
      </div>

      {/* Total Materi */}
      <div className="flex min-h-[105px] items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.035)] transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
          <BookOpen
            className="h-4 w-4"
            strokeWidth={1.8}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="font-mono text-2xl font-bold tracking-tight text-slate-900">
              {totalLessonsCount}
            </p>

            <span className="text-[10px] font-semibold text-slate-400">
              {totalBatchesCount} Batch
            </span>
          </div>

          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            Materi Diterbitkan
          </p>
        </div>
      </div>

    </div>
  );
}