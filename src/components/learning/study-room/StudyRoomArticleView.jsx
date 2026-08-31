import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { MaterialCommentsSection } from '../MaterialCommentsSection';

export function StudyRoomArticleView({
  currentBatch,
  currentContent,
  prevContent,
  nextContent,
  handleSelectContent,
  handleMarkComplete,
  isCompleted
}) {
  if (!currentContent) return null;

  const rawText = (currentContent.htmlContent || '').replace(/<[^>]*>?/gm, '');
  const words = rawText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedMins = Math.max(1, Math.ceil(words / 150));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Article Container */}
      <article className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pb-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>~{estimatedMins} menit baca</span>
          </div>
          {currentContent.createdAt && (
            <span>• Terbit: {new Date(currentContent.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          )}
        </div>

        <div 
          className="rich-article-content prose prose-slate max-w-none text-slate-800 leading-relaxed text-sm sm:text-base font-normal select-text"
          dangerouslySetInnerHTML={{ __html: currentContent.htmlContent || '<p class="text-slate-400 italic">Materi belum memiliki konten teks.</p>' }}
        />

        {/* Completion Footer within Article */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl">
          <div>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">Sudah selesai membaca materi ini?</p>
            <p className="text-[11px] text-slate-400">Tandai selesai untuk memperbarui progres kurikulum Anda.</p>
          </div>
          <button
            type="button"
            onClick={() => handleMarkComplete(currentContent.contentId)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              isCompleted
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Materi Selesai' : 'Tandai Selesai'}</span>
          </button>
        </div>
      </article>

      {/* Prev / Next Pagination Bar */}
      <div className="flex items-center justify-between gap-4">
        {prevContent ? (
          <button
            type="button"
            onClick={() => handleSelectContent(currentBatch.batchId, prevContent.moduleId, prevContent.contentId)}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 transition-all flex items-center gap-2 shadow-2xs cursor-pointer group"
          >
            <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-normal">Sebelumnya</span>
              <span className="truncate max-w-[140px] sm:max-w-[200px] block">{prevContent.title}</span>
            </div>
          </button>
        ) : <div />}

        {nextContent ? (
          <button
            type="button"
            onClick={() => handleSelectContent(currentBatch.batchId, nextContent.moduleId, nextContent.contentId)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer group ml-auto"
          >
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-normal">Selanjutnya</span>
              <span className="truncate max-w-[140px] sm:max-w-[200px] block">{nextContent.title}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : <div />}
      </div>

      {/* Comments / Discussion Section */}
      <div className="pt-4">
        <MaterialCommentsSection contentId={currentContent.contentId} />
      </div>
    </div>
  );
}
