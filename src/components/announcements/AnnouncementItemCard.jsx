import { Calendar, ChevronRight, Sparkles } from 'lucide-react';

function getCategoryBadge(cat) {
  switch (cat) {
    case 'update':
      return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">Pembaruan</span>;
    case 'system':
      return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">Sistem</span>;
    case 'guide':
      return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">Panduan</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">Pengumuman</span>;
  }
}

export function AnnouncementItemCard({
  announcement,
  isRead,
  onOpen
}) {
  const isAnnouncementRead = isRead(announcement.id);

  return (
    <div
      onClick={() => onOpen(announcement)}
      className={`rounded-2xl border transition-all p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group ${
        isAnnouncementRead
          ? 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
          : 'bg-blue-50/20 border-blue-200/80 hover:border-blue-300 shadow-xs'
      }`}
    >
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {getCategoryBadge(announcement.category)}
          
          {announcement.priority === 'important' && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>PENTING</span>
            </span>
          )}

          {!isAnnouncementRead && (
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
          )}

          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-300" />
            {new Date(announcement.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        <h2 className={`text-sm sm:text-base font-bold tracking-tight truncate ${
          isAnnouncementRead ? 'text-slate-900' : 'text-slate-900 font-extrabold'
        }`}>
          {announcement.title}
        </h2>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {announcement.content}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors shrink-0">
        <span>Baca Selengkapnya</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}
