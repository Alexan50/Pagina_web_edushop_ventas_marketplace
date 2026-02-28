import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#8b5cf6'];

export default function AnalyticsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

  const cursos = products.filter(p => p.category === 'curso');
  const libros = products.filter(p => p.category === 'libro');

  const avgPriceCurso = cursos.length ? cursos.reduce((s, p) => s + parseFloat(p.price), 0) / cursos.length : 0;
  const avgPriceLibro = libros.length ? libros.reduce((s, p) => s + parseFloat(p.price), 0) / libros.length : 0;
  const allPrices = products.map(p => parseFloat(p.price));
  const maxPrice = allPrices.length ? Math.max(...allPrices) : 0;
  const minPrice = allPrices.length ? Math.min(...allPrices) : 0;
  const totalInventoryValue = products.reduce((s, p) => s + parseFloat(p.price) * parseInt(p.stock || 0), 0);

  const priceRanges = [
    { rango: 'S/0-20', count: products.filter(p => parseFloat(p.price) <= 20).length },
    { rango: 'S/21-35', count: products.filter(p => parseFloat(p.price) > 20 && parseFloat(p.price) <= 35).length },
    { rango: 'S/36-50', count: products.filter(p => parseFloat(p.price) > 35 && parseFloat(p.price) <= 50).length },
    { rango: 'S/51+', count: products.filter(p => parseFloat(p.price) > 50).length },
  ];

  const pieData = [
    { name: 'Cursos (' + cursos.length + ')', value: cursos.length },
    { name: 'Libros (' + libros.length + ')', value: libros.length },
  ].filter(d => d.value > 0);

  const radarData = products.slice(0, 6).map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
    Precio: parseFloat(p.price),
    Stock: parseInt(p.stock || 0),
  }));

  const compareData = products.map(p => ({
    name: p.name.length > 16 ? p.name.substring(0, 16) + '...' : p.name,
    precio: parseFloat(p.price),
    stock: parseInt(p.stock || 0),
  }));

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <p style={{ color: '#64748b', fontSize: '1.1rem' }}>⏳ Cargando analíticas...</p>
    </div>
  );

  return (
    <div>
      <div style={styles.pageHead}>
        <div>
          <h1 style={styles.pageTitle}>📈 Analíticas</h1>
          <p style={styles.pageSub}>Análisis detallado de {products.length} productos</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        {[
          { icon: '💵', label: 'Precio Máximo', value: 'S/ ' + maxPrice.toFixed(2), color: '#4f46e5', bg: '#eef2ff' },
          { icon: '💲', label: 'Precio Mínimo', value: 'S/ ' + minPrice.toFixed(2), color: '#10b981', bg: '#ecfdf5' },
          { icon: '📘', label: 'Precio Prom. Curso', value: 'S/ ' + avgPriceCurso.toFixed(2), color: '#7c3aed', bg: '#fdf4ff' },
          { icon: '📖', label: 'Precio Prom. Libro', value: 'S/ ' + avgPriceLibro.toFixed(2), color: '#f59e0b', bg: '#fffbeb' },
        ].map((k, i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={{ ...styles.kpiIcon, background: k.bg }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.3rem' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Valor total inventario */}
      <div style={styles.inventoryBanner}>
        <span style={{ fontSize: '1.5rem' }}>🏦</span>
        <div>
          <div style={{ fontWeight: '800', fontSize: '1.3rem', color: '#0f172a' }}>Valor Total del Inventario: <span style={{ color: '#4f46e5' }}>S/ {totalInventoryValue.toFixed(2)}</span></div>
          <div style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '0.2rem' }}>Suma del precio × stock de todos los productos</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🥧 Distribución por Categoría</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" outerRadius={95} dataKey="value"
                  label={({ name, percent }) => name + ' ' + (percent * 100).toFixed(0) + '%'}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Sin datos</p>}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>💰 Distribución de Precios</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={priceRanges} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="rango" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip formatter={v => [v, 'Productos']} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
              <Bar dataKey="count" name="Productos" radius={[8, 8, 0, 0]}>
                {priceRanges.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar */}
      {radarData.length > 0 && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🕸️ Análisis Precio vs Stock (Top 6)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Radar name="Precio" dataKey="Precio" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} />
              <Radar name="Stock" dataKey="Stock" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Legend />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Comparativa */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📊 Precio vs Stock por Producto</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={compareData} margin={{ top: 5, right: 20, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-40} textAnchor="end" interval={0} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => 'S/' + v} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip formatter={(v, n) => [n === 'precio' ? 'S/ ' + v : v, n === 'precio' ? 'Precio' : 'Stock']}
              contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
            <Legend />
            <Bar yAxisId="left" dataKey="precio" name="precio" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            <Bar yAxisId="right" dataKey="stock" name="stock" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla resumen */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>📋 Resumen Completo</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {['Producto', 'Categoría', 'Precio', 'Stock', 'Valor Inventario'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td style={{ ...styles.td, fontWeight: '600', color: '#1e293b' }}>{p.name}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: p.category === 'curso' ? '#eef2ff' : '#fdf4ff', color: p.category === 'curso' ? '#4f46e5' : '#7c3aed' }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ ...styles.td, color: '#4f46e5', fontWeight: '700' }}>S/ {parseFloat(p.price).toFixed(2)}</td>
                  <td style={styles.td}>{p.stock}</td>
                  <td style={{ ...styles.td, color: '#10b981', fontWeight: '700' }}>S/ {(parseFloat(p.price) * parseInt(p.stock || 0)).toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ background: '#f1f5f9', borderTop: '2px solid #e2e8f0' }}>
                <td colSpan="4" style={{ ...styles.td, fontWeight: '800', color: '#0f172a', textAlign: 'right' }}>
                  VALOR TOTAL DEL INVENTARIO:
                </td>
                <td style={{ ...styles.td, color: '#4f46e5', fontWeight: '800', fontSize: '1.1rem' }}>
                  S/ {totalInventoryValue.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.3rem' },
  pageSub: { color: '#64748b', fontSize: '0.95rem' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' },
  kpiCard: { background: 'white', padding: '1.4rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  kpiIcon: { width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 },
  inventoryBanner: { background: 'linear-gradient(135deg, #eef2ff, #fdf4ff)', border: '1px solid #c7d2fe', borderRadius: '14px', padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.8rem' },
  chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
  card: { background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '1.5rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '500px' },
  thead: { background: '#f8fafc' },
  th: { padding: '0.9rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' },
  td: { padding: '1rem', color: '#475569', fontSize: '0.9rem', borderBottom: '1px solid #f8fafc' },
  badge: { padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
};