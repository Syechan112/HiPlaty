import { useState, useRef, useEffect } from 'react';
import { FORUM_TAGS } from '../../constants/forumConstants';
import { ChevronDown, Check, Filter, Layers, Sparkles } from 'lucide-react';

const TAG_COLOR_MAP = {
  all: { dot: 'bg-slate-700', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
  qna: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  material: { dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  tech: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  tips: { dot: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  general: { dot: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
};

export function ForumTagsFilter({
  selectedTag,
  setSelectedTag,
  threadsCountByTag = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeTagObj = FORUM_TAGS.find(t => t.id === selectedTag) || FORUM_TAGS[0];
  const activeCount = threadsCountByTag[activeTagObj.id] ?? 0;
  const activeColors = TAG_COLOR_MAP[activeTagObj.id] || TAG_COLOR_MAP.all;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalAllThreads = Object.values(threadsCountByTag).reduce((sum, c) => sum + Number(c || 0), 0);

  return (
    <div className="space-y-3">
      {/* 1. Mobile & Tablet Toggle Dropdown Selector */}
      <div className="relative block sm:hidden" ref={dropdownRef}>
        <div className="flex items-center justify-between gap-2 mb-1.5 px-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Kategori Diskusi</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {activeCount} Topik
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 bg-white border rounded-2xl shadow-2xs transition-all cursor-pointer select-none ${
            isOpen 
              ? 'border-slate-900 ring-2 ring-slate-900/5' 
              : 'border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-full ${activeColors.dot} shrink-0 animate-pulse`} />
            <span className="font-bold text-xs text-slate-900 truncate">
              {activeTagObj.label}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeCount > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border font-mono ${activeColors.bg} ${activeColors.text} ${activeColors.border}`}>
                {activeCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-slate-900' : ''
              }`}
            />
          </div>
        </button>

        {/* Dropdown Menu Popup */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-30 p-1.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70 rounded-xl mb-1 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Filter Berdasarkan Topik
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                {FORUM_TAGS.length} Kategori
              </span>
            </div>

            <div className="space-y-0.5 max-h-60 overflow-y-auto">
              {FORUM_TAGS.map((tag) => {
                const isSelected = selectedTag === tag.id;
                const count = threadsCountByTag[tag.id] ?? 0;
                const colors = TAG_COLOR_MAP[tag.id] || TAG_COLOR_MAP.all;

                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedTag(tag.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs font-bold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : colors.dot} shrink-0`} />
                      <span className="truncate">{tag.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {count > 0 && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                          isSelected ? 'bg-white/20 text-white font-bold' : `${colors.bg} ${colors.text} border ${colors.border}`
                        }`}>
                          {count}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Desktop Horizontal Pills (sm:flex) */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {FORUM_TAGS.map((tag) => {
          const isSelected = selectedTag === tag.id;
          const count = threadsCountByTag[tag.id] ?? 0;
          const colors = TAG_COLOR_MAP[tag.id] || TAG_COLOR_MAP.all;

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : colors.dot}`} />
              <span>{tag.label}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                  isSelected ? 'bg-white/20 text-white' : `${colors.bg} ${colors.text} border ${colors.border}`
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
