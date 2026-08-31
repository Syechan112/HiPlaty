import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { API_URL } from '../config/api';
import { useAuth } from './useAuth';
import {
  CHAT_FRIENDS_PREFIX,
  CHAT_READ_PREFIX,
  normalizeFriend,
  mergeMessages,
  getLocalConv,
  setLocalConv
} from '../utils/chatHelpers';

function resolveUserName(userId, fallbackName) {
  if (fallbackName && !fallbackName.startsWith('Teman (')) return fallbackName;
  if (!userId) return 'Teman Belajar';

  try {
    const groupsRaw = localStorage.getItem('lms_global_study_groups_registry');
    if (groupsRaw) {
      const groups = JSON.parse(groupsRaw);
      for (const g of Object.values(groups)) {
        const found = g.members?.find((m) => String(m.userId).toLowerCase() === String(userId).toLowerCase());
        if (found && (found.userName || found.name)) {
          return found.userName || found.name;
        }
      }
    }
  } catch {}

  const clean = userId.replace(/^(USR-|user_)/i, '').replace(/_/g, ' ');
  if (clean.length > 2 && isNaN(clean)) {
    return clean.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return fallbackName || `Siswa ${userId}`;
}

export function useChat() {
  const { auth } = useAuth();
  const currentUserId = String(
    auth?.userId ||
    (typeof window !== 'undefined' ? localStorage.getItem('lms_guest_uid') || 'GUEST_DEFAULT' : 'GUEST_DEFAULT')
  ).trim();
  const currentUserName = auth?.name || 'Siswa';

  const friendsStorageKey = `${CHAT_FRIENDS_PREFIX}${currentUserId}`;
  const readStorageKey = `${CHAT_READ_PREFIX}${currentUserId}`;

  const [friends, setFriends] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(friendsStorageKey);
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) return list.map(normalizeFriend).filter(Boolean);
        }
      }
    } catch {}
    return [];
  });

  const [readMessageIds, setReadMessageIds] = useState(() => {
    try {
      const stored = localStorage.getItem(readStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeFriend, setActiveFriend] = useState(null);
  const activeFriendRef = useRef(activeFriend);
  useEffect(() => {
    activeFriendRef.current = activeFriend;
  }, [activeFriend]);

  const [messages, setMessages] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [recentChatsVersion, setRecentChatsVersion] = useState(0);

  const getTargetId = useCallback((f) => String(f?.userId || f?.id || '').trim(), []);

  useEffect(() => {
    try {
      localStorage.setItem(friendsStorageKey, JSON.stringify(friends));
    } catch (e) {
      console.warn(e);
    }
  }, [friends, friendsStorageKey]);

  const fetchFriends = useCallback(async () => {
    if (!currentUserId) return;
    setLoadingFriends(true);
    try {
      const response = await fetch(`${API_URL}?action=get_friends&userId=${encodeURIComponent(currentUserId)}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const normalized = data.map(normalizeFriend).filter(Boolean);
          setFriends((prev) => {
            const map = new Map();
            normalized.forEach((f) => map.set(f.userId.toLowerCase(), f));
            prev.forEach((f) => {
              if (!map.has(f.userId.toLowerCase())) map.set(f.userId.toLowerCase(), f);
            });
            const merged = Array.from(map.values());
            localStorage.setItem(friendsStorageKey, JSON.stringify(merged));
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn('Friends fetch fallback:', err);
    } finally {
      setLoadingFriends(false);
    }
  }, [currentUserId, friendsStorageKey]);

  const fetchMessages = useCallback(async (silent = false) => {
    const targetId = getTargetId(activeFriendRef.current);
    if (!currentUserId || !targetId) return;
    if (!silent) setLoadingMessages(true);

    const localList = getLocalConv(currentUserId, targetId);
    setMessages(localList);

    try {
      const response = await fetch(
        `${API_URL}?action=get_messages&userId=${encodeURIComponent(currentUserId)}&friendId=${encodeURIComponent(targetId)}`
      );
      if (response.ok) {
        const remoteData = await response.json();
        if (Array.isArray(remoteData) && remoteData.length > 0) {
          const merged = mergeMessages(localList, remoteData);
          setLocalConv(currentUserId, targetId, merged);
          if (getTargetId(activeFriendRef.current) === targetId) {
            setMessages(merged);
          }
        }
      }
    } catch (err) {
      console.warn('Cloud chat sync fallback:', err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, [currentUserId, getTargetId]);

  useEffect(() => {
    const targetId = getTargetId(activeFriend);
    if (!targetId) {
      setMessages([]);
      return;
    }
    const local = getLocalConv(currentUserId, targetId);
    setMessages(local);
    fetchMessages(true);

    const interval = setInterval(() => fetchMessages(true), 4000);
    return () => clearInterval(interval);
  }, [activeFriend, getTargetId, currentUserId, fetchMessages]);

  useEffect(() => {
    const handleSync = () => {
      setRecentChatsVersion((v) => v + 1);
      const targetId = getTargetId(activeFriendRef.current);
      if (targetId) {
        setMessages(getLocalConv(currentUserId, targetId));
      }
    };
    window.addEventListener('lms_chat_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('lms_chat_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [getTargetId, currentUserId]);

  const fetchGlobalInbox = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const response = await fetch(`${API_URL}?action=get_messages&userId=${encodeURIComponent(currentUserId)}`);
      if (response.ok) {
        const remoteMsgs = await response.json();
        if (Array.isArray(remoteMsgs) && remoteMsgs.length > 0) {
          const grouped = new Map();
          for (const msg of remoteMsgs) {
            const sId = String(msg.senderId || '').trim();
            const rId = String(msg.receiverId || '').trim();
            const other = sId.toLowerCase() === currentUserId.toLowerCase() ? rId : sId;
            if (other) {
              if (!grouped.has(other)) grouped.set(other, []);
              grouped.get(other).push(msg);
            }
          }
          for (const [otherId, mList] of grouped.entries()) {
            const current = getLocalConv(currentUserId, otherId);
            setLocalConv(currentUserId, otherId, mergeMessages(current, mList));
          }
        }
      }
    } catch (e) {
      console.warn('Inbox sync fallback:', e);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchFriends();
    fetchGlobalInbox();
    const interval = setInterval(fetchGlobalInbox, 6000);
    return () => clearInterval(interval);
  }, [fetchFriends, fetchGlobalInbox]);

  const sendMessage = useCallback(async (messageText, extraPayload = {}) => {
    const text = String(messageText || '').trim();
    const targetId = getTargetId(activeFriendRef.current);
    if (!text || !targetId || !currentUserId) return false;

    setSending(true);
    const tempMsgId = `MSG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const nowIso = new Date().toISOString();

    const newMsg = {
      messageId: tempMsgId,
      senderId: currentUserId,
      senderName: currentUserName,
      receiverId: targetId,
      receiverName: activeFriendRef.current?.name || 'Teman',
      messageText: text,
      timestamp: nowIso,
      isRead: false,
      ...extraPayload
    };

    const currentList = getLocalConv(currentUserId, targetId);
    const updated = [...currentList, newMsg];
    setLocalConv(currentUserId, targetId, updated);
    setMessages(updated);

    fetch(`${API_URL}?action=send_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(newMsg)
    }).catch((e) => console.warn('GAS send sync fallback:', e));

    setSending(false);
    return true;
  }, [currentUserId, currentUserName, getTargetId]);

  const editMessage = useCallback(async (messageId, newMessageText) => {
    const text = String(newMessageText || '').trim();
    const targetId = getTargetId(activeFriendRef.current);
    if (!messageId || !text || !targetId) return false;

    const current = getLocalConv(currentUserId, targetId);
    const updated = current.map((m) =>
      m.messageId === messageId ? { ...m, messageText: text, isEdited: true } : m
    );
    setLocalConv(currentUserId, targetId, updated);
    setMessages(updated);

    fetch(`${API_URL}?action=edit_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ messageId, newMessageText: text, userId: currentUserId })
    }).catch(() => {});
    return true;
  }, [currentUserId, getTargetId]);

  const deleteMessage = useCallback(async (messageId) => {
    const targetId = getTargetId(activeFriendRef.current);
    if (!messageId || !targetId) return false;

    const current = getLocalConv(currentUserId, targetId);
    const updated = current.filter((m) => m.messageId !== messageId);
    setLocalConv(currentUserId, targetId, updated);
    setMessages(updated);

    fetch(`${API_URL}?action=delete_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ messageId, userId: currentUserId })
    }).catch(() => {});
    return true;
  }, [currentUserId, getTargetId]);

  const addFriend = useCallback(async (targetUserId, targetUserName = '') => {
    const cleanId = String(targetUserId || '').trim();
    if (!cleanId) return { success: false, message: 'Masukkan User ID yang valid.' };
    if (cleanId.toLowerCase() === currentUserId.toLowerCase()) {
      return { success: false, message: 'Tidak dapat menambahkan diri sendiri.' };
    }

    const existing = friends.find((f) => f.userId.toLowerCase() === cleanId.toLowerCase());
    if (existing) {
      setActiveFriend(existing);
      return { success: true, message: `${existing.name} sudah ada di daftar teman!`, user: existing };
    }

    const resolvedName = resolveUserName(cleanId, targetUserName);

    const newFriend = normalizeFriend({
      userId: cleanId,
      id: cleanId,
      name: resolvedName,
      role: 'student'
    });

    const updatedFriends = [newFriend, ...friends];
    setFriends(updatedFriends);
    setActiveFriend(newFriend);
    localStorage.setItem(friendsStorageKey, JSON.stringify(updatedFriends));

    fetch(`${API_URL}?action=add_friend`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ userId: currentUserId, targetUserId: cleanId, userName: currentUserName })
    }).catch(() => {});

    return { success: true, message: `Berhasil menambahkan ${newFriend.name}!`, user: newFriend };
  }, [currentUserId, currentUserName, friends, friendsStorageKey]);

  const removeFriend = useCallback(async (targetFriendId) => {
    const cleanId = String(targetFriendId || '').trim();
    if (!cleanId) return { success: false, message: 'ID tidak valid' };

    const updated = friends.filter((f) => f.userId.toLowerCase() !== cleanId.toLowerCase());
    setFriends(updated);
    if (getTargetId(activeFriend)?.toLowerCase() === cleanId.toLowerCase()) {
      setActiveFriend(null);
      setMessages([]);
    }
    localStorage.setItem(friendsStorageKey, JSON.stringify(updated));

    fetch(`${API_URL}?action=remove_friend`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ userId: currentUserId, friendId: cleanId })
    }).catch(() => {});

    return { success: true, message: 'Pertemanan dihapus' };
  }, [currentUserId, friends, friendsStorageKey, activeFriend, getTargetId]);

  const markFriendChatAsRead = useCallback((friendUserId) => {
    if (!friendUserId || !currentUserId) return;
    const conv = getLocalConv(currentUserId, friendUserId);
    const incomingIds = conv
      .filter((m) => String(m.senderId).toLowerCase() !== currentUserId.toLowerCase())
      .map((m) => m.messageId);

    if (incomingIds.length > 0) {
      setReadMessageIds((prev) => {
        const next = Array.from(new Set([...prev, ...incomingIds]));
        localStorage.setItem(readStorageKey, JSON.stringify(next));
        return next;
      });
      setRecentChatsVersion((v) => v + 1);
      window.dispatchEvent(new CustomEvent('lms_chat_updated'));
    }
  }, [currentUserId, readStorageKey]);

  const allRecentMessages = useMemo(() => {
    return friends.map((f) => {
      const conv = getLocalConv(currentUserId, f.userId);
      const lastMsg = conv[conv.length - 1] || null;
      return {
        friendUserId: f.userId,
        friendName: f.name,
        friendRole: f.role,
        lastMessage: lastMsg?.messageText || '',
        timestamp: lastMsg?.timestamp || null,
        unreadCount: conv.filter((m) => String(m.senderId).toLowerCase() !== currentUserId.toLowerCase() && !readMessageIds.includes(m.messageId)).length
      };
    });
  }, [friends, currentUserId, readMessageIds, recentChatsVersion]);

  const unreadChatCount = useMemo(() => {
    return allRecentMessages.reduce((sum, item) => sum + (item.unreadCount || 0), 0);
  }, [allRecentMessages]);

  return {
    currentUserId, currentUserName, friends, activeFriend, setActiveFriend,
    messages, allRecentMessages, unreadChatCount, markFriendChatAsRead,
    loadingFriends, loadingMessages, sending, error,
    addFriend, removeFriend, sendMessage, editMessage, deleteMessage,
    fetchFriends, fetchMessages, fetchGlobalInbox
  };
}
