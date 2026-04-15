import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronRight, Info, Layout } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../Home/Home.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/announcements/');
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDirectDriveLink = (url) => {
    if (!url) return "";
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return `https://lh3.googleusercontent.com/d/${match[1]}`;
    return url;
  };

  const getPreviewText = (content) => {
    try {
      const blocks = JSON.parse(content);
      const textBlock = blocks.find(b => b.type === 'text');
      return textBlock ? textBlock.content : "Click to view rich content";
    } catch (e) {
      return content;
    }
  };

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="home-container">
        
        <header style={{ marginBottom: '80px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--siia-blue)', fontWeight: 'bold', marginBottom: '20px', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            <Bell size={20} /> Latest Updates
          </div>
          <h1 style={{ fontSize: '4rem', color: 'var(--siia-navy)', fontWeight: '900', lineHeight: 1 }}>Department Gallery</h1>
          <p style={{ color: 'var(--siia-text)', fontSize: '1.2rem', marginTop: '20px', maxWidth: '700px', margin: '20px auto 0' }}>Discover the latest academic events, seminars, and official news from the SIIA major.</p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <p style={{ color: 'var(--siia-text)' }}>Building the gallery view...</p>
          </div>
        ) : announcements.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            {announcements.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card"
                style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e2e8f0' }}
              >
                {/* Visual Header */}
                <div style={{ height: '220px', background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                  {item.image_url ? (
                    <img 
                      src={getDirectDriveLink(item.image_url)} 
                      alt="Banner" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                      <Layout size={60} strokeWidth={1} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '5px 15px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold', color: 'var(--siia-blue)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div style={{ padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '1.6rem', marginBottom: '15px', color: 'var(--siia-navy)', fontWeight: '800', lineHeight: 1.2 }}>
                    {item.title}
                  </h2>
                  
                  <p style={{ color: 'var(--siia-text)', fontSize: '0.95rem', marginBottom: '30px', flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: 1.6 }}>
                    {getPreviewText(item.content)}
                  </p>

                  <Link 
                    to={`/news/${item.id}`} 
                    style={{ 
                      marginTop: 'auto', 
                      background: 'var(--siia-navy)',
                      color: '#fff',
                      padding: '12px 25px',
                      borderRadius: '8px',
                      fontWeight: 'bold', 
                      textDecoration: 'none', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      transition: 'background 0.2s'
                    }}
                  >
                    View Experience <ChevronRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px', background: '#fff', borderRadius: '30px', border: '2px dashed #e2e8f0' }}>
            <Info size={60} color="#cbd5e1" style={{ marginBottom: '20px' }} />
            <h3 style={{ color: 'var(--siia-navy)', fontWeight: '800' }}>The gallery is currently quiet</h3>
            <p style={{ color: 'var(--siia-text)' }}>Stay tuned for upcoming architectural highlights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
