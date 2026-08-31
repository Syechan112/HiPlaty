import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { API_URL } from '../config/api';
import { useAuth } from './useAuth';
import { GROUP_COLORS } from '../utils/studyGroupHelpers';

const GLOBAL_GROUPS_REGISTRY_KEY = 'lms_global_study_groups_registry';
const GLOBAL_MATERIALS_REGISTRY_KEY = 'lms_global_group_materials_registry';
const GLOBAL_MESSAGES_REGISTRY_KEY = 'lms_global_group_messages_registry';
const USER_JOINED_GROUPS_PREFIX = 'lms_user_joined_groups_';

export function useStudyGroup() {
  const { auth } = useAuth();
  const currentUserId = auth?.userId || (typeof window !== 'undefined' ? localStorage.getItem('lms_guest_uid') || 'GUEST_DEFAULT' : 'GUEST_DEFAULT');
  const currentUserName = auth?.name || 'Siswa Pembelajar';

  const userJoinedStorageKey = `${USER_JOINED_GROUPS_PREFIX}${currentUserId}`;

  // 1. Load Global Groups Registry (Shared across all students)
  const [globalGroupsMap, setGlobalGroupsMap] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(GLOBAL_GROUPS_REGISTRY_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load global groups registry:', e);
    }

    // Default global demo group
    const initialGlobal = {
      'SG-KOMUNITAS-01': {
        id: 'SG-KOMUNITAS-01',
        name: 'Kelompok Belajar Komunitas',
        description: 'Ruang diskusi terbuka untuk semua siswa LMS',
        color: 'slate',
        createdBy: 'SYSTEM',
        createdByName: 'LMS Platform',
        createdAt: new Date().toISOString(),
        members: [
          {
            userId: 'SYSTEM',
            userName: 'LMS Platform',
            role: 'owner',
            joinedAt: new Date().toISOString()
          }
        ]
      }
    };
    return initialGlobal;
  });

  // 2. Load User's Joined Group IDs
  const [joinedGroupIds, setJoinedGroupIds] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(userJoinedStorageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch {}
    return ['SG-KOMUNITAS-01'];
  });

  // 3. Global Materials Map: { [groupId]: Array<BatchItem> }
  const [globalMaterialsMap, setGlobalMaterialsMap] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(GLOBAL_MATERIALS_REGISTRY_KEY);
        if (stored) return JSON.parse(stored);
      }
    } catch {}
    return {};
  });

  // 4. Global Messages Map: { [groupId]: Array<MessageItem> }
  const [globalMessagesMap, setGlobalMessagesMap] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(GLOBAL_MESSAGES_REGISTRY_KEY);
        if (stored) return JSON.parse(stored);
      }
    } catch {}
    return {
      'SG-KOMUNITAS-01': [
        {
          messageId: 'msg_welcome_community',
          groupId: 'SG-KOMUNITAS-01',
          senderId: 'SYSTEM',
          senderName: 'LMS Assistant',
          messageText: '🎉 Selamat datang di Kelompok Belajar Komunitas! Semua siswa dapat berdiskusi dan berbagi materi di sini.',
          timestamp: new Date().toISOString(),
          isSystem: true
        }
      ]
    };
  });

  // 5. Active Group ID
  const [activeGroupId, setActiveGroupId] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`lms_active_sg_${currentUserId}`);
        if (stored) return stored;
      }
    } catch {}
    return joinedGroupIds[0] || 'SG-KOMUNITAS-01';
  });

  // Save to Shared LocalStorage & Dispatch Sync Events
  const syncToStorage = useCallback((newGroups, newMaterials, newMessages, newJoinedIds) => {
    try {
      if (newGroups) {
        localStorage.setItem(GLOBAL_GROUPS_REGISTRY_KEY, JSON.stringify(newGroups));
      }
      if (newMaterials) {
        localStorage.setItem(GLOBAL_MATERIALS_REGISTRY_KEY, JSON.stringify(newMaterials));
      }
      if (newMessages) {
        localStorage.setItem(GLOBAL_MESSAGES_REGISTRY_KEY, JSON.stringify(newMessages));
      }
      if (newJoinedIds) {
        localStorage.setItem(userJoinedStorageKey, JSON.stringify(newJoinedIds));
      }
      window.dispatchEvent(new CustomEvent('lms_study_group_updated'));
    } catch (e) {
      console.error('Failed to sync study group to local storage:', e);
    }
  }, [userJoinedStorageKey]);

  // Sync state whenever other tabs/windows update
  useEffect(() => {
    const handleStorageOrCustomSync = () => {
      try {
        const rawGroups = localStorage.getItem(GLOBAL_GROUPS_REGISTRY_KEY);
        if (rawGroups) setGlobalGroupsMap(JSON.parse(rawGroups));

        const rawMats = localStorage.getItem(GLOBAL_MATERIALS_REGISTRY_KEY);
        if (rawMats) setGlobalMaterialsMap(JSON.parse(rawMats));

        const rawMsgs = localStorage.getItem(GLOBAL_MESSAGES_REGISTRY_KEY);
        if (rawMsgs) setGlobalMessagesMap(JSON.parse(rawMsgs));

        const rawJoined = localStorage.getItem(userJoinedStorageKey);
        if (rawJoined) setJoinedGroupIds(JSON.parse(rawJoined));
      } catch (err) {
        console.warn('Sync handler error:', err);
      }
    };

    window.addEventListener('storage', handleStorageOrCustomSync);
    window.addEventListener('lms_study_group_updated', handleStorageOrCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorageOrCustomSync);
      window.removeEventListener('lms_study_group_updated', handleStorageOrCustomSync);
    };
  }, [userJoinedStorageKey]);

  // Save activeGroupId per user
  useEffect(() => {
    if (activeGroupId) {
      try {
        localStorage.setItem(`lms_active_sg_${currentUserId}`, activeGroupId);
      } catch {}
    }
  }, [activeGroupId, currentUserId]);

  // List of Group Objects joined by this user
  const groups = useMemo(() => {
    const result = [];
    joinedGroupIds.forEach(id => {
      if (globalGroupsMap[id]) {
        result.push(globalGroupsMap[id]);
      }
    });

    // Also include any group where the user is listed in members
    Object.values(globalGroupsMap).forEach(g => {
      if (g && g.id && !result.some(r => r.id === g.id)) {
        if (g.members?.some(m => String(m.userId).toLowerCase() === String(currentUserId).toLowerCase())) {
          result.push(g);
        }
      }
    });

    return result.length > 0 ? result : [globalGroupsMap['SG-KOMUNITAS-01'] || {
      id: 'SG-KOMUNITAS-01',
      name: 'Kelompok Belajar Komunitas',
      description: 'Ruang diskusi terbuka',
      color: 'blue',
      createdBy: 'SYSTEM',
      createdByName: 'LMS Platform',
      createdAt: new Date().toISOString(),
      members: [{ userId: currentUserId, userName: currentUserName, role: 'member', joinedAt: new Date().toISOString() }]
    }];
  }, [joinedGroupIds, globalGroupsMap, currentUserId, currentUserName]);

  // Current Active Group Object
  const activeGroup = useMemo(() => {
    return globalGroupsMap[activeGroupId] || groups.find(g => g.id === activeGroupId) || groups[0] || null;
  }, [globalGroupsMap, activeGroupId, groups]);

  // Active Group's Materials List
  const activeGroupMaterials = useMemo(() => {
    if (!activeGroup) return [];
    return globalMaterialsMap[activeGroup.id] || [];
  }, [globalMaterialsMap, activeGroup]);

  // Active Group's Messages List
  const activeGroupMessages = useMemo(() => {
    if (!activeGroup) return [];
    return globalMessagesMap[activeGroup.id] || [];
  }, [globalMessagesMap, activeGroup]);

  // ================= CLOUD SYNC WITH GOOGLE APPS SCRIPT =================
  const fetchRemoteGroupData = useCallback(async () => {
    if (!activeGroupId) return;
    try {
      const response = await fetch(`${API_URL}?action=get_study_group_messages&groupId=${encodeURIComponent(activeGroupId)}&_t=${Date.now()}`);
      if (!response.ok) return;
      const remoteData = await response.json();
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        setGlobalMessagesMap(prev => {
          const currentList = prev[activeGroupId] || [];
          const msgMap = new Map();

          currentList.forEach(m => {
            const mId = m.messageId || m.id;
            if (mId) msgMap.set(mId, m);
          });

          remoteData.forEach(r => {
            const rId = r.messageId || r.id || `r_${r.timestamp}_${r.senderId || r.userId}`;
            const sId = r.senderId || r.userId || r.sender || '';
            const sName = r.senderName || r.userName || r.name || 'Anggota';
            const text = r.messageText || r.text || r.message || '';
            const time = r.timestamp || r.createdAt || r.created_at || new Date().toISOString();

            if (!msgMap.has(rId)) {
              msgMap.set(rId, {
                messageId: rId,
                id: rId,
                groupId: activeGroupId,
                senderId: sId,
                senderName: sName,
                messageText: text,
                text,
                timestamp: time,
                isSystem: Boolean(r.isSystem || sId === 'SYSTEM')
              });
            }
          });

          const merged = Array.from(msgMap.values()).sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          const nextMap = { ...prev, [activeGroupId]: merged };
          try {
            localStorage.setItem(GLOBAL_MESSAGES_REGISTRY_KEY, JSON.stringify(nextMap));
          } catch (e) {
            console.warn(e);
          }
          return nextMap;
        });
      }
    } catch (e) {
      // Silently continue with local registry
    }
  }, [activeGroupId]);

  useEffect(() => {
    fetchRemoteGroupData();
    const interval = setInterval(fetchRemoteGroupData, 5000);
    return () => clearInterval(interval);
  }, [fetchRemoteGroupData]);

  // ================= 1. CREATE A NEW STUDY GROUP =================
  const createGroup = useCallback((name, description = '', color = 'slate') => {
    if (!name?.trim()) return { success: false, message: 'Nama kelompok wajib diisi.' };

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `SG-${randomSuffix}`;

    const newGroup = {
      id: newId,
      name: name.trim(),
      description: description.trim() || 'Kelompok belajar dan diskusi bersama',
      color: color || 'slate',
      createdBy: currentUserId,
      createdByName: currentUserName,
      createdAt: new Date().toISOString(),
      members: [
        {
          userId: currentUserId,
          userName: currentUserName,
          role: 'owner',
          joinedAt: new Date().toISOString()
        }
      ]
    };

    const welcomeMsg = {
      messageId: `msg_${Date.now()}_welcome`,
      groupId: newId,
      senderId: 'SYSTEM',
      senderName: 'LMS Study Assistant',
      messageText: `🎉 Selamat datang di kelompok belajar "${name.trim()}"! Bagikan ID "${newId}" kepada teman Anda agar bisa bergabung, belajar materi bersama, dan berdiskusi.`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    const nextGroups = { ...globalGroupsMap, [newId]: newGroup };
    const nextJoined = [newId, ...joinedGroupIds.filter(id => id !== newId)];
    const nextMessages = { ...globalMessagesMap, [newId]: [welcomeMsg] };

    setGlobalGroupsMap(nextGroups);
    setJoinedGroupIds(nextJoined);
    setGlobalMessagesMap(nextMessages);
    setActiveGroupId(newId);

    syncToStorage(nextGroups, null, nextMessages, nextJoined);

    // Optional async remote sync
    fetch(`${API_URL}?action=create_study_group`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(newGroup)
    }).catch(() => {});

    return { success: true, group: newGroup, message: `Kelompok belajar "${name.trim()}" berhasil dibuat dengan ID: ${newId}!` };
  }, [currentUserId, currentUserName, globalGroupsMap, joinedGroupIds, globalMessagesMap, syncToStorage]);

  // ================= 2. JOIN STUDY GROUP WITH CODE / ID =================
  const joinGroupById = useCallback((groupIdInput) => {
    const targetId = String(groupIdInput || '').trim().toUpperCase();
    if (!targetId) return { success: false, message: 'ID Kelompok Belajar tidak boleh kosong.' };

    let group = globalGroupsMap[targetId];

    // If not found in local memory, check shared localStorage
    if (!group) {
      try {
        const raw = localStorage.getItem(GLOBAL_GROUPS_REGISTRY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed[targetId]) {
            group = parsed[targetId];
          }
        }
      } catch {}
    }

    // If still not found in local shared registry, construct group object
    if (!group) {
      group = {
        id: targetId,
        name: `Study Group ${targetId}`,
        description: 'Kelompok belajar kolaboratif siswa',
        color: GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)].id,
        createdBy: 'STUDENT',
        createdByName: 'Anggota Kelompok',
        createdAt: new Date().toISOString(),
        members: []
      };
    }

    // Add current student to members if not already
    const existingMember = group.members?.some(m => String(m.userId).toLowerCase() === String(currentUserId).toLowerCase());
    let updatedMembers = group.members || [];
    if (!existingMember) {
      updatedMembers = [
        ...updatedMembers,
        {
          userId: currentUserId,
          userName: currentUserName,
          role: 'member',
          joinedAt: new Date().toISOString()
        }
      ];
    }

    const updatedGroup = {
      ...group,
      members: updatedMembers
    };

    const nextGroups = { ...globalGroupsMap, [targetId]: updatedGroup };
    const nextJoined = Array.from(new Set([targetId, ...joinedGroupIds]));

    // Join announcement notice
    const joinNotice = {
      messageId: `msg_${Date.now()}_join_${currentUserId}`,
      groupId: targetId,
      senderId: 'SYSTEM',
      senderName: 'HiPlaty System',
      messageText: `👋 ${currentUserName} (@${currentUserId}) baru saja bergabung ke kelompok belajar!`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    const nextMessages = {
      ...globalMessagesMap,
      [targetId]: [...(globalMessagesMap[targetId] || []), joinNotice]
    };

    setGlobalGroupsMap(nextGroups);
    setJoinedGroupIds(nextJoined);
    setGlobalMessagesMap(nextMessages);
    setActiveGroupId(targetId);

    syncToStorage(nextGroups, null, nextMessages, nextJoined);

    // Sync join event with remote API
    fetch(`${API_URL}?action=join_study_group`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        groupId: targetId,
        userId: currentUserId,
        userName: currentUserName,
        joinedAt: new Date().toISOString()
      })
    }).catch(() => {});

    return { success: true, group: updatedGroup, message: `Berhasil bergabung ke kelompok "${updatedGroup.name}" (${targetId})!` };
  }, [globalGroupsMap, joinedGroupIds, globalMessagesMap, currentUserId, currentUserName, syncToStorage]);

  // ================= 3. INVITE FRIEND TO STUDY GROUP =================
  const inviteFriendToGroup = useCallback((groupId, friend) => {
    const targetUserId = String(friend?.userId || friend?.id || '').trim();
    if (!groupId || !targetUserId) {
      return { success: false, message: 'Data teman tidak valid.' };
    }

    const targetGroupId = String(groupId).trim().toUpperCase();
    let group = globalGroupsMap[targetGroupId];
    if (!group) {
      try {
        const raw = localStorage.getItem(GLOBAL_GROUPS_REGISTRY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed[targetGroupId]) group = parsed[targetGroupId];
        }
      } catch {}
    }

    if (!group) {
      group = {
        id: targetGroupId,
        name: `Study Group ${targetGroupId}`,
        description: 'Kelompok belajar kolaboratif',
        color: 'slate',
        createdBy: currentUserId,
        createdByName: currentUserName,
        createdAt: new Date().toISOString(),
        members: [{ userId: currentUserId, userName: currentUserName, role: 'owner', joinedAt: new Date().toISOString() }]
      };
    }

    let targetUserName = String(friend.name || friend.userName || '').trim();
    if (!targetUserName || targetUserName.startsWith('Teman (')) {
      const inside = targetUserName ? targetUserName.replace(/^Teman \((.+)\)$/, '$1') : targetUserId;
      const clean = inside.replace(/^(USR-|user_)/i, '').replace(/_/g, ' ');
      targetUserName = (clean.length > 2 && isNaN(clean))
        ? clean.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : (inside || targetUserId);
    }

    // Add current user to target friend's chat friends list if not exists so chat thread is visible
    try {
      const friendListKey = `lms_chat_friends_${targetUserId}`;
      const rawList = localStorage.getItem(friendListKey);
      let user2Friends = rawList ? JSON.parse(rawList) : [];
      if (!user2Friends.some(f => String(f.userId || f.id).toLowerCase() === String(currentUserId).toLowerCase())) {
        user2Friends.push({
          userId: currentUserId,
          id: currentUserId,
          name: currentUserName,
          role: 'student'
        });
        localStorage.setItem(friendListKey, JSON.stringify(user2Friends));
      }
    } catch (e) {}

    // System notice in group
    const inviteNotice = {
      messageId: `msg_${Date.now()}_invite_${targetUserId}`,
      groupId: targetGroupId,
      senderId: 'SYSTEM',
      senderName: 'HiPlaty System',
      messageText: `📩 ${currentUserName} mengundang ${targetUserName} (@${targetUserId}) ke kelompok belajar ini.`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    const nextGroups = { ...globalGroupsMap, [targetGroupId]: group };
    const nextMessages = {
      ...globalMessagesMap,
      [targetGroupId]: [...(globalMessagesMap[targetGroupId] || []), inviteNotice]
    };

    setGlobalGroupsMap(nextGroups);
    setGlobalMessagesMap(nextMessages);
    syncToStorage(nextGroups, null, nextMessages, null);

    // Send 1-on-1 chat invitation notification
    const inviteChatMessage = {
      messageId: `msg_${Date.now()}_inv_${Math.random().toString(36).substr(2, 4)}`,
      senderId: currentUserId,
      senderName: currentUserName,
      receiverId: targetUserId,
      receiverName: targetUserName,
      messageType: 'study_group_invite',
      inviteData: {
        groupId: targetGroupId,
        groupName: group.name,
        inviterName: currentUserName,
        inviterId: currentUserId
      },
      messageText: `[UNDANGAN_STUDY_GROUP] ${currentUserName} mengundang Anda bergabung ke Study Group "${group.name}" (ID Room: ${targetGroupId})`,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    try {
      const convKey1 = `lms_chat_msgs_${currentUserId}_${targetUserId}`;
      const convKey2 = `lms_chat_msgs_${targetUserId}_${currentUserId}`;
      [convKey1, convKey2].forEach(k => {
        let list = [];
        const raw = localStorage.getItem(k);
        if (raw) list = JSON.parse(raw);
        list.push(inviteChatMessage);
        localStorage.setItem(k, JSON.stringify(list));
      });
      window.dispatchEvent(new CustomEvent('lms_chat_updated'));
    } catch (e) {}

    // Async sync to remote GAS
    fetch(`${API_URL}?action=join_study_group`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        groupId: targetGroupId,
        userId: targetUserId,
        userName: targetUserName,
        joinedAt: new Date().toISOString()
      })
    }).catch(() => {});

    fetch(`${API_URL}?action=send_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(inviteChatMessage)
    }).catch(() => {});

    return {
      success: true,
      message: `Undangan berhasil dikirim ke ${targetUserName}! Pesan ajakan juga telah dikirimkan ke ruang obrolannya.`
    };
  }, [globalGroupsMap, globalMessagesMap, currentUserId, currentUserName, syncToStorage]);

  // ================= 4. UPDATE / CUSTOMIZE GROUP =================
  const updateGroup = useCallback((groupId, updates = {}) => {
    if (!groupId) return { success: false, message: 'ID kelompok tidak valid.' };
    const targetId = String(groupId).trim().toUpperCase();
    const group = globalGroupsMap[targetId];
    if (!group) return { success: false, message: 'Kelompok tidak ditemukan.' };

    const updatedGroup = {
      ...group,
      name: updates.name ? updates.name.trim() : group.name,
      description: updates.description !== undefined ? updates.description.trim() : group.description,
      color: updates.color || group.color || 'blue'
    };

    const nextGroups = { ...globalGroupsMap, [targetId]: updatedGroup };
    setGlobalGroupsMap(nextGroups);
    syncToStorage(nextGroups, null, null, null);

    return {
      success: true,
      group: updatedGroup,
      message: `Kelompok belajar "${updatedGroup.name}" berhasil diperbarui!`
    };
  }, [globalGroupsMap, syncToStorage]);

  // ================= 5. DELETE OR LEAVE GROUP =================
  const deleteOrLeaveGroup = useCallback((groupId) => {
    if (!groupId) return;
    const targetId = String(groupId).trim();

    const nextJoined = joinedGroupIds.filter(id => id !== targetId);
    const nextGroups = { ...globalGroupsMap };
    
    // If owner, or leaving
    if (nextGroups[targetId]) {
      nextGroups[targetId] = {
        ...nextGroups[targetId],
        members: (nextGroups[targetId].members || []).filter(m => String(m.userId).toLowerCase() !== String(currentUserId).toLowerCase())
      };
    }

    setJoinedGroupIds(nextJoined);
    setGlobalGroupsMap(nextGroups);

    if (activeGroupId === targetId) {
      setActiveGroupId(nextJoined[0] || 'SG-KOMUNITAS-01');
    }

    syncToStorage(nextGroups, null, null, nextJoined);
  }, [joinedGroupIds, globalGroupsMap, currentUserId, activeGroupId, syncToStorage]);

  // ================= 6. REMOVE MEMBER (OWNER ONLY) =================
  const removeMemberFromGroup = useCallback((groupId, memberUserId) => {
    if (!groupId || !memberUserId) return { success: false, message: 'Data tidak lengkap' };
    const targetId = String(groupId).trim().toUpperCase();
    const group = globalGroupsMap[targetId];
    if (!group) return { success: false, message: 'Kelompok tidak ditemukan' };

    const targetUser = group.members?.find(
      m => String(m.userId).toLowerCase() === String(memberUserId).toLowerCase()
    );
    const targetUserName = targetUser?.userName || targetUser?.name || `@${memberUserId}`;

    // Filter out target member
    const updatedMembers = (group.members || []).filter(
      m => String(m.userId).toLowerCase() !== String(memberUserId).toLowerCase()
    );

    const updatedGroup = {
      ...group,
      members: updatedMembers
    };

    // Remove group from that user's joined list in local storage
    try {
      const friendJoinedKey = `${USER_JOINED_GROUPS_PREFIX}${memberUserId}`;
      const existingRaw = localStorage.getItem(friendJoinedKey);
      if (existingRaw) {
        let list = JSON.parse(existingRaw);
        list = list.filter(id => id !== targetId);
        localStorage.setItem(friendJoinedKey, JSON.stringify(list));
      }
    } catch (e) {}

    // Add system notification in group discussion
    const removeNotice = {
      messageId: `msg_${Date.now()}_kick_${memberUserId}`,
      groupId: targetId,
      senderId: 'SYSTEM',
      senderName: 'HiPlaty System',
      messageText: `🚫 ${targetUserName} telah dikeluarkan dari kelompok belajar oleh pembuat grup.`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    const nextGroups = { ...globalGroupsMap, [targetId]: updatedGroup };
    const nextMessages = {
      ...globalMessagesMap,
      [targetId]: [...(globalMessagesMap[targetId] || []), removeNotice]
    };

    setGlobalGroupsMap(nextGroups);
    setGlobalMessagesMap(nextMessages);
    syncToStorage(nextGroups, null, nextMessages, null);

    return { success: true, message: `${targetUserName} berhasil dikeluarkan dari kelompok.` };
  }, [globalGroupsMap, globalMessagesMap, syncToStorage]);

  // ================= 7. ADD BATCH / COURSE TO GROUP =================
  const addBatchToGroup = useCallback((groupId, batch) => {
    if (!groupId || !batch || !batch.batchId) {
      return { success: false, message: 'Data materi tidak valid.' };
    }

    const targetGroupId = String(groupId).trim();
    const currentList = globalMaterialsMap[targetGroupId] || [];
    const bId = String(batch.batchId).trim();

    const exists = currentList.some(item => String(item.batchId).trim() === bId);
    if (exists) {
      return { success: false, message: `Materi "${batch.batchName}" sudah ada di kelompok ini.` };
    }

    const totalLessons = batch.modules?.reduce((acc, m) => acc + (m.contents?.length || 0), 0) || 0;
    const newMaterialItem = {
      materialId: `mat_${bId}_${Date.now()}`,
      batchId: bId,
      batchName: batch.batchName || 'Kurikulum Pembelajaran',
      modules: batch.modules || [],
      totalModules: batch.modules?.length || 0,
      totalLessons,
      addedBy: currentUserId,
      addedByName: currentUserName,
      addedAt: new Date().toISOString()
    };

    const nextMaterials = {
      ...globalMaterialsMap,
      [targetGroupId]: [newMaterialItem, ...currentList]
    };

    // Auto-post discussion announcement
    const systemNotice = {
      messageId: `msg_${Date.now()}_add_mat`,
      groupId: targetGroupId,
      senderId: 'SYSTEM',
      senderName: 'HiPlaty System',
      messageText: `📚 ${currentUserName} telah menambahkan materi baru: "${batch.batchName}" (${newMaterialItem.totalModules} Modul, ${totalLessons} Materi). Mari pelajari bersama!`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    const nextMessages = {
      ...globalMessagesMap,
      [targetGroupId]: [...(globalMessagesMap[targetGroupId] || []), systemNotice]
    };

    setGlobalMaterialsMap(nextMaterials);
    setGlobalMessagesMap(nextMessages);

    syncToStorage(null, nextMaterials, nextMessages, null);

    // Sync material to remote API
    fetch(`${API_URL}?action=add_study_group_material`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        groupId: targetGroupId,
        batchId: bId,
        batchName: batch.batchName,
        addedBy: currentUserId,
        addedByName: currentUserName,
        addedAt: new Date().toISOString()
      })
    }).catch(() => {});

    return { success: true, message: `Materi "${batch.batchName}" berhasil ditambahkan ke kelompok belajar!` };
  }, [globalMaterialsMap, globalMessagesMap, currentUserId, currentUserName, syncToStorage]);

  // ================= 8. REMOVE BATCH FROM GROUP =================
  const removeBatchFromGroup = useCallback((groupId, batchId) => {
    let targetGroupId = String(groupId || '').trim();
    let bId = String(batchId || '').trim();

    // Handle single argument call (batchId only)
    if (groupId && !batchId && activeGroupId) {
      bId = String(groupId).trim();
      targetGroupId = String(activeGroupId).trim();
    }

    if (!targetGroupId || !bId) return { success: false, message: 'Data tidak lengkap.' };

    const currentList = globalMaterialsMap[targetGroupId] || [];
    const targetItem = currentList.find(item => String(item.batchId).trim() === bId);
    const updated = currentList.filter(item => String(item.batchId).trim() !== bId);

    const nextMaterials = {
      ...globalMaterialsMap,
      [targetGroupId]: updated
    };

    // System notice in group
    const systemNotice = {
      messageId: `msg_${Date.now()}_rem_mat`,
      groupId: targetGroupId,
      senderId: 'SYSTEM',
      senderName: 'HiPlaty System',
      messageText: `🗑️ ${currentUserName} menghapus materi "${targetItem?.batchName || 'Kurikulum'}" dari kelompok belajar.`,
      timestamp: new Date().toISOString(),
      isSystem: true
    };

    const nextMessages = {
      ...globalMessagesMap,
      [targetGroupId]: [...(globalMessagesMap[targetGroupId] || []), systemNotice]
    };

    setGlobalMaterialsMap(nextMaterials);
    setGlobalMessagesMap(nextMessages);
    syncToStorage(null, nextMaterials, nextMessages, null);

    // Sync removal to remote API
    fetch(`${API_URL}?action=remove_study_group_material`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ groupId: targetGroupId, batchId: bId })
    }).catch(() => {});

    return { success: true, message: `Materi "${targetItem?.batchName || 'Kurikulum'}" berhasil dihapus dari kelompok belajar.` };
  }, [globalMaterialsMap, globalMessagesMap, currentUserName, activeGroupId, syncToStorage]);

  // ================= 6. CHECK IF BATCH IS IN GROUP =================
  const isBatchInGroup = useCallback((groupId, batchId) => {
    if (!groupId || !batchId) return false;
    const list = globalMaterialsMap[groupId] || [];
    return list.some(item => String(item.batchId).trim() === String(batchId).trim());
  }, [globalMaterialsMap]);

  // ================= 7. SEND GROUP MESSAGE =================
  const sendGroupMessage = useCallback((groupId, messageText, contentRef = null) => {
    const text = String(messageText || '').trim();
    if (!groupId || !text) return null;

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newMsg = {
      messageId: msgId,
      id: msgId,
      groupId,
      senderId: currentUserId,
      senderName: currentUserName,
      messageText: text,
      text: text,
      contentRef: contentRef || null,
      timestamp: new Date().toISOString(),
      isSystem: false
    };

    setGlobalMessagesMap(prev => {
      const currentList = prev[groupId] || [];
      const nextMessages = {
        ...prev,
        [groupId]: [...currentList, newMsg]
      };
      try {
        localStorage.setItem(GLOBAL_MESSAGES_REGISTRY_KEY, JSON.stringify(nextMessages));
      } catch (e) {
        console.warn(e);
      }
      return nextMessages;
    });

    fetch(`${API_URL}?action=send_study_group_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(newMsg)
    }).catch(() => {});

    return newMsg;
  }, [currentUserId, currentUserName]);

  // ================= 8. DELETE GROUP MESSAGE =================
  const deleteGroupMessage = useCallback((groupId, messageId) => {
    if (!groupId || !messageId) return;
    setGlobalMessagesMap(prev => {
      const list = prev[groupId] || [];
      const updated = list.filter(m => (m.messageId || m.id) !== messageId);
      const nextMessages = { ...prev, [groupId]: updated };
      try {
        localStorage.setItem(GLOBAL_MESSAGES_REGISTRY_KEY, JSON.stringify(nextMessages));
      } catch (e) {
        console.warn(e);
      }
      return nextMessages;
    });
  }, []);

  // ================= 9. EDIT GROUP MESSAGE =================
  const editGroupMessage = useCallback((groupId, messageId, newText) => {
    if (!groupId || !messageId || !newText?.trim()) return;
    const trimmed = newText.trim();
    setGlobalMessagesMap(prev => {
      const list = prev[groupId] || [];
      const updated = list.map(m =>
        (m.messageId === messageId || m.id === messageId)
          ? { ...m, messageText: trimmed, text: trimmed, editedAt: new Date().toISOString() }
          : m
      );
      const nextMessages = { ...prev, [groupId]: updated };
      try {
        localStorage.setItem(GLOBAL_MESSAGES_REGISTRY_KEY, JSON.stringify(nextMessages));
      } catch (e) {
        console.warn(e);
      }
      return nextMessages;
    });
  }, []);

  return {
    currentUserId,
    currentUserName,
    groups,
    activeGroupId,
    setActiveGroupId,
    activeGroup,
    activeGroupMaterials,
    activeGroupMessages,
    createGroup,
    updateGroup,
    joinGroupById,
    inviteFriendToGroup,
    removeMemberFromGroup,
    deleteOrLeaveGroup,
    addBatchToGroup,
    removeBatchFromGroup,
    isBatchInGroup,
    sendGroupMessage,
    deleteGroupMessage,
    editGroupMessage,
    groupColors: GROUP_COLORS
  };
}
