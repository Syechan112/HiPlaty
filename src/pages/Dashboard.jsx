import { TopNav } from '../components/TopNav';
import { Sidebar } from '../components/Sidebar';
import { GuestBanner } from '../components/GuestBanner';
import { CuteCalendarCard } from '../components/CuteCalendarCard';
import { DashboardWelcomeBanner } from '../components/dashboard/DashboardWelcomeBanner';
import { DashboardStatGrid } from '../components/dashboard/DashboardStatGrid';
import { StudyTimeChartCard } from '../components/dashboard/StudyTimeChartCard';
import { SavedBatchesSection } from '../components/dashboard/SavedBatchesSection';
import { LeaderboardSection } from '../components/dashboard/LeaderboardSection';
import { DashboardSavedUsersModal } from '../components/dashboard/DashboardSavedUsersModal';
import { useStudentDashboard } from '../hooks/useStudentDashboard';

export function Dashboard() {
  const {
    auth,
    isGuest,
    savedBatches,
    savedBatchCount,
    savedBatchesProgress,
    savedBatchesCompletedCount,
    savedBatchesTotalContents,
    streak,
    canClaimTodayStreak,
    handleClaimStreak,
    totalStudyTimeFormatted,
    chartViewMode,
    setChartViewMode,
    activeChartData,
    leaderboardTab,
    setLeaderboardTab,
    streakLeaderboard,
    studyTimeLeaderboard,
    popularBatchesRank,
    leaderboardLoading,
    selectedUsersListBatch,
    setSelectedUsersListBatch,
    toastMessage,
    getBatchSavedUsers
  } = useStudentDashboard();

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />

        {toastMessage && (
          <div className="bg-slate-900 text-white px-4 py-2 text-xs font-semibold text-center animate-in slide-in-from-top duration-200">
            {toastMessage}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[1520px] mx-auto space-y-6">
            
            {isGuest && <GuestBanner />}

            {/* 1. Welcome Banner & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 xl:col-span-8">
                <DashboardWelcomeBanner auth={auth} />
              </div>
              <div className="lg:col-span-5 xl:col-span-4">
                <CuteCalendarCard />
              </div>
            </div>

            {/* 2. Key Stat Metrics */}
            <DashboardStatGrid
              streak={streak}
              canClaimTodayStreak={canClaimTodayStreak}
              handleClaimStreak={handleClaimStreak}
              totalStudyTimeFormatted={totalStudyTimeFormatted}
              savedBatchesProgress={savedBatchesProgress}
              savedBatchesCompletedCount={savedBatchesCompletedCount}
              savedBatchesTotalContents={savedBatchesTotalContents}
              savedBatchCount={savedBatchCount}
            />

            {/* 3. Study Time Chart & Saved Classes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudyTimeChartCard
                chartViewMode={chartViewMode}
                setChartViewMode={setChartViewMode}
                activeChartData={activeChartData}
              />

              <SavedBatchesSection
                savedBatches={savedBatches}
              />
            </div>

            {/* 4. Active Leaderboard (Full Width) */}
            <LeaderboardSection
              leaderboardTab={leaderboardTab}
              setLeaderboardTab={setLeaderboardTab}
              streakLeaderboard={streakLeaderboard}
              studyTimeLeaderboard={studyTimeLeaderboard}
              popularBatchesRank={popularBatchesRank}
              leaderboardLoading={leaderboardLoading}
              setSelectedUsersListBatch={setSelectedUsersListBatch}
            />

          </div>
        </main>
      </div>

      {/* Modal Siswa yang Menyimpan */}
      <DashboardSavedUsersModal
        selectedUsersListBatch={selectedUsersListBatch}
        onClose={() => setSelectedUsersListBatch(null)}
        getBatchSavedUsers={getBatchSavedUsers}
      />
    </div>
  );
}
