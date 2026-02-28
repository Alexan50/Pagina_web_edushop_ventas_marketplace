import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { theme, dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav style={{ ...styles.nav, background: theme.navBg, borderBottom: `1px solid ${theme.navBorder}` }}>
      {/* Logo */}
      <Link to="/" style={styles.brand}>
        <span style={styles.brandLogo}>🎓</span>
        <span style={{ color: theme.text }}>Edu<span style={styles.brandAccent}>Shop</span></span>
      </Link>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <div style={{ ...styles.searchBox, background: theme.input, border: `1.5px solid ${theme.inputBorder}` }}>
          <span style={{ color: theme.text3, fontSize: '1rem' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar cursos, libros..."
            style={{ ...styles.searchInput, color: theme.text, background: 'transparent' }}
          />
          <button type="submit" style={styles.searchBtn}>Buscar</button>
        </div>
      </form>

      {/* Links */}
      <div style={styles.links}>
        <Link to="/products" style={{ ...styles.link, color: theme.text2 }}>Catálogo</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" style={styles.adminLink}>⚙️ Admin</Link>
        )}
        {user ? (
          <>
            <span style={{ ...styles.userName, color: theme.text2 }}>👋 {user.name.split(' ')[0]}</span>
            <button onClick={() => { logout(); navigate('/'); }} style={styles.logoutBtn}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ ...styles.link, color: theme.text2 }}>Iniciar Sesión</Link>
            <Link to="/register" style={styles.registerBtn}>Registrarse</Link>
          </>
        )}

        {/* Dark mode toggle */}
        <button onClick={toggle} style={{ ...styles.themeBtn, background: theme.input, border: `1px solid ${theme.inputBorder}`, color: theme.text }} title={dark ? 'Modo claro' : 'Modo oscuro'}>
          {dark ? '☀️' : '🌙'}
        </button>

        {/* Cart */}
        <Link to="/checkout" style={styles.cartBtn}>
          🛒
          {cart.length > 0 && <span style={styles.cartBadge}>{cart.length}</span>}
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', gap: '1.5rem',
    padding: '0.9rem 2rem', position: 'sticky', top: 0, zIndex: 999,
    backdropFilter: 'blur(12px)', width: '100%', boxSizing: 'border-box',
  },
  brand: {
    textDecoration: 'none', fontWeight: '800', fontSize: '1.5rem',
    display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap',
  },
  brandLogo: { fontSize: '1.6rem' },
  brandAccent: { color: '#4f46e5' },
  searchForm: { flex: 1, maxWidth: '480px' },
  searchBox: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    padding: '0.5rem 0.8rem', borderRadius: '12px',
  },
  searchInput: {
    flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem',
    fontFamily: 'inherit',
  },
  searchBtn: {
    background: '#4f46e5', color: 'white', border: 'none',
    padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer',
    fontWeight: '600', fontSize: '0.85rem', whiteSpace: 'nowrap',
  },
  links: { display: 'flex', alignItems: 'center', gap: '0.8rem', whiteSpace: 'nowrap' },
  link: { textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' },
  adminLink: { color: '#7c3aed', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' },
  userName: { fontSize: '0.9rem', fontWeight: '500' },
  logoutBtn: {
    background: 'transparent', color: '#ef4444', border: '1px solid #fca5a5',
    padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
  },
  registerBtn: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white',
    padding: '0.45rem 1.1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem',
  },
  themeBtn: {
    width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cartBtn: {
    position: 'relative', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: 'white', padding: '0.5rem 1rem', borderRadius: '10px',
    textDecoration: 'none', fontWeight: '700', fontSize: '1rem',
  },
  cartBadge: {
    position: 'absolute', top: '-8px', right: '-8px', background: '#ef4444',
    color: 'white', borderRadius: '50%', width: '20px', height: '20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800',
  },
};