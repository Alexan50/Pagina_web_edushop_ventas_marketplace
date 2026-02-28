import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();

  const features = [
    { icon: '🎯', title: 'Aprendizaje práctico', desc: 'Proyectos reales desde el primer día' },
    { icon: '🏆', title: 'Instructores expertos', desc: 'Profesionales con años de experiencia' },
    { icon: '♾️', title: 'Acceso de por vida', desc: 'Compra una vez, aprende para siempre' },
    { icon: '📱', title: 'Aprende donde quieras', desc: 'Disponible en todos tus dispositivos' },
  ];

  const categories = [
    { icon: '💻', title: 'Programación', count: '4 cursos', color: '#4f46e5' },
    { icon: '📖', title: 'Libros Técnicos', count: '4 libros', color: '#7c3aed' },
    { icon: '🎨', title: 'Diseño UI/UX', count: '1 curso', color: '#ec4899' },
    { icon: '📈', title: 'Marketing', count: '1 curso', color: '#f59e0b' },
  ];

  const testimonials = [
    { name: 'Carlos M.', role: 'Desarrollador Frontend', text: 'Los cursos me ayudaron a conseguir mi primer trabajo como dev. ¡Increíble calidad!', avatar: '👨‍💻' },
    { name: 'Lucía R.', role: 'Diseñadora UX', text: 'El curso de Figma es el mejor que he tomado. Muy completo y bien explicado.', avatar: '👩‍🎨' },
    { name: 'Marco P.', role: 'Data Scientist', text: 'Python para Data Science cambió mi carrera. Lo recomiendo al 100%.', avatar: '👨‍🔬' },
  ];

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', width: '100%' }}>

      {/* HERO */}
      <section style={{ ...styles.hero, background: theme.isDark ? 'linear-gradient(135deg, #0f0f1a 0%, #1e1b4b 50%, #0f172a 100%)' : 'linear-gradient(135deg, #eef2ff 0%, #f8faff 50%, #faf5ff 100%)' }}>
        <div style={styles.heroBg} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span style={styles.badgeDot}></span>
            🚀 Más de 500 estudiantes ya aprendieron con nosotros
          </div>
          <h1 style={{ ...styles.heroTitle, color: theme.isDark ? 'white' : '#0f172a' }}>
            Domina las habilidades<br />
            <span style={styles.heroGradient}>del futuro digital</span>
          </h1>
          <p style={{ ...styles.heroSub, color: theme.text2 }}>
            Cursos y libros cuidadosamente seleccionados por expertos para impulsar tu carrera profesional en tecnología y negocios.
          </p>
          <div style={styles.heroActions}>
            <Link to="/products" style={styles.btnPrimary}>Explorar Catálogo →</Link>
            <Link to="/register" style={{ ...styles.btnOutline, color: theme.text, border: `2px solid ${theme.cardBorder}` }}>
              Crear Cuenta Gratis
            </Link>
          </div>
          <div style={styles.heroStats}>
            {[['10+', 'Productos'], ['500+', 'Estudiantes'], ['4.9★', 'Valoración'], ['100%', 'Online']].map(([val, label]) => (
              <div key={label} style={styles.statItem}>
                <span style={{ ...styles.statVal, color: theme.isDark ? 'white' : '#0f172a' }}>{val}</span>
                <span style={{ fontSize: '0.82rem', color: theme.text2 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.heroImage}>
          <div style={styles.floatingCard1}>
            <span>📘</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>Curso de React</div>
              <div style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: '600' }}>★★★★★ 4.9</div>
            </div>
          </div>
          <div style={styles.heroGraphic}>
            <div style={styles.graphicCircle1} />
            <div style={styles.graphicCircle2} />
            <span style={{ fontSize: '6rem', position: 'relative', zIndex: 1 }}>🎓</span>
          </div>
          <div style={styles.floatingCard2}>
            <span>🏆</span>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>Certificado incluido</div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Al completar el curso</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section style={{ ...styles.section, background: theme.bg }}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <h2 style={{ ...styles.sectionTitle, color: theme.text }}>¿Qué quieres aprender hoy?</h2>
            <p style={{ color: theme.text2, fontSize: '1rem' }}>Explora nuestras categorías más populares</p>
          </div>
          <div style={styles.catGrid}>
            {categories.map((c, i) => (
              <Link to="/products" key={i} style={{ ...styles.catCard, background: theme.card, border: `1px solid ${theme.cardBorder}`, textDecoration: 'none' }}>
                <div style={{ ...styles.catIconWrap, background: c.color + '18' }}>
                  <span style={styles.catIcon}>{c.icon}</span>
                </div>
                <div style={{ ...styles.catTitle, color: theme.text }}>{c.title}</div>
                <div style={{ ...styles.catCount, color: c.color }}>{c.count}</div>
                <div style={{ ...styles.catArrow, color: theme.text3 }}>Ver todo →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ ...styles.section, background: theme.bg2 }}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <h2 style={{ ...styles.sectionTitle, color: theme.text }}>¿Por qué elegir EduShop?</h2>
          </div>
          <div style={styles.featGrid}>
            {features.map((f, i) => (
              <div key={i} style={{ ...styles.featCard, background: theme.card, border: `1px solid ${theme.cardBorder}` }}>
                <span style={styles.featIcon}>{f.icon}</span>
                <h3 style={{ ...styles.featTitle, color: theme.text }}>{f.title}</h3>
                <p style={{ color: theme.text2, fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ ...styles.section, background: theme.bg }}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <h2 style={{ ...styles.sectionTitle, color: theme.text }}>Lo que dicen nuestros estudiantes</h2>
          </div>
          <div style={styles.testGrid}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ ...styles.testCard, background: theme.card, border: `1px solid ${theme.cardBorder}` }}>
                <div style={styles.testStars}>★★★★★</div>
                <p style={{ ...styles.testText, color: theme.text2 }}>"{t.text}"</p>
                <div style={styles.testAuthor}>
                  <span style={styles.testAvatar}>{t.avatar}</span>
                  <div>
                    <div style={{ fontWeight: '700', color: theme.text, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ color: theme.text3, fontSize: '0.8rem' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>¿Listo para comenzar tu aprendizaje?</h2>
          <p style={styles.ctaSub}>Únete hoy y accede a todos nuestros cursos y libros</p>
          <div style={styles.ctaActions}>
            <Link to="/products" style={styles.btnPrimary}>Ver todos los productos</Link>
            <Link to="/register" style={styles.btnWhite}>Crear cuenta gratis</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '5rem 2rem', minHeight: '90vh', position: 'relative',
    overflow: 'hidden', gap: '3rem', flexWrap: 'wrap',
  },
  heroBg: {
    position: 'absolute', inset: 0, opacity: 0.4,
    background: 'radial-gradient(ellipse at 20% 50%, rgba(79,70,229,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.1) 0%, transparent 50%)',
  },
  heroContent: { flex: 1, minWidth: '300px', maxWidth: '600px', position: 'relative', zIndex: 1 },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.25)',
    color: '#6366f1', padding: '0.5rem 1.2rem', borderRadius: '50px',
    fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem',
  },
  badgeDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' },
  heroTitle: { fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '800', lineHeight: 1.15, marginBottom: '1.2rem' },
  heroGradient: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSub: { fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' },
  heroActions: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' },
  btnPrimary: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white',
    padding: '0.9rem 2.2rem', borderRadius: '12px', textDecoration: 'none',
    fontWeight: '700', fontSize: '1rem', boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
  },
  btnOutline: {
    padding: '0.9rem 2.2rem', borderRadius: '12px', textDecoration: 'none',
    fontWeight: '600', fontSize: '1rem', background: 'transparent',
  },
  heroStats: { display: 'flex', gap: '2.5rem', flexWrap: 'wrap' },
  statItem: { display: 'flex', flexDirection: 'column', gap: '0.15rem' },
  statVal: { fontSize: '1.5rem', fontWeight: '800' },
  heroImage: {
    flex: 1, minWidth: '280px', maxWidth: '450px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '1rem', position: 'relative', zIndex: 1,
  },
  heroGraphic: {
    width: '220px', height: '220px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', boxShadow: '0 20px 60px rgba(79,70,229,0.35)',
  },
  graphicCircle1: { position: 'absolute', inset: '-15px', borderRadius: '50%', border: '2px dashed rgba(79,70,229,0.3)' },
  graphicCircle2: { position: 'absolute', inset: '-35px', borderRadius: '50%', border: '1px dashed rgba(79,70,229,0.15)' },
  floatingCard1: {
    background: 'white', padding: '0.8rem 1.2rem', borderRadius: '14px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center',
    gap: '0.8rem', alignSelf: 'flex-start', fontSize: '1.5rem',
  },
  floatingCard2: {
    background: 'white', padding: '0.8rem 1.2rem', borderRadius: '14px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center',
    gap: '0.8rem', alignSelf: 'flex-end', fontSize: '1.5rem',
  },

  section: { padding: '5rem 2rem', width: '100%', boxSizing: 'border-box' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  sectionHead: { textAlign: 'center', marginBottom: '3rem' },
  sectionTitle: { fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: '800', marginBottom: '0.6rem' },

  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' },
  catCard: { padding: '1.8rem', borderRadius: '16px', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' },
  catIconWrap: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  catIcon: { fontSize: '1.6rem' },
  catTitle: { fontWeight: '700', fontSize: '1rem', marginBottom: '0.3rem' },
  catCount: { fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.8rem' },
  catArrow: { fontSize: '0.85rem' },

  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' },
  featCard: { padding: '2rem', borderRadius: '16px', textAlign: 'center' },
  featIcon: { fontSize: '2.5rem', display: 'block', marginBottom: '1rem' },
  featTitle: { fontWeight: '700', fontSize: '1rem', marginBottom: '0.5rem' },

  testGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
  testCard: { padding: '2rem', borderRadius: '16px' },
  testStars: { color: '#f59e0b', fontSize: '1rem', marginBottom: '0.8rem' },
  testText: { fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1.2rem', fontStyle: 'italic' },
  testAuthor: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  testAvatar: { fontSize: '2rem', background: '#f1f5f9', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  ctaSection: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '5rem 2rem', textAlign: 'center' },
  ctaContent: { maxWidth: '600px', margin: '0 auto' },
  ctaTitle: { fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: '800', color: 'white', marginBottom: '1rem' },
  ctaSub: { color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: '2rem' },
  ctaActions: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnWhite: {
    background: 'white', color: '#4f46e5', padding: '0.9rem 2.2rem',
    borderRadius: '12px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem',
  },
};