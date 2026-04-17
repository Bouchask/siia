import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { convertDriveLink } from './CustomBlockEditor/utils';
import './AnnouncementCard.css';

const AnnouncementCard = ({ announcement, index = 0 }) => {
  const { id, title, excerpt, content, image_url, created_at, author_name } = announcement;
  const hasImage = !!image_url;

  const getSafeDescription = () => {
    if (excerpt && excerpt.length > 0) return excerpt;
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      const extract = (node) => {
        if (!node) return "";
        if (node.type === 'text') return node.content || node.text || "";
        if (Array.isArray(node)) return node.map(extract).join(" ");
        if (node.content && typeof node.content !== 'string') return extract(node.content);
        if (node.children) return extract(node.children);
        return "";
      };
      let text = extract(parsed).trim();
      text = text.replace(/<[^>]+>/g, ''); 
      return text.length > 120 ? text.substring(0, 120) + "..." : text;
    } catch (e) {
      return "Exploring the latest updates and academic highlights from the SIIA community...";
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
      className={`announcement-card-v2 ${!hasImage ? 'text-only' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.45, 0.32, 0.9] }}
      whileHover={{ y: -12 }}
    >
      {hasImage && (
        <div className="card-media-v2">
          <img src={convertDriveLink(image_url)} alt={title} className="card-img-v2" />
          <div className="card-glass-tag">
            <Clock size={12} />
            <span>Latest Update</span>
          </div>
        </div>
      )}

      <div className="card-body-v2">
        <div className="card-meta-v2">
          <div className="meta-pill">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
          <div className="meta-pill author">
            <User size={12} />
            <span>{author_name || "SIIA Official"}</span>
          </div>
        </div>
        
        <h3 className="card-title-v2">{title}</h3>
        
        <p className="card-desc-v2">
          {description}
        </p>

        <div className="card-footer-v2">
          <Link to={`/news/${id}`} className="card-action-link-v2">
            <span className="link-text">Read Full Story</span>
            <div className="link-circle">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementCard;
