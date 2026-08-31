import { Link } from 'react-router-dom';
import { Layers, ArrowRight, BookOpen, Compass, Sparkles } from 'lucide-react';
import { getCategoryInfo } from '../../config/contentCategories';

export function SavedBatchesSection({ savedBatches }) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-7 flex flex-col justify-between font-['Poppins',sans-serif]">
      
      {/* Header Section */}
      <div>
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5 text-slate-100" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base tracking-tight">Materi di Ruang Belajar</h2>
              <p className="text-xs text-slate-400 font-medium">Kelas yang sedang aktif kamu pelajari</p>
            </div>
          </div>

          <Link
            to="/learning/study"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-full border border-slate-200/60 flex items-center gap-1.5 transition-all"
          >
            <span>Semua Kelas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Content Section */}
        {savedBatches.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 text-sm">Belum ada kelas tersimpan</p>
              <p className="text-slate-400 text-[11px]">Tambahkan materi pelajaran ke Ruang Belajarmu.</p>
            </div>
            <Link
              to="/learning/explore"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Jelajahi Materi Sekarang</span>
            </Link>
          </div>
        ) : (
          <div className="pt-3 space-y-2.5">
            {savedBatches.slice(0, 4).map((b) => {
              const catInfo = getCategoryInfo(b.category);
              const lessonCount = b.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0;

              return (
                <div 
                  key={b.batchId} 
                  className="p-3.5 bg-slate-50/60 hover:bg-slate-100/80 rounded-2xl border border-slate-100/80 flex items-center justify-between gap-3 transition-all group"
                >
                  <div className="truncate flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                      <h3 className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {b.batchName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                      <BookOpen className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{b.modules?.length || 0} Modul</span>
                      <span>•</span>
                      <span>{lessonCount} Materi</span>
                    </div>
                  </div>

                  <Link
                    to={`/learning/study?batchId=${b.batchId}`}
                    className="px-4 py-2 bg-white hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200/80 rounded-xl text-xs font-bold transition-all shrink-0 shadow-2xs"
                  >
                    Buka
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium">
          Menampilkan <strong className="text-slate-800 font-semibold">{Math.min(4, savedBatches.length)}</strong> dari <strong className="text-slate-800 font-semibold">{savedBatches.length}</strong> kelas
        </span>
        <Link to="/learning/explore" className="text-slate-900 font-bold hover:text-blue-600 transition-colors">
          + Cari Kelas Lain
        </Link>
      </div>

    </div>
  );
}