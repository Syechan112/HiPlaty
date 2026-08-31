import { useState } from 'react';
import { X, Sparkles, Code, MessageSquare } from 'lucide-react';
import { FORUM_TAGS } from '../../constants/forumConstants';

export function ForumCreateModal({
  isOpen,
  onClose,
  onCreateThread
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('qna');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const ok = onCreateThread({
      title,
      content,
      tag,
      codeSnippet: showCodeInput ? codeSnippet : ''
    });

    if (ok) {
      setTitle('');
      setContent('');
      setTag('qna');
      setCodeSnippet('');
      setShowCodeInput(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm">Mulai Diskusi Baru (24 Jam)</h2>
              <p className="text-[11px] text-slate-400">Postingan ini akan otomatis dibersihkan dalam 24 jam</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Tag Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Kategori / Topik</label>
            <div className="flex flex-wrap gap-1.5">
              {FORUM_TAGS.filter(t => t.id !== 'all').map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTag(t.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tag === t.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Judul Pertanyaan / Topik</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Bagaimana cara membedakan state dan props di React?"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Penjelasan Lengkap</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Jelaskan pertanyaan atau topik yang ingin Anda diskusikan bersama..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 leading-relaxed"
              required
            />
          </div>

          {/* Optional Code Snippet Toggle */}
          <div>
            {!showCodeInput ? (
              <button
                type="button"
                onClick={() => setShowCodeInput(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Code className="w-3.5 h-3.5" />
                <span>+ Lampirkan Cuplikan Kode</span>
              </button>
            ) : (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Cuplikan Kode (Opsional)</label>
                  <button
                    type="button"
                    onClick={() => { setShowCodeInput(false); setCodeSnippet(''); }}
                    className="text-[11px] font-semibold text-rose-500 hover:underline cursor-pointer"
                  >
                    Batal lampirkan
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="// Tulis atau tempel potongan kode di sini..."
                  className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publikasikan Diskusi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
