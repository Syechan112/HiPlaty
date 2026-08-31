import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export function CustomSelectDropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih...',
  icon: Icon = null,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center justify-between gap-2.5
          px-3.5 py-1.5
          bg-slate-50 hover:bg-slate-100/90
          border border-slate-200
          rounded-xl
          text-xs font-bold text-slate-700
          transition-all duration-150
          cursor-pointer
          shadow-2xs
          ${isOpen ? 'ring-2 ring-slate-900/10 border-slate-400 bg-white' : ''}
        `}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          <span className="whitespace-nowrap font-bold text-slate-800">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold border shrink-0 ${selectedOption.badgeColor || 'bg-slate-100 text-slate-600'}`}>
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-slate-800' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 min-w-[210px] sm:min-w-[240px] max-h-64 overflow-y-auto rounded-2xl bg-white border border-slate-200/90 shadow-2xl z-50 p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`
                  w-full flex items-center justify-between gap-2.5
                  px-3 py-2
                  rounded-xl
                  text-left text-xs font-semibold
                  transition-all duration-150
                  cursor-pointer
                  ${
                    isSelected
                      ? 'bg-slate-900 text-white font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="truncate">{opt.label}</span>
                  {opt.badge && (
                    <span
                      className={`
                        px-1.5 py-0.2 rounded text-[9px] font-bold border shrink-0
                        ${isSelected ? 'bg-slate-800 text-slate-200 border-slate-700' : (opt.badgeColor || 'bg-slate-100 text-slate-600')}
                      `}
                    >
                      {opt.badge}
                    </span>
                  )}
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
