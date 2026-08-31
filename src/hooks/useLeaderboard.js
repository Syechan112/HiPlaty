import { useState, useEffect, useCallback, useMemo } from 'react';
import { API_URL, AUTH_KEY } from '../config/api';

const LEADERBOARD_CACHE_KEY = 'lms_leaderboard_cache';
const LAST_SYNC_KEY = 'lms_last_leaderboard_sync';
const CACHE_TTL_MS = 5 * 60 * 1000;

function formatStudyDuration(totalSecs) {
  const secs = parseInt(totalSecs) || 0;
  if (secs <= 0) return '0 Mnt';
  const hours = Math.floor(secs / 3600);
  const minutes = Math.floor((secs % 3600) / 60);

  if (hours > 0) {
    return `${hours} Jm ${minutes > 0 ? `${minutes} m` : ''}`.trim();
  }
  return `${minutes > 0 ? minutes : 1} Mnt`;
}

export function useLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState(() => {
    try {
      const cached = localStorage.getItem(LEADERBOARD_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async (force = false) => {
    if (!navigator.onLine) return;

    if (!force) {
      try {
        const lastSync = localStorage.getItem(LAST_SYNC_KEY);
        if (lastSync && Date.now() - parseInt(lastSync, 10) < CACHE_TTL_MS) {
          return;
        }
      } catch {}
    }

    try {
      setIsSyncing(true);
      setLeaderboardData((current) => {
        if (!current || current.length === 0) {
          setLoading(true);
        }
        return current;
      });

      const response = await fetch(`${API_URL}?action=get_leaderboard&_t=${Date.now()}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data peringkat');
      }

      const remoteData = await response.json();
      if (Array.isArray(remoteData)) {
        const prevCacheRaw = localStorage.getItem(LEADERBOARD_CACHE_KEY);
        const remoteDataRaw = JSON.stringify(remoteData);

        if (prevCacheRaw !== remoteDataRaw) {
          setLeaderboardData(remoteData);
          try {
            localStorage.setItem(LEADERBOARD_CACHE_KEY, remoteDataRaw);
          } catch (e) {
            console.warn(e);
          }
        }

        try {
          localStorage.setItem(LAST_SYNC_KEY, String(Date.now()));
        } catch {}
      }
    } catch (err) {
      console.warn('Leaderboard background sync error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(false);

    const interval = setInterval(() => {
      fetchLeaderboard(false);
    }, CACHE_TTL_MS);

    const handleStorageOrCustomSync = () => {
      try {
        const cached = localStorage.getItem(LEADERBOARD_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setLeaderboardData(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
              return parsed;
            }
            return prev;
          });
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageOrCustomSync);
    window.addEventListener('lms_leaderboard_updated', handleStorageOrCustomSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageOrCustomSync);
      window.removeEventListener('lms_leaderboard_updated', handleStorageOrCustomSync);
    };
  }, [fetchLeaderboard]);

  const uniqueUsers = useMemo(() => {
    const userMap = new Map();

    for (const item of leaderboardData) {
      const rawId = String(item.userId || item.userName || item.name || '').trim();
      if (!rawId) continue;
      const key = rawId.toLowerCase();

      const existing = userMap.get(key);
      const name = item.name || item.userName || 'Siswa';
      const currentStreak = parseInt(item.currentStreak ?? item.streak) || 0;
      const longestStreak = parseInt(item.longestStreak) || currentStreak;
      const totalStudySeconds = parseInt(item.totalStudySeconds ?? item.studySeconds) || 0;

      if (!existing) {
        userMap.set(key, {
          userId: item.userId || rawId,
          userName: name,
          name,
          currentStreak,
          streak: currentStreak,
          longestStreak,
          totalStudySeconds,
          studySeconds: totalStudySeconds,
          lastClaimDate: item.lastClaimDate || '',
          lastActiveDate: item.lastActiveDate || ''
        });
      } else {
        const resolvedName = name !== 'Siswa' ? name : existing.name;
        const resolvedStreak = Math.max(existing.currentStreak, currentStreak);
        const resolvedLongest = Math.max(existing.longestStreak, longestStreak, currentStreak);
        const resolvedSeconds = Math.max(existing.totalStudySeconds, totalStudySeconds);

        userMap.set(key, {
          ...existing,
          userName: resolvedName,
          name: resolvedName,
          currentStreak: resolvedStreak,
          streak: resolvedStreak,
          longestStreak: resolvedLongest,
          totalStudySeconds: resolvedSeconds,
          studySeconds: resolvedSeconds,
          lastClaimDate: item.lastClaimDate || existing.lastClaimDate,
          lastActiveDate: item.lastActiveDate || existing.lastActiveDate
        });
      }
    }

    try {
      const authStr = localStorage.getItem(AUTH_KEY);
      let localUserId = null;
      let localUserName = 'Siswa';
      if (authStr) {
        const authObj = JSON.parse(authStr);
        localUserId = authObj?.userId;
        localUserName = authObj?.name || 'Siswa';
      } else {
        localUserId = localStorage.getItem('lms_guest_uid');
        localUserName = 'Tamu';
      }

      if (localUserId) {
        const trackerRaw = localStorage.getItem(`lms_learning_tracker_${localUserId}`);
        if (trackerRaw) {
          const parsed = JSON.parse(trackerRaw);
          const localStreak = parseInt(parsed?.streak?.currentStreak) || 0;
          const localLongest = parseInt(parsed?.streak?.longestStreak) || localStreak;
          const daysObj = parsed?.timeLogs?.days || {};
          const localSecs = Object.values(daysObj).reduce((sum, v) => sum + (Number(v?.seconds ?? v) || 0), 0);

          const key = String(localUserId).trim().toLowerCase();
          const existing = userMap.get(key);

          if (!existing) {
            userMap.set(key, {
              userId: localUserId,
              userName: localUserName,
              name: localUserName,
              currentStreak: localStreak,
              streak: localStreak,
              longestStreak: localLongest,
              totalStudySeconds: localSecs,
              studySeconds: localSecs,
              lastClaimDate: parsed?.streak?.lastClaimDate || '',
              lastActiveDate: ''
            });
          } else {
            const finalLongest = Math.max(existing.longestStreak, localLongest, localStreak);
            const finalSecs = Math.max(existing.totalStudySeconds, localSecs);
            userMap.set(key, {
              ...existing,
              currentStreak: localStreak,
              streak: localStreak,
              longestStreak: finalLongest,
              totalStudySeconds: finalSecs,
              studySeconds: finalSecs,
              lastClaimDate: parsed?.streak?.lastClaimDate || existing.lastClaimDate
            });
          }
        }
      }
    } catch (e) {
      console.warn('Error reading local user tracker in leaderboard:', e);
    }

    return Array.from(userMap.values());
  }, [leaderboardData]);

  const streakLeaderboard = useMemo(() => {
    return [...uniqueUsers]
      .filter(u => u.currentStreak > 0 || u.longestStreak > 0)
      .sort((a, b) => {
        if (b.currentStreak !== a.currentStreak) {
          return b.currentStreak - a.currentStreak;
        }
        return b.longestStreak - a.longestStreak;
      })
      .slice(0, 10);
  }, [uniqueUsers]);

  const studyTimeLeaderboard = useMemo(() => {
    return [...uniqueUsers]
      .filter(u => u.totalStudySeconds > 0)
      .sort((a, b) => b.totalStudySeconds - a.totalStudySeconds)
      .map(u => {
        const secs = u.totalStudySeconds;
        const formatted = formatStudyDuration(secs);
        const mins = Math.max(1, Math.round(secs / 60));
        return {
          ...u,
          formattedTime: formatted,
          totalMinutes: secs < 60 ? `${secs} Detik` : `${mins} Menit Aktif`
        };
      })
      .slice(0, 10);
  }, [uniqueUsers]);

  return {
    leaderboardData: uniqueUsers,
    streakLeaderboard,
    studyTimeLeaderboard,
    fetchLeaderboard,
    loading,
    error
  };
}
