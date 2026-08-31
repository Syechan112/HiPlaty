import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './useAuth';
import { API_URL } from '../config/api';

export function useAdminUsers() {
  const { auth, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const apiUrl = localStorage.getItem('lms_api_url') || API_URL;

  const fetchUsers = async () => {
    if (!auth || auth.role !== 'admin') return;
    setFetching(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}?action=get_users`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          adminUserId: auth.userId,
          userId: auth.userId,
          email: auth.email,
          role: auth.role || 'admin',
          requestingUser: auth
        })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u => 
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.userId && u.userId.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  }, [users, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', email: '', password: '', role: 'student' });
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'student'
    });
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      let response;
      if (modalMode === 'create') {
        const encoder = new TextEncoder();
        const data = encoder.encode(formData.password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        response = await fetch(`${apiUrl}?action=create_user`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            adminUserId: auth.userId,
            name: formData.name,
            email: formData.email,
            password: hashedPassword,
            role: formData.role
          })
        });
      } else {
        const payload = {
          adminUserId: auth.userId,
          userId: selectedUser.userId,
          name: formData.name,
          email: formData.email,
          role: formData.role
        };

        if (formData.password) {
          const encoder = new TextEncoder();
          const data = encoder.encode(formData.password);
          const hashBuffer = await crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          payload.password = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        response = await fetch(`${apiUrl}?action=update_user`, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      }

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || `Failed to ${modalMode} user`);
      }

      setSuccessMessage(modalMode === 'create' ? 'Pengguna berhasil dibuat!' : 'Pengguna berhasil diperbarui!');
      setIsModalOpen(false);
      await fetchUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}?action=delete_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          adminUserId: auth.userId,
          userId: deletingUser.userId
        })
      });
      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || 'Gagal menghapus pengguna');
      }
      setSuccessMessage('Pengguna berhasil dihapus!');
      setDeletingUser(null);
      await fetchUsers();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    isAdmin,
    users,
    fetching,
    actionLoading,
    error,
    successMessage,
    searchQuery,
    handleSearchChange,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedUsers,
    filteredUsers,
    isModalOpen,
    setIsModalOpen,
    modalMode,
    formData,
    setFormData,
    deletingUser,
    setDeletingUser,
    fetchUsers,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleSubmit,
    handleConfirmDelete
  };
}
