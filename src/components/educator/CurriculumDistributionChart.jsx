import { FolderOpen } from 'lucide-react';
import { useCurriculumDistribution } from '../../hooks/useCurriculumDistribution';
import { DistributionChartHeader } from './distribution/DistributionChartHeader';
import { DistributionBarView } from './distribution/DistributionBarView';
import { DistributionDonutView } from './distribution/DistributionDonutView';

export function CurriculumDistributionChart({
  batchChartData = [],
  categoryStats = [],
  onSelectBatch,
  onSelectBatchUsers
}) {
  const handleSelect = onSelectBatch || onSelectBatchUsers;

  const {
    dataTab,
    setDataTab,
    viewMode,
    setViewMode,
    top5Batches,
    top5Categories,
    currentItems,
    totalVolume,
    maxVal,
    donutSegments
  } = useCurriculumDistribution({ batchChartData, categoryStats });

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
      <DistributionChartHeader
        dataTab={dataTab}
        setDataTab={setDataTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        batchCount={top5Batches.length}
        categoryCount={top5Categories.length}
      />

      {currentItems.length > 0 ? (
        viewMode === 'bar' ? (
          <DistributionBarView
            dataTab={dataTab}
            top5Batches={top5Batches}
            top5Categories={top5Categories}
            maxVal={maxVal}
            onSelectBatch={handleSelect}
          />
        ) : (
          <DistributionDonutView
            donutSegments={donutSegments}
            totalVolume={totalVolume}
            dataTab={dataTab}
          />
        )
      ) : (
        <div className="py-12 text-center space-y-2 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
          <FolderOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs font-bold text-slate-700">Belum Ada Kurikulum yang Terdaftar</p>
          <p className="text-[11px] text-slate-400">Buat materi atau batch pertama untuk menampilkan visualisasi grafik.</p>
        </div>
      )}
    </div>
  );
}
