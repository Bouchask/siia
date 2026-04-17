import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Trash2, Shield, Mail, 
  Search, Filter, MoreVertical, X, Check,
  UserPlus, UserCheck, ShieldAlert
} from 'lucide-react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '', password: '', first_name: '', last_name: '', role: 'student'
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.register(formData);
      // Ensure the returned user object is valid
      const newUser = data.user || data;
      setUsers(prevUsers => [...prevUsers, newUser]);
      setShowAdd(false);
      setFormData({ email: '', password: '', first_name: '', last_name: '', role: 'student' });
      alert("Account created successfully!");
    } catch (err) { 
      console.error(err);
      alert(err.response?.data?.error || "User creation failed."); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this user permanently?")) return;
    try {
      await userService.delete(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) { alert("Delete failed."); }
  };

  if (loading) return <div className="studio-init">Syncing User Directory...</div>;

  return (
    <div className="directory-studio">
      <header className="dir-header">
        <div>
          <h1>User Directory <span className="count">({users.length})</span></h1>
          <p>Manage access levels and identity across the platform.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="add-user-btn">
          <UserPlus size={18} /> New User Account
        </button>
      </header>

      <div className="dir-controls">
        <div className="search-box">
          <Search size={18} />
          <input 
            placeholder="Search by name or email..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filter-tabs">
          <button 
            className={filterRole === 'all' ? 'active' : ''} 
            onClick={() => setFilterRole('all')}
          >All Members</button>
          <button 
            className={filterRole === 'professor' ? 'active' : ''} 
            onClick={() => setFilterRole('professor')}
          >Professors</button>
          <button 
            className={filterRole === 'student' ? 'active' : ''} 
            onClick={() => setFilterRole('student')}
          >Students</button>
          <button 
            className={filterRole === 'admin' ? 'active' : ''} 
            onClick={() => setFilterRole('admin')}
          >Admins</button>
        </div>
      </div>

      <div className="user-grid">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((u, idx) => (
            <motion.div 
              key={u.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
                layout: { duration: 0.3 }
              }}
              className="user-card"
            >
              <div className="card-top">
                <div className="avatar-large">{u.first_name[0]}{u.last_name[0]}</div>
                <div className="role-badge" data-role={u.role}>
                  {u.role === 'admin' ? <Shield size={12}/> : u.role === 'professor' ? <UserCheck size={12}/> : <Users size={12}/>}
                  {u.role}
                </div>
              </div>
              
              <div className="card-info">
                <h3>{u.first_name} {u.last_name}</h3>
                <div className="email-link">
                  <Mail size={12} /> {u.email}
                </div>
              </div>

              <div className="card-actions">
                <button className="edit-btn">Manage</button>
                <button onClick={() => handleDelete(u.id)} className="delete-btn"><Trash2 size={16}/></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add User Drawer */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="drawer-overlay" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="drawer">
              <div className="drawer-header">
                <h2>Create Identity</h2>
                <button onClick={() => setShowAdd(false)}><X /></button>
              </div>
              <form onSubmit={handleCreate} className="drawer-form">
                <div className="form-group">
                  <label>First Name</label>
                  <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Initial Password</label>
                  <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>System Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <button type="submit" className="submit-btn">Initialize Account</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .directory-studio { display: flex; flex-direction: column; gap: 40px; }
        
        .dir-header { display: flex; justify-content: space-between; align-items: center; }
        .dir-header h1 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -1.5px; }
        .dir-header .count { color: #2563eb; opacity: 0.5; font-size: 1.5rem; }
        .dir-header p { color: #64748b; font-weight: 500; }
        
        .add-user-btn { background: #0f172a; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
        .add-user-btn:hover { background: #2563eb; transform: translateY(-2px); }

        .dir-controls { display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 10px; border-radius: 16px; border: 1px solid #e2e8f0; }
        .search-box { display: flex; align-items: center; gap: 12px; padding: 0 15px; flex: 1; }
        .search-box input { border: none; outline: none; flex: 1; font-weight: 600; font-size: 14px; color: #1e293b; }
        .filter-tabs { display: flex; gap: 5px; }
        .filter-tabs button { background: none; border: none; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 13px; color: #64748b; cursor: pointer; transition: 0.2s; }
        .filter-tabs button.active { background: #f1f5f9; color: #0f172a; }

        .user-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .user-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 24px; position: relative; overflow: hidden; }
        .user-card:hover { transform: translateY(-5px); border-color: #2563eb; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        
        .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .avatar-large { width: 48px; height: 48px; background: #f1f5f9; color: #0f172a; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 18px; }
        .role-badge { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }
        .role-badge[data-role="admin"] { background: #fee2e2; color: #ef4444; }
        .role-badge[data-role="professor"] { background: #eff6ff; color: #2563eb; }
        .role-badge[data-role="student"] { background: #f1f5f9; color: #64748b; }

        .card-info h3 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0; }
        .email-link { font-size: 12px; color: #94a3b8; margin-top: 5px; display: flex; align-items: center; gap: 6px; font-weight: 600; }

        .card-actions { display: flex; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
        .edit-btn { flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #0f172a; font-weight: 700; font-size: 12px; cursor: pointer; transition: 0.2s; }
        .edit-btn:hover { background: #f8fafc; }
        .delete-btn { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: none; background: #fef2f2; color: #ef4444; cursor: pointer; transition: 0.2s; }
        .delete-btn:hover { background: #fee2e2; }

        .drawer-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); z-index: 1000; }
        .drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 450px; background: #fff; z-index: 1001; padding: 40px; box-shadow: -10px 0 50px rgba(0,0,0,0.1); }
        .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .drawer-header h2 { font-weight: 900; color: #0f172a; margin: 0; }
        .drawer-header button { background: none; border: none; color: #94a3b8; cursor: pointer; }
        
        .drawer-form { display: flex; flex-direction: column; gap: 24px; }
        .form-group label { display: block; font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
        .form-group input, .form-group select { width: 100%; padding: 12px 15px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; font-weight: 600; background: #f8fafc; }
        .form-group input:focus { border-color: #2563eb; background: #fff; }
        .submit-btn { margin-top: 20px; padding: 14px; border-radius: 12px; border: none; background: #2563eb; color: #fff; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .submit-btn:hover { background: #1d4ed8; transform: translateY(-2px); }

        .studio-init { height: 100vh; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #2563eb; letter-spacing: 2px; }
      `}</style>
    </div>
  );
};

export default UserManager;
