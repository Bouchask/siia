import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, BookOpen, Home, LogIn, Menu, X, LayoutDashboard, Award } from 'lucide-react';
import HomePage from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import Announcements from './pages/Announcements/Announcements';
import AnnouncementDetail from './pages/Announcements/AnnouncementDetail';
import Events from './pages/Events/Events';
import EventDetail from './pages/Events/EventDetail';
import Timetables from './pages/Timetables/Timetables';
import CourseMaterials from './pages/CourseMaterials/CourseMaterials';
import AboutSIIA from './pages/AboutSIIA/AboutSIIA';
import AdminLayout from './components/AdminLayout';
import DashboardHome from './pages/Admin/DashboardHome';
import AnnouncementManager from './pages/Admin/AnnouncementManager';
import UserManager from './pages/Admin/UserManager';
import EventManager from './pages/Admin/EventManager';
import CourseManager from './pages/Admin/CourseManager';
import TimetableManager from './pages/Admin/TimetableManager';
import SemesterManager from './pages/Admin/SemesterManager';
import { useAuth } from './context/AuthContext';
import './index.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { to: "/", label: "Home", icon: <Home size={18}/> },
    { to: "/about-siia", label: "Excellence Track", icon: <Award size={18}/> },
    { to: "/announcements", label: "News", icon: <Bell size={18}/> },
    { to: "/events", label: "Events", icon: <Calendar size={18}/> },
    { to: "/timetables", label: "Timetables", icon: <Calendar size={18}/> },
    { to: "/courses", label: "Courses", icon: <BookOpen size={18}/> },
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'professor';

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={closeMenu}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '2px solid #e2e8f0', paddingRight: '12px' }}>
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFhuZNvXJkSIg_aLu29110tcqV7y4CuLneww&s" 
                alt="FP Logo" 
                style={{ height: '32px', width: 'auto' }}
              />
              <span style={{ fontSize: '9px', fontWeight: '900', color: '#64748b', lineHeight: '1', width: '50px' }}>FP <br/> KHOURIBGA</span>
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-1px', color: '#0f172a' }}>SIIA</span>
          </Link>

          {/* Desktop Nav */}
          <div className="nav-links" style={{ display: 'flex' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`nav-item ${location.pathname === link.to ? 'active' : ''}`}>
                {link.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link to="/admin" className="btn-login">Dashboard</Link>
            ) : (
              <Link to="/login" className="btn-login"><LogIn size={16}/> Login</Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="mobile-toggle" 
            onClick={toggleMenu}
            style={{ 
              display: 'none', 
              background: 'none', 
              border: 'none', 
              color: '#0f172a',
              cursor: 'pointer'
            }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              bottom: 0,
              background: '#fff',
              zIndex: 999,
              padding: '40px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {navLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px 20px',
                  textDecoration: 'none',
                  color: '#0f172a',
                  fontSize: '1.2rem',
                  fontWeight: '800',
                  borderRadius: '16px',
                  background: location.pathname === link.to ? '#eff6ff' : 'transparent'
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div style={{ marginTop: 'auto', paddingBottom: '40px' }}>
              {isAdmin ? (
                <Link to="/admin" onClick={closeMenu} className="btn-login" style={{ width: '100%', justifyContent: 'center', padding: '18px' }}>
                  <LayoutDashboard size={20} /> Dashboard Panel
                </Link>
              ) : (
                <Link to="/login" onClick={closeMenu} className="btn-login" style={{ width: '100%', justifyContent: 'center', padding: '18px' }}>
                  <LogIn size={20} /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 991px) {
          .nav-links { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        .nav-item.active { color: var(--siia-blue); }
        .nav-item { position: relative; }
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: -25px;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--siia-blue);
          border-radius: 10px 10px 0 0;
        }
      `}</style>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public Portal Routes (With Navbar) */}
          <Route path="/" element={<><Navbar /><HomePage /></>} />
          <Route path="/login" element={<><Navbar /><LoginPage /></>} />
          <Route path="/news/:id" element={<><Navbar /><AnnouncementDetail /></>} />
          <Route path="/announcements" element={<><Navbar /><Announcements /></>} />
          <Route path="/events" element={<><Navbar /><Events /></>} />
          <Route path="/events/:id" element={<><Navbar /><EventDetail /></>} />
          <Route path="/timetables" element={<><Navbar /><Timetables /></>} />
          <Route path="/courses" element={<><Navbar /><CourseMaterials /></>} />
          <Route path="/about-siia" element={<><Navbar /><AboutSIIA /></>} />

          {/* Admin Dashboard Routes (Protected) */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin', 'professor']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UserManager />} />
            <Route path="announcements" element={<AnnouncementManager />} />
            <Route path="events" element={<EventManager />} />
            <Route path="courses" element={<CourseManager />} />
            <Route path="timetables" element={<TimetableManager />} />
            <Route path="academic" element={<SemesterManager />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
