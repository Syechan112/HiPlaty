import { FORUM_TAGS } from '../../constants/forumConstants';

export function ForumTagsFilter({
  selectedTag,
  setSelectedTag,
  threadsCountByTag = {}
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {FORUM_TAGS.map((tag) => {
        const isSelected = selectedTag === tag.id;
        const count = threadsCountByTag[tag.id] ?? 0;

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => setSelectedTag(tag.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-600'
            }`}
          >
            <span>{tag.label}</span>
            {count > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
