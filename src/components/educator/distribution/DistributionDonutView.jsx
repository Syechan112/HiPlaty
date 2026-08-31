export function DistributionDonutView({
  donutSegments = [],
  totalVolume = 0,
  dataTab = 'batch'
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-2">
      {/* Central SVG Donut Chart */}
      <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform overflow-visible">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth="11"
          />
          {donutSegments.map((seg, i) => (
            <circle
              key={i}
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={seg.color}
              strokeWidth="11"
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total Top 5
          </span>
          <span className="text-3xl font-black text-slate-900 font-mono tracking-tight leading-none my-1">
            {totalVolume}
          </span>
          <span className="text-[10px] text-slate-500 font-semibold">Materi</span>
        </div>
      </div>

      {/* Legend List */}
      <div className="flex-1 w-full space-y-2 max-w-lg">
        {donutSegments.map((seg, i) => {
          const label = dataTab === 'batch' ? seg.name : seg.info?.label;
          const value = dataTab === 'batch' ? seg.lessons : seg.lessonCount;

          return (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span 
                  className="w-3 h-3 rounded-full shrink-0 shadow-2xs" 
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-xs font-bold text-slate-800 truncate">
                  {label}
                </span>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 text-xs">
                <span className="font-mono text-slate-500 text-[11px]">
                  {value} Materi
                </span>
                <span className="px-2 py-0.5 rounded-md font-mono font-extrabold text-[11px] bg-white border border-slate-200 text-slate-900 shadow-2xs">
                  {seg.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
