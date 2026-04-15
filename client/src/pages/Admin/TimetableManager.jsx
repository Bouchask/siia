import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Save, FileText, Link as LinkIcon, 
  Edit3, Eye, CheckCircle, AlertCircle, ChevronRight, 
  Monitor, Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TimetableManager = () => {
  const { token } = useAuth();
  const [timetables, setTimetables] = useState([]);
  const [settings, setSettings] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editData, setEditData] = useState({ name: '', drive_id: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    try {
      const [ttRes, setRes] = await Promise.all([
        axios.get('http://localhost:5000/api/timetables/'),
        axios.get('http://localhost:5000/api/settings/', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTimetables(ttRes.data);
      setSettings(setRes.data);
      
      if (ttRes.data.length > 0) {
        handleSelect(ttRes.data[0], setRes.data);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSelect = (file, currentSettings) => {
    setSelected(file);
    const settingKey = file.name.toLowerCase().includes('s6') ? 'timetable_s6_id' : 'timetable_s8_id';
    setEditData({
      name: file.name,
      drive_id: currentSettings[settingKey] || file.id
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Updating configuration...' });
    
    const settingKey = selected.name.toLowerCase().includes('s6') ? 'timetable_s6_id' : 'timetable_s8_id';
    
    try {
      // 1. Update the Setting (The ID/Link)
      await axios.post('http://localhost:5000/api/settings/', { [settingKey]: editData.drive_id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Rename the file on Drive
      await axios.post(`http://localhost:5000/api/timetables/rename/${selected.id}`, { name: editData.name }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus({ type: 'success', msg: 'Timetable updated! Refreshing preview...' });
      
      // Refresh Data
      const ttRes = await axios.get('http://localhost:5000/api/timetables/');
      const setRes = await axios.get('http://localhost:5000/api/settings/', { headers: { Authorization: `Bearer ${token}` } });
      
      setTimetables(ttRes.data);
      setSettings(setRes.data);
      
      // Update local selection to reflect changes
      const updatedFile = ttRes.data.find(f => f.id === editData.drive_id) || ttRes.data.find(f => f.name === editData.name);
      if (updatedFile) setSelected(updatedFile);

      setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Update failed. Check ID permissions.' });
    }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading Timetables...</div>;

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--siia-navy)', margin: 0, fontSize: '2rem' }}>Timetable Center</h1>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Select a schedule to modify its name, source link, or view its content.</p>
      </header>

      {/* 1. SELECTION CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {timetables.map((file) => (
          <div 
            key={file.id} 
            onClick={() => handleSelect(file, settings)}
            style={{ 
              padding: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px',
              border: selected?.id === file.id ? '2px solid var(--siia-blue)' : '1px solid var(--siia-border)',
              background: selected?.id === file.id ? '#eff6ff' : '#fff'
            }}
            className="card"
          >
            <div style={{ padding: '12px', background: '#fff', borderRadius: '10px', color: 'var(--siia-blue)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <Monitor size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--siia-navy)' }}>{file.name}</h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>ACTIVE VIEW</p>
            </div>
            {selected?.id === file.id && <CheckCircle size={20} color="var(--siia-blue)" />}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* 2. MANAGEMENT CONSOLE */}
        <div className="card" style={{ padding: '35px' }}>
          <h3 style={{ margin: '0 0 25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Edit3 size={20} color="var(--siia-blue)"/> Modify Schedule</h3>
          
          {status.msg && (
            <div style={{ padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', background: status.type === 'success' ? '#ecfdf5' : '#fef2f2', color: status.type === 'success' ? '#059669' : '#dc2626', fontWeight: 'bold' }}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>DISPLAY NAME ON DRIVE</label>
              <input 
                type="text" required value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '8px' }}>GOOGLE DRIVE FILE ID (LINK)</label>
              <div style={{ position: 'relative' }}>
                <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94a3b8' }} />
                <input 
                  type="text" required value={editData.drive_id}
                  onChange={(e) => setEditData({...editData, drive_id: e.target.value})}
                  placeholder="Paste new file ID..."
                  style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '10px' }}>
              <Save size={18} /> Apply Changes
            </button>
          </form>

          <div style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '10px', color: 'var(--siia-navy)', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>
              <Info size={16} color="var(--siia-blue)"/> Help
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
              Updating the File ID will immediately change the schedule shown to students. Ensure the new file is shared with the Service Account.
            </p>
          </div>
        </div>

        {/* 3. LARGE PREVIEW BOX */}
        <div className="card" style={{ padding: '20px', height: '700px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0 10px 15px', borderBottom: '1px solid #f1f5f9', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--siia-navy)', fontWeight: 'bold' }}>
              <Eye size={18} color="var(--siia-blue)"/> Live Content Preview
            </div>
            <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '50px', color: '#94a3b8', fontWeight: 'bold' }}>
              SOURCE: DRIVE PROXY
            </span>
          </div>
          
          <div style={{ flex: 1, background: '#f8fafc', borderRadius: '8px', overflow: 'hidden' }}>
            {selected && (
              <iframe 
                key={selected.id}
                src={`http://localhost:5000/api/timetables/proxy/${selected.id}`} 
                width="100%" height="100%" style={{ border: 'none' }}
              ></iframe>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimetableManager;
