import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Checkout() {
  const { cart, total, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState('tarjeta');
  const [whatsapp, setWhatsapp] = useState('');
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [savedCart, setSavedCart] = useState([]);
  const [savedTotal, setSavedTotal] = useState(0);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const handlePay = async () => {
    if (!user) return navigate('/login');
    if (cart.length === 0) return;

    // Guardar carrito ANTES de limpiar
    const cartSnapshot = [...cart];
    const totalSnapshot = total;

    const { data } = await api.post('/orders', {
      items: cart,
      payment_method: payment,
      whatsapp
    });

    setSavedCart(cartSnapshot);
    setSavedTotal(totalSnapshot);
    setOrderId(data.order_id);
    clearCart();
    setDone(true);
  };

  const sendWhatsApp = () => {
    const fecha = new Date().toLocaleDateString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
    const hora = new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit', minute: '2-digit'
    });

    const lineas = savedCart.map(i =>
      `  • ${i.name}%0A    Cantidad: ${i.quantity} x S/ ${parseFloat(i.price).toFixed(2)} = S/ ${(i.price * i.quantity).toFixed(2)}`
    ).join('%0A');

    const metodo = payment.charAt(0).toUpperCase() + payment.slice(1);

    const msg =
      `━━━━━━━━━━━━━━━━━━━━━━%0A` +
      `🎓 *EDUSHOP - BOLETA DE VENTA*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━━%0A%0A` +
      `📋 *N° Orden:* ${orderId}%0A` +
      `📅 *Fecha:* ${fecha} ${hora}%0A` +
      `👤 *Cliente:* ${user.name}%0A` +
      `💳 *Método de pago:* ${metodo}%0A%0A` +
      `━━━━━━━━━━━━━━━━━━━━━━%0A` +
      `🛒 *DETALLE DE COMPRA*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━━%0A%0A` +
      `${lineas}%0A%0A` +
      `━━━━━━━━━━━━━━━━━━━━━━%0A` +
      `💰 *TOTAL A PAGAR: S/ ${savedTotal.toFixed(2)}*%0A` +
      `━━━━━━━━━━━━━━━━━━━━━━%0A%0A` +
      `✅ Gracias por tu compra, ${user.name}!%0A` +
      `🎓 Sigue aprendiendo con EduShop`;

    window.open(`https://wa.me/${whatsapp}?text=${msg}`, '_blank');
  };

  if (done) return (
    <div style={styles.page}>
      <div style={styles.successCard}>
        <div style={styles.checkIcon}>✅</div>
        <h2 style={styles.successTitle}>¡Pago Confirmado!</h2>
        <p style={styles.successSub}>Orden <strong>#{orderId}</strong> registrada exitosamente</p>

        <div style={styles.receiptBox}>
          <h3 style={styles.receiptTitle}>🧾 Resumen de tu compra</h3>
          {savedCart.map(item => (
            <div key={item.id} style={styles.receiptItem}>
              <span style={styles.receiptName}>{item.name}</span>
              <span style={styles.receiptQty}>x{item.quantity}</span>
              <span style={styles.receiptPrice}>S/ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.receiptTotal}>
            <span>TOTAL</span>
            <span>S/ {savedTotal.toFixed(2)}</span>
          </div>
          <div style={styles.receiptMeta}>
            <span>💳 {payment.charAt(0).toUpperCase() + payment.slice(1)}</span>
            <span>👤 {user?.name}</span>
          </div>
        </div>

        {whatsapp && (
          <button onClick={sendWhatsApp} style={styles.whatsappBtn}>
            📱 Enviar Boleta por WhatsApp
          </button>
        )}
        <button onClick={() => navigate('/products')} style={styles.continueBtn}>
          Seguir Comprando
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🛒 Carrito de Compras</h2>

        {cart.length === 0 ? (
          <div style={styles.empty}>
            <p style={{ fontSize: '3rem' }}>🛒</p>
            <p style={{ color: '#64748b' }}>Tu carrito está vacío</p>
            <button onClick={() => navigate('/products')} style={styles.continueBtn}>Ver Productos</button>
          </div>
        ) : (
          <>
            <div style={styles.itemsList}>
              {cart.map(item => (
                <div key={item.id} style={styles.item}>
                  <div style={styles.itemInfo}>
                    <span style={styles.itemName}>{item.name}</span>
                    <span style={styles.itemUnit}>S/ {parseFloat(item.price).toFixed(2)} c/u</span>
                  </div>
                  <div style={styles.itemRight}>
                    <span style={styles.itemQty}>x{item.quantity}</span>
                    <span style={styles.itemTotal}>S/ {(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.totalBox}>
              <span style={{ color: '#64748b' }}>Total a pagar</span>
              <span style={styles.totalAmount}>S/ {total.toFixed(2)}</span>
            </div>

            <h3 style={styles.sectionTitle}>💳 Método de Pago</h3>
            <div style={styles.payMethods}>
              {[['tarjeta','💳 Tarjeta'],['yape','📱 Yape'],['plin','📱 Plin'],['transferencia','🏦 Transferencia']].map(([val, label]) => (
                <button key={val} onClick={() => setPayment(val)}
                  style={{ ...styles.payBtn, ...(payment === val ? styles.payActive : {}) }}>
                  {label}
                </button>
              ))}
            </div>

            {payment === 'tarjeta' && (
              <div style={styles.cardForm}>
                <input style={styles.input} placeholder="Número de tarjeta (16 dígitos)" maxLength={16}
                  value={cardData.number} onChange={e => setCardData({ ...cardData, number: e.target.value })} />
                <input style={styles.input} placeholder="Nombre en la tarjeta"
                  value={cardData.name} onChange={e => setCardData({ ...cardData, name: e.target.value })} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input style={styles.input} placeholder="MM/AA" maxLength={5}
                    value={cardData.expiry} onChange={e => setCardData({ ...cardData, expiry: e.target.value })} />
                  <input style={styles.input} placeholder="CVV" maxLength={3}
                    value={cardData.cvv} onChange={e => setCardData({ ...cardData, cvv: e.target.value })} />
                </div>
              </div>
            )}
            {payment === 'yape' && <div style={styles.infoBox}>📱 Yapea al: <strong>+51 999 888 777</strong></div>}
            {payment === 'plin' && <div style={styles.infoBox}>📱 Plin al: <strong>+51 999 888 777</strong></div>}
            {payment === 'transferencia' && (
              <div style={styles.infoBox}>
                🏦 BCP: <strong>123-456-789012</strong><br />
                🏦 Interbank: <strong>987-654-321098</strong>
              </div>
            )}

            <input style={{ ...styles.input, marginTop: '1rem' }}
              placeholder="📱 WhatsApp para boleta: 51999888777"
              value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />

            <button onClick={handlePay} style={styles.payFinalBtn}>
              ✅ Confirmar Pago — S/ {total.toFixed(2)}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f1f5f9', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  card: { background: 'white', padding: '2rem', borderRadius: '20px', width: '100%', maxWidth: '560px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' },
  title: { fontSize: '1.6rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1.5rem' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' },
  itemInfo: { display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 },
  itemName: { fontWeight: '700', color: '#1a1a2e', fontSize: '0.95rem' },
  itemUnit: { color: '#94a3b8', fontSize: '0.8rem' },
  itemRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  itemQty: { background: '#e0e7ff', color: '#4338ca', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem' },
  itemTotal: { fontWeight: '800', color: '#e94560', fontSize: '1rem', minWidth: '70px', textAlign: 'right' },
  removeBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontWeight: '700' },
  totalBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#1a1a2e', borderRadius: '12px', marginBottom: '1.5rem' },
  totalAmount: { fontSize: '1.5rem', fontWeight: '800', color: 'white' },
  sectionTitle: { fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', marginBottom: '0.8rem' },
  payMethods: { display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' },
  payBtn: { padding: '0.6rem 1rem', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
  payActive: { border: '1.5px solid #e94560', background: '#fff0f3', color: '#e94560' },
  cardForm: { marginBottom: '1rem' },
  input: { width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem', marginBottom: '0.8rem', boxSizing: 'border-box', color: '#1a1a2e', background: '#f8fafc' },
  infoBox: { background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '1rem', color: '#166534', marginBottom: '1rem', lineHeight: 1.8 },
  payFinalBtn: { width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #e94560, #a855f7)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: '800', marginTop: '0.5rem' },
  empty: { textAlign: 'center', padding: '3rem 0' },

  // Pantalla de éxito
  successCard: { background: 'white', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', textAlign: 'center' },
  checkIcon: { fontSize: '4rem', marginBottom: '1rem' },
  successTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '0.5rem' },
  successSub: { color: '#64748b', marginBottom: '2rem' },
  receiptBox: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' },
  receiptTitle: { fontWeight: '800', color: '#1a1a2e', marginBottom: '1rem', textAlign: 'center' },
  receiptItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #e2e8f0', gap: '0.5rem' },
  receiptName: { flex: 1, fontSize: '0.9rem', color: '#374151', fontWeight: '500' },
  receiptQty: { background: '#e0e7ff', color: '#4338ca', padding: '0.1rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' },
  receiptPrice: { fontWeight: '700', color: '#e94560', minWidth: '80px', textAlign: 'right' },
  receiptTotal: { display: 'flex', justifyContent: 'space-between', padding: '1rem 0 0.5rem', fontWeight: '800', fontSize: '1.2rem', color: '#1a1a2e' },
  receiptMeta: { display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' },
  whatsappBtn: { width: '100%', padding: '1rem', background: '#25d366', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer', fontWeight: '800', marginBottom: '0.8rem' },
  continueBtn: { width: '100%', padding: '0.9rem', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600' },
};