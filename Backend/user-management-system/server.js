require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db/db');
const authRouter = require('./routes/auth');
const jwt = require('jsonwebtoken');

const app = express();

// CORS Setup
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Allow frontend from localhost:3000 by default
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // Use built-in Express JSON parser

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.status(200).json({ ok: true, message: 'DB connection OK', rows });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Auth routes
app.use('/auth', authRouter);

// Users CRUD operations
app.get('/users', authenticateJWT, async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  try {
    const [rows] = await pool.execute('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update a User
app.put('/users/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  if (!name && !email && !age) {
    return res.status(400).json({ error: 'At least one field (name, email, or age) must be provided for update' });
  }

  try {
    const fields = [];
    const values = [];

    if (name != null) {
      fields.push('name = ?');
      values.push(name);
    }
    if (email != null) {
      fields.push('email = ?');
      values.push(email);
    }
    if (age != null) {
      fields.push('age = ?');
      values.push(age);
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await pool.execute(sql, values);

    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a User
app.delete('/users/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
