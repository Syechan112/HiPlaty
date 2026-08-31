import { useState } from 'react';
import { useAuth } from './useAuth';
import { useAnnouncements } from './useAnnouncements';

export function useAdminAnnouncementsPage() {
  const { auth, isAdmin } = useAuth();
  const { allAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedAnn, setSelectedAnn] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deletingAnn, setDeletingAnn] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'update',
    priority: 'normal',
    targetRole: 'all',
    content: ''
  });

  const filteredAnnouncements = allAnnouncements.filter(a => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.content?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    );
  });

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedAnn(null);
    setFormData({
      title: '',
      category: 'update',
      priority: 'normal',
      targetRole: 'all',
      content: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ann) => {
    setModalMode('edit');
    setSelectedAnn(ann);
    setFormData({
      title: ann.title || '',
      category: ann.category || 'update',
      priority: ann.priority || 'normal',
      targetRole: ann.targetRole || 'all',
      content: ann.content || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (modalMode === 'create') {
      createAnnouncement(formData);
      setSuccessMessage('Pengumuman baru berhasil diterbitkan!');
    } else if (selectedAnn) {
      updateAnnouncement(selectedAnn.id, formData);
      setSuccessMessage('Pengumuman berhasil diperbarui!');
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = (id, title) => {
    setDeletingAnn({ id, title });
  };

  const handleConfirmDelete = () => {
    if (deletingAnn) {
      deleteAnnouncement(deletingAnn.id);
      setSuccessMessage('Pengumuman berhasil dihapus.');
      setDeletingAnn(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return {
    isAdmin,
    allAnnouncements,
    filteredAnnouncements,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formData,
    setFormData,
    searchQuery,
    setSearchQuery,
    successMessage,
    deletingAnn,
    setDeletingAnn,
    openCreateModal,
    openEditModal,
    handleSubmit,
    handleDelete,
    handleConfirmDelete
  };
}
