import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Component-specific styles
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [authError, setAuthError] = useState(null);
  const [mode, setMode] = useState('login');

  // Initialize axios with auth header if token exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Persist token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Auto-login (verify token)
  useEffect(() => {
    const tryAutoLogin = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data.user);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    tryAutoLogin();
  }, [token]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE}/users`);
        setUsers(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Signup handler
  const handleSignup = async (name, email, password, age) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/signup`, { name, email, password, age });
      return res.data;
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        setAuthError('Email already registered');
      } else {
        setAuthError('An error occurred. Please try again.');
      }
      throw err;
    }
  };

  // Login handler
  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const { token: tkn, user: u } = res.data;
      setToken(tkn);
      setUser(u);
      setAuthError(null);
      return res.data;
    } catch (err) {
      console.error(err);
      setAuthError('Login failed');
      throw err;
    }
  };

  // Logout handler
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  return (
    <div>
      <h1>Welcome to User Management</h1>

      {loading && <p>Loading...</p>}

      {!loading && !token && mode === 'login' && (
        <div>
          <h2>Login</h2>
          <LoginForm onSubmit={handleLogin} error={authError} />
          {authError && <p className="error">{authError}</p>}
          <hr />
          <p>Don't have an account? <button onClick={() => setMode('signup')}>Signup</button></p>
        </div>
      )}

      {!loading && !token && mode === 'signup' && (
        <div>
          <h2>Signup</h2>
          <SignupForm onSubmit={handleSignup} error={authError} />
          {authError && <p className="error">{authError}</p>}
          <hr />
          <p>Already have an account? <button onClick={() => setMode('login')}>Login</button></p>
        </div>
      )}

      {!loading && token && (
        <div>
          <h2>Welcome, {user?.name ?? 'User'}</h2>
          <button onClick={handleLogout}>Logout</button>
          <h3>Users List</h3>
          <UserList users={users} />
          <h3>Add User</h3>
          <UserForm />
        </div>
      )}
    </div>
  );
};

export default App;
