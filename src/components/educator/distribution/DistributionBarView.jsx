import { Bookmark } from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';
import { RANK_ACCENTS } from '../../../constants/chartPalettes';

export function DistributionBarView({
  dataTab,
  top5Batches,
  top5Categories,
  maxVal,
  onSelectBatch
}) {
  if (dataTab === 'batch') {
    return (
      <div className="space-y-3">
        {top5Batches.map((item, idx) => {
          const cat = getCategoryInfo(item.category);
          const widthPct = Math.max(Math.round(((item.lessons || 0) / maxVal) * 100), 10);
          const rank = RANK_ACCENTS[idx] || RANK_ACCENTS[4];

          return (
            <div 
              key={item.id || idx} 
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-6 h-6 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${rank.bg}`}>
                    #{idx + 1}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border truncate shrink-0 ${cat.color}`}>
                    {cat.label}
                  </span>
                  <h3 className="font-bold text-xs text-slate-900 truncate">
                    {item.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 text-xs">
                  {onSelectBatch && (
                    <button
                      type="button"
                      onClick={() => onSelectBatch({ batchId: item.id, batchName: item.name })}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-lg transition-all cursor-pointer shadow-2xs text-[11px]"
                      title="Lihat daftar siswa yang menyimpan batch ini"
                    >
                      <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{item.saves || 0} Siswa</span>
                    </button>
                  )}
                  <span className="text-slate-400 font-medium">{item.modules} Modul</span>
                  <span className="font-extrabold text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-slate-200/80">
                    {item.lessons} Materi
                  </span>
                </div>
              </div>

              <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {top5Categories.map((item, idx) => {
        const widthPct = Math.max(Math.round(((item.lessonCount || 0) / maxVal) * 100), 10);
        const rank = RANK_ACCENTS[idx] || RANK_ACCENTS[4];

        return (
          <div 
            key={item.category || idx} 
            className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all space-y-3"
          >
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-6 h-6 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${rank.bg}`}>
                  #{idx + 1}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border truncate shrink-0 ${item.info.color}`}>
                  {item.info.label}
                </span>
                <p className="text-xs text-slate-500 truncate hidden sm:inline">
                  {item.info.description}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 text-xs">
                <span className="text-slate-400 font-medium">{item.batchCount} Batch</span>
                <span className="font-extrabold text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-slate-200/80">
                  {item.lessonCount} Materi
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
