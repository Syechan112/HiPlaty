import { 
  Home, 
  BookOpen, 
  Settings, 
  Shield, 
  Layers, 
  FilePlus, 
  PanelLeftClose, 
  Compass, 
  MessageSquare,
  MessagesSquare,
  LogOut,
  Bell,
  Users,
  BarChart2
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { useChat } from '../hooks/useChat';
import { ConfirmModal } from './common/ConfirmModal';
import logoImg from '../assets/logo/logo.webp';

export function Sidebar() {
  const { auth, isAdmin, isEducator, logout } = useAuth();
  const { unreadCount } = useAnnouncements();
  const { unreadChatCount } = useChat();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('lms_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('lms_sidebar_collapsed', String(next));
      window.dispatchEvent(new CustomEvent('lms_sidebar_toggled', { detail: { isCollapsed: next } }));
      return next;
    });
  };

  useEffect(() => {
    const handleExternalToggle = () => {
      toggleCollapse();
    };

    window.addEventListener('lms_toggle_sidebar', handleExternalToggle);
    return () => {
      window.removeEventListener('lms_toggle_sidebar', handleExternalToggle);
    };
  }, []);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      id: 'main',
      title: 'Utama',
      items: [
        { to: '/', icon: Home, label: 'Dashboard' }
      ]
    },
    ...(!isEducator && !isAdmin ? [{
      id: 'learning',
      title: 'Pembelajaran',
      items: [
        { to: '/learning/explore', icon: Compass, label: 'Cari Materi' },
        { to: '/learning/study', icon: BookOpen, label: 'Ruang Belajar' },
        { to: '/study-group', icon: Users, label: 'Study Group' }
      ]
    }] : []),
    ...(isEducator ? [{
      id: 'educator',
      title: 'Studio Educator',
      items: [
        { to: '/educator/contents', icon: Layers, label: 'Kelola Materi' },
        { to: '/educator/contents/create', icon: FilePlus, label: 'Buat Materi' },
        { to: '/educator/analytics', icon: BarChart2, label: 'Statistik & Analitik' }
      ]
    }] : []),
    ...(isAdmin ? [{
      id: 'admin',
      title: 'Administrasi',
      items: [
        { to: '/admin/users', icon: Shield, label: 'Manajemen Pengguna' },
        { to: '/admin/announcements', icon: Bell, label: 'Pusat Informasi' }
      ]
    }] : []),
    {
      id: 'communication',
      title: 'Komunikasi',
      items: [
        { to: '/forum', icon: MessagesSquare, label: 'Forum Publik' },
        ...(!isAdmin ? [
          { to: '/announcements', icon: Bell, label: 'Informasi & Update', badge: unreadCount > 0 ? unreadCount : null }
        ] : []),
        { to: '/chat', icon: MessageSquare, label: 'Pesan & Teman', badge: unreadChatCount > 0 ? unreadChatCount : null }
      ]
    }
  ];

  const getRoleBadgeInfo = () => {
    if (isAdmin) return { label: 'Admin Console' };
    if (isEducator) return { label: 'Educator Studio' };
    return { label: 'Student Portal' };
  };

  const roleInfo = getRoleBadgeInfo();

  const renderNavItem = (item) => {
    const Icon = item.icon;
    return (
      <div key={item.to} className="relative group w-full flex justify-center">
        <NavLink
          to={item.to}
          className={({ isActive }) =>
            `group/btn relative flex items-center rounded-xl text-xs font-semibold transition-all duration-200 overflow-hidden ${
              isCollapsed 
                ? 'w-10 h-10 justify-center p-0' 
                : 'w-full px-3 py-2.5 justify-start'
            } ${
              isActive
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`w-5 h-5 min-w-[20px] flex items-center justify-center shrink-0 relative ${isActive ? 'text-white' : 'text-slate-400 group-hover/btn:text-slate-700'}`}>
                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                {isCollapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
                )}
              </div>
              
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1 ml-3 min-w-0">
                  <span className="whitespace-nowrap overflow-hidden truncate">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white shrink-0 ml-1.5">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </NavLink>

        {isCollapsed && (
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`relative flex flex-col my-3.5 ml-3.5 h-[calc(100vh-1.75rem)] rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-xs transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] will-change-[width] z-40 select-none overflow-hidden shrink-0 ${
        isCollapsed ? 'w-[70px]' : 'w-60'
      }`}
    >
      <div className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'} pt-4 pb-3.5 border-b border-slate-100 h-[68px] shrink-0 overflow-hidden`}>
        <div className="flex items-center min-w-0 overflow-hidden">
          <button
            onClick={isCollapsed ? toggleCollapse : undefined}
            className={`w-9 h-9 min-w-[36px] rounded-xl overflow-hidden flex items-center justify-center border border-slate-200/80 bg-white shrink-0 transition-transform ${
              isCollapsed ? 'hover:scale-105 cursor-pointer' : ''
            }`}
            title={isCollapsed ? 'Buka Sidebar' : undefined}
          >
            <img 
              src={logoImg} 
              alt="HiPlaty Logo" 
              className="w-full h-full object-cover rounded-xl"
              loading="lazy"
              width="36"
              height="36"
            />
          </button>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 overflow-hidden ml-2.5">
              <span className="font-bold text-slate-900 text-sm tracking-tight leading-tight truncate">
                HiPlaty
              </span>
              <span className="text-[10px] font-medium text-slate-400 truncate tracking-wide">
                {roleInfo.label}
              </span>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg p-1.5 transition-colors shrink-0 cursor-pointer"
            title="Kecilkan Sidebar"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" strokeWidth={2} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3 flex flex-col justify-start space-y-3.5">
        {navSections.map((section, index) => (
          <div key={section.id} className="w-full space-y-1 overflow-hidden">
            {!isCollapsed ? (
              <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase whitespace-nowrap overflow-hidden pt-1 pb-1">
                {section.title}
              </div>
            ) : index > 0 ? (
              <div className="h-px bg-slate-200/80 w-5 mx-auto my-1.5" />
            ) : null}

            <div className="space-y-1 overflow-hidden">
              {section.items.map(renderNavItem)}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2.5 border-t border-slate-100 space-y-1 shrink-0 overflow-hidden flex flex-col items-center">
        {renderNavItem({ to: '/settings', icon: Settings, label: 'Pengaturan' })}

        {auth && (
          <div className="relative group w-full flex justify-center">
            <button
              onClick={handleLogout}
              className={`flex items-center rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50/80 transition-all overflow-hidden cursor-pointer ${
                isCollapsed 
                  ? 'w-10 h-10 justify-center p-0' 
                  : 'w-full px-3 py-2.5 justify-start'
              }`}
              title={isCollapsed ? 'Keluar Akun' : undefined}
            >
              <div className="w-5 h-5 min-w-[20px] flex items-center justify-center shrink-0">
                <LogOut className="w-[18px] h-[18px] text-rose-500" strokeWidth={1.8} />
              </div>
              
              {!isCollapsed && (
                <span className="whitespace-nowrap overflow-hidden ml-3 truncate">
                  Keluar Akun
                </span>
              )}
            </button>

            {isCollapsed && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                <span>Keluar Akun</span>
              </div>
            )}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Keluar dari Akun"
        message="Apakah Anda yakin ingin keluar dari akun? Sesi aktif Anda akan diakhiri."
        confirmText="Keluar Akun"
        cancelText="Batal"
        type="logout"
      />
    </aside>
  );
}