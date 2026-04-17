import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../services/api';
import timetableService from '../../services/timetableService';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, FileText, X, ExternalLink, Clock, ChevronRight, Info } from 'lucide-react';
import '../Home/Home.css';

const Timetables = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const data = await timetableService.getAll();
        setTimetables(data);
      } catch (error) {
        console.error("Error fetching timetables:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetables();
    window.scrollTo(0, 0);
  }, []);

  const getEmbedLink = (link) => {
    if (!link) return "";
    return link.replace('/view?usp=sharing', '/preview');
  };

  return (
    <div className="timetables-page" style={{ background: 'var(--siia-bg)', minHeight: '100vh', paddingTop: '100px' }}>
      <div className="home-container">
        
        <header className="section-padding" style={{ paddingBottom: '60px' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge-premium"
            style={{ marginBottom: '24px' }}
          >
            <Calendar size={14} /> 
            Academic Schedule
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-title"
            style={{ marginBottom: '24px' }}
          >
            Emplois <span className="text-gradient">du Temps</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            Access your interactive weekly schedule. Select your program below to view or download the official SIIA timetables.
          </motion.p>
        </header>

        {loading ? (
          <div className="announcement-grid">
            {[1, 2].map(i => (
              <div key={i} style={{ height: '200px', background: '#fff', borderRadius: '24px', animation: 'pulse 1.5s infinite' }}></div>
            ))}
          </div>
        ) : timetables.length > 0 ? (
          <div className="announcement-grid" style={{ marginBottom: '60px' }}>
            {timetables.map((file, index) => (
              <motion.div 
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedFile(file)}
                style={{
                  background: '#fff',
                  padding: '32px',
                  borderRadius: '24px',
                  border: selectedFile?.id === file.id ? '2px solid var(--siia-blue)' : '1px solid var(--siia-border)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedFile?.id === file.id ? '0 20px 40px rgba(37, 99, 235, 0.1)' : '0 4px 12px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ width: '60px', height: '60px', background: 'var(--siia-blue-light)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--siia-blue)' }}>
                    <FileText size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--siia-navy)', marginBottom: '4px' }}>
                      {file.name.includes('S6') ? "Licence SIIA S6" : 
                       file.name.includes('S8') ? "Master SIIA S8" : file.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--siia-text-light)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Official Document</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--siia-blue)', fontWeight: '800', fontSize: '13px' }}>
                  {selectedFile?.id === file.id ? 'Currently Viewing' : 'Click to Preview'} <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '32px', border: '1px solid var(--siia-border)' }}>
            <Info size={48} color="var(--siia-text-light)" style={{ marginBottom: '20px' }} />
            <h3 style={{ color: 'var(--siia-navy)', fontWeight: '800' }}>No schedules available</h3>
            <p style={{ color: 'var(--siia-text)' }}>The academic schedules are currently being updated.</p>
          </div>
        )}

        <AnimatePresence>
          {selectedFile && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{ marginBottom: '80px' }}
            >
              <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid var(--siia-border)', overflow: 'hidden', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid var(--siia-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--siia-navy)' }}>
                      {selectedFile.name}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <a href={selectedFile.webViewLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'var(--siia-blue)', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ExternalLink size={16} /> Open Full View
                    </a>
                    <button onClick={() => setSelectedFile(null)} style={{ background: 'var(--siia-blue-light)', border: 'none', color: 'var(--siia-blue)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                <iframe
                  src={`${API_BASE_URL}/api/timetables/proxy/${selectedFile.id}`}
                  width="100%"
                  height="700px"
                  style={{ border: 'none' }}
                  title="Timetable Preview"
                ></iframe>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ background: 'rgba(37, 99, 235, 0.03)', padding: '32px', borderRadius: '24px', border: '1px solid var(--siia-blue-light)', display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '80px' }}>
          <Clock size={24} color="var(--siia-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: 'var(--siia-navy)', fontWeight: '800', marginBottom: '4px', fontSize: '15px' }}>Real-time Synchronization</h4>
            <p style={{ color: 'var(--siia-text)', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
              Schedules are synced directly with the SIIA Administration Drive. For the best experience on mobile, we recommend using the "Open Full View" option to view the document in the Google Drive app.
            </p>
          </div>
        </div>
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

export default Timetables;
