import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#8b5cf6'];

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/products');
        setProducts(prodRes.data);
      } catch (err) {
        console.error('Error productos:', err);
      }
      try {
        const orderRes = await api.get('/orders/all');
        setOrders(orderRes.data);
      } catch (err) {
        console.error('Error ordenes:', err);
        setError('No se pudieron cargar las órdenes: ' + (err.response?.data?.message || err.message));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total || 0), 0);
  const lowStock = products.filter(p => parseInt(p.stock) < 10).length;

  const stockData = products.map(p => ({
    name: p.name.length > 16 ? p.name.substring(0, 16) + '...' : p.name,
    stock: parseInt(p.stock),
    precio: parseFloat(p.price)
  }));

  const categoryData = [
    { name: 'Cursos', value: products.filter(p => p.category === 'curso').length },
    { name: 'Libros', value: products.filter(p => p.category === 'libro').length },
  ].filter(d => d.value > 0);

  const paymentMap = {};
  orders.forEach(o => {
    const m = o.payment_method || 'otro';
    if (!paymentMap[m]) paymentMap[m] = { name: m, ordenes: 0, total: 0 };
    paymentMap[m].ordenes += 1;
    paymentMap[m].total += parseFloat(o.total || 0);
  });
  const paymentData = Object.values(paymentMap);

  const kpis = [
    { icon: '📦', label: 'Total Productos', value: products.length, color: '#4f46e5', bg: '#eef2ff' },
    { icon: '💰', label: 'Ingresos Totales', value: 'S/ ' + totalRevenue.toFixed(2), color: '#10b981', bg: '#ecfdf5' },
    { icon: '🛒', label: 'Total Órdenes', value: orders.length, color: '#f59e0b', bg: '#fffbeb' },
    { icon: '⚠️', label: 'Stock Bajo', value: lowStock, color: '#ef4444', bg: '#fef2f2' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <p style={{ color: '#64748b', fontSize: '1.1rem' }}>⏳ Cargando datos...</p>
    </div>
  );

  return (
    <div>
      <div style={styles.pageHead}>
        <div>
          <h1 style={styles.pageTitle}>📊 Dashboard</h1>
          <p style={styles.pageSub}>Panel de control de EduShop</p>
        </div>
        <Link to="/admin/new" style={styles.newBtn}>+ Nuevo Producto</Link>
      </div>

      {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

      <div style={styles.kpiGrid}>
        {kpis.map((k, i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={{ ...styles.kpiIcon, background: k.bg }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: '1.7rem', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.3rem' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.chartsRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>📦 Stock por Producto</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stockData} margin={{ top: 5, right: 10, left: 0, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} formatter={v => [v, 'Unidades']} />
              <Bar dataKey="stock" name="Stock" radius={[6, 6, 0, 0]}>
                {stockData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>🥧 Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="45%" outerRadius={95}
                dataKey="value" label={({ name, value }) => name + ': ' + value}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>💳 Ingresos por Método de Pago</h3>
        {paymentData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={paymentData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => 'S/' + v} />
              <Tooltip formatter={(v, n) => [n === 'total' ? 'S/ ' + parseFloat(v).toFixed(2) : v, n === 'total' ? 'Ingresos' : 'Órdenes']}
                contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
              <Bar dataKey="total" name="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ordenes" name="ordenes" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
            <p style={{ fontSize: '2.5rem' }}>🛒</p>
            <p style={{ marginTop: '0.5rem' }}>Aún no hay ventas. Aparecerán aquí cuando los clientes compren.</p>
          </div>
        )}
      </div>

      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>💵 Precio de Productos</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={stockData} margin={{ top: 5, right: 10, left: 10, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => 'S/' + v} />
            <Tooltip formatter={v => ['S/ ' + v, 'Precio']} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
            <Bar dataKey="precio" name="Precio" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ ...styles.tableCard, marginBottom: '1.5rem' }}>
        <div style={styles.tableTopBar}>
          <h3 style={styles.chartTitle}>🧾 Órdenes Recientes</h3>
          <Link to="/admin/ventas" style={styles.viewAll}>Ver todas →</Link>
        </div>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            <p style={{ fontSize: '2.5rem' }}>📋</p>
            <p style={{ marginTop: '0.5rem' }}>No hay órdenes registradas aún</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  {['# Orden', 'Cliente', 'Total', 'Método', 'Estado', 'Fecha'].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((o, i) => (
                  <tr key={o.id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ ...styles.td, fontWeight: '700', color: '#4f46e5' }}>#{o.id}</td>
                    <td style={styles.td}>{o.user_name || 'Cliente'}</td>
                    <td style={{ ...styles.td, fontWeight: '800', color: '#10b981' }}>S/ {parseFloat(o.total).toFixed(2)}</td>
                    <td style={styles.td}><span style={styles.methodBadge}>{o.payment_method || '-'}</span></td>
                    <td style={styles.td}><span style={{ ...styles.statusBadge, background: '#ecfdf5', color: '#10b981' }}>✓ {o.status}</span></td>
                    <td style={{ ...styles.td, color: '#94a3b8', fontSize: '0.82rem' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString('es-PE') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  errorBanner: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '0.9rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem' },
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.3rem' },
  pageSub: { color: '#64748b', fontSize: '0.95rem' },
  newBtn: { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(79,70,229,0.3)', whiteSpace: 'nowrap' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' },
  kpiCard: { background: 'white', padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  kpiIcon: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 },
  chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
  chartCard: { background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '1.5rem' },
  chartTitle: { fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' },
  tableCard: { background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  tableTopBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem', borderBottom: '1px solid #f1f5f9' },
  viewAll: { color: '#4f46e5', textDecoration: 'none', fontWeight: '600', fontSize: '0.88rem' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '500px' },
  thead: { background: '#f8fafc' },
  th: { padding: '0.9rem 1.2rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' },
  td: { padding: '1rem 1.2rem', color: '#475569', fontSize: '0.9rem', borderBottom: '1px solid #f8fafc' },
  methodBadge: { background: '#eef2ff', color: '#4f46e5', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  statusBadge: { padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' },
};