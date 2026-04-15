import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, Trash2, Shield, Mail, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserManager = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ first_name: '', last_name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewUser({ first_name: '', last_name: '', email: '', password: '', role: 'student' });
      fetchUsers();
    } catch (err) {
      alert("Failed to create user. Email might already exist.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'var(--siia-navy)', margin: 0 }}>User Management</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: '10px' }}>
          <UserPlus size={18} /> Add New Staff/Student
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '15px 25px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>USER</th>
              <th style={{ padding: '15px 25px', textAlign: 'left', fontSize: '13px', color: '#64748b' }}>ROLE</th>
              <th style={{ padding: '15px 25px', textAlign: 'right', fontSize: '13px', color: '#64748b' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px 25px' }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--siia-navy)' }}>{u.first_name} {u.last_name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{u.email}</div>
                </td>
                <td style={{ padding: '15px 25px' }}>
                  <span style={{ 
                    padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase',
                    background: u.role === 'admin' ? '#fee2e2' : u.role === 'professor' ? '#eff6ff' : '#f1f5f9',
                    color: u.role === 'admin' ? '#ef4444' : u.role === 'professor' ? '#2563eb' : '#64748b'
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '15px 25px', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2>Create New User</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X/></button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>First Name</label>
                  <input type="text" required value={newUser.first_name} onChange={(e) => setNewUser({...newUser, first_name: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Last Name</label>
                  <input type="text" required value={newUser.last_name} onChange={(e) => setNewUser({...newUser, last_name: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
                <input type="email" required value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Password</label>
                <input type="password" required value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Create Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
