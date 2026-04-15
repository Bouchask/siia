import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { PlusCircle } from 'lucide-react';
import ImageModal from './ImageModal';

const ImageRowNodeView = ({ editor, getPos, node }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addImageToRow = (url) => {
    // Calculate position: insert at the end of this node's content
    const pos = getPos() + node.nodeSize - 1;
    editor.chain().focus().insertContentAt(pos, {
      type: 'image',
      attrs: { src: url, width: 'calc(50% - 10px)' } // Default to half-width for 2+ images
    }).run();
  };

  return (
    <NodeViewWrapper className="image-row-wrapper">
      <div className="image-row-container">
        {/* NodeViewContent is where the actual <img/> nodes will be rendered */}
        <NodeViewContent className="image-row-content" />
        
        <button 
          className="add-image-btn" 
          onClick={() => setIsModalOpen(true)}
          title="Add image to row"
          type="button"
        >
          <PlusCircle size={24} />
          <span>Add Image</span>
        </button>
      </div>

      <ImageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={addImageToRow} 
      />

      <style>{`
        .image-row-wrapper {
          margin: 2rem 0;
          padding: 10px;
          background: #f8fafc;
          border: 2px dashed #e2e8f0;
          border-radius: 12px;
          transition: border-color 0.2s;
        }
        .image-row-wrapper:hover {
          border-color: #2563eb;
        }
        .image-row-container {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        .image-row-content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 15px;
          flex: 1;
          align-items: flex-start;
        }
        /* Style images specifically when inside a row */
        .image-row-content > div {
          margin: 0 !important;
          flex: 1 1 200px; /* Allow images to grow and shrink */
          max-width: 100%;
          min-width: 150px;
        }
        .add-image-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 120px;
          align-self: stretch;
        }
        .add-image-btn:hover {
          background: #eff6ff;
          color: #2563eb;
          border-color: #2563eb;
        }
        .add-image-btn span {
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>
    </NodeViewWrapper>
  );
};

export default ImageRowNodeView;
