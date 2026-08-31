import { RotateCw, Trash2 } from 'lucide-react';

export function SystemCacheSettingsCard({
  handleClearCache,
  handleResetProgress
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Penyimpanan & Progres Belajar</h2>
        <p className="text-xs text-slate-400 mt-0.5">Kelola cache lokal data kurikulum dan riwayat ketuntasan materi.</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-xs text-slate-800">Bersihkan Cache Materi Offline</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Mengunduh ulang seluruh konten dan kurikulum terbaru dari server.</p>
          </div>
          <button
            type="button"
            onClick={handleClearCache}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Bersihkan Cache</span>
          </button>
        </div>

        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-xs text-rose-900">Reset Semua Progres Belajar</h3>
            <p className="text-[11px] text-rose-700/70 mt-0.5">Menghapus centang selesai pada seluruh materi yang pernah Anda pelajari.</p>
          </div>
          <button
            type="button"
            onClick={handleResetProgress}
            className="px-3.5 py-2 bg-white hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Progres</span>
          </button>
        </div>
      </div>
    </div>
  );
}
