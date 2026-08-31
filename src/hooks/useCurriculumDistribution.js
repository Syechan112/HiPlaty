import { useState, useMemo } from 'react';
import { getCategoryInfo } from '../config/contentCategories';
import { DONUT_CHART_COLORS } from '../constants/chartPalettes';

export function useCurriculumDistribution({ batchChartData = [], categoryStats = [] }) {
  const [dataTab, setDataTab] = useState('batch');
  const [viewMode, setViewMode] = useState('bar');

  const top5Batches = useMemo(() => {
    return [...batchChartData]
      .sort((a, b) => (b.lessons || 0) - (a.lessons || 0) || (b.saves || 0) - (a.saves || 0))
      .slice(0, 5);
  }, [batchChartData]);

  const top5Categories = useMemo(() => {
    if (categoryStats && categoryStats.length > 0) {
      return [...categoryStats]
        .sort((a, b) => (b.lessonCount || 0) - (a.lessonCount || 0))
        .slice(0, 5);
    }

    const catMap = new Map();
    batchChartData.forEach(b => {
      const catKey = b.category || 'general';
      const prev = catMap.get(catKey) || {
        category: catKey,
        batchCount: 0,
        lessonCount: 0,
        info: getCategoryInfo(catKey)
      };
      catMap.set(catKey, {
        ...prev,
        batchCount: prev.batchCount + 1,
        lessonCount: prev.lessonCount + (b.lessons || 0)
      });
    });

    return Array.from(catMap.values())
      .sort((a, b) => b.lessonCount - a.lessonCount)
      .slice(0, 5);
  }, [categoryStats, batchChartData]);

  const currentItems = dataTab === 'batch' ? top5Batches : top5Categories;

  const totalVolume = useMemo(() => {
    if (dataTab === 'batch') {
      return top5Batches.reduce((acc, b) => acc + (b.lessons || 0), 0);
    }
    return top5Categories.reduce((acc, c) => acc + (c.lessonCount || 0), 0);
  }, [dataTab, top5Batches, top5Categories]);

  const maxVal = useMemo(() => {
    if (dataTab === 'batch') {
      return Math.max(...top5Batches.map(b => b.lessons || 0), 1);
    }
    return Math.max(...top5Categories.map(c => c.lessonCount || 0), 1);
  }, [dataTab, top5Batches, top5Categories]);

  const donutSegments = useMemo(() => {
    if (totalVolume === 0) return [];
    let accumulatedAngle = 0;
    const circumference = 2 * Math.PI * 40;

    return currentItems.map((item, idx) => {
      const val = dataTab === 'batch' ? (item.lessons || 0) : (item.lessonCount || 0);
      const ratio = totalVolume > 0 ? val / totalVolume : 0;
      const strokeLength = ratio * circumference;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += strokeLength;

      return {
        ...item,
        color: DONUT_CHART_COLORS[idx % DONUT_CHART_COLORS.length],
        percentage: Math.round(ratio * 100),
        strokeDasharray: `${strokeLength} ${circumference}`,
        strokeDashoffset
      };
    });
  }, [currentItems, totalVolume, dataTab]);

  return {
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
  };
}
