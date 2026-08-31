import { X, Sparkles, Layers, Info, Bell, Users, GraduationCap } from 'lucide-react';

const categoryOptions = [
  { value: 'update', label: 'Pembaruan', desc: 'Rilis fitur baru & peningkatan performa' },
  { value: 'system', label: 'Sistem', desc: 'Pemeliharaan server & kestabilan data' },
  { value: 'guide', label: 'Panduan', desc: 'Tutorial & cara menggunakan fitur aplikasi' },
  { value: 'notice', label: 'Pengumuman', desc: 'Informasi umum & himbauan administrator' }
];

export function AnnouncementFormModal({
  isOpen,
  onClose,
  modalMode,
  formData,
  setFormData,
  handleSubmit
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {modalMode === 'create' ? 'Buat Pengumuman Baru' : 'Edit Pengumuman'}
            </h3>
            <p className="text-xs text-slate-400">Siarkan berita ini ke seluruh pengguna aplikasi</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Judul Pengumuman *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Contoh: Rilis Fitur Baru Editor Konten"
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                {categoryOptions.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Prioritas *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="normal">Normal</option>
                <option value="important">Penting (Highlight)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Target Penerima *</label>
            <select
              value={formData.targetRole}
              onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Pengguna</option>
              <option value="student">Khusus Siswa</option>
              <option value="educator">Khusus Guru / Educator</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Isi Pengumuman *</label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Tuliskan detail pengumuman yang ingin disiarkan..."
              className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 leading-relaxed"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {modalMode === 'create' ? 'Terbitkan Pengumuman' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
