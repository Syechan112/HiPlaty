import { Search, X, LayoutGrid, List } from 'lucide-react';
import { CONTENT_CATEGORIES } from '../../../config/contentCategories';

export function ExploreFilters({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  savedBatchCount,
  totalResults
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi, nama batch, bab modul, atau educator..."
            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
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

        {/* Tab filters & View mode */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('popular')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'popular' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Terpopuler
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('saved')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'saved' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Tersimpan ({savedBatchCount})
            </button>
          </div>

          <div className="flex bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500'
              }`}
              title="Tampilan Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500'
              }`}
              title="Tampilan List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <span>Semua Topik</span>
          <span
            className={`px-1.5 py-0.2 text-[10px] rounded-md font-bold ${
              selectedCategory === 'all'
                ? 'bg-slate-800 text-slate-200'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {totalResults}
          </span>
        </button>

        {CONTENT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
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
