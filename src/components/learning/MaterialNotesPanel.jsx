import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  X, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  Bold, 
  List, 
  Code, 
  Heading3, 
  CheckSquare, 
  Clock,
  Eye,
  PenSquare
} from 'lucide-react';
import { useMaterialNotes } from '../../hooks/useMaterialNotes';
import { ConfirmModal } from '../common/ConfirmModal';

export function MaterialNotesPanel({ 
  contentId, 
  contentTitle = '', 
  batchId = '', 
  batchName = '', 
  moduleId = '', 
  moduleTitle = '', 
  onClose 
}) {
  const { getNote, saveNote, deleteNote } = useMaterialNotes();
  const existingNote = getNote(contentId);

  const [noteText, setNoteText] = useState(existingNote?.content || '');
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [isViewOnly, setIsViewOnly] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const note = getNote(contentId);
    setNoteText(note?.content || '');
    setSaveStatus('saved');
  }, [contentId, getNote]);

  useEffect(() => {
    if (noteText === (existingNote?.content || '')) {
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveNote(contentId, noteText, {
        title: contentTitle,
        batchId,
        batchName,
        moduleId,
        moduleTitle
      });
      setSaveStatus('saved');
    }, 400);

    return () => clearTimeout(timer);
  }, [noteText, contentId, contentTitle, batchId, batchName, moduleId, moduleTitle, existingNote, saveNote]);

  const insertSnippet = (prefix, suffix = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = noteText.substring(start, end);
    const replacement = `${prefix}${selected || 'teks'}${suffix}`;

    const updated = noteText.substring(0, start) + replacement + noteText.substring(end);
    setNoteText(updated);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 50);
  };

  const handleCopy = () => {
    if (!noteText.trim() || !navigator.clipboard) return;
    navigator.clipboard.writeText(noteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!noteText.trim()) return;
    const blob = new Blob([noteText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Catatan - ${contentTitle || 'Materi'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (!noteText.trim()) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteNote(contentId);
    setNoteText('');
    setShowDeleteConfirm(false);
  };

  const renderFormattedNote = (text) => {
    if (!text.trim()) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
          <FileText className="w-8 h-8 text-slate-300" />
          <p className="text-xs font-semibold text-slate-700">Belum ada catatan</p>
          <p className="text-[11px]">Beralih ke mode edit untuk mulai menulis catatan materi.</p>
        </div>
      );
    }

    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBuffer = [];

    const elements = [];

    lines.forEach((line, idx) => {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${idx}`} className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto my-2">
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      const trimmed = line.trim();

      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={idx} className="font-bold text-slate-900 text-sm mt-3 mb-1">
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={idx} className="font-bold text-slate-900 text-base mt-3 mb-1">
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
        return;
      }

      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={idx} className="font-bold text-slate-900 text-lg mt-3 mb-1.5">
            {trimmed.replace(/^#\s+/, '')}
          </h1>
        );
        return;
      }

      if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ')) {
        const isChecked = trimmed.startsWith('- [x] ');
        const itemText = trimmed.replace(/^- \[( |x)\]\s+/, '');
        elements.push(
          <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 my-1">
            <input 
              type="checkbox" 
              checked={isChecked} 
              readOnly 
              className="rounded text-slate-900 focus:ring-0" 
            />
            <span className={isChecked ? 'line-through text-slate-400' : ''}>{itemText}</span>
          </div>
        );
        return;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <li key={idx} className="ml-4 list-disc text-xs text-slate-800 my-0.5">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
        return;
      }

      if (!trimmed) {
        elements.push(<div key={idx} className="h-2" />);
        return;
      }

      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      elements.push(
        <p 
          key={idx} 
          className="text-xs sm:text-sm text-slate-800 leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <pre key="code-final" className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto my-2">
          <code>{codeBuffer.join('\n')}</code>
        </pre>
      );
    }

    return elements;
  };

  const wordCount = noteText.trim() ? noteText.trim().split(/\s+/).length : 0;
  const lastSavedTime = existingNote?.updatedAt
    ? new Date(existingNote.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <aside className="w-80 sm:w-96 lg:w-[420px] rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col overflow-hidden shrink-0 animate-in fade-in slide-in-from-right-3 duration-200">
      
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-sm truncate">Catatan Materi</h2>
              <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-md ${
                saveStatus === 'saving'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              }`}>
                {saveStatus === 'saving' ? 'Menyimpan...' : 'Tersimpan'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {contentTitle || 'Materi Pelajaran'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold mr-1">
            <button
              type="button"
              onClick={() => setIsViewOnly(false)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                !isViewOnly 
                  ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mode Edit"
            >
              <PenSquare className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setIsViewOnly(true)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] ${
                isViewOnly 
                  ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mode Baca (View Only)"
            >
              <Eye className="w-3 h-3" />
              <span>Baca</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            title="Tutup Catatan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-3 py-1.5 bg-white border-b border-slate-100 flex items-center justify-between gap-1 overflow-x-auto">
        {!isViewOnly ? (
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => insertSnippet('**', '**')}
              title="Tebal (Bold)"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => insertSnippet('### ')}
              title="Heading 3"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => insertSnippet('- ')}
              title="Daftar List"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <List className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => insertSnippet('- [ ] ')}
              title="Checklist Tugas"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => insertSnippet('```\n', '\n```')}
              title="Blok Kode"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 py-0.5">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>Mode Baca (Bebas Garis Merah & Kursor)</span>
          </div>
        )}

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!noteText.trim()}
            title="Salin Catatan"
            className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-40 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!noteText.trim()}
            title="Unduh Markdown (.md)"
            className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-40 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={!noteText.trim()}
            title="Hapus Catatan"
            className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-40 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-3.5 bg-slate-50/40 flex flex-col overflow-y-auto">
        {!isViewOnly ? (
          <textarea
            ref={textareaRef}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Tulis ringkasan rumus, poin penting, kode, atau catatan pribadi Anda untuk materi ini..."
            className="flex-1 w-full p-3.5 bg-white border border-slate-200/80 rounded-xl text-xs sm:text-sm font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-400 transition-all resize-none leading-relaxed shadow-2xs"
          />
        ) : (
          <div className="flex-1 w-full p-4 bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-y-auto select-text">
            {renderFormattedNote(noteText)}
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          {lastSavedTime && (
            <>
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Diedit pukul {lastSavedTime}</span>
            </>
          )}
        </span>
        <span className="font-mono font-medium text-slate-500">
          {wordCount} kata • {noteText.length} karakter
        </span>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Catatan Materi"
        message="Apakah Anda yakin ingin menghapus seluruh isi catatan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Catatan"
        cancelText="Batal"
        type="danger"
      />

    </aside>
  );
}
