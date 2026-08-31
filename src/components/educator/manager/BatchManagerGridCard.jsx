import { Link } from 'react-router-dom';
import { 
  Layers, 
  BookOpen, 
  FileText, 
  Edit3, 
  Trash2, 
  Plus, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';

export function BatchManagerGridCard({
  batch,
  handleOpenEditBatch,
  handleDeleteBatch,
  handleEditContent,
  handleDeleteContent,
  deletingId
}) {
  const catInfo = getCategoryInfo(batch.category);
  const totalLessonsInBatch = batch.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0;
  const modules = batch.modules || [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Top Card Section */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Category & Action Icons */}
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold border truncate ${catInfo.color}`}>
            {catInfo.label}
          </span>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleOpenEditBatch(batch)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Edit Batch"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteBatch(batch)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Hapus Batch"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Stats */}
        <div className="space-y-1">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {batch.batchName}
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            ID: {batch.batchId}
          </p>
        </div>

        {/* Modules & Lessons Pill Stats */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modul</span>
            <span className="text-base font-black text-slate-900 font-mono">{modules.length}</span>
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Materi</span>
            <span className="text-base font-black text-slate-900 font-mono">{totalLessonsInBatch}</span>
          </div>
        </div>

        {/* Preview of Modules List */}
        <div className="pt-2 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daftar Modul:</span>
          {modules.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Belum ada modul di batch ini.</p>
          ) : (
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {modules.slice(0, 3).map(mod => (
                <div key={mod.moduleId} className="p-2 rounded-xl bg-slate-50/70 border border-slate-100 text-xs flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-700 truncate">{mod.moduleTitle}</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">{mod.contents?.length || 0} materi</span>
                </div>
              ))}
              {modules.length > 3 && (
                <p className="text-[10px] text-slate-400 font-semibold text-center pt-0.5">
                  +{modules.length - 3} modul lainnya
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          to={`/educator/contents/create?batchId=${batch.batchId}`}
          className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer hover:border-slate-300"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Tambah Materi</span>
        </Link>
      </div>
    </div>
  );
}
