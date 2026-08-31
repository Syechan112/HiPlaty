import { X } from 'lucide-react';

export function BatchSelectModal({
  isOpen,
  onClose,
  batchSearch,
  setBatchSearch,
  modalFilteredBatches,
  selectedBatchId,
  handleBatchSelect
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Pilih Batch Kurikulum</h3>
            <p className="text-[11px] text-slate-500">Pilih salah satu batch milik Anda</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
          <input
            type="text"
            value={batchSearch}
            onChange={(e) => setBatchSearch(e.target.value)}
            placeholder="Cari nama batch..."
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
          />
        </div>
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {modalFilteredBatches.map((b) => (
            <button
              key={b.batchId}
              type="button"
              onClick={() => {
                handleBatchSelect(b.batchId);
                onClose();
              }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedBatchId === b.batchId
                  ? 'bg-slate-900 text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <p className="text-xs font-bold">{b.batchName}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
