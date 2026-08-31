import { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Unlink, 
  Undo, 
  Redo, 
  RemoveFormatting, 
  Minus,
  Sparkles
} from 'lucide-react';

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Tuliskan materi pembelajaran terstruktur di sini...' 
}) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({});

  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (html === '<p><br></p>' || html === '<br>' || html === '<div><br></div>') {
        onChange('');
      } else {
        onChange(html);
      }
    }
  };

  const checkActiveFormats = () => {
    const selection = window.getSelection();
    let isH1 = false;
    let isH2 = false;
    let isH3 = false;
    let isP = false;

    if (selection && selection.anchorNode && editorRef.current) {
      let node = selection.anchorNode;
      while (node && node !== editorRef.current) {
        if (node.nodeName === 'H1') isH1 = true;
        if (node.nodeName === 'H2') isH2 = true;
        if (node.nodeName === 'H3') isH3 = true;
        if (node.nodeName === 'P') isP = true;
        node = node.parentNode;
      }
    }

    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
      h1: isH1,
      h2: isH2,
      h3: isH3,
      p: isP
    });
  };

  const format = (command, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
    checkActiveFormats();
  };

  const handleFormatBlock = (tag) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    const isCurrentlyActive = activeFormats[tag];
    const targetTag = isCurrentlyActive ? 'p' : tag;
    const formatTag = targetTag === 'p' ? '<p>' : `<${targetTag}>`;

    try {
      document.execCommand('formatBlock', false, formatTag);
    } catch {
      document.execCommand('formatBlock', false, targetTag);
    }

    handleInput();
    checkActiveFormats();
  };

  const handleInsertLink = () => {
    const url = prompt('Masukkan URL tautan (contoh: https://example.com):');
    if (url) {
      format('createLink', url);
    }
  };

  const handleInsertCodeBlock = () => {
    const selection = window.getSelection();
    const text = selection?.toString() || 'console.log("Halo Dunia!");';
    const codeHtml = `<pre class="bg-slate-900 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto my-3 border border-slate-800"><code>${text}</code></pre><p><br></p>`;
    document.execCommand('insertHTML', false, codeHtml);
    handleInput();
  };

  const handleInsertCallout = () => {
    const calloutHtml = `
      <div class="my-4 p-4 rounded-2xl border border-blue-200 bg-blue-50/70 text-slate-800">
        <strong class="font-bold text-slate-900 block mb-1 text-xs">💡 Catatan Penting:</strong>
        <p class="text-xs leading-relaxed text-slate-600">Tuliskan penjelasan tambahan atau poin kunci materi di sini...</p>
      </div><p><br></p>
    `;
    document.execCommand('insertHTML', false, calloutHtml);
    handleInput();
  };

  const handleInsertHorizontalRule = () => {
    document.execCommand('insertHorizontalRule', false, null);
    handleInput();
  };

  return (
    <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400 transition-all">
      {/* Editor Scoped Typography Styling */}
      <style>{`
        .rich-editor-canvas h1 {
          font-size: 1.875rem !important;
          line-height: 2.25rem !important;
          font-weight: 800 !important;
          color: #0f172a !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.75rem !important;
          letter-spacing: -0.025em !important;
        }
        .rich-editor-canvas h2 {
          font-size: 1.5rem !important;
          line-height: 2rem !important;
          font-weight: 700 !important;
          color: #1e293b !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
          letter-spacing: -0.02em !important;
        }
        .rich-editor-canvas h3 {
          font-size: 1.25rem !important;
          line-height: 1.75rem !important;
          font-weight: 700 !important;
          color: #334155 !important;
          margin-top: 0.875rem !important;
          margin-bottom: 0.5rem !important;
        }
        .rich-editor-canvas p {
          font-size: 0.9375rem !important;
          line-height: 1.625 !important;
          color: #334155 !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        .rich-editor-canvas ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin: 0.5rem 0 !important;
        }
        .rich-editor-canvas ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin: 0.5rem 0 !important;
        }
        .rich-editor-canvas blockquote {
          border-left: 4px solid #0f172a !important;
          padding-left: 1rem !important;
          font-style: italic !important;
          color: #475569 !important;
          margin: 0.75rem 0 !important;
          background: #f8fafc !important;
          padding-top: 0.5rem !important;
          padding-bottom: 0.5rem !important;
          border-radius: 0 0.5rem 0.5rem 0 !important;
        }
        .rich-editor-canvas pre {
          background-color: #0f172a !important;
          color: #34d399 !important;
          padding: 1rem !important;
          border-radius: 0.75rem !important;
          font-family: monospace !important;
          font-size: 0.8125rem !important;
          overflow-x: auto !important;
          margin: 0.75rem 0 !important;
        }
        .rich-editor-canvas a {
          color: #2563eb !important;
          text-decoration: underline !important;
          font-weight: 600 !important;
        }
      `}</style>

      {/* Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200/80 p-2.5 flex flex-wrap items-center gap-1.5 text-slate-700 select-none">
        
        {/* Headings Group (H1, H2, H3, P) */}
        <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleFormatBlock('h1')}
            title="Judul Utama Besar (H1)"
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeFormats.h1 ? 'bg-slate-900 text-white shadow-2xs' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => handleFormatBlock('h2')}
            title="Sub Judul Sedang (H2)"
            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              activeFormats.h2 ? 'bg-slate-900 text-white shadow-2xs' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => handleFormatBlock('h3')}
            title="Sub Topik Kecil (H3)"
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFormats.h3 ? 'bg-slate-900 text-white shadow-2xs' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => handleFormatBlock('p')}
            title="Paragraf Normal (P)"
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeFormats.p ? 'bg-slate-900 text-white shadow-2xs' : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            P
          </button>
        </div>

        {/* Inline Formatting */}
        <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => format('bold')}
            title="Tebal (Ctrl+B)"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFormats.bold ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => format('italic')}
            title="Miring (Ctrl+I)"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFormats.italic ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => format('underline')}
            title="Garis Bawah (Ctrl+U)"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFormats.underline ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => format('strikeThrough')}
            title="Coret"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFormats.strikeThrough ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Extras */}
        <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => format('insertUnorderedList')}
            title="Daftar Bullet"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFormats.insertUnorderedList ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => format('insertOrderedList')}
            title="Daftar Angka"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeFormats.insertOrderedList ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleFormatBlock('blockquote')}
            title="Kutipan / Blockquote"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertCodeBlock}
            title="Blok Kode"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertCallout}
            title="Kotak Catatan / Callout"
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertHorizontalRule}
            title="Garis Pemisah"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Links & Clear */}
        <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={handleInsertLink}
            title="Sisipkan Link"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => format('unlink')}
            title="Hapus Link"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
          >
            <Unlink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => format('removeFormat')}
            title="Bersihkan Format"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors cursor-pointer"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="ml-auto flex items-center bg-white border border-slate-200/80 rounded-xl p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => format('undo')}
            title="Undo (Ctrl+Z)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => format('redo')}
            title="Redo (Ctrl+Y)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WYSIWYG Editable Canvas with Scoped Heading Typography */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={checkActiveFormats}
        onMouseUp={checkActiveFormats}
        data-placeholder={placeholder}
        className="rich-editor-canvas p-6 min-h-[340px] max-h-[650px] overflow-y-auto focus:outline-none text-slate-800 leading-relaxed empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none selection:bg-slate-900 selection:text-white"
      />
    </div>
  );
}
