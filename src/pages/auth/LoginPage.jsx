import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, History, X } from 'lucide-react';
import loginHeroImg from '../../assets/auth/login.webp';

export function LoginPage() {
  const { login, loading, error, setError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailHistory, setEmailHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Load history email dari localStorage saat pertama kali dimuat
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('login_email_history') || '[]');
    setEmailHistory(history);
  }, []);

  // Menutup dropdown suggestion saat mengklik di luar area input/dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simpan email baru ke riwayat
  const saveEmailToHistory = (emailToSave) => {
    if (!emailToSave) return;
    const filtered = emailHistory.filter((item) => item !== emailToSave);
    const updated = [emailToSave, ...filtered].slice(0, 5); // Simpan maksimal 5 email terakhir
    setEmailHistory(updated);
    localStorage.setItem('login_email_history', JSON.stringify(updated));
  };

  // Hapus satu email dari riwayat
  const removeHistoryItem = (e, emailToRemove) => {
    e.stopPropagation();
    const updated = emailHistory.filter((item) => item !== emailToRemove);
    setEmailHistory(updated);
    localStorage.setItem('login_email_history', JSON.stringify(updated));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await login(formData.email, formData.password);
    if (result) {
      saveEmailToHistory(formData.email);
      window.location.href = '/';
    }
  };

  // Filter suggestion berdasarkan apa yang sedang diketik
  const filteredSuggestions = emailHistory.filter((email) =>
    email.toLowerCase().includes(formData.email.toLowerCase())
  );

  return (
    <div className="min-h-screen h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#FAFAFA] font-sans antialiased text-slate-900 selection:bg-slate-900 selection:text-white">
      <div className="hidden md:flex p-4 sm:p-5 lg:p-6 md:w-5/12 lg:w-1/2 h-full flex-col shrink-0">
        <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white">
          <img
            src={loginHeroImg}
            alt="HiPlaty LMS Login Illustration"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        </div>
      </div>

      <div className="w-full md:w-7/12 lg:w-1/2 h-full overflow-y-auto flex items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16 bg-white">
        <div className="max-w-md w-full my-auto py-6 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Masuk ke Akun
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Akses modul kurikulum, lacak progres harian, dan berdiskusi dengan teman.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-700 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {/* Field Email dengan Custom Autocomplete */}
            <div className="space-y-1.5 relative" ref={dropdownRef}>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setShowSuggestions(true);
                }}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all placeholder:text-slate-400"
              />

              {/* Custom Autocomplete Dropdown Card */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden py-1 transition-all animate-in fade-in-50 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center gap-1.5">
                    <History className="w-3 h-3 text-slate-400" />
                    <span>Riwayat Login</span>
                  </div>
                  <ul className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                    {filteredSuggestions.map((email, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setFormData({ ...formData, email });
                          setShowSuggestions(false);
                        }}
                        className="px-3.5 py-2.5 hover:bg-slate-50 cursor-pointer text-xs text-slate-700 flex items-center justify-between transition-colors group"
                      >
                        <span className="font-medium group-hover:text-slate-900">{email}</span>
                        <button
                          type="button"
                          onClick={(e) => removeHistoryItem(e, email)}
                          className="text-slate-300 hover:text-rose-500 p-0.5 rounded-md hover:bg-rose-50 transition-colors"
                          title="Hapus dari riwayat"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Field Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-xs sm:text-sm transition-colors shadow-xs active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              Belum memiliki akun?{' '}
              <Link to="/register" className="text-slate-900 font-semibold hover:underline">
                Daftar Baru
              </Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}