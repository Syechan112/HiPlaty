import { Send, Edit2, Trash2, X } from 'lucide-react';

export function StudyGroupDiscussionView({
  activeGroupMessages = [],
  currentUserId,
  messagesEndRef,
  messageInputRef,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  editingMsg,
  setEditingMsg,
  handleStartEditMsg,
  deleteGroupMessage,
  activeGroupId
}) {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
      {/* Scrollable messages area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
        {(!activeGroupMessages || activeGroupMessages.length === 0) ? (
          <div className="py-24 text-center text-slate-400 text-xs font-medium">
            Belum ada diskusi di grup ini. Mulai percakapan pertama Anda!
          </div>
        ) : (
          activeGroupMessages.map((m, idx) => {
            const isSystem = Boolean(m.isSystem || m.senderId === 'SYSTEM');
            const isMe = !isSystem && Boolean(currentUserId) && String(m.senderId || '').trim().toLowerCase() === String(currentUserId || '').trim().toLowerCase();
            const messageId = m.messageId || m.id || `msg-${idx}`;
            const messageContent = m.messageText || m.text || '';
            const isEdited = Boolean(m.editedAt || m.isEdited);
            const timeText = m.timestamp
              ? new Date(m.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              : '';

            if (isSystem) {
              return (
                <div key={messageId} className="flex justify-center my-2">
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200/70 text-amber-900 text-[11px] font-medium text-center max-w-lg shadow-2xs">
                    {messageContent}
                  </div>
                </div>
              );
            }

            return (
              <div key={messageId} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold text-slate-600">
                    {isMe ? 'Anda' : (m.senderName || 'Anggota')}
                  </span>
                  {timeText && (
                    <span className="text-[9px] text-slate-300 font-mono">
                      {timeText}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 max-w-[85%] sm:max-w-md">
                  {isMe && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStartEditMsg(m)}
                        className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
                        title="Edit Pesan"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteGroupMessage(activeGroupId, messageId)}
                        className="p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                    isMe
                      ? 'bg-slate-900 text-white rounded-tr-none shadow-xs'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-2xs'
                  }`}>
                    <p className="whitespace-pre-wrap">{messageContent}</p>
                    {isEdited && (
                      <span className={`text-[9px] block text-right mt-1 font-normal ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                        (diedit)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Pinned Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200 bg-white shrink-0 space-y-2 z-10">
        {editingMsg && (
          <div className="flex items-center justify-between p-2 bg-amber-50 rounded-xl text-xs text-amber-900 font-medium">
            <span>Mengedit pesan...</span>
            <button
              type="button"
              onClick={() => {
                setEditingMsg(null);
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
            placeholder="Tulis pesan ke forum diskusi grup..."
            className="flex-1 px-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 font-medium"
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
    </div>
  );
}
