const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const router = express.Router();

// Sign up route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields: name, email, password' });
  }

  // Sanitize and validate email
  const sanitizedEmail = email.trim();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [sanitizedEmail]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password too short. Minimum length is 6 characters.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, sanitizedEmail, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, email: sanitizedEmail },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      id: result.insertId,
      name,
      email: sanitizedEmail,
      token,
    });

  } catch (err) {
    console.error('Error in signup:', err.stack);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields: email, password' });
  }

  const sanitizedEmail = email.trim();

  try {
    const [user] = await pool.execute('SELECT * FROM users WHERE email = ?', [sanitizedEmail]);
    if (!user || user.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const dbUser = user[0];

    const match = await bcrypt.compare(password, dbUser.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: dbUser.id, email: dbUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      token,
    });

  } catch (err) {
    console.error('Error in login:', err.stack);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

// Create a new user (outside of signup/login)
router.post('/users', async (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ error: 'Missing required fields: name, email, age' });
  }

  // Sanitize and validate email
  const sanitizedEmail = email.trim();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [sanitizedEmail]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, sanitizedEmail, age]
    );

    res.status(201).json({
      message: 'User created successfully',
      id: result.insertId,
      name,
      email: sanitizedEmail,
      age,
    });

  } catch (err) {
    console.error('Error in /users route:', err.stack);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token || token === 'undefined') {
    return res.status(401).json({ error: 'No token provided or token malformed' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const [user] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [userId]);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user[0] });

  } catch (err) {
    console.error('Error in /me route:', err);
    res.status(500).json({ error: 'Failed to authenticate token' });
  }
});

module.exports = router;
