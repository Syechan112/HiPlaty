import { TrendingUp } from 'lucide-react';

export function StatCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-5 shadow-xs hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium pt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{trend}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-700 shrink-0">
            <Icon className="w-5 h-5" strokeWidth={1.8} />
          </div>
        )}
      </div>
    </div>
  );
}