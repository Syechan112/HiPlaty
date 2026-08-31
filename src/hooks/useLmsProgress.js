import { useState, useCallback, useEffect } from 'react';
import { PROGRESS_KEY } from '../config/api';
import { useAuth } from './useAuth';

export function useLmsProgress() {
  const { auth } = useAuth();
  const userId = auth?.userId || auth?.email || 'guest';
  const userProgressKey = `${PROGRESS_KEY}_${userId}`;

  // State initialized specifically for the active user
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(userProgressKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load user progress:', e);
    }
    return { completedContents: [] };
  });

  // Re-sync progress whenever the active user logs in / switches accounts
  useEffect(() => {
    try {
      const stored = localStorage.getItem(userProgressKey);
      if (stored) {
        setProgress(JSON.parse(stored));
      } else {
        setProgress({ completedContents: [] });
      }
    } catch (e) {
      console.warn('Failed to load user progress on user switch:', e);
      setProgress({ completedContents: [] });
    }
  }, [userProgressKey]);

  // Mark content complete for THIS specific user only
  const markContentComplete = useCallback((contentId) => {
    if (!contentId) return;
    setProgress((prev) => {
      const updated = {
        ...prev,
        completedContents: prev.completedContents.includes(contentId)
          ? prev.completedContents
          : [...prev.completedContents, contentId],
      };
      localStorage.setItem(userProgressKey, JSON.stringify(updated));
      return updated;
    });
  }, [userProgressKey]);

  // Mark content incomplete for THIS specific user only
  const markContentIncomplete = useCallback((contentId) => {
    if (!contentId) return;
    setProgress((prev) => {
      const updated = {
        ...prev,
        completedContents: prev.completedContents.filter((id) => id !== contentId),
      };
      localStorage.setItem(userProgressKey, JSON.stringify(updated));
      return updated;
    });
  }, [userProgressKey]);

  const isContentComplete = useCallback((contentId) => {
    if (!contentId) return false;
    return progress.completedContents.includes(contentId);
  }, [progress.completedContents]);

  const calculateProgressPercentage = useCallback((totalContents) => {
    if (!totalContents || totalContents === 0) return 0;
    return Math.round((progress.completedContents.length / totalContents) * 100);
  }, [progress.completedContents.length]);

  const calculateBatchProgress = useCallback((batch) => {
    if (!batch || !batch.modules || batch.modules.length === 0) return 0;
    
    const totalContents = batch.modules.reduce(
      (sum, module) => sum + (module.contents?.length || 0),
      0
    );

    if (totalContents === 0) return 0;

    const completedInBatch = progress.completedContents.filter((contentId) => {
      return batch.modules.some((module) =>
        module.contents?.some((content) => content.contentId === contentId)
      );
    }).length;

    return Math.round((completedInBatch / totalContents) * 100);
  }, [progress.completedContents]);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(userProgressKey);
    setProgress({ completedContents: [] });
  }, [userProgressKey]);

  const getCompletedCount = useCallback(() => {
    return progress.completedContents.length;
  }, [progress.completedContents]);

  return {
    progress,
    markContentComplete,
    markContentIncomplete,
    isContentComplete,
    calculateProgressPercentage,
    calculateBatchProgress,
    resetProgress,
    getCompletedCount,
  };
}
