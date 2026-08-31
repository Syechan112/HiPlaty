import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useLearningTracker } from '../hooks/useLearningTracker';

export function CuteCalendarCard() {
  const { streak } = useLearningTracker();
  const [viewDate, setViewDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString('id-ID', { month: 'long' });
  const timeString = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleGoToday = () => {
    setViewDate(new Date());
  };

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();

    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days = [];

    const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        dateNumber: prevMonthLastDate - i,
        isCurrentMonth: false,
        isToday: false,
        dateKey: ''
      });
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const isToday = currentYear === todayYear && currentMonth === todayMonth && d === todayDate;
      const monthStr = String(currentMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
      const hasStreak = streak?.history?.includes(dateKey);

      days.push({
        dateNumber: d,
        isCurrentMonth: true,
        isToday,
        dateKey,
        hasStreak
      });
    }

    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        dateNumber: i,
        isCurrentMonth: false,
        isToday: false,
        dateKey: ''
      });
    }

    return days;
  }, [currentYear, currentMonth, todayYear, todayMonth, todayDate, streak?.history]);

  const weekHeaders = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="h-full rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between font-['Poppins',sans-serif]">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm capitalize">
              {monthName} {currentYear}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={handleGoToday}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors cursor-pointer"
            title="Kembali ke Hari Ini"
          >
            Hari Ini
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Bulan Berikutnya"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center">
        {weekHeaders.map((day, idx) => {
          const isWeekend = idx >= 5;
          return (
            <span
              key={day}
              className={`text-[10px] font-semibold uppercase py-0.5 rounded ${
                isWeekend ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-1 py-1">
        {calendarDays.map((item, idx) => {
          if (!item.isCurrentMonth) {
            return (
              <div
                key={'pad-' + idx}
                className="h-8 flex items-center justify-center text-slate-300 text-xs font-medium select-none"
              >
                {item.dateNumber}
              </div>
            );
          }

          return (
            <div
              key={'day-' + item.dateKey + idx}
              className={`h-8 rounded-lg flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
                item.isToday
                  ? 'bg-slate-900 text-white font-bold'
                  : item.hasStreak
                    ? 'bg-amber-50 border border-amber-200 text-amber-900 font-semibold'
                    : 'bg-white hover:bg-slate-50 border border-slate-100 text-slate-700 font-medium'
              }`}
            >
              <span className="text-xs leading-none">{item.dateNumber}</span>
              {item.hasStreak && !item.isToday && (
                <div className="w-1 h-1 rounded-full bg-amber-500 mt-0.5" />
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="capitalize">{today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
        </div>

        <div className="inline-flex items-center gap-1 text-slate-400 font-mono text-[10px]">
          <Clock className="w-3 h-3" />
          <span>{timeString}</span>
        </div>
      </div>
    </div>
  );
}
