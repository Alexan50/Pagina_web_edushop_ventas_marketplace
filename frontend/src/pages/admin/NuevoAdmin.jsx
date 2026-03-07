import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function NuevoAdmin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      await api.post('/auth/create-admin', form);
      setMsg('✅ Administrador creado correctamente');
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || '❌ Error al crear administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>👑 Nuevo Administrador</h2>
        <p style={styles.subtitle}>Crea una cuenta con acceso completo al panel de administración.</p>

        {msg && <div style={styles.success}>{msg}</div>}
        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Nombre completo</label>
          <input
            style={styles.input}
            placeholder="Ej: Carlos Pérez"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <label style={styles.label}>Correo electrónico</label>
          <input
            style={styles.input}
            type="email"
            placeholder="admin@edushop.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          <label style={styles.label}>Contraseña</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            minLength={6}
            required
          />

          <div style={styles.btnRow}>
            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? '⏳ Creando...' : '👑 Crear Administrador'}
            </button>
            <button type="button" onClick={() => navigate('/admin')} style={styles.cancelBtn}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f1f5f9', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  card: { background: 'white', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', marginTop: '1rem' },
  title: { fontSize: '1.6rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '0.5rem' },
  subtitle: { color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' },
  success: { background: '#f0fdf4', color: '#16a34a', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontWeight: '600', fontSize: '0.9rem' },
  errorBox: { background: '#fef2f2', color: '#dc2626', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontWeight: '600', fontSize: '0.9rem' },
  label: { display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem', marginBottom: '1.2rem', boxSizing: 'border-box', color: '#1a1a2e', background: '#f8fafc', outline: 'none' },
  btnRow: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  saveBtn: { flex: 1, padding: '0.9rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  cancelBtn: { flex: 1, padding: '0.9rem', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600' },
};