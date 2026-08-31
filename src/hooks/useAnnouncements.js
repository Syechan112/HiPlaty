import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';
import { useAuth } from './useAuth';

const ANNOUNCEMENTS_KEY = 'lms_global_announcements';
const READ_ANNOUNCEMENTS_KEY = 'lms_read_announcements';

const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Fitur Baru: Catatan Materi Terintegrasi (Lesson Notes)',
    category: 'update',
    priority: 'important',
    targetRole: 'all',
    content: 'Kini Anda dapat membuat catatan mandiri langsung saat membaca materi pelajaran di Ruang Belajar. Tersedia format Markdown, mode baca bebas gangguan, dan auto-save otomatis.',
    authorName: 'Administrator HiPlaty',
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'ann-2',
    title: 'Pemeliharaan Server & Peningkatan Kecepatan Platform',
    category: 'system',
    priority: 'normal',
    targetRole: 'all',
    content: 'Sistem telah berhasil diperbarui untuk meningkatkan kecepatan sinkronisasi data kurikulum dan performa ruang belajar mandiri.',
    authorName: 'Tim DevOps LMS',
    authorRole: 'admin',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  }
];

export function useAnnouncements() {
  const { auth } = useAuth();
  const userId = auth?.userId || 'GUEST_USER';
  const userRole = auth?.role || 'student';

  const apiUrl = API_URL;

  const [announcements, setAnnouncements] = useState(() => {
    try {
      const stored = localStorage.getItem(ANNOUNCEMENTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ANNOUNCEMENTS;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [readIds, setReadIds] = useState(() => {
    try {
      const stored = localStorage.getItem(`${READ_ANNOUNCEMENTS_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const fetchRemoteAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}?action=get_announcements&_t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setAnnouncements(data);
          try {
            localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(data));
          } catch (e) {
            console.warn(e);
          }
        }
      }
    } catch (err) {
      console.warn('Using local announcements fallback:', err);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchRemoteAnnouncements();
    const interval = setInterval(() => {
      fetchRemoteAnnouncements();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchRemoteAnnouncements]);

  useEffect(() => {
    const userRead = localStorage.getItem(`${READ_ANNOUNCEMENTS_KEY}_${userId}`);
    setReadIds(userRead ? JSON.parse(userRead) : []);
  }, [userId]);

  useEffect(() => {
    const handleStorageUpdate = (e) => {
      if (e?.detail?.announcements) {
        setAnnouncements(e.detail.announcements);
      }
    };

    window.addEventListener('lms_announcements_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('lms_announcements_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const saveAnnouncementsLocally = (updated) => {
    setAnnouncements(updated);
    try {
      localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('lms_announcements_updated', { detail: { announcements: updated } }));
    } catch (e) {
      console.error('Failed to write announcements to storage:', e);
    }
  };

  const createAnnouncement = useCallback(async ({ title, content, category = 'update', priority = 'normal', targetRole = 'all' }) => {
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
      targetRole,
      authorName: auth?.name || 'Administrator',
      authorRole: auth?.role || 'admin',
      createdAt: new Date().toISOString()
    };

    const updated = [newAnn, ...announcements];
    saveAnnouncementsLocally(updated);

    try {
      await fetch(`${apiUrl}?action=create_announcement`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          ...newAnn,
          adminUserId: auth?.userId,
          requestingUser: auth
        })
      });
    } catch (err) {
      console.warn('Saved locally, remote sync pending:', err);
    }

    return newAnn;
  }, [announcements, auth, apiUrl]);

  const updateAnnouncement = useCallback(async (id, patch) => {
    const updated = announcements.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          ...patch,
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    });

    saveAnnouncementsLocally(updated);

    try {
      await fetch(`${apiUrl}?action=update_announcement`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          id,
          ...patch,
          adminUserId: auth?.userId,
          requestingUser: auth
        })
      });
    } catch (err) {
      console.warn('Updated locally, remote sync pending:', err);
    }
  }, [announcements, auth, apiUrl]);

  const deleteAnnouncement = useCallback(async (id) => {
    const updated = announcements.filter(a => a.id !== id);
    saveAnnouncementsLocally(updated);

    try {
      await fetch(`${apiUrl}?action=delete_announcement`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          id,
          adminUserId: auth?.userId,
          requestingUser: auth
        })
      });
    } catch (err) {
      console.warn('Deleted locally, remote sync pending:', err);
    }
  }, [announcements, auth, apiUrl]);

  const markAsRead = useCallback((id) => {
    setReadIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem(`${READ_ANNOUNCEMENTS_KEY}_${userId}`, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save read state:', e);
      }
      return next;
    });
  }, [userId]);

  const markAllAsRead = useCallback(() => {
    const visibleIds = announcements
      .filter(a => a.targetRole === 'all' || a.targetRole === userRole || userRole === 'admin')
      .map(a => a.id);
    
    setReadIds(visibleIds);
    try {
      localStorage.setItem(`${READ_ANNOUNCEMENTS_KEY}_${userId}`, JSON.stringify(visibleIds));
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  }, [announcements, userId, userRole]);

  const visibleAnnouncements = announcements.filter(a => {
    if (userRole === 'admin') return true;
    const target = String(a.targetRole || 'all').toLowerCase().trim();
    const role = String(userRole || 'student').toLowerCase().trim();
    return (
      target === 'all' || 
      target === role || 
      target === 'semua' || 
      target === 'semua pengguna' || 
      (target.includes('siswa') && role === 'student') ||
      (target.includes('guru') && role === 'educator') ||
      (target.includes('educator') && role === 'educator')
    );
  });

  const unreadCount = visibleAnnouncements.filter(a => !readIds.includes(a.id)).length;

  return {
    announcements: visibleAnnouncements,
    allAnnouncements: announcements,
    loading,
    error,
    unreadCount,
    readIds,
    fetchRemoteAnnouncements,
    fetchAnnouncements: fetchRemoteAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    markAsRead,
    markAllAsRead,
    isRead: (id) => readIds.includes(id)
  };
}
