import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'curso', stock: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!isNew) api.get(`/products/${id}`).then(({ data }) => setForm(data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNew) await api.post('/products', form);
      else await api.put(`/products/${id}`, form);
      setMsg('✅ Guardado correctamente');
      setTimeout(() => navigate('/admin'), 1000);
    } catch {
      setMsg('❌ Error al guardar');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isNew ? '➕ Nuevo Producto' : '✏️ Editar Producto'}</h2>
        {msg && <p style={styles.msg}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Nombre</label>
          <input style={styles.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />

          <label style={styles.label}>Descripción</label>
          <textarea style={{ ...styles.input, height: '100px', resize: 'vertical' }} value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Precio (S/)</label>
              <input style={styles.input} type="number" step="0.01" value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Stock</label>
              <input style={styles.input} type="number" value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })} required />
            </div>
          </div>

          <label style={styles.label}>Categoría</label>
          <select style={styles.input} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="curso">📘 Curso</option>
            <option value="libro">📖 Libro</option>
          </select>

          <div style={styles.btnRow}>
            <button type="submit" style={styles.saveBtn}>💾 Guardar Cambios</button>
            <button type="button" onClick={() => navigate('/admin')} style={styles.cancelBtn}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f1f5f9', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  card: { background: 'white', padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', marginTop: '1rem' },
  title: { fontSize: '1.6rem', fontWeight: '800', color: '#1a1a2e', marginBottom: '1.5rem' },
  msg: { textAlign: 'center', padding: '0.8rem', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', marginBottom: '1rem', fontWeight: '600' },
  label: { display: 'block', fontWeight: '600', color: '#374151', marginBottom: '0.4rem', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.8rem 1rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem', marginBottom: '1.2rem', boxSizing: 'border-box', color: '#1a1a2e', background: '#f8fafc', outline: 'none' },
  row: { display: 'flex', gap: '1rem' },
  btnRow: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  saveBtn: { flex: 1, padding: '0.9rem', background: 'linear-gradient(135deg, #e94560, #a855f7)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  cancelBtn: { flex: 1, padding: '0.9rem', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600' },
};