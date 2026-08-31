import { TopNav } from '../../components/TopNav';
import { Sidebar } from '../../components/Sidebar';
import { ProtectedEducatorRoute } from '../../components/ProtectedEducatorRoute';
import { CurriculumPlacementPanel } from '../../components/educator/editor/CurriculumPlacementPanel';
import { ContentDetailPanel } from '../../components/educator/editor/ContentDetailPanel';
import { EditorModalsContainer } from '../../components/educator/editor/EditorModalsContainer';
import { useContentEditor } from '../../hooks/useContentEditor';
import { ArrowLeft, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export function EducatorContentEditor() {
  const editor = useContentEditor();
  const {
    isEditMode,
    loadedContentId,
    estimatedReadTime,
    error,
    success,
    isSaving,
    handleFormSubmitCheck,
    navigate
  } = editor;

  return (
    <ProtectedEducatorRoute>
      <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-[1520px] mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/educator/contents')}
                    className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      {isEditMode || loadedContentId ? 'Edit Materi' : 'Buat Materi Baru'}
                    </h1>
                    <p className="text-slate-500 text-xs mt-0.5">Tentukan kurikulum dan tulis konten pembelajaran Anda.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{estimatedReadTime} menit baca</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-xl border ${
                    isEditMode || loadedContentId
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isEditMode || loadedContentId ? 'Mode Edit' : 'Draft Baru'}
                  </span>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-700 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-medium">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium">Materi berhasil disimpan!</span>
                </div>
              )}

              <form onSubmit={handleFormSubmitCheck} className="space-y-6">
                <CurriculumPlacementPanel {...editor} />

                <ContentDetailPanel
                  activeTab={editor.activeTab}
                  setActiveTab={editor.setActiveTab}
                  loadedContentId={editor.loadedContentId}
                  setContentTitle={editor.setContentTitle}
                  setHtmlContent={editor.setHtmlContent}
                  setLoadedContentId={editor.setLoadedContentId}
                  contentTitle={editor.contentTitle}
                  htmlContent={editor.htmlContent}
                />

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 cursor-pointer shadow-xs active:scale-95 transition-all"
                  >
                    {isSaving ? 'Menyimpan...' : (isEditMode || loadedContentId ? 'Perbarui Materi' : 'Simpan Materi')}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>

        <EditorModalsContainer editor={editor} />
      </div>
    </ProtectedEducatorRoute>
  );
}
