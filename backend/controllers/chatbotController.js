const db = require('../config/db');

exports.chat = async (req, res) => {
  const { message } = req.body;
  const msg = message.toLowerCase();
  const [products] = await db.execute('SELECT * FROM products WHERE active = 1');

  let reply = '';

  if (msg.includes('precio') || msg.includes('cuánto cuesta') || msg.includes('cuanto cuesta')) {
    const matches = products.filter(p => msg.includes(p.name.toLowerCase().split(' ')[2] || p.name.toLowerCase().split(' ')[1]));
    if (matches.length) {
      reply = matches.map(p => `📚 ${p.name}: S/ ${p.price}`).join('\n');
    } else {
      reply = 'Los precios van desde S/ 17.99 hasta S/ 59.99. ¿Sobre qué producto quieres saber?';
    }
  } else if (msg.includes('curso')) {
    const cursos = products.filter(p => p.category === 'curso');
    reply = '📘 Nuestros cursos:\n' + cursos.map(p => `• ${p.name} - S/ ${p.price}`).join('\n');
  } else if (msg.includes('libro')) {
    const libros = products.filter(p => p.category === 'libro');
    reply = '📖 Nuestros libros:\n' + libros.map(p => `• ${p.name} - S/ ${p.price}`).join('\n');
  } else if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas')) {
    reply = '¡Hola! 👋 Bienvenido a EduShop. Puedo ayudarte con información sobre nuestros cursos y libros. ¿Qué necesitas?';
  } else if (msg.includes('pago') || msg.includes('pagar')) {
    reply = '💳 Aceptamos: Tarjeta de crédito/débito, Yape, Plin y transferencia bancaria.';
  } else if (msg.includes('descuento') || msg.includes('oferta')) {
    reply = '🎉 Actualmente tenemos descuentos en paquetes. ¡Compra 2 cursos y obtén 15% de descuento!';
  } else {
    reply = 'Puedo ayudarte con:\n• Lista de cursos y libros\n• Precios\n• Métodos de pago\n¿Qué quieres saber?';
  }

  res.json({ reply });
};