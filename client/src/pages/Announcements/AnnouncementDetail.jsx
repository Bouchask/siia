import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import announcementService from '../../services/announcementService';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Clock, Share2, Bookmark } from 'lucide-react';
import DOMPurify from 'dompurify';
import { convertDriveLink } from '../../components/CustomBlockEditor/utils';

/**
 * PURE HTML RENDERER UTILITY
 * Converts Custom Block array or TipTap HTML/JSON into a clean HTML string.
 */
const blocksToHtml = (content) => {
  if (!content) return "";
  
  try {
    let parsed = content;
    // Handle JSON string or double-stringified JSON
    if (typeof content === 'string' && (content.startsWith('[') || content.startsWith('{'))) {
      parsed = JSON.parse(content);
      if (typeof parsed === 'string' && (parsed.startsWith('[') || parsed.startsWith('{'))) {
        parsed = JSON.parse(parsed);
      }
    }

    // 1. Handle Custom Block Array (from Block Editor)
    if (Array.isArray(parsed)) {
      return parsed.map(block => {
        switch (block.type) {
          case 'text':
            return `<div class="content-text" style="margin-bottom: 20px; line-height: 1.8; font-size: 17px; color: #334155;">${block.content || ''}</div>`;
          case 'image':
            return `<div class="content-image" style="margin: 32px 0; text-align: center;">
                      <img src="${convertDriveLink(block.src)}" style="max-width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
                    </div>`;
          case 'row':
            const cols = (block.children || []).map(child => `<div style="flex: 1; min-width: 300px;">${blocksToHtml([child])}</div>`).join('');
            return `<div class="content-row" style="display: flex; gap: 32px; flex-wrap: wrap; margin: 32px 0;">${cols}</div>`;
          case 'table':
            const rows = (block.data || []).map(row => `<tr>${row.map(cell => `<td style="border: 1px solid #e2e8f0; padding: 12px;">${cell}</td>`).join('')}</tr>`).join('');
            return `<div style="overflow-x: auto; margin: 32px 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">${rows}</table></div>`;
          default:
            return "";
        }
      }).join('');
    }

    // 2. Handle TipTap Doc Object (as fallback string)
    if (typeof parsed === 'object' && parsed.type === 'doc') {
      return `<p style="color: #64748b; font-style: italic;">[TipTap structured content detected - View in Admin Dashboard]</p>`;
    }

    // 3. Handle Legacy HTML String
    return typeof parsed === 'string' ? parsed : JSON.stringify(parsed);

  } catch (e) {
    console.error("Renderer Error:", e);
    return typeof content === 'string' ? content : "Error rendering content.";
  }
};

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await announcementService.getById(id);
        setAnnouncement(data);
      } catch (err) {
        console.error("Error fetching announcement detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-state">Designing your view...</div>;
  if (!announcement) return <div className="not-found">Announcement not found.</div>;

  const htmlContent = blocksToHtml(announcement.content);
  const cleanHtml = DOMPurify.sanitize(htmlContent);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="news-page">
      {/* Hero Header */}
      <div className="news-hero" style={{ 
        backgroundImage: announcement.image_url ? `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9)), url(${convertDriveLink(announcement.image_url)})` : 'linear-gradient(135deg, #1e293b, #334155)',
        height: '400px', display: 'flex', alignItems: 'flex-end', paddingBottom: '60px', backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <div className="home-container">
          <button onClick={() => navigate('/announcements')} className="back-btn"><ArrowLeft size={16} /> Back</button>
          <h1 style={{ color: '#fff', fontSize: '3.5rem', fontWeight: 900, marginTop: '20px' }}>{announcement.title}</h1>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="home-container" style={{ marginTop: '-40px', paddingBottom: '100px' }}>
        <div className="news-card">
          <div className="news-meta-bar">
            <div className="meta-item"><Calendar size={14}/> {new Date(announcement.created_at).toLocaleDateString()}</div>
            <div className="meta-item"><User size={14}/> {announcement.author_name || "SIIA Official"}</div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '30px 0' }} />

          {/* THE CLEAN RENDERER - NO EDITOR CODE HERE */}
          <div 
            className="prose-view" 
            dangerouslySetInnerHTML={{ __html: cleanHtml }} 
          />
          
          <div className="news-footer">
            <div className="footer-actions">
              <button className="icon-btn"><Share2 size={18} /></button>
              <button className="icon-btn"><Bookmark size={18} /></button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .news-page { background: #f8fafc; min-height: 100vh; }
        .back-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 20px; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 700; transition: 0.2s; }
        .back-btn:hover { background: #2563eb; }
        .news-card { background: #fff; border-radius: 24px; padding: 60px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.08); max-width: 900px; }
        .news-meta-bar { display: flex; gap: 24px; color: #94a3b8; font-size: 13px; font-weight: 600; }
        .meta-item { display: flex; align-items: center; gap: 8px; }
        .prose-view { color: #334155; line-height: 1.8; font-size: 17px; }
        .prose-view h1, .prose-view h2, .prose-view h3 { color: #1e293b; margin: 40px 0 20px; }
        .prose-view p { margin-bottom: 20px; }
        .prose-view a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.2s;
        }
        .prose-view a:hover {
          color: #1d4ed8;
        }
        .loading-state { height: 80vh; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
        .news-footer { margin-top: 60px; padding-top: 40px; border-top: 1px solid #f1f5f9; }
        .icon-btn { width: 45px; height: 45px; border-radius: 50%; border: 1px solid #f1f5f9; background: #fff; color: #94a3b8; cursor: pointer; transition: 0.2s; }
        .icon-btn:hover { background: #2563eb; color: #fff; }
      `}</style>
    </motion.div>
  );
};

export default AnnouncementDetail;
