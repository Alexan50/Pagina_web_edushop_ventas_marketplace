const db = require('../config/db');

exports.getAll = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE active = 1');
  res.json(rows);
};

exports.getOne = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(rows[0]);
};

exports.create = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  // Si subió archivo usa el nombre del archivo, si no usa la URL directamente
  const image = req.file ? req.file.filename : (req.body.image || '');
  await db.execute(
    'INSERT INTO products (name, description, price, category, image, stock) VALUES (?,?,?,?,?,?)',
    [name, description, price, category, image, stock]
  );
  res.json({ message: 'Producto creado' });
};

exports.update = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  // Si subió archivo usa el nombre del archivo, si no usa la URL directamente
  const image = req.file ? req.file.filename : (req.body.image || '');
  await db.execute(
    'UPDATE products SET name=?, description=?, price=?, category=?, image=?, stock=? WHERE id=?',
    [name, description, price, category, image, stock, req.params.id]
  );
  res.json({ message: 'Producto actualizado' });
};

exports.remove = async (req, res) => {
  await db.execute('UPDATE products SET active = 0 WHERE id = ?', [req.params.id]);
  res.json({ message: 'Producto eliminado' });
};