import { BarChart2, PieChart } from 'lucide-react';

export function DistributionChartHeader({
  dataTab,
  setDataTab,
  viewMode,
  setViewMode,
  batchCount,
  categoryCount
}) {
  return (
    <div className="space-y-4 border-b border-slate-100 pb-5">
      {/* Title & Description */}
      <div className="min-w-0 space-y-1">
        <div className="flex items-center flex-wrap gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0" />
          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Distribusi Produksi & Minat Siswa
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
            Top 5 Teratas
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">
          Peringkat kurikulum berdasarkan volume materi dan keterlibatan siswa
        </p>
      </div>

      {/* Action Controls: Full-Width 2 Equal Columns */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {/* Left Column (50%): Tab Switcher: Batch vs Kategori */}
        <div className="flex bg-slate-100/90 p-1 rounded-xl text-xs font-semibold w-full">
          <button
            type="button"
            onClick={() => setDataTab('batch')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer truncate ${
              dataTab === 'batch'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Batch ({batchCount})
          </button>
          <button
            type="button"
            onClick={() => setDataTab('category')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer truncate ${
              dataTab === 'category'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Kategori ({categoryCount})
          </button>
        </div>

        {/* Right Column (50%): View Mode Switcher: Bar vs Donut */}
        <div className="flex bg-slate-100/90 p-1 rounded-xl text-xs font-semibold w-full">
          <button
            type="button"
            onClick={() => setViewMode('bar')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === 'bar'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-400 hover:text-slate-800'
            }`}
            title="Tampilan Grafik Batang"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Bar</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('donut')}
            className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === 'donut'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-400 hover:text-slate-800'
            }`}
            title="Tampilan Grafik Lingkaran"
          >
            <PieChart className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Donut</span>
          </button>
        </div>
      </div>
    </div>
  );
}
