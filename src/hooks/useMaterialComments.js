import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config/api';
import { useAuth } from './useAuth';

const COMMENTS_CACHE_PREFIX = 'lms_comments_cache_';

export function useMaterialComments(contentId, batchId = '') {
  const { auth } = useAuth();
  
  const currentUserId = auth?.userId || (typeof window !== 'undefined' ? (localStorage.getItem('lms_guest_uid') || 'GUEST_DEFAULT') : 'GUEST_DEFAULT');
  const currentUserName = auth?.name || 'Siswa';
  const currentUserRole = auth?.role || 'student';

  const cacheKey = `${COMMENTS_CACHE_PREFIX}${contentId || 'global'}`;

  const [comments, setComments] = useState(() => {
    try {
      if (typeof window !== 'undefined' && contentId) {
        const cached = localStorage.getItem(cacheKey);
        return cached ? JSON.parse(cached) : [];
      }
    } catch {
      return [];
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch Comments from API
  const fetchComments = useCallback(async () => {
    if (!contentId) {
      setComments([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}?action=get_comments&contentId=${encodeURIComponent(contentId)}`);
      if (!response.ok) throw new Error('Gagal memuat komentar');
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setComments(data);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (e) {
          console.warn(e);
        }
      }
    } catch (err) {
      console.warn('Comments fetch error, using local cache:', err);
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) setComments(JSON.parse(cached));
      } catch (e) {
        console.warn(e);
      }
    } finally {
      setLoading(false);
    }
  }, [contentId, cacheKey]);

  // Fetch when contentId changes
  useEffect(() => {
    if (!contentId) {
      setComments([]);
      return;
    }

    // Load from local cache immediately
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) setComments(JSON.parse(cached));
      else setComments([]);
    } catch (e) {
      setComments([]);
    }

    fetchComments();
  }, [contentId, fetchComments, cacheKey]);

  // 2. Add New Comment
  const addComment = useCallback(async (commentText) => {
    const text = String(commentText || '').trim();
    if (!text || !contentId) return false;

    setSubmitting(true);

    const tempCommentId = 'CMT-' + Date.now();
    const newComment = {
      commentId: tempCommentId,
      contentId,
      batchId,
      userId: currentUserId,
      userName: currentUserName,
      role: currentUserRole,
      commentText: text,
      createdAt: new Date().toISOString()
    };

    // Optimistic UI update
    setComments(prev => {
      const updated = [...prev, newComment];
      try {
        localStorage.setItem(cacheKey, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    try {
      const response = await fetch(`${API_URL}?action=add_comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          contentId,
          batchId,
          userId: currentUserId,
          userName: currentUserName,
          commentText: text
        })
      });

      const resData = await response.json();
      if (resData.success && resData.comment) {
        setComments(prev => {
          const updated = prev.map(c => c.commentId === tempCommentId ? { ...resData.comment, role: currentUserRole } : c);
          try {
            localStorage.setItem(cacheKey, JSON.stringify(updated));
          } catch (e) {
            console.warn(e);
          }
          return updated;
        });
      }
      return true;
    } catch (err) {
      console.warn('Comment post network error:', err);
      return true;
    } finally {
      setSubmitting(false);
    }
  }, [contentId, batchId, currentUserId, currentUserName, currentUserRole, cacheKey]);

  // 3. Delete Comment
  const deleteComment = useCallback(async (commentId) => {
    if (!commentId) return false;

    // Optimistic remove
    setComments(prev => {
      const updated = prev.filter(c => c.commentId !== commentId);
      try {
        localStorage.setItem(cacheKey, JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    try {
      fetch(`${API_URL}?action=delete_comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          commentId,
          userId: currentUserId
        })
      }).catch(e => console.warn(e));

      return true;
    } catch (err) {
      console.warn('Delete comment error:', err);
      return true;
    }
  }, [cacheKey, currentUserId]);

  return {
    comments,
    totalComments: comments.length,
    loading,
    submitting,
    error,
    addComment,
    deleteComment,
    fetchComments,
    currentUserId,
    currentUserName
  };
}
