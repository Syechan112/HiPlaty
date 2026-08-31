import { useState } from 'react';
import { 
  X, 
  Search, 
  UserPlus, 
  MessageCircle, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StudyRoomFriendItem } from './StudyRoomFriendItem';

export function StudyRoomFriendModal({
  isOpen, onClose, friends = [], currentBatch, addFriendInput, setAddFriendInput,
  friendModalError, friendSubmitting, handleAddFriendSubmit,
  handleInviteFriendToStudyGroup, friendSearchFilter, setFriendSearchFilter, removeFriend
}) {
  const [confirmingFriend, setConfirmingFriend] = useState(null);
  const [createdGroupResult, setCreatedGroupResult] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  if (!isOpen) return null;

  const filteredFriends = friends.filter(f => {
    const name = f.name || f.userName || '';
    const id = f.userId || f.id || '';
    return !friendSearchFilter || name.toLowerCase().includes(friendSearchFilter.toLowerCase()) || id.toLowerCase().includes(friendSearchFilter.toLowerCase());
  });

  const handleConfirmCreateGroup = async () => {
    if (!confirmingFriend) return;
    setIsCreatingGroup(true);
    setConfirmError('');
    try {
      if (handleInviteFriendToStudyGroup) {
        const res = await handleInviteFriendToStudyGroup(confirmingFriend);
        if (res?.success) {
          setCreatedGroupResult({
            friend: confirmingFriend,
            groupId: res.groupId,
            groupName: res.groupName
          });
          setConfirmingFriend(null);
          return;
        } else {
          setConfirmError(res?.message || 'Gagal membuat kelompok belajar.');
        }
      }
    } catch (err) {
      console.error(err);
      setConfirmError('Terjadi kesalahan saat membuat grup.');
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleCloseModal = () => {
    setConfirmingFriend(null);
    setCreatedGroupResult(null);
    setConfirmError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <UserPlus className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Teman Belajar</h3>
              <p className="text-[11px] text-slate-400">Diskusi & Ajak Teman Buat Study Group</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. SUCCESS VIEW: GROUP CREATED & CHAT SENT */}
        {createdGroupResult ? (
          <div className="p-6 text-center space-y-4 flex-1 overflow-y-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Study Group Berhasil Dibuat!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Pesan ajakan bergabung telah dikirimkan ke ruang obrolan <strong>{createdGroupResult.friend?.name}</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>{createdGroupResult.groupName}</span>
              </div>
              <p className="text-[11px] text-slate-400">ID Group: <strong className="font-mono text-slate-700">{createdGroupResult.groupId}</strong></p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                to="/learning/study-group"
                onClick={handleCloseModal}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Buka Halaman Study Group</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={`/chat?userId=${createdGroupResult.friend?.userId || createdGroupResult.friend?.id}`}
                onClick={handleCloseModal}
                className="w-full py-2 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Buka Chat dengan {createdGroupResult.friend?.name}</span>
              </Link>
              <button
                type="button"
                onClick={() => setCreatedGroupResult(null)}
                className="text-xs text-slate-400 hover:text-slate-700 transition-colors pt-1 block mx-auto cursor-pointer"
              >
                ← Kembali ke Daftar Teman
              </button>
            </div>
          </div>
        ) : confirmingFriend ? (
          /* 2. CONFIRMATION VIEW: PROMPT TO CREATE STUDY GROUP WITH THIS FRIEND */
          <div className="p-5 space-y-4 flex-1 overflow-y-auto">
            {confirmError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs">
                {confirmError}
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {(confirmingFriend.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{confirmingFriend.name}</h4>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{confirmingFriend.userId || confirmingFriend.id}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                Apakah Anda ingin membuat <strong>Study Group</strong> bersama <strong>{confirmingFriend.name}</strong>?
                Pesan ajakan otomatis beserta kartu konfirmasi akan langsung dikirim ke obrolan pribadinya.
              </div>

              {currentBatch && (
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2 text-xs">
                  <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-[11px] text-slate-600 truncate">
                    Materi: <strong>{currentBatch.batchName}</strong>
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmingFriend(null);
                  setConfirmError('');
                }}
                disabled={isCreatingGroup}
                className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmCreateGroup}
                disabled={isCreatingGroup}
                className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isCreatingGroup ? 'Membuat Group...' : 'Ya, Buat Group'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* 3. DEFAULT LIST VIEW: FRIENDS LIST WITH INVITE BUTTON */
          <>
            <form onSubmit={handleAddFriendSubmit} className="p-3.5 bg-slate-50/50 border-b border-slate-100 space-y-2">
              {friendModalError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">{friendModalError}</p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={addFriendInput}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                  placeholder="Masukkan User ID atau Username..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
                <button
                  type="submit"
                  disabled={friendSubmitting || !addFriendInput.trim()}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-2xs"
                >
                  {friendSubmitting ? 'Menambah...' : '+ Tambah'}
                </button>
              </div>
            </form>

            <div className="p-3.5 overflow-y-auto space-y-2 flex-1 max-h-[340px]">
              <div className="relative mb-2">
                <input
                  type="text"
                  value={friendSearchFilter}
                  onChange={(e) => setFriendSearchFilter(e.target.value)}
                  placeholder="Cari dalam daftar teman..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {filteredFriends.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Belum ada teman terdaftar.</p>
              ) : (
                filteredFriends.map(f => (
                  <StudyRoomFriendItem
                    key={f.userId || f.id}
                    friend={f}
                    onSelectForGroup={setConfirmingFriend}
                    onRemoveFriend={removeFriend}
                  />
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
