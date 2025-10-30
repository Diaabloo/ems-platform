import express from 'express';
import { createAdmin, getAdmins, updateAdmin, deleteAdmin, loginAdmin, verifyAdminCode } from '../services/adminService.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// CRUD Admin (with JWT protect)
// Login GET(userId, OTP in email)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email or password required'});
    }
    const result = await loginAdmin(email, password);
    if (!result) return res.status(401).json({ error: 'Email or password invalid' });
    res.json({ message: 'Check your email', userId: result.userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP et Get JWT
router.post('/verify', async (req, res) => {
  const { userId, code } = req.body;
  try {
    if (!userId || !code) {
      return res.status(400).json({ error: 'userId and code required' });
    }
    const token = await verifyAdminCode(userId, code);
    if (!token) return res.status(400).json({ error: 'Code invalid or expire' });
    res.json({ message: 'Verification successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  try {
    if (!email && !password) {
      return res.status(400).json({ error: 'One field (email or password) must be provided' });
    }
    const admin = await updateAdmin(Number(id), email, password);
    res.json(admin);
  } catch (err) {
    res.status(err.message.includes('Email already used') ? 409 : 400).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteAdmin(Number(id));
    res.json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;