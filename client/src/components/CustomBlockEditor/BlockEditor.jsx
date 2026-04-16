import React, { useState } from 'react';
import { useEditor } from './EditorContext';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import RowBlock from './blocks/RowBlock';
import TableBlock from './blocks/TableBlock';
import { generateId } from './utils';
import { 
  Plus, GripVertical, Trash2, Type, 
  Image as ImageIcon, Layout, Table as TableIcon 
} from 'lucide-react';

const BlockContainer = ({ block, index }) => {
  const { removeBlock, moveBlock } = useEditor();
  const [isHovered, setIsHovered] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (dragIndex !== index && !isNaN(dragIndex)) {
      moveBlock(dragIndex, index);
    }
  };

  const renderContent = () => {
    switch (block.type) {
      case 'text': return <TextBlock block={block} />;
      case 'image': return <ImageBlock block={block} />;
      case 'row': return <RowBlock block={block} />;
      case 'table': return <TableBlock block={block} />;
      default: return <div style={{ color: '#ef4444' }}>Unknown block format.</div>;
    }
  };

  return (
    <div 
      className="block-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        display: 'flex', gap: '8px', padding: '12px 0',
        transition: 'all 0.2s', position: 'relative',
        borderLeft: isHovered ? '2px solid #3b82f6' : '2px solid transparent',
        paddingLeft: '12px', margin: '4px 0'
      }}
    >
      <div className="block-side-actions" style={{ 
        opacity: isHovered ? 1 : 0, transition: '0.2s',
        display: 'flex', flexDirection: 'column', gap: '4px'
      }}>
        <div className="drag-handle" style={{ cursor: 'grab', color: '#cbd5e1' }}><GripVertical size={16}/></div>
        <button onClick={() => removeBlock(block.id)} className="delete-block-btn"><Trash2 size={14}/></button>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {renderContent()}
      </div>
    </div>
  );
};

const BlockEditor = () => {
  const { blocks, addBlock } = useEditor();
  const [showMenu, setShowMenu] = useState(false);

  const addNewBlock = (type) => {
    let newBlock = { id: generateId(), type };
    if (type === 'text') newBlock.content = '';
    if (type === 'image') newBlock = { ...newBlock, src: '', width: '100%' };
    if (type === 'row') newBlock.children = [
      { id: generateId(), type: 'text', content: '' }, 
      { id: generateId(), type: 'text', content: '' }
    ];
    if (type === 'table') newBlock.data = [['', ''], ['', '']];

    addBlock(newBlock, blocks.length);
    setShowMenu(false);
  };

  return (
    <div className="studio-block-editor">
      <div className="blocks-list">
        {blocks.map((block, index) => (
          <BlockContainer key={block.id} block={block} index={index} />
        ))}
      </div>
      
      <div className="editor-inserter">
        <button 
          onClick={() => setShowMenu(!showMenu)}
          className="add-block-trigger"
        >
          <Plus size={20} />
          <span>Add element to story</span>
        </button>
        
        {showMenu && (
          <div className="inserter-menu">
            <button onClick={() => addNewBlock('text')}><Type size={16}/> Text Paragraph</button>
            <button onClick={() => addNewBlock('image')}><ImageIcon size={16}/> Hero/Inline Image</button>
            <button onClick={() => addNewBlock('row')}><Layout size={16}/> 2-Column Layout</button>
            <button onClick={() => addNewBlock('table')}><TableIcon size={16}/> Information Table</button>
          </div>
        )}
      </div>

      <style>{`
        .studio-block-editor { max-width: 800px; margin: 0 auto; }
        .block-item:hover { background: #fcfcfd; }
        .drag-handle:hover { color: #3b82f6 !important; }
        .delete-block-btn { 
          background: none; border: none; color: #94a3b8; 
          cursor: pointer; padding: 4px; border-radius: 4px; 
          transition: 0.2s;
        }
        .delete-block-btn:hover { background: #fee2e2; color: #ef4444; }

        .editor-inserter { margin-top: 40px; border-top: 1px dashed #e2e8f0; padding-top: 20px; position: relative; }
        .add-block-trigger {
          display: flex; align-items: center; gap: 12px;
          background: #f8fafc; border: 1px solid #e2e8f0;
          padding: 12px 24px; border-radius: 50px; cursor: pointer;
          color: #64748b; font-weight: 700; font-size: 14px;
          transition: 0.2s;
        }
        .add-block-trigger:hover { background: #eff6ff; color: #3b82f6; border-color: #3b82f6; }
        
        .inserter-menu {
          position: absolute; bottom: 100%; left: 0;
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          padding: 8px; width: 240px; z-index: 100;
          display: grid; grid-template-columns: 1fr; gap: 4px;
          margin-bottom: 12px;
        }
        .inserter-menu button {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; background: none; border: none;
          width: 100%; text-align: left; cursor: pointer;
          border-radius: 8px; font-size: 13px; font-weight: 600;
          color: #475569; transition: 0.2s;
        }
        .inserter-menu button:hover { background: #f1f5f9; color: #1e293b; }
      `}</style>
    </div>
  );
};

export default BlockEditor;
