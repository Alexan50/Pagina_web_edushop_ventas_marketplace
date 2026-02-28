import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../services/api';

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStock = async (id) => {
    const product = products.find(p => p.id === id);
    await api.put('/products/' + id, {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: parseInt(newStock)
    });
    setMsg('✅ Stock actualizado correctamente');
    setEditing(null);
    setNewStock('');
    await load();
    setTimeout(() => setMsg(''), 3000);
  };

  const totalStock = products.reduce((s, p) => s + parseInt(p.stock || 0), 0);
  const normal = products.filter(p => parseInt(p.stock) >= 15).length;
  const bajo = products.filter(p => parseInt(p.stock) >= 5 && parseInt(p.stock) < 15).length;
  const critico = products.filter(p => parseInt(p.stock) < 5).length;

  const stockData = products.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    stock: parseInt(p.stock || 0),
    color: parseInt(p.stock) < 5 ? '#ef4444' : parseInt(p.stock) < 15 ? '#f59e0b' : '#10b981'
  }));

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <p style={{ color: '#64748b', fontSize: '1.1rem' }}>⏳ Cargando stock...</p>
    </div>
  );

  return (
    <div>
      <div style={styles.pageHead}>
        <div>
          <h1 style={styles.pageTitle}>🗃️ Control de Stock</h1>
          <p style={styles.pageSub}>Gestiona el inventario de {products.length} productos</p>
        </div>
        {msg && <div style={styles.toast}>{msg}</div>}
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        {[
          { icon: '📦', label: 'Total Existencias', value: totalStock, color: '#4f46e5', bg: '#eef2ff' },
          { icon: '✅', label: 'Stock Normal', value: normal, color: '#10b981', bg: '#ecfdf5' },
          { icon: '⚠️', label: 'Stock Bajo', value: bajo, color: '#f59e0b', bg: '#fffbeb' },
          { icon: '🚨', label: 'Stock Crítico', value: critico, color: '#ef4444', bg: '#fef2f2' },
        ].map((k, i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={{ ...styles.kpiIcon, background: k.bg }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.3rem' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfica */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📊 Stock por Producto</h3>
        <div style={styles.legend}>
          {[['#10b981', 'Normal (≥15)'], ['#f59e0b', 'Bajo (5-14)'], ['#ef4444', 'Crítico (<5)']].map(([color, label]) => (
            <span key={label} style={styles.legendItem}>
              <span style={{ ...styles.dot, background: color }} />{label}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockData} margin={{ top: 5, right: 20, left: 0, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-40} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} formatter={v => [v, 'Unidades']} />
            <Bar dataKey="stock" radius={[8, 8, 0, 0]}>
              {stockData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>✏️ Ajustar Stock</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {['Producto', 'Categoría', 'Precio', 'Stock Actual', 'Estado', 'Acción'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const stock = parseInt(p.stock || 0);
                const estado = stock < 5
                  ? { label: '🚨 Crítico', bg: '#fef2f2', color: '#ef4444' }
                  : stock < 15
                  ? { label: '⚠️ Bajo', bg: '#fffbeb', color: '#f59e0b' }
                  : { label: '✅ Normal', bg: '#ecfdf5', color: '#10b981' };
                return (
                  <tr key={p.id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ ...styles.td, fontWeight: '600', color: '#1e293b' }}>{p.name}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: p.category === 'curso' ? '#eef2ff' : '#fdf4ff', color: p.category === 'curso' ? '#4f46e5' : '#7c3aed' }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ ...styles.td, color: '#4f46e5', fontWeight: '700' }}>S/ {parseFloat(p.price).toFixed(2)}</td>
                    <td style={{ ...styles.td, fontWeight: '800', fontSize: '1.05rem', color: '#0f172a' }}>{stock}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: estado.bg, color: estado.color }}>{estado.label}</span>
                    </td>
                    <td style={styles.td}>
                      {editing === p.id ? (
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <input type="number" value={newStock} onChange={e => setNewStock(e.target.value)}
                            style={styles.stockInput} placeholder="Nuevo" min="0" autoFocus />
                          <button onClick={() => updateStock(p.id)} style={styles.saveBtn}>✓</button>
                          <button onClick={() => setEditing(null)} style={styles.cancelBtn}>✕</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditing(p.id); setNewStock(String(stock)); }} style={styles.editBtn}>
                          ✏️ Editar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.3rem' },
  pageSub: { color: '#64748b', fontSize: '0.95rem' },
  toast: { background: '#ecfdf5', color: '#10b981', padding: '0.7rem 1.2rem', borderRadius: '10px', fontWeight: '600', border: '1px solid #a7f3d0' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' },
  kpiCard: { background: 'white', padding: '1.4rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  kpiIcon: { width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 },
  card: { background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '1.5rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' },
  legend: { display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569' },
  dot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '650px' },
  thead: { background: '#f8fafc' },
  th: { padding: '0.9rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' },
  td: { padding: '1rem', color: '#475569', fontSize: '0.9rem', borderBottom: '1px solid #f8fafc' },
  badge: { padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  stockInput: { width: '80px', padding: '0.4rem 0.6rem', border: '1.5px solid #c7d2fe', borderRadius: '8px', fontSize: '0.9rem', color: '#1e293b' },
  saveBtn: { background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
  cancelBtn: { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '0.4rem 0.7rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' },
  editBtn: { background: '#eef2ff', color: '#4f46e5', border: 'none', padding: '0.45rem 0.9rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' },
};