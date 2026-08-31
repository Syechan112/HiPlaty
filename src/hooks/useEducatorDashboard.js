import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLmsSync } from './useLmsSync';
import { useAuth } from './useAuth';
import { useSavedMaterials } from './useSavedMaterials';
import { useContentViews } from './useContentViews';
import { getCategoryInfo } from '../config/contentCategories';

export function useEducatorDashboard() {
  const { data, manualSync } = useLmsSync();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { getBatchSaveCount, getBatchSavedUsers } = useSavedMaterials();
  const { getContentViews } = useContentViews();

  const [selectedUsersListBatch, setSelectedUsersListBatch] = useState(null);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

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

  const totalBatches = myBatches.length;
  const totalModules = myBatches.reduce((sum, batch) => sum + (batch.modules?.length || 0), 0);
  const totalContents = myBatches.reduce((sum, batch) => sum + batch.modules?.reduce((mSum, module) => mSum + (module.contents?.length || 0), 0), 0);

  const avgLessonsPerModule = totalModules > 0 ? (totalContents / totalModules).toFixed(1) : 0;
  const avgModulesPerBatch = totalBatches > 0 ? (totalModules / totalBatches).toFixed(1) : 0;

  const totalSavesAcrossBatches = useMemo(() => {
    return myBatches.reduce((acc, batch) => {
      return acc + getBatchSaveCount(batch.batchId, batch.batchName);
    }, 0);
  }, [myBatches, getBatchSaveCount]);

  const uniqueSavedStudentsCount = useMemo(() => {
    const studentSet = new Set();
    myBatches.forEach(batch => {
      const users = getBatchSavedUsers(batch.batchId, batch.batchName);
      users.forEach(u => studentSet.add(u.userId));
    });
    return studentSet.size;
  }, [myBatches, getBatchSavedUsers]);

  const categoryStats = useMemo(() => {
    const stats = {};
    myBatches.forEach(batch => {
      const catId = batch.category || 'general';
      const lessons = batch.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0;
      if (!stats[catId]) {
        stats[catId] = { batchCount: 0, lessonCount: 0 };
      }
      stats[catId].batchCount += 1;
      stats[catId].lessonCount += lessons;
    });

    return Object.entries(stats).map(([catId, val]) => ({
      category: catId,
      info: getCategoryInfo(catId),
      batchCount: val.batchCount,
      lessonCount: val.lessonCount,
      percent: totalBatches > 0 ? Math.round((val.batchCount / totalBatches) * 100) : 0
    })).sort((a, b) => b.lessonCount - a.lessonCount);
  }, [myBatches, totalBatches]);

  const batchChartData = useMemo(() => {
    const maxVal = Math.max(...myBatches.map(b => b.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0), 1);
    return myBatches.map(batch => {
      const modCount = batch.modules?.length || 0;
      const lessonCount = batch.modules?.reduce((sum, m) => sum + (m.contents?.length || 0), 0) || 0;
      const saveCount = getBatchSaveCount(batch.batchId, batch.batchName);
      return {
        id: batch.batchId,
        name: batch.batchName,
        category: batch.category || 'general',
        modules: modCount,
        lessons: lessonCount,
        saves: saveCount,
        percentage: Math.round((lessonCount / maxVal) * 100)
      };
    });
  }, [myBatches, getBatchSaveCount]);

  const recentContents = useMemo(() => {
    const list = [];
    myBatches.forEach(batch => {
      batch.modules?.forEach(mod => {
        mod.contents?.forEach(content => {
          list.push({
            batchId: batch.batchId,
            batchName: batch.batchName,
            category: batch.category || 'general',
            moduleId: mod.moduleId,
            moduleTitle: mod.moduleTitle,
            contentId: content.contentId,
            title: content.title || 'Materi Tanpa Judul'
          });
        });
      });
    });
    return list.slice(0, 5);
  }, [myBatches]);

  const activeModalSavedUsers = useMemo(() => {
    if (!selectedUsersListBatch) return [];
    const raw = getBatchSavedUsers(selectedUsersListBatch.batchId, selectedUsersListBatch.batchName);
    if (!studentSearchQuery.trim()) return raw;
    const q = studentSearchQuery.toLowerCase();
    return raw.filter(u => 
      (u.userName && u.userName.toLowerCase().includes(q)) || 
      (u.userId && u.userId.toLowerCase().includes(q))
    );
  }, [selectedUsersListBatch, getBatchSavedUsers, studentSearchQuery]);

  return {
    data,
    manualSync,
    auth,
    navigate,
    myBatches,
    totalBatches,
    totalModules,
    totalContents,
    avgLessonsPerModule,
    avgModulesPerBatch,
    totalSavesAcrossBatches,
    uniqueSavedStudentsCount,
    categoryStats,
    batchChartData,
    recentContents,
    selectedUsersListBatch,
    setSelectedUsersListBatch,
    studentSearchQuery,
    setStudentSearchQuery,
    activeModalSavedUsers,
    getContentViews
  };
}
