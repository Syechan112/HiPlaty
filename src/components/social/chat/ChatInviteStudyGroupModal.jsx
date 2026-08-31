import { useState } from 'react';
import { X, Users, Plus, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStudyGroup } from '../../../hooks/useStudyGroup';

export function ChatInviteStudyGroupModal({
  isOpen,
  onClose,
  activeFriend,
  onInviteSent
}) {
  const { groups, createGroup, inviteFriendToGroup } = useStudyGroup();
  const [selectedGroupId, setSelectedGroupId] = useState('NEW');
  const [newGroupName, setNewGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !activeFriend) return null;

  const friendId = activeFriend.userId || activeFriend.id;
  const friendName = activeFriend.name || activeFriend.userName || 'Teman';
  const defaultNewName = `Study Group: Bersama ${friendName}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let targetGroupId = selectedGroupId;

      if (selectedGroupId === 'NEW') {
        const groupTitle = newGroupName.trim() || defaultNewName;
        const res = createGroup(groupTitle, `Kelompok belajar bersama ${friendName}`, 'slate');
        if (!res.success || !res.group) {
          setError(res.message || 'Gagal membuat kelompok belajar baru.');
          setIsSubmitting(false);
          return;
        }
        targetGroupId = res.group.id;
      }

      const inviteRes = inviteFriendToGroup(targetGroupId, {
        userId: friendId,
        name: friendName
      });

      if (inviteRes.success) {
        if (onInviteSent) onInviteSent(targetGroupId);
        onClose();
      } else {
        setError(inviteRes.message || 'Gagal mengirimkan undangan.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan sistem saat mengirim undangan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Ajak ke Study Group</h3>
              <p className="text-[11px] text-slate-400">Kirim kartu undangan belajar bersama ke {friendName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Option: Create New Group */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block text-xs">Pilih Opsi Undangan:</label>
            
            <div className="space-y-2">
              <label 
                className={`p-3 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  selectedGroupId === 'NEW'
                    ? 'border-slate-900 bg-slate-50/80 ring-1 ring-slate-900'
                    : 'border-slate-200 hover:bg-slate-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="groupOption"
                  checked={selectedGroupId === 'NEW'}
                  onChange={() => setSelectedGroupId('NEW')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <Plus className="w-3.5 h-3.5 text-slate-600" />
                    <span>Buat Study Group Baru</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Buat kelompok baru khusus belajar bersama {friendName}</p>

                  {selectedGroupId === 'NEW' && (
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder={defaultNewName}
                      className="w-full mt-2.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                    />
                  )}
                </div>
              </label>

              {/* Option: Existing Groups */}
              {groups.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 block">Atau pilih dari grup Anda:</span>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                    {groups.map((g) => (
                      <label
                        key={g.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          selectedGroupId === g.id
                            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                            : 'border-slate-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <input
                            type="radio"
                            name="groupOption"
                            checked={selectedGroupId === g.id}
                            onChange={() => setSelectedGroupId(g.id)}
                          />
                          <div className="truncate">
                            <p className="font-bold text-slate-900 truncate">{g.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {g.id}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Undangan'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
