const router = require('express').Router();
const db = require('../config/db');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Crear orden
router.post('/', verifyToken, async (req, res) => {
  const { items, payment_method, whatsapp } = req.body;
  const user_id = req.user.id;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [result] = await db.execute(
    'INSERT INTO orders (user_id, total, payment_method, status, whatsapp) VALUES (?,?,?,?,?)',
    [user_id, total, payment_method, 'paid', whatsapp]
  );
  const order_id = result.insertId;

  for (const item of items) {
    await db.execute('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
      [order_id, item.id, item.quantity, item.price]);
  }

  res.json({ message: 'Pedido creado', order_id, total });
});

// Obtener todas las órdenes (admin)
router.get('/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const [orders] = await db.execute(`
      SELECT o.*, u.name as user_name 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener órdenes' });
  }
});

module.exports = router;