import { ChevronDown, ChevronRight, FileText } from 'lucide-react';

export function LessonPreviewSidebar({
  selectedPreviewBatch,
  selectedModuleId,
  selectedContentId,
  expandedModules,
  toggleModule,
  handleSelectLesson
}) {
  return (
    <aside className="w-72 sm:w-80 border-r border-slate-200 bg-slate-50/60 flex flex-col shrink-0 overflow-hidden hidden md:flex">
      <div className="p-3.5 border-b border-slate-100 bg-white/50">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Silabus Kurikulum</span>
        <p className="text-xs font-bold text-slate-800 mt-0.5">Daftar Modul & Materi</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {selectedPreviewBatch.modules?.map((mod, mIdx) => {
          const isExpanded = Boolean(expandedModules[mod.moduleId]);
          const isCurrentMod = mod.moduleId === selectedModuleId;

          return (
            <div key={mod.moduleId} className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => toggleModule(mod.moduleId)}
                className={`w-full p-3 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isCurrentMod ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCurrentMod ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {mIdx + 1}
                  </div>
                  <span className="font-bold text-slate-800 text-xs truncate">{mod.moduleTitle}</span>
                </div>
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
              </button>

              {isExpanded && (
                <div className="p-2 bg-slate-50/60 divide-y divide-slate-100 border-t border-slate-100">
                  {mod.contents?.map((c) => {
                    const isSelected = c.contentId === selectedContentId;

                    return (
                      <button
                        key={c.contentId}
                        type="button"
                        onClick={() => handleSelectLesson(mod.moduleId, c.contentId)}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'hover:bg-white text-slate-700'
                        }`}
                      >
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-300' : 'text-slate-400'}`} />
                        <span className={`text-xs truncate ${isSelected ? 'font-bold text-white' : 'font-medium'}`}>
                          {c.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
