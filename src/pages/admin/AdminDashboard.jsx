import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { AdminOverviewHeader } from '../../components/admin/dashboard/AdminOverviewHeader';
import { AdminStatsCards } from '../../components/admin/dashboard/AdminStatsCards';
import { AdminLeaderboardSection } from '../../components/admin/dashboard/AdminLeaderboardSection';
import { AdminAnnouncementsCard } from '../../components/admin/dashboard/AdminAnnouncementsCard';
import { AdminSystemStatusCard } from '../../components/admin/dashboard/AdminSystemStatusCard';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { ShieldAlert, AlertCircle } from 'lucide-react';

export function AdminDashboard() {
  const {
    isAdmin,
    manualSync,
    lmsLoading,
    allAnnouncements,
    annLoading,
    fetchingUsers,
    userError,
    fetchUsers,
    totalUsers,
    totalStudents,
    totalEducators,
    totalAdmins,
    totalBatches,
    totalModules,
    totalContents,
    leaderboardSort,
    setLeaderboardSort,
    leaderboardSearch,
    setLeaderboardSearch,
    selectedRoleFilter,
    setSelectedRoleFilter,
    filteredLeaderboard
  } = useAdminDashboard();

  if (!isAdmin) {
    return (
      <div className="flex h-screen bg-[#F8FAFC]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 max-w-md shadow-xs space-y-3">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <h1 className="text-lg font-bold text-slate-900">Akses Terbatas</h1>
              <p className="text-xs text-slate-500">
                Halaman ini hanya dapat diakses oleh Administrator platform.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-[1520px] mx-auto space-y-6">
            
            {/* Header */}
            <AdminOverviewHeader
              manualSync={manualSync}
              lmsLoading={lmsLoading}
              fetchingUsers={fetchingUsers}
              fetchUsers={fetchUsers}
            />

            {userError && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{userError}</span>
              </div>
            )}

            {/* Stat KPI Cards */}
            <AdminStatsCards
              totalUsers={totalUsers}
              totalStudents={totalStudents}
              totalEducators={totalEducators}
              totalAdmins={totalAdmins}
              totalBatches={totalBatches}
              totalModules={totalModules}
              totalContents={totalContents}
              allAnnouncements={allAnnouncements}
            />

            {/* Leaderboard Table Section */}
            <AdminLeaderboardSection
              filteredLeaderboard={filteredLeaderboard}
              leaderboardSort={leaderboardSort}
              setLeaderboardSort={setLeaderboardSort}
              leaderboardSearch={leaderboardSearch}
              setLeaderboardSearch={setLeaderboardSearch}
              fetchingUsers={fetchingUsers}
            />

            {/* Two Column Footer Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminAnnouncementsCard
                allAnnouncements={allAnnouncements}
                annLoading={annLoading}
              />

              <AdminSystemStatusCard />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
