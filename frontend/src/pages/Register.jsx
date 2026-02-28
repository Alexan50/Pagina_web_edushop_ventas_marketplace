import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setMsg('✅ Registro exitoso. Redirigiendo...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Error'));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Crear Cuenta</h2>
        {msg && <p style={{textAlign:'center'}}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Nombre completo" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} type="password" placeholder="Contraseña" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required />
          <button style={styles.btn} type="submit">Registrarse</button>
        </form>
        <p style={{textAlign:'center', marginTop:'1rem'}}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
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
  btn: { width:'100%', padding:'0.9rem', background:'#1a1a2e', color:'white', border:'none', borderRadius:'8px', fontSize:'1rem', cursor:'pointer', fontWeight:'bold' }
};