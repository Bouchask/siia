import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { convertDriveLink } from './CustomBlockEditor/utils';
import './PremiumEventCard.css';

const PremiumEventCard = ({ event, index }) => {
  const dateObj = new Date(event.event_date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
      whileHover={{ y: -8 }}
      className="premium-event-card"
    >
      <Link to={`/events/${event.id}`} className="card-image-wrap">
        <div className="card-img-overlay" />
        <div 
          className="card-actual-img" 
          style={{ backgroundImage: `url(${convertDriveLink(event.image_url) || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'})` }} 
        />
        <div className="card-date-float">
          <span className="day">{day}</span>
          <span className="month">{month}</span>
        </div>
      </Link>
      
      <div className="card-content-area">
        <div className="card-meta-top">
          <span className="meta-item"><Clock size={12} /> {time}</span>
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
  );
};

export default PremiumEventCard;
