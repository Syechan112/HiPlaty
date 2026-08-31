import { ArrowRight, BookOpen, CheckCircle2, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getCategoryInfo } from '../config/contentCategories';

export function CourseCard({ batch, progress }) {
  const { isEducator, isAdmin } = useAuth();
  const progressPercent = Math.min(100, Math.max(0, progress || 0));

  const totalModules = batch.modules?.length || 0;
  const totalContents = batch.modules?.reduce((acc, m) => acc + (m.contents?.length || 0), 0) || 0;
  const batchCategory = batch.category || (batch.categories && batch.categories[0]) || 'general';
  const catInfo = getCategoryInfo(batchCategory);

  const targetLink = isEducator || isAdmin 
    ? '/educator/contents' 
    : `/learning/study?batchId=${encodeURIComponent(batch.batchId)}`;

  const isCompleted = progressPercent === 100;
  const isInProgress = progressPercent > 0 && !isCompleted;

  const ctaLabel = isEducator || isAdmin 
    ? 'Kelola Materi' 
    : isCompleted 
      ? 'Ulas Kembali' 
      : isInProgress 
        ? 'Lanjutkan Belajar' 
        : 'Mulai Belajar';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border truncate ${catInfo.color}`}>
              {catInfo.label}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              • {totalModules} Modul
            </span>
          </div>

          {isCompleted ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Selesai</span>
            </span>
          ) : isInProgress ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
              {progressPercent}% Berjalan
            </span>
          ) : (
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">
              Belum Dimulai
            </span>
          )}
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
            {batch.batchName}
          </h3>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Progres Belajar</span>
            <span className="font-bold text-slate-800">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted 
                  ? 'bg-emerald-500' 
                  : isInProgress 
                    ? 'bg-slate-900' 
                    : 'bg-slate-200'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {batch.modules && batch.modules.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Silabus:
            </span>
            <ul className="space-y-1 text-xs text-slate-600">
              {batch.modules.slice(0, 2).map((m, idx) => (
                <li key={m.moduleId || idx} className="flex items-center gap-2 truncate text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="truncate">{m.moduleTitle}</span>
                </li>
              ))}
              {totalModules > 2 && (
                <li className="text-[10px] text-slate-500 font-medium pt-0.5">
                  + {totalModules - 2} modul lainnya
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Kurikulum</span>
        </span>

        <Link
          to={targetLink}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
          }`}
        >
          <span>{ctaLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}