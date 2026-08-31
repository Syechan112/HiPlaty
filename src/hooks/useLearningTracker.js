import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from './useAuth';
import { API_URL } from '../config/api';

const TRACKER_PREFIX = 'lms_learning_tracker_';

function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLocalMonthString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getLocalYearString(d = new Date()) {
  return String(d.getFullYear());
}

function getDaysDifference(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return null;
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function getDefaultTrackerData() {
  return {
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastClaimDate: null,
      history: []
    },
    timeLogs: {
      days: {},
      months: {},
      years: {}
    }
  };
}

function getGuestTrackerId() {
  if (typeof window === 'undefined') return 'GUEST_DEFAULT';
  try {
    let guestId = localStorage.getItem('lms_guest_uid');
    if (!guestId) {
      guestId = `GUEST_${Date.now().toString(36).toUpperCase()}`;
      localStorage.setItem('lms_guest_uid', guestId);
    }
    return guestId;
  } catch {
    return 'GUEST_DEFAULT';
  }
}

export function useLearningTracker() {
  const { auth } = useAuth();
  
  // Strictly isolate user ID and user Name
  const userId = useMemo(() => {
    if (auth?.userId) return auth.userId;
    return getGuestTrackerId();
  }, [auth?.userId]);

  const userName = useMemo(() => {
    if (auth?.name) return auth.name;
    if (typeof window === 'undefined') return 'Tamu';
    try {
      const profile = localStorage.getItem('lms_user_profile');
      if (profile) {
        const p = JSON.parse(profile);
        if (p.name && !p.isGuest) return p.name;
      }
    } catch (e) {
      console.warn(e);
    }
    return 'Tamu';
  }, [auth?.name]);

  const userStorageKey = `${TRACKER_PREFIX}${userId}`;

  // State loaded from localStorage STRICTLY for this specific user
  const [trackerData, setTrackerData] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(userStorageKey);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (e) {
      console.warn('Failed to parse tracker data:', e);
    }
    return getDefaultTrackerData();
  });

  // Reload state whenever userId switches (e.g. login, logout, switch account)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(userStorageKey);
      if (stored) {
        setTrackerData(JSON.parse(stored));
      } else {
        setTrackerData(getDefaultTrackerData());
      }
    } catch (e) {
      setTrackerData(getDefaultTrackerData());
    }
  }, [userStorageKey]);

  // Keep state synced to localStorage for THIS user only
  useEffect(() => {
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(trackerData));
    } catch (e) {
      console.warn('Failed to write tracker data:', e);
    }
  }, [trackerData, userStorageKey]);

  // Direct remote sync helper to Google Sheets
  const syncToSheets = useCallback((dataSnapshot) => {
    const currentData = dataSnapshot || trackerData;
    const allSecs = Object.values(currentData.timeLogs?.days || {}).reduce((acc, d) => acc + (d.seconds || 0), 0);
    const currentStreak = currentData.streak?.currentStreak || 0;
    const longestStreak = currentData.streak?.longestStreak || currentStreak;
    const lastClaimDate = currentData.streak?.lastClaimDate || '';

    // Only sync if user has actual streak or study time
    if (currentStreak === 0 && allSecs === 0) return;

    try {
      window.dispatchEvent(new CustomEvent('lms_leaderboard_updated'));
      fetch(`${API_URL}?action=sync_user_stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          userId,
          userName,
          currentStreak,
          longestStreak,
          totalStudySeconds: allSecs,
          lastClaimDate
        })
      }).catch(err => console.warn('Remote sync error:', err));
    } catch (e) {
      console.warn(e);
    }
  }, [userId, userName, trackerData]);

  // Current session tracking refs
  const activeLessonRef = useRef(null);
  const sessionStartTimeRef = useRef(null);

  // Helper to commit seconds to state
  const commitElapsedSeconds = useCallback((secondsToAdd) => {
    if (secondsToAdd <= 0) return;

    const now = new Date();
    const today = getLocalDateString(now);
    const thisMonth = getLocalMonthString(now);
    const thisYear = getLocalYearString(now);

    setTrackerData(prev => {
      const prevDays = prev.timeLogs?.days || {};
      const prevMonths = prev.timeLogs?.months || {};
      const prevYears = prev.timeLogs?.years || {};

      const currentDayData = prevDays[today] || { seconds: 0, materialsCount: 0 };
      const currentMonthData = prevMonths[thisMonth] || { seconds: 0 };
      const currentYearData = prevYears[thisYear] || { seconds: 0 };

      const updated = {
        ...prev,
        timeLogs: {
          ...prev.timeLogs,
          days: {
            ...prevDays,
            [today]: {
              ...currentDayData,
              seconds: (currentDayData.seconds || 0) + secondsToAdd
            }
          },
          months: {
            ...prevMonths,
            [thisMonth]: {
              ...currentMonthData,
              seconds: (currentMonthData.seconds || 0) + secondsToAdd
            }
          },
          years: {
            ...prevYears,
            [thisYear]: {
              ...currentYearData,
              seconds: (currentYearData.seconds || 0) + secondsToAdd
            }
          }
        }
      };

      syncToSheets(updated);
      return updated;
    });
  }, [syncToSheets]);

  // Flush buffer to storage
  const flushCurrentSession = useCallback(() => {
    if (sessionStartTimeRef.current) {
      const now = Date.now();
      const elapsed = Math.floor((now - sessionStartTimeRef.current) / 1000);
      if (elapsed > 0) {
        commitElapsedSeconds(elapsed);
      }
      sessionStartTimeRef.current = Date.now();
    }
  }, [commitElapsedSeconds]);

  // Start tracking when user opens a lesson
  const startLessonTracking = useCallback((contentId, batchId = '') => {
    if (!contentId) return;
    flushCurrentSession();
    activeLessonRef.current = { contentId, batchId };
    sessionStartTimeRef.current = Date.now();
  }, [flushCurrentSession]);

  // Stop tracking when user leaves or closes lesson
  const stopLessonTracking = useCallback(() => {
    flushCurrentSession();
    activeLessonRef.current = null;
    sessionStartTimeRef.current = null;
  }, [flushCurrentSession]);

  // Visibility and unload listeners
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        flushCurrentSession();
        sessionStartTimeRef.current = null;
      } else {
        if (activeLessonRef.current) {
          sessionStartTimeRef.current = Date.now();
        }
      }
    };

    const handleBeforeUnload = () => {
      flushCurrentSession();
    };

    const interval = setInterval(() => {
      if (!document.hidden && activeLessonRef.current && sessionStartTimeRef.current) {
        flushCurrentSession();
      }
    }, 15000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      flushCurrentSession();
    };
  }, [flushCurrentSession]);

  // ============================================================
  // STREAK CLAIM & MISSED DAYS PENALTY LOGIC
  // Rule:
  // - Streak terus diakumulasi tanpa batas (Senin -> Minggu -> Senin terus bertambah)
  // - Jika terlewat 1 hari (tidak login 1 hari): Streak dikurangi 1
  // - Jika terlewat 2 hari (tidak login 2 hari): Streak dikurangi 5
  // - Jika terlewat 3 hari atau lebih: Streak di-reset ke 0 (menjadi 1 saat klaim hari ini)
  // ============================================================

  const todayStr = useMemo(() => getLocalDateString(), []);
  
  const canClaimTodayStreak = useMemo(() => {
    const lastClaim = trackerData.streak?.lastClaimDate;
    return lastClaim !== todayStr;
  }, [trackerData.streak?.lastClaimDate, todayStr]);

  // Automatic decay check on load / mount when days were missed
  useEffect(() => {
    if (!trackerData.streak?.lastClaimDate) return;
    const daysDiff = getDaysDifference(trackerData.streak.lastClaimDate, todayStr);
    
    if (daysDiff !== null && daysDiff > 1) {
      const currentVal = trackerData.streak.currentStreak || 0;
      let decayedStreak = currentVal;
      
      if (daysDiff === 2) {
        // Missed 1 day: penalty -1
        decayedStreak = Math.max(0, currentVal - 1);
      } else if (daysDiff === 3) {
        // Missed 2 days: penalty -5
        decayedStreak = Math.max(0, currentVal - 5);
      } else if (daysDiff >= 4) {
        // Missed 3+ days: reset to 0
        decayedStreak = 0;
      }

      if (decayedStreak !== currentVal) {
        const updated = {
          ...trackerData,
          streak: {
            ...trackerData.streak,
            currentStreak: decayedStreak
          }
        };
        setTrackerData(updated);
        syncToSheets(updated);
      }
    }
  }, [trackerData.streak?.lastClaimDate, todayStr, syncToSheets]);

  const claimTodayStreak = useCallback(() => {
    const now = new Date();
    const today = getLocalDateString(now);
    const lastClaim = trackerData.streak?.lastClaimDate;

    if (lastClaim === today) {
      return { success: false, message: 'Streak hari ini sudah diklaim!' };
    }

    const currentBase = trackerData.streak?.currentStreak || 0;
    const daysDiff = lastClaim ? getDaysDifference(lastClaim, today) : null;

    let nextStreak;
    let penaltyNotice = '';

    if (!lastClaim || daysDiff === null || daysDiff >= 4) {
      // Missed 3+ days or first time: Reset to 1
      nextStreak = 1;
      if (lastClaim && daysDiff && daysDiff >= 4 && currentBase > 0) {
        penaltyNotice = ' (Terlewat 3+ hari: streak di-reset ke 1)';
      }
    } else if (daysDiff === 1) {
      // Consecutive day (e.g. yesterday): +1
      nextStreak = currentBase + 1;
    } else if (daysDiff === 2) {
      // Missed 1 day: penalty -1 then +1 today
      const penalized = Math.max(0, currentBase - 1);
      nextStreak = penalized + 1;
      penaltyNotice = ' (Terlewat 1 hari: penalti streak -1)';
    } else if (daysDiff === 3) {
      // Missed 2 days: penalty -5 then +1 today
      const penalized = Math.max(0, currentBase - 5);
      nextStreak = penalized + 1;
      penaltyNotice = ' (Terlewat 2 hari: penalti streak -5)';
    } else {
      nextStreak = 1;
    }

    const nextLongest = Math.max(trackerData.streak?.longestStreak || 0, nextStreak);
    const nextHistory = Array.from(new Set([...(trackerData.streak?.history || []), today]));

    const updated = {
      ...trackerData,
      streak: {
        currentStreak: nextStreak,
        longestStreak: nextLongest,
        lastClaimDate: today,
        history: nextHistory
      }
    };

    setTrackerData(updated);
    syncToSheets(updated);

    return {
      success: true,
      currentStreak: nextStreak,
      longestStreak: nextLongest,
      message: `Selamat! Streak berhasil diklaim (+1 Hari). Total streak: ${nextStreak} hari! 🔥${penaltyNotice}`
    };
  }, [trackerData, syncToSheets]);

  // ============================================================
  // ANALYTICS COMPUTATION (Per Hari, Per Bulan, Per Tahun)
  // ============================================================

  // 1. Weekly Data (7 Days: Strictly Senin s/d Minggu)
  const weeklyAnalytics = useMemo(() => {
    const daysName = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const fullDaysName = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const now = new Date();
    const currentDay = now.getDay();
    
    const distToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const mondayDate = new Date(now);
    mondayDate.setDate(now.getDate() + distToMonday);

    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);
      const dateKey = getLocalDateString(d);
      const dateNum = d.getDate();
      const dateStr = `${dateNum} ${d.toLocaleDateString('id-ID', { month: 'short' })}`;
      const daySecs = trackerData.timeLogs?.days?.[dateKey]?.seconds || 0;
      const dayMins = Math.round(daySecs / 60);
      const isClaimed = trackerData.streak?.history?.includes(dateKey) || daySecs > 0;

      result.push({
        dateKey,
        dateNum,
        dateStr,
        day: daysName[i],
        full: `${fullDaysName[i]}, ${dateStr}`,
        minutes: dayMins,
        seconds: daySecs,
        active: isClaimed,
        isToday: dateKey === todayStr
      });
    }
    return result;
  }, [trackerData.timeLogs?.days, trackerData.streak?.history, todayStr]);

  // 2. Monthly Data (Current Year 12 Months: Jan - Des)
  const monthlyAnalytics = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentYear = getLocalYearString();
    const result = [];

    for (let m = 1; m <= 12; m++) {
      const monthKey = `${currentYear}-${String(m).padStart(2, '0')}`;
      const mSecs = trackerData.timeLogs?.months?.[monthKey]?.seconds || 0;
      const mMins = Math.round(mSecs / 60);
      const mHours = (mSecs / 3600).toFixed(1);

      result.push({
        monthKey,
        label: monthNames[m - 1],
        minutes: mMins,
        hours: parseFloat(mHours),
        seconds: mSecs,
        isCurrentMonth: monthKey === getLocalMonthString()
      });
    }
    return result;
  }, [trackerData.timeLogs?.months]);

  // 3. Yearly Data (Last 3 Years)
  const yearlyAnalytics = useMemo(() => {
    const thisYear = new Date().getFullYear();
    const result = [];
    for (let y = thisYear - 2; y <= thisYear; y++) {
      const yearKey = String(y);
      const ySecs = trackerData.timeLogs?.years?.[yearKey]?.seconds || 0;
      const yHours = (ySecs / 3600).toFixed(1);

      result.push({
        yearKey,
        label: yearKey,
        hours: parseFloat(yHours),
        minutes: Math.round(ySecs / 60),
        seconds: ySecs,
        isCurrentYear: yearKey === String(thisYear)
      });
    }
    return result;
  }, [trackerData.timeLogs?.years]);

  // Total Study Duration Formatted
  const totalStudySeconds = useMemo(() => {
    return Object.values(trackerData.timeLogs?.days || {}).reduce((acc, d) => acc + (d.seconds || 0), 0);
  }, [trackerData.timeLogs?.days]);

  const totalStudyTimeFormatted = useMemo(() => {
    const hours = Math.floor(totalStudySeconds / 3600);
    const mins = Math.floor((totalStudySeconds % 3600) / 60);
    const secs = totalStudySeconds % 60;
    if (hours > 0) {
      return `${hours} Jam ${mins} Menit`;
    }
    if (mins > 0) {
      return `${mins} Menit`;
    }
    return `${secs} Detik`;
  }, [totalStudySeconds]);

  return {
    userId,
    userName,
    streak: trackerData.streak || { currentStreak: 0, longestStreak: 0, lastClaimDate: null, history: [] },
    canClaimTodayStreak,
    claimTodayStreak,
    startLessonTracking,
    stopLessonTracking,
    weeklyAnalytics,
    monthlyAnalytics,
    yearlyAnalytics,
    totalStudySeconds,
    totalStudyTimeFormatted
  };
}
