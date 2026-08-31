import logoImg from '../../assets/logo/logo.webp';

export function PageLoader({ message = 'Memuat halaman pembelajaran...' }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] font-sans antialiased text-slate-900 selection:bg-slate-900 selection:text-white px-4">
      <div className="flex flex-col items-center space-y-4 text-center max-w-xs animate-in fade-in zoom-in-95 duration-200">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-2.5">
            <img 
              src={logoImg} 
              alt="LMS Logo" 
              className="w-full h-full object-contain animate-pulse" 
            />
          </div>
          <div className="absolute -inset-1.5 rounded-2xl border-2 border-slate-900/20 border-t-slate-900 animate-spin pointer-events-none" />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-900 tracking-tight">
            {message}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Sinkronisasi sistem & aset aplikasi
          </p>
        </div>
      </div>
    </div>
  );
}
