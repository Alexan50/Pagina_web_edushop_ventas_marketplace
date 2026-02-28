import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { theme } = useTheme();

  return (
    <div style={{ ...styles.card, background: theme.card, border: `1px solid ${theme.cardBorder}` }}>
      <div style={styles.imgWrap}>
        <img
          src={`http://localhost:5000/uploads/${product.image}`}
          alt={product.name}
          style={styles.img}
          onError={e => e.target.src = `https://placehold.co/400x200/4f46e5/white?text=${encodeURIComponent(product.name.substring(0,15))}`}
        />
        <span style={{ ...styles.badge, background: product.category === 'curso' ? '#eef2ff' : '#fdf4ff', color: product.category === 'curso' ? '#4f46e5' : '#7c3aed' }}>
          {product.category === 'curso' ? '📘 Curso' : '📖 Libro'}
        </span>
      </div>
      <div style={styles.body}>
        <h3 style={{ ...styles.name, color: theme.text }}>{product.name}</h3>
        <p style={{ ...styles.desc, color: theme.text2 }}>{product.description?.substring(0, 80)}...</p>
        <div style={styles.footer}>
          <div>
            <div style={{ color: theme.text3, fontSize: '0.75rem', marginBottom: '0.1rem' }}>Precio</div>
            <span style={styles.price}>S/ {parseFloat(product.price).toFixed(2)}</span>
          </div>
          <button onClick={() => addToCart(product)} style={styles.btn}>
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    borderRadius: '16px', overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  imgWrap: { position: 'relative', width: '100%', height: '170px', overflow: 'hidden', background: '#f1f5f9' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' },
  badge: {
    position: 'absolute', top: '10px', left: '10px',
    padding: '0.3rem 0.8rem', borderRadius: '20px',
    fontSize: '0.75rem', fontWeight: '700',
  },
  body: { padding: '1.3rem' },
  name: { fontSize: '0.98rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: 1.4 },
  desc: { fontSize: '0.84rem', marginBottom: '1.2rem', lineHeight: 1.6 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontWeight: '800', color: '#4f46e5', fontSize: '1.35rem' },
  btn: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: 'white', border: 'none', padding: '0.55rem 1.1rem',
    borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '0.88rem',
    boxShadow: '0 3px 10px rgba(79,70,229,0.3)',
  },
};