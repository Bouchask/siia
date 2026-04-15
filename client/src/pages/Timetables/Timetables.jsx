import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, FileText, X, ExternalLink, Clock, ChevronRight } from 'lucide-react';
import '../Home/Home.css';

const Timetables = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/timetables/');
        setTimetables(response.data);
      } catch (error) {
        console.error("Error fetching timetables:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetables();
  }, []);

  // Helper to convert webViewLink to an embeddable link
  const getEmbedLink = (link) => {
    if (!link) return "";
    return link.replace('/view?usp=sharing', '/preview');
  };

  return (
    <div className="section-padding">
      <div className="home-container">
        
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--siia-blue)', fontWeight: 'bold', marginBottom: '16px', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            <Calendar size={20} /> Academic Schedule
          </div>
          <h1 style={{ fontSize: '3rem', color: 'var(--siia-navy)', fontWeight: '800' }}>Emplois du Temps</h1>
          <p style={{ color: 'var(--siia-text)', fontSize: '1.2rem', marginTop: '16px' }}>Select a program below to view your interactive weekly schedule.</p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px' }}>
            <p style={{ color: 'var(--siia-text)' }}>Connecting to SIIA Cloud Drive...</p>
          </div>
        ) : timetables.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', marginBottom: '60px' }}>
            {timetables.map((file) => (
              <motion.div 
                key={file.id}
                whileHover={{ y: -5 }}
                className={`card ${selectedFile?.id === file.id ? 'active-card' : ''}`}
                style={{ 
                  padding: '40px', 
                  cursor: 'pointer',
                  border: selectedFile?.id === file.id ? '2px solid var(--siia-blue)' : '1px solid var(--siia-border)'
                }}
                onClick={() => setSelectedFile(file)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ padding: '15px', background: '#f1f5f9', borderRadius: '12px', color: 'var(--siia-blue)' }}>
                    <FileText size={32} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--siia-navy)', marginBottom: '4px' }}>
                      {file.name.includes('S6') ? "Licence SIIA S6" : 
                       file.name.includes('S8') ? "Master SIIA S8" : file.name}
                    </h2>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>OFFICIAL PDF</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--siia-blue)', fontWeight: 'bold', fontSize: '14px' }}>
                  {selectedFile?.id === file.id ? 'Viewing Now' : 'Click to Preview'} <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px', background: 'var(--siia-light)', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
            <Info size={60} color="#cbd5e1" style={{ marginBottom: '20px' }} />
            <h3 style={{ color: 'var(--siia-navy)' }}>No schedules found</h3>
          </div>
        )}

        {/* INTERACTIVE PREVIEW AREA */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="card" style={{ padding: '20px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
                  <h3 style={{ color: 'var(--siia-navy)', fontWeight: 'bold' }}>
                    Preview: {selectedFile.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <a href={selectedFile.webViewLink} target="_blank" rel="noreferrer" style={{ color: 'var(--siia-blue)', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Open in Drive <ExternalLink size={16} />
                    </a>
                    <button onClick={() => setSelectedFile(null)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}>
                      Close <X size={18} />
                    </button>
                  </div>
                </div>
                
                {/* PDF EMBED FRAME (Backend Proxy) */}
                <iframe
                  src={`http://localhost:5000/api/timetables/proxy/${selectedFile.id}`}
                  width="100%"
                  height="800px"
                  style={{ border: 'none', borderRadius: '8px' }}
                  allow="autoplay"
                ></iframe>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="card" style={{ padding: '30px', background: '#f8fafc', marginTop: '40px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Clock size={24} color="var(--siia-blue)" />
          <p style={{ color: 'var(--siia-text)', fontSize: '0.9rem' }}>
            <strong>Note:</strong> Timetables are fetched in real-time. If the viewer doesn't load, please ensure you are signed into your student Google account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Timetables;
