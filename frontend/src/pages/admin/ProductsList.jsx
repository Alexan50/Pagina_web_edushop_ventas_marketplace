import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => api.get('/products').then(({ data }) => setProducts(data));
  useEffect(() => { load(); }, []);

  const deleteProduct = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      await api.delete(`/products/${id}`);
      load();
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={styles.pageHead}>
        <div>
          <h1 style={styles.pageTitle}>📦 Productos</h1>
          <p style={styles.pageSub}>{products.length} productos en el catálogo</p>
        </div>
        <Link to="/admin/new" style={styles.newBtn}>+ Nuevo Producto</Link>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <div style={styles.searchBox}>
          <span>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            style={styles.searchInput}
          />
        </div>
        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{filtered.length} resultados</span>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              {['ID', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                <td style={{ ...styles.td, color: '#94a3b8', fontWeight: '600' }}>#{p.id}</td>
                <td style={{ ...styles.td, fontWeight: '600', color: '#1e293b', maxWidth: '200px' }}>{p.name}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: p.category === 'curso' ? '#eef2ff' : '#fdf4ff', color: p.category === 'curso' ? '#4f46e5' : '#7c3aed' }}>
                    {p.category === 'curso' ? '📘 Curso' : '📖 Libro'}
                  </span>
                </td>
                <td style={{ ...styles.td, color: '#4f46e5', fontWeight: '800', fontSize: '1rem' }}>S/ {parseFloat(p.price).toFixed(2)}</td>
                <td style={{ ...styles.td, fontWeight: '700' }}>{p.stock}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: p.stock > 10 ? '#ecfdf5' : '#fef2f2', color: p.stock > 10 ? '#10b981' : '#ef4444' }}>
                    {p.stock > 10 ? '✓ Ok' : '⚠ Bajo'}
                  </span>
                </td>
                <td style={{ ...styles.td }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/admin/edit/${p.id}`} style={styles.editBtn}>✏️ Editar</Link>
                    <button onClick={() => deleteProduct(p.id)} style={styles.deleteBtn}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            No se encontraron productos
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.3rem' },
  pageSub: { color: '#64748b', fontSize: '0.95rem' },
  newBtn: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(79,70,229,0.3)', whiteSpace: 'nowrap' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  searchBox: { display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 1rem', flex: 1, maxWidth: '400px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '0.9rem', color: '#1e293b', background: 'transparent', flex: 1, fontFamily: 'inherit' },
  tableCard: { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f8fafc' },
  th: { padding: '0.9rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' },
  td: { padding: '1rem', color: '#475569', fontSize: '0.9rem', borderBottom: '1px solid #f8fafc' },
  badge: { padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', whiteSpace: 'nowrap' },
  editBtn: { background: '#eef2ff', color: '#4f46e5', padding: '0.4rem 0.9rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.82rem', whiteSpace: 'nowrap' },
  deleteBtn: { background: '#fef2f2', color: '#ef4444', border: 'none', padding: '0.4rem 0.7rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' },
};