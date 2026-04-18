import React, { useState, useEffect } from 'react';
import announcementService from '../../services/announcementService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit3, X, Save, Clock, 
  Search, FileText, Image as ImageIcon, ExternalLink,
  ChevronRight, LayoutDashboard, Settings
} from 'lucide-react';
import CustomBlockEditor from '../../components/CustomBlockEditor';
import { convertDriveLink } from '../../components/CustomBlockEditor/utils';
import DOMPurify from 'dompurify';

/**
 * PRODUCTION-GRADE NEWS RENDERER
 * Shared logic for the Studio Preview.
 */
const renderPreviewHtml = (blocks) => {
  if (!Array.isArray(blocks)) return "";
  return blocks.map(block => {
    switch(block.type) {
      case 'text':
        return `<div style="margin-bottom: 24px; font-size: 17px; line-height: 1.8; color: #334155;">${block.content || ''}</div>`;
      case 'image':
        return `<div style="margin: 32px 0; text-align: center;">
                  <img src="${convertDriveLink(block.src)}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
                </div>`;
      case 'row':
        const cols = (block.children || []).map(child => `<div style="flex: 1; min-width: 250px;">${renderPreviewHtml([child])}</div>`).join('');
        return `<div style="display: flex; gap: 32px; flex-wrap: wrap; margin: 32px 0;">${cols}</div>`;
      case 'table':
        const rows = (block.data || []).map(row => `<tr>${row.map(cell => `<td style="border: 1px solid #e2e8f0; padding: 12px; font-size: 14px;">${cell}</td>`).join('')}</tr>`).join('');
        return `<div style="overflow-x: auto; margin: 24px 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">${rows}</table></div>`;
      default: return "";
    }
  }).join('');
};

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [heroImage, setHeroImage] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => { fetchAnnouncements(); }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementService.getAll();
      setAnnouncements(data);
      if (data.length > 0) handleSelect(data[0]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSelect = (a) => {
    setSelected(a);
    setIsEditing(false);
    setTitle(a.title || '');
    setHeroImage(a.image_url || '');
    setIsPublished(a.is_published !== false);
    try {
      let content = a.content;
      if (typeof content === 'string' && (content.startsWith('[') || content.startsWith('{'))) {
        content = JSON.parse(content);
        if (typeof content === 'string') content = JSON.parse(content);
      }
      setBlocks(Array.isArray(content) ? content : [{ id: 'init', type: 'text', content: content || '' }]);
    } catch (e) { setBlocks([]); }
  };

  const handleSave = async () => {
    const payload = { 
      title, 
      content: JSON.stringify(blocks), 
      image_url: heroImage,
      is_published: isPublished 
    };
    try {
      if (selected) {
        const data = await announcementService.update(selected.id, payload);
        setAnnouncements(announcements.map(a => a.id === selected.id ? data : a));
      } else {
        const data = await announcementService.create(payload);
        setAnnouncements([data, ...announcements]);
        setSelected(data);
      }
      setIsEditing(false);
      alert("Changes saved successfully!");
    } catch (err) { 
      console.error("Save error:", err);
      const msg = err.response?.data?.error || err.response?.data?.details || err.message || "Save failed.";
      alert(`Save failed: ${msg}`);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm("Permanently delete this story from the library?")) return;
    
    try {
      await announcementService.delete(selected.id);
      const remaining = announcements.filter(a => a.id !== selected.id);
      setAnnouncements(remaining);
      if (remaining.length > 0) {
        handleSelect(remaining[0]);
      } else {
        setSelected(null);
        setTitle('');
        setBlocks([]);
        setHeroImage('');
      }
      alert("Story deleted successfully.");
    } catch (err) {
      console.error("Delete error:", err);
      const msg = err.response?.data?.error || err.message || "Deletion failed.";
      alert(`Deletion failed: ${msg}`);
    }
  };

  if (loading) return <div className="studio-init">Preparing Experience Studio...</div>;

  return (
    <div className="studio-shell">
      {/* Immersive Sidebar */}
      <aside className="studio-nav">
        <div className="nav-header">
          <div className="brand">SIIA Studio</div>
          <button onClick={() => { setSelected(null); setTitle(''); setBlocks([{ id: 'new', type: 'text', content: '' }]); setHeroImage(''); setIsEditing(true); }} className="add-btn"><Plus size={18}/></button>
        </div>
        
        <div className="search-bar">
          <Search size={14} />
          <input placeholder="Search library..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>

        <div className="entry-list">
          {announcements.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).map((a) => (
            <div key={a.id} onClick={() => handleSelect(a)} className={`entry-item ${selected?.id === a.id ? 'active' : ''}`}>
              <div className="entry-dot" />
              <div className="entry-info">
                <div className="entry-title">{a.title || "Untitled"}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="entry-date">{new Date(a.created_at).toLocaleDateString()}</div>
                  {a.is_published === false && <span style={{ fontSize: '10px', background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>DRAFT</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Designer Canvas */}
      <main className="studio-main">
        <header className="main-header" style={{ 
          backgroundImage: heroImage ? `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.9)), url(${convertDriveLink(heroImage)})` : 'none',
          backgroundColor: '#0f172a'
        }}>
          <div className="header-content">
            {isEditing ? (
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter Experience Title..." className="title-edit" />
            ) : (
              <h1 className="title-display">{title || "Start Designing"}</h1>
            )}
          </div>

          <div className="top-actions">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="act-btn glass"><X size={16}/> Discard</button>
                <button onClick={handleSave} className="act-btn primary"><Save size={16}/> Publish Changes</button>
              </>
            ) : (
              <>
                <button onClick={handleDelete} className="act-btn glass" style={{ borderColor: '#ef4444', color: '#ef4444' }}><Trash2 size={16}/> Delete Story</button>
                <button onClick={() => window.open(`/news/${selected?.id}`, '_blank')} className="act-btn glass"><ExternalLink size={16}/> Live Preview</button>
                <button onClick={() => setIsEditing(true)} className="act-btn primary"><Edit3 size={16}/> Edit Experience</button>
              </>
            )}
          </div>
        </header>

        <div className="canvas-content">
          <div className="canvas-card">
            {isEditing ? (
              <div className="editor-zone">
                <div className="hero-config" style={{ gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <ImageIcon size={14} />
                    <input value={heroImage} onChange={e => setHeroImage(convertDriveLink(e.target.value))} placeholder="Cover Image URL (Google Drive supported)" style={{ width: '100%' }} />
                  </div>
                  <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>Status:</label>
                    <select 
                      value={isPublished} 
                      onChange={e => setIsPublished(e.target.value === 'true')}
                      style={{ 
                        background: isPublished ? '#ecfdf5' : '#fef2f2',
                        color: isPublished ? '#059669' : '#dc2626',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="true">Published</option>
                      <option value="false">Draft / Private</option>
                    </select>
                  </div>
                </div>
                <CustomBlockEditor initialBlocks={blocks} onChange={setBlocks} />
              </div>
            ) : (
              <div className="preview-zone">
                {selected ? (
                  <div className="prose-preview" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(renderPreviewHtml(blocks)) }} />
                ) : (
                  <div className="empty-state">
                    <LayoutDashboard size={48} />
                    <h3>Experience Designer</h3>
                    <p>Select a story to begin the creative process.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .studio-shell { display: grid; grid-template-columns: 320px 1fr; height: calc(100vh - 80px); background: #f1f5f9; }
        
        .studio-nav { background: #fff; border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; padding: 24px; }
        .nav-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .brand { font-weight: 900; font-size: 1.2rem; color: #1e293b; letter-spacing: -0.5px; }
        .add-btn { background: #2563eb; color: #fff; border: none; padding: 8px; border-radius: 8px; cursor: pointer; }
        
        .search-bar { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; display: flex; align-items: center; gap: 10px; color: #94a3b8; margin-bottom: 24px; }
        .search-bar input { background: transparent; border: none; outline: none; flex: 1; font-size: 13px; color: #1e293b; }

        .entry-list { flex: 1; overflow-y: auto; }
        .entry-item { padding: 12px; border-radius: 12px; cursor: pointer; display: flex; gap: 12px; align-items: center; margin-bottom: 4px; transition: 0.2s; border: 1px solid transparent; }
        .entry-item:hover { background: #f8fafc; }
        .entry-item.active { background: #eff6ff; border-color: #dbeafe; }
        .entry-dot { width: 8px; height: 8px; background: #cbd5e1; border-radius: 50%; }
        .entry-item.active .entry-dot { background: #3b82f6; box-shadow: 0 0 8px #3b82f6; }
        .entry-title { font-weight: 700; font-size: 13px; color: #1e293b; }
        .entry-date { font-size: 11px; color: #94a3b8; margin-top: 2px; }

        .studio-main { display: flex; flex-direction: column; overflow: hidden; position: relative; }
        .main-header { height: 320px; padding: 60px; display: flex; flex-direction: column; justify-content: flex-end; background-size: cover; background-position: center; transition: 0.4s; }
        .title-edit { background: transparent; border: none; border-bottom: 2px solid rgba(255,255,255,0.2); color: #fff; font-size: 3rem; font-weight: 900; outline: none; width: 100%; }
        .title-display { font-size: 3rem; font-weight: 900; color: #fff; margin: 0; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }

        .top-actions { position: absolute; top: 40px; right: 60px; display: flex; gap: 12px; }
        .act-btn { padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; }
        .act-btn.glass { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; backdrop-filter: blur(12px); }
        .act-btn.primary { background: #fff; color: #2563eb; border: none; }
        .act-btn:hover { transform: translateY(-2px); }

        .canvas-content { flex: 1; overflow-y: auto; padding: 0 60px 60px; margin-top: -60px; z-index: 10; }
        .canvas-card { background: #fff; border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.05); padding: 50px; min-height: 100%; max-width: 1000px; margin: 0 auto; border: 1px solid #f1f5f9; }
        
        .hero-config { display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 40px; }
        .hero-config input { background: transparent; border: none; outline: none; flex: 1; font-size: 12px; color: #475569; }
        
        .prose-preview { color: #334155; line-height: 1.8; }
        .prose-preview a {
          color: #2563eb;
          text-decoration: underline;
        }
        .empty-state { height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #cbd5e1; }
        .studio-init { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #2563eb; letter-spacing: 2px; }
      `}</style>
    </div>
  );
};

export default AnnouncementManager;
