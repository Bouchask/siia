import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Placeholder } from '@tiptap/extension-placeholder';
import ResizeImage from 'tiptap-extension-resize-image';
import { 
  Bold, Italic, Link as LinkIcon, List, ListOrdered, 
  Image as ImageIcon, Table as TableIcon, AlignLeft, 
  AlignCenter, AlignRight, Type, Undo, Redo, Columns as ColumnsIcon
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('URL Image (Direct Drive Link):');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><Bold size={16}/></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><Italic size={16}/></button>
        <button onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}><LinkIcon size={16}/></button>
      </div>

      <div className="toolbar-group">
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}><AlignLeft size={16}/></button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}><AlignCenter size={16}/></button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}><AlignRight size={16}/></button>
      </div>

      <div className="toolbar-group">
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}><List size={16}/></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}><ListOrdered size={16}/></button>
      </div>

      <div className="toolbar-group">
        <button onClick={addImage}><ImageIcon size={16}/></button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16}/></button>
      </div>

      <div className="toolbar-group">
        <button onClick={() => editor.chain().focus().undo().run()}><Undo size={16}/></button>
        <button onClick={() => editor.chain().focus().redo().run()}><Redo size={16}/></button>
      </div>
    </div>
  );
};

const AdvancedEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizeImage.configure({
        HTMLAttributes: {
          class: 'resizable-image',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: 'Design your masterpiece...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="advanced-tiptap-wrapper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="tiptap-content" />
      
      <style>{`
        .advanced-tiptap-wrapper {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          overflow: hidden;
        }
        .editor-toolbar {
          padding: 8px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .toolbar-group {
          display: flex;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 2px;
        }
        .toolbar-group button {
          padding: 6px;
          border: none;
          background: transparent;
          border-radius: 4px;
          cursor: pointer;
          color: #64748b;
        }
        .toolbar-group button:hover {
          background: #f1f5f9;
        }
        .toolbar-group button.is-active {
          background: #eff6ff;
          color: #2563eb;
        }
        .tiptap-content {
          padding: 30px;
          min-height: 500px;
        }
        .ProseMirror {
          outline: none;
          min-height: 500px;
        }
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }
        .ProseMirror td, .ProseMirror th {
          min-width: 1em;
          border: 1px solid #ced4da;
          padding: 8px 12px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        /* Resizable Image Styling */
        .resizable-image {
          display: inline-block;
          line-height: 0;
          position: relative;
          max-width: 100%;
        }
        .resizable-image img {
          display: block;
          width: 100%;
          height: auto;
        }
        /* Column System using Float/Flex logic in the HTML */
        .column-grid {
          display: flex;
          gap: 20px;
          margin: 20px 0;
        }
        .column-grid > div {
          flex: 1;
        }
      `}</style>
    </div>
  );
};

export default AdvancedEditor;
