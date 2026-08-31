import { useState, useRef, useEffect, useMemo } from 'react';
import { BarChart3, ChevronDown, ArrowUpRight, Calendar, Check } from 'lucide-react';

const VIEW_OPTIONS = [
  { value: 'day', label: 'Harian' },
  { value: 'month', label: 'Bulanan' },
  { value: 'year', label: 'Tahunan' },
];

export function StudyTimeChartCard({
  chartViewMode,
  setChartViewMode,
  activeChartData
}) {
  const chartItems = Array.isArray(activeChartData)
    ? activeChartData
    : (activeChartData?.chartData || []);

  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalMinutes = chartItems.reduce((acc, curr) => acc + (curr.minutes || 0), 0);
  const avgMinutes = chartItems.length > 0 ? Math.round(totalMinutes / chartItems.length) : 0;
  const maxMinutes = Math.max(...chartItems.map(d => d.minutes || 0), 1);

  const todayIndex = chartItems.findIndex(i => i.isToday || i.isCurrentMonth || i.isCurrentYear);
  const activeIndex = hoveredIdx !== null ? hoveredIdx : (todayIndex !== -1 ? todayIndex : chartItems.length - 1);
  const activeItem = chartItems[activeIndex] || null;

  const { points, pathD, areaD } = useMemo(() => {
    if (!chartItems.length) return { points: [], pathD: '', areaD: '' };

    const width = 320;
    const height = 95;
    const padding = 12;

    const pts = chartItems.map((item, index) => {
      const x = padding + (index / Math.max(chartItems.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((item.minutes || 0) / maxMinutes) * (height - padding * 2.5);
      return { ...item, x, y, index };
    });

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const mx = (curr.x + next.x) / 2;
      d += ` C ${mx} ${curr.y}, ${mx} ${next.y}, ${next.x} ${next.y}`;
    }

    const area = `${d} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`;

    return { points: pts, pathD: d, areaD: area };
  }, [chartItems, maxMinutes]);

  const activePoint = points[activeIndex] || points[points.length - 1];

  const getFullDateDisplay = (item) => {
    if (!item) return '';
    if (chartViewMode === 'day') {
      if (item.dateKey) {
        const d = new Date(item.dateKey);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }
      }
      return `${item.full || item.day}, ${new Date().getFullYear()}`;
    }
    if (chartViewMode === 'month') {
      const itemYear = item.monthKey ? item.monthKey.split('-')[0] : new Date().getFullYear();
      return `Bulan ${item.label} ${itemYear}`;
    }
    return `Tahun ${item.label || item.yearKey || new Date().getFullYear()}`;
  };

  const getSubDateRange = () => {
    if (!chartItems.length) return '';
    if (chartViewMode === 'day') {
      const first = chartItems[0];
      const last = chartItems[chartItems.length - 1];
      const firstYear = first?.dateKey ? new Date(first.dateKey).getFullYear() : new Date().getFullYear();
      const lastYear = last?.dateKey ? new Date(last.dateKey).getFullYear() : firstYear;
      const yearDisplay = firstYear === lastYear ? firstYear : `${firstYear}/${lastYear}`;
      return `${first.day} ${first.dateStr || ''} – ${last.day} ${last.dateStr || ''} ${yearDisplay}`;
    }
    if (chartViewMode === 'month') {
      const y = chartItems[0]?.monthKey ? chartItems[0].monthKey.split('-')[0] : new Date().getFullYear();
      return `Tahun ${y} (12 Bulan)`;
    }
    const startYear = chartItems[0]?.label || chartItems[0]?.yearKey;
    const endYear = chartItems[chartItems.length - 1]?.label || chartItems[chartItems.length - 1]?.yearKey;
    return `Periode ${startYear} – ${endYear}`;
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 sm:p-7 flex flex-col justify-between relative font-['Poppins',sans-serif]">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm tracking-tight">Statistik Belajar</h2>
            </div>
          </div>

          {/* Custom Styled Filter Dropdown */}
          <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 hover:border-slate-300 text-slate-700 text-xs font-semibold py-1.5 px-3.5 rounded-full transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <span>{VIEW_OPTIONS.find(opt => opt.value === chartViewMode)?.label || 'Harian'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-slate-700' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                {VIEW_OPTIONS.map((opt) => {
                  const isSelected = chartViewMode === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setChartViewMode(opt.value);
                        setHoveredIdx(null);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-orange-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Big Metric Display with Active Date & Minutes */}
        <div className="mt-4 flex items-end justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold tracking-wider uppercase mb-0.5">
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span>{activeItem ? getFullDateDisplay(activeItem) : 'Rata-rata Durasi'}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {activeItem ? (activeItem.minutes || 0) : avgMinutes}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400">
                Menit {activeItem && hoveredIdx !== null ? 'Belajar' : '/ Hari'}
              </span>
              <ArrowUpRight className="w-4 h-4 text-amber-500 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* SVG Area Chart */}
        <div className="mt-5 relative h-28 w-full flex items-center justify-center">
          {chartItems.length > 0 ? (
            <svg viewBox="0 0 320 95" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="orangeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path d={areaD} fill="url(#orangeAreaGrad)" />

              <path
                d={pathD}
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {activePoint && (
                <g>
                  <line
                    x1={activePoint.x}
                    y1={activePoint.y}
                    x2={activePoint.x}
                    y2="95"
                    stroke="#f97316"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                  <circle
                    cx={activePoint.x}
                    cy={activePoint.y}
                    r="5"
                    className="fill-orange-500 animate-pulse"
                  />
                  <circle
                    cx={activePoint.x}
                    cy={activePoint.y}
                    r="2.5"
                    className="fill-white"
                  />
                </g>
              )}

              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="12"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              ))}
            </svg>
          ) : (
            <div className="text-xs text-slate-300 font-medium">Belum ada data aktivitas</div>
          )}
        </div>

        {/* X-Axis Date & Day Grid */}
        <div className={`mt-3 grid gap-1 ${
          chartViewMode === 'month' ? 'grid-cols-6 sm:grid-cols-12' : chartViewMode === 'year' ? 'grid-cols-3' : 'grid-cols-7'
        }`}>
          {chartItems.map((item, idx) => {
            const isSelected = activeIndex === idx;
            const isToday = item.isToday || item.isCurrentMonth || item.isCurrentYear;

            return (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => setHoveredIdx(idx)}
                className={`py-1 px-0.5 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-50 text-orange-600 font-extrabold'
                    : isToday
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <span className="text-[10px] leading-tight">
                  {item.day || item.label}
                </span>
                {chartViewMode === 'day' && item.dateNum && (
                  <span className={`text-[9px] font-mono leading-tight ${isSelected ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
                    {item.dateNum}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium">
          Total: <strong className="text-slate-800 font-semibold">{totalMinutes} Menit</strong>
        </span>
        <span className="text-[11px] text-slate-500 font-medium truncate max-w-[55%] text-right">
          {getSubDateRange()}
        </span>
      </div>
    </div>
  );
}