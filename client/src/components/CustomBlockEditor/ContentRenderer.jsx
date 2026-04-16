import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';

const TipTapStaticRenderer = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
    ],
    content: content,
    editable: false,
  });

  return <EditorContent editor={editor} />;
};

const BlockRenderer = ({ block }) => {
  if (!block) return null;

  switch (block.type) {
    case 'row':
      return (
        <div className="siia-row" style={{ 
          display: 'flex', 
          gap: '32px', 
          alignItems: 'flex-start', 
          margin: '32px 0',
          width: '100%',
          flexWrap: 'wrap'
        }}>
          {block.children?.map((child) => (
            <div key={child.id} className="siia-col" style={{ 
              flex: 1, 
              minWidth: '300px',
              maxWidth: '100%'
            }}>
              <BlockRenderer block={child} />
            </div>
          ))}
        </div>
      );

    case 'text':
      return (
        <div 
          className="siia-text-block"
          style={{ 
            lineHeight: '1.8', 
            fontSize: '17px', 
            color: '#334155',
            marginBottom: '20px',
            wordBreak: 'break-word'
          }}
          dangerouslySetInnerHTML={{ __html: block.content || '' }} 
        />
      );
    
    case 'tiptap':
      return <TipTapStaticRenderer content={block.content} />;

    case 'image':
      return (
        <div className="siia-image-block" style={{ margin: '32px 0', textAlign: 'center' }}>
          <img 
            src={block.src} 
            alt="Announcement visual"
            style={{ 
              width: block.width ? (typeof block.width === 'number' ? `${block.width}px` : block.width) : '100%', 
              height: 'auto',
              maxWidth: '100%',
              borderRadius: '16px',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
            }} 
          />
        </div>
      );

    case 'table':
      return (
        <div className="siia-table-wrapper" style={{ overflowX: 'auto', margin: '32px 0', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <tbody>
              {block.data?.map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {row.map((cell, cIdx) => (
                    <td 
                      key={cIdx} 
                      style={{ 
                        borderRight: '1px solid #f1f5f9', 
                        padding: '16px 20px', 
                        fontSize: '15px',
                        color: '#475569'
                      }}
                      dangerouslySetInnerHTML={{ __html: cell || '' }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
};

const ContentRenderer = ({ blocks }) => {
  if (!Array.isArray(blocks)) return null;

  return (
    <div className="siia-content-renderer" style={{ width: '100%' }}>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};

export default ContentRenderer;
