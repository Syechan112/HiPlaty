import { Sparkles, RotateCcw } from 'lucide-react';
import { RichTextEditor } from '../../RichTextEditor';

export function ContentDetailPanel({
  activeTab,
  setActiveTab,
  loadedContentId,
  setContentTitle,
  setHtmlContent,
  setLoadedContentId,
  contentTitle,
  htmlContent
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">2</span>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">Detail & Isi Konten</h2>
            <p className="text-slate-400 text-xs">Tuliskan judul dan materi pembelajaran</p>
          </div>
        </div>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg gap-0.5">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'editor' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            Pratinjau
          </button>
        </div>
      </div>

      {loadedContentId && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 truncate">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="truncate font-medium">
              <strong>Mode Edit Aktif:</strong> Isi materi telah dimuat dari modul ini.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setContentTitle('');
              setHtmlContent('');
              setLoadedContentId('');
            }}
            className="px-3 py-1.5 bg-white hover:bg-amber-100/70 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Buat Materi Baru (Kosongkan)</span>
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Judul Materi *</label>
        <input
          type="text"
          value={contentTitle}
          onChange={(e) => setContentTitle(e.target.value)}
          placeholder="Contoh: Pengenalan Sintaks Modern"
          className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all"
        />
      </div>

      {activeTab === 'editor' ? (
        <RichTextEditor value={htmlContent} onChange={setHtmlContent} placeholder="Tulis materi di sini..." />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[360px]">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">{contentTitle || 'Judul Materi'}</h1>
          <div className="rich-article-content prose prose-slate max-w-none text-sm" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      )}
    </div>
  );
}
