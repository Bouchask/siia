import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Trash2, Link as LinkIcon, 
  Save, FileText, CheckCircle, ChevronRight, 
  MessageSquare, Users, Shield, GraduationCap,
  Info, X, Layers, DownloadCloud, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CourseManager = () => {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');

  // Advanced Material State
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [materials, setMaterials] = useState({
    lectures: [], // [{ id, title, drive_id }]
    tds: [],
    tps: []
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (token) init();
  }, [token]);

  const init = async () => {
    try {
      const [cRes, setRes] = await Promise.all([
        axios.get('http://localhost:5000/api/academic/courses'),
        axios.get('http://localhost:5000/api/settings/', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setCourses(cRes.data);
      setSettings(setRes.data);
      if (cRes.data.length > 0) handleCourseSelect(cRes.data[0], setRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCourseSelect = (course, currentSettings) => {
    setSelectedCourse(course);
    const key = `course_${course.id}_data`;
    try {
      const rawData = currentSettings[key];
      if (rawData) {
        setMaterials(JSON.parse(rawData));
      } else {
        setMaterials({ lectures: [], tds: [], tps: [] });
      }
    } catch (e) {
      setMaterials({ lectures: [], tds: [], tps: [] });
    }
  };

  const addMaterialItem = (category) => {
    const newItem = { id: Date.now(), title: '', drive_id: '' };
    setMaterials({ ...materials, [category]: [...materials[category], newItem] });
  };

  const updateMaterialItem = (category, id, field, value) => {
    const updated = materials[category].map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setMaterials({ ...materials, [category]: updated });
  };

  const removeMaterialItem = (category, id) => {
    setMaterials({ ...materials, [category]: materials[category].filter(i => i.id !== id) });
  };

  const handleSaveMaterials = async () => {
    setStatus({ type: 'info', msg: 'Publishing library updates...' });
    const key = `course_${selectedCourse.id}_data`;
    const payload = { [key]: JSON.stringify(materials) };

    try {
      await axios.post('http://localhost:5000/api/settings/', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', msg: 'Materials updated successfully!' });
      const setRes = await axios.get('http://localhost:5000/api/settings/', { headers: { Authorization: `Bearer ${token}` } });
      setSettings(setRes.data);
      setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: 'Publishing failed.' });
    }
  };

  if (loading) return <div className="studio-init">Entering Professor Studio...</div>;

  return (
    <div className="course-manager-v2">
      <header className="manager-header">
        <div>
          <h1>Experience Designer <span className="highlight">/ Courses</span></h1>
          <p>Curate and manage multi-part learning paths for your students.</p>
        </div>
        <div className="user-profile-badge">
          <div className="avatar">{user?.first_name?.[0]}</div>
          <div className="info">
            <span className="name">{user?.first_name} {user?.last_name}</span>
            <span className="role">Senior Faculty</span>
          </div>
        </div>
      </header>

      <div className="manager-layout">
        {/* Sidebar: Course Index */}
        <aside className="course-index">
          <div className="index-label">Academic Portfolio</div>
          <div className="index-list">
            {courses.map(c => (
              <div 
                key={c.id} 
                onClick={() => handleCourseSelect(c, settings)}
                className={`index-item ${selectedCourse?.id === c.id ? 'active' : ''}`}
              >
                <div className="item-icon"><Layers size={18} /></div>
                <div className="item-text">
                  <span className="title">{c.name}</span>
                  <span className="meta">{c.semester_name} • 2026</span>
                </div>
                {selectedCourse?.id === c.id && <div className="active-dot" />}
              </div>
            ))}
          </div>
        </aside>

        {/* Main: Advanced Editor */}
        <main className="editor-canvas">
          <div className="editor-card">
            <div className="card-top">
              <div className="title-area">
                <span className="badge">{selectedCourse?.semester_name}</span>
                <h2>{selectedCourse?.name}</h2>
              </div>
              <button onClick={handleSaveMaterials} className="save-btn">
                <Save size={18} /> Publish All Changes
              </button>
            </div>

            {status.msg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`status-pill ${status.type}`}>
                {status.msg}
              </motion.div>
            )}

            <div className="editor-sections">
              {/* Material Categories */}
              {['lectures', 'tds', 'tps'].map((cat) => (
                <div key={cat} className="category-section">
                  <div className="section-header">
                    <h3>{cat.toUpperCase()} <span className="count">{materials[cat].length}</span></h3>
                    <button onClick={() => addMaterialItem(cat)} className="add-part-btn"><Plus size={14}/> Add Part</button>
                  </div>

                  <div className="items-list">
                    <AnimatePresence>
                      {materials[cat].map((item) => (
                        <motion.div 
                          key={item.id} 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="material-item-row"
                        >
                          <div className="drag-handle"><Layers size={14} /></div>
                          <input 
                            value={item.title} 
                            onChange={(e) => updateMaterialItem(cat, item.id, 'title', e.target.value)}
                            placeholder="Part Title (e.g. Chapter 1: Intro)" 
                            className="title-input"
                          />
                          <div className="id-wrap">
                            <LinkIcon size={12} />
                            <input 
                              value={item.drive_id} 
                              onChange={(e) => updateMaterialItem(cat, item.id, 'drive_id', e.target.value)}
                              placeholder="Drive Link/ID" 
                              className="id-input"
                            />
                          </div>
                          <button onClick={() => removeMaterialItem(cat, item.id)} className="delete-btn"><X size={14}/></button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {materials[cat].length === 0 && <div className="empty-category">No materials added yet.</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .course-manager-v2 { padding: 0; display: flex; flex-direction: column; gap: 40px; }
        
        .manager-header { display: flex; justify-content: space-between; align-items: center; }
        .manager-header h1 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -1.5px; }
        .manager-header h1 .highlight { color: #2563eb; }
        .manager-header p { color: #64748b; margin-top: 5px; font-weight: 500; }
        
        .user-profile-badge { display: flex; align-items: center; gap: 15px; background: #fff; padding: 8px 20px 8px 8px; border-radius: 50px; border: 1px solid #e2e8f0; }
        .avatar { width: 40px; height: 40px; background: #0f172a; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; }
        .user-profile-badge .name { display: block; font-weight: 800; font-size: 13px; color: #1e293b; }
        .user-profile-badge .role { display: block; font-size: 10px; font-weight: 800; color: #2563eb; text-transform: uppercase; }

        .manager-layout { display: grid; grid-template-columns: 320px 1fr; gap: 40px; }
        
        .course-index { background: #fff; border-radius: 24px; padding: 24px; border: 1px solid #e2e8f0; align-self: start; }
        .index-label { font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
        .index-list { display: flex; flex-direction: column; gap: 8px; }
        .index-item { padding: 12px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 15px; transition: 0.2s; position: relative; }
        .index-item:hover { background: #f8fafc; }
        .index-item.active { background: #0f172a; color: #fff; }
        .item-icon { width: 34px; height: 34px; background: #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #64748b; }
        .active .item-icon { background: rgba(255,255,255,0.1); color: #fff; }
        .item-text .title { display: block; font-weight: 700; font-size: 13px; }
        .item-text .meta { font-size: 11px; opacity: 0.6; font-weight: 600; }
        .active-dot { position: absolute; right: 15px; width: 6px; height: 6px; background: #2563eb; border-radius: 50%; box-shadow: 0 0 10px #2563eb; }

        .editor-canvas { display: flex; flex-direction: column; gap: 30px; }
        .editor-card { background: #fff; border-radius: 30px; border: 1px solid #e2e8f0; padding: 50px; box-shadow: 0 20px 50px rgba(0,0,0,0.02); }
        
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .card-top h2 { font-size: 2rem; font-weight: 900; color: #0f172a; margin: 10px 0 0; }
        .card-top .badge { background: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 900; text-transform: uppercase; }
        
        .save-btn { background: #2563eb; color: #fff; border: none; padding: 14px 28px; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; }
        .save-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(37,99,235,0.2); }

        .status-pill { padding: 12px 20px; border-radius: 12px; margin-bottom: 30px; font-weight: 700; font-size: 14px; }
        .status-pill.success { background: #ecfdf5; color: #059669; }
        .status-pill.info { background: #eff6ff; color: #2563eb; }

        .editor-sections { display: flex; flex-direction: column; gap: 40px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; }
        .section-header h3 { font-size: 13px; font-weight: 900; color: #94a3b8; letter-spacing: 1px; }
        .section-header .count { margin-left: 10px; background: #f1f5f9; padding: 2px 8px; border-radius: 4px; color: #64748b; font-size: 10px; }
        
        .add-part-btn { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 800; color: #1e293b; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
        .add-part-btn:hover { background: #eff6ff; border-color: #2563eb; color: #2563eb; }

        .material-item-row { display: flex; align-items: center; gap: 15px; background: #fff; border: 1px solid #f1f5f9; padding: 12px; border-radius: 15px; margin-bottom: 10px; transition: 0.2s; }
        .material-item-row:hover { border-color: #e2e8f0; box-shadow: 0 5px 15px rgba(0,0,0,0.02); }
        .drag-handle { color: #cbd5e1; cursor: grab; }
        .title-input { flex: 1; border: none; outline: none; font-weight: 700; font-size: 14px; color: #1e293b; }
        .id-wrap { display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 8px 15px; border-radius: 10px; width: 250px; }
        .id-wrap input { background: transparent; border: none; outline: none; font-size: 11px; font-family: monospace; color: #64748b; width: 100%; }
        .delete-btn { background: none; border: none; color: #cbd5e1; cursor: pointer; padding: 5px; transition: 0.2s; }
        .delete-btn:hover { color: #ef4444; background: #fef2f2; border-radius: 6px; }
        
        .empty-category { text-align: center; padding: 30px; color: #cbd5e1; font-size: 13px; font-weight: 500; font-style: italic; }
        .studio-init { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #2563eb; letter-spacing: 2px; }
      `}</style>
    </div>
  );
};

export default CourseManager;
