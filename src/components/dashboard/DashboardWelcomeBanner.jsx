
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardWelcomeBanner({ auth }) {
  return (
    <section className="h-full rounded-[32px] border border-slate-100 bg-white p-7 font-['Poppins',sans-serif] shadow-sm">
      <div className="flex h-full flex-col justify-between gap-8">

        {/* Main content */}
        <div className="min-w-0 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">
            <BookOpen className="h-3.5 w-3.5" />
            Ruang Belajar
          </div>

          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Selamat datang kembali,{' '}
            <span className="text-slate-600">
              {auth?.name || 'Siswa'}
            </span>
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-500 sm:text-sm">
            Lanjutkan materi yang sedang kamu pelajari dan tetap jaga
            konsistensi belajarmu hari ini.
          </p>
        </div>

        {/* Learning status - Bottom Right */}
        <div className="flex items-end justify-end">
          <div className="flex items-center gap-5 border-t border-slate-100 pt-4">
            
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Hari ini
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                Siap belajar?
              </p>
            </div>

            <Link
              to="/learning/explore"
              className="group inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md"
            >
              <span>Mulai belajar</span>

              <ArrowRight className="h-3.5 w-3.5 text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}