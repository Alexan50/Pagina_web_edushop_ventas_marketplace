import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Productos', icon: '📦' },
  { to: '/admin/stock', label: 'Control de Stock', icon: '🗃️' },
  { to: '/admin/ventas', label: 'Ventas', icon: '💰' },
  { to: '/admin/analytics', label: 'Analíticas', icon: '📈' },
  { to: '/admin/new', label: 'Nuevo Producto', icon: '➕' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={{ ...styles.sidebar, width: collapsed ? '70px' : '240px' }}>
        {/* Logo */}
        <div style={styles.sideTop}>
          <div style={styles.logoWrap}>
            <span style={styles.logoIcon}>🎓</span>
            {!collapsed && <span style={styles.logoText}>EduShop <span style={styles.adminBadge}>Admin</span></span>}
          </div>
          <button onClick={() => setCollapsed(c => !c)} style={styles.collapseBtn}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        {/* User info */}
        {!collapsed && (
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>👤</div>
            <div>
              <div style={styles.userName}>{user?.name}</div>
              <div style={styles.userRole}>Administrador</div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={styles.nav}>
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navActive : {}),
                justifyContent: collapsed ? 'center' : 'flex-start',
              })}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={styles.sideBottom}>
          <NavLink to="/" style={{ ...styles.navItem, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <span style={styles.navIcon}>🏠</span>
            {!collapsed && <span>Ir al sitio</span>}
          </NavLink>
          <button onClick={handleLogout} style={{ ...styles.navItem, ...styles.logoutItem, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <span style={styles.navIcon}>🚪</span>
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', background: '#f1f5f9' },
  sidebar: {
    background: '#0f172a', display: 'flex', flexDirection: 'column',
    transition: 'width 0.3s ease', flexShrink: 0,
    position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', overflowX: 'hidden',
  },
  sideTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logoIcon: { fontSize: '1.6rem', flexShrink: 0 },
  logoText: { color: 'white', fontWeight: '800', fontSize: '1rem', whiteSpace: 'nowrap' },
  adminBadge: { background: '#4f46e5', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', marginLeft: '0.3rem' },
  collapseBtn: { background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: 'none', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 },
  userCard: { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', margin: '0.8rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' },
  userAvatar: { fontSize: '1.8rem', background: '#4f46e5', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  userName: { color: 'white', fontWeight: '700', fontSize: '0.88rem', whiteSpace: 'nowrap' },
  userRole: { color: '#64748b', fontSize: '0.75rem' },
  nav: { flex: 1, padding: '0.8rem 0.6rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '0.8rem',
    padding: '0.75rem 1rem', borderRadius: '10px', textDecoration: 'none',
    color: '#94a3b8', fontWeight: '500', fontSize: '0.9rem', border: 'none',
    background: 'transparent', cursor: 'pointer', width: '100%', transition: 'all 0.15s',
  },
  navActive: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', boxShadow: '0 4px 15px rgba(79,70,229,0.35)' },
  navIcon: { fontSize: '1.1rem', flexShrink: 0 },
  sideBottom: { padding: '0.8rem 0.6rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  logoutItem: { color: '#f87171' },
  main: { flex: 1, overflow: 'auto', padding: '2rem' },
};