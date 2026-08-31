import { Link } from 'react-router-dom';
import { BookOpen, Edit3, ArrowRight, Eye, Plus } from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';

export function RecentLessonsCard({ recentContents = [], getContentViews }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-2xs shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">Materi Terbaru Diterbitkan</h2>
              <p className="text-xs text-slate-400 font-medium">Daftar materi yang baru saja Anda buat / perbarui</p>
            </div>
          </div>
          <Link
            to="/educator/contents"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors shrink-0"
          >
            <span>Semua Materi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Content List */}
        {recentContents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            Belum ada materi pembelajaran yang diterbitkan.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentContents.map(c => {
              const catInfo = getCategoryInfo(c.category);
              const views = getContentViews ? getContentViews(c.contentId) : 0;
              const editUrl = `/educator/contents/edit/${c.contentId}`;

              return (
                <div key={c.contentId} className="py-3 flex items-center justify-between gap-3 group">
                  <div className="truncate flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border shrink-0 ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                      <Link 
                        to={editUrl}
                        className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors"
                      >
                        {c.title}
                      </Link>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      {c.batchName} &rsaquo; {c.moduleTitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-100 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-violet-500" />
                      <span>{views} views</span>
                    </span>
                    <Link
                      to={editUrl}
                      className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-center"
                      title="Edit Materi Ini"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-700" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span>Menampilkan 5 materi teratas</span>
        <Link 
          to="/educator/contents/create" 
          className="text-slate-900 font-extrabold hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Materi Baru</span>
        </Link>
      </div>
    </div>
  );
}
