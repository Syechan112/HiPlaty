import { PieChart } from 'lucide-react';

export function CategoryDistributionCard({
  categoryBreakdown,
  totalLessonsCount
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Distribusi Kategori Topik</h2>
            <p className="text-[11px] text-slate-400">Komposisi materi berdasarkan bidang ilmu</p>
          </div>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Belum ada data materi untuk dianalisis.
          </div>
        ) : (
          <div className="pt-4 space-y-3">
            {categoryBreakdown.map(item => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full ${item.info.color.includes('blue') ? 'bg-blue-500' : item.info.color.includes('emerald') ? 'bg-emerald-500' : item.info.color.includes('purple') ? 'bg-purple-500' : item.info.color.includes('amber') ? 'bg-amber-500' : 'bg-slate-500'}`} />
                    <span className="font-semibold text-slate-800">{item.info.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{item.lessonCount} materi ({item.batchCount} batch)</span>
                    <span className="font-bold font-mono text-slate-900">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Total Tersebar</span>
        <span className="font-mono">{totalLessonsCount} materi terbit</span>
      </div>
    </div>
  );
}
