import { useState, useMemo, useEffect } from 'react';
import { useLmsSync } from './useLmsSync';
import { useAuth } from './useAuth';
import { useSavedMaterials } from './useSavedMaterials';
import { useContentViews } from './useContentViews';
import { getCategoryInfo } from '../config/contentCategories';

export function useEducatorAnalytics() {
  const { data, manualSync } = useLmsSync();
  const { auth } = useAuth();
  const { getBatchSaveCount, getBatchSavedUsers } = useSavedMaterials();
  const { getContentViews, getBatchTotalViews } = useContentViews();

  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalItem, setSelectedModalItem] = useState(null);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [chartMode, setChartMode] = useState('bar');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const currentUserId = String(auth?.userId || '').trim().toLowerCase();
  const isAdmin = auth?.role === 'admin';

  const myBatches = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(batch => {
      const myModules = batch.modules?.map(m => ({
        ...m,
        contents: m.contents?.filter(c => {
          const ownerId = String(c.userId || '').trim().toLowerCase();
          return isAdmin || (ownerId && ownerId === currentUserId);
        }) || []
      })).filter(m => m.contents.length > 0) || [];

      return {
        ...batch,
        modules: myModules
      };
    }).filter(b => b.modules.length > 0);
  }, [data, currentUserId, isAdmin]);

  const allLessons = useMemo(() => {
    const list = [];
    myBatches.forEach(batch => {
      const bSaves = getBatchSaveCount(batch.batchId, batch.batchName);
      batch.modules?.forEach(mod => {
        mod.contents?.forEach(content => {
          const rawText = (content.htmlContent || '').replace(/<[^>]*>?/gm, '');
          const words = rawText.trim().split(/\s+/).filter(Boolean).length;
          const readMins = Math.max(1, Math.ceil(words / 150));
          const views = getContentViews(content.contentId);

          list.push({
            contentId: content.contentId,
            title: content.title || 'Materi Tanpa Judul',
            batchId: batch.batchId,
            batchName: batch.batchName,
            batchCategory: batch.category || 'general',
            moduleId: mod.moduleId,
            moduleTitle: mod.moduleTitle,
            wordCount: words,
            readMinutes: readMins,
            savesCount: bSaves,
            viewsCount: views,
            createdAt: content.createdAt || null
          });
        });
      });
    });
    return list;
  }, [myBatches, getBatchSaveCount, getContentViews]);

  const totalBatchesCount = myBatches.length;
  const totalModulesCount = myBatches.reduce((acc, b) => acc + (b.modules?.length || 0), 0);
  const totalLessonsCount = allLessons.length;

  const totalSavesCount = useMemo(() => {
    return myBatches.reduce((acc, b) => acc + getBatchSaveCount(b.batchId, b.batchName), 0);
  }, [myBatches, getBatchSaveCount]);

  const totalViewsCount = useMemo(() => {
    return allLessons.reduce((acc, l) => acc + l.viewsCount, 0);
  }, [allLessons]);

  const uniqueStudentsCount = useMemo(() => {
    const set = new Set();
    myBatches.forEach(b => {
      const users = getBatchSavedUsers(b.batchId, b.batchName);
      users.forEach(u => set.add(u.userId));
    });
    return set.size;
  }, [myBatches, getBatchSavedUsers]);

  const totalReadingMinutes = useMemo(() => {
    return allLessons.reduce((acc, l) => acc + l.readMinutes, 0);
  }, [allLessons]);

  const topRankedBatches = useMemo(() => {
    return [...myBatches].map(b => {
      const lessons = b.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0;
      const saves = getBatchSaveCount(b.batchId, b.batchName);
      return {
        batchId: b.batchId,
        batchName: b.batchName,
        category: b.category || 'general',
        modulesCount: b.modules?.length || 0,
        lessonsCount: lessons,
        savesCount: saves
      };
    }).sort((a, b) => b.savesCount - a.savesCount || b.lessonsCount - a.lessonsCount);
  }, [myBatches, getBatchSaveCount]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    myBatches.forEach(b => {
      const cat = b.category || 'general';
      const lessons = b.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0;
      const saves = getBatchSaveCount(b.batchId, b.batchName);
      if (!map[cat]) {
        map[cat] = { category: cat, batchCount: 0, lessonCount: 0, savesCount: 0 };
      }
      map[cat].batchCount += 1;
      map[cat].lessonCount += lessons;
      map[cat].savesCount += saves;
    });

    return Object.values(map).map(item => ({
      ...item,
      info: getCategoryInfo(item.category),
      percentage: totalLessonsCount > 0 ? Math.round((item.lessonCount / totalLessonsCount) * 100) : 0
    })).sort((a, b) => b.lessonCount - a.lessonCount);
  }, [myBatches, totalLessonsCount, getBatchSaveCount]);

  const filteredLessons = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allLessons.filter(l => {
      const matchBatch = selectedBatchFilter === 'all' || l.batchId === selectedBatchFilter;
      const matchCat = selectedCategoryFilter === 'all' || l.batchCategory === selectedCategoryFilter;
      const matchQuery = !q || 
        l.title.toLowerCase().includes(q) || 
        l.moduleTitle.toLowerCase().includes(q) || 
        l.batchName.toLowerCase().includes(q);

      return matchBatch && matchCat && matchQuery;
    });
  }, [allLessons, selectedBatchFilter, selectedCategoryFilter, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBatchFilter, selectedCategoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedLessons = filteredLessons.slice(startIndex, endIndex);

  const activeModalUsers = useMemo(() => {
    if (!selectedModalItem) return [];
    const users = getBatchSavedUsers(selectedModalItem.batchId, selectedModalItem.batchName);
    const q = modalSearchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u => 
      (u.userName || '').toLowerCase().includes(q) || 
      (u.userId || '').toLowerCase().includes(q)
    );
  }, [selectedModalItem, getBatchSavedUsers, modalSearchQuery]);

  return {
    data,
    manualSync,
    auth,
    myBatches,
    allLessons,
    totalBatchesCount,
    totalModulesCount,
    totalLessonsCount,
    totalSavesCount,
    totalViewsCount,
    uniqueStudentsCount,
    totalReadingMinutes,
    topRankedBatches,
    categoryBreakdown,
    selectedBatchFilter,
    setSelectedBatchFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    selectedModalItem,
    setSelectedModalItem,
    modalSearchQuery,
    setModalSearchQuery,
    chartMode,
    setChartMode,
    currentPage,
    setCurrentPage,
    ITEMS_PER_PAGE,
    filteredLessons,
    totalPages,
    startIndex,
    endIndex,
    paginatedLessons,
    activeModalUsers
  };
}
