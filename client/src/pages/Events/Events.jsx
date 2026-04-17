import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import PremiumEventCard from '../../components/PremiumEventCard';
import '../Home/Home.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    window.scrollTo(0, 0);
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventService.getAll();
      const sorted = data.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
      setEvents(sorted);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="events-gallery-page" style={{ background: 'var(--siia-bg)', minHeight: '100vh', paddingTop: '100px' }}>
      <div className="home-container">
        
        <header className="section-padding" style={{ paddingBottom: '60px' }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge-premium"
            style={{ marginBottom: '24px' }}
          >
            <Calendar size={14} /> 
            Academic Timeline 2026
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hero-title"
            style={{ marginBottom: '24px' }}
          >
            Experience <br/> <span className="text-gradient">SIIA Events</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hero-subtitle"
          >
            From international seminars to hands-on workshops, explore the events that define our academic excellence and professional growth.
          </motion.p>
        </header>

        {loading ? (
          <div className="announcement-grid">
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '500px', background: '#fff', borderRadius: '24px', animation: 'pulse 1.5s infinite' }}></div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="announcement-grid" style={{ paddingBottom: '100px' }}>
            {events.map((event, index) => (
              <PremiumEventCard key={event.id} event={event} index={index} />
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
            <h3 style={{ fontSize: '1.8rem', color: 'var(--siia-navy)', fontWeight: '900', marginBottom: '12px' }}>The calendar is clear</h3>
            <p style={{ color: 'var(--siia-text)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 32px' }}>We're currently planning upcoming seminars and workshops. Stay tuned for updates.</p>
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

export default Events;
