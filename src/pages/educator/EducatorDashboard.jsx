import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { ProtectedEducatorRoute } from '../../components/ProtectedEducatorRoute';
import { CurriculumDistributionChart } from '../../components/educator/CurriculumDistributionChart';
import { DashboardHeroHeader } from '../../components/educator/dashboard/DashboardHeroHeader';
import { DashboardMetricsCards } from '../../components/educator/dashboard/DashboardMetricsCards';
import { RecentLessonsCard } from '../../components/educator/dashboard/RecentLessonsCard';
import { BatchSavedUsersModal } from '../../components/educator/dashboard/BatchSavedUsersModal';
import { useEducatorDashboard } from '../../hooks/useEducatorDashboard';

export function EducatorDashboard() {
  const {
    auth,
    totalBatches,
    totalModules,
    totalContents,
    avgLessonsPerModule,
    avgModulesPerBatch,
    totalSavesAcrossBatches,
    uniqueSavedStudentsCount,
    batchChartData,
    recentContents,
    selectedUsersListBatch,
    setSelectedUsersListBatch,
    studentSearchQuery,
    setStudentSearchQuery,
    activeModalSavedUsers,
    getContentViews
  } = useEducatorDashboard();

  return (
    <ProtectedEducatorRoute>
      <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-[1520px] mx-auto space-y-6">
              
              {/* 1. Hero Header */}
              <DashboardHeroHeader auth={auth} />

              {/* 2. Key Metrics Cards */}
              <DashboardMetricsCards
                totalBatches={totalBatches}
                totalModules={totalModules}
                totalContents={totalContents}
                totalSavesAcrossBatches={totalSavesAcrossBatches}
                uniqueSavedStudentsCount={uniqueSavedStudentsCount}
                avgModulesPerBatch={avgModulesPerBatch}
                avgLessonsPerModule={avgLessonsPerModule}
              />

              {/* 3. Visual Charts & Recent Materials Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CurriculumDistributionChart
                  batchChartData={batchChartData}
                  onSelectBatchUsers={(batch) => {
                    setSelectedUsersListBatch(batch);
                    setStudentSearchQuery('');
                  }}
                />

                <RecentLessonsCard
                  recentContents={recentContents}
                  getContentViews={getContentViews}
                />
              </div>

            </div>
          </main>
        </div>

        {/* 4. Modal List Siswa Menyimpan */}
        <BatchSavedUsersModal
          selectedBatch={selectedUsersListBatch}
          onClose={() => setSelectedUsersListBatch(null)}
          searchQuery={studentSearchQuery}
          setSearchQuery={setStudentSearchQuery}
          savedUsers={activeModalSavedUsers}
        />
      </div>
    </ProtectedEducatorRoute>
  );
}
