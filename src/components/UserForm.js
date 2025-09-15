import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';  // Declare API_BASE

const UserForm = ({ setUsers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);  // Reset any previous error
    setLoading(true);  // Start loading
    try {
      const response = await axios.post(`${API_BASE}/users`, { name, email, age });
      setUsers((prevUsers) => [...prevUsers, response.data]);
      // Clear form after successful submission
      setName('');
      setEmail('');
      setAge('');
    } catch (err) {
      setError('Failed to add user. Please try again.');  // Handle error
      console.error(err);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding user...' : 'Add User'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default UserForm;
