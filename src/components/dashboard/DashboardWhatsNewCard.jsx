import { Sparkles, Megaphone, MessageSquare, Users2, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useChat } from '../../hooks/useChat';
import { useStudyGroup } from '../../hooks/useStudyGroup';

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h lalu`;
}

export function DashboardWhatsNewCard() {
  const { announcements, unreadCount: unreadAnnCount } = useAnnouncements();
  const { allRecentMessages, unreadChatCount } = useChat();
  const { groups } = useStudyGroup();

  const latestAnnouncement = announcements?.[0];
  const latestFriendChat = allRecentMessages?.[0];
  const latestGroup = groups?.[0];

  const totalNewBadges = (unreadAnnCount || 0) + (unreadChatCount || 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between h-full space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Ada Apa yang Baru?</h3>
            <p className="text-[11px] text-slate-400 font-medium">Update & Aktivitas Terbaru</p>
          </div>
        </div>

        {totalNewBadges > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60 animate-pulse">
            {totalNewBadges} Baru
          </span>
        )}
      </div>

      <div className="space-y-2.5 flex-1">
        {/* 1. Pengumuman Admin */}
        <Link
          to="/announcements"
          className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-amber-50/40 hover:border-amber-200/60 transition-all flex items-start gap-3 group block"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <Megaphone className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                Pengumuman Admin
              </span>
              {latestAnnouncement?.createdAt && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatRelativeTime(latestAnnouncement.createdAt)}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-800 truncate mt-0.5 group-hover:text-amber-700 transition-colors">
              {latestAnnouncement?.title || 'Belum ada pengumuman baru'}
            </p>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {latestAnnouncement?.content || 'Pemberitahuan resmi dan info sistem'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 shrink-0 self-center transition-colors" />
        </Link>

        {/* 2. Chat Teman */}
        <Link
          to="/chat"
          className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-violet-50/40 hover:border-violet-200/60 transition-all flex items-start gap-3 group block"
        >
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0 mt-0.5">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">
                Pesan Teman
              </span>
              {unreadChatCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-violet-100 text-violet-700">
                  {unreadChatCount} unread
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-800 truncate mt-0.5 group-hover:text-violet-700 transition-colors">
              {latestFriendChat?.senderName ? `Dari ${latestFriendChat.senderName}` : 'Pesan Langsung'}
            </p>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {latestFriendChat?.messageText || 'Buka ruang obrolan untuk saling berdiskusi'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-600 shrink-0 self-center transition-colors" />
        </Link>

        {/* 3. Chat Study Group */}
        <Link
          to="/study-group"
          className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-blue-50/40 hover:border-blue-200/60 transition-all flex items-start gap-3 group block"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <Users2 className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                Kelompok Belajar
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {groups?.length || 0} Grup
              </span>
            </div>
            <p className="text-xs font-bold text-slate-800 truncate mt-0.5 group-hover:text-blue-700 transition-colors">
              {latestGroup?.name || 'Study Group Komunitas'}
            </p>
            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
              {latestGroup?.description || 'Kolaborasi dan bagikan kurikulum bersama'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 self-center transition-colors" />
        </Link>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Semua pusat aktivitas terhubung</span>
        <Link to="/announcements" className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
          Lihat Semua <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
