import { useState, useRef, useEffect, useMemo } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { ChatFriendsSidebar } from '../../components/social/chat/ChatFriendsSidebar';
import { ChatActiveConversation } from '../../components/social/chat/ChatActiveConversation';
import { AddFriendModal } from '../../components/social/chat/AddFriendModal';
import { useSearchParams } from 'react-router-dom';

export function ChatPage() {
  const { auth } = useAuth();
  const [searchParams] = useSearchParams();
  const {
    currentUserId,
    friends,
    activeFriend,
    setActiveFriend,
    messages,
    allRecentMessages,
    sending,
    markFriendChatAsRead,
    addFriend,
    removeFriend,
    sendMessage,
    editMessage,
    deleteMessage
  } = useChat();

  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUnfriendModal, setShowUnfriendModal] = useState(false);
  const [targetIdInput, setTargetIdInput] = useState('');
  const [modalFeedback, setModalFeedback] = useState({ error: '', success: '', loading: false });
  const [copiedMyId, setCopiedMyId] = useState(false);
  const [copiedFriendId, setCopiedFriendId] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const initialFriendParamHandled = useRef(false);
  const prevMsgCountRef = useRef(0);

  useEffect(() => {
    if (messages.length !== prevMsgCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      prevMsgCountRef.current = messages.length;
    }
  }, [messages.length]);

  useEffect(() => {
    if (initialFriendParamHandled.current) return;
    const friendParam = searchParams.get('userId') || searchParams.get('friendId');
    if (friendParam && friends.length > 0) {
      const target = friends.find(f => f.userId?.toLowerCase() === friendParam.toLowerCase() || f.id?.toLowerCase() === friendParam.toLowerCase());
      if (target) {
        setActiveFriend(target);
        initialFriendParamHandled.current = true;
      }
    }
  }, [searchParams, friends, setActiveFriend]);

  const handleSelectFriend = (friend) => {
    setActiveFriend(friend);
    prevMsgCountRef.current = 0;
  };

  useEffect(() => {
    if (activeFriend?.userId) {
      markFriendChatAsRead(activeFriend.userId);
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      messageInputRef.current?.focus();
    }
  }, [activeFriend, markFriendChatAsRead]);

  const handleCopyMyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUserId);
      setCopiedMyId(true);
      setTimeout(() => setCopiedMyId(false), 2000);
    }
  };

  const handleCopyFriendId = (id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopiedFriendId(true);
      setTimeout(() => setCopiedFriendId(false), 2000);
    }
  };

  const filteredFriends = useMemo(() => {
    const listWithUnread = friends.map((f) => {
      const targetId = String(f.userId || f.id).toLowerCase();
      const recent = allRecentMessages?.find(
        (r) => String(r.friendUserId).toLowerCase() === targetId
      );
      return {
        ...f,
        unreadCount: recent?.unreadCount || 0,
        lastMessage: recent?.lastMessage || '',
        timestamp: recent?.timestamp || null
      };
    });

    if (!searchQuery.trim()) return listWithUnread;
    const q = searchQuery.toLowerCase();
    return listWithUnread.filter(
      (f) =>
        f.name?.toLowerCase().includes(q) ||
        f.userId?.toLowerCase().includes(q) ||
        (f.role && f.role.toLowerCase().includes(q))
    );
  }, [friends, allRecentMessages, searchQuery]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    if (editingMessage) {
      editMessage(editingMessage.messageId, text);
      setEditingMessage(null);
      setInputMessage('');
      return;
    }

    setInputMessage('');
    sendMessage(text);
  };

  const handleStartEdit = (msg) => {
    setEditingMessage(msg);
    setInputMessage(msg.messageText);
    messageInputRef.current?.focus();
  };

  const handleAddFriendSubmit = async (e) => {
    e.preventDefault();
    if (!targetIdInput.trim()) return;

    setModalFeedback({ error: '', success: '', loading: true });
    try {
      const res = await addFriend(targetIdInput.trim());
      if (res.success) {
        setModalFeedback({ error: '', success: `Berhasil menambahkan ${res.user.name}!`, loading: false });
        setTargetIdInput('');
        setTimeout(() => {
          setShowAddModal(false);
          setModalFeedback({ error: '', success: '', loading: false });
        }, 1500);
      } else {
        setModalFeedback({ error: res.message, success: '', loading: false });
      }
    } catch {
      setModalFeedback({ error: 'Terjadi kesalahan sistem', success: '', loading: false });
    }
  };

  const handleConfirmUnfriend = async () => {
    if (activeFriend) {
      await removeFriend(activeFriend.userId);
      setShowUnfriendModal(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Daftar Teman */}
          <ChatFriendsSidebar
            currentUserId={currentUserId}
            copiedMyId={copiedMyId}
            handleCopyMyId={handleCopyMyId}
            setShowAddModal={setShowAddModal}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredFriends={filteredFriends}
            activeFriend={activeFriend}
            handleSelectFriend={handleSelectFriend}
          />

          {/* Obrolan Aktif */}
          <ChatActiveConversation
            activeFriend={activeFriend}
            currentUserId={currentUserId}
            messages={messages}
            messagesEndRef={messagesEndRef}
            messageInputRef={messageInputRef}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
            handleStartEdit={handleStartEdit}
            deleteMessage={deleteMessage}
            setShowUnfriendModal={setShowUnfriendModal}
            copiedFriendId={copiedFriendId}
            handleCopyFriendId={handleCopyFriendId}
          />

        </div>
      </div>

      {/* Modal Tambah Teman */}
      <AddFriendModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        targetIdInput={targetIdInput}
        setTargetIdInput={setTargetIdInput}
        modalFeedback={modalFeedback}
        handleAddFriendSubmit={handleAddFriendSubmit}
      />

      {/* Modal Hapus Teman */}
      <ConfirmModal
        isOpen={showUnfriendModal}
        onClose={() => setShowUnfriendModal(false)}
        onConfirm={handleConfirmUnfriend}
        title="Hapus dari Teman?"
        message={`Apakah Anda yakin ingin menghapus "${activeFriend?.name}" dari daftar teman? Riwayat percakapan tidak akan terhapus.`}
        confirmText="Ya, Hapus Teman"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
}
