import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../../services/api';
import timetableService from '../../services/timetableService';
import settingService from '../../services/settingService';
import academicService from '../../services/academicService';
import { motion, AnimatePresence } from 'framer-motion';
import SIIALoader from '../../components/SIIALoader';
import { 
  Calendar, Save, FileText, Link as LinkIcon, 
  Edit3, Eye, CheckCircle, AlertCircle, ChevronRight, 
  Monitor, Info, Plus, Trash2, X, Maximize2, ExternalLink,
  Layers
} from 'lucide-react';

const TimetableManager = () => {
  const [timetables, setTimetables] = useState([]);
  const [settings, setSettings] = useState({});
  const [semesters, setSemesters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States
  const [editData, setEditData] = useState({ name: '', drive_id: '', key: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTT, setNewTT] = useState({ key_suffix: '', drive_id: '', name: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [serviceEmail, setServiceEmail] = useState('');

  // Utility to extract Drive ID from a full link
  const extractDriveId = (input) => {
    if (!input) return '';
    const match = input.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]{25,})/);
    return match ? match[1] : input;
  };

  useEffect(() => { 
    init(); 
    fetchServiceEmail();
  }, []);

  const fetchServiceEmail = async () => {
    try {
      const { email } = await timetableService.getServiceAccount();
      setServiceEmail(email);
    } catch (e) { console.error("Could not fetch service email"); }
  };

  const init = async () => {
    setLoading(true);
    try {
      const [timetablesData, settingsData, semestersData] = await Promise.all([
        timetableService.getAll(),
        settingService.getAll(),
        academicService.getSemesters()
      ]);
      setTimetables(timetablesData);
      setSettings(settingsData);
      setSemesters(semestersData);
      if (timetablesData.length > 0) handleSelect(timetablesData[0], settingsData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSelect = (file, currentSettings) => {
    setSelected(file);
    const settingKey = Object.keys(currentSettings).find(k => currentSettings[k] === file.id && k.startsWith('timetable_')) || '';
    setEditData({ name: file.name, drive_id: file.id, key: settingKey });
  };

  const refreshData = async () => {
    const timetablesData = await timetableService.getAll();
    const settingsData = await settingService.getAll();
    setTimetables(timetablesData);
    setSettings(settingsData);
    setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Syncing Drive changes...' });
    try {
      if (editData.key) {
        await settingService.update({ [editData.key]: editData.drive_id });
      }
      await timetableService.rename(selected.id, editData.name);
      setStatus({ type: 'success', msg: 'Live timetable updated!' });
      refreshData();
    } catch (err) { setStatus({ type: 'error', msg: 'Sync failed.' }); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const driveId = extractDriveId(newTT.drive_id);
    if (!driveId) return alert("Invalid Google Drive ID or Link.");
    
    const fullKey = `timetable_${newTT.key_suffix.toLowerCase()}_id`;
    try {
      // 1. Check permissions first (this will trigger 403 if service account doesn't have access)
      await timetableService.checkPermissions(driveId);

      // 2. Associate ID in Settings
      await settingService.update({ [fullKey]: driveId });
      
      // 3. If a custom name is provided, rename the file on Drive
      if (newTT.name) {
        await timetableService.rename(driveId, newTT.name);
      }

      setShowAddModal(false);
      setNewTT({ key_suffix: '', drive_id: '', name: '' });
      refreshData();
      alert("Timetable connected successfully!");
    } catch (err) { 
      console.error(err);
      const backendError = err.response?.data?.error || "";
      
      if (backendError.includes("Access Denied") || err.response?.status === 403) {
        alert(
          `PERMISSION ERROR: The system cannot access this file.\n\n` +
          `ACTION REQUIRED:\n` +
          `1. Open the file in Google Drive\n` +
          `2. Click 'Share'\n` +
          `3. Add this email as 'Editor':\n   ${serviceEmail || "the system service account"}\n` +
          `4. Try again.`
        );
      } else {
        alert(`Association failed: ${backendError || err.message}`);
      }
    }
  };

  if (loading) return <SIIALoader status="PREPARING SCHEDULE WORKSPACE" />;

  return (
    <div className="tt-studio">
      <header className="tt-header">
        <div>
          <h1>Schedule Workspace</h1>
          <p>Link and organize interactive PDF timetables for the student body.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={async () => {
              if(!window.confirm("Synchronize database schema to support large course lists?")) return;
              try {
                const res = await api.post('/api/settings/migrate');
                alert(res.data.message);
              } catch(e) { alert("Sync failed: " + (e.response?.data?.error || e.message)); }
            }}
            className="tt-add-btn" 
            style={{ background: '#0f172a' }}
          >
            <Layers size={18} /> Sync DB Schema
          </button>
          <button onClick={() => setShowAddModal(true)} className="tt-add-btn">
            <Plus size={18} /> New Schedule Association
          </button>
        </div>
      </header>

      <div className="tt-layout">
        {/* Sidebar: Available Slots */}
        <aside className="tt-slots">
          <div className="label">ACTIVE SCHEDULES</div>
          <div className="slots-list">
            {timetables.map((file) => {
              const key = Object.keys(settings).find(k => settings[k] === file.id);
              return (
                <div 
                  key={file.id} 
                  onClick={() => handleSelect(file, settings)}
                  className={`slot-item ${selected?.id === file.id ? 'active' : ''}`}
                >
                  <div className="slot-icon"><Calendar size={18} /></div>
                  <div className="slot-info">
                    <span className="name">{file.name}</span>
                    <span className="tag">{key?.replace('timetable_', '').replace('_id', '').toUpperCase() || 'EXTERNAL'}</span>
                  </div>
                  {selected?.id === file.id && <ChevronRight size={14} />}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Workspace: PDF Preview & Edit */}
        <main className="tt-canvas">
          <div className="canvas-top">
            <div className="config-panel">
              <div className="panel-head">
                <Edit3 size={16} /> <span>Dynamic Configuration</span>
              </div>
              <form onSubmit={handleUpdate} className="config-form">
                <div className="field">
                  <label>Drive Name</label>
                  <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                </div>
                <div className="field">
                  <label>File ID</label>
                  <input value={editData.drive_id} onChange={e => setEditData({...editData, drive_id: e.target.value})} />
                </div>
                <button type="submit" className="sync-btn"><Save size={14}/> Sync</button>
              </form>
              {status.msg && <div className={`sync-status ${status.type}`}>{status.msg}</div>}
            </div>

            <div className="pdf-workspace">
              <div className="workspace-header">
                <div className="w-title"><Eye size={16}/> Content Verification</div>
                <div className="w-actions">
                  <button onClick={() => window.open(selected?.webViewLink, '_blank')}><ExternalLink size={14}/></button>
                </div>
              </div>
              <div className="iframe-container">
                {selected && (
                  <iframe 
                    key={selected.id}
                    src={`${API_BASE_URL}/api/timetables/proxy/${selected.id}`} 
                    width="100%" height="100%"
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowAddModal(false)} 
              className="drawer-overlay" 
              style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="tt-modal"
              style={{ 
                position: 'relative', 
                width: '480px', 
                maxWidth: '90vw',
                background: '#fff', 
                borderRadius: '32px', 
                padding: '40px', 
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                zIndex: 10001
              }}
            >
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: '#f1f5f9', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>Add Timetable Slot</h2>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>Associate a semester slot with a Google Drive file ID for real-time synchronization.</p>
              
              <form onSubmit={handleAdd} className="modal-form">
                <div className="m-field" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Display Name (Optional)</label>
                  <input 
                    placeholder="e.g. Master S8 Timetable" 
                    value={newTT.name} 
                    onChange={e => setNewTT({...newTT, name: e.target.value})} 
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, fontSize: '14px' }}
                  />
                </div>
                <div className="m-field" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Choose Academic Period</label>
                  <select 
                    value={newTT.key_suffix} 
                    onChange={e => setNewTT({...newTT, key_suffix: e.target.value})} 
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, fontSize: '14px' }}
                  >
                    <option value="">Select Period...</option>
                    {semesters.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="m-field" style={{ marginBottom: '32px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Google Drive Link / File ID</label>
                  <input 
                    placeholder="Paste File ID or Drive Link here..." 
                    value={newTT.drive_id} 
                    onChange={e => setNewTT({...newTT, drive_id: e.target.value})} 
                    required 
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, fontSize: '14px' }}
                  />
                </div>
                <button type="submit" className="m-submit" style={{ width: '100%', padding: '16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <CheckCircle size={18} /> Establish Connection
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .tt-studio { display: flex; flex-direction: column; gap: 40px; height: 100%; }
        
        .tt-header { display: flex; justify-content: space-between; align-items: center; }
        .tt-header h1 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -1.5px; }
        .tt-header p { color: #64748b; font-weight: 500; }
        
        .tt-add-btn { background: #2563eb; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
        .tt-add-btn:hover { background: #1d4ed8; transform: translateY(-2px); }

        .tt-layout { display: grid; grid-template-columns: 320px 1fr; gap: 30px; flex: 1; min-height: 0; }
        
        .tt-slots { background: #fff; border-radius: 24px; padding: 24px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
        .label { font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
        .slots-list { display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; }
        .slot-item { padding: 14px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 15px; border: 1px solid transparent; transition: 0.2s; }
        .slot-item:hover { background: #f8fafc; }
        .slot-item.active { background: #eff6ff; border-color: #dbeafe; }
        .slot-icon { width: 36px; height: 36px; background: #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #64748b; }
        .active .slot-icon { background: #fff; color: #2563eb; }
        .slot-info .name { display: block; font-weight: 700; font-size: 13px; color: #1e293b; }
        .slot-info .tag { font-size: 9px; font-weight: 900; color: #2563eb; }

        .tt-canvas { display: flex; flex-direction: column; gap: 20px; }
        .canvas-top { display: grid; grid-template-columns: 1fr; gap: 20px; height: 100%; }
        
        .config-panel { background: #fff; border-radius: 20px; padding: 20px; border: 1px solid #e2e8f0; }
        .panel-head { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 15px; }
        .config-form { display: flex; gap: 20px; align-items: flex-end; }
        .field { flex: 1; }
        .field label { display: block; font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 5px; text-transform: uppercase; }
        .field input { width: 100%; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; font-weight: 600; outline: none; }
        .sync-btn { background: #0f172a; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        
        .sync-status { margin-top: 10px; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; display: inline-block; }
        .sync-status.success { background: #ecfdf5; color: #059669; }
        .sync-status.info { background: #eff6ff; color: #2563eb; }

        .pdf-workspace { background: #fff; border-radius: 24px; border: 1px solid #e2e8f0; flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 600px; }
        .workspace-header { padding: 15px 25px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .w-title { font-size: 12px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px; }
        .w-actions button { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px; border-radius: 6px; color: #64748b; cursor: pointer; }
        .iframe-container { flex: 1; background: #f1f5f9; }
        .iframe-container iframe { border: none; }

        .studio-init { 
          height: 100vh; 
          display: flex; 
          flex-direction: column;
          align-items: center; 
          justify-content: center; 
          gap: 24px;
          background: #f8fafc;
        }
        .init-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .init-text {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .init-text span {
          font-weight: 900; 
          color: #0f172a; 
          letter-spacing: -0.5px;
          font-size: 1.2rem;
          text-transform: uppercase;
        }
        .init-text small {
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default TimetableManager;
