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

export function AdminLeaderboardSection({
  filteredLeaderboard = [],
  leaderboardSort,
  setLeaderboardSort,
  leaderboardSearch,
  setLeaderboardSearch,
  fetchingUsers
}) {
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever search or sort filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [leaderboardSearch, leaderboardSort]);

  const totalPages = Math.max(1, Math.ceil(filteredLeaderboard.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLeaderboard = filteredLeaderboard.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2 tracking-tight">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Peringkat & Keaktifan Belajar Siswa</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Daftar siswa dengan durasi belajar tertinggi dan streak konsistensi harian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <input
              type="text"
              value={leaderboardSearch}
              onChange={(e) => setLeaderboardSearch(e.target.value)}
              placeholder="Cari nama atau ID siswa..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Sort switch: Durasi Waktu vs Streak */}
          <div className="flex bg-slate-100/90 p-1 rounded-xl text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setLeaderboardSort('time')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                leaderboardSort === 'time' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Durasi Belajar</span>
            </button>
            <button
              type="button"
              onClick={() => setLeaderboardSort('streak')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                leaderboardSort === 'streak' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Streak Harian</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4 text-center w-12">#</th>
              <th className="py-3 px-4">Nama Siswa</th>
              <th className="py-3 px-4 text-center">Streak Harian</th>
              <th className="py-3 px-4 text-center">Durasi Belajar</th>
              <th className="py-3 px-4 text-right">Status Akun</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
            {fetchingUsers ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400">
                  Memuat data keaktifan belajar siswa...
                </td>
              </tr>
            ) : paginatedLeaderboard.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400">
                  Tidak ada data siswa yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              paginatedLeaderboard.map((u, idx) => {
                const rankNumber = startIndex + idx + 1;

                return (
                  <tr key={u.userId || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-mono">
                      {rankNumber === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs inline-flex items-center justify-center shadow-2xs">1</span>
                      ) : rankNumber === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-700 text-white font-bold text-xs inline-flex items-center justify-center shadow-2xs">2</span>
                      ) : rankNumber === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-500 text-white font-bold text-xs inline-flex items-center justify-center shadow-2xs">3</span>
                      ) : (
                        <span className="text-slate-400 font-bold">{rankNumber}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {(u.name || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate max-w-[240px]">
                          <p className="font-bold text-slate-900 truncate">{u.name || 'Siswa'}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">{u.email || u.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-extrabold font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/80 inline-flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{u.streak || 0} hari</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-black font-mono text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
                        {formatDuration(u.studySeconds)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                        u.status === 'blocked' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {u.status === 'blocked' ? 'Diblokir' : 'Aktif'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredLeaderboard.length > 0 && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-slate-500">
            Menampilkan <strong className="text-slate-900 font-mono">{startIndex + 1}</strong> - <strong className="text-slate-900 font-mono">{Math.min(endIndex, filteredLeaderboard.length)}</strong> dari <strong className="text-slate-900 font-mono">{filteredLeaderboard.length}</strong> siswa
          </p>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer shadow-2xs"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-bold text-slate-700 bg-white border border-slate-200 rounded-lg font-mono shadow-2xs">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-700 cursor-pointer shadow-2xs"
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
