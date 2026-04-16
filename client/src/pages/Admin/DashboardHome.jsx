import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Bell, Calendar, BookOpen, 
  Activity, ArrowUpRight, Shield, Zap,
  TrendingUp, Clock, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardHome = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    news: 0,
    events: 0,
    courses: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/stats', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const data = response.data;
        setStats({
          users: data.total_users,
          news: data.announcements,
          events: data.events,
          courses: data.students // Using students count as an example for now or keeping it separate
        });

        // Get course count separately as it's in a different module
        const cRes = await axios.get('http://localhost:5000/api/academic/courses');
        setStats(prev => ({ ...prev, courses: cRes.data.length }));
        
      } catch (err) { console.error(err); }
    };
    if (token) fetchStats();
  }, [token]);

  const cards = [
    { label: 'Active Users', value: stats.users, icon: <Users />, color: '#2563eb', trend: '+12%', path: '/admin/users' },
    { label: 'Announcements', value: stats.news, icon: <Bell />, color: '#7c3aed', trend: 'Live', path: '/admin/announcements' },
    { label: 'Scheduled Events', value: stats.events, icon: <Calendar />, color: '#059669', trend: 'Upcoming', path: '/admin/events' },
    { label: 'Total Courses', value: stats.courses, icon: <BookOpen />, color: '#d97706', trend: 'Updated', path: '/admin/courses' },
  ];

  return (
    <div className="dash-studio">
      <header className="dash-header">
        <div className="welcome-text">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            Welcome back, <span className="highlight">{user?.first_name}</span>
          </motion.h1>
          <p>Here is what's happening across the SIIA ecosystem today.</p>
        </div>
        <div className="system-status">
          <div className="status-item">
            <div className="pulse"></div>
            <span>System Operational</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {cards.map((card, idx) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="stat-card"
            onClick={() => navigate(card.path)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-inner">
              <div className="icon-box" style={{ background: `${card.color}15`, color: card.color }}>
                {card.icon}
              </div>
              <div className="data">
                <span className="value">{card.value}</span>
                <span className="label">{card.label}</span>
              </div>
              <div className="trend-badge" style={{ color: card.color }}>{card.trend}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="main-dash-grid">
        {/* Activity Feed */}
        <section className="activity-panel card">
          <div className="panel-header">
            <h3><Activity size={18} /> System Activity</h3>
            <button className="text-btn" onClick={() => navigate('/admin/announcements')}>View All</button>
          </div>
          <div className="feed-list">
            <div className="feed-item">
                <div className="item-marker" />
                <div className="item-content">
                  <p><strong>System</strong> synchronized with Google Drive successfully.</p>
                  <span className="time">Just now</span>
                </div>
            </div>
            <div className="feed-item">
                <div className="item-marker" />
                <div className="item-content">
                  <p><strong>Academic Hub</strong> updated with latest course materials.</p>
                  <span className="time">1 hour ago</span>
                </div>
            </div>
            <div className="feed-item">
                <div className="item-marker" />
                <div className="item-content">
                  <p><strong>Security</strong> token verification completed.</p>
                  <span className="time">3 hours ago</span>
                </div>
            </div>
          </div>
        </section>

        {/* Quick Tools */}
        <section className="tools-panel">
          <div className="tool-card primary" onClick={() => navigate('/admin/announcements')}>
            <Zap size={24} />
            <h4>Quick Announcement</h4>
            <p>Push urgent updates to students instantly.</p>
            <button>Launch Editor</button>
          </div>
          <div className="tool-card secondary" onClick={() => navigate('/admin/users')}>
            <Shield size={24} />
            <h4>Directory Access</h4>
            <p>Manage faculty and student accounts.</p>
            <button>Open Directory</button>
          </div>
        </section>
      </div>

      <style>{`
        .dash-studio { display: flex; flex-direction: column; gap: 40px; }
        
        .dash-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .welcome-text h1 { font-size: 2.5rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -1.5px; }
        .welcome-text h1 .highlight { color: #2563eb; }
        .welcome-text p { color: #64748b; font-weight: 500; margin-top: 5px; }

        .system-status { background: #fff; border: 1px solid #e2e8f0; padding: 10px 20px; border-radius: 50px; display: flex; align-items: center; }
        .status-item { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 800; color: #059669; text-transform: uppercase; }
        .pulse { width: 8px; height: 8px; background: #059669; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(5, 150, 105, 0); } 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0); } }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
        .stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 24px; transition: 0.3s; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .card-inner { display: flex; align-items: center; gap: 20px; position: relative; }
        .icon-box { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .data .value { display: block; font-size: 1.8rem; font-weight: 900; color: #0f172a; line-height: 1; }
        .data .label { font-size: 13px; color: #64748b; font-weight: 600; }
        .trend-badge { position: absolute; top: 0; right: 0; font-size: 10px; font-weight: 800; }

        .main-dash-grid { display: grid; grid-template-columns: 1fr 340px; gap: 30px; }
        
        .card { background: #fff; border-radius: 24px; border: 1px solid #e2e8f0; padding: 30px; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .panel-header h3 { display: flex; align-items: center; gap: 10px; font-size: 1.1rem; color: #0f172a; }
        .text-btn { background: none; border: none; color: #2563eb; font-weight: 700; font-size: 13px; cursor: pointer; }

        .feed-list { display: flex; flex-direction: column; gap: 25px; }
        .feed-item { display: flex; gap: 15px; }
        .item-marker { width: 4px; height: 40px; background: #f1f5f9; border-radius: 2px; }
        .feed-item:hover .item-marker { background: #2563eb; }
        .item-content p { margin: 0; font-size: 14px; color: #334155; line-height: 1.5; }
        .item-content .time { font-size: 11px; color: #94a3b8; font-weight: 600; }

        .tools-panel { display: flex; flex-direction: column; gap: 20px; }
        .tool-card { border-radius: 24px; padding: 30px; color: #fff; transition: 0.3s; cursor: pointer; }
        .tool-card.primary { background: #0f172a; }
        .tool-card.secondary { background: #fff; border: 1px solid #e2e8f0; color: #0f172a; }
        .tool-card h4 { margin: 15px 0 8px; font-size: 1.1rem; }
        .tool-card p { font-size: 13px; opacity: 0.7; margin-bottom: 20px; }
        .tool-card button { width: 100%; padding: 12px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .primary button { background: #2563eb; color: #fff; }
        .secondary button { background: #f1f5f9; color: #0f172a; }
        .tool-card:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
};

export default DashboardHome;
