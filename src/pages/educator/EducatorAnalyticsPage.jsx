import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { ProtectedEducatorRoute } from '../../components/ProtectedEducatorRoute';
import { Link } from 'react-router-dom';
import { BarChart2, BookOpen } from 'lucide-react';
import { useEducatorAnalytics } from '../../hooks/useEducatorAnalytics';
import { AnalyticsStatCards } from '../../components/educator/analytics/AnalyticsStatCards';
import { TopBatchesRankCard } from '../../components/educator/analytics/TopBatchesRankCard';
import { CategoryDistributionCard } from '../../components/educator/analytics/CategoryDistributionCard';
import { LessonsPerformanceTable } from '../../components/educator/analytics/LessonsPerformanceTable';
import { StudentListModal } from '../../components/educator/analytics/StudentListModal';

export function EducatorAnalyticsPage() {
  const analytics = useEducatorAnalytics();
  const {
    uniqueStudentsCount,
    totalViewsCount,
    totalSavesCount,
    totalLessonsCount,
    totalBatchesCount,
    totalReadingMinutes,
    topRankedBatches,
    chartMode,
    setChartMode,
    categoryBreakdown,
    myBatches,
    selectedBatchFilter,
    setSelectedBatchFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    filteredLessons,
    paginatedLessons,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    selectedModalItem,
    setSelectedModalItem,
    modalSearchQuery,
    setModalSearchQuery,
    activeModalUsers
  } = analytics;

  return (
    <ProtectedEducatorRoute>
      <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-[1520px] mx-auto space-y-6">
              
              {/* Header */}
              <div className="flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                {/* Title */}
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <BarChart2
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Statistik & Analitik Konten
                    </h1>

                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                      Analisis keterlibatan siswa, pembaca materi, dan kurikulum tersimpan.
                    </p>
                  </div>
                </div>

                {/* Action */}
                <Link
                  to="/educator/contents/new"
                  className="
                    inline-flex h-9 shrink-0
                    items-center justify-center gap-1.5
                    rounded-lg
                    border border-slate-900
                    bg-slate-900
                    px-3.5
                    text-[11px] font-bold text-white
                    transition-all duration-150
                    hover:bg-slate-800
                    active:bg-slate-900
                  "
                >
                  <BookOpen
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                  />

                  <span>+ Buat Materi Baru</span>
                </Link>
              </div>

              {/* Stat Cards */}
              <AnalyticsStatCards
                uniqueStudentsCount={uniqueStudentsCount}
                totalViewsCount={totalViewsCount}
                totalSavesCount={totalSavesCount}
                totalLessonsCount={totalLessonsCount}
                totalBatchesCount={totalBatchesCount}
                totalReadingMinutes={totalReadingMinutes}
              />

              {/* Two Column Visual Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopBatchesRankCard
                  topRankedBatches={topRankedBatches}
                  chartMode={chartMode}
                  setChartMode={setChartMode}
                  totalSavesCount={totalSavesCount}
                  setSelectedModalItem={setSelectedModalItem}
                  setModalSearchQuery={setModalSearchQuery}
                />

                <CategoryDistributionCard
                  categoryBreakdown={categoryBreakdown}
                  totalLessonsCount={totalLessonsCount}
                />
              </div>

              {/* Detailed Performance Table with 10-item pagination */}
              <LessonsPerformanceTable
                myBatches={myBatches}
                selectedBatchFilter={selectedBatchFilter}
                setSelectedBatchFilter={setSelectedBatchFilter}
                selectedCategoryFilter={selectedCategoryFilter}
                setSelectedCategoryFilter={setSelectedCategoryFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredLessons={filteredLessons}
                paginatedLessons={paginatedLessons}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                setSelectedModalItem={setSelectedModalItem}
                setModalSearchQuery={setModalSearchQuery}
              />

            </div>
          </main>
        </div>

        {/* Modal List Siswa yang Menyimpan */}
        <StudentListModal
          selectedModalItem={selectedModalItem}
          onClose={() => setSelectedModalItem(null)}
          modalSearchQuery={modalSearchQuery}
          setModalSearchQuery={setModalSearchQuery}
          activeModalUsers={activeModalUsers}
        />

      </div>
    </ProtectedEducatorRoute>
  );
}
