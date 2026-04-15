import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2, GraduationCap, User, X, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SemesterManager = () => {
  const { token } = useAuth();
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showSemModal, setShowSemModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  
  // Form states
  const [newSemName, setNewSemName] = useState('');
  const [newCourse, setNewCourse] = useState({ name: '', semester_id: '', professor_id: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes, pRes] = await Promise.all([
        axios.get('http://localhost:5000/api/academic/semesters'),
        axios.get('http://localhost:5000/api/academic/courses'),
        axios.get('http://localhost:5000/api/academic/professors', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setSemesters(sRes.data);
      setCourses(cRes.data);
      setProfessors(pRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCreateSemester = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/academic/semesters', { name: newSemName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewSemName('');
      setShowSemModal(false);
      fetchData();
    } catch (err) { alert("Error creating semester"); }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/academic/courses', newCourse, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewCourse({ name: '', semester_id: '', professor_id: '' });
      setShowCourseModal(false);
      fetchData();
    } catch (err) { alert("Error creating course"); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/academic/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) { alert("Error deleting"); }
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading academic data...</div>;

  return (
    <div>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'var(--siia-navy)', margin: 0 }}>Academic Structure</h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>Manage semesters, courses, and professor assignments.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setShowSemModal(true)} className="btn btn-secondary" style={{ marginLeft: 0, gap: '8px' }}>
            <Layers size={18} /> Add Semester
          </button>
          <button onClick={() => setShowCourseModal(true)} className="btn btn-primary" style={{ gap: '8px' }}>
            <Plus size={18} /> New Course Module
          </button>
        </div>
      </header>

      {/* Grid of Semesters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        {semesters.map((sem) => (
          <div key={sem.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 30px', background: 'var(--siia-navy)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Semester {sem.name}</h2>
              <span style={{ fontSize: '12px', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '50px' }}>
                {sem.courses_count} MODULES
              </span>
            </div>
            
            <div style={{ padding: '20px' }}>
              {courses.filter(c => c.semester_id === sem.id).length > 0 ? (
                courses.filter(c => c.semester_id === sem.id).map(course => (
                  <div key={course.id} style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: 'var(--siia-navy)', fontSize: '14px' }}>{course.name}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                        <User size={12}/> Prof. {course.professor_name}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteCourse(course.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}>
                      <Trash2 size={16}/>
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: '#cbd5e1', fontSize: '13px' }}>
                  No courses added to this semester yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL: ADD SEMESTER --- */}
      <AnimatePresence>
        {showSemModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>Add Semester</h2>
                <button onClick={() => setShowSemModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X/></button>
              </div>
              <form onSubmit={handleCreateSemester}>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Semester Name (e.g., S9)</label>
                  <input type="text" required value={newSemName} onChange={(e) => setNewSemName(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Create Semester</button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: ADD COURSE --- */}
      <AnimatePresence>
        {showCourseModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>New Module</h2>
                <button onClick={() => setShowCourseModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X/></button>
              </div>
              <form onSubmit={handleCreateCourse}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Module Name</label>
                  <input type="text" required value={newCourse.name} onChange={(e) => setNewCourse({...newCourse, name: e.target.value})} placeholder="e.g., Deep Learning" style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Target Semester</label>
                  <select required value={newCourse.semester_id} onChange={(e) => setNewCourse({...newCourse, semester_id: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <option value="">Select a Semester</option>
                    {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Assigned Professor</label>
                  <select required value={newCourse.professor_id} onChange={(e) => setNewCourse({...newCourse, professor_id: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <option value="">Select a Professor</option>
                    {professors.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Create & Assign Module</button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SemesterManager;
