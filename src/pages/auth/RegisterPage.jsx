import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import registerHeroImg from '../../assets/auth/register.webp';

export function RegisterPage() {
  const { register, loading, error, setError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (result) {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen h-screen w-full flex flex-col md:flex-row overflow-hidden bg-[#FAFAFA] font-sans antialiased text-slate-900 selection:bg-slate-900 selection:text-white">
      <div className="hidden md:flex p-4 sm:p-5 lg:p-6 md:w-5/12 lg:w-1/2 h-full flex-col shrink-0">
        <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white">
          <img
            src={registerHeroImg}
            alt="HiPlaty LMS Register Illustration"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        </div>
      </div>

      <div className="w-full md:w-7/12 lg:w-1/2 h-full overflow-y-auto flex items-center justify-center p-6 sm:p-10 md:p-12 lg:p-16 bg-white">
        <div className="max-w-md w-full my-auto py-4 space-y-4">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Buat Akun Baru
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Bergabung dengan platform belajar terstruktur, simpan progres, dan raih streak belajar harian.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-rose-700 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama Anda"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2 pr-11 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all placeholder:text-slate-400"
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

            <div className="space-y-1 pt-0.5">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Pilih Role Akun
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <label className={`cursor-pointer px-3.5 py-2 rounded-xl border flex items-center gap-2 transition-all ${
                  formData.role === 'student'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="hidden"
                  />
                  <div>
                    <p className="text-xs font-bold">Student</p>
                    <p className="text-[10px] text-slate-400">Belajar Kursus</p>
                  </div>
                </label>

                <label className={`cursor-pointer px-3.5 py-2 rounded-xl border flex items-center gap-2 transition-all ${
                  formData.role === 'educator'
                    ? 'border-slate-900 bg-slate-50 text-slate-900 font-semibold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="educator"
                    checked={formData.role === 'educator'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="hidden"
                  />
                  <div>
                    <p className="text-xs font-bold">Educator</p>
                    <p className="text-[10px] text-slate-400">Kelola Materi</p>
                  </div>
                </label>
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
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-slate-900 font-semibold hover:underline">
                Masuk
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
