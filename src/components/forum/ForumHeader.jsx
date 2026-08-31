import { MessagesSquare, Plus, Search, Sparkles, Clock, TrendingUp } from 'lucide-react';

export function ForumHeader({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  setShowCreateModal,
  totalThreads
}) {
  return (
    <div className="bg-white border-b border-slate-200/80 p-5 sm:p-6 lg:p-8 space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <MessagesSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Forum Publik 24 Jam</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200/80 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>24 Jam Auto-Clear</span>
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Ruang diskusi santai & tanya jawab terbuka untuk semua role. Seluruh postingan otomatis dibersihkan setelah 24 jam.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Diskusi Baru</span>
        </button>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik diskusi, pertanyaan, atau nama penulis..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-100/80 p-1 rounded-xl shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              sortBy === 'latest' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Terbaru</span>
          </button>
          <button
            type="button"
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              sortBy === 'popular' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Terpopuler</span>
          </button>
        </div>
      </div>
    </div>
  );
}
