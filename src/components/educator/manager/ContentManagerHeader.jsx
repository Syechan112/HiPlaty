import { Link } from 'react-router-dom';
import { Plus, LayoutGrid, List } from 'lucide-react';

export function ContentManagerHeader({
  totalStats,
  viewMode,
  setViewMode
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded-md text-[10px] font-bold tracking-wider uppercase">
            Studio Kurikulum
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {totalStats.totalBatches} Batch • {totalStats.totalModules} Modul • {totalStats.totalContents} Materi
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
          Kelola Konten Pembelajaran
        </h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Atur struktur kurikulum, edit bab modul, dan perbarui artikel materi Anda.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Switcher Grid vs List */}
        <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'grid' 
                ? 'bg-slate-900 text-white shadow-2xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Tampilan Grid Kartu"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'list' 
                ? 'bg-slate-900 text-white shadow-2xs font-bold' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Tampilan Daftar Rinci"
          >
            <List className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">List</span>
          </button>
        </div>

        <Link
          to="/educator/contents/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Materi Baru</span>
        </Link>
      </div>
    </div>
  );
}
