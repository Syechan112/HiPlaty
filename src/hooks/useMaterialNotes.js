import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

const NOTES_STORAGE_KEY = 'lms_material_notes';

export function useMaterialNotes() {
  const { auth } = useAuth();
  const userId = auth?.userId || 'GUEST_USER';

  const [notesMap, setNotesMap] = useState(() => {
    try {
      const stored = localStorage.getItem(`${NOTES_STORAGE_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const loadLocalNotes = useCallback(() => {
    try {
      const stored = localStorage.getItem(`${NOTES_STORAGE_KEY}_${userId}`);
      setNotesMap(stored ? JSON.parse(stored) : {});
    } catch {
      setNotesMap({});
    }
  }, [userId]);

  useEffect(() => {
    loadLocalNotes();
  }, [loadLocalNotes]);

  useEffect(() => {
    const handleNotesUpdated = (e) => {
      if (e?.detail?.updatedNotes) {
        setNotesMap(e.detail.updatedNotes);
      } else {
        loadLocalNotes();
      }
    };

    window.addEventListener('lms_notes_updated', handleNotesUpdated);
    window.addEventListener('storage', handleNotesUpdated);

    return () => {
      window.removeEventListener('lms_notes_updated', handleNotesUpdated);
      window.removeEventListener('storage', handleNotesUpdated);
    };
  }, [loadLocalNotes]);

  const saveNote = useCallback((contentId, noteContent, metadata = {}) => {
    if (!contentId) return;

    setNotesMap((prev) => {
      const trimmed = (noteContent || '').trim();
      const updated = { ...prev };

      if (!trimmed) {
        delete updated[contentId];
      } else {
        updated[contentId] = {
          contentId,
          content: noteContent,
          title: metadata.title || prev[contentId]?.title || 'Catatan Materi',
          batchId: metadata.batchId || prev[contentId]?.batchId || '',
          batchName: metadata.batchName || prev[contentId]?.batchName || '',
          moduleId: metadata.moduleId || prev[contentId]?.moduleId || '',
          moduleTitle: metadata.moduleTitle || prev[contentId]?.moduleTitle || '',
          updatedAt: new Date().toISOString()
        };
      }

      try {
        localStorage.setItem(`${NOTES_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('lms_notes_updated', { detail: { contentId, updatedNotes: updated } }));
      } catch (e) {
        console.error('Failed to save note locally:', e);
      }

      return updated;
    });
  }, [userId]);

  const getNote = useCallback((contentId) => {
    if (!contentId) return null;
    return notesMap[contentId] || null;
  }, [notesMap]);

  const deleteNote = useCallback((contentId) => {
    if (!contentId) return;

    setNotesMap((prev) => {
      const updated = { ...prev };
      delete updated[contentId];
      try {
        localStorage.setItem(`${NOTES_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('lms_notes_updated', { detail: { contentId, updatedNotes: updated } }));
      } catch (e) {
        console.error('Failed to delete note locally:', e);
      }
      return updated;
    });
  }, [userId]);

  const hasNote = useCallback((contentId) => {
    return Boolean(notesMap[contentId]?.content?.trim());
  }, [notesMap]);

  return {
    notesMap,
    getNote,
    saveNote,
    deleteNote,
    hasNote
  };
}
