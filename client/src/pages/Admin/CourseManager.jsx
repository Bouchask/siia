import React, { useState, useEffect } from 'react';
import courseService from '../../services/courseService';
import settingService from '../../services/settingService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Trash2, Link as LinkIcon, 
  Save, FileText, CheckCircle, ChevronRight, 
  MessageSquare, Users, Shield, GraduationCap,
  Info, X, Layers, DownloadCloud, ExternalLink,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CourseManager = () => {
  const { token, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterProfessor, setFilterProfessor] = useState('all');

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
      const [coursesData, settingsData] = await Promise.all([
        courseService.getAll(),
        settingService.getAll()
      ]);
      
      // Role-based filtering
      let availableCourses = coursesData;
      if (user?.role === 'professor') {
        availableCourses = availableCourses.filter(c => c.professor_id === user.id);
      }
      
      setCourses(availableCourses);
      setSettings(settingsData);
      if (availableCourses.length > 0) handleCourseSelect(availableCourses[0], settingsData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = filterSemester === 'all' || c.semester_name === filterSemester;
    const matchesProf = filterProfessor === 'all' || c.professor_name === filterProfessor;
    return matchesSearch && matchesSemester && matchesProf;
  });

  // Grouping logic for the sidebar
  const groupedCourses = filteredCourses.reduce((acc, course) => {
    const sem = course.semester_name || 'Unassigned';
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(course);
    return acc;
  }, {});

  const semesters = [...new Set(courses.map(c => c.semester_name))].sort();
  const professors = [...new Set(courses.map(c => c.professor_name))].sort();

  // Utility to compress JSON data to fit in small DB columns
  const shortenMaterials = (data) => {
    const short = { l: [], d: [], p: [] }; // l=lectures, d=tds, p=tps
    data.lectures.forEach(i => short.l.push({ t: i.title, i: i.drive_id }));
    data.tds.forEach(i => short.d.push({ t: i.title, i: i.drive_id }));
    data.tps.forEach(i => short.p.push({ t: i.title, i: i.drive_id }));
    return JSON.stringify(short);
  };

  const expandMaterials = (raw) => {
    try {
      const data = JSON.parse(raw);
      // Support both old long format and new short format
      if (data.l || data.d || data.p) {
        return {
          lectures: (data.l || []).map((i, idx) => ({ id: idx, title: i.t, drive_id: i.i })),
          tds: (data.d || []).map((i, idx) => ({ id: idx, title: i.t, drive_id: i.i })),
          tps: (data.p || []).map((i, idx) => ({ id: idx, title: i.t, drive_id: i.i }))
        };
      }
      return data; // Return as is if it's the old format
    } catch (e) {
      return { lectures: [], tds: [], tps: [] };
    }
  };

  const handleCourseSelect = (course, currentSettings) => {
    setSelectedCourse(course);
    const key = `course_${course.id}_data`;
    const rawData = currentSettings[key];
    if (rawData) {
      setMaterials(expandMaterials(rawData));
    } else {
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

  const handleDeleteCourse = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this course and all its material associations?")) return;
    
    try {
      await courseService.delete(id);
      const remaining = courses.filter(c => c.id !== id);
      setCourses(remaining);
      if (selectedCourse?.id === id) {
        if (remaining.length > 0) handleCourseSelect(remaining[0], settings);
        else setSelectedCourse(null);
      }
      alert("Course deleted successfully.");
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleSaveMaterials = async () => {
    setStatus({ type: 'info', msg: 'Publishing library updates...' });
    const key = `course_${selectedCourse.id}_data`;
    
    // COMPRESSION: Use shortenMaterials to fit more items in DB
    const compressedData = shortenMaterials(materials);
    const payload = { [key]: compressedData };

    try {
      await settingService.update(payload);
      setStatus({ type: 'success', msg: 'Materials updated successfully!' });
      const settingsData = await settingService.getAll();
      setSettings(settingsData);
      setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
    } catch (err) {
      console.error("Publishing error:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.details || err.message || "Unknown error";
      setStatus({ type: 'error', msg: `Publishing failed: ${errorMsg}` });
    }
  };

  if (loading) return <div className="studio-init">Entering Professor Studio...</div>;

  return (
    <div className="course-manager-v2">
      <header className="manager-header">
        <div>
          <h1>Studio Portfolio <span className="highlight">/ Courses</span></h1>
          <p>{user?.role === 'admin' ? 'Universal Management Console' : `Manage learning paths for ${user?.first_name}'s assigned courses`}</p>
        </div>
        <div className="role-indicator">
          <Shield size={14} /> {user?.role.toUpperCase()} ACCESS
        </div>
      </header>

      <div className="manager-layout">
        {/* Sidebar: Course Index with Filtering */}
        <aside className="course-index">
          <div className="sidebar-controls">
            <div className="search-pill">
              <Search size={14} />
              <input 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-group">
              <select value={filterSemester} onChange={e => setFilterSemester(e.target.value)}>
                <option value="all">All Semesters</option>
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {user?.role === 'admin' && (
                <select value={filterProfessor} onChange={e => setFilterProfessor(e.target.value)}>
                  <option value="all">All Faculty</option>
                  {professors.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="index-container">
            {Object.entries(groupedCourses).length > 0 ? (
              Object.entries(groupedCourses).map(([semester, items]) => (
                <div key={semester} className="semester-group">
                  <div className="group-label">{semester}</div>
                  <div className="index-list">
                    {items.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => handleCourseSelect(c, settings)}
                        className={`index-item ${selectedCourse?.id === c.id ? 'active' : ''}`}
                      >
                        <div className="item-text">
                          <span className="title">{c.name}</span>
                          <span className="meta">{c.professor_name}</span>
                        </div>
                        {user?.role === 'admin' && (
                          <button 
                            className="course-del-btn" 
                            onClick={(e) => handleDeleteCourse(c.id, e)}
                            title="Delete Course"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <Info size={24} />
                <p>No courses found matching your criteria.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main: Advanced Editor */}
        <main className="editor-canvas">
          {selectedCourse ? (
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
          ) : (
            <div className="empty-canvas">
              <BookOpen size={48} />
              <h2>Select a course to begin</h2>
              <p>Choose a course from the sidebar to manage its learning materials.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .course-manager-v2 { padding: 0; display: flex; flex-direction: column; gap: 40px; }
        
        .manager-header { display: flex; justify-content: space-between; align-items: center; }
        .manager-header h1 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -1.5px; }
        .manager-header h1 .highlight { color: #2563eb; }
        .manager-header p { color: #64748b; margin-top: 5px; font-weight: 500; }
        
        .role-indicator { background: #f8fafc; padding: 6px 14px; border-radius: 50px; border: 1px solid #e2e8f0; color: #64748b; font-size: 10px; font-weight: 900; display: flex; align-items: center; gap: 8px; letter-spacing: 1px; }

        .manager-layout { display: grid; grid-template-columns: 320px 1fr; gap: 40px; }
        
        .course-index { background: #fff; border-radius: 24px; padding: 20px; border: 1px solid #e2e8f0; align-self: start; display: flex; flex-direction: column; gap: 20px; max-height: 80vh; overflow-y: auto; }
        
        .sidebar-controls { display: flex; flex-direction: column; gap: 12px; }
        .search-pill { display: flex; align-items: center; gap: 10px; background: #f1f5f9; padding: 10px 15px; border-radius: 12px; }
        .search-pill input { background: transparent; border: none; outline: none; font-size: 13px; font-weight: 600; width: 100%; }
        
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-group select { padding: 8px 12px; border-radius: 10px; border: 1px solid #e2e8f0; font-size: 12px; font-weight: 700; color: #1e293b; background: #fff; outline: none; }

        .index-container { display: flex; flex-direction: column; gap: 24px; }
        .semester-group { display: flex; flex-direction: column; gap: 8px; }
        .group-label { font-size: 11px; font-weight: 900; color: #2563eb; text-transform: uppercase; letter-spacing: 1px; margin-left: 10px; }
        
        .index-list { display: flex; flex-direction: column; gap: 4px; }
        .index-item { padding: 10px 14px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 15px; transition: 0.2s; border: 1px solid transparent; }
        .index-item:hover { background: #f8fafc; border-color: #e2e8f0; }
        .index-item.active { background: #0f172a; color: #fff; }
        
        .course-del-btn { background: none; border: none; color: #cbd5e1; cursor: pointer; padding: 5px; opacity: 0; transition: 0.2s; }
        .index-item:hover .course-del-btn { opacity: 1; }
        .course-del-btn:hover { color: #ef4444; }
        .active .course-del-btn { color: #64748b; }
        .active .course-del-btn:hover { color: #f87171; }
        
        .item-text { flex: 1; }
        .item-text .title { display: block; font-weight: 700; font-size: 13px; margin-bottom: 2px; }
        .item-text .meta { font-size: 10px; opacity: 0.6; font-weight: 600; }

        .no-results { text-align: center; padding: 40px 20px; color: #cbd5e1; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .no-results p { font-size: 12px; font-weight: 600; }

        .editor-canvas { display: flex; flex-direction: column; gap: 30px; }
        .editor-card { background: #fff; border-radius: 30px; border: 1px solid #e2e8f0; padding: 50px; box-shadow: 0 20px 50px rgba(0,0,0,0.02); }
        
        .empty-canvas { background: #fff; border-radius: 30px; border: 2px dashed #e2e8f0; padding: 100px 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #94a3b8; gap: 20px; }
        .empty-canvas h2 { color: #0f172a; font-weight: 900; margin: 0; }
        .empty-canvas p { font-weight: 500; max-width: 300px; }

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
