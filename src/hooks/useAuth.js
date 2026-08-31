import { useState, useCallback } from 'react';
import { API_URL, AUTH_KEY, USER_PROFILE_KEY } from '../config/api';


async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function useAuth() {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isGuest = !auth;
  const isStudent = auth?.role === 'student';
  const isEducator = auth?.role === 'educator';
  const isAdmin = auth?.role === 'admin';

  const getApiUrl = () => API_URL;

  
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl();
      const hashedPassword = await hashPassword(password); 

      const response = await fetch(`${apiUrl}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
        body: JSON.stringify({ email, password: hashedPassword })
      });
      
      const resData = await response.json();
      
      if (!resData.success || !resData.user) {
        throw new Error(resData.error || resData.message || 'Login failed');
      }

      const currentUser = resData.user;
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      setAuth(currentUser);
      
      const profile = {
        isGuest: false,
        name: currentUser.name,
        role: currentUser.role,
        avatarBase64: ''
      };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      
      return currentUser;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  
  const register = useCallback(async (name, email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl();
      const hashedPassword = await hashPassword(password); 

      const response = await fetch(`${apiUrl}?action=register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'text/plain;charset=utf-8' 
        },
        body: JSON.stringify({ name, email, password: hashedPassword, role })
      });
      
      const resData = await response.json();
      
      if (!resData.success) {
        throw new Error(resData.error || resData.message || 'Registration failed');
      }

      const currentUser = {
        userId: resData.userId,
        name,
        email,
        role: role === 'educator' ? 'educator' : 'student'
      };
      
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      setAuth(currentUser);
      
      const profile = {
        isGuest: false,
        name: currentUser.name,
        role: currentUser.role,
        avatarBase64: ''
      };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
      
      return currentUser;
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    setAuth(null);
  }, []);

  
  const updateUserRole = useCallback(async (userId, newRole) => {
    if (!auth || auth.role !== 'admin') {
      setError('Unauthorized');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}?action=update_role`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ userId, newRole, requestingUser: auth })
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || result.message || 'Failed to update role');
      }
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const refreshAuth = useCallback(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        setAuth(JSON.parse(stored));
      }
    } catch {
      setAuth(null);
    }
  }, []);

  const updateProfile = useCallback(async ({ name, email, newPassword }) => {
    if (!auth || !auth.userId) {
      const updatedUser = { ...(auth || {}), name: name || 'Tamu', email: email || '' };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify({ isGuest: false, name: updatedUser.name, role: updatedUser.role || 'student' }));
      setAuth(updatedUser);
      return { success: true, message: 'Profil lokal berhasil diperbarui!' };
    }

    setLoading(true);
    setError(null);

    try {
      let hashedPassword = '';
      if (newPassword && newPassword.trim()) {
        hashedPassword = await hashPassword(newPassword.trim());
      }

      const response = await fetch(`${API_URL}?action=update_profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          userId: auth.userId,
          name,
          email,
          newPassword: hashedPassword
        })
      });

      const resData = await response.json();
      if (!resData.success && resData.error) {
        throw new Error(resData.error || 'Gagal memperbarui profil');
      }

      const updatedUser = {
        ...auth,
        name: name || auth.name,
        email: email || auth.email
      };

      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify({
        isGuest: false,
        name: updatedUser.name,
        role: updatedUser.role || 'student'
      }));
      setAuth(updatedUser);

      return { success: true, message: resData.message || 'Profil berhasil diperbarui!' };
    } catch (err) {
      console.error('Update profile error:', err);
      const updatedUser = {
        ...auth,
        name: name || auth.name,
        email: email || auth.email
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify({
        isGuest: false,
        name: updatedUser.name,
        role: updatedUser.role || 'student'
      }));
      setAuth(updatedUser);
      return { success: true, message: 'Profil berhasil diperbarui di perangkat ini!' };
    } finally {
      setLoading(false);
    }
  }, [auth]);

  return {
    auth,
    loading,
    error,
    isGuest,
    isStudent,
    isEducator,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    updateUserRole,
    refreshAuth,
    setError
  };
}