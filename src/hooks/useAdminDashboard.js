import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { useLmsSync } from './useLmsSync';
import { useAnnouncements } from './useAnnouncements';
import { API_URL } from '../config/api';

function extractSecondsFromTracker(trackerRaw) {
  if (!trackerRaw) return { seconds: 0, streak: 0, longestStreak: 0 };
  try {
    const parsed = JSON.parse(trackerRaw);
    const streak = parseInt(parsed?.streak?.currentStreak, 10) || 0;
    const longestStreak = parseInt(parsed?.streak?.longestStreak, 10) || streak;
    
    let totalSecs = 0;
    const daysObj = parsed?.timeLogs?.days || {};
    Object.values(daysObj).forEach((v) => {
      if (typeof v === 'object' && v !== null) {
        totalSecs += Number(v.seconds || v.totalSeconds || 0);
      } else if (!isNaN(Number(v))) {
        totalSecs += Number(v);
      }
    });

    if (totalSecs === 0 && parsed?.timeLogs?.months) {
      Object.values(parsed.timeLogs.months).forEach((m) => {
        if (typeof m === 'object' && m !== null) {
          totalSecs += Number(m.seconds || 0);
        } else if (!isNaN(Number(m))) {
          totalSecs += Number(m);
        }
      });
    }

    return { seconds: totalSecs, streak, longestStreak };
  } catch {
    return { seconds: 0, streak: 0, longestStreak: 0 };
  }
}

