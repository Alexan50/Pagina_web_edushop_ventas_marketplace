import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Iniciar Sesión</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Contraseña" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required />
          <button style={styles.btn} type="submit">Entrar</button>
        </form>
        <p style={{textAlign:'center', marginTop:'1rem'}}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
        <p style={{textAlign:'center', color:'#999', fontSize:'0.85rem'}}>
          Admin: admin@edushop.com / admin123
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f5f5' },
  card: { background:'white', padding:'2rem', borderRadius:'16px', width:'380px', boxShadow:'0 8px 30px rgba(0,0,0,0.1)' },
  title: { textAlign:'center', color:'#1a1a2e', marginBottom:'1.5rem' },
  input: { width:'100%', padding:'0.8rem', marginBottom:'1rem', border:'1px solid #ddd', borderRadius:'8px', fontSize:'1rem', boxSizing:'border-box' },
  btn: { width:'100%', padding:'0.9rem', background:'#e94560', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer', fontWeight:'bold' },
  error: { color:'red', textAlign:'center', marginBottom:'1rem' }
};