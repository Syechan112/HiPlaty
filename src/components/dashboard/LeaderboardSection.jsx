
import {
  Trophy,
  Flame,
  Clock,
  Layers,
  Sparkles,
  Inbox,
  Crown,
  ChevronRight,
} from 'lucide-react';

function formatDuration(seconds = 0) {
  if (!seconds || isNaN(seconds) || seconds <= 0) return '0 Mnt';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} Jm ${minutes > 0 ? `${minutes} m` : ''}`.trim();
  }

  return `${minutes > 0 ? minutes : 1} Mnt`;
}

export function LeaderboardSection({
  leaderboardTab,
  setLeaderboardTab,
  streakLeaderboard = [],
  studyTimeLeaderboard = [],
  popularBatchesRank = [],
  leaderboardLoading = false,
  setSelectedUsersListBatch,
}) {
  const activeUserList =
    leaderboardTab === 'streak'
      ? streakLeaderboard
      : studyTimeLeaderboard;

  const top3 = activeUserList.slice(0, 3);
  const restList = activeUserList.slice(3, 8);

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white font-['Poppins',sans-serif] shadow-[0_2px_12px_rgba(15,23,42,0.025)]">

      {/* Header */}
      <div className="flex flex-col gap-5 border-b border-slate-100/80 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <Trophy className="h-[18px] w-[18px]" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-slate-800">
              Peringkat Pembelajar
            </h2>

            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              Peringkat konsistensi streak & durasi belajar
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-fit items-center rounded-xl bg-slate-50 p-1 ring-1 ring-slate-100">
          <button
            type="button"
            onClick={() => setLeaderboardTab('streak')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-all ${
              leaderboardTab === 'streak'
                ? 'bg-white text-slate-800 shadow-[0_1px_4px_rgba(15,23,42,0.06)] ring-1 ring-slate-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Flame
              className={`h-3.5 w-3.5 ${
                leaderboardTab === 'streak'
                  ? 'text-amber-500'
                  : 'text-slate-300'
              }`}
              strokeWidth={2}
            />
            <span>Streak</span>
          </button>

          <button
            type="button"
            onClick={() => setLeaderboardTab('time')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-all ${
              leaderboardTab === 'time'
                ? 'bg-white text-slate-800 shadow-[0_1px_4px_rgba(15,23,42,0.06)] ring-1 ring-slate-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Clock
              className={`h-3.5 w-3.5 ${
                leaderboardTab === 'time'
                  ? 'text-slate-500'
                  : 'text-slate-300'
              }`}
              strokeWidth={2}
            />
            <span>Durasi</span>
          </button>

          <button
            type="button"
            onClick={() => setLeaderboardTab('batch')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-all ${
              leaderboardTab === 'batch'
                ? 'bg-white text-slate-800 shadow-[0_1px_4px_rgba(15,23,42,0.06)] ring-1 ring-slate-100'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers
              className={`h-3.5 w-3.5 ${
                leaderboardTab === 'batch'
                  ? 'text-slate-500'
                  : 'text-slate-300'
              }`}
              strokeWidth={2}
            />
            <span>Terpopuler</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {leaderboardLoading && (leaderboardTab === 'batch' ? popularBatchesRank.length === 0 : activeUserList.length === 0) ? (
          <div className="py-16 text-center text-xs font-medium text-slate-400">
            Memuat peringkat...
          </div>
        ) : leaderboardTab === 'batch' ? (

          /* =========================
             POPULAR BATCHES
          ========================= */
          popularBatchesRank.length > 0 ? (
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
              {popularBatchesRank.slice(0, 6).map((b, idx) => (
                <div
                  key={b.batchId || idx}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition-colors hover:border-slate-200 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-slate-400 ring-1 ring-slate-100">
                      {idx + 1}
                    </span>

                    <div className="min-w-0 truncate">
                      <p className="truncate text-xs font-semibold text-slate-700">
                        {b.batchName}
                      </p>

                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                        {b.contentsCount || 0} Materi Pelajaran
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedUsersListBatch(b)}
                    className="shrink-0 cursor-pointer rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 transition-all hover:border-slate-300 hover:text-slate-800"
                  >
                    {b.savesCount || 0} Tersimpan
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Inbox className="h-7 w-7" />}
              title="Belum Ada Batch Terpopuler"
              description="Simpan batch favorit untuk menampilkannya di peringkat."
            />
          )

        ) : (

          /* =========================
             USER LEADERBOARD
          ========================= */
          activeUserList.length > 0 ? (
            <div className="space-y-5">

              {/* TOP 3 */}
              {top3.length > 0 && (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {top3.map((u, idx) => {
                    const displayName =
                      u.name || u.userName || 'Siswa';

                    const displayStreak =
                      u.streak ?? u.currentStreak ?? 0;

                    const durationText =
                      u.formattedTime ||
                      formatDuration(
                        u.studySeconds || u.totalStudySeconds
                      );

                    const styles = [
                      {
                        card: 'bg-amber-50/60 border-amber-100/80',
                        badge: 'bg-amber-100 text-amber-600',
                        number: 'text-amber-600',
                      },
                      {
                        card: 'bg-slate-50/70 border-slate-100',
                        badge: 'bg-slate-100 text-slate-500',
                        number: 'text-slate-500',
                      },
                      {
                        card: 'bg-orange-50/40 border-orange-100/70',
                        badge: 'bg-orange-100 text-orange-600',
                        number: 'text-orange-600',
                      },
                    ][idx];

                    return (
                      <div
                        key={u.userId || idx}
                        className={`relative flex items-center gap-3 rounded-2xl border p-4 transition-colors sm:flex-col sm:justify-center sm:gap-3 sm:text-center ${styles.card}`}
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-600 ring-1 ring-slate-200/70">
                            {displayName.charAt(0).toUpperCase()}
                          </div>

                          <span
                            className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold ring-2 ring-white ${styles.badge}`}
                          >
                            {idx + 1}
                          </span>
                        </div>

                        {/* User */}
                        <div className="min-w-0 flex-1 sm:flex-none">
                          <div className="flex items-center gap-1 sm:justify-center">
                            {idx === 0 && (
                              <Crown className="h-3 w-3 shrink-0 text-amber-500" />
                            )}

                            <p className="truncate text-xs font-bold text-slate-700">
                              {displayName}
                            </p>
                          </div>

                          <p className="mt-0.5 truncate text-[9px] font-medium text-slate-400">
                            {u.userId || 'Siswa Aktif'}
                          </p>
                        </div>

                        {/* Score */}
                        <div className="shrink-0 rounded-lg bg-white/80 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 ring-1 ring-slate-200/60">
                          {leaderboardTab === 'streak'
                            ? `${displayStreak} Hari`
                            : durationText}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* REST OF RANK */}
              {restList.length > 0 && (
                <div className="divide-y divide-slate-100/80 border-t border-slate-100/80 pt-1">
                  {restList.map((u, idx) => {
                    const rankNum = idx + 4;

                    const displayName =
                      u.name || u.userName || 'Siswa';

                    const displayStreak =
                      u.streak ?? u.currentStreak ?? 0;

                    const durationText =
                      u.formattedTime ||
                      formatDuration(
                        u.studySeconds || u.totalStudySeconds
                      );

                    return (
                      <div
                        key={u.userId || idx}
                        className="group flex items-center justify-between gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-slate-50/70"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="w-5 shrink-0 text-center font-mono text-[10px] font-semibold text-slate-300">
                            {rankNum}
                          </span>

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[10px] font-bold text-slate-500 ring-1 ring-slate-100">
                            {displayName.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 truncate">
                            <p className="truncate text-[11px] font-semibold text-slate-700">
                              {displayName}
                            </p>

                            <p className="mt-0.5 truncate text-[9px] font-medium text-slate-400">
                              {u.userId}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 ring-1 ring-slate-100">
                          {leaderboardTab === 'streak'
                            ? `${displayStreak} Hari`
                            : durationText}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<Sparkles className="h-7 w-7" />}
              title="Belum Ada Aktivitas Peringkat"
              description={
                leaderboardTab === 'streak'
                  ? 'Klaim streak harianmu untuk masuk ke peringkat teratas!'
                  : 'Mulai baca materi pelajaran untuk mencatat durasi belajarmu!'
              }
            />
          )
        )}
      </div>
    </section>
  );
}

/* =========================
   EMPTY STATE
========================= */

function EmptyState({ icon, title, description }) {
  return (
    <div className="py-12 text-center">
      <div className="mb-3 flex justify-center text-slate-300">
        {icon}
      </div>

      <p className="text-xs font-semibold text-slate-700">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-sm text-[10px] font-medium leading-relaxed text-slate-400">
        {description}
      </p>
    </div>
  );
}

