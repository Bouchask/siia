import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Info, Clock } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { convertDriveLink } from '../../components/CustomBlockEditor/utils';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/');
        // Sort events by date (nearest first)
        const sorted = response.data.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
        setEvents(sorted);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-gallery-page">
      <div className="home-container">
        
        <header className="gallery-header">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gallery-badge"
          >
            <Calendar size={14} /> 
            <span>Academic Timeline 2026</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Experience <br/> SIIA Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            From international seminars to hands-on workshops, stay connected with our academic community.
          </motion.p>
        </header>

        {loading ? (
          <div className="gallery-loading">
            <div className="loader-spiral"></div>
            <p>Syncing calendar data...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="events-grid-system">
            {events.map((event, index) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="premium-event-card"
              >
                <Link to={`/events/${event.id}`} className="card-image-wrap">
                  <div className="card-img-overlay" />
                  <div 
                    className="card-actual-img" 
                    style={{ backgroundImage: `url(${convertDriveLink(event.image_url) || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'})` }} 
                  />
                  <div className="card-date-float">
                    <span className="day">{new Date(event.event_date).getDate()}</span>
                    <span className="month">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}</span>
                  </div>
                </Link>
                
                <div className="card-content-area">
                  <div className="card-meta-top">
                    <span className="meta-item"><Clock size={12} /> {new Date(event.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="meta-divider">•</span>
                    <span className="meta-item"><MapPin size={12} /> {event.location}</span>
                  </div>
                  
                  <h3 className="card-title">{event.title}</h3>
                  
                  <Link to={`/events/${event.id}`} className="card-cta-btn">
                    <span>View Event Details</span>
                    <div className="btn-icon">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="gallery-empty-state">
            <Info size={48} />
            <h3>No events scheduled</h3>
            <p>The academic calendar is currently clear. Please check back later.</p>
          </div>
        )}
      </div>

      <style>{`
        .events-gallery-page { 
          background: #fff; 
          min-height: 100vh; 
          padding: 160px 0 100px;
        }
        
        .gallery-header { 
          max-width: 800px; 
          margin-bottom: 100px; 
        }
        .gallery-badge { 
          display: inline-flex; 
          align-items: center; 
          gap: 8px; 
          background: #eff6ff; 
          color: #2563eb; 
          padding: 6px 16px; 
          border-radius: 100px; 
          font-size: 12px; 
          font-weight: 800; 
          text-transform: uppercase; 
          letter-spacing: 1px;
          margin-bottom: 24px;
        }
        .gallery-header h1 { 
          font-size: 4.5rem; 
          color: #0f172a; 
          font-weight: 900; 
          line-height: 1; 
          margin: 0;
          letter-spacing: -2px;
        }
        .gallery-header p { 
          font-size: 1.25rem; 
          color: #64748b; 
          margin-top: 24px; 
          line-height: 1.6;
        }

        .events-grid-system { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 32px; 
        }

        @media (max-width: 1100px) { .events-grid-system { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { 
          .events-grid-system { grid-template-columns: 1fr; } 
          .gallery-header h1 { font-size: 3rem; }
        }

        .premium-event-card { 
          background: #fff; 
          border-radius: 20px; 
          overflow: hidden; 
          display: flex; 
          flex-direction: column;
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .premium-event-card:hover { 
          border-color: #e2e8f0;
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
        }

        .card-image-wrap { 
          position: relative; 
          height: 260px; 
          overflow: hidden; 
          display: block;
        }
        .card-actual-img { 
          width: 100%; 
          height: 100%; 
          background-size: cover; 
          background-position: center; 
          transition: transform 0.6s ease;
        }
        .premium-event-card:hover .card-actual-img { transform: scale(1.1); }
        .card-img-overlay { 
          position: absolute; inset: 0; 
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.2)); 
          z-index: 1;
        }

        .card-date-float { 
          position: absolute; 
          top: 20px; left: 20px; 
          background: #fff; 
          width: 55px; height: 65px; 
          border-radius: 12px; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          z-index: 2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .card-date-float .day { font-size: 20px; font-weight: 900; color: #0f172a; line-height: 1; }
        .card-date-float .month { font-size: 11px; font-weight: 800; color: #2563eb; text-transform: uppercase; margin-top: 2px; }

        .card-content-area { padding: 30px; flex: 1; display: flex; flex-direction: column; }
        .card-meta-top { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          color: #94a3b8; 
          font-size: 12px; 
          font-weight: 700; 
          margin-bottom: 16px; 
          text-transform: uppercase;
        }
        .meta-item { display: flex; align-items: center; gap: 6px; }
        .card-title { 
          font-size: 1.4rem; 
          color: #0f172a; 
          font-weight: 800; 
          line-height: 1.3; 
          margin: 0 0 24px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .card-cta-btn { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          background: #f8fafc; 
          padding: 12px 20px; 
          border-radius: 12px; 
          text-decoration: none; 
          color: #0f172a; 
          font-weight: 800; 
          font-size: 13px;
          transition: 0.3s;
        }
        .card-cta-btn:hover { background: #0f172a; color: #fff; }
        .btn-icon { 
          background: #fff; 
          width: 24px; height: 24px; 
          border-radius: 6px; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          color: #0f172a;
        }
        .card-cta-btn:hover .btn-icon { background: #2563eb; color: #fff; }

        .gallery-loading { height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; }
        .loader-spiral { width: 30px; height: 30px; border: 3px solid #f1f5f9; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s infinite linear; margin-bottom: 16px; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .gallery-empty-state { padding: 100px; text-align: center; background: #f8fafc; border-radius: 30px; color: #94a3b8; }
        .gallery-empty-state h3 { color: #0f172a; margin: 20px 0 8px; }
      `}</style>
    </div>
  );
};

export default Events;
