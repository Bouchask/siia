import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  Calendar, 
  BookOpen, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20}/>, roles: ['admin', 'professor'] },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={20}/>, roles: ['admin'] },
    { path: '/admin/announcements', label: 'Announcements', icon: <Bell size={20}/>, roles: ['admin', 'professor'] },
    { path: '/admin/events', label: 'Department Events', icon: <Calendar size={20}/>, roles: ['admin', 'professor'] },
    { path: '/admin/academic', label: 'Academic Structure', icon: <GraduationCap size={20}/>, roles: ['admin'] },
    { path: '/admin/timetables', label: 'Timetables', icon: <BookOpen size={20}/>, roles: ['admin'] },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'var(--siia-navy)', color: '#fff', padding: '30px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 30px 40px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-1px' }}>SIIA PANEL</h2>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>
            <ShieldCheck size={14} color="#10b981"/> {user?.role.toUpperCase()} MODE
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            item.roles.includes(user?.role) && (
              <Link 
                key={item.path}
                to={item.path}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '15px 30px', 
                  textDecoration: 'none', 
                  color: location.pathname === item.path ? '#fff' : '#94a3b8',
                  background: location.pathname === item.path ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderLeft: location.pathname === item.path ? '4px solid var(--siia-blue)' : '4px solid transparent',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                {item.icon}
                {item.label}
                {location.pathname === item.path && <ChevronRight size={14} style={{ marginLeft: 'auto' }}/>}
              </Link>
            )
          ))}
        </nav>

        <div style={{ padding: '30px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{user?.first_name} {user?.last_name}</p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
