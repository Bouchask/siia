import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '../EditorContext';
import { convertDriveLink } from '../utils';
import { Image as ImageIcon, Check, X } from 'lucide-react';

const ImageBlock = ({ block }) => {
  const { updateBlock } = useEditor();
  const [isModalOpen, setIsModalOpen] = useState(!block.src);
  const [inputUrl, setInputUrl] = useState(block.src || '');
  const [isResizing, setIsResizing] = useState(false);
  const imageContainerRef = useRef(null);

  const startResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !imageContainerRef.current) return;
      const rect = imageContainerRef.current.getBoundingClientRect();
      const newWidth = Math.max(100, e.clientX - rect.left);
      updateBlock(block.id, { width: newWidth });
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, block.id, updateBlock]);

  const handleSaveUrl = () => {
    const finalUrl = convertDriveLink(inputUrl);
    updateBlock(block.id, { src: finalUrl });
    setIsModalOpen(false);
  };

  return (
    <div style={{ position: 'relative', margin: '10px 0' }}>
      {block.src ? (
        <div 
          ref={imageContainerRef}
          style={{ 
            position: 'relative', 
            display: 'inline-block',
            width: block.width || 300
          }}
        >
          <img 
            src={block.src} 
            alt="User content" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              display: 'block', 
              borderRadius: '8px',
              border: isResizing ? '2px solid var(--siia-blue, #2563eb)' : '2px solid transparent'
            }} 
            onClick={() => setIsModalOpen(true)}
          />
          <div 
            onMouseDown={startResize}
            style={{
              position: 'absolute',
              bottom: '-5px',
              right: '-5px',
              width: '15px',
              height: '15px',
              background: 'white',
              border: '2px solid var(--siia-blue, #2563eb)',
              borderRadius: '50%',
              cursor: 'nwse-resize',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      ) : (
        <div 
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '40px', background: '#f1f5f9', borderRadius: '8px',
            border: '2px dashed #cbd5e1', textAlign: 'center', cursor: 'pointer',
            color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
          }}
        >
          <ImageIcon size={32} />
          <span>Click to add an image via URL (Supports Google Drive Links)</span>
        </div>
      )}

      {isModalOpen && (
        <div style={{
          position: 'absolute', top: '10px', left: '10px', zIndex: 20,
          background: 'white', padding: '15px', borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0',
          display: 'flex', gap: '10px', width: 'max-content'
        }}>
          <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Paste image URL..."
            style={{
              padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px',
              width: '250px', outline: 'none'
            }}
            autoFocus
          />
          <button 
            onClick={handleSaveUrl}
            style={{ background: 'var(--siia-blue, #2563eb)', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
          >
            <Check size={16} />
          </button>
          <button 
            onClick={() => setIsModalOpen(false)}
            style={{ background: '#f1f5f9', color: '#64748b', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;