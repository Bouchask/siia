import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, BookOpen, Home, LogIn } from 'lucide-react';
import HomePage from './pages/Home/Home';
import LoginPage from './pages/Login/Login';
import Announcements from './pages/Announcements/Announcements';
import AnnouncementDetail from './pages/Announcements/AnnouncementDetail';
import Timetables from './pages/Timetables/Timetables';
import CourseMaterials from './pages/CourseMaterials/CourseMaterials';
import AdminLayout from './components/AdminLayout';
import DashboardHome from './pages/Admin/DashboardHome';
import AnnouncementManager from './pages/Admin/AnnouncementManager';
import UserManager from './pages/Admin/UserManager';
import EventManager from './pages/Admin/EventManager';
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
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">SIIA</Link>
        <div className="nav-links">
          <Link to="/" className="nav-item"><Home size={16}/> Home</Link>
          <Link to="/announcements" className="nav-item"><Bell size={16}/> News</Link>
          <Link to="/timetables" className="nav-item"><Calendar size={16}/> Timetables</Link>
          <Link to="/courses" className="nav-item"><BookOpen size={16}/> Courses</Link>
          {user?.role === 'admin' || user?.role === 'professor' ? (
            <Link to="/admin" className="btn-login">Dashboard</Link>
          ) : (
            <Link to="/login" className="btn-login"><LogIn size={16}/> Login</Link>
          )}
        </div>
      </div>
    </nav>
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
          <Route path="/timetables" element={<><Navbar /><Timetables /></>} />
          <Route path="/courses" element={<><Navbar /><CourseMaterials /></>} />

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
            <Route path="timetables" element={<TimetableManager />} />
            <Route path="academic" element={<SemesterManager />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
