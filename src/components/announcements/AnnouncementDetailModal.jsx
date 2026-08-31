import { X, Calendar, Sparkles } from 'lucide-react';

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

export function AnnouncementDetailModal({
  announcement,
  onClose
}) {
  if (!announcement) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="space-y-1.5 pr-2">
            <div className="flex items-center gap-2">
              {getCategoryBadge(announcement.category)}
              {announcement.priority === 'important' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>PENTING</span>
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
              {announcement.title}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-300" />
              <span>Diterbitkan: {new Date(announcement.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {announcement.content}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
