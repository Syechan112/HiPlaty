import {
  TrendingUp,
  BarChart2,
  PieChart,
  Bookmark
} from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';

export function TopBatchesRankCard({
  topRankedBatches,
  chartMode,
  setChartMode,
  totalSavesCount,
  setSelectedModalItem,
  setModalSearchQuery
}) {
  const chartBatches = topRankedBatches.slice(0, 5);

  const totalChartSaves = chartBatches.reduce(
    (sum, batch) => sum + (batch.savesCount || 0),
    0
  );

  const openBatchModal = (batch) => {
    setSelectedModalItem(batch);
    setModalSearchQuery('');
  };

  const chartColors = [
    {
      stroke: 'stroke-blue-300',
      dot: 'bg-blue-300'
    },
    {
      stroke: 'stroke-violet-300',
      dot: 'bg-violet-300'
    },
    {
      stroke: 'stroke-amber-300',
      dot: 'bg-amber-300'
    },
    {
      stroke: 'stroke-emerald-300',
      dot: 'bg-emerald-300'
    },
    {
      stroke: 'stroke-rose-300',
      dot: 'bg-rose-300'
    }
  ];

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(15,23,42,0.035)]">

      <div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">

          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
              <TrendingUp
                className="h-4 w-4"
                strokeWidth={2}
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-bold text-slate-900">
                Batch Paling Banyak Disimpan
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-400">
                Peringkat performa kurikulum Anda
              </p>
            </div>
          </div>

          {/* Chart Mode */}
          <div className="flex shrink-0 items-center rounded-xl bg-slate-100/80 p-1">

            <button
              type="button"
              onClick={() => setChartMode('bar')}
              className={`
                flex h-7 w-7 items-center justify-center
                rounded-lg
                transition-all duration-150
                cursor-pointer
                ${
                  chartMode === 'bar'
                    ? 'bg-white text-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
                    : 'text-slate-400 hover:text-slate-600'
                }
              `}
              title="Diagram Batang"
              aria-label="Diagram Batang"
            >
              <BarChart2
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
            </button>

            <button
              type="button"
              onClick={() => setChartMode('pie')}
              className={`
                flex h-7 w-7 items-center justify-center
                rounded-lg
                transition-all duration-150
                cursor-pointer
                ${
                  chartMode === 'pie'
                    ? 'bg-white text-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.08)]'
                    : 'text-slate-400 hover:text-slate-600'
                }
              `}
              title="Diagram Lingkaran"
              aria-label="Diagram Lingkaran"
            >
              <PieChart
                className="h-3.5 w-3.5"
                strokeWidth={2}
              />
            </button>

          </div>
        </div>

        {/* Empty State */}
        {chartBatches.length === 0 ? (

          <div className="py-12 text-center text-xs text-slate-400">
            Belum ada data kurikulum yang diterbitkan.
          </div>

        ) : chartMode === 'bar' ? (

          /* =========================
             BAR CHART
          ========================= */
          <div className="space-y-3.5 pt-4">

            {chartBatches.map((b, idx) => {
              const catInfo = getCategoryInfo(b.category);

              const maxSaves =
                chartBatches[0]?.savesCount || 1;

              const percent =
                maxSaves > 0
                  ? Math.round(
                      (b.savesCount / maxSaves) * 100
                    )
                  : 0;

              return (
                <div
                  key={b.batchId}
                  className="group space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">

                    <div className="flex min-w-0 items-center gap-2">

                      <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                        {idx + 1}
                      </span>

                      <span className="truncate font-bold text-slate-900">
                        {b.batchName}
                      </span>

                      <span
                        className={`
                          hidden truncate rounded border
                          px-1.5 py-0.5
                          text-[9px] font-semibold
                          sm:inline
                          ${catInfo.color}
                        `}
                      >
                        {catInfo.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openBatchModal(b)}
                      className="
                        flex shrink-0 items-center gap-1
                        text-[11px] font-bold
                        text-slate-700
                        transition-colors
                        hover:text-slate-950
                        cursor-pointer
                      "
                    >
                      <Bookmark
                        className="h-3 w-3 text-slate-400"
                        strokeWidth={2}
                      />

                      <span className="font-mono">
                        {b.savesCount}
                      </span>

                      <span className="hidden sm:inline">
                        simpan
                      </span>
                    </button>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-700 transition-all duration-500"
                      style={{
                        width: `${Math.max(5, percent)}%`
                      }}
                    />
                  </div>
                </div>
              );
            })}

          </div>

        ) : (

          /* =========================
             DONUT CHART
          ========================= */
          <div className="flex flex-col items-center gap-5 pt-5 sm:flex-row sm:items-center sm:justify-center sm:gap-8">

            {/* Donut */}
            <div className="relative h-40 w-40 shrink-0">

              <svg
                viewBox="0 0 100 100"
                className="h-full w-full -rotate-90"
              >
                {/* Background */}
                <circle
                  cx="50"
                  cy="50"
                  r="37"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="13"
                  className="text-slate-100"
                />

                {totalChartSaves > 0 &&
                  (() => {
                    const circumference = 2 * Math.PI * 37;
                    let accumulated = 0;

                    return chartBatches.map((batch, index) => {
                      const value = batch.savesCount || 0;

                      const percentage =
                        value / totalChartSaves;

                      const dashLength =
                        percentage * circumference;

                      const dashOffset =
                        -accumulated * circumference;

                      accumulated += percentage;

                      const color =
                        chartColors[index];

                      return (
                        <circle
                          key={batch.batchId}
                          cx="50"
                          cy="50"
                          r="37"
                          fill="none"
                          strokeWidth="13"
                          strokeLinecap="butt"
                          strokeDasharray={`${dashLength} ${circumference}`}
                          strokeDashoffset={dashOffset}
                          className={color.stroke}
                        />
                      );
                    });
                  })()}
              </svg>

              {/* Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-bold tracking-tight text-slate-900">
                  {totalChartSaves}
                </span>

                <span className="mt-0.5 text-[9px] font-semibold text-slate-400">
                  Total Simpan
                </span>
              </div>
            </div>

            {/* Legend - ALWAYS 5 */}
            <div className="w-full min-w-0 max-w-xs space-y-1">

              {chartBatches.map((b, idx) => {
                const percentage =
                  totalChartSaves > 0
                    ? Math.round(
                        ((b.savesCount || 0) /
                          totalChartSaves) *
                          100
                      )
                    : 0;

                const color =
                  chartColors[idx];

                return (
                  <button
                    key={b.batchId}
                    type="button"
                    onClick={() => openBatchModal(b)}
                    className="
                      flex w-full items-center gap-2.5
                      rounded-lg
                      px-2 py-1.5
                      text-left
                      transition-colors
                      hover:bg-slate-50
                      cursor-pointer
                    "
                  >
                    {/* Color */}
                    <span
                      className={`
                        h-2.5 w-2.5
                        shrink-0
                        rounded-full
                        ${color.dot}
                      `}
                    />

                    {/* Name */}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-bold text-slate-800">
                        {b.batchName}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        {b.savesCount} siswa
                      </span>
                    </span>

                    {/* Percentage */}
                    <span className="shrink-0 font-mono text-[10px] font-bold text-slate-500">
                      {percentage}%
                    </span>
                  </button>
                );
              })}

            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
        <span>
          Menampilkan {chartBatches.length} batch teratas
        </span>

        <span className="font-mono">
          {totalSavesCount} Total bookmark
        </span>
      </div>

    </div>
  );
}