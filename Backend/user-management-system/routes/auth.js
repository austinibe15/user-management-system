const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Sign up route
router.post('/signup', async (req, res) => {
  const { name, email, password, age } = req.body;

  if (!name || !email || !password || !age) {
    return res.status(400).json({ error: 'Missing required fields: name, email, password, age' });
  }

  // Sanitize and validate email
  const sanitizedEmail = email.trim();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Check if user with this email already exists
    const [existingUser] = await pool.execute('SELECT * FROM users WHERE email = ?', [sanitizedEmail]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password_hash, age) VALUES (?, ?, ?, ?)',
      [name, sanitizedEmail, hashedPassword, age]
    );

    // Create a JWT token for the newly registered user
    const token = jwt.sign(
      { id: result.insertId, email: sanitizedEmail },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Respond with user data and token
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

    // Compare passwords
    const match = await bcrypt.compare(password, dbUser.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
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

// Protected route to get current user info
router.get('/me', authenticateToken, async (req, res) => {
  const userId = req.user.id;  // Get user id from the JWT payload

  try {
    const [user] = await pool.execute('SELECT id, name, email FROM users WHERE id = ?', [userId]);

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: user[0] });
  } catch (err) {
    console.error('Error in /me route:', err.stack);
    res.status(500).json({ error: 'Failed to authenticate token' });
  }
});

// Add a new user (protected route)
router.post('/users', authenticateToken, async (req, res) => {
  const { name, email, age } = req.body;

  if (!name || !email || !age) {
    return res.status(400).json({ error: 'Missing required fields: name, email, age' });
  }

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

    const newUser = { id: result.insertId, name, email: sanitizedEmail, age };
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error in /users route:', err.stack);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

// Get all users (protected route)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, name, email, age FROM users');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err.stack);
    res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
  }
});

module.exports = router;
