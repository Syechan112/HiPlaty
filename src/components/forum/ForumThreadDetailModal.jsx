import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Send, 
  Code, 
  Heart,
  Shield,
  GraduationCap,
  Trash2
} from 'lucide-react';
import { getTagInfo, formatRemainingTime, formatPostTime } from '../../constants/forumConstants';

export function ForumThreadDetailModal({
  thread,
  isOpen,
  onClose,
  currentUserId,
  userRole,
  onLike,
  onAddReply,
  onDelete
}) {
  const [replyText, setReplyText] = useState('');
  const replyInputRef = useRef(null);
  const repliesBottomRef = useRef(null);

  const prevReplyCount = useRef(thread?.replies?.length || 0);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => replyInputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    const count = thread?.replies?.length || 0;
    if (count > prevReplyCount.current) {
      repliesBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevReplyCount.current = count;
  }, [thread?.replies?.length]);

  if (!isOpen || !thread) return null;

  const isLiked = Array.isArray(thread.likes) && thread.likes.some(id => String(id) === String(currentUserId));
  const likesCount = thread.likes?.length || 0;
  const replies = Array.isArray(thread.replies) ? thread.replies : [];
  const tagInfo = getTagInfo(thread.tag);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const ok = onAddReply(thread.threadId, replyText);
    if (ok) {
      setReplyText('');
      setTimeout(() => repliesBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  const isAuthor = Boolean(
    thread.authorId && currentUserId && String(thread.authorId).trim().toLowerCase() === String(currentUserId).trim().toLowerCase()
  );
  const canDelete = isAuthor || userRole === 'admin' || userRole === 'educator';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-slate-100 font-bold text-slate-800 text-[11px]">
              #{tagInfo.label}
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{formatRemainingTime(thread.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {canDelete && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(thread.threadId);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Hapus Diskusi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Thread Content + Replies */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Original Post */}
          <div className="space-y-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center shrink-0">
                {(thread.authorName || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{thread.authorName || 'Pengguna'}</span>
                  {thread.authorRole === 'admin' ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-extrabold">
                      <Shield className="w-2.5 h-2.5" />
                      <span>Admin</span>
                    </span>
                  ) : thread.authorRole === 'educator' ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-extrabold">
                      <GraduationCap className="w-2.5 h-2.5" />
                      <span>Educator</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                      Siswa
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{formatPostTime(thread.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {thread.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {thread.content}
              </p>

              {thread.codeSnippet && (
                <div className="p-3.5 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1.5 font-sans">
                    <Code className="w-3.5 h-3.5" />
                    <span>Cuplikan Kode</span>
                  </div>
                  <pre className="whitespace-pre">{thread.codeSnippet}</pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={() => onLike(thread.threadId)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isLiked 
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-600' : ''}`} />
                <span>{likesCount} Suka</span>
              </button>

              {canDelete && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDelete(thread.threadId);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-xs font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Diskusi</span>
                </button>
              )}
            </div>
          </div>

          {/* Replies Section */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              {replies.length} Tanggapan Diskusi
            </h3>

            {replies.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                Belum ada tanggapan. Jadilah yang pertama menjawab diskusi ini!
              </div>
            ) : (
              <div className="space-y-3">
                {replies.map(rep => (
                  <div key={rep.replyId} className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                          {(rep.authorName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-xs text-slate-800">{rep.authorName}</span>
                        {rep.authorRole === 'admin' && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[9px] font-extrabold">Admin</span>
                        )}
                        {rep.authorRole === 'educator' && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 text-[9px] font-extrabold">Educator</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{formatPostTime(rep.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-700 pl-8 leading-relaxed whitespace-pre-wrap">
                      {rep.text}
                    </p>
                  </div>
                ))}
                <div ref={repliesBottomRef} />
              </div>
            )}
          </div>
        </div>

        {/* Reply Input Form (Footer) */}
        <form onSubmit={handleReplySubmit} className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
          <input
            ref={replyInputRef}
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Tulis tanggapan atau solusi untuk diskusi ini..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-2xl transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
