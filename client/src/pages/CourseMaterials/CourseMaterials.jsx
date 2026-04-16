import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, FileText, DownloadCloud, ChevronRight, 
  ExternalLink, Search, GraduationCap, Info, Layout
} from 'lucide-react';
import { convertDriveLink } from '../../components/CustomBlockEditor/utils';

const CourseMaterials = () => {
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSem, setActiveSem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [semRes, courRes, setRes] = await Promise.all([
          axios.get('http://localhost:5000/api/academic/semesters'),
          axios.get('http://localhost:5000/api/academic/courses'),
          axios.get('http://localhost:5000/api/settings/')
        ]);
        setSemesters(semRes.data);
        setCourses(courRes.data);
        setSettings(setRes.data);
        if (semRes.data.length > 0) setActiveSem(semRes.data[0].id);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getCourseMaterials = (courseId) => {
    const raw = settings[`course_${courseId}_data`];
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  };

  const filteredCourses = courses.filter(c => 
    c.semester_id === activeSem && 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loader-full">Synchronizing Digital Library...</div>;

  return (
    <div className="materials-portal">
      <div className="home-container">
        {/* Portal Header */}
        <header className="portal-header">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="portal-badge">
            <GraduationCap size={14} /> <span>Open Knowledge Base</span>
          </motion.div>
          <h1>Academic <br/> Resources</h1>
          <p>Access curated course materials, laboratory work, and exercises shared by your professors.</p>
        </header>

        {/* Navigation & Search */}
        <div className="portal-controls">
          <div className="sem-tabs">
            {semesters.map(sem => (
              <button 
                key={sem.id} 
                onClick={() => setActiveSem(sem.id)}
                className={activeSem === sem.id ? 'active' : ''}
              >
                {sem.name}
              </button>
            ))}
          </div>
          <div className="search-wrap">
            <Search size={18} />
            <input 
              placeholder="Filter courses..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="courses-grid">
          {filteredCourses.map((course, idx) => {
            const data = getCourseMaterials(course.id);
            return (
              <motion.div 
                key={course.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="course-card-premium"
              >
                <div className="card-top">
                  <div className="icon-box"><BookOpen size={24} /></div>
                  <div className="title-box">
                    <h3>{course.name}</h3>
                    <span className="prof">Dr. {course.professor_name || 'Department Faculty'}</span>
                  </div>
                </div>

                <div className="card-sections">
                  {/* Category: Lectures */}
                  {data?.lectures?.length > 0 && (
                    <div className="mat-section">
                      <label>LECTURES & NOTES</label>
                      {data.lectures.map(item => (
                        <a key={item.id} href={convertDriveLink(item.drive_id)} target="_blank" className="mat-link">
                          <FileText size={14} /> <span>{item.title || 'Untitled Part'}</span> <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Category: TDs */}
                  {data?.tds?.length > 0 && (
                    <div className="mat-section">
                      <label>TD (EXERCISES)</label>
                      {data.tds.map(item => (
                        <a key={item.id} href={convertDriveLink(item.drive_id)} target="_blank" className="mat-link td">
                          <Layout size={14} /> <span>{item.title}</span> <DownloadCloud size={12} />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Category: TPs */}
                  {data?.tps?.length > 0 && (
                    <div className="mat-section">
                      <label>TP (PRACTICALS)</label>
                      {data.tps.map(item => (
                        <a key={item.id} href={convertDriveLink(item.drive_id)} target="_blank" className="mat-link tp">
                          <DownloadCloud size={14} /> <span>{item.title}</span> <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  )}

                  {!data && (
                    <div className="no-data-hint">
                      <Info size={14} /> <span>Materials coming soon.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        .materials-portal { background: #fff; min-height: 100vh; padding: 140px 0 100px; }
        .portal-header { max-width: 800px; margin-bottom: 80px; }
        .portal-badge { display: inline-flex; align-items: center; gap: 8px; background: #eff6ff; color: #2563eb; padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 24px; }
        .portal-header h1 { font-size: 4.5rem; font-weight: 900; color: #0f172a; line-height: 1; letter-spacing: -2px; margin: 0; }
        .portal-header p { font-size: 1.25rem; color: #64748b; margin-top: 24px; line-height: 1.6; }

        .portal-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; gap: 20px; }
        .sem-tabs { display: flex; gap: 10px; }
        .sem-tabs button { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 24px; border-radius: 12px; font-weight: 700; color: #64748b; cursor: pointer; transition: 0.2s; }
        .sem-tabs button.active { background: #0f172a; color: #fff; border-color: #0f172a; transform: translateY(-2px); }
        
        .search-wrap { display: flex; align-items: center; gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 14px; width: 300px; }
        .search-wrap input { background: transparent; border: none; outline: none; font-weight: 600; font-size: 14px; color: #1e293b; width: 100%; }

        .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 30px; }
        
        .course-card-premium { background: #fff; border: 1px solid #f1f5f9; border-radius: 24px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); transition: 0.3s; }
        .course-card-premium:hover { border-color: #e2e8f0; transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.05); }

        .card-top { display: flex; gap: 20px; align-items: center; margin-bottom: 30px; }
        .icon-box { width: 50px; height: 50px; background: #f1f5f9; color: #2563eb; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .title-box h3 { font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0; }
        .title-box .prof { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; }

        .card-sections { display: flex; flex-direction: column; gap: 24px; }
        .mat-section label { display: block; font-size: 10px; font-weight: 900; color: #cbd5e1; margin-bottom: 10px; letter-spacing: 1px; }
        
        .mat-link { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #f8fafc; border-radius: 10px; text-decoration: none; color: #1e293b; font-weight: 700; font-size: 13px; transition: 0.2s; margin-bottom: 6px; }
        .mat-link:hover { background: #eff6ff; color: #2563eb; transform: translateX(5px); }
        .mat-link.td:hover { background: #f5f3ff; color: #7c3aed; }
        .mat-link.tp:hover { background: #ecfdf5; color: #059669; }
        
        .no-data-hint { display: flex; align-items: center; gap: 8px; color: #cbd5e1; font-size: 12px; font-style: italic; }
        .loader-full { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #2563eb; letter-spacing: 2px; }
      `}</style>
    </div>
  );
};

export default CourseMaterials;
