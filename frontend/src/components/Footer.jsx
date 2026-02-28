import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Brand */}
        <div style={styles.col}>
          <div style={styles.brand}>🎓 <span style={styles.brandAccent}>EduShop</span></div>
          <p style={styles.brandDesc}>
            La plataforma líder en cursos y libros para profesionales. Aprende con los mejores expertos.
          </p>
          <div style={styles.socials}>
            {['📘 Facebook', '🐦 Twitter', '📸 Instagram', '💼 LinkedIn'].map(s => (
              <span key={s} style={styles.social}>{s}</span>
            ))}
          </div>
        </div>

        {/* Catálogo */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Catálogo</h4>
          {[['Todos los cursos', '/products?q=curso'], ['Libros técnicos', '/products?q=libro'], ['Programación', '/products'], ['Diseño UI/UX', '/products'], ['Marketing Digital', '/products']].map(([label, href]) => (
            <Link key={label} to={href} style={styles.footerLink}>{label}</Link>
          ))}
        </div>

        {/* Empresa */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Empresa</h4>
          {['Sobre nosotros', 'Instructores', 'Blog', 'Trabaja con nosotros', 'Prensa'].map(l => (
            <span key={l} style={styles.footerLink}>{l}</span>
          ))}
        </div>

        {/* Soporte */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Soporte</h4>
          {['Centro de ayuda', 'Política de reembolso', 'Términos de servicio', 'Privacidad'].map(l => (
            <span key={l} style={styles.footerLink}>{l}</span>
          ))}
          <div style={styles.contactBox}>
            <p style={styles.contactTitle}>📧 Contacto</p>
            <p style={styles.contactInfo}>soporte@edushop.com</p>
            <p style={styles.contactInfo}>+51 999 888 777</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomBar}>
        <p style={styles.copy}>© 2025 EduShop. Todos los derechos reservados.</p>
        <div style={styles.payments}>
          {['💳 Visa', '💳 Mastercard', '📱 Yape', '📱 Plin'].map(p => (
            <span key={p} style={styles.payBadge}>{p}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: { background: '#0f172a', color: '#94a3b8', width: '100%', marginTop: 'auto' },
  container: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2.5rem', padding: '4rem 2rem 2rem', maxWidth: '1200px', margin: '0 auto',
  },
  col: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  brand: { color: 'white', fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' },
  brandAccent: { color: '#818cf8' },
  brandDesc: { fontSize: '0.88rem', lineHeight: 1.7, color: '#64748b' },
  socials: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' },
  social: { fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer' },
  colTitle: { color: 'white', fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' },
  footerLink: { fontSize: '0.88rem', color: '#64748b', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.2s', display: 'block' },
  contactBox: { marginTop: '0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.8rem' },
  contactTitle: { color: 'white', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.4rem' },
  contactInfo: { fontSize: '0.82rem', color: '#64748b' },
  bottomBar: {
    borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.2rem 2rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: '1rem', maxWidth: '1200px', margin: '0 auto',
  },
  copy: { fontSize: '0.82rem', color: '#475569' },
  payments: { display: 'flex', gap: '0.5rem' },
  payBadge: { fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', padding: '0.3rem 0.7rem', borderRadius: '6px', color: '#94a3b8' },
};