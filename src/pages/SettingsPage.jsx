import { useState, useEffect } from 'react';
import { useLmsSync } from '../hooks/useLmsSync';
import { useLmsProgress } from '../hooks/useLmsProgress';
import { useAuth } from '../hooks/useAuth';
import { TopNav } from '../components/TopNav';
import { Sidebar } from '../components/Sidebar';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ProfileSettingsCard } from '../components/settings/ProfileSettingsCard';
import { SystemCacheSettingsCard } from '../components/settings/SystemCacheSettingsCard';
import { AlertCircle, CheckCircle2, Settings } from 'lucide-react';

export function SettingsPage() {
  const { clearCache } = useLmsSync();
  const { resetProgress } = useLmsProgress();
  const { auth, updateProfile } = useAuth();

  const [name, setName] = useState(auth?.name || '');
  const [email, setEmail] = useState(auth?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (auth) {
      setName(auth.name || '');
      setEmail(auth.email || '');
    }
  }, [auth]);

  const handleCopyId = () => {
    if (auth?.userId && navigator.clipboard) {
      navigator.clipboard.writeText(auth.userId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Nama tampilan tidak boleh kosong.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Alamat email tidak boleh kosong.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setErrorMessage('Password baru minimal harus 6 karakter.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('Konfirmasi password tidak cocok dengan password baru.');
        return;
      }
    }

    setSaving(true);
    const result = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      newPassword: newPassword.trim()
    });
    setSaving(false);

    if (result.success) {
      setSuccessMessage(result.message || 'Profil berhasil diperbarui!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(result.message || 'Gagal memperbarui profil.');
    }
  };

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    type: 'danger',
    onConfirm: () => {}
  });

  const handleClearCache = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Bersihkan Cache Materi',
      message: 'Apakah Anda yakin ingin membersihkan seluruh cache materi lokal? Data kurikulum terbaru akan diunduh kembali secara otomatis.',
      confirmText: 'Bersihkan Cache',
      type: 'warning',
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        clearCache();
        setSuccessMessage('Cache materi berhasil dibersihkan.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    });
  };

  const handleResetProgress = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Progres Belajar',
      message: 'PERINGATAN: Seluruh status ketuntasan materi Anda akan direset dari awal. Tindakan ini tidak dapat dibatalkan. Lanjutkan?',
      confirmText: 'Reset Semua Progres',
      type: 'danger',
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        resetProgress();
        setSuccessMessage('Seluruh progres belajar berhasil direset.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10">
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Akun & Sistem</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Pengaturan Pengguna & Cache
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Kelola profil akun Anda, ganti password, dan reset data penyimpanan lokal.
              </p>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-700 flex items-center gap-3 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 flex items-center gap-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Profile Settings Card */}
            <ProfileSettingsCard
              auth={auth}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleSave={handleSave}
              saving={saving}
              copiedId={copiedId}
              handleCopyId={handleCopyId}
            />

            {/* Cache and Data Reset Card */}
            <SystemCacheSettingsCard
              handleClearCache={handleClearCache}
              handleResetProgress={handleResetProgress}
            />

          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />
    </div>
  );
}