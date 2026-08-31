import { Search, Tag, X } from 'lucide-react';
import { CONTENT_CATEGORIES } from '../../../config/contentCategories';

export function ContentManagerFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  totalResults
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama batch, modul, atau judul materi..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-700 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 font-medium shrink-0">
          Ditemukan <strong className="text-slate-900 font-mono">{totalResults}</strong> batch
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600'
          }`}
        >
          Semua Kategori
        </button>

        {CONTENT_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : `${cat.color} hover:opacity-90`
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
