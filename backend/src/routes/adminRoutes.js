import express from 'express';
import { createAdmin, getAdmins, updateAdmin, deleteAdmin, loginAdmin, verifyAdminCode } from '../services/adminService.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { createUser } from '../models/userModel.js'; // AJOUTE ÇA
import prisma from '../config/db.js'; // AJOUTE ÇA


const router = express.Router();


// Ajoute ÇA dans ton router existant
router.post('/create-first-admin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    // Vérifie s’il y a déjà un admin
    const existing = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (existing) {
      return res.status(403).json({ error: 'Un admin existe déjà. Utilise /login' });
    }

    // Utilise createUser du model
    const admin = await createUser(email, password, 'admin');

    res.status(201).json({
      message: 'Premier admin créé avec succès !',
      email: admin.email,
      id: admin.id
    });
  } catch (err) {
    console.error('ERREUR CREATE ADMIN:', err); // LOG DÉTAILLÉ
    res.status(500).json({
      error: 'Erreur création admin',
      details: err.message
    });
  }
});

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