import { Link } from 'react-router-dom';
import { Compass, Bookmark } from 'lucide-react';

export function ExploreHeader({
  savedBatchCount,
  totalLessonsCount
}) {
  return (
    <header className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Header Content */}
        <div className="min-w-0">
          <div className="mb-2.5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
              <Compass
                className="h-4 w-4"
                strokeWidth={2}
              />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
              Katalog Kurikulum
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Eksplorasi Materi Pembelajaran
          </h1>

          <p className="mt-1.5 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm">
            Temukan modul dan artikel pembelajaran yang disusun oleh para
            educator.
          </p>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-3 text-[11px]">
            <span className="text-slate-400">
              <strong className="font-bold text-slate-700">
                {totalLessonsCount}
              </strong>{' '}
              materi
            </span>

            <span className="h-3 w-px bg-slate-200" />

            <span className="text-slate-400">
              <strong className="font-bold text-slate-700">
                {savedBatchCount}
              </strong>{' '}
              tersimpan
            </span>
          </div>
        </div>

        {/* Saved */}
        <Link
          to="/learning/study"
          className="
            inline-flex h-10
            w-full sm:w-auto
            items-center justify-center gap-2
            rounded-xl
            border border-slate-200
            bg-white
            px-3.5
            text-xs font-bold text-slate-600
            transition-all duration-150
            hover:border-slate-300
            hover:bg-slate-50
            hover:text-slate-800
          "
        >
          <Bookmark
            className="h-3.5 w-3.5 text-slate-400"
            strokeWidth={2}
          />

          <span>Ruang Belajar</span>

          <span className="tabular-nums text-slate-400">
            {savedBatchCount}
          </span>
        </Link>
      </div>
    </header>
  );
}