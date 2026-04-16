import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Plus, Trash2, BookOpen, 
  ChevronRight, Layout, Info, User,
  CheckCircle, Shield, Bookmark, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SemesterManager = () => {
  const { token } = useAuth();
  const [semesters, setSemesters] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSem, setSelectedSem] = useState(null);

  // Forms
  const [newSemName, setNewSemName] = useState('');
  const [newCourse, setNewCourse] = useState({ name: '', professor_id: '' });

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const [sRes, pRes] = await Promise.all([
        axios.get('http://localhost:5000/api/academic/semesters'),
        axios.get('http://localhost:5000/api/academic/professors', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setSemesters(sRes.data);
      setProfessors(pRes.data);
      if (sRes.data.length > 0) setSelectedSem(sRes.data[0]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateSem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/academic/semesters', { name: newSemName }, { headers: { Authorization: `Bearer ${token}` } });
      setSemesters([...semesters, res.data]);
      setNewSemName('');
    } catch (err) { alert("Fail"); }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newCourse, semester_id: selectedSem.id };
      await axios.post('http://localhost:5000/api/academic/courses', payload, { headers: { Authorization: `Bearer ${token}` } });
      
      const res = await axios.get('http://localhost:5000/api/academic/semesters');
      setSemesters(res.data);
      const updated = res.data.find(s => s.id === selectedSem.id);
      if (updated) setSelectedSem(updated);
      
      setNewCourse({ name: '', professor_id: '' });
    } catch (err) { alert("Fail"); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Remove this module?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/academic/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const res = await axios.get('http://localhost:5000/api/academic/semesters');
      setSemesters(res.data);
      const updated = res.data.find(s => s.id === selectedSem.id);
      if (updated) setSelectedSem(updated);
    } catch (err) { alert("Fail"); }
  };

  if (loading) return <div className="studio-init">Structuring Academic Grid...</div>;

  return (
    <div className="academic-studio">
      <header className="acad-header">
        <div>
          <h1>Academic Architect</h1>
          <p>Define semesters and design the curriculum framework for the major.</p>
        </div>
        <form onSubmit={handleCreateSem} className="sem-form">
          <input placeholder="New Semester (e.g. S9)..." value={newSemName} onChange={e => setNewSemName(e.target.value)} required />
          <button type="submit"><Plus size={18}/></button>
        </form>
      </header>

      <div className="acad-layout">
        <aside className="sem-nav">
          <div className="label">INSTITUTIONAL PHASES</div>
          <div className="sem-list">
            {semesters.map(s => (
              <div 
                key={s.id} 
                onClick={() => setSelectedSem(s)}
                className={`sem-item ${selectedSem?.id === s.id ? 'active' : ''}`}
              >
                <div className="sem-icon"><Bookmark size={18} /></div>
                <div className="sem-info">
                  <span className="name">{s.name}</span>
                  <span className="count">{s.courses_count || 0} Modules</span>
                </div>
                {selectedSem?.id === s.id && <ChevronRight size={14} />}
              </div>
            ))}
          </div>
        </aside>

        <main className="course-architect">
          <div className="architect-card">
            <div className="card-head">
              <div className="title">
                <span className="badge">Curriculum Design</span>
                <h2>{selectedSem?.name} Modules</h2>
              </div>
            </div>

            <div className="course-creator">
              <form onSubmit={handleAddCourse}>
                <div className="c-input">
                  <BookOpen size={16} />
                  <input placeholder="Module Name..." value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} required />
                </div>
                <div className="c-input">
                  <User size={16} />
                  <select value={newCourse.professor_id} onChange={e => setNewCourse({...newCourse, professor_id: e.target.value})} required>
                    <option value="">Assign Faculty...</option>
                    {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="add-btn">Add to {selectedSem?.name}</button>
              </form>
            </div>

            <div className="modules-grid">
              {selectedSem?.courses?.length > 0 ? (
                 <div className="modules-list">
                   {selectedSem.courses.map(course => (
                     <div key={course.id} className="module-item-row">
                       <div className="m-info">
                         <span className="m-name">{course.name}</span>
                         <span className="m-prof">Prof. {course.professor_name}</span>
                       </div>
                       <button onClick={() => handleDeleteCourse(course.id)} className="m-delete">
                         <Trash2 size={14} />
                       </button>
                     </div>
                   ))}
                 </div>
              ) : (
                <div className="empty-modules">
                  <Settings size={40} />
                  <p>No modules defined for this academic phase.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .academic-studio { display: flex; flex-direction: column; gap: 40px; }
        .acad-header { display: flex; justify-content: space-between; align-items: center; }
        .acad-header h1 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -1.5px; }
        .acad-header p { color: #64748b; font-weight: 500; }
        .sem-form { display: flex; gap: 10px; background: #fff; padding: 6px; border-radius: 14px; border: 1px solid #e2e8f0; }
        .sem-form input { border: none; outline: none; padding: 0 15px; font-weight: 600; font-size: 13px; color: #1e293b; width: 200px; }
        .sem-form button { width: 40px; height: 40px; background: #0f172a; color: #fff; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .acad-layout { display: grid; grid-template-columns: 320px 1fr; gap: 40px; }
        .sem-nav { background: #fff; border-radius: 24px; padding: 24px; border: 1px solid #e2e8f0; align-self: start; }
        .label { font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
        .sem-list { display: flex; flex-direction: column; gap: 8px; }
        .sem-item { padding: 14px 16px; border-radius: 14px; cursor: pointer; display: flex; align-items: center; gap: 15px; transition: 0.2s; border: 1px solid transparent; }
        .sem-item:hover { background: #f8fafc; }
        .sem-item.active { background: #eff6ff; border-color: #dbeafe; }
        .sem-icon { width: 36px; height: 36px; background: #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #64748b; }
        .active .sem-icon { background: #fff; color: #2563eb; }
        .sem-info .name { display: block; font-weight: 800; font-size: 14px; color: #1e293b; }
        .sem-info .count { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
        .course-architect { display: flex; flex-direction: column; }
        .architect-card { background: #fff; border-radius: 30px; border: 1px solid #e2e8f0; padding: 50px; box-shadow: 0 20px 50px rgba(0,0,0,0.02); }
        .card-head { margin-bottom: 40px; }
        .card-head h2 { font-size: 2rem; font-weight: 900; color: #0f172a; margin: 10px 0 0; }
        .card-head .badge { background: #f1f5f9; color: #64748b; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 900; text-transform: uppercase; }
        .course-creator { background: #f8fafc; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0; margin-bottom: 40px; }
        .course-creator form { display: flex; gap: 15px; }
        .c-input { flex: 1; display: flex; align-items: center; gap: 12px; background: #fff; padding: 0 15px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .c-input input, .c-input select { flex: 1; border: none; outline: none; height: 50px; font-weight: 600; font-size: 14px; background: transparent; }
        .course-creator .add-btn { background: #2563eb; color: #fff; border: none; padding: 0 24px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .course-creator .add-btn:hover { background: #1d4ed8; transform: translateY(-2px); }
        .modules-list { display: flex; flex-direction: column; gap: 12px; }
        .module-item-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: #fff; border: 1px solid #f1f5f9; border-radius: 15px; transition: 0.2s; }
        .module-item-row:hover { border-color: #e2e8f0; box-shadow: 0 5px 15px rgba(0,0,0,0.02); }
        .m-name { display: block; font-weight: 700; color: #1e293b; font-size: 15px; }
        .m-prof { font-size: 12px; color: #94a3b8; font-weight: 600; }
        .m-delete { background: none; border: none; color: #cbd5e1; cursor: pointer; padding: 5px; transition: 0.2s; }
        .m-delete:hover { color: #ef4444; background: #fef2f2; border-radius: 6px; }
        .empty-modules { padding: 60px; text-align: center; color: #cbd5e1; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .empty-modules p { font-size: 14px; font-weight: 600; }
        .studio-init { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #2563eb; letter-spacing: 2px; }
      `}</style>
    </div>
  );
};

export default SemesterManager;
