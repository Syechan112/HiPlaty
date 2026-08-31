import { Link } from 'react-router-dom';
import { Plus, BarChart2, FolderOpen, GraduationCap } from 'lucide-react';

export function DashboardHeroHeader({ auth }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-900 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Section */}
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-medium text-slate-600">
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            <span>Studio Educator</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Selamat datang kembali, {auth?.name || 'Educator'}
          </h1>

          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Kelola kurikulum, susun modul, terbitkan materi pembelajaran, dan pantau respons serta minat siswa secara real-time.
          </p>
        </div>

        {/* Right Action Section */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/educator/analytics"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors border border-slate-200"
          >
            <BarChart2 className="w-4 h-4 text-slate-500" />
            <span>Statistik</span>
          </Link>

          <Link
            to="/educator/contents"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition-colors border border-slate-200"
          >
            <FolderOpen className="w-4 h-4 text-slate-500" />
            <span>Kurikulum</span>
          </Link>

          <Link
            to="/educator/contents/create"
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Buat Materi Baru</span>
          </Link>
        </div>

      </div>
    </div>
  );
}