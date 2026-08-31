import { BatchPlacementCard } from './BatchPlacementCard';
import { ModulePlacementCard } from './ModulePlacementCard';

export function CurriculumPlacementPanel(props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">1</span>
        <div>
          <h2 className="font-bold text-slate-900 text-sm">Penempatan Kurikulum</h2>
          <p className="text-slate-400 text-xs">Pilih Batch dan Modul</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BatchPlacementCard {...props} />
        <ModulePlacementCard {...props} />
      </div>
    </div>
  );
}
