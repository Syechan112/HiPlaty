import { Layers, BookOpen, FileText, Bookmark, Users, ArrowUpRight } from 'lucide-react';

export function DashboardMetricsCards({
  totalBatches,
  totalModules,
  totalContents,
  totalSavesAcrossBatches,
  uniqueSavedStudentsCount,
  avgModulesPerBatch,
  avgLessonsPerModule
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* 1. Hero Card (Large Span) - Total Batch */}
      <div className="md:col-span-2 lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-800 flex items-center justify-center">
            <Layers className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50">
            Kelas Aktif
          </span>
        </div>
        <div className="mt-8">
          <p className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight font-mono">{totalBatches}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-medium text-slate-500">Total Batch Tersedia</p>
            <span className="text-[11px] text-slate-400">Rata-rata {avgModulesPerBatch} Modul/Batch</span>
          </div>
        </div>
      </div>

      {/* 2. Medium Card - Total Modul */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-800 flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/50">
            {avgModulesPerBatch}/Batch
          </span>
        </div>
        <div className="mt-6">
          <p className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight font-mono">{totalModules}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Bab Modul</p>
        </div>
      </div>

      {/* 3. Medium Card - Materi Terbit */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-800 flex items-center justify-center">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/50">
            {avgLessonsPerModule}/Modul
          </span>
        </div>
        <div className="mt-6">
          <p className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight font-mono">{totalContents}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Materi Terbit</p>
        </div>
      </div>

      {/* 4. Wide Card - Interaksi Siswa (Disimpan) */}
      <div className="md:col-span-2 lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-800 flex items-center justify-center">
            <Bookmark className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            Bookmark <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-6 flex items-baseline justify-between">
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight font-mono">{totalSavesAcrossBatches}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Total Materi Disimpan</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Akumulasi seluruh batch</span>
        </div>
      </div>

      {/* 5. Wide Card - Siswa Terhubung */}
      <div className="md:col-span-1 lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200/60 text-slate-800 flex items-center justify-center">
            <Users className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50">
            Siswa Unik
          </span>
        </div>
        <div className="mt-6 flex items-baseline justify-between">
          <div>
            <p className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight font-mono">{uniqueSavedStudentsCount}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Siswa Terhubung</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Aktif berinteraksi</span>
        </div>
      </div>
    </div>
  );
}