export function useAdminDashboard() {
  const { auth, isAdmin } = useAuth();
  const { data: coursesData, manualSync, loading: lmsLoading } = useLmsSync();
  const { allAnnouncements, fetchAnnouncements, loading: annLoading } = useAnnouncements();
  
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [userError, setUserError] = useState(null);
  
  const [leaderboardSort, setLeaderboardSort] = useState('time');
  const [leaderboardSearch, setLeaderboardSearch] = useState('');

  const apiUrl = localStorage.getItem('lms_api_url') || API_URL;

  const fetchUsers = useCallback(async () => {
    if (!auth || auth.role !== 'admin') return;
    setFetchingUsers(true);
    setUserError(null);

    try {
      const [usersRes, leaderRes] = await Promise.allSettled([
        fetch(`${apiUrl}?action=get_users`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            adminUserId: auth.userId,
            userId: auth.userId,
            email: auth.email,
            role: auth.role || 'admin',
            requestingUser: auth
          })
        }).then(r => r.json()),
        fetch(`${apiUrl}?action=get_leaderboard&_t=${Date.now()}`).then(r => r.json())
      ]);

      const usersList = usersRes.status === 'fulfilled' && Array.isArray(usersRes.value) ? usersRes.value : [];
      let leaderList = leaderRes.status === 'fulfilled' && Array.isArray(leaderRes.value) ? leaderRes.value : [];

      if (leaderList.length === 0) {
        try {
          const cached = localStorage.getItem('lms_leaderboard_cache');
          if (cached) leaderList = JSON.parse(cached);
        } catch {}
      }

      const leaderMap = new Map();
      leaderList.forEach(l => {
        if (!l) return;
        const uid = String(l.userId || '').trim().toLowerCase();
        const email = String(l.email || '').trim().toLowerCase();
        const name = String(l.name || l.userName || '').trim().toLowerCase();
        if (uid) leaderMap.set(uid, l);
        if (email) leaderMap.set(email, l);
        if (name) leaderMap.set(name, l);
      });

      const processedUserIds = new Set();

      const merged = usersList.map(u => {
        const uid = String(u.userId || u.id || '').trim().toLowerCase();
        const email = String(u.email || '').trim().toLowerCase();
        const name = String(u.name || '').trim().toLowerCase();

        processedUserIds.add(uid);
        if (email) processedUserIds.add(email);

        const lStats = leaderMap.get(uid) || leaderMap.get(email) || leaderMap.get(name) || {};

        let localTracker = { seconds: 0, streak: 0, longestStreak: 0 };
        try {
          const keysToTry = [
            `lms_learning_tracker_${u.userId}`,
            `lms_learning_tracker_${u.id}`,
            `lms_learning_tracker_${u.email}`
          ];
          for (const k of keysToTry) {
            const raw = localStorage.getItem(k);
            if (raw) {
              const res = extractSecondsFromTracker(raw);
              if (res.seconds > localTracker.seconds) localTracker.seconds = res.seconds;
              if (res.streak > localTracker.streak) localTracker.streak = res.streak;
              if (res.longestStreak > localTracker.longestStreak) localTracker.longestStreak = res.longestStreak;
            }
          }
        } catch {}

        const remoteStreak = Number(lStats.currentStreak ?? lStats.streak ?? u.streak ?? 0);
        const finalStreak = Math.max(Number(u.streak || 0), remoteStreak, localTracker.streak);

        const remoteSeconds = Number(lStats.totalStudySeconds ?? lStats.studySeconds ?? lStats.duration ?? u.totalStudySeconds ?? u.studySeconds ?? 0);
        const finalSeconds = Math.max(Number(u.studySeconds || 0), remoteSeconds, localTracker.seconds);

        return {
          ...u,
          userId: u.userId || u.id || `USR-${Math.random().toString(36).substring(2, 6)}`,
          name: u.name || lStats.name || lStats.userName || 'Siswa',
          role: u.role || (lStats ? 'student' : 'student'),
          streak: finalStreak,
          longestStreak: Math.max(Number(u.longestStreak || 0), Number(lStats.longestStreak || 0), localTracker.longestStreak, finalStreak),
          studySeconds: finalSeconds,
          lastClaimDate: u.lastClaimDate || lStats.lastClaimDate || '',
          lastActiveDate: u.lastActiveDate || lStats.lastActiveDate || ''
        };
      });

      // Include any students from leaderboard that weren't in user table
      leaderList.forEach(l => {
        if (!l) return;
        const uid = String(l.userId || '').trim().toLowerCase();
        const email = String(l.email || '').trim().toLowerCase();
        if (uid && !processedUserIds.has(uid) && (!email || !processedUserIds.has(email))) {
          processedUserIds.add(uid);
          let localTracker = { seconds: 0, streak: 0, longestStreak: 0 };
          try {
            const raw = localStorage.getItem(`lms_learning_tracker_${l.userId}`);
            if (raw) localTracker = extractSecondsFromTracker(raw);
          } catch {}

          const lSeconds = Number(l.totalStudySeconds ?? l.studySeconds ?? l.duration ?? 0);
          const lStreak = Number(l.currentStreak ?? l.streak ?? 0);

          merged.push({
            userId: l.userId,
            name: l.name || l.userName || 'Siswa',
            email: l.email || '',
            role: 'student',
            status: 'active',
            streak: Math.max(lStreak, localTracker.streak),
            longestStreak: Math.max(Number(l.longestStreak || 0), localTracker.longestStreak, lStreak),
            studySeconds: Math.max(lSeconds, localTracker.seconds),
            lastClaimDate: l.lastClaimDate || '',
            lastActiveDate: l.lastActiveDate || ''
          });
        }
      });

      setUsers(merged);
    } catch (err) {
      setUserError(err.message);
    } finally {
      setFetchingUsers(false);
    }
  }, [auth, apiUrl]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

  // Real-time listener for leaderboard updates across tabs or tracker events
  useEffect(() => {
    const handleLeaderboardUpdate = () => {
      if (isAdmin) {
        fetchUsers();
      }
    };
    window.addEventListener('storage', handleLeaderboardUpdate);
    window.addEventListener('lms_leaderboard_updated', handleLeaderboardUpdate);
    return () => {
      window.removeEventListener('storage', handleLeaderboardUpdate);
      window.removeEventListener('lms_leaderboard_updated', handleLeaderboardUpdate);
    };
  }, [isAdmin, fetchUsers]);

  const totalUsers = users.length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalEducators = users.filter(u => u.role === 'educator').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;

  const totalBatches = coursesData?.length || 0;
  const totalModules = coursesData?.reduce((sum, b) => sum + (b.modules?.length || 0), 0) || 0;
  const totalContents = coursesData?.reduce((sum, b) => sum + b.modules?.reduce((mSum, m) => mSum + (m.contents?.length || 0), 0) || 0, 0) || 0;

  const filteredLeaderboard = useMemo(() => {
    // Strictly student leaderboard
    let list = users.filter(u => u.role === 'student');

    const q = leaderboardSearch.toLowerCase().trim();
    if (q) {
      list = list.filter(u => 
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.userId && u.userId.toLowerCase().includes(q))
      );
    }

    return [...list].sort((a, b) => {
      if (leaderboardSort === 'streak') {
        const streakA = Number(a.streak || 0);
        const streakB = Number(b.streak || 0);
        if (streakB !== streakA) return streakB - streakA;
        return Number(b.studySeconds || 0) - Number(a.studySeconds || 0);
      }
      // 'time': study duration first
      const timeA = Number(a.studySeconds || 0);
      const timeB = Number(b.studySeconds || 0);
      if (timeB !== timeA) return timeB - timeA;
      return Number(b.streak || 0) - Number(a.streak || 0);
    });
  }, [users, leaderboardSearch, leaderboardSort]);

  return {
    auth,
    isAdmin,
    coursesData,
    manualSync,
    lmsLoading,
    allAnnouncements,
    fetchAnnouncements,
    annLoading,
    users,
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
    filteredLeaderboard
  };
}
