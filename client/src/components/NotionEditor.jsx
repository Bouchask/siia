import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Underline } from '@tiptap/extension-underline';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import ResizeImage from 'tiptap-extension-resize-image';
import DragHandle from '@tiptap/extension-drag-handle';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight, Type, Image as ImageIcon,
  Undo, Redo, Palette, List, ListOrdered, Table as TableIcon
} from 'lucide-react';

// --- GOOGLE DRIVE CONVERTER UTILITY ---
const formatDriveUrl = (url) => {
  if (!url) return "";
  // Extract ID from /d/ID/view or id=ID
  const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
};

const Toolbar = ({ editor }) => {
  if (!editor) return null;

  const addDriveImage = () => {
    const url = window.prompt('Paste Google Drive Share Link:');
    if (url) {
      const directLink = formatDriveUrl(url);
      editor.chain().focus().setImage({ src: directLink }).run();
    }
  };

  return (
    <div className="notion-toolbar">
      <div className="t-group">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}><Bold size={16}/></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}><Italic size={16}/></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}><UnderlineIcon size={16}/></button>
      </div>

      <div className="t-group">
        <select onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()} className="font-select">
          <option value="Inter">Standard</option>
          <option value="Georgia">Serif</option>
          <option value="Courier New">Mono</option>
          <option value="Arial">Sans</option>
        </select>
        <input 
          type="color" 
          onInput={e => editor.chain().focus().setColor(e.target.value).run()} 
          className="color-picker"
        />
      </div>

      <div className="t-group">
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}><AlignLeft size={16}/></button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}><AlignCenter size={16}/></button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}><AlignRight size={16}/></button>
      </div>

      <div className="t-group">
        <button onClick={addDriveImage}><ImageIcon size={16}/></button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16}/></button>
      </div>

      <div className="t-group" style={{ marginLeft: 'auto' }}>
        <button onClick={() => editor.chain().focus().undo().run()}><Undo size={16}/></button>
        <button onClick={() => editor.chain().focus().redo().run()}><Redo size={16}/></button>
      </div>
    </div>
  );
};

const NotionEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        dropcursor: {
          color: '#2563eb',
          width: 2,
        },
      }),
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Image,
      ResizeImage,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Placeholder.configure({
        placeholder: 'Type "/" for commands or just start writing...',
      }),
      DragHandle.configure({
        render: () => {
          const element = document.createElement('div');
          element.className = 'notion-drag-handle';
          element.innerHTML = `<svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2ZM4 9C4 10.1046 3.10457 11 2 11C0.89543 11 0 10.1046 0 9C0 7.89543 0.89543 7 2 7C3.10457 7 4 7.89543 4 9ZM4 16C4 17.1046 3.10457 18 2 18C0.89543 18 0 17.1046 0 16C0 14.8954 0.89543 14 2 14C3.10457 14 4 14.8954 4 16ZM12 2C12 3.10457 11.1046 4 10 4C8.89543 4 8 3.10457 8 2C8 0.89543 8.89543 0 10 0C11.1046 0 12 0.89543 12 2ZM12 9C12 10.1046 11.1046 11 10 11C8.89543 11 8 10.1046 8 9C8 7.89543 8.89543 7 10 7C11.1046 7 12 7.89543 12 9ZM12 16C12 17.1046 11.1046 18 10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16Z" fill="#CBD5E1"/></svg>`;
          return element;
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Return JSON to the parent for structured storage
      onChange(editor.getJSON());
    },
  });

  return (
    <div className="notion-wrapper">
      <Toolbar editor={editor} />
      <div className="notion-body">
        <EditorContent editor={editor} className="notion-prose" />
      </div>

      <style>{`
        .notion-wrapper {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          min-height: 500px;
          position: relative;
        }
        .notion-toolbar {
          padding: 8px 16px;
          border-bottom: 1px solid #f1f5f9;
          background: #fcfcfd;
          border-radius: 12px 12px 0 0;
          display: flex;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .t-group {
          display: flex;
          gap: 4px;
          align-items: center;
          border-right: 1px solid #f1f5f9;
          padding-right: 12px;
        }
        .t-group:last-child { border: none; }
        .t-group button {
          padding: 6px;
          border-radius: 4px;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
        }
        .t-group button:hover { background: #f1f5f9; }
        .t-group button.active { background: #eff6ff; color: #2563eb; }
        .font-select {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 4px;
          font-size: 12px;
        }
        .color-picker {
          width: 24px;
          height: 24px;
          border: none;
          background: none;
          cursor: pointer;
        }
        
        .notion-body {
          padding: 40px 60px;
        }
        .notion-prose {
          outline: none;
        }
        .ProseMirror p { margin-bottom: 0.5em; }
        
        /* NOTION DRAG HANDLE CSS */
        .notion-drag-handle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 24px;
          cursor: grab;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .notion-drag-handle:hover {
          background: #f1f5f9;
        }
        .notion-drag-handle:active {
          cursor: grabbing;
        }

        /* Resizable Image */
        .resizable-image {
          display: inline-block;
          max-width: 100%;
          position: relative;
        }
        .resizable-image img {
          width: 100%;
          border-radius: 8px;
        }

        /* Tables */
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        .ProseMirror td, .ProseMirror th {
          border: 1px solid #ced4da;
          padding: 10px;
          min-width: 1em;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default NotionEditor;
