import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useLmsSync } from './useLmsSync';
import { useLmsProgress } from './useLmsProgress';
import { useSavedMaterials } from './useSavedMaterials';
import { useLearningTracker } from './useLearningTracker';
import { useLeaderboard } from './useLeaderboard';

export function useStudentDashboard() {
  const { data, error, lastSync, isOnline, manualSync } = useLmsSync();
  const { isContentComplete, getCompletedCount, calculateBatchProgress } = useLmsProgress();
  const { 
    isBatchSaved, 
    toggleSaveBatch, 
    getBatchSaveCount, 
    getBatchSavedUsers, 
    getSavedBatches,
    savedBatchCount, 
    savedBatchIds 
  } = useSavedMaterials();
  const { 
    userId,
    userName,
    streak, 
    canClaimTodayStreak, 
    claimTodayStreak, 
    weeklyAnalytics, 
    monthlyAnalytics, 
    yearlyAnalytics,
    totalStudySeconds,
    totalStudyTimeFormatted 
  } = useLearningTracker();

  const { 
    streakLeaderboard, 
    studyTimeLeaderboard, 
    fetchLeaderboard, 
    loading: leaderboardLoading 
  } = useLeaderboard();
  const { auth, isGuest } = useAuth();
  const navigate = useNavigate();

  const [selectedUsersListBatch, setSelectedUsersListBatch] = useState(null);
  const [chartViewMode, setChartViewMode] = useState('day');
  const [leaderboardTab, setLeaderboardTab] = useState('streak');
  const [toastMessage, setToastMessage] = useState('');

  const totalBatches = data?.length || 0;
  const totalContents = useMemo(() => {
    return data?.reduce(
      (sum, batch) =>
        sum +
        batch.modules?.reduce(
          (mSum, module) => mSum + (module.contents?.length || 0),
          0
        ) || 0,
      0
    ) || 0;
  }, [data]);

  const savedBatches = useMemo(() => {
    return getSavedBatches(data || []);
  }, [data, getSavedBatches]);

  const savedBatchesTotalContents = useMemo(() => {
    return savedBatches.reduce(
      (sum, batch) =>
        sum +
        (batch.modules?.reduce(
          (mSum, module) => mSum + (module.contents?.length || 0),
          0
        ) || 0),
      0
    );
  }, [savedBatches]);

  const savedBatchesCompletedCount = useMemo(() => {
    if (!savedBatches.length) return 0;
    
    let count = 0;
    savedBatches.forEach((batch) => {
      batch.modules?.forEach((module) => {
        module.contents?.forEach((content) => {
          if (content.contentId && isContentComplete(content.contentId)) {
            count++;
          }
        });
      });
    });
    return count;
  }, [savedBatches, isContentComplete]);

  const savedBatchesProgress = savedBatchesTotalContents > 0 
    ? Math.round((savedBatchesCompletedCount / savedBatchesTotalContents) * 100) 
    : 0;

  const handleClaimStreak = () => {
    const res = claimTodayStreak();
    setToastMessage(res.message);
    fetchLeaderboard(true);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const activeChartData = useMemo(() => {
    if (chartViewMode === 'month') return monthlyAnalytics;
    if (chartViewMode === 'year') return yearlyAnalytics;
    return weeklyAnalytics;
  }, [chartViewMode, weeklyAnalytics, monthlyAnalytics, yearlyAnalytics]);

  const popularBatchesRank = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return [...data]
      .map(b => ({
        ...b,
        savesCount: getBatchSaveCount(b.batchId, b.batchName),
        contentsCount: b.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0
      }))
      .sort((a, b) => b.savesCount - a.savesCount);
  }, [data, getBatchSaveCount]);

  return {
    auth,
    isGuest,
    data,
    savedBatches,
    savedBatchCount,
    savedBatchesProgress,
    savedBatchesCompletedCount,
    savedBatchesTotalContents,
    totalBatches,
    totalContents,
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
    fetchLeaderboard,
    selectedUsersListBatch,
    setSelectedUsersListBatch,
    toastMessage,
    getBatchSavedUsers
  };
}
