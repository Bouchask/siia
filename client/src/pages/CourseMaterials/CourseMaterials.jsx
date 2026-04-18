import React, { useEffect, useState } from 'react';
import academicService from '../../services/academicService';
import courseService from '../../services/courseService';
import settingService from '../../services/settingService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, FileText, ChevronRight, 
  ExternalLink, Search, GraduationCap, Info, Layout,
  Layers, Book, ArrowLeft
} from 'lucide-react';
import { convertDriveViewLink } from '../../components/CustomBlockEditor/utils';
import '../Home/Home.css';

const CourseMaterials = () => {
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [viewStep, setViewStep] = useState('semesters');
  const [activeSemester, setActiveSemester] = useState(null);
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [semData, courData, setData] = await Promise.all([
          academicService.getSemesters().catch(() => []),
          courseService.getAll().catch(() => []),
          settingService.getAll().catch(() => ({}))
        ]);
        setSemesters(semData.sort((a,b) => a.name.localeCompare(b.name)));
        setCourses(courData);
        setSettings(setData);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  const getCourseMaterials = (courseId) => {
    const raw = settings[`course_${courseId}_data`];
    if (!raw) return null;
    try { 
      const data = JSON.parse(raw);
      // Support shortened format (l=lectures, d=tds, p=tps)
      if (data.l || data.d || data.p) {
        return {
          lectures: (data.l || []).map((i, idx) => ({ id: `l-${idx}`, title: i.t, drive_id: i.i })),
          tds: (data.d || []).map((i, idx) => ({ id: `d-${idx}`, title: i.t, drive_id: i.i })),
          tps: (data.p || []).map((i, idx) => ({ id: `p-${idx}`, title: i.t, drive_id: i.i }))
        };
      }
      return data; 
    } catch { return null; }
  };

  const handleSemesterClick = (sem) => {
    setActiveSemester(sem);
    setViewStep('modules');
    setExpandedModuleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleModule = (courseId) => {
    setExpandedModuleId(expandedModuleId === courseId ? null : courseId);
  };

  const resetToSemesters = () => {
    setViewStep('semesters');
    setActiveSemester(null);
    setExpandedModuleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--siia-bg)' }}>
       <div className="loader-spiral" style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: 'var(--siia-blue)', borderRadius: '50%', animation: 'spin 1s infinite linear' }}></div>
       <p style={{ marginTop: '20px', fontWeight: '800', color: 'var(--siia-blue)', letterSpacing: '1px' }}>SYNCHRONIZING DIGITAL ARCHIVES...</p>
    </div>
  );

  const filteredModules = activeSemester 
    ? courses.filter(c => c.semester_id === activeSemester.id && c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="materials-drilldown" style={{ background: 'var(--siia-bg)', minHeight: '100vh', paddingTop: '100px' }}>
      <div className="home-container">
        
        <header className="section-padding" style={{ paddingBottom: '60px' }}>
          <div className="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <button onClick={resetToSemesters} style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: '900', color: viewStep === 'semesters' ? 'var(--siia-navy)' : 'var(--siia-text-light)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1.5px', padding: 0 }}>
              Library
            </button>
            {activeSemester && (
              <>
                <ChevronRight size={14} color="var(--siia-text-light)" />
                <button onClick={() => setExpandedModuleId(null)} style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: '900', color: 'var(--siia-navy)', cursor: 'default', textTransform: 'uppercase', letterSpacing: '1.5px', padding: 0 }}>
                  {activeSemester.name}
                </button>
              </>
            )}
          </div>

          <div className="header-main">
            {viewStep === 'semesters' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="hero-title">Academic <br/> <span className="text-gradient">Directory</span></h1>
                <p className="hero-subtitle">Select your semester to access specialized course resources, digital archives, and research materials.</p>
              </motion.div>
            )}
            {viewStep === 'modules' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="hero-title">{activeSemester.name} <span className="text-gradient">Modules</span></h1>
                <div className="search-bar-modern" style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '15px', background: '#fff', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--siia-border)', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <Search size={18} color="var(--siia-text-light)" />
                  <input 
                    placeholder="Search by module name..." 
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', fontWeight: '600', color: 'var(--siia-navy)', width: '100%' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {viewStep === 'semesters' && (
            <motion.div 
              key="semesters"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="announcement-grid"
              style={{ paddingBottom: '100px' }}
            >
              {semesters.map((sem, idx) => (
                <motion.button 
                  key={sem.id} 
                  whileHover={{ y: -8 }}
                  onClick={() => handleSemesterClick(sem)} 
                  style={{ 
                    position: 'relative', overflow: 'hidden', background: '#0f172a', 
                    borderRadius: '28px', padding: '40px', border: 'none', textAlign: 'left', 
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', 
                    justifyContent: 'space-between', height: '260px', transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '4rem', fontWeight: '900', color: '#fff', lineHeight: '1', letterSpacing: '-3px' }}>{sem.name}</div>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ color: '#fff', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>{sem.courses_count || 0} Modules Available</div>
                    <div style={{ color: 'var(--siia-blue)', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Explore Library <ChevronRight size={14} />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', color: 'rgba(255,255,255,0.05)', transform: 'rotate(-15deg)', pointerEvents: 'none' }}>
                    <GraduationCap size={140} />
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {viewStep === 'modules' && (
            <motion.div 
              key="modules"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px', paddingBottom: '100px' }}
            >
              <button 
                onClick={resetToSemesters}
                style={{ background: 'none', border: 'none', color: 'var(--siia-blue)', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px' }}
              >
                <ArrowLeft size={16} /> Back to Library
              </button>

              {filteredModules.length > 0 ? filteredModules.map((course, idx) => {
                const materials = getCourseMaterials(course.id);
                const isExpanded = expandedModuleId === course.id;

                return (
                  <div key={course.id} style={{ background: '#fff', border: '1px solid var(--siia-border)', borderRadius: '24px', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: isExpanded ? '0 20px 40px rgba(0,0,0,0.04)' : 'none' }}>
                    <button 
                      onClick={() => toggleModule(course.id)} 
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '24px', padding: '24px 32px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ width: '56px', height: '56px', background: 'var(--siia-bg)', color: 'var(--siia-blue)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Book size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--siia-navy)', margin: '0 0 6px' }}>{course.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--siia-blue-light)', color: 'var(--siia-blue)', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', border: '1px solid #dbeafe' }}>
                            {course.professor_name?.charAt(0) || 'P'}
                          </div>
                          <p style={{ color: 'var(--siia-text-light)', fontWeight: '700', fontSize: '12px', margin: 0 }}>
                            {course.professor_name || 'Faculty Member'}
                          </p>
                        </div>
                      </div>
                      <div style={{ color: isExpanded ? 'var(--siia-blue)' : '#cbd5e1', transition: '0.3s', transform: isExpanded ? 'rotate(90deg)' : 'none' }}>
                        <ChevronRight size={20} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ background: '#fcfdfe', borderTop: '1px solid var(--siia-border)', padding: '32px' }}
                        >
                          {materials ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
                              {['lectures', 'tds', 'tps'].map(cat => (
                                materials[cat]?.length > 0 && (
                                  <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <h4 style={{ margin: 0, fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--siia-text-light)' }}>
                                        {cat === 'lectures' ? 'Course Lectures' : cat === 'tds' ? 'Tutorial Sessions (TD)' : 'Practical Work (TP)'}
                                      </h4>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                      {materials[cat].map(item => (
                                        <a key={item.id} href={convertDriveViewLink(item.drive_id)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '14px', border: '1px solid var(--siia-border)', textDecoration: 'none', transition: '0.2s', background: '#fff' }} className="resource-item">
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--siia-navy)', fontWeight: '700', fontSize: '13px' }}>
                                            <FileText size={14} color="var(--siia-blue)" />
                                            <span>{item.title}</span>
                                          </div>
                                          <ExternalLink size={12} color="var(--siia-text-light)" />
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )
                              ))}
                            </div>
                          ) : (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--siia-text-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                              <Info size={24} />
                              <p style={{ fontSize: '13px', fontWeight: '600' }}>No materials available for this course yet.</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }) : (
                <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: '32px', border: '1px solid var(--siia-border)' }}>
                  <Info size={48} color="var(--siia-text-light)" style={{ marginBottom: '20px' }} />
                  <p style={{ color: 'var(--siia-text)', fontSize: '1.1rem', marginBottom: '24px' }}>No modules found matching "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--siia-blue)', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}>Clear Search</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .resource-item:hover { border-color: var(--siia-blue) !important; transform: translateX(5px); }
        .resource-item:hover span { color: var(--siia-blue); }
      `}</style>
    </div>
  );
};

export default CourseMaterials;
