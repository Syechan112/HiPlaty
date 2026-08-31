import {
  CheckCircle2,
  FileText,
  Users,
  UserPlus,
  Layers
} from 'lucide-react';
import { getCategoryInfo } from '../../../config/contentCategories';

export function StudyRoomContentHeader({
  currentBatch,
  currentModule,
  currentContent,
  isNotesOpen,
  setIsNotesOpen,
  setShowFriendModal,
  setStudyGroupModalBatch,
  setIsSelectingBatch,
  handleMarkComplete,
  isCompleted
}) {
  if (!currentBatch || !currentContent) return null;

  const catInfo = getCategoryInfo(currentBatch.category);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-4 py-3 shadow-[0_2px_8px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:px-6 sm:py-3.5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        {/* Content Information */}
        <div className="min-w-0 flex-1">

          {/* Breadcrumb */}
          <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-slate-400">

            <span className="flex min-w-0 items-center gap-1.5 font-bold text-slate-700">
              <Layers
                className="h-3.5 w-3.5 shrink-0 text-slate-400"
                strokeWidth={2}
              />

              <span className="truncate">
                {currentBatch.batchName}
              </span>
            </span>

            <span className="shrink-0 text-slate-300">
              /
            </span>

            <span className="max-w-[140px] truncate sm:max-w-xs">
              {currentModule?.moduleTitle}
            </span>

            <span className="hidden shrink-0 text-slate-300 sm:inline">
              /
            </span>

            <span
              className={`
                hidden shrink-0
                rounded-md
                border
                px-2 py-0.5
                text-[10px]
                font-bold
                sm:inline-block
                ${catInfo.color}
              `}
            >
              {catInfo.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-1 text-base font-bold tracking-tight text-slate-900 sm:text-lg">
            <span className="block truncate">
              {currentContent.title}
            </span>
          </h1>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">

          {/* Add Friend */}
          <button
            type="button"
            onClick={() => setShowFriendModal(true)}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              border border-slate-200
              bg-white
              text-slate-500
              transition-all duration-150
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-700
              cursor-pointer
            "
            title="Kelola Teman Belajar"
            aria-label="Kelola Teman Belajar"
          >
            <UserPlus
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>

          {/* Study Group */}
          <button
            type="button"
            onClick={() => setStudyGroupModalBatch(currentBatch)}
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              border border-slate-200
              bg-white
              text-slate-500
              transition-all duration-150
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-700
              cursor-pointer
            "
            title="Bagikan Batch ke Grup Belajar"
            aria-label="Bagikan Batch ke Grup Belajar"
          >
            <Users
              className="h-4 w-4"
              strokeWidth={2}
            />
          </button>

          {/* Notes */}
          <button
            type="button"
            onClick={() => setIsNotesOpen(prev => !prev)}
            className={`
              flex h-9 items-center gap-1.5
              rounded-lg
              border
              px-3
              text-[11px]
              font-bold
              transition-all duration-150
              cursor-pointer
              ${
                isNotesOpen
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <FileText
              className="h-3.5 w-3.5"
              strokeWidth={2}
            />

            <span className="hidden sm:inline">
              Catatan
            </span>
          </button>

          {/* Complete */}
          <button
            type="button"
            onClick={() => handleMarkComplete(currentContent.contentId)}
            className={`
              flex h-9 items-center gap-1.5
              rounded-lg
              border
              px-3
              text-[11px]
              font-bold
              transition-all duration-150
              cursor-pointer
              ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800'
              }
            `}
          >
            <CheckCircle2
              className="h-3.5 w-3.5"
              strokeWidth={2}
            />

            <span>
              {isCompleted ? 'Sudah Selesai' : 'Tandai Selesai'}
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}