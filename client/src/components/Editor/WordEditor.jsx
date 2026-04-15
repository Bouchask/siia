import React, { useState } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { DragHandle } from '@tiptap/extension-drag-handle';
import { SmartImageExtension } from './SmartImageExtension';
import { ImageRowExtension } from './ImageRowExtension';
import { ColumnGroup, Column } from './ColumnExtension';
import ImageModal from './ImageModal';

import { 
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, 
  AlignRight, Image as ImageIcon, Table as TableIcon,
  Columns as ColumnsIcon, Undo, Redo, LayoutGrid
} from 'lucide-react';

const Toolbar = ({ editor }) => {
  if (!editor) return null;

  const handleSmartImageAdd = () => {
    const { state } = editor;
    const { selection } = state;
    let targetPos = -1;

    // 1. Check if current selection is an empty image
    if (selection.node && selection.node.type.name === 'image') {
      if (!selection.node.attrs.src || selection.node.attrs.src === "") {
        targetPos = selection.from;
      }
    }

    // 2. If not, find the first empty image in the doc
    if (targetPos === -1) {
      state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && (!node.attrs.src || node.attrs.src === "")) {
          if (targetPos === -1) targetPos = pos;
          return false;
        }
      });
    }

    if (targetPos !== -1) {
      // Focus the empty image and open modal
      editor.chain().focus().setNodeSelection(targetPos).openImageModal(targetPos).run();
    } else {
      // 3. No empty image found, insert a new one
      editor.chain().focus().insertContent({ type: 'image', attrs: { src: '' } }).run();
      // The new image will be at the current selection
      editor.chain().openImageModal(editor.state.selection.from).run();
    }
  };

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''} title="Bold"><Bold size={16}/></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''} title="Italic"><Italic size={16}/></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''} title="Underline"><UnderlineIcon size={16}/></button>
      </div>

      <div className="toolbar-group">
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''} title="Align Left"><AlignLeft size={16}/></button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''} title="Align Center"><AlignCenter size={16}/></button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''} title="Align Right"><AlignRight size={16}/></button>
      </div>

      <div className="toolbar-group">
        <button onClick={handleSmartImageAdd} title="Add Smart Image"><ImageIcon size={16}/></button>
        <button onClick={() => editor.chain().focus().insertImageRow().run()} title="Insert Image Row (Gallery)"><LayoutGrid size={16}/></button>
        <button onClick={() => editor.chain().focus().insertColumns(2).run()} title="Insert 2 Columns"><ColumnsIcon size={16}/></button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table"><TableIcon size={16}/></button>
      </div>

      <div className="toolbar-group" style={{ marginLeft: 'auto', borderRight: 'none' }}>
        <button onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={16}/></button>
        <button onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={16}/></button>
      </div>
    </div>
  );
};

const WordEditor = ({ value, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePos, setActivePos] = useState(null);

  // Custom Extension to handle Modal trigger from NodeView
  const ModalBridge = Extension.create({
    name: 'modalBridge',
    addCommands() {
      return {
        openImageModal: (pos) => ({ chain }) => {
          setActivePos(pos);
          setModalOpen(true);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        heading: { levels: [1, 2, 3] },
        dropcursor: { color: '#2563eb', width: 2 }
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      SmartImageExtension,
      ImageRowExtension,
      ColumnGroup,
      Column,
      ModalBridge,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
      Placeholder.configure({ placeholder: "Click here to start writing or drag blocks..." }),
      DragHandle.configure({
        render: () => {
          const dom = document.createElement('div');
          dom.className = 'notion-drag-handle';
          dom.innerHTML = '⠿';
          return dom;
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Sync content if it changes from outside
  React.useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      // Only update if it's different to avoid infinite loops
      // TipTap getJSON can be compared if preferred, but HTML is simpler for quick check
      // For JSON we can use: if (JSON.stringify(editor.getJSON()) !== JSON.stringify(value))
      const currentContent = typeof value === 'string' ? value : JSON.stringify(value);
      const editorContent = JSON.stringify(editor.getJSON());
      
      if (typeof value === 'object' && editorContent !== currentContent) {
        editor.commands.setContent(value);
      } else if (typeof value === 'string' && editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  const handleImageConfirm = (url) => {
    if (activePos !== null) {
      editor.chain().focus().setNodeSelection(activePos).updateAttributes('image', { src: url }).run();
    } else {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setModalOpen(false);
    setActivePos(null);
  };

  return (
    <div className="word-editor-container">
      <Toolbar editor={editor} />
      
      <div className="editor-canvas">
        <EditorContent editor={editor} />
      </div>

      <ImageModal 
        isOpen={modalOpen} 
        onClose={() => { setModalOpen(false); setActivePos(null); }} 
        onConfirm={handleImageConfirm} 
      />

      <style>{`
        .word-editor-container { 
          background: white; 
          border-radius: 12px; 
          border: 1px solid #e2e8f0; 
          min-height: 600px; 
          display: flex; 
          flex-direction: column; 
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .editor-toolbar { 
          padding: 8px 16px; 
          border-bottom: 1px solid #f1f5f9; 
          display: flex; 
          gap: 12px; 
          position: sticky; 
          top: 0; 
          background: #fcfcfd; 
          z-index: 50; 
          border-radius: 12px 12px 0 0; 
          align-items: center;
        }
        .toolbar-group { 
          display: flex; 
          gap: 4px; 
          border-right: 1px solid #e2e8f0; 
          padding-right: 12px; 
          align-items: center; 
        }
        .toolbar-group:last-child { border: none; }
        .toolbar-group button { 
          padding: 6px; 
          border-radius: 6px; 
          border: none; 
          background: transparent; 
          color: #64748b; 
          cursor: pointer; 
          transition: all 0.2s; 
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .toolbar-group button:hover { background: #f1f5f9; color: #1e293b; }
        .toolbar-group button.active { background: #eff6ff; color: #2563eb; }
        
        .editor-canvas { 
          padding: 40px 60px; 
          flex: 1; 
          overflow-y: auto;
        }
        .ProseMirror { outline: none; min-height: 500px; }
        .ProseMirror p { margin: 0.75rem 0; color: #334155; line-height: 1.6; font-size: 1.05rem; }
        .ProseMirror h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1.5rem; color: #1e293b; }
        
        .notion-drag-handle { 
          width: 24px; 
          height: 24px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #cbd5e1; 
          cursor: grab; 
          font-size: 20px; 
          transition: all 0.2s; 
          border-radius: 4px;
        }
        .notion-drag-handle:hover { 
          color: #94a3b8; 
          background: #f1f5f9; 
        }

        .editor-column-group {
          display: flex;
          gap: 20px;
          margin: 1.5rem 0;
          align-items: flex-start;
        }
        .editor-column {
          flex: 1;
          border: 1px dashed #e2e8f0;
          border-radius: 8px;
          padding: 15px;
          min-height: 50px;
        }

        .ProseMirror table { 
          border-collapse: collapse; 
          table-layout: fixed; 
          width: 100%; 
          margin: 1.5rem 0; 
          overflow: hidden; 
        }
        .ProseMirror td, .ProseMirror th { 
          border: 1px solid #ced4da; 
          padding: 12px; 
          min-width: 1em; 
          vertical-align: top; 
          box-sizing: border-box; 
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default WordEditor;
