import { Bell, Plus, Search } from 'lucide-react';

export function AdminAnnouncementsHeader({
  searchQuery,
  setSearchQuery,
  totalAnnouncements,
  openCreateModal
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10">
            <Bell className="w-4.5 h-4.5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Broadcast Pengumuman</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          Pusat Pengumuman & Berita
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Terbitkan informasi pembaruan sistem, jadwal, atau pedoman ke seluruh pengguna.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Pengumuman Baru</span>
        </button>
      </div>
    </div>
  );
}
