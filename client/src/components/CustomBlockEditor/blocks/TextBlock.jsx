import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor as useBlockEditor } from '../EditorContext';
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List, AlignLeft } from 'lucide-react';

const TextBlock = ({ block }) => {
  const { updateBlock } = useBlockEditor();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'editor-link'
        }
      }),
      Placeholder.configure({ placeholder: 'Start writing news...' }),
    ],
    content: block.content,
    onUpdate: ({ editor }) => {
      updateBlock(block.id, { content: editor.getHTML() });
    },
  });

  // Sync if block ID changes
  useEffect(() => {
    if (editor && block.content !== editor.getHTML()) {
      editor.commands.setContent(block.content);
    }
  }, [block.id, editor]);

  if (!editor) return null;

  return (
    <div className="text-block-editor">
      {editor.isFocused && (
        <div className="text-floating-toolbar">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}><Bold size={14}/></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}><Italic size={14}/></button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}><UnderlineIcon size={14}/></button>
          <div className="divider" />
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}><List size={14}/></button>
          <button 
            onClick={() => {
              const url = window.prompt('URL:');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }} 
            className={editor.isActive('link') ? 'active' : ''}
          >
            <LinkIcon size={14}/>
          </button>
        </div>
      )}
      
      <EditorContent editor={editor} />

      <style>{`
        .text-block-editor { position: relative; width: 100%; }
        .text-floating-toolbar {
          position: absolute; top: -45px; left: 0;
          background: #1e293b; border-radius: 8px;
          padding: 4px; display: flex; gap: 4px;
          z-index: 50; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .text-floating-toolbar button {
          background: transparent; border: none; color: #94a3b8;
          padding: 6px; border-radius: 4px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .text-floating-toolbar button:hover { background: #334155; color: #fff; }
        .text-floating-toolbar button.active { color: #3b82f6; background: #334155; }
        .text-floating-toolbar .divider { width: 1px; background: #334155; margin: 4px; }
        
        .ProseMirror { outline: none; font-size: 17px; line-height: 1.8; color: #334155; min-height: 24px; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder); float: left; color: #cbd5e1;
          pointer-events: none; height: 0;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default TextBlock;
