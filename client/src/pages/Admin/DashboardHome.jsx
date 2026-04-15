import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Bell, Calendar, GraduationCap, Briefcase, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../Home/Home.css';

const DashboardHome = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div style={{ padding: '40px' }}>Loading statistics...</div>;

  const cards = [
    { label: 'Total Students', value: stats?.students, icon: <GraduationCap size={24} />, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Professors', value: stats?.professors, icon: <Briefcase size={24} />, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Announcements', value: stats?.announcements, icon: <Bell size={24} />, color: '#d97706', bg: '#fffbeb' },
    { label: 'Scheduled Events', value: stats?.events, icon: <Calendar size={24} />, color: '#059669', bg: '#ecfdf5' },
  ];

  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: 'var(--siia-navy)', margin: 0, fontSize: '2rem' }}>Welcome back, {user?.first_name}!</h1>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Here is what's happening in the SIIA platform today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        {cards.map((card, idx) => (
          <div key={idx} className="card" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '60px', height: '60px', background: card.bg, color: card.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {card.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>{card.label}</p>
              <h2 style={{ margin: '5px 0 0', fontSize: '1.8rem', color: 'var(--siia-navy)' }}>{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
        <div className="card" style={{ padding: '30px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--siia-navy)', marginBottom: '20px' }}>
            <TrendingUp size={20} color="var(--siia-blue)" /> Platform Activity
          </h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', color: '#94a3b8', fontSize: '14px' }}>
            Activity Graph Placeholder
          </div>
        </div>
        
        <div className="card" style={{ padding: '30px' }}>
          <h3 style={{ color: 'var(--siia-navy)', marginBottom: '20px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Create New Announcement</button>
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginLeft: 0 }}>Add Event to Calendar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
