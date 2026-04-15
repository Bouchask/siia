import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, File, FileText, ImageIcon, ArrowLeft, 
  X, ChevronRight, Search, GraduationCap, Clock, Monitor
} from 'lucide-react';
import '../Home/Home.css';

const CourseMaterials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); 
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (history.length > 0) {
      fetchContents(history[history.length - 1]);
    }
  }, [history]);

  const fetchContents = async (folderName) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${folderName}`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (name) => setHistory([...history, name]);
  const goBack = () => setHistory(history.slice(0, -1));
  const isFolder = (item) => item.mimeType === 'application/vnd.google-apps.folder';
  const isImage = (item) => item.mimeType.startsWith('image/');

  if (history.length === 0) {
    return (
      <div className="section-padding">
        <div className="home-container">
          <header style={{ marginBottom: '60px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--siia-blue)', fontWeight: 'bold', marginBottom: '16px', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>
              <GraduationCap size={20} /> Academic Portal
            </div>
            <h1 style={{ fontSize: '3.5rem', color: 'var(--siia-navy)', fontWeight: '900' }}>Study Materials</h1>
            <p style={{ color: 'var(--siia-text)', fontSize: '1.2rem' }}>Browse your semester resources in a centralized file explorer.</p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
            {['S5', 'S6', 'S7', 'S8'].map((sem) => (
              <motion.div
                key={sem} whileHover={{ y: -5 }} className="card"
                style={{ padding: '40px', textAlign: 'center', cursor: 'pointer', background: '#fff' }}
                onClick={() => navigateTo(sem)}
              >
                <div style={{ width: '60px', height: '60px', background: 'var(--siia-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--siia-blue)' }}>
                  <Monitor size={28} />
                </div>
                <h2 style={{ fontSize: '1.8rem', color: 'var(--siia-navy)', margin: 0 }}>Semester {sem}</h2>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="home-container">
        
        {/* Header with Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <button onClick={goBack} style={{ background: 'var(--siia-navy)', color: '#fff', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer shadow-lg' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '2rem', color: 'var(--siia-navy)', margin: 0 }}>{history[history.length - 1]}</h1>
            <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', marginTop: '5px' }}>
              {history.map((h, i) => <span key={i}>{h} {i < history.length - 1 && ' > '}</span>)}
            </div>
          </div>
        </div>

        {/* PROFESSIONAL LIST VIEW */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ background: '#f8fafc', padding: '15px 30px', borderBottom: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '40px 1fr 150px 100px', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>
            <span></span>
            <span>NAME</span>
            <span>TYPE</span>
            <span style={{ textAlign: 'right' }}>ACTION</span>
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center' }}><p>Fetching from Drive...</p></div>
          ) : items.length > 0 ? (
            items.map((item) => (
              <div 
                key={item.id} 
                onClick={() => isFolder(item) ? navigateTo(item.name) : setSelectedFile(item)}
                style={{ 
                  display: 'grid', gridTemplateColumns: '40px 1fr 150px 100px', alignItems: 'center', 
                  padding: '18px 30px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                className="list-item-hover"
              >
                <div style={{ color: isFolder(item) ? 'var(--siia-blue)' : '#64748b' }}>
                  {isFolder(item) ? <Folder size={20}/> : isImage(item) ? <ImageIcon size={20}/> : <FileText size={20}/>}
                </div>
                <div style={{ color: 'var(--siia-navy)', fontWeight: '600', fontSize: '14px' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>{isFolder(item) ? 'FOLDER' : isImage(item) ? 'IMAGE' : 'PDF DOCUMENT'}</div>
                <div style={{ textAlign: 'right', color: 'var(--siia-blue)' }}><ChevronRight size={18}/></div>
              </div>
            ))
          ) : (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <Search size={40} color="#cbd5e1" style={{ marginBottom: '10px' }} />
              <p style={{ color: '#94a3b8' }}>This folder is empty.</p>
            </div>
          )}
        </div>

        {/* DYNAMIC CONTENT PREVIEWER (Handles Images and PDFs) */}
        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            >
              <motion.div
                initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                className="card"
                style={{ width: '100%', maxWidth: '1200px', height: '90vh', display: 'flex', flexDirection: 'column', background: '#fff', padding: 0, overflow: 'hidden' }}
              >
                <div style={{ padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isImage(selectedFile) ? <ImageIcon color="var(--siia-blue)"/> : <FileText color="var(--siia-blue)"/>}
                    <h3 style={{ color: 'var(--siia-navy)', margin: 0, fontSize: '1.1rem' }}>{selectedFile.name}</h3>
                  </div>
                  <button onClick={() => setSelectedFile(null)} style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <X size={18}/> CLOSE
                  </button>
                </div>
                
                <div style={{ flex: 1, background: '#f1f5f9', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {isImage(selectedFile) ? (
                    /* Image Viewer */
                    <img 
                      src={`http://localhost:5000/api/drive/proxy/${selectedFile.id}`} 
                      alt={selectedFile.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                    />
                  ) : (
                    /* PDF Viewer */
                    <iframe
                      src={`http://localhost:5000/api/drive/proxy/${selectedFile.id}`}
                      width="100%" height="100%" style={{ border: 'none' }}
                    ></iframe>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default CourseMaterials;
