import React, { useState } from 'react';
import axios from 'axios';

const User = ({ user, setUsers, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = () => {
    setLoading(true);
    axios.delete(`http://localhost:5000/users/${user.id}`)
      .then(() => {
        // Prefer provided setter callback if available
        if (typeof setUsers === 'function') {
          setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
        } else if (typeof onDelete === 'function') {
          onDelete(user.id);
        } else {
          console.warn('No setUsers or onDelete callback provided for deletion.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Failed to delete user');
        setLoading(false);
      });
  };

  const handleUpdate = () => {
    setLoading(true);
    axios.put(`http://localhost:5000/users/${user.id}`, updatedUser)
      .then(response => {
        if (typeof setUsers === 'function') {
          setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? response.data : u));
        } else if (typeof onUpdate === 'function') {
          onUpdate(response.data);
        } else {
          console.warn('No setUsers or onUpdate callback provided for update.');
        }
        setIsEditing(false);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Failed to update user');
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      {isEditing ? (
        <div>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="number"
            name="age"
            value={updatedUser.age}
            onChange={handleChange}
            placeholder="Age"
          />
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setIsEditing(false)} disabled={loading}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p>{user.age}</p>
          <button onClick={() => setIsEditing(true)} disabled={loading}>Edit</button>
          <button onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default User;