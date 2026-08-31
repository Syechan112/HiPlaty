import { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { TopNav } from '../components/TopNav';
import { Sidebar } from '../components/Sidebar';
import { AnnouncementItemCard } from '../components/announcements/AnnouncementItemCard';
import { AnnouncementDetailModal } from '../components/announcements/AnnouncementDetailModal';
import { Bell, CheckCheck, Search, Info } from 'lucide-react';

export function AnnouncementsPage() {
  const { auth } = useAuth();
  const { announcements, unreadCount, markAsRead, markAllAsRead, isRead } = useAnnouncements();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalAnn, setActiveModalAnn] = useState(null);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(a => {
      const matchCategory = selectedCategory === 'all' || a.category === selectedCategory;
      const matchQuery = !searchQuery.trim() || 
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.content?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [announcements, selectedCategory, searchQuery]);

  const handleOpenAnnouncement = (ann) => {
    markAsRead(ann.id);
    setActiveModalAnn(ann);
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNav userName={auth?.name} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Header Banner */}
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5" />
                    Pusat Informasi
                  </span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md animate-pulse">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Informasi & Pembaruan Sistem
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Kumpulan pengumuman resmi, rilis fitur baru, dan panduan belajar dari tim administrator.
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer shrink-0"
                >
                  <CheckCheck className="w-4 h-4 text-slate-500" />
                  <span>Tandai Semua Dibaca</span>
                </button>
              )}
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { key: 'all', label: 'Semua' },
                  { key: 'update', label: 'Pembaruan Fitur' },
                  { key: 'system', label: 'Sistem' },
                  { key: 'guide', label: 'Panduan' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedCategory(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === tab.key
                        ? 'bg-slate-900 text-white shadow-2xs font-bold'
                        : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari info pengumuman..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400"
                />
              </div>
            </div>

            {/* List */}
            {filteredAnnouncements.length === 0 ? (
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-12 text-center text-slate-400 space-y-2 shadow-xs">
                <Info className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-700">Tidak ada pengumuman</p>
                <p className="text-[11px]">Belum ada informasi yang sesuai dengan filter atau kata kunci pencarian Anda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAnnouncements.map((ann) => (
                  <AnnouncementItemCard
                    key={ann.id}
                    announcement={ann}
                    isRead={isRead}
                    onOpen={handleOpenAnnouncement}
                  />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <AnnouncementDetailModal
        announcement={activeModalAnn}
        onClose={() => setActiveModalAnn(null)}
      />
    </div>
  );
}
