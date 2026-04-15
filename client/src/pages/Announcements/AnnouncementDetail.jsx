import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [isHtml, setIsHtml] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/announcements/${id}`);
      setAnnouncement(response.data);
      
      const content = response.data.content;
      
      // Check if it's legacy block-based (JSON) or new HTML
      if (content && (content.startsWith('[') || content.startsWith('{'))) {
        try {
          const parsed = JSON.parse(content);
          setBlocks(Array.isArray(parsed) ? parsed : [parsed]);
          setIsHtml(false);
        } catch (e) {
          setIsHtml(true);
        }
      } else {
        setIsHtml(true);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getDirectDriveLink = (url) => {
    if (!url) return "";
    // Extract ID from various Drive URL formats (/d/ID or id=ID)
    const match = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
    if (match && match[1]) {
      // Use the backend proxy for reliable image loading in the detail view
      return `http://localhost:5000/api/drive/proxy/${match[1]}`;
    }
    return url;
  };

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="home-container" style={{ padding: '60px 20px', maxWidth: '1000px' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--siia-blue)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '40px' }}>
        <ArrowLeft size={18} /> Back to News
      </button>

      <div className="card" style={{ padding: '60px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span className="badge">OFFICIAL</span>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>{new Date(announcement.created_at).toLocaleDateString()}</span>
          </div>
          <Share2 size={20} color="#cbd5e1" />
        </div>

        <h1 style={{ fontSize: '3rem', color: 'var(--siia-navy)', fontWeight: '900', marginBottom: '50px' }}>{announcement.title}</h1>

        <div className="announcement-content ck-content">
          {isHtml ? (
            <div 
              dangerouslySetInnerHTML={{ __html: announcement.content }} 
              style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#334155' }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {blocks.map((b, i) => (
                <div key={i}>
                  {b.type === 'text' && <div dangerouslySetInnerHTML={{ __html: b.content }} style={{ lineHeight: '1.8', fontSize: '1.1rem' }} />}
                  
                  {b.type === 'image' && (
                    <div style={{ textAlign: b.align, margin: '20px 0' }}>
                      <img src={getDirectDriveLink(b.url)} style={{ maxWidth: '100%', width: b.width, borderRadius: '15px' }} />
                    </div>
                  )}

                  {b.type === 'table' && (
                    <div style={{ overflowX: 'auto', margin: '20px 0' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                          {b.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} style={{ border: '1px solid #e2e8f0', padding: '15px' }}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {b.type === 'row' && (
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap', margin: '20px 0' }}>
                      {b.cols.map((col, cIdx) => (
                        <div key={cIdx} style={{ flex: 1, minWidth: '300px' }}>
                          {col.type === 'text' ? <div dangerouslySetInnerHTML={{ __html: col.content }} /> : <img src={getDirectDriveLink(col.url)} style={{ width: '100%', borderRadius: '15px' }} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        /* Styles for CKEditor HTML content */
        .ck-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
        }
        .ck-content table td, .ck-content table th {
          border: 1px solid #e2e8f0;
          padding: 12px;
        }
        .ck-content ul, .ck-content ol {
          margin-left: 20px;
          margin-bottom: 20px;
        }
        .ck-content blockquote {
          border-left: 4px solid var(--siia-blue);
          padding-left: 20px;
          margin: 20px 0;
          color: #64748b;
          font-style: italic;
        }
        .ck-content a {
          color: var(--siia-blue);
          text-decoration: underline;
        }
        .ck-content img {
          max-width: 100%;
          border-radius: 12px;
          margin: 20px 0;
        }
      `}</style>
    </motion.div>
  );
};

export default AnnouncementDetail;
