import React from 'react';
import { useEditor } from '../EditorContext';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import TableBlock from './TableBlock';
import { Type, Image as ImageIcon, Table as TableIcon, Settings2 } from 'lucide-react';

const RowBlock = ({ block }) => {
  const { updateBlock } = useEditor();

  const handleChildTypeChange = (childId, newType) => {
    const newChildren = block.children.map(child => {
      if (child.id === childId) {
        // Initialize default data based on new type
        const base = { ...child, type: newType };
        if (newType === 'text') base.content = '';
        if (newType === 'image') { base.src = ''; base.width = '100%'; }
        if (newType === 'table') base.data = [['', ''], ['', '']];
        return base;
      }
      return child;
    });
    updateBlock(block.id, { children: newChildren });
  };

  const renderChild = (child) => {
    // Note: We don't pass onChange here because blocks usually use updateBlock from context internally
    switch (child.type) {
      case 'text': return <TextBlock block={child} />;
      case 'image': return <ImageBlock block={child} />;
      case 'table': return <TableBlock block={child} />;
      default: return <div className="placeholder-content">Empty Column</div>;
    }
  };

  return (
    <div className="row-block-container">
      <div className="row-grid">
        {block.children && block.children.map((child) => (
          <div key={child.id} className="column-wrapper">
            <div className="column-controls">
              <div className="type-picker">
                <button 
                  onClick={() => handleChildTypeChange(child.id, 'text')}
                  className={child.type === 'text' ? 'active' : ''}
                  title="Text Mode"
                >
                  <Type size={12} />
                </button>
                <button 
                  onClick={() => handleChildTypeChange(child.id, 'image')}
                  className={child.type === 'image' ? 'active' : ''}
                  title="Image Mode"
                >
                  <ImageIcon size={12} />
                </button>
                <button 
                  onClick={() => handleChildTypeChange(child.id, 'table')}
                  className={child.type === 'table' ? 'active' : ''}
                  title="Table Mode"
                >
                  <TableIcon size={12} />
                </button>
              </div>
            </div>
            <div className="column-content">
              {renderChild(child)}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .row-block-container {
          margin: 10px 0;
          padding: 20px;
          background: #fcfcfd;
          border: 1px dashed #e2e8f0;
          border-radius: 16px;
        }
        .row-grid {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }
        .column-wrapper {
          flex: 1;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }
        .column-controls {
          display: flex;
          justify-content: flex-end;
          opacity: 0.3;
          transition: opacity 0.2s;
        }
        .column-wrapper:hover .column-controls {
          opacity: 1;
        }
        .type-picker {
          display: flex;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 2px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .type-picker button {
          padding: 4px 8px;
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .type-picker button:hover {
          background: #f1f5f9;
          color: #475569;
        }
        .type-picker button.active {
          background: #eff6ff;
          color: #3b82f6;
        }
        .column-content {
          background: #fff;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
          min-height: 60px;
        }
        .placeholder-content {
          color: #cbd5e1;
          font-size: 12px;
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default RowBlock;
