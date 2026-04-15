import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit3, Image as ImageIcon, 
  X, Save, Settings, ChevronRight, Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WordEditor from '../../components/Editor/WordEditor';

const AnnouncementManager = () => {
  const { token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/announcements/');
      setAnnouncements(res.data);
      if (res.data.length > 0 && !selected) handleSelect(res.data[0]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getDirectDriveLink = (url) => {
    if (!url) return "";
    // Extract ID from various Drive URL formats (/d/ID or id=ID)
    const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return url;
  };

  const handleSelect = (a) => {
    setSelected(a);
    setIsEditing(false);
    let finalContent = a.content || '';
    
    // Check if it's JSON content (Legacy or TipTap)
    if (finalContent.trim().startsWith('{') || finalContent.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(finalContent);
        
        // Handle TipTap JSON (root is usually { type: 'doc', content: [...] })
        if (parsed.type === 'doc' && Array.isArray(parsed.content)) {
          finalContent = parsed.content.map(node => {
            if (node.type === 'paragraph') {
              const text = node.content?.map(c => c.text).join('') || '';
              return `<p>${text}</p>`;
            }
            if (node.type === 'heading') {
              const text = node.content?.map(c => c.text).join('') || '';
              const level = node.attrs?.level || 1;
              return `<h${level}>${text}</h${level}>`;
            }
            if (node.type === 'image') {
              const src = node.attrs?.src || '';
              const width = node.attrs?.width || '100%';
              return `<div style="text-align:center"><img src="${src}" style="width:${width}; border-radius:12px;"></div>`;
            }
            return '';
          }).join('');
        } 
        // Handle Legacy Array JSON
        else if (Array.isArray(parsed)) {
          finalContent = parsed.map(b => {
            if (b.type === 'text') {
              const style = b.styles ? `style="font-size: ${b.styles.fontSize || 'inherit'}"` : '';
              return `<p ${style}>${b.content}</p>`;
            }
            if (b.type === 'image') {
              const driveUrl = getDirectDriveLink(b.url);
              const width = b.styles?.width || '100%';
              const align = b.styles?.alignment || 'center';
              return `<div style="text-align: ${align}"><img src="${driveUrl}" style="width:${width}; border-radius: 12px;"></div>`;
            }
            return '';
          }).join('');
        }
      } catch (e) {
        console.error("Conversion error:", e);
      }
    }
    
    setContent(finalContent);
    setTitle(a.title || '');
    setImageUrl(a.image_url || '');
  };

  // Helper to extract the first image URL from TipTap JSON
  const extractFirstImage = (json) => {
    if (!json || typeof json !== 'object') return null;
    
    // Recursive search through TipTap node tree
    const findImage = (node) => {
      if (!node) return null;
      if (node.type === 'image') return node.attrs?.src;
      
      if (node.content && Array.isArray(node.content)) {
        for (const child of node.content) {
          const found = findImage(child);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findImage(json);
  };

  const handleSave = async () => {
    let finalContent = content;
    let finalImageUrl = imageUrl;

    // If content is TipTap JSON object, serialize it and extract image
    if (typeof content === 'object' && content !== null) {
      finalImageUrl = extractFirstImage(content) || '';
      finalContent = JSON.stringify(content);
    }

    const payload = { 
      title, 
      content: finalContent, 
      image_url: finalImageUrl 
    };
    
    try {
      if (selected) {
        const res = await axios.put(`http://localhost:5000/api/announcements/${selected.id}`, payload, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        // Update local state with the returned data from server
        const updated = announcements.map(a => a.id === selected.id ? res.data : a);
        setAnnouncements(updated);
      } else {
        const res = await axios.post('http://localhost:5000/api/announcements/', payload, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setAnnouncements([res.data, ...announcements]);
        setSelected(res.data);
      }
      setIsEditing(false);
      // Removed fetchAnnouncements() to avoid flickering; manual state update is cleaner
    } catch (err) { 
      alert("Publication failed. Check your connection or permissions."); 
    }
  };

  const createNew = () => {
    setSelected(null);
    setContent('');
    setTitle('');
    setImageUrl('');
    setIsEditing(true);
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Dashboard...</div>;

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', gap: '25px' }}>
      
      {/* Sidebar List */}
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column' }}>
        <button onClick={createNew} className="btn btn-primary" style={{ width: '100%', marginBottom: '20px', gap: '10px' }}>
          <Plus size={18}/> New Announcement
        </button>
        <div className="card" style={{ flex: 1, overflowY: 'auto', padding: 0 }}>
          {announcements.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No announcements yet.
            </div>
          )}
          {announcements.map((a) => (
            <div 
              key={a.id} 
              onClick={() => handleSelect(a)} 
              style={{ 
                padding: '15px 20px', 
                borderBottom: '1px solid #f1f5f9', 
                cursor: 'pointer', 
                background: selected?.id === a.id ? '#eff6ff' : 'transparent',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.2s',
                position: 'relative',
                borderLeft: selected?.id === a.id ? '4px solid var(--siia-blue)' : '4px solid transparent'
              }}
              className="announcement-item"
            >
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--siia-navy)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(a.created_at).toLocaleDateString()}</div>
              </div>
              <button 
                onClick={(e) => handleDelete(e, a.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#94a3b8', 
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
              >
                <Trash2 size={16}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="card" style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#fff', position: 'relative' }}>
          
          {/* Header Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Announcement Title..." 
                  style={{ fontSize: '2rem', fontWeight: '800', border: 'none', background: 'transparent', width: '100%', outline: 'none', color: 'var(--siia-navy)' }} 
                />
              ) : (
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: 'var(--siia-navy)' }}>{title}</h1>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {isEditing ? (
                <>
                  <button onClick={() => setIsEditing(false)} className="btn btn-secondary"><X size={18}/> Cancel</button>
                  <button onClick={handleSave} className="btn btn-primary"><Save size={18}/> Publish Changes</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary"><Edit3 size={18}/> Edit Content</button>
              )}
            </div>
          </div>

          {/* Main Editor */}
          <div className="editor-section">
            {isEditing ? (
              <WordEditor 
                key={selected?.id || 'new'}
                value={content} 
                onChange={(data) => setContent(data)} 
              />
            ) : (
              <div 
                className="announcement-preview ck-content"
                dangerouslySetInnerHTML={{ __html: typeof content === 'object' ? '<p><i>Word-style content: Click Edit to view</i></p>' : content }} 
                style={{ 
                  lineHeight: '1.8', 
                  fontSize: '1.1rem',
                  color: '#334155'
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementManager;
