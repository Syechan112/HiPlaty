import { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  ArrowRight, 
  Bookmark, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Layers, 
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MaterialCommentsSection } from '../MaterialCommentsSection';
import { LessonPreviewSidebar } from './LessonPreviewSidebar';
import { getCategoryInfo } from '../../../config/contentCategories';

export function LessonPreviewModal({
  selectedPreviewBatch,
  selectedPreviewContent,
  onClose,
  handleToggleBatchSave
}) {
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedContentId, setSelectedContentId] = useState('');
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    if (selectedPreviewBatch && selectedPreviewBatch.modules?.length > 0) {
      const firstMod = selectedPreviewBatch.modules[0];
      const initialMod = selectedPreviewContent?.moduleId 
        ? selectedPreviewBatch.modules.find(m => m.moduleId === selectedPreviewContent.moduleId) || firstMod
        : firstMod;
      const initialCont = selectedPreviewContent?.contentId
        ? initialMod.contents?.find(c => c.contentId === selectedPreviewContent.contentId) || initialMod.contents?.[0]
        : initialMod.contents?.[0];

      setSelectedModuleId(initialMod.moduleId);
      setSelectedContentId(initialCont?.contentId || '');
      setExpandedModules({ [initialMod.moduleId]: true });
    }
  }, [selectedPreviewBatch, selectedPreviewContent]);

  const currentModule = useMemo(() => {
    if (!selectedPreviewBatch?.modules) return null;
    return selectedPreviewBatch.modules.find(m => m.moduleId === selectedModuleId) || selectedPreviewBatch.modules[0] || null;
  }, [selectedPreviewBatch, selectedModuleId]);

  const currentContent = useMemo(() => {
    if (!currentModule?.contents) return null;
    return currentModule.contents.find(c => c.contentId === selectedContentId) || currentModule.contents[0] || null;
  }, [currentModule, selectedContentId]);

  const allFlatContents = useMemo(() => {
    if (!selectedPreviewBatch?.modules) return [];
    return selectedPreviewBatch.modules.flatMap(m =>
      (m.contents || []).map(c => ({ ...c, moduleId: m.moduleId, moduleTitle: m.moduleTitle }))
    );
  }, [selectedPreviewBatch]);

  const currentContentIndex = useMemo(() => {
    if (!currentContent) return -1;
    return allFlatContents.findIndex(c => c.contentId === currentContent.contentId);
  }, [allFlatContents, currentContent]);

  const prevContent = currentContentIndex > 0 ? allFlatContents[currentContentIndex - 1] : null;
  const nextContent = currentContentIndex >= 0 && currentContentIndex < allFlatContents.length - 1 
    ? allFlatContents[currentContentIndex + 1] 
    : null;

  const toggleModule = (modId) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleSelectLesson = (modId, contId) => {
    setSelectedModuleId(modId);
    setSelectedContentId(contId);
  };

  if (!selectedPreviewBatch) return null;

  const catInfo = getCategoryInfo(selectedPreviewBatch.category);
  const rawText = (currentContent?.htmlContent || '').replace(/<[^>]*>?/gm, '');
  const words = rawText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedMins = Math.max(1, Math.ceil(words / 150));

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-6xl w-full h-[90vh] max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-white shrink-0">
          <div className="flex items-center gap-3 truncate">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${catInfo.color}`}>
                  {catInfo.label}
                </span>
                <span className="px-2 py-0.2 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Pratinjau Ruang Belajar
                </span>
              </div>
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate mt-0.5">
                {selectedPreviewBatch.batchName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Educator: <strong className="text-slate-800">{selectedPreviewBatch.educatorName}</strong></span>
              <span>•</span>
              <span className="font-mono">{selectedPreviewBatch.totalModules} Modul ({selectedPreviewBatch.totalContents} Materi)</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Left Sidebar: Kurikulum */}
          <LessonPreviewSidebar
            selectedPreviewBatch={selectedPreviewBatch}
            selectedModuleId={selectedModuleId}
            selectedContentId={selectedContentId}
            expandedModules={expandedModules}
            toggleModule={toggleModule}
            handleSelectLesson={handleSelectLesson}
          />

          {/* Right Area: Article Reading View */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col bg-white">
            {currentContent ? (
              <div className="max-w-3xl mx-auto w-full space-y-6 flex-1">
                
                <div className="space-y-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span>{currentModule?.moduleTitle}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>~{estimatedMins} menit baca</span>
                    </div>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {currentContent.title}
                  </h1>
                </div>

                <div 
                  className="rich-article-content prose prose-slate max-w-none text-slate-800 leading-relaxed text-xs sm:text-sm font-normal select-text min-h-[160px]"
                  dangerouslySetInnerHTML={{ __html: currentContent.htmlContent || '<p class="text-slate-400 italic">Materi belum memiliki konten teks.</p>' }}
                />

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                  {prevContent ? (
                    <button
                      type="button"
                      onClick={() => handleSelectLesson(prevContent.moduleId, prevContent.contentId)}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center gap-2 shadow-2xs cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-400" />
                      <div className="text-left">
                        <span className="text-[10px] text-slate-400 block font-normal">Sebelumnya</span>
                        <span className="truncate max-w-[120px] sm:max-w-[160px] block">{prevContent.title}</span>
                      </div>
                    </button>
                  ) : <div />}

                  {nextContent ? (
                    <button
                      type="button"
                      onClick={() => handleSelectLesson(nextContent.moduleId, nextContent.contentId)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer ml-auto"
                    >
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-normal">Selanjutnya</span>
                        <span className="truncate max-w-[120px] sm:max-w-[160px] block">{nextContent.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </button>
                  ) : <div />}
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <MaterialCommentsSection contentId={currentContent.contentId} />
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                Pilih materi dari silabus di sebelah kiri untuk melihat isi bacaan.
              </div>
            )}
          </main>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            {selectedPreviewBatch.isSaved
              ? '✅ Batch ini sudah ada di Ruang Belajar Anda.'
              : '💡 Mode Pratinjau. Simpan batch ini ke Ruang Belajar untuk mulai melacak progres.'}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Tutup Pratinjau
            </button>
            
            {selectedPreviewBatch.isSaved ? (
              <Link
                to={`/learning/study?batchId=${encodeURIComponent(selectedPreviewBatch.batchId)}&moduleId=${encodeURIComponent(selectedModuleId)}&contentId=${encodeURIComponent(selectedContentId)}`}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Buka di Ruang Belajar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  if (handleToggleBatchSave) {
                    handleToggleBatchSave(e, selectedPreviewBatch);
                  }
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 fill-white" />
                <span>Simpan ke Ruang Belajar</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
