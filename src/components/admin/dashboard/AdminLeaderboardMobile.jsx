import { useState, useEffect } from 'react';
import { Search, Flame, Clock, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

function formatDuration(totalSecs = 0) {
  const secs = parseInt(totalSecs, 10) || 0;
  if (secs <= 0) return '0 Mnt';
  if (secs < 60) return `${secs} Dtk`;
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);
  if (hours > 0) {
    return `${hours} Jam ${minutes > 0 ? `${minutes} Mnt` : ''}`.trim();
  }
  return `${minutes} Mnt`;
}

export function AdminLeaderboardMobile({
  filteredLeaderboard = [],
  leaderboardSort,
  setLeaderboardSort,
  leaderboardSearch,
  setLeaderboardSearch,
  fetchingUsers
}) {
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [leaderboardSearch, leaderboardSort]);

  const totalPages = Math.max(1, Math.ceil(filteredLeaderboard.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLeaderboard = filteredLeaderboard.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden sm:hidden">
      
      {/* Header Mobile */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-xs tracking-tight">
              Peringkat Belajar Siswa
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              Durasi belajar & streak konsistensi
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <input
            type="text"
            value={leaderboardSearch}
            onChange={(e) => setLeaderboardSearch(e.target.value)}
            placeholder="Cari nama atau ID siswa..."
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Segmented Sort Controls */}
        <div className="grid grid-cols-2 bg-slate-100/90 p-1 rounded-xl text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setLeaderboardSort('time')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[11px] ${
              leaderboardSort === 'time'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Durasi</span>
          </button>
          <button
            type="button"
            onClick={() => setLeaderboardSort('streak')}
            className={`py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 text-[11px] ${
              leaderboardSort === 'streak'
                ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Streak</span>
          </button>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="divide-y divide-slate-100">
        {fetchingUsers ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Memuat data keaktifan belajar siswa...
          </div>
        ) : paginatedLeaderboard.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Tidak ada data siswa yang cocok.
          </div>
        ) : (
          paginatedLeaderboard.map((u, idx) => {
            const rankNumber = startIndex + idx + 1;

            return (
              <div
                key={u.userId || idx}
                className="p-3.5 flex items-center gap-3 hover:bg-slate-50/70 transition-colors"
              >
                {/* Rank Badge */}
                <div className="shrink-0 font-mono">
                  {rankNumber === 1 ? (
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-black text-xs inline-flex items-center justify-center shadow-xs">
                      1
                    </span>
                  ) : rankNumber === 2 ? (
                    <span className="w-6 h-6 rounded-lg bg-slate-700 text-white font-bold text-xs inline-flex items-center justify-center shadow-xs">
                      2
                    </span>
                  ) : rankNumber === 3 ? (
                    <span className="w-6 h-6 rounded-lg bg-slate-500 text-white font-bold text-xs inline-flex items-center justify-center shadow-xs">
                      3
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 font-bold text-xs inline-flex items-center justify-center">
                      {rankNumber}
                    </span>
                  )}
                </div>

                {/* Avatar & User Info */}
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {(u.name || 'S').charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-slate-900 text-xs truncate">
                      {u.name || 'Siswa'}
                    </p>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                        u.status === 'blocked'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {u.status === 'blocked' ? 'Diblokir' : 'Aktif'}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-mono truncate">
                    {u.email || u.userId}
                  </p>
                </div>

                {/* Stats Values */}
                <div className="shrink-0 text-right">
                  {leaderboardSort === 'streak' ? (
                    <>
                      <div className="font-extrabold font-mono text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 inline-flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{u.streak || 0} hr</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {formatDuration(u.studySeconds)}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="font-black font-mono text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/60 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{formatDuration(u.studySeconds)}</span>
                      </div>
                      <p className="text-[9px] text-amber-700 font-mono mt-0.5 flex items-center justify-end gap-0.5">
                        <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                        <span>{u.streak || 0} hr streak</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Mobile Footer */}
      {filteredLeaderboard.length > 0 && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs">
          <p className="text-slate-400 text-[10px]">
            <strong className="text-slate-900 font-mono">{startIndex + 1}-{Math.min(endIndex, filteredLeaderboard.length)}</strong> dari <strong className="text-slate-900 font-mono">{filteredLeaderboard.length}</strong>
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer shadow-2xs"
              title="Sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2 py-0.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg font-mono shadow-2xs">
              {currentPage}/{totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer shadow-2xs"
              title="Selanjutnya"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
