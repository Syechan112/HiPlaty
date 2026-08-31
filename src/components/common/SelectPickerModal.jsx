import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, X } from 'lucide-react';

export function SelectPickerModal({
  label,
  value,
  onChange,
  options = [],
  modalTitle = 'Pilih Opsi',
  modalSubtitle = 'Silakan tentukan salah satu opsi di bawah ini:',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  const modalContent = isOpen && typeof document !== 'undefined' ? (
    <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div 
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xl max-w-sm sm:max-w-md w-full animate-in zoom-in-95 duration-150 space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              {modalTitle}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {modalSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-0.5">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            const Icon = opt.icon;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full p-3 rounded-xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {Icon && (
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {opt.label}
                      </p>
                      {opt.badge && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {opt.desc && (
                      <p className={`text-[11px] mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {opt.desc}
                      </p>
                    )}
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white text-slate-900' : 'border border-slate-300'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const SelectedIcon = selectedOption?.icon;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="font-semibold text-slate-700 block text-xs">{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white hover:bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 flex items-center justify-between gap-2 transition-all cursor-pointer shadow-2xs"
      >
        <div className="flex items-center gap-2 min-w-0">
          {SelectedIcon && <SelectedIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span className="font-semibold text-slate-800 truncate">
            {selectedOption?.label || 'Pilih Opsi'}
          </span>
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {modalContent && createPortal(modalContent, document.body)}
    </div>
  );
}
