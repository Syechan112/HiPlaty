import { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  RotateCw, 
  Clock, 
  ChevronDown,
  ChevronUp,
  UserPlus,
  UserCheck,
  Check
} from 'lucide-react';
import { useMaterialComments } from '../../hooks/useMaterialComments';
import { useChat } from '../../hooks/useChat';
import { ConfirmModal } from '../common/ConfirmModal';

const COMMENTS_PER_PAGE = 5;

export function MaterialCommentsSection({ contentId, batchId = '' }) {
  const {
    comments,
    totalComments,
    loading,
    submitting,
    addComment,
    deleteComment,
    fetchComments,
    currentUserId,
    currentUserName
  } = useMaterialComments(contentId, batchId);

  const { friends, addFriend } = useChat();
  const [friendActionLoading, setFriendActionLoading] = useState({});
  const [friendSuccessMsg, setFriendSuccessMsg] = useState('');

  const [inputText, setInputText] = useState('');
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || submitting) return;
    const text = inputText;
    setInputText('');
    await addComment(text);
    setVisibleCount((prev) => Math.max(prev, COMMENTS_PER_PAGE));
  };

  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const handleAddFriendClick = async (targetUserId, targetUserName) => {
    if (!targetUserId || targetUserId.toLowerCase() === currentUserId.toLowerCase()) return;
    setFriendActionLoading((prev) => ({ ...prev, [targetUserId]: true }));
    const res = await addFriend(targetUserId);
    setFriendActionLoading((prev) => ({ ...prev, [targetUserId]: false }));
    if (res.success) {
      setFriendSuccessMsg(res.message || `${targetUserName || targetUserId} berhasil ditambahkan sebagai teman!`);
      setTimeout(() => setFriendSuccessMsg(''), 3500);
    }
  };

  const handleDelete = (commentId) => {
    setDeletingCommentId(commentId);
  };

  const handleConfirmDelete = async () => {
    if (deletingCommentId) {
      await deleteComment(deletingCommentId);
      setDeletingCommentId(null);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + COMMENTS_PER_PAGE);
  };

  const handleCollapse = () => {
    setVisibleCount(COMMENTS_PER_PAGE);
  };

  if (!contentId) return null;

  const displayedComments = comments.slice(0, visibleCount);
  const remainingCount = comments.length - visibleCount;

  return (
    <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-5">
      {friendSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in shadow-2xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{friendSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setFriendSuccessMsg('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Diskusi & Komentar Materi
              </h4>
              <span className="text-[11px] font-semibold px-2 py-0.2 bg-slate-100 text-slate-700 rounded-md">
                {totalComments} Komentar
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Bagikan pertanyaan atau tanggapan Anda seputar materi ini
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchComments}
          disabled={loading}
          title="Muat ulang komentar"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-slate-700' : ''}`} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:border-slate-400 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tulis tanggapan atau pertanyaan untuk materi ini..."
            rows={2}
            className="w-full text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent border-0 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <div className="w-5 h-5 rounded-md bg-slate-900 text-white font-bold text-[9px] flex items-center justify-center">
                {currentUserName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="truncate max-w-[150px] font-medium text-slate-600">
                {currentUserName}
              </span>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || submitting}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{submitting ? 'Mengirim...' : 'Kirim'}</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-2.5">
        {comments.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <MessageSquare className="w-5 h-5 text-slate-300 mx-auto mb-1" />
            <p className="font-semibold text-slate-700">Belum ada komentar</p>
            <p className="text-[11px]">
              Jadilah yang pertama memulai diskusi pada materi ini.
            </p>
          </div>
        ) : (
          <>
            {displayedComments.map((comment) => {
              const isOwner = comment.userId?.toLowerCase() === currentUserId?.toLowerCase();
              const isFriend = friends?.some(
                (f) => String(f.userId).toLowerCase() === String(comment.userId).toLowerCase()
              );
              const timeStr = comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Baru saja';

              return (
                <div
                  key={comment.commentId}
                  className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-2 group transition-all hover:border-slate-300"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {comment.userName?.[0]?.toUpperCase() || 'U'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900 truncate">
                            {comment.userName}
                          </span>
                          {comment.role === 'admin' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700">
                              Admin
                            </span>
                          )}
                          {comment.role === 'educator' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700">
                              Guru
                            </span>
                          )}
                          {isOwner && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                              Anda
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{timeStr}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isOwner && comment.userId && (
                        isFriend ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span className="hidden sm:inline">Teman</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddFriendClick(comment.userId, comment.userName)}
                            disabled={friendActionLoading[comment.userId]}
                            className="text-[10px] font-bold text-slate-700 hover:text-white bg-slate-100 hover:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-900 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                            title={`Tambah ${comment.userName} sebagai teman`}
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>{friendActionLoading[comment.userId] ? 'Menambah...' : 'Tambah Teman'}</span>
                          </button>
                        )
                      )}

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDelete(comment.commentId)}
                          title="Hapus komentar saya"
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-9 whitespace-pre-wrap break-words">
                    {comment.commentText}
                  </p>
                </div>
              );
            })}

            <div className="flex items-center justify-center gap-3 pt-2">
              {remainingCount > 0 && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Lihat Lebih Banyak (+{remainingCount > COMMENTS_PER_PAGE ? COMMENTS_PER_PAGE : remainingCount})</span>
                </button>
              )}

              {visibleCount > COMMENTS_PER_PAGE && (
                <button
                  type="button"
                  onClick={handleCollapse}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Tutup</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(deletingCommentId)}
        onClose={() => setDeletingCommentId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Komentar"
        message="Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Komentar"
        cancelText="Batal"
        type="danger"
      />
    </div>
  );
}
