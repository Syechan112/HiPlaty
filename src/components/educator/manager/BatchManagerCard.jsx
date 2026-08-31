import { Link } from 'react-router-dom';
import { 
  Layers, 
  BookOpen, 
  FileText, 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Plus, 
  ExternalLink,
  Tag
} from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';

export function BatchManagerCard({
  batch,
  isExpanded,
  toggleBatch,
  expandedModule,
  toggleModule,
  handleOpenEditBatch,
  handleDeleteBatch,
  handleEditContent,
  handleDeleteContent,
  deletingId
}) {
  const catInfo = getCategoryInfo(batch.category);
  const totalLessonsInBatch = batch.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:border-slate-300">
      {/* Batch Header Bar */}
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
        <div 
          onClick={() => toggleBatch(batch.batchId)}
          className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="truncate flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate">
                {batch.batchName}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${catInfo.color}`}>
                {catInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              ID: {batch.batchId} • {batch.modules?.length || 0} Modul • {totalLessonsInBatch} Materi
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
          <Link
            to={`/educator/contents/create?batchId=${batch.batchId}`}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            title="Tambah materi ke batch ini"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Materi</span>
          </Link>

          <button
            type="button"
            onClick={() => handleOpenEditBatch(batch)}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-all shadow-2xs cursor-pointer"
            title="Edit Nama & Kategori Batch"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => handleDeleteBatch(batch)}
            className="p-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 rounded-xl transition-all shadow-2xs cursor-pointer"
            title="Hapus Batch Ini"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => toggleBatch(batch.batchId)}
            className="p-2 bg-slate-900 text-white rounded-xl transition-all shadow-2xs cursor-pointer"
            title={isExpanded ? 'Tutup Rincian' : 'Buka Rincian'}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Accordion Body: Modules & Lessons */}
      {isExpanded && (
        <div className="p-5 sm:p-6 border-t border-slate-100 bg-white space-y-4 animate-in fade-in duration-200">
          {batch.modules?.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              Belum ada modul terdaftar pada batch ini.
            </div>
          ) : (
            batch.modules?.map((mod, modIdx) => {
              const isModExpanded = expandedModule === mod.moduleId;
              return (
                <div key={mod.moduleId} className="rounded-2xl border border-slate-200/80 overflow-hidden bg-slate-50/30">
                  {/* Module Bar */}
                  <div className="p-4 flex items-center justify-between gap-3 bg-slate-50/80">
                    <div 
                      onClick={() => toggleModule(mod.moduleId)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1 truncate"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                        {modIdx + 1}
                      </div>
                      <div className="truncate">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {mod.moduleTitle}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono">
                          ID: {mod.moduleId} • {mod.contents?.length || 0} Materi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        to={`/learning/study?batchId=${encodeURIComponent(batch.batchId)}&moduleId=${encodeURIComponent(mod.moduleId)}`}
                        className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        title="Buka di Ruang Belajar"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => toggleModule(mod.moduleId)}
                        className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                      >
                        {isModExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Lessons in Module */}
                  {(!expandedModule || isModExpanded) && (
                    <div className="p-3 bg-white divide-y divide-slate-100 border-t border-slate-100">
                      {mod.contents?.map((c, cIdx) => (
                        <div key={c.contentId} className="py-2.5 px-2 flex items-center justify-between gap-3 group hover:bg-slate-50/80 rounded-xl transition-colors">
                          <div className="flex items-center gap-2.5 truncate flex-1">
                            <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {cIdx + 1}
                            </span>
                            <div className="truncate">
                              <p className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                                {c.title}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">
                                ID: {c.contentId}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditContent(c)}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                              title="Edit Materi Ini"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={deletingId === c.contentId}
                              onClick={() => handleDeleteContent(c)}
                              className="p-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                              title="Hapus Materi Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
