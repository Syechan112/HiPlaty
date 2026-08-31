import { Layers, ChevronDown, Tag } from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';

export function BatchPlacementCard({
  isEditMode,
  myBatches,
  useExistingBatch,
  setUseExistingBatch,
  selectedBatchId,
  setSelectedBatchId,
  newBatchName,
  setNewBatchName,
  setBatchSearch,
  setShowBatchModal,
  category,
  setShowCategoryModal,
  setUseExistingModule,
  setSelectedModuleId,
  setNewModuleName,
  setLoadedContentId,
  setContentTitle,
  setHtmlContent
}) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between space-y-6 hover:shadow-[0_12px_35px_rgb(0,0,0,0.06)] transition-all duration-300">
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">Batch & Kategori</h3>
              <p className="text-xs text-slate-400 font-medium">Penempatan kelas & topik kurikulum</p>
            </div>
          </div>

          {!isEditMode && myBatches && myBatches.length > 0 && (
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUseExistingBatch(true)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  useExistingBatch 
                    ? 'bg-white text-slate-900 shadow-sm font-bold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Pilih Batch
              </button>
              <button
                type="button"
                onClick={() => {
                  setUseExistingBatch(false);
                  setUseExistingModule(false);
                  setSelectedBatchId('');
                  setSelectedModuleId('');
                  setNewBatchName('');
                  setNewModuleName('');
                  setLoadedContentId('');
                  setContentTitle('');
                  setHtmlContent('');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !useExistingBatch 
                    ? 'bg-white text-slate-900 shadow-sm font-bold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                + Batch Baru
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Nama Batch Kurikulum <span className="text-rose-500">*</span>
            </label>
            {useExistingBatch && myBatches && myBatches.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setBatchSearch('');
                  setShowBatchModal(true);
                }}
                className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 hover:border-slate-300 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 truncate mr-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {myBatches.find(b => b.batchId === selectedBatchId)?.batchName || 'Pilih Batch Kurikulum...'}
                    </p>
                    {selectedBatchId && (
                      <p className="text-[10px] text-slate-400 font-mono">
                        ID: {selectedBatchId} • {myBatches.find(b => b.batchId === selectedBatchId)?.modules?.length || 0} Modul
                      </p>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 transition-transform group-hover:translate-y-0.5" />
              </button>
            ) : (
              <input
                type="text"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                placeholder="Ketik nama batch baru milik Anda..."
                className="w-full px-4 py-3 bg-slate-50/70 focus:bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-2xs"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Kategori Bidang Topik <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowCategoryModal(true)}
              className="w-full px-4 py-3 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 hover:border-slate-300 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-2.5 truncate mr-1.5">
                <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border truncate ${getCategoryInfo(category).color}`}>
                  {getCategoryInfo(category).label}
                </span>
                <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                  {getCategoryInfo(category).description}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
