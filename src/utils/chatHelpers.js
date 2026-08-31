export const CHAT_FRIENDS_PREFIX = 'lms_chat_friends_';
export const CHAT_MESSAGES_PREFIX = 'lms_chat_msgs_';
export const CHAT_READ_PREFIX = 'lms_chat_read_';
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function filterSevenDays(messagesList) {
  if (!Array.isArray(messagesList)) return [];
  const now = Date.now();
  return messagesList.filter((m) => {
    if (!m?.timestamp) return true;
    const msgTime = new Date(m.timestamp).getTime();
    return isNaN(msgTime) || now - msgTime <= SEVEN_DAYS_MS;
  });
}

export function normalizeFriend(f) {
  if (!f) return null;
  const uid = String(f.userId || f.id || '').trim();
  if (!uid) return null;
  return {
    ...f,
    userId: uid,
    id: uid,
    name: f.name || f.userName || `User ${uid.substring(0, 6)}`,
    role: f.role || 'student'
  };
}

export function mergeMessages(localList, remoteList) {
  const map = new Map();
  for (const m of localList || []) {
    if (m?.messageId) map.set(m.messageId, m);
  }
  for (const m of remoteList || []) {
    if (m?.messageId) {
      const existing = map.get(m.messageId);
      map.set(m.messageId, existing ? { ...existing, ...m } : m);
    }
  }
  return filterSevenDays(Array.from(map.values())).sort(
    (a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime()
  );
}

export function getLocalConv(currentUserId, targetId) {
  if (!currentUserId || !targetId) return [];
  try {
    const myKey = `${CHAT_MESSAGES_PREFIX}${currentUserId}_${targetId}`;
    const otherKey = `${CHAT_MESSAGES_PREFIX}${targetId}_${currentUserId}`;
    const rawMy = localStorage.getItem(myKey);
    const rawOther = localStorage.getItem(otherKey);
    const myMsgs = rawMy ? JSON.parse(rawMy) : [];
    const otherMsgs = rawOther ? JSON.parse(rawOther) : [];
    return mergeMessages(myMsgs, otherMsgs);
  } catch {
    return [];
  }
}

export function setLocalConv(currentUserId, targetId, msgList) {
  if (!currentUserId || !targetId) return;
  try {
    const myKey = `${CHAT_MESSAGES_PREFIX}${currentUserId}_${targetId}`;
    const otherKey = `${CHAT_MESSAGES_PREFIX}${targetId}_${currentUserId}`;
    const serialized = JSON.stringify(msgList);
    localStorage.setItem(myKey, serialized);
    localStorage.setItem(otherKey, serialized);
    window.dispatchEvent(new CustomEvent('lms_chat_updated'));
  } catch (e) {
    console.warn(e);
  }
}
