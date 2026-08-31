import { createPortal } from 'react-dom';
import { AlertTriangle, Info, Trash2, LogOut, X } from 'lucide-react';

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  type = 'danger', // 'danger' | 'warning' | 'info' | 'logout'
  icon: CustomIcon = null,
  loading = false
}) {
  if (!isOpen || typeof document === 'undefined') return null;

  const getIcon = () => {
    if (CustomIcon) return <CustomIcon className="w-5 h-5" />;
    switch (type) {
      case 'danger':
        return <Trash2 className="w-5 h-5 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'logout':
        return <LogOut className="w-5 h-5 text-rose-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-700" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'danger':
      case 'logout':
        return 'bg-rose-50 border-rose-200/80 text-rose-600';
      case 'warning':
        return 'bg-amber-50 border-amber-200/80 text-amber-600';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  const getConfirmBtnClass = () => {
    switch (type) {
      case 'danger':
      case 'logout':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs';
      default:
        return 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs';
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div 
        className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-150 space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${getIconBg()}`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {title}
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Pemberitahuan Sistem
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {message}
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
          {cancelText && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${getConfirmBtnClass()} ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
