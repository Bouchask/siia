import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import announcementService from '../../services/announcementService';
import AnnouncementCard from '../../components/AnnouncementCard';
import SIIALoader from '../../components/SIIALoader';
import '../Home/Home.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
    window.scrollTo(0, 0);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setError(null);
      const data = await announcementService.getAll();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(err.response?.data?.error || err.message || "Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="announcements-page" style={{ background: 'var(--siia-bg)', minHeight: '100vh', paddingTop: '100px' }}>
      <div className="home-container">
        
        <header className="section-padding" style={{ paddingBottom: '60px' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge-premium"
            style={{ marginBottom: '24px' }}
          >
            <Bell size={14} /> 
            Department Updates
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-title"
            style={{ marginBottom: '24px' }}
          >
            SIIA <span className="text-gradient">News Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            Stay informed with the latest academic milestones, official announcements, and community highlights from the SIIA excellence track.
          </motion.p>
        </header>

        {loading ? (
          <div className="announcement-grid">
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '500px', background: '#fff', borderRadius: '24px', animation: 'pulse 1.5s infinite' }}></div>
            ))}
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              textAlign: 'center', 
              padding: '60px 40px', 
              background: '#fff1f2', 
              borderRadius: '32px', 
              border: '1px solid #fecdd3',
              marginTop: '40px'
            }}
          >
            <div style={{ width: '80px', height: '80px', background: '#ffe4e6', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#e11d48' }}>
              <Info size={40} />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#9f1239', fontWeight: '900', marginBottom: '12px' }}>System Connectivity Issue</h3>
            <p style={{ color: '#be123c', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 32px' }}>
              We encountered an error while trying to fetch the latest announcements. This is likely a temporary database connection issue.
              <br/><br/>
              <code style={{ fontSize: '12px', opacity: 0.8 }}>{error}</code>
            </p>
            <button onClick={fetchAnnouncements} className="btn btn-primary" style={{ background: '#e11d48' }}>
              Retry Connection
            </button>
          </motion.div>
        ) : announcements.length > 0 ? (
          <div className="announcement-grid" style={{ paddingBottom: '100px' }}>
            {announcements
              .filter(a => a.is_published !== false)
              .map((item, index) => (
              <AnnouncementCard key={item.id} announcement={item} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              textAlign: 'center', 
              padding: '100px 40px', 
              background: '#fff', 
              borderRadius: '32px', 
              border: '1px solid var(--siia-border)',
              marginTop: '40px'
            }}
          >
            <div style={{ width: '80px', height: '80px', background: 'var(--siia-blue-light)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--siia-blue)' }}>
              <Info size={40} />
            </div>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--siia-navy)', fontWeight: '900', marginBottom: '12px' }}>The news board is quiet</h3>
            <p style={{ color: 'var(--siia-text)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 32px' }}>We're currently preparing new updates. Check back soon for the latest from our department.</p>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={18} style={{ marginRight: '10px' }} /> Return Home
            </Link>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Announcements;
