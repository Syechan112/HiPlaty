import { 
  Heart, 
  MessageCircle, 
  Clock, 
  Trash2, 
  Code,
  Shield,
  GraduationCap
} from 'lucide-react';
import { getTagInfo, formatRemainingTime, formatPostTime } from '../../constants/forumConstants';

export function ForumThreadCard({
  thread,
  currentUserId,
  userRole,
  onLike,
  onOpenDetail,
  onDelete
}) {
  const isLiked = Array.isArray(thread.likes) && thread.likes.some(id => String(id) === String(currentUserId));
  const likesCount = thread.likes?.length || 0;
  const repliesCount = thread.replies?.length || 0;
  const tagInfo = getTagInfo(thread.tag);

  const canDelete = String(thread.authorId) === String(currentUserId) || userRole === 'admin';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-all space-y-4">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-center shrink-0">
            {(thread.authorName || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
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
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-0.5">
              <span>{formatPostTime(thread.createdAt)}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-700 text-[10px]">
                #{tagInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* 24h Remaining Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-bold shrink-0">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{formatRemainingTime(thread.createdAt)}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-2.5">
        <h3 
          onClick={() => onOpenDetail(thread.threadId)}
          className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-snug"
        >
          {thread.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-3">
          {thread.content}
        </p>

        {thread.codeSnippet && (
          <div className="p-3 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-[11px] overflow-x-auto border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-1 font-sans">
              <Code className="w-3 h-3" />
              <span>Cuplikan Kode</span>
            </div>
            <pre className="whitespace-pre">{thread.codeSnippet}</pre>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onLike(thread.threadId)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              isLiked 
                ? 'bg-rose-50 text-rose-600 border border-rose-200/80 shadow-2xs' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{likesCount}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDetail(thread.threadId)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{repliesCount} Balasan</span>
          </button>
        </div>

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(thread.threadId)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Hapus Diskusi"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
