import { useMemo } from 'react';
import { Flame, Clock, CheckCircle2, Bookmark, ArrowUpRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardWhatsNewCard } from './DashboardWhatsNewCard';

export function DashboardStatGrid({
  streak,
  canClaimTodayStreak,
  handleClaimStreak,
  totalStudyTimeFormatted,
  savedBatchesProgress,
  savedBatchesCompletedCount,
  savedBatchesTotalContents,
  savedBatchCount
}) {
  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || currentStreak;

  const weeklyStreak = useMemo(() => {
    const daysName = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const now = new Date();
    const currentDay = now.getDay();
    const distToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const mondayDate = new Date(now);
    mondayDate.setDate(now.getDate() + distToMonday);

    const history = Array.isArray(streak?.history) ? streak.history : [];
    const lastClaim = streak?.lastClaimDate;

    const todayYear = now.getFullYear();
    const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
    const todayDay = String(now.getDate()).padStart(2, '0');
    const todayKey = `${todayYear}-${todayMonth}-${todayDay}`;

    return daysName.map((dayName, i) => {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      const isClaimed = history.includes(dateKey) || lastClaim === dateKey;

      return {
        day: dayName,
        dateKey,
        dateNum: d.getDate(),
        isToday: dateKey === todayKey,
        active: Boolean(isClaimed)
      };
    });
  }, [streak?.history, streak?.lastClaimDate]);

  return (
    <div className="font-['Poppins',sans-serif] grid grid-cols-1 lg:grid-cols-12 gap-5">
      
      {/* CARD 1: STREAK BELAJAR */}
      <div className="lg:col-span-4 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 tracking-tight uppercase">Streak Belajar</h3>
              <p className="text-[11px] text-slate-400 font-medium">Konsistensi Harian</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-semibold text-slate-400">Rekor:</span>
            <span className="text-xs font-bold text-slate-800">{longestStreak} Hari</span>
          </div>
        </div>

        {/* Big Counter */}
        <div className="my-5 text-center flex flex-col items-center justify-center">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-6xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-none">
              {currentStreak}
            </span>
            <span className="text-lg font-bold text-amber-500">
              Hari
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-2">Streak Belajar Aktif</p>
        </div>

        {/* Weekly Tracker */}
        <div className="pt-4 border-t border-slate-100/80">
          <div className="flex items-center justify-between gap-1">
            {weeklyStreak.map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-1.5">
                <div 
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                    item.active 
                      ? 'bg-amber-500 text-white shadow-xs' 
                      : item.isToday
                      ? 'bg-slate-100 border-2 border-slate-300 text-slate-400'
                      : 'bg-slate-50 text-slate-300'
                  }`}
                >
                  <Flame 
                    className={`w-4 h-4 ${
                      item.active 
                        ? 'fill-white text-white' 
                        : 'fill-slate-200 text-slate-300'
                    }`} 
                  />
                </div>
                
                <span className={`text-[10px] font-semibold ${item.active ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          {/* Claim Streak Action Button */}
          <div className="mt-4 pt-3 border-t border-slate-100/80">
            {canClaimTodayStreak ? (
              <button
                type="button"
                onClick={handleClaimStreak}
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <Flame className="w-4 h-4 fill-white text-white" />
                <span>Klaim Streak Hari Ini</span>
              </button>
            ) : (
              <div className="w-full py-2 px-3 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-semibold text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Streak Hari Ini Telah Diklaim</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* CARD GROUP 2: RINGKASAN METRIK (3 MINI CARDS) */}
      <div className="lg:col-span-4 flex flex-col gap-3.5 justify-between">
        
        {/* Waktu Baca */}
        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm flex items-center justify-between flex-1">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Waktu Baca
            </span>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {totalStudyTimeFormatted || '0 Menit'}
            </p>
            <p className="text-[11px] font-medium text-slate-400">Total Durasi Belajar</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Clock className="w-5.5 h-5.5 text-violet-600" />
          </div>
        </div>

        {/* Ketuntasan */}
        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm flex flex-col justify-between flex-1">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Ketuntasan
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                  {savedBatchesCompletedCount}/{savedBatchesTotalContents} Materi
                </span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {savedBatchesProgress}%
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5.5 h-5.5 text-emerald-600" />
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, savedBatchesProgress))}%` }}
            />
          </div>
        </div>

        {/* Kelas Tersimpan */}
        <Link
          to="/learning/study"
          className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm flex items-center justify-between hover:border-slate-200 hover:shadow-md transition-all block group flex-1"
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Tersimpan
            </span>
            <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {savedBatchCount} <span className="text-xs font-semibold text-slate-400">Kelas</span>
            </p>
            <p className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Buka Kelas <ArrowUpRight className="w-3.5 h-3.5" />
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Bookmark className="w-5.5 h-5.5 text-blue-600" />
          </div>
        </Link>

      </div>

      {/* CARD 3: WHAT'S NEW CARD */}
      <div className="lg:col-span-4">
        <DashboardWhatsNewCard />
      </div>

    </div>
  );
}