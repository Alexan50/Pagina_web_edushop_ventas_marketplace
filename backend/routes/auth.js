const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/create-admin', verifyToken, isAdmin, async (req, res) => {
  const db = require('../config/db');
  const bcrypt = require('bcryptjs');
  try {
    const { name, email, password } = req.body;
    const [exists] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(400).json({ message: 'El email ya está registrado' });
    const hash = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)', [name, email, hash, 'admin']);
    res.json({ message: 'Administrador creado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;