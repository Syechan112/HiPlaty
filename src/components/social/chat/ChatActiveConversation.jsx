import { useState } from 'react';
import { Send, UserMinus, MessageCircle, Edit2, Trash2, X, Copy, Check, Users } from 'lucide-react';
import { RoleBadge } from '../../RoleBadge';
import { ChatStudyGroupInviteCard } from './ChatStudyGroupInviteCard';
import { ChatInviteStudyGroupModal } from './ChatInviteStudyGroupModal';

export function ChatActiveConversation({
  activeFriend,
  currentUserId,
  messages,
  messagesEndRef,
  messageInputRef,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  editingMessage,
  setEditingMessage,
  handleStartEdit,
  deleteMessage,
  setShowUnfriendModal,
  copiedFriendId,
  handleCopyFriendId
}) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!activeFriend) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3 bg-slate-50/50">
        <div className="w-14 h-14 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
          <MessageCircle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Pilih Teman untuk Memulai Obrolan</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Kirim pesan langsung ke sesama siswa atau instruktur untuk berdiskusi materi secara privat.
          </p>
        </div>
      </div>
    );
  }

  const friendId = activeFriend.userId || activeFriend.id;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-3 truncate">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {(activeFriend.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm truncate">{activeFriend.name || 'Teman'}</h2>
              <RoleBadge role={activeFriend.role || 'student'} />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span>ID: {friendId}</span>
              <button
                type="button"
                onClick={() => handleCopyFriendId(friendId)}
                className="hover:text-slate-700 cursor-pointer"
                title="Salin ID"
              >
                {copiedFriendId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Ajak Teman ke Study Group"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ajak Study Group</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUnfriendModal(true)}
            className="p-2 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
            title="Hapus dari Daftar Teman"
          >
            <UserMinus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
        {messages.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Belum ada pesan dengan {activeFriend.name}. Kirim sapaan pertama Anda!
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentUserId;
            const isInvite = m.messageType === 'study_group_invite' || 
              Boolean(m.inviteData) || 
              (typeof m.messageText === 'string' && (m.messageText.includes('(ID Room: SG-') || m.messageText.includes('[UNDANGAN_STUDY_GROUP]')));

            return (
              <div key={m.messageId} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] font-bold text-slate-400">{isMe ? 'Anda' : activeFriend.name}</span>
                  <span className="text-[9px] text-slate-300 font-mono">
                    {new Date(m.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 max-w-[85%] sm:max-w-md">
                  {isMe && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      {!isInvite && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(m)}
                          className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                          title="Edit Pesan"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteMessage(m.messageId)}
                        className="p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {isInvite ? (
                    <ChatStudyGroupInviteCard
                      message={m}
                      currentUserId={currentUserId}
                    />
                  ) : (
                    <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                      isMe
                        ? 'bg-slate-900 text-white rounded-tr-none shadow-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-2xs'
                    }`}>
                      <p className="whitespace-pre-wrap">{m.messageText}</p>
                      {m.isEdited && (
                        <span className={`text-[9px] block text-right mt-1 font-normal ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                          (diedit)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-100 bg-white space-y-2">
        {editingMessage && (
          <div className="flex items-center justify-between p-2 bg-amber-50 rounded-xl text-xs text-amber-900 font-medium">
            <span>Mengedit pesan...</span>
            <button
              type="button"
              onClick={() => {
                setEditingMessage(null);
                setInputMessage('');
              }}
              className="p-1 hover:bg-amber-100 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={messageInputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Tulis pesan ke ${activeFriend.name}...`}
            className="flex-1 px-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-2xl transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Modal Ajak Study Group */}
      <ChatInviteStudyGroupModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        activeFriend={activeFriend}
      />
    </div>
  );
}
