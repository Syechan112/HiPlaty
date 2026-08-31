import { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  UserPlus, 
  Edit2, 
  LogOut, 
  Trash2, 
  Copy, 
  Check, 
  ChevronUp, 
  ChevronDown,
  PanelLeftOpen
} from 'lucide-react';
import { getGroupColor } from '../../../utils/studyGroupHelpers';

export function StudyGroupHeader({
  activeGroup,
  isOwner,
  activeTab,
  setActiveTab,
  setShowInviteModal,
  setShowMembersModal,
  handleOpenEditModal,
  setShowDeleteModal,
  copiedGroupId,
  setCopiedGroupId,
  isGroupSidebarOpen = true,
  setIsGroupSidebarOpen
}) {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  if (!activeGroup) return null;

  const colorTheme = getGroupColor(activeGroup.color);

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeGroup.id);
      setCopiedGroupId(true);
      setTimeout(() => setCopiedGroupId(false), 2000);
    }
  };

  // Compact Minimal Header Mode
  if (isHeaderCollapsed) {
    return (
      <div className="px-4 py-2 border-b border-slate-200/80 bg-white flex items-center justify-between gap-3 shrink-0 shadow-2xs transition-all animate-in fade-in duration-150">
        <div className="flex items-center gap-2.5 truncate">
          {!isGroupSidebarOpen && setIsGroupSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsGroupSidebarOpen(true)}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer mr-1"
              title="Buka Daftar Grup"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}

          <div
            className="w-7 h-7 rounded-xl text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
            style={{ backgroundColor: colorTheme.hex }}
          >
            {(activeGroup.name || 'G').charAt(0).toUpperCase()}
          </div>
          <span className="font-extrabold text-xs text-slate-900 truncate">{activeGroup.name}</span>
          
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-bold ml-2">
            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                activeTab === 'materials' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Materi ({activeGroup.materials?.length || 0})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('discussion')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer text-[11px] ${
                activeTab === 'discussion' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Diskusi</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <UserPlus className="w-3 h-3" />
            <span className="hidden sm:inline">+ Undang</span>
          </button>
          <button
            type="button"
            onClick={() => setIsHeaderCollapsed(false)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Buka detail header kelompok"
          >
            <ChevronDown className="w-4 h-4" />
            <span className="text-[10px] font-bold hidden md:inline">Buka Header</span>
          </button>
        </div>
      </div>
    );
  }

  // Expanded Full Header Mode
  return (
    <div className="p-4 sm:p-5 border-b border-slate-100 bg-white space-y-4 shrink-0 transition-all animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 truncate">
          {!isGroupSidebarOpen && setIsGroupSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsGroupSidebarOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer mr-0.5"
              title="Buka Daftar Grup"
            >
              <PanelLeftOpen className="w-4.5 h-4.5" />
            </button>
          )}

          <div
            className="w-11 h-11 rounded-2xl text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs"
            style={{ backgroundColor: colorTheme.hex }}
          >
            {(activeGroup.name || 'G').charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">{activeGroup.name}</h1>
              {isOwner ? (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-lg">
                  Pembuat Grup
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-lg">
                  Anggota
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="truncate max-w-xs">{activeGroup.description || 'Grup belajar kolaboratif'}</span>
              <span>•</span>
              <button
                type="button"
                onClick={handleCopyId}
                className="font-mono text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer shrink-0"
                title="Salin ID Grup"
              >
                <span>Kode: {activeGroup.id}</span>
                {copiedGroupId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Undang</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMembersModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Lihat & Kelola Anggota"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{activeGroup.members?.length || 1} Anggota</span>
          </button>

          <button
            type="button"
            onClick={handleOpenEditModal}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Edit Detail & Warna Grup"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 rounded-xl transition-colors cursor-pointer"
            title={isOwner ? 'Hapus Grup' : 'Keluar dari Grup'}
          >
            {isOwner ? <Trash2 className="w-3.5 h-3.5" /> : <LogOut className="w-3.5 h-3.5" />}
          </button>

          {/* Collapse Header Button */}
          <button
            type="button"
            onClick={() => setIsHeaderCollapsed(true)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer ml-1"
            title="Tutup Header agar tampilan lebih lega"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'materials' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Materi Bersama ({activeGroup.materials?.length || 0})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('discussion')}
          className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'discussion' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Forum Diskusi</span>
        </button>
      </div>
    </div>
  );
}
