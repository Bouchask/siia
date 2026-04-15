import React, { useState, useEffect } from 'react';
import { X, Link2, Check } from 'lucide-react';
import { convertDriveLink } from '../../utils/DriveLinkConverter';

const ImageModal = ({ isOpen, onClose, onConfirm, initialUrl = "" }) => {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => { setUrl(initialUrl); }, [initialUrl]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const directUrl = convertDriveLink(url);
    onConfirm(directUrl);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{initialUrl ? 'Edit Image' : 'Insert Drive Image'}</h3>
          <button onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal-body">
          <div className="input-group">
            <Link2 size={16} className="input-icon" />
            <input 
              type="text" 
              placeholder="Paste Google Drive share link..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
          </div>
          <p className="hint">The link will be automatically converted for direct viewing.</p>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" onClick={handleConfirm}>
            <Check size={16}/> {initialUrl ? 'Update' : 'Insert'}
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-content { background: white; width: 450px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden; }
        .modal-header { padding: 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; }
        .modal-body { padding: 20px; }
        .input-group { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 12px; color: #94a3b8; }
        .input-group input { width: 100%; padding: 10px 10px 10px 40px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; transition: border 0.2s; }
        .input-group input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .hint { font-size: 12px; color: #64748b; margin-top: 10px; }
        .modal-footer { padding: 15px 20px; background: #f8fafc; display: flex; justify-content: flex-end; gap: 10px; }
        .btn-cancel { padding: 8px 16px; border: none; background: transparent; color: #64748b; font-weight: 600; cursor: pointer; }
        .btn-confirm { padding: 8px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
      `}</style>
    </div>
  );
};

export default ImageModal;
