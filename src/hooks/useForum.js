import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth';
import { API_URL, USER_PROFILE_KEY, AUTH_KEY } from '../config/api';
import { 
  FORUM_STORAGE_KEY, 
  FORUM_TTL_MS, 
  INITIAL_FORUM_THREADS 
} from '../constants/forumConstants';

function getGuestId() {
  if (typeof window === 'undefined') return 'GUEST';
  try {
    let gId = localStorage.getItem('lms_guest_uid');
    if (!gId) {
      gId = `GUEST_${Date.now().toString(36).toUpperCase()}`;
      localStorage.setItem('lms_guest_uid', gId);
    }
    return gId;
  } catch {
    return 'GUEST';
  }
}

export function useForum() {
  const { auth, isGuest } = useAuth();
  
  const activeUserId = useMemo(() => {
    if (auth?.userId) return String(auth.userId);
    if (auth?.id) return String(auth.id);
    if (auth?.email) return String(auth.email);
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        const u = JSON.parse(stored);
        if (u.userId) return String(u.userId);
        if (u.id) return String(u.id);
        if (u.email) return String(u.email);
      }
    } catch {}
    try {
      const profile = localStorage.getItem(USER_PROFILE_KEY);
      if (profile) {
        const p = JSON.parse(profile);
        if (p.userId) return String(p.userId);
        if (p.id) return String(p.id);
      }
    } catch {}
    return getGuestId();
  }, [auth]);

  const activeUserName = useMemo(() => {
    if (auth?.name) return auth.name;
    try {
      const profile = localStorage.getItem(USER_PROFILE_KEY);
      if (profile) {
        const p = JSON.parse(profile);
        if (p.name && !p.isGuest) return p.name;
      }
    } catch {}
    if (auth?.role === 'admin') return 'Administrator';
    if (auth?.role === 'educator') return 'Educator';
    return isGuest ? 'Tamu' : 'Siswa';
  }, [auth, isGuest]);

  const activeUserRole = useMemo(() => {
    if (auth?.role) return auth.role;
    try {
      const profile = localStorage.getItem(USER_PROFILE_KEY);
      if (profile) {
        const p = JSON.parse(profile);
        if (p.role) return p.role;
      }
    } catch {}
    return isGuest ? 'guest' : 'student';
  }, [auth, isGuest]);

  const [rawThreads, setRawThreads] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(FORUM_STORAGE_KEY);
        if (stored !== null) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const now = Date.now();
            return parsed.filter(t => now - (Number(t.createdAt) || 0) < FORUM_TTL_MS);
          }
        }
      }
    } catch (e) {
      console.warn('Error reading forum threads:', e);
    }
    return INITIAL_FORUM_THREADS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [activeDetailThreadId, setActiveDetailThreadId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const pruneExpiredThreads = useCallback(() => {
    setRawThreads(prev => {
      const now = Date.now();
      const filtered = prev.filter(t => now - (Number(t.createdAt) || 0) < FORUM_TTL_MS);
      if (filtered.length !== prev.length) {
        try {
          localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(filtered));
        } catch {}
      }
      return filtered;
    });
  }, []);

  const fetchRemoteThreads = useCallback(async (silent = true) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch(`${API_URL}?action=get_forum_threads&_t=${Date.now()}`);
      if (response.ok) {
        const remoteData = await response.json();
        if (Array.isArray(remoteData)) {
          const now = Date.now();
          const valid = remoteData
            .filter(t => now - (Number(t.createdAt) || 0) < FORUM_TTL_MS)
            .map(t => ({
              ...t,
              likes: Array.isArray(t.likes) ? t.likes.map(String).filter(Boolean) : [],
              replies: Array.isArray(t.replies) ? t.replies : []
            }));

          setRawThreads(valid);
          try {
            localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(valid));
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Apps Script forum fetch fallback:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    pruneExpiredThreads();
    fetchRemoteThreads(true);

    const interval = setInterval(() => {
      pruneExpiredThreads();
      fetchRemoteThreads(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [pruneExpiredThreads, fetchRemoteThreads]);

  useEffect(() => {
    try {
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(rawThreads));
    } catch (e) {
      console.warn('Error saving forum threads:', e);
    }
  }, [rawThreads]);

  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(FORUM_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const now = Date.now();
          setRawThreads(parsed.filter(t => now - (Number(t.createdAt) || 0) < FORUM_TTL_MS));
        }
      } catch {}
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('lms_forum_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('lms_forum_updated', handleSync);
    };
  }, []);

  const createThread = useCallback(async ({ title, content, tag, codeSnippet = '' }) => {
    if (!title.trim() || !content.trim()) return false;
    
    const newThread = {
      threadId: `th-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      content: content.trim(),
      tag: tag || 'general',
      codeSnippet: codeSnippet.trim(),
      authorId: activeUserId,
      authorName: activeUserName,
      authorRole: activeUserRole,
      createdAt: Date.now(),
      likes: [],
      replies: []
    };

    setRawThreads(prev => {
      const next = [newThread, ...prev];
      try {
        localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    window.dispatchEvent(new CustomEvent('lms_forum_updated'));
    setShowCreateModal(false);

    // Fire and forget in background
    fetch(`${API_URL}?action=create_forum_thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(newThread)
    }).catch(err => console.warn('Backend create thread fallback:', err));

    return true;
  }, [activeUserId, activeUserName, activeUserRole]);

  const toggleLike = useCallback((threadId) => {
    if (!threadId) return;
    const uidStr = String(activeUserId || '').trim();
    if (!uidStr) return;

    // 1. Instant optimistic update (0ms UI lag)
    setRawThreads(prev => {
      const next = prev.map(t => {
        if (t.threadId !== threadId) return t;
        const currentLikes = Array.isArray(t.likes) ? t.likes.map(String).filter(Boolean) : [];
        const isLiked = currentLikes.some(id => id.toLowerCase() === uidStr.toLowerCase());
        const nextLikes = isLiked 
          ? currentLikes.filter(id => id.toLowerCase() !== uidStr.toLowerCase())
          : [...currentLikes, uidStr];
        return { ...t, likes: nextLikes };
      });
      try {
        localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    window.dispatchEvent(new CustomEvent('lms_forum_updated'));

    // 2. Silent background sync (fire-and-forget, non-blocking)
    fetch(`${API_URL}?action=toggle_forum_like`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ threadId, userId: uidStr })
    }).catch(err => console.warn('Backend toggle like fallback:', err));
  }, [activeUserId]);

  const addReply = useCallback((threadId, text) => {
    if (!text.trim()) return false;

    const newReply = {
      replyId: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      threadId,
      authorId: activeUserId,
      authorName: activeUserName,
      authorRole: activeUserRole,
      text: text.trim(),
      createdAt: Date.now()
    };

    setRawThreads(prev => {
      const next = prev.map(t => {
        if (t.threadId !== threadId) return t;
        const currentReplies = Array.isArray(t.replies) ? t.replies : [];
        return { ...t, replies: [...currentReplies, newReply] };
      });
      try {
        localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    window.dispatchEvent(new CustomEvent('lms_forum_updated'));

    fetch(`${API_URL}?action=add_forum_reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(newReply)
    }).catch(err => console.warn('Backend add reply fallback:', err));

    return true;
  }, [activeUserId, activeUserName, activeUserRole]);

  const deleteThread = useCallback((threadId) => {
    setRawThreads(prev => {
      const next = prev.filter(t => t.threadId !== threadId);
      try {
        localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    if (activeDetailThreadId === threadId) {
      setActiveDetailThreadId(null);
    }
    window.dispatchEvent(new CustomEvent('lms_forum_updated'));

    fetch(`${API_URL}?action=delete_forum_thread`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ threadId, userId: activeUserId })
    }).catch(err => console.warn('Backend delete thread fallback:', err));
  }, [activeDetailThreadId, activeUserId]);

  const threadsCountByTag = useMemo(() => {
    const counts = { all: rawThreads.length };
    rawThreads.forEach(t => {
      const tag = t.tag || 'general';
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, [rawThreads]);

  const filteredThreads = useMemo(() => {
    const list = rawThreads.filter(t => {
      const matchesTag = selectedTag === 'all' || t.tag === selectedTag;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        (t.title && t.title.toLowerCase().includes(q)) || 
        (t.content && t.content.toLowerCase().includes(q)) || 
        (t.authorName && t.authorName.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'popular') {
        const aLikes = Array.isArray(a.likes) ? a.likes.length : 0;
        const aReplies = Array.isArray(a.replies) ? a.replies.length : 0;
        const aScore = aLikes * 3 + aReplies * 2;

        const bLikes = Array.isArray(b.likes) ? b.likes.length : 0;
        const bReplies = Array.isArray(b.replies) ? b.replies.length : 0;
        const bScore = bLikes * 3 + bReplies * 2;

        if (bScore !== aScore) {
          return bScore - aScore; // Highest score first
        }
        return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
      }

      // 'latest': newest post first
      return (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
    });
  }, [rawThreads, selectedTag, searchQuery, sortBy]);

  const activeDetailThread = useMemo(() => {
    if (!activeDetailThreadId) return null;
    return rawThreads.find(t => t.threadId === activeDetailThreadId) || null;
  }, [rawThreads, activeDetailThreadId]);

  return {
    threads: filteredThreads,
    allCount: rawThreads.length,
    threadsCountByTag,
    activeUserId,
    activeUserName,
    activeUserRole,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    activeDetailThread,
    setActiveDetailThreadId,
    showCreateModal,
    setShowCreateModal,
    createThread,
    toggleLike,
    addReply,
    deleteThread,
    loading,
    fetchRemoteThreads
  };
}
