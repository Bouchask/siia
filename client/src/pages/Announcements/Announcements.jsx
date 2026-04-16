import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Info } from 'lucide-react';
import axios from 'axios';
import AnnouncementCard from '../../components/AnnouncementCard';
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
              >
                <AnnouncementCard announcement={item} />
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
