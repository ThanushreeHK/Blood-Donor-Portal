/**
 * @file authController.js
 * @description Handles user registration, login, and profile retrieval.
 */
const bcrypt = require('bcryptjs');
const { createUser, findByEmail, findById } = require('../models/User');
const { generateToken } = require('../utils/generateToken');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 */
async function register(req, res) {
  try {
    const { name, email, password, role, phone, consent } = req.body;

    // 1. Check if user already exists
    const existingUser = await findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // 2. Hash the password (never store plain text!)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create the user in Firestore
    const userId = await createUser({
      name,
      email,
      passwordHash,
      role,
      phone,
      consent: Boolean(consent)
    });

    // 4. Generate a JWT token so they are logged in immediately
    const token = generateToken({ uid: userId, role });

    res.status(201).json({
      success: true,
      data: { token, user: { id: userId, name, email, role } }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
}

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Find the user
    const user = await findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 2. Compare the provided password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Generate token
    const token = generateToken({ uid: user.id, role: user.role });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
}

/**
 * @route GET /api/auth/me
 * @desc Get current user profile (requires token)
 */
async function getMe(req, res) {
  try {
    // req.user.uid comes from the auth middleware!
    const user = await findById(req.user.uid);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Don't send the password hash back to the frontend
    delete user.passwordHash;
    
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { register, login, getMe };