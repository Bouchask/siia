import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Bookmark } from 'lucide-react';
import DOMPurify from 'dompurify';
import { convertDriveLink } from '../../components/CustomBlockEditor/utils';

/**
 * PURE HTML RENDERER UTILITY (Shared)
 */
const blocksToHtml = (content) => {
  if (!content) return "";
  try {
    let parsed = content;
    if (typeof content === 'string' && (content.startsWith('[') || content.startsWith('{'))) {
      parsed = JSON.parse(content);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
    }

    if (Array.isArray(parsed)) {
      return parsed.map(block => {
        switch (block.type) {
          case 'text':
            return `<div class="content-text" style="margin-bottom: 20px; line-height: 1.8; font-size: 17px; color: #334155;">${block.content || ''}</div>`;
          case 'image':
            return `<div class="content-image" style="margin: 32px 0; text-align: center;">
                      <img src="${convertDriveLink(block.src)}" style="max-width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
                    </div>`;
          case 'row':
            const cols = (block.children || []).map(child => `<div style="flex: 1; min-width: 300px;">${blocksToHtml([child])}</div>`).join('');
            return `<div class="content-row" style="display: flex; gap: 32px; flex-wrap: wrap; margin: 32px 0;">${cols}</div>`;
          case 'table':
            const rows = (block.data || []).map(row => `<tr>${row.map(cell => `<td style="border: 1px solid #e2e8f0; padding: 12px;">${cell}</td>`).join('')}</tr>`).join('');
            return `<div style="overflow-x: auto; margin: 32px 0;"><table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">${rows}</table></div>`;
          default: return "";
        }
      }).join('');
    }
    return typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
  } catch (e) { return "Error rendering content."; }
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchEvent();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-state">Loading event details...</div>;
  if (!event) return <div className="not-found">Event not found.</div>;

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(event.title);
    const location = encodeURIComponent(event.location);
    const details = encodeURIComponent("Join us for this event at SIIA.");
    
    // Google Calendar expects dates in YYYYMMDDTHHmmSSZ format
    const startDate = new Date(event.event_date);
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Default 2 hours duration
    
    const formatGD = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGD(startDate)}/${formatGD(endDate)}&details=${details}&location=${location}&sf=true&output=xml`;
    
    window.open(url, '_blank');
  };

  const htmlContent = blocksToHtml(event.description);
  const cleanHtml = DOMPurify.sanitize(htmlContent);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="event-detail-page">
      <div className="event-hero" style={{ 
        backgroundImage: event.image_url ? `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url(${convertDriveLink(event.image_url)})` : 'linear-gradient(135deg, #1e293b, #334155)',
        height: '500px', display: 'flex', alignItems: 'flex-end', paddingBottom: '80px', backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <div className="home-container">
          <button onClick={() => navigate('/events')} className="back-btn"><ArrowLeft size={16} /> Back to Calendar</button>
          <div className="hero-meta-tags">
            <span className="event-type-badge">Official Event</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: '4rem', fontWeight: 900, marginTop: '20px', lineHeight: 1.1 }}>{event.title}</h1>
        </div>
      </div>

      <div className="home-container" style={{ marginTop: '-60px', paddingBottom: '100px' }}>
        <div className="detail-grid">
          <div className="content-card-main">
            <div className="prose-view" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
          </div>

          <aside className="logistics-sidebar">
            <div className="logistics-card">
              <h3>Logistics</h3>
              <div className="l-item">
                <Calendar size={20} />
                <div>
                  <label>Date</label>
                  <p>{new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="l-item">
                <Clock size={20} />
                <div>
                  <label>Time</label>
                  <p>{new Date(event.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="l-item">
                <MapPin size={20} />
                <div>
                  <label>Venue</label>
                  <p>{event.location}</p>
                </div>
              </div>
              <button onClick={handleAddToCalendar} className="add-calendar-btn">Add to Google Calendar</button>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .event-detail-page { background: #f8fafc; min-height: 100vh; }
        .back-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 20px; border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 700; transition: 0.2s; margin-bottom: 30px; backdrop-filter: blur(10px); }
        .event-type-badge { background: #2563eb; color: #fff; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        
        .detail-grid { display: grid; grid-template-columns: 1fr 350px; gap: 40px; }
        .content-card-main { background: #fff; border-radius: 24px; padding: 60px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.08); }
        
        .logistics-card { background: #fff; border-radius: 24px; padding: 30px; position: sticky; top: 120px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .logistics-card h3 { font-size: 1.2rem; color: #1e293b; font-weight: 800; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; }
        .l-item { display: flex; gap: 15px; margin-bottom: 20px; align-items: flex-start; color: #64748b; }
        .l-item label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; display: block; }
        .l-item p { color: #1e293b; font-weight: 600; font-size: 15px; margin: 2px 0 0; }
        .add-calendar-btn { width: 100%; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; color: #1e293b; font-weight: 700; font-size: 14px; cursor: pointer; margin-top: 10px; transition: 0.2s; }
        .add-calendar-btn:hover { background: #eff6ff; border-color: #2563eb; color: #2563eb; }

        .prose-view { color: #334155; line-height: 1.8; font-size: 18px; }
        .loading-state { height: 100vh; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
      `}</style>
    </motion.div>
  );
};

export default EventDetail;
