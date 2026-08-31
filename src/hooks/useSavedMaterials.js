import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { API_URL } from '../config/api';

const SAVED_BATCHES_KEY = 'lms_saved_batches';
const SAVED_MATERIALS_KEY = 'lms_saved_materials';
const GLOBAL_SAVED_USERS_KEY = 'lms_global_saved_users';

export function useSavedMaterials() {
  const { auth } = useAuth();
  const userId = auth?.userId || 'GUEST_USER';
  const userName = auth?.name || 'Siswa Pembelajar';

  // State 1: Current User's Saved Batches (Batch IDs list)
  const [savedBatchIds, setSavedBatchIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`${SAVED_BATCHES_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // State 2: Current User's Saved Individual Materials
  const [savedMaterials, setSavedMaterials] = useState(() => {
    try {
      const stored = localStorage.getItem(`${SAVED_MATERIALS_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // State 3: Global Map of Users who saved each batch: { [batchKey]: Array<{ userId, userName, savedAt }> }
  const [globalSavedUsersMap, setGlobalSavedUsersMap] = useState(() => {
    try {
      const stored = localStorage.getItem(GLOBAL_SAVED_USERS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Sync state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`${SAVED_BATCHES_KEY}_${userId}`, JSON.stringify(savedBatchIds));
      localStorage.setItem(`${SAVED_MATERIALS_KEY}_${userId}`, JSON.stringify(savedMaterials));
      localStorage.setItem(GLOBAL_SAVED_USERS_KEY, JSON.stringify(globalSavedUsersMap));
    } catch (e) {
      console.error('Failed to write local saved materials:', e);
    }
  }, [savedBatchIds, savedMaterials, globalSavedUsersMap, userId]);

  // Fetch saved bookmarks from Google Sheets
  const fetchRemoteBookmarks = useCallback(async () => {
    try {
      const endpointUrl = API_URL;
      const response = await fetch(`${endpointUrl}?action=get_bookmarks&_t=${Date.now()}`);
      if (!response.ok) return;
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const userBatchIds = [];
        const userItems = [];
        const usersMap = {};

        data.forEach(item => {
          let bId = '';
          if (item.contentId && item.contentId.startsWith('BATCH-SAVED:')) {
            bId = item.contentId.replace('BATCH-SAVED:', '').trim();
          } else if (item.batchId && !item.contentId) {
            bId = String(item.batchId).trim();
          }

          const bName = String(item.batchName || item.title || '').replace(/^Batch:\s*/i, '').trim().toLowerCase();
          const uId = String(item.userId || 'GUEST').trim();
          const uName = item.userName || 'Siswa Pembelajar';
          const savedAtTime = item.savedAt || new Date().toISOString();

          const userObj = {
            userId: uId,
            userName: uName,
            savedAt: savedAtTime
          };

          // Index by bId
          if (bId) {
            if (!usersMap[bId]) usersMap[bId] = [];
            if (!usersMap[bId].some(u => u.userId === uId)) {
              usersMap[bId].push(userObj);
            }
          }

          // Also index by bName for resilient matching
          if (bName) {
            if (!usersMap[bName]) usersMap[bName] = [];
            if (!usersMap[bName].some(u => u.userId === uId)) {
              usersMap[bName].push(userObj);
            }
          }

          // Filter for active logged-in user
          if (auth?.userId && String(item.userId).trim().toLowerCase() === String(auth.userId).trim().toLowerCase()) {
            if (bId) {
              userBatchIds.push(bId);
            } else {
              userItems.push(item);
            }
          }
        });

        setGlobalSavedUsersMap(usersMap);
        if (auth?.userId) {
          setSavedBatchIds(prev => Array.from(new Set([...prev, ...userBatchIds])));
          setSavedMaterials(userItems);
        }
      }
    } catch (err) {
      console.warn('Could not fetch bookmarks from server:', err);
    }
  }, [auth?.userId]);

  // Initial fetch and on auth change
  useEffect(() => {
    fetchRemoteBookmarks();
  }, [fetchRemoteBookmarks]);

  // Check if a batch is saved by active user
  const isBatchSaved = useCallback((batchId, batchName = '') => {
    if (!batchId && !batchName) return false;
    const bId = String(batchId || '').trim();
    return savedBatchIds.includes(bId);
  }, [savedBatchIds]);

  // Get full list of users who saved a specific batch
  const getBatchSavedUsers = useCallback((batchId, batchName = '') => {
    const bId = String(batchId || '').trim();
    const bName = String(batchName || '').trim().toLowerCase();

    // Look up in globalSavedUsersMap
    const listFromId = bId ? globalSavedUsersMap[bId] : null;
    const listFromName = bName ? globalSavedUsersMap[bName] : null;

    let merged = [];
    if (listFromId && Array.isArray(listFromId)) {
      merged = [...listFromId];
    }
    if (listFromName && Array.isArray(listFromName)) {
      listFromName.forEach(u => {
        if (!merged.some(m => m.userId === u.userId)) {
          merged.push(u);
        }
      });
    }

    // Include local optimistic state if saved by current user
    if (isBatchSaved(batchId) && !merged.some(u => u.userId === userId)) {
      return [{ userId, userName, savedAt: new Date().toISOString() }, ...merged];
    }

    return merged;
  }, [globalSavedUsersMap, isBatchSaved, userId, userName]);

  // Get total count of users who saved a specific batch
  const getBatchSaveCount = useCallback((batchId, batchName = '') => {
    return getBatchSavedUsers(batchId, batchName).length;
  }, [getBatchSavedUsers]);

  // Toggle Save/Unsave Batch
  const toggleSaveBatch = useCallback(async (batch) => {
    if (!batch || !batch.batchId) return;

    const bId = String(batch.batchId).trim();
    const bName = String(batch.batchName || '').trim().toLowerCase();
    const isCurrentlySaved = savedBatchIds.includes(bId);
    const endpointUrl = API_URL;
    setIsSyncing(true);

    if (isCurrentlySaved) {
      // Optimistic remove
      const updated = savedBatchIds.filter(id => id !== bId);
      setSavedBatchIds(updated);
      setGlobalSavedUsersMap(prev => {
        const nextMap = { ...prev };
        if (nextMap[bId]) {
          nextMap[bId] = nextMap[bId].filter(u => u.userId !== userId);
        }
        if (bName && nextMap[bName]) {
          nextMap[bName] = nextMap[bName].filter(u => u.userId !== userId);
        }
        return nextMap;
      });

      try {
        await fetch(`${endpointUrl}?action=remove_bookmark`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            userId,
            contentId: `BATCH-SAVED:${bId}`
          })
        });
        fetchRemoteBookmarks();
      } catch (e) {
        console.warn('Failed to remove batch bookmark from sheets:', e);
      } finally {
        setIsSyncing(false);
      }
      return false;
    } else {
      // Optimistic add
      const updated = [bId, ...savedBatchIds.filter(id => id !== bId)];
      setSavedBatchIds(updated);
      const newUserEntry = { userId, userName, savedAt: new Date().toISOString() };
      
      setGlobalSavedUsersMap(prev => {
        const nextMap = { ...prev };
        const existingId = (nextMap[bId] || []).filter(u => u.userId !== userId);
        nextMap[bId] = [newUserEntry, ...existingId];
        if (bName) {
          const existingName = (nextMap[bName] || []).filter(u => u.userId !== userId);
          nextMap[bName] = [newUserEntry, ...existingName];
        }
        return nextMap;
      });

      try {
        await fetch(`${endpointUrl}?action=save_bookmark`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            userId,
            userName,
            contentId: `BATCH-SAVED:${bId}`,
            title: `Batch: ${batch.batchName || bId}`,
            batchName: batch.batchName || bId,
            moduleTitle: `${batch.modules?.length || 0} Modul`,
            savedAt: new Date().toISOString()
          })
        });
        fetchRemoteBookmarks();
      } catch (e) {
        console.warn('Failed to save batch bookmark to sheets:', e);
      } finally {
        setIsSyncing(false);
      }
      return true;
    }
  }, [savedBatchIds, userId, userName, fetchRemoteBookmarks]);

  // Check if single content is saved
  const isSaved = useCallback((contentId) => {
    if (!contentId) return false;
    return savedMaterials.some(item => String(item.contentId).trim() === String(contentId).trim());
  }, [savedMaterials]);

  // Toggle single content
  const toggleSave = useCallback(async (content, batchName = '', moduleTitle = '') => {
    if (!content || !content.contentId) return;

    const targetId = String(content.contentId).trim();
    const alreadySaved = savedMaterials.some(item => String(item.contentId).trim() === targetId);
    const endpointUrl = API_URL;
    setIsSyncing(true);

    if (alreadySaved) {
      const nextList = savedMaterials.filter(item => String(item.contentId).trim() !== targetId);
      setSavedMaterials(nextList);

      try {
        await fetch(`${endpointUrl}?action=remove_bookmark`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ userId, contentId: targetId })
        });
      } catch (err) {
        console.warn('Failed to sync remove_bookmark:', err);
      } finally {
        setIsSyncing(false);
      }
      return false;
    } else {
      const newItem = {
        contentId: targetId,
        title: content.title || content.contentTitle || 'Materi Pembelajaran',
        batchName: batchName || content.batchName || 'Batch Kurikulum',
        moduleTitle: moduleTitle || content.moduleTitle || 'Modul Pembelajaran',
        savedAt: new Date().toISOString(),
        userId,
        userName
      };

      setSavedMaterials([newItem, ...savedMaterials]);

      try {
        await fetch(`${endpointUrl}?action=save_bookmark`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(newItem)
        });
      } catch (err) {
        console.warn('Failed to sync save_bookmark:', err);
      } finally {
        setIsSyncing(false);
      }
      return true;
    }
  }, [savedMaterials, userId, userName]);

  // Filter full data to only return batches that are saved/enrolled by the student
  const getSavedBatches = useCallback((allData) => {
    if (!allData || !Array.isArray(allData)) return [];
    return allData.filter(b => savedBatchIds.includes(String(b.batchId).trim()));
  }, [savedBatchIds]);

  return {
    savedBatchIds,
    isBatchSaved,
    toggleSaveBatch,
    getBatchSaveCount,
    getBatchSavedUsers,
    savedMaterials,
    isSaved,
    toggleSave,
    getSavedBatches,
    fetchRemoteBookmarks,
    isSyncing,
    savedBatchCount: savedBatchIds.length,
    savedContentCount: savedMaterials.length
  };
}
