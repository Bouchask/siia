import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  ChevronRight,
  Info,
  CheckCircle,
  Users
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/announcements/');
        setAnnouncements(response.data.slice(0, 3)); // Only show top 3 on home
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="home-wrapper">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="home-container">
          <div className="hero-grid">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-content"
            >
              <span className="badge">Parcours d'Excellence</span>
              <h1 className="hero-title">Welcome to the <br/> SIIA Community</h1>
              <p className="hero-subtitle">
                Shaping the future of Artificial Intelligence and Information Systems. Join Morocco's 
                premier hub for academic innovation and professional excellence.
              </p>
              <div className="hero-actions">
                <Link to="/announcements" className="btn btn-primary">Discover the Major <ArrowRight style={{marginLeft: '10px'}} size={18} /></Link>
                <Link to="/courses" className="btn btn-secondary">Student Resources</Link>
              </div>
            </motion.div>
            
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200" 
                alt="Students" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. ANNOUNCEMENTS */}
      <section className="section-padding">
        <div className="home-container">
          <div className="section-header">
            <div>
              <p style={{color: 'var(--siia-blue)', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', marginBottom: '10px'}}>UPDATES</p>
              <h2 style={{fontSize: '2.5rem', color: 'var(--siia-navy)'}}>Latest Announcements</h2>
            </div>
            <Link to="/announcements" style={{color: 'var(--siia-blue)', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
              View all <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
             <div style={{textAlign: 'center', padding: '40px'}}><p>Loading news...</p></div>
          ) : announcements.length > 0 ? (
            <div className="announcement-grid">
              {announcements.map((item) => (
                <div key={item.id} className="announcement-card">
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
                    <span className="badge">News</span>
                    <span style={{color: '#94a3b8', fontSize: '13px'}}>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 style={{fontSize: '1.25rem', marginBottom: '15px', lineHeight: '1.4', color: 'var(--siia-navy)'}}>{item.title}</h3>
                  <Link to={`/news/${item.id}`} style={{fontSize: '14px', fontWeight: 'bold', color: '#64748b', textDecoration: 'none'}}>Read More</Link>
                </div>
              ))}
            </div>
          ) : (
            <div style={{textAlign: 'center', padding: '60px', background: 'var(--siia-light)', borderRadius: '12px', border: '2px dashed #e2e8f0'}}>
              <Info size={48} color="#cbd5e1" style={{marginBottom: '15px'}} />
              <p style={{color: '#94a3b8'}}>No new announcements at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. FEATURES */}
      <section className="section-padding features-section">
        <div className="home-container">
          <div style={{textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px'}}>
            <h2 style={{fontSize: '2.5rem', marginBottom: '20px', color: 'var(--siia-navy)'}}>Integrated Academic Hub</h2>
            <p style={{color: 'var(--siia-text)', fontSize: '1.1rem'}}>Experience a modern, digital environment designed for your productivity and success.</p>
          </div>

          <div className="features-grid">
            <div className="feature-item">
              <div style={{width: '60px', height: '60px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
                <Calendar color="#2563eb" size={30} />
              </div>
              <h3>Real-time Timetables</h3>
              <p style={{color: 'var(--siia-text)'}}>Access the most recent class schedules updated by the administration.</p>
            </div>
            <div className="feature-item">
              <div style={{width: '60px', height: '60px', background: '#f5f3ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
                <BookOpen color="#7c3aed" size={30} />
              </div>
              <h3>Course Library</h3>
              <p style={{color: 'var(--siia-text)'}}>Browse course modules directly from our integrated Google Drive system.</p>
            </div>
            <div className="feature-item">
              <div style={{width: '60px', height: '60px', background: '#fffbeb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'}}>
                <Bell color="#d97706" size={30} />
              </div>
              <h3>Department News</h3>
              <p style={{color: 'var(--siia-text)'}}>Stay informed with official notifications from professors and faculty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXCELLENCE */}
      <section className="section-padding">
        <div className="home-container">
          <div className="excellence-grid">
            <div className="excellence-content">
              <h2 style={{fontSize: '2.5rem', marginBottom: '30px', color: 'var(--siia-navy)', lineHeight: '1.2'}}>The Parcours d'Excellence <br/> Standard of Education</h2>
              <div style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
                <CheckCircle color="#2563eb" size={24} style={{marginTop: '5px'}} />
                <div>
                  <h4 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px'}}>Rigorous Selection</h4>
                  <p style={{color: 'var(--siia-text)'}}>Only the top-tier candidates are admitted, ensuring a community of high-achievers.</p>
                </div>
              </div>
              <div style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
                <CheckCircle color="#2563eb" size={24} style={{marginTop: '5px'}} />
                <div>
                  <h4 style={{fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '5px'}}>Industry Alignment</h4>
                  <p style={{color: 'var(--siia-text)'}}>Our curriculum is designed in partnership with industry experts in Data Science and AI.</p>
                </div>
              </div>
              <Link to="/courses" className="btn btn-primary" style={{marginTop: '20px'}}>Learn about curriculum</Link>
            </div>
            <div className="excellence-image">
              <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=600" alt="Campus" style={{marginTop: '40px'}} />
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600" alt="Library" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding: '60px 0', borderTop: '1px solid var(--siia-border)', textAlign: 'center'}}>
        <div className="home-container">
          <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--siia-navy)', marginBottom: '10px'}}>SIIA DEPARTMENT</h3>
          <p style={{color: '#94a3b8', fontSize: '14px'}}>© 2026 Parcours d'Excellence Information Systems & AI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
