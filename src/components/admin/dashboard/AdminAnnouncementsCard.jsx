import { Bell, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminAnnouncementsCard({ allAnnouncements, annLoading }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Pengumuman Terakhir</h2>
              <p className="text-[11px] text-slate-400">Broadcast informasi ke pengguna platform</p>
            </div>
          </div>
          <Link
            to="/admin/announcements"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <span>Semua</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {annLoading ? (
          <div className="py-8 text-center text-slate-400 text-xs">Memuat pengumuman...</div>
        ) : allAnnouncements?.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">Belum ada pengumuman yang dibuat.</div>
        ) : (
          <div className="pt-3 divide-y divide-slate-100 space-y-1">
            {allAnnouncements.slice(0, 4).map(a => (
              <div key={a.id} className="py-2.5 flex items-start justify-between gap-2">
                <div className="truncate flex-1">
                  <p className="font-bold text-slate-900 text-xs truncate">{a.title}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{a.content}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">{allAnnouncements?.length || 0} Pengumuman total</span>
        <Link
          to="/admin/announcements"
          className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Buat Pengumuman</span>
        </Link>
      </div>
    </div>
  );
}
