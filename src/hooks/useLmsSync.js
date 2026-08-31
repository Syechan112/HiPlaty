import { useState, useCallback } from 'react';
import { API_URL, CACHE_KEY, SYNC_TIME_KEY } from '../config/api';

const API_URL_KEY = 'lms_api_url';

export function useLmsSync() {
  const getApiUrl = () => API_URL;

  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(() => {
    try {
      const syncTime = localStorage.getItem(SYNC_TIME_KEY);
      return syncTime ? new Date(syncTime).toISOString() : null;
    } catch {
      return null;
    }
  });
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  const fetchData = useCallback(async () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl();
      const separator = apiUrl.includes('?') ? '&' : '?';
      const fetchUrl = `${apiUrl}${separator}action=get_contents&_t=${Date.now()}`;
      
      const response = await fetch(fetchUrl);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const jsonData = await response.json();

      
      if (Array.isArray(jsonData)) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(jsonData));
        const now = new Date().toISOString();
        localStorage.setItem(SYNC_TIME_KEY, now);
        
        setData(jsonData);
        setLastSync(now);
      } else {
        throw new Error(jsonData.error || "Format data materi tidak valid");
      }
    } catch (err) {
      console.error('Fetch failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const manualSync = useCallback(async () => {
    return await fetchData();
  }, [fetchData]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(SYNC_TIME_KEY);
    setData([]);
    setLastSync(null);
  }, []);

  return {
    data,
    loading,
    error,
    lastSync,
    isOnline,
    manualSync,
    clearCache,
    refetch: fetchData,
  };
}