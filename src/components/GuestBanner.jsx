import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function GuestBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-100/80 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-xs sm:text-sm">Anda saat ini menggunakan Akun Tamu</p>
            <p className="text-xs text-slate-500">
              Atur nama & profil Anda di menu Pengaturan agar progres belajar lebih personal.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/settings"
            className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Atur Profil
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-amber-100/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}