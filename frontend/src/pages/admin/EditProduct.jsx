import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const API_URL = 'https://paginawebedushopventasmarketplace-production-8b90.up.railway.app';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'curso', stock: '', image: '' });
  const [msg, setMsg] = useState('');
  const [imgMode, setImgMode] = useState('url');
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!isNew) {
      api.get(`/products/${id}`).then(({ data }) => {
        setForm(data);
        if (data.image) {
          const isUrl = data.image.startsWith('http');
          setImgMode(isUrl ? 'url' : 'file');
          setPreview(isUrl ? data.image : `${API_URL}/uploads/${data.image}`);
        }
      });
    }
  }, [id]);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setForm({ ...form, image: url });
    setPreview(url);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setForm({ ...form, image: f.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (imgMode === 'file' && file) {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('category', form.category);
        formData.append('stock', form.stock);
        formData.append('image', file);
        if (isNew) await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        else await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        if (isNew) await api.post('/products', form);
        else await api.put(`/products/${id}`, form);
      }
      setMsg('✅ Guardado correctamente');
      setTimeout(() => navigate('/admin/products'), 1500);
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
          <input style={styles.input} value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />

          <label style={styles.label}>Descripción</label>
          <textarea style={{ ...styles.input, height: '100px', resize: 'vertical' }}
            value={form.description}
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
          <select style={styles.input} value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="curso">📘 Curso</option>
            <option value="libro">📖 Libro</option>
          </select>

          {/* ── IMAGEN ── */}
          <label style={styles.label}>Imagen del Producto</label>
          <div style={styles.tabRow}>
            <button type="button"
              onClick={() => { setImgMode('url'); setPreview(''); setFile(null); }}
              style={{ ...styles.tab, ...(imgMode === 'url' ? styles.tabActive : {}) }}>
              🌐 URL de internet
            </button>
            <button type="button"
              onClick={() => { setImgMode('file'); setPreview(''); }}
              style={{ ...styles.tab, ...(imgMode === 'file' ? styles.tabActive : {}) }}>
              📁 Desde mi PC
            </button>
          </div>

          {imgMode === 'url' ? (
            <>
              <input
                style={styles.input}
                placeholder="Pega aquí la URL de la imagen — https://..."
                value={form.image?.startsWith('http') ? form.image : ''}
                onChange={handleUrlChange}
              />
              <p style={styles.hint}>
                💡 En Google Imágenes: clic derecho sobre la imagen → <strong>Copiar dirección de imagen</strong> → pegar aquí
              </p>
            </>
          ) : (
            <>
              <input
                style={styles.input}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <p style={styles.hint}>
                💡 Selecciona una imagen JPG o PNG desde tu carpeta de Descargas o cualquier carpeta de tu PC
              </p>
            </>
          )}

          {preview && (
            <div style={styles.previewBox}>
              <p style={styles.previewLabel}>Vista previa de la imagen:</p>
              <img
                src={preview}
                alt="preview"
                style={styles.previewImg}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div style={styles.btnRow}>
            <button type="submit" style={styles.saveBtn}>💾 Guardar Cambios</button>
            <button type="button" onClick={() => navigate('/admin/products')} style={styles.cancelBtn}>Cancelar</button>
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
  tabRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.8rem' },
  tab: { flex: 1, padding: '0.65rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' },
  tabActive: { background: '#eef2ff', borderColor: '#4f46e5', color: '#4f46e5' },
  hint: { fontSize: '0.8rem', color: '#64748b', marginTop: '-0.8rem', marginBottom: '1rem', fontStyle: 'italic' },
  previewBox: { marginBottom: '1.2rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1.5px solid #e2e8f0' },
  previewLabel: { fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '600' },
  previewImg: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' },
  btnRow: { display: 'flex', gap: '1rem', marginTop: '0.5rem' },
  saveBtn: { flex: 1, padding: '0.9rem', background: 'linear-gradient(135deg, #e94560, #a855f7)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '700' },
  cancelBtn: { flex: 1, padding: '0.9rem', background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: '600' },
};