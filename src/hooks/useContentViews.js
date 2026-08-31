import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';

const VIEWS_STORAGE_KEY = 'lms_content_views_cache';
const VIEWED_SESSION_KEY = 'lms_viewed_session_items';

export function useContentViews() {
  const [viewsMap, setViewsMap] = useState(() => {
    try {
      const stored = localStorage.getItem(VIEWS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const fetchRemoteViews = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}?action=get_content_views&_t=${Date.now()}`);
      if (!response.ok) return;
      const data = await response.json();
      if (data && typeof data === 'object') {
        setViewsMap(prev => {
          const merged = { ...prev, ...data };
          try {
            localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(merged));
          } catch (e) {
            console.warn(e);
          }
          return merged;
        });
      }
    } catch (err) {
      console.warn('Could not fetch content views from server:', err);
    }
  }, []);

  useEffect(() => {
    fetchRemoteViews();
  }, [fetchRemoteViews]);

  const getContentViews = useCallback((contentId) => {
    if (!contentId) return 0;
    const cleanId = String(contentId).trim();
    return Number(viewsMap[cleanId] || 0);
  }, [viewsMap]);

  const getBatchTotalViews = useCallback((batch) => {
    if (!batch || !batch.modules) return 0;
    let sum = 0;
    batch.modules.forEach(m => {
      m.contents?.forEach(c => {
        sum += Number(viewsMap[c.contentId] || 0);
      });
    });
    return sum;
  }, [viewsMap]);

  const incrementView = useCallback(async (contentId) => {
    if (!contentId) return;
    const cleanId = String(contentId).trim();

    try {
      const sessionKey = `${VIEWED_SESSION_KEY}_${cleanId}`;
      const lastViewed = sessionStorage.getItem(sessionKey);
      const now = Date.now();

      // Guard: count once per 10 minutes in the same tab session
      if (lastViewed && now - Number(lastViewed) < 10 * 60 * 1000) {
        return;
      }
      sessionStorage.setItem(sessionKey, String(now));
    } catch (e) {
      console.warn(e);
    }

    // Optimistic local increment
    setViewsMap(prev => {
      const current = Number(prev[cleanId] || 0);
      const updated = { ...prev, [cleanId]: current + 1 };
      try {
        localStorage.setItem(VIEWS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    // Remote sync
    try {
      fetch(`${API_URL}?action=increment_content_view`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ contentId: cleanId })
      }).catch(() => {});
    } catch (err) {
      console.warn('Failed to sync view count:', err);
    }
  }, []);

  return {
    viewsMap,
    getContentViews,
    getBatchTotalViews,
    incrementView,
    refreshViews: fetchRemoteViews
  };
}
