import { Search, Edit3, Trash2, Bell, Sparkles, Layers, Info, Users, GraduationCap } from 'lucide-react';

function getCategoryBadge(cat) {
  switch (cat) {
    case 'update':
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">Pembaruan</span>;
    case 'system':
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">Sistem</span>;
    case 'guide':
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">Panduan</span>;
    default:
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">Informasi</span>;
  }
}

function getTargetBadge(target) {
  switch (target) {
    case 'student':
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200/60">Khusus Siswa</span>;
    case 'educator':
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60">Khusus Guru</span>;
    default:
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200/60">Semua Pengguna</span>;
  }
}

export function AdminAnnouncementsList({
  filteredAnnouncements,
  searchQuery,
  setSearchQuery,
  openEditModal,
  handleDelete
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Search Input */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, isi pengumuman, atau kategori..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="text-xs text-slate-400 font-medium shrink-0">
          Total: <strong className="text-slate-900 font-mono">{filteredAnnouncements.length}</strong> pengumuman
        </div>
      </div>

      {/* List / Cards */}
      {filteredAnnouncements.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Belum ada pengumuman yang sesuai.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredAnnouncements.map((a) => (
            <div key={a.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getCategoryBadge(a.category)}
                  {getTargetBadge(a.targetRole)}
                  {a.priority === 'important' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>PENTING</span>
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  {a.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {a.content}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => openEditModal(a)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-all shadow-2xs cursor-pointer"
                  title="Edit Pengumuman"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(a.id, a.title)}
                  className="p-2 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 rounded-xl transition-all shadow-2xs cursor-pointer"
                  title="Hapus Pengumuman"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
