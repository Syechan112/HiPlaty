import { Link } from 'react-router-dom';
import { Search, Edit3, ArrowUpRight, ChevronLeft, ChevronRight, Bookmark, Layers, Tag } from 'lucide-react';
import { getCategoryInfo, CONTENT_CATEGORIES } from '../../../config/contentCategories';
import { CustomSelectDropdown } from '../../common/CustomSelectDropdown';

export function LessonsPerformanceTable({
  myBatches = [],
  selectedBatchFilter,
  setSelectedBatchFilter,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  searchQuery,
  setSearchQuery,
  filteredLessons = [],
  paginatedLessons = [],
  currentPage,
  setCurrentPage,
  totalPages,
  startIndex,
  endIndex,
  setSelectedModalItem,
  setModalSearchQuery
}) {
  const batchOptions = [
    { value: 'all', label: `Semua Batch (${myBatches.length})` },
    ...myBatches.map((b) => ({
      value: b.batchId,
      label: b.batchName
    }))
  ];

  const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    ...CONTENT_CATEGORIES.map((c) => ({
      value: c.id,
      label: c.label,
      badgeColor: c.color
    }))
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">Daftar Kinerja Seluruh Materi</h2>
          <p className="text-xs text-slate-400">Statistik pembaca, durasi, dan aksi simpan per materi</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul materi / modul..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Custom Filter Batch Dropdown */}
          <CustomSelectDropdown
            value={selectedBatchFilter}
            onChange={setSelectedBatchFilter}
            options={batchOptions}
            placeholder="Pilih Batch"
            icon={Layers}
          />

          {/* Custom Filter Kategori Dropdown */}
          <CustomSelectDropdown
            value={selectedCategoryFilter}
            onChange={setSelectedCategoryFilter}
            options={categoryOptions}
            placeholder="Pilih Kategori"
            icon={Tag}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Judul Materi & Kurikulum</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4 text-center">Views</th>
              <th className="py-3 px-4 text-center">Durasi</th>
              <th className="py-3 px-4 text-center">Disimpan</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {paginatedLessons.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400">
                  Tidak ada materi yang sesuai dengan filter atau pencarian.
                </td>
              </tr>
            ) : (
              paginatedLessons.map((l) => {
                const catInfo = getCategoryInfo(l.batchCategory);
                return (
                  <tr key={l.contentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <p className="font-bold text-slate-900 text-xs truncate">{l.title}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {l.batchName} &rsaquo; {l.moduleTitle}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                        {l.viewsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono text-slate-600">~{l.readMinutes}m</span>
                      <span className="text-[10px] text-slate-400 block">({l.wordCount} kata)</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModalItem({
                            batchId: l.batchId,
                            batchName: `${l.title} (${l.batchName})`
                          });
                          setModalSearchQuery('');
                        }}
                        className="font-bold font-mono text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{l.savesCount}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/educator/contents/edit/${l.contentId}`}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Edit Materi Ini"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/learning/study?batchId=${encodeURIComponent(l.batchId)}&moduleId=${encodeURIComponent(l.moduleId)}&contentId=${encodeURIComponent(l.contentId)}`}
                          className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
                          title="Buka Ruang Belajar"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredLessons.length > 0 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-slate-500">
            Menampilkan <strong className="text-slate-900 font-mono">{startIndex + 1}</strong> - <strong className="text-slate-900 font-mono">{Math.min(endIndex, filteredLessons.length)}</strong> dari <strong className="text-slate-900 font-mono">{filteredLessons.length}</strong> materi
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-bold text-slate-700 bg-white border border-slate-200 rounded-lg font-mono">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
