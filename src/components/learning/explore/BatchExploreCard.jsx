import { Link } from 'react-router-dom';
import { 
  Layers, 
  Bookmark, 
  BookmarkCheck, 
  BookOpen, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Sparkles,
  FolderPlus,
  Eye
} from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';

export function BatchExploreCard({
  batch,
  viewMode,
  isSyllabusExpanded,
  toggleSyllabus,
  handleToggleBatchSave,
  setSelectedPreviewContent,
  setSelectedPreviewBatch,
  setSelectedUsersListBatch,
  setStudyGroupModalBatch
}) {
  const catInfo = getCategoryInfo(batch.category);

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group ${
      viewMode === 'list' ? 'p-5 sm:p-6' : 'p-6'
    }`}>
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 truncate">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${catInfo.color}`}>
                {catInfo.label}
              </span>
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate mt-1 group-hover:text-blue-600 transition-colors">
                {batch.batchName}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => handleToggleBatchSave(e, batch)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 shadow-2xs ${
              batch.isSaved
                ? 'bg-amber-500 text-white border-amber-500 shadow-amber-500/20'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
            title={batch.isSaved ? 'Hapus dari Ruang Belajar' : 'Simpan ke Ruang Belajar'}
          >
            <Bookmark className={`w-4 h-4 ${batch.isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Metadata & Educator info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-normal">Educator:</span>
            <strong className="text-slate-700">{batch.educatorName}</strong>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 font-mono">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{batch.totalModules} Modul ({batch.totalContents} Materi)</span>
          </div>
        </div>

        {/* Saved Students Counter */}
        {batch.totalSavedUsers > 0 && (
          <button
            type="button"
            onClick={() => setSelectedUsersListBatch(batch)}
            className="text-[11px] text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Disimpan oleh <strong>{batch.totalSavedUsers}</strong> siswa</span>
          </button>
        )}

        {/* Syllabus Preview Accordion */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => toggleSyllabus(batch.batchId)}
            className="w-full py-1.5 text-left flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            <span>Silabus & Bab Modul ({batch.totalModules})</span>
            {isSyllabusExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isSyllabusExpanded && (
            <div className="mt-2 space-y-2 max-h-56 overflow-y-auto pr-1">
              {batch.modules?.map((m, mIdx) => (
                <div key={m.moduleId} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-md bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-mono">
                      {mIdx + 1}
                    </span>
                    <span className="truncate">{m.moduleTitle}</span>
                  </p>
                  <div className="pl-5 space-y-0.5">
                    {m.contents?.map((c) => (
                      <button
                        key={c.contentId}
                        type="button"
                        onClick={() => {
                          setSelectedPreviewBatch(batch);
                          setSelectedPreviewContent(c);
                        }}
                        className="w-full text-left text-[11px] text-slate-500 hover:text-blue-600 truncate block py-0.5 cursor-pointer"
                      >
                        • {c.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setStudyGroupModalBatch(batch)}
          className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          title="Bagikan ke Grup Belajar"
        >
          <FolderPlus className="w-4 h-4" />
        </button>

        {batch.isSaved ? (
          <Link
            to={`/learning/study?batchId=${encodeURIComponent(batch.batchId)}`}
            className="flex-1 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Mulai Belajar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              const firstContent = batch.modules?.[0]?.contents?.[0];
              setSelectedPreviewBatch(batch);
              setSelectedPreviewContent(firstContent || {
                contentId: `preview-${batch.batchId}`,
                title: batch.batchName,
                htmlContent: `<p>Pratinjau kurikulum <strong>${batch.batchName}</strong> (${batch.totalModules} Modul, ${batch.totalContents} Materi).</p>`
              });
            }}
            className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Preview</span>
          </button>
        )}
      </div>
    </div>
  );
}
