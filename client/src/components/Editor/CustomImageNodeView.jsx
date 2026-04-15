import React, { useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Image as ImageIcon } from 'lucide-react';

const CustomImageNodeView = ({ node, updateAttributes, selected, editor, getPos }) => {
  const containerRef = useRef(null);
  const isEmpty = !node.attrs.src || node.attrs.src.includes('placeholder') || node.attrs.src === "";

  const onMouseDown = (event) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = containerRef.current?.offsetWidth || 0;

    const onMouseMove = (moveEvent) => {
      const currentX = moveEvent.clientX;
      const diffX = currentX - startX;
      const newWidth = Math.max(100, startWidth + diffX);
      updateAttributes({ width: `${newWidth}px` });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleEmptyClick = () => {
    if (isEmpty) {
      // Trigger the custom modal from WordEditor via a custom command
      editor.commands.openImageModal(getPos());
    }
  };

  const handleImageError = (e) => {
    console.error("DRIVE IMAGE FAILED TO LOAD:", node.attrs.src);
    // Optionally set a local fallback if needed
  };

  return (
    <NodeViewWrapper className="image-node-view">
      <div 
        ref={containerRef}
        className={`image-container ${selected ? 'selected' : ''} ${isEmpty ? 'empty' : ''}`}
        style={{ width: node.attrs.width, height: node.attrs.height, position: 'relative', display: 'inline-block' }}
        onClick={handleEmptyClick}
      >
        {isEmpty ? (
          <div className="image-placeholder">
            <ImageIcon size={32} />
            <p>Click to add Google Drive Image</p>
          </div>
        ) : (
          <img 
            src={node.attrs.src} 
            alt={node.attrs.alt} 
            onError={handleImageError}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px', objectFit: 'contain' }} 
          />
        )}
        
        {selected && !isEmpty && (
          <div 
            className="resize-handle" 
            onMouseDown={onMouseDown}
          />
        )}
      </div>

      <style>{`
        .image-node-view { margin: 1.5rem 0; text-align: center; }
        .image-container { 
          border-radius: 8px; 
          overflow: hidden; 
          transition: all 0.2s; 
          cursor: pointer;
          min-width: 150px;
          border: 2px solid transparent;
        }
        .image-container.selected { border-color: #2563eb; }
        
        .image-placeholder {
          background: #f1f5f9;
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: #64748b;
        }
        .image-placeholder p { margin: 0; font-size: 13px; font-weight: 600; }
        .image-container.empty:hover { background: #e2e8f0; border-color: #2563eb; color: #1e293b; }

        .resize-handle {
          position: absolute;
          right: -5px;
          bottom: -5px;
          width: 12px;
          height: 12px;
          backgroundColor: #2563eb;
          borderRadius: 50%;
          cursor: nwse-resize;
          border: 2px solid white;
          zIndex: 10;
        }
      `}</style>
    </NodeViewWrapper>
  );
};

export default CustomImageNodeView;
