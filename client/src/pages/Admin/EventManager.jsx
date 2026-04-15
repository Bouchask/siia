import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus, Trash2, MapPin, Clock, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const EventManager = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', event_date: '', image_url: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events/');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDirectDriveLink = (url) => {
    if (!url) return "";
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return `https://lh3.googleusercontent.com/d/${match[1]}`;
    return url;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/events/', newEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewEvent({ title: '', description: '', location: '', event_date: '', image_url: '' });
      fetchEvents();
    } catch (err) {
      alert("Failed to create event.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--siia-navy)', margin: 0 }}>Manage Events</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: '10px' }}>
          <Plus size={18} /> Schedule Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {events.map((e) => (
          <div key={e.id} className="card" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
            {e.image_url && (
              <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                <img src={getDirectDriveLink(e.image_url)} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ padding: '25px' }}>
              <button 
                onClick={() => handleDelete(e.id)} 
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.8)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px', borderRadius: '50%', display: 'flex' }}
              >
                <Trash2 size={18}/>
              </button>
              <h3 style={{ margin: '0 0 15px', color: 'var(--siia-navy)' }}>{e.title}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                  <Clock size={14}/> {new Date(e.event_date).toLocaleString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
                  <MapPin size={14}/> {e.location}
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--siia-text)', margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '40px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2>New Event</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X/></button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Title</label>
                <input type="text" required value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Image Drive Link</label>
                <div style={{ position: 'relative' }}>
                  <LinkIcon size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
                  <input type="text" value={newEvent.image_url} onChange={(e) => setNewEvent({...newEvent, image_url: e.target.value})} placeholder="Paste shared Drive link..." style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Date & Time</label>
                <input type="datetime-local" required value={newEvent.event_date} onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Location</label>
                <input type="text" required value={newEvent.location} onChange={(e) => setNewEvent({...newEvent, location: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
                <textarea required value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', height: '100px', resize: 'none' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Schedule Event</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
