import { useState, useMemo } from 'react';
import { X, Users, Search, UserMinus, ChevronLeft, ChevronRight, Crown, Shield } from 'lucide-react';
import { ConfirmModal } from '../../../common/ConfirmModal';

const ITEMS_PER_PAGE = 5;

export function StudyGroupMembersModal({
  isOpen,
  onClose,
  activeGroup,
  isOwner,
  currentUserId,
  removeMemberFromGroup
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [memberToKick, setMemberToKick] = useState(null);

  const members = activeGroup?.members || [];

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase();
    return members.filter(m => {
      const name = (m.userName || m.name || '').toLowerCase();
      const id = (m.userId || '').toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [members, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / ITEMS_PER_PAGE));
  const pageIndex = Math.min(currentPage, totalPages);

  const paginatedMembers = useMemo(() => {
    const startIndex = (pageIndex - 1) * ITEMS_PER_PAGE;
    return filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMembers, pageIndex]);

  if (!isOpen || !activeGroup) return null;

  const handleConfirmKick = () => {
    if (memberToKick && removeMemberFromGroup) {
      removeMemberFromGroup(activeGroup.id, memberToKick.userId);
      setMemberToKick(null);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Anggota Grup ({members.length})
                </h3>
                <p className="text-[10px] text-slate-400">
                  {isOwner ? 'Kelola anggota kelompok belajar' : 'Daftar teman dalam kelompok belajar'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari anggota nama atau ID..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Paginated Members List (5 items per page) */}
          <div className="space-y-2 flex-1 overflow-y-auto min-h-[220px]">
            {filteredMembers.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                Tidak ada anggota yang cocok dengan pencarian.
              </div>
            ) : (
              paginatedMembers.map((m, i) => {
                const isGroupCreator = 
                  m.role === 'owner' || 
                  m.userId === activeGroup.ownerId || 
                  m.userId === activeGroup.createdBy;
                const isMe = String(m.userId).toLowerCase() === String(currentUserId).toLowerCase();

                return (
                  <div
                    key={m.userId || i}
                    className="p-3 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                        isGroupCreator ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'
                      }`}>
                        {(m.userName || m.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5 truncate">
                          <p className="font-bold text-xs text-slate-900 truncate">
                            {m.userName || m.name || 'Anggota'}
                          </p>
                          {isMe && (
                            <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                              Anda
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono truncate">ID: {m.userId}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isGroupCreator ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded-lg">
                          <Crown className="w-3 h-3 text-amber-600" />
                          <span>Ketua</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-lg">
                          <Shield className="w-3 h-3 text-slate-400" />
                          <span>Anggota</span>
                        </span>
                      )}

                      {/* Owner Management Kick Button */}
                      {isOwner && !isGroupCreator && !isMe && (
                        <button
                          type="button"
                          onClick={() => setMemberToKick(m)}
                          className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Keluarkan dari grup"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Footer (5 data per page) */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs shrink-0">
            <span className="text-[11px] text-slate-400">
              Halaman <strong>{pageIndex}</strong> dari <strong>{totalPages}</strong> ({filteredMembers.length} anggota)
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={pageIndex <= 1}
                className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-colors"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={pageIndex >= totalPages}
                className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg cursor-pointer transition-colors"
                title="Halaman Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Confirm Kick Modal */}
      <ConfirmModal
        isOpen={Boolean(memberToKick)}
        onClose={() => setMemberToKick(null)}
        onConfirm={handleConfirmKick}
        title="Keluarkan Anggota?"
        message={`Apakah Anda yakin ingin mengeluarkan "${memberToKick?.userName || memberToKick?.name}" (@${memberToKick?.userId}) dari kelompok belajar ini?`}
        confirmText="Ya, Keluarkan"
        cancelText="Batal"
        type="danger"
      />
    </>
  );
}
