import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { convertDriveLink } from './CustomBlockEditor/utils';
import './AnnouncementCard.css';

const AnnouncementCard = ({ announcement }) => {
  const { id, title, excerpt, content, image_url, created_at } = announcement;
  const hasImage = !!image_url;

  const getSafeDescription = () => {
    if (excerpt && excerpt.length > 0) return excerpt;
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      const extract = (node) => {
        if (!node) return "";
        if (node.type === 'text') return node.content || node.text || ""; // Support both formats
        if (Array.isArray(node)) return node.map(extract).join(" ");
        if (node.content && typeof node.content !== 'string') return extract(node.content);
        if (node.children) return extract(node.children);
        return "";
      };
      // Clean up HTML tags if any (CustomBlockEditor format has HTML inside 'content')
      let text = extract(parsed).trim();
      text = text.replace(/<[^>]+>/g, ''); 
      return text.length > 150 ? text.substring(0, 150) + "..." : text;
    } catch (e) {
      return "Exploring the future of architecture and design at SIIA...";
    }
  };

  const description = getSafeDescription();
  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div 
      className={`announcement-card ${!hasImage ? 'text-only' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {hasImage && (
        <div className="card-media">
          <img src={convertDriveLink(image_url)} alt={title} className="card-img" />
          <div className="card-tag">
            <Tag size={10} />
            <span>Update</span>
          </div>
        </div>
      )}

      <div className="card-content">
        <div className="card-meta">
          <Calendar size={14} className="meta-icon" />
          <span>{formattedDate}</span>
        </div>
        
        <h3 className="card-heading">{title}</h3>
        
        <p className="card-summary">
          {description}
        </p>

        <div className="card-actions">
          <Link to={`/news/${id}`} className="card-link">
            <span>Discover Experience</span>
            <div className="link-arrow">
              <ArrowRight size={18} />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementCard;