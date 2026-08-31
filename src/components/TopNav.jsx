import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  RefreshCw, 
  PanelLeftClose, 
  Home, 
  Compass, 
  BookOpen, 
  Settings, 
  Layers, 
  FilePlus, 
  Shield, 
  ArrowRight, 
  MessageSquare, 
  FileText, 
  X, 
  CheckCheck, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Users
} from 'lucide-react';
import { useLmsSync } from '../hooks/useLmsSync';
import { useAuth } from '../hooks/useAuth';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useChat } from '../hooks/useChat';
import { useNavigate } from 'react-router-dom';

export function TopNav({ userName, onSync }) {
  const { isOnline, manualSync, loading } = useLmsSync();
  const { auth, isAdmin, isEducator } = useAuth();
  const { announcements, unreadCount: unreadAnnCount, markAsRead, markAllAsRead, isRead } = useAnnouncements();
  const { allRecentMessages, unreadChatCount, markFriendChatAsRead } = useChat();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState('announcements');
  const [annFilter, setAnnFilter] = useState('unread');
  const [annPage, setAnnPage] = useState(1);
  const [msgPage, setMsgPage] = useState(1);
  const notifPageSize = 5;

  const [previewAnn, setPreviewAnn] = useState(null);
  const notifContainerRef = useRef(null);

  const displayName = auth?.name || userName || 'Tamu';

  const getRoleBadge = () => {
    if (isAdmin) {
      return {
        label: 'Admin',
        className: 'bg-rose-50 text-rose-700 border-rose-200/60',
      };
    }
    if (isEducator) {
      return {
        label: 'Educator',
        className: 'bg-purple-50 text-purple-700 border-purple-200/60',
      };
    }
    if (auth) {
      return {
        label: 'Student',
        className: 'bg-blue-50 text-blue-700 border-blue-200/60',
      };
    }
    return {
      label: 'Guest',
      className: 'bg-slate-100 text-slate-600 border-slate-200',
    };
  };

  const roleBadge = getRoleBadge();

  const totalUnreadCount = (unreadAnnCount || 0) + (unreadChatCount || 0);

  const displayedAnnouncements = useMemo(() => {
    if (annFilter === 'unread') {
      return announcements.filter(a => !isRead(a.id));
    }
    return announcements;
  }, [announcements, annFilter, isRead]);

  const totalAnnPages = Math.max(1, Math.ceil(displayedAnnouncements.length / notifPageSize));
  const totalMsgPages = Math.max(1, Math.ceil(allRecentMessages.length / notifPageSize));

  useEffect(() => {
    if (annPage > totalAnnPages) {
      setAnnPage(totalAnnPages);
    }
  }, [totalAnnPages, annPage]);

  useEffect(() => {
    if (msgPage > totalMsgPages) {
      setMsgPage(totalMsgPages);
    }
  }, [totalMsgPages, msgPage]);

  const paginatedAnnouncements = useMemo(() => {
    const start = (annPage - 1) * notifPageSize;
    return displayedAnnouncements.slice(start, start + notifPageSize);
  }, [displayedAnnouncements, annPage, notifPageSize]);

  const paginatedMessages = useMemo(() => {
    const start = (msgPage - 1) * notifPageSize;
    return allRecentMessages.slice(start, start + notifPageSize);
  }, [allRecentMessages, msgPage, notifPageSize]);

  const staticMenus = useMemo(() => {
    const menus = [
      { 
        type: 'menu', 
        name: isEducator ? 'Dashboard Pengajar' : isAdmin ? 'Dashboard Admin' : 'Dashboard Siswa', 
        to: '/', 
        icon: Home, 
        desc: isEducator ? 'Ringkasan Materi & Aktivitas Mengajar' : isAdmin ? 'Pusat Kontrol & Statistik Sistem' : 'Statistik Belajar & Papan Peringkat',
        badge: 'Menu' 
      },
      ...(!isEducator && !isAdmin ? [
        { 
          type: 'menu', 
          name: 'Cari & Eksplorasi Materi', 
          to: '/learning/explore', 
          icon: Compass, 
          desc: 'Katalog Batch Kurikulum & Diskusi Ulasan',
          badge: 'Menu' 
        },
        { 
          type: 'menu', 
          name: 'Ruang Belajar', 
          to: '/learning/study', 
          icon: BookOpen, 
          desc: 'Baca Materi & Catat Waktu Belajar Anda',
          badge: 'Menu' 
        },
        { 
          type: 'menu', 
          name: 'Study Group (Kelompok Belajar)', 
          to: '/study-group', 
          icon: Users, 
          desc: 'Ruang Kolaborasi Belajar & Diskusi Bersama',
          badge: 'Menu' 
        },
      ] : []),
      { 
        type: 'menu', 
        name: 'Informasi & Pembaruan Sistem', 
        to: '/announcements', 
        icon: Bell, 
        desc: 'Pengumuman Resmi & Pembaruan Fitur',
        badge: 'Menu' 
      },
      { 
        type: 'menu', 
        name: 'Pesan & Teman (Chat)', 
        to: '/chat', 
        icon: MessageSquare, 
        desc: 'Kirim Pesan Langsung ke Teman',
        badge: 'Menu' 
      },
      { 
        type: 'menu', 
        name: 'Pengaturan Akun & Profil', 
        to: '/settings', 
        icon: Settings, 
        desc: 'Ubah Nama, Email, Password & Cache',
        badge: 'Menu' 
      },
    ];

    if (isEducator || isAdmin) {
      menus.push(
        { 
          type: 'menu', 
          name: 'Kelola Materi (Content Manager)', 
          to: '/educator/contents', 
          icon: Layers, 
          desc: 'Manajemen Batch, Modul & Materi',
          badge: 'Educator' 
        },
        { 
          type: 'menu', 
          name: 'Buat Materi Baru', 
          to: '/educator/contents/create', 
          icon: FilePlus, 
          desc: 'Editor Pembuatan Materi & Pratinjau HTML',
          badge: 'Educator' 
        }
      );
    }

    if (isAdmin) {
      menus.push(
        { 
          type: 'menu', 
          name: 'Manajemen Pengguna (Users)', 
          to: '/admin/users', 
          icon: Shield, 
          desc: 'Kelola Role Siswa, Educator, & Admin',
          badge: 'Admin' 
        },
        { 
          type: 'menu', 
          name: 'Pusat Informasi Admin', 
          to: '/admin/announcements', 
          icon: Bell, 
          desc: 'Terbitkan Pengumuman & Berita Platform',
          badge: 'Admin' 
        }
      );
    }

    return menus;
  }, [isAdmin, isEducator]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return staticMenus.slice(0, 6);
    }

    const query = searchQuery.toLowerCase().trim();
    return staticMenus.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.badge.toLowerCase().includes(query)
    );
  }, [searchQuery, staticMenus]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (notifContainerRef.current && !notifContainerRef.current.contains(e.target)) {
        setIsNotifOpen(false);
        setPreviewAnn(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectResult = (to) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(to);
  };

  const handleInputKeyDown = (e) => {
    if (!isSearchOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelectResult(searchResults[selectedIndex].to);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const handleOpenAnnPreview = (ann) => {
    markAsRead(ann.id);
    setPreviewAnn(ann);
  };

  const handleOpenChat = (msg) => {
    setIsNotifOpen(false);
    const friendId = msg.friendUserId || msg.senderId;
    if (friendId) {
      markFriendChatAsRead(friendId);
      navigate(`/chat?friendId=${encodeURIComponent(friendId)}`);
    } else {
      navigate('/chat');
    }
  };

  return (
    <header className="relative rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xs mt-3.5 mr-3.5 ml-2 px-4 py-2.5 flex items-center justify-between z-30 select-none gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('lms_toggle_sidebar'))}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Buka / Kecilkan Sidebar"
          aria-label="Toggle sidebar"
        >
          <PanelLeftClose className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="h-5 w-px bg-slate-200" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
            {displayName?.[0]?.toUpperCase() || 'G'}
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
              {displayName}
            </p>
            <span className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded border ${roleBadge.className}`}>
              {roleBadge.label}
            </span>
          </div>
        </div>

        <div ref={notifContainerRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setPreviewAnn(null);
            }}
            className={`relative w-8 h-8 flex items-center justify-center rounded-xl transition-colors cursor-pointer ml-0.5 ${
              isNotifOpen 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
            title="Notifikasi & Pembaruan"
            aria-label="Notification"
          >
            <Bell className="w-3.5 h-3.5" strokeWidth={1.8} />
            {totalUnreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full border border-white animate-pulse" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
              
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-xs">Pusat Notifikasi</h3>
                  {totalUnreadCount > 0 && (
                    <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded-full">
                      {totalUnreadCount}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {unreadAnnCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[10px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
                      title="Tandai semua pengumuman telah dibaca"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Baca Semua</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setIsNotifOpen(false); setPreviewAnn(null); }}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {!previewAnn && (
                <div className="space-y-1.5 p-2 bg-white border-b border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => { setNotifTab('announcements'); setAnnPage(1); }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        notifTab === 'announcements'
                          ? 'bg-slate-900 text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Bell className="w-3 h-3" />
                      <span>Pengumuman</span>
                      {unreadAnnCount > 0 && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          notifTab === 'announcements' ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {unreadAnnCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setNotifTab('messages'); setMsgPage(1); }}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        notifTab === 'messages'
                          ? 'bg-slate-900 text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Pesan Teman</span>
                      {unreadChatCount > 0 && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                          notifTab === 'messages' ? 'bg-white/20 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {unreadChatCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {notifTab === 'announcements' && (
                    <div className="flex items-center justify-between px-1 pt-1 text-[10px]">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => { setAnnFilter('unread'); setAnnPage(1); }}
                          className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                            annFilter === 'unread'
                              ? 'bg-slate-200 text-slate-900 font-bold'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          Belum Dibaca ({announcements.filter(a => !isRead(a.id)).length})
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAnnFilter('all'); setAnnPage(1); }}
                          className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                            annFilter === 'all'
                              ? 'bg-slate-200 text-slate-900 font-bold'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          Semua ({announcements.length})
                        </button>
                      </div>

                      <span className="text-slate-400">
                        {displayedAnnouncements.length} item
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-2 max-h-80 overflow-y-auto">
                {previewAnn ? (
                  <div className="p-2 space-y-3 animate-in fade-in">
                    <button
                      type="button"
                      onClick={() => setPreviewAnn(null)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Kembali ke Daftar</span>
                    </button>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {previewAnn.category === 'update' ? 'Pembaruan' : previewAnn.category === 'system' ? 'Sistem' : 'Pengumuman'}
                        </span>
                        {previewAnn.priority === 'important' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            PENTING
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {new Date(previewAnn.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        {previewAnn.title}
                      </h4>

                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-1">
                        {previewAnn.content}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Oleh: {previewAnn.authorName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate(isAdmin ? '/admin/announcements' : '/announcements');
                        }}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Buka Halaman Lengkap
                      </button>
                    </div>
                  </div>
                ) : notifTab === 'announcements' ? (
                  paginatedAnnouncements.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                      <Info className="w-5 h-5 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700">
                        {annFilter === 'unread' ? 'Semua pengumuman telah dibaca' : 'Tidak ada pengumuman'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {paginatedAnnouncements.map((ann) => {
                        const read = isRead(ann.id);

                        return (
                          <div
                            key={ann.id}
                            onClick={() => handleOpenAnnPreview(ann)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              !read 
                                ? 'bg-blue-50/40 border-blue-200 hover:bg-blue-50/70' 
                                : 'bg-white border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  {!read && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                                  )}
                                  <span className="font-bold text-xs text-slate-900 truncate">
                                    {ann.title}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1">
                                  {ann.content}
                                </p>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                                {new Date(ann.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  paginatedMessages.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                      <MessageSquare className="w-5 h-5 mx-auto text-slate-300" />
                      <p className="font-semibold text-slate-700">Belum ada percakapan</p>
                      <p className="text-[10px]">Mulai chat dengan teman di halaman Pesan.</p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {paginatedMessages.map((msg) => (
                        <div
                          key={msg.messageId || msg.timestamp}
                          onClick={() => handleOpenChat(msg)}
                          className="p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                              {msg.friendName?.[0]?.toUpperCase() || msg.senderName?.[0]?.toUpperCase() || 'T'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-900 truncate">{msg.friendName || msg.senderName}</p>
                              <p className="text-[11px] text-slate-500 truncate max-w-[180px]">{msg.messageText}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>

              {!previewAnn && (
                <div className="p-2 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px]">
                  {notifTab === 'announcements' ? (
                    totalAnnPages > 1 ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-slate-400 text-[10px]">Hal {annPage}/{totalAnnPages}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setAnnPage(p => Math.max(1, p - 1))}
                            disabled={annPage === 1}
                            className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                          >
                            Prev
                          </button>
                          <button
                            type="button"
                            onClick={() => setAnnPage(p => Math.min(totalAnnPages, p + 1))}
                            disabled={annPage === totalAnnPages}
                            className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate(isAdmin ? '/admin/announcements' : '/announcements');
                        }}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline mx-auto block"
                      >
                        Buka Halaman Informasi Lengkap →
                      </button>
                    )
                  ) : (
                    totalMsgPages > 1 ? (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-slate-400 text-[10px]">Hal {msgPage}/{totalMsgPages}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setMsgPage(p => Math.max(1, p - 1))}
                            disabled={msgPage === 1}
                            className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                          >
                            Prev
                          </button>
                          <button
                            type="button"
                            onClick={() => setMsgPage(p => Math.min(totalMsgPages, p + 1))}
                            disabled={msgPage === totalMsgPages}
                            className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/chat');
                        }}
                        className="text-xs font-semibold text-slate-700 hover:text-slate-900 hover:underline mx-auto block"
                      >
                        Buka Halaman Pesan & Teman →
                      </button>
                    )
                  )}
                </div>
              )}

            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onSync || manualSync}
          disabled={loading}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
            loading
              ? 'bg-blue-50/50 border-blue-100 text-blue-600 cursor-not-allowed'
              : isOnline
              ? 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-600 hover:text-slate-900'
              : 'bg-amber-50 border-amber-200 text-amber-700'
          }`}
          title={isOnline ? 'Sinkronisasi data Google Sheets' : 'Mode Offline - Menggunakan Cache Lokal'}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-blue-600' : 'text-slate-400'}`} strokeWidth={2} />
          <span className="hidden md:inline font-semibold">
            {loading ? 'Syncing...' : isOnline ? 'Sync' : 'Offline'}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        </button>
      </div>

      <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleInputKeyDown}
            placeholder="Cari materi, batch, modul, atau menu..."
            className="w-full pl-8 pr-12 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-slate-400 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
          />

          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                inputRef.current?.focus();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          ) : (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-400 pointer-events-none">
              Ctrl+K
            </div>
          )}
        </div>

        {isSearchOpen && (
          <div className="absolute right-0 mt-2 w-full sm:w-[420px] bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
            <div className="p-2.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pencarian LMS
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {searchResults.length} hasil
              </span>
            </div>

            <div className="p-1 max-h-80 overflow-y-auto space-y-0.5">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                  <Search className="w-5 h-5 mx-auto text-slate-300 mb-1" />
                  <p className="font-semibold text-slate-700">Tidak ada hasil ditemukan</p>
                  <p className="text-[11px]">
                    Tidak ditemukan data yang cocok dengan "{searchQuery}"
                  </p>
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const Icon = item.icon || FileText;
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={item.to + idx}
                      type="button"
                      onClick={() => handleSelectResult(item.to)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                              {item.name}
                            </p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <ArrowRight className={`w-3 h-3 shrink-0 ml-2 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}