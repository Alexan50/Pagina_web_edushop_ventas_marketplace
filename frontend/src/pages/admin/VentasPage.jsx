import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../../services/api';

export default function VentasPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/orders/all');
        setOrders(data);
      } catch (err) {
        console.error('Error cargando ordenes:', err);
        setError('Error: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total || 0), 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;
  const paidOrders = orders.filter(o => o.status === 'paid').length;

  // Ventas por método de pago
  const paymentMap = {};
  orders.forEach(o => {
    const m = o.payment_method || 'otro';
    if (!paymentMap[m]) paymentMap[m] = { name: m.charAt(0).toUpperCase() + m.slice(1), ventas: 0, total: 0 };
    paymentMap[m].ventas += 1;
    paymentMap[m].total += parseFloat(o.total || 0);
  });
  const paymentData = Object.values(paymentMap);

  // Tendencia por fecha
  const salesByDay = {};
  orders.forEach(o => {
    const day = o.created_at ? new Date(o.created_at).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' }) : 'Sin fecha';
    if (!salesByDay[day]) salesByDay[day] = { day, total: 0, count: 0 };
    salesByDay[day].total += parseFloat(o.total || 0);
    salesByDay[day].count += 1;
  });
  const trendData = Object.values(salesByDay);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
      <p style={{ color: '#64748b', fontSize: '1.1rem' }}>⏳ Cargando ventas...</p>
    </div>
  );

  return (
    <div>
      <div style={styles.pageHead}>
        <div>
          <h1 style={styles.pageTitle}>💰 Ventas</h1>
          <p style={styles.pageSub}>Historial y análisis de {orders.length} órdenes</p>
        </div>
      </div>

      {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        {[
          { icon: '💰', label: 'Ingresos Totales', value: 'S/ ' + totalRevenue.toFixed(2), color: '#10b981', bg: '#ecfdf5' },
          { icon: '🛒', label: 'Total Órdenes', value: orders.length, color: '#4f46e5', bg: '#eef2ff' },
          { icon: '📊', label: 'Ticket Promedio', value: 'S/ ' + avgOrder.toFixed(2), color: '#f59e0b', bg: '#fffbeb' },
          { icon: '✅', label: 'Órdenes Pagadas', value: paidOrders, color: '#10b981', bg: '#ecfdf5' },
        ].map((k, i) => (
          <div key={i} style={styles.kpiCard}>
            <div style={{ ...styles.kpiIcon, background: k.bg }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.3rem' }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '4rem' }}>🛒</p>
          <h3 style={{ color: '#475569', marginTop: '1rem' }}>No hay ventas registradas</h3>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Las ventas aparecerán aquí cuando los clientes realicen compras</p>
        </div>
      ) : (
        <>
          <div style={styles.chartsRow}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💳 Ventas por Método de Pago</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={paymentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(v, n) => [n === 'total' ? 'S/ ' + parseFloat(v).toFixed(2) : v, n === 'total' ? 'Ingresos' : 'Cantidad']}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                  />
                  <Bar dataKey="ventas" name="ventas" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="total" name="total" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📈 Tendencia de Ingresos</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={v => 'S/' + v} />
                  <Tooltip formatter={v => ['S/ ' + parseFloat(v).toFixed(2), 'Ingresos']} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }} />
                  <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={3} dot={{ fill: '#4f46e5', r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>📋 Historial de Órdenes</h3>
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
                  {orders.map((o, i) => (
                    <tr key={o.id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ ...styles.td, fontWeight: '700', color: '#4f46e5' }}>#{o.id}</td>
                      <td style={styles.td}>{o.user_name || 'Cliente'}</td>
                      <td style={{ ...styles.td, fontWeight: '800', color: '#10b981' }}>S/ {parseFloat(o.total).toFixed(2)}</td>
                      <td style={styles.td}><span style={styles.methodBadge}>{o.payment_method || '-'}</span></td>
                      <td style={styles.td}><span style={{ ...styles.statusBadge, background: '#ecfdf5', color: '#10b981' }}>✓ {o.status}</span></td>
                      <td style={{ ...styles.td, color: '#94a3b8', fontSize: '0.82rem' }}>
                        {o.created_at ? new Date(o.created_at).toLocaleDateString('es-PE') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  pageHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  pageTitle: { fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.3rem' },
  pageSub: { color: '#64748b', fontSize: '0.95rem' },
  errorBanner: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', padding: '0.9rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.9rem' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '1.8rem' },
  kpiCard: { background: 'white', padding: '1.4rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  kpiIcon: { width: '50px', height: '50px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 },
  emptyState: { background: 'white', borderRadius: '16px', padding: '4rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' },
  chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
  card: { background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '1.5rem' },
  cardTitle: { fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '560px' },
  thead: { background: '#f8fafc' },
  th: { padding: '0.9rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' },
  td: { padding: '1rem', color: '#475569', fontSize: '0.9rem', borderBottom: '1px solid #f8fafc' },
  methodBadge: { background: '#eef2ff', color: '#4f46e5', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' },
  statusBadge: { padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' },
};