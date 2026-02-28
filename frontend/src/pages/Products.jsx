import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useTheme } from '../context/ThemeContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    api.get('/products').then(({ data }) => setProducts(data));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearch(q);
  }, [location.search]);

  const filtered = products.filter(p => {
    const matchFilter = filter === 'all' || p.category === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', padding: '3rem 2rem', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: '800', color: theme.text, marginBottom: '0.5rem' }}>
            📚 Catálogo de Productos
          </h2>
          <p style={{ color: theme.text2 }}>{filtered.length} productos encontrados</p>
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ ...styles.searchBox, background: theme.card, border: `1.5px solid ${theme.inputBorder}`, flex: 1, minWidth: '200px' }}>
            <span>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.95rem', color: theme.text, fontFamily: 'inherit' }}
            />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.text3, fontSize: '1rem' }}>✕</button>}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {[['all', '✨ Todos'], ['curso', '📘 Cursos'], ['libro', '📖 Libros']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{
                  padding: '0.6rem 1.3rem', borderRadius: '10px', border: `1.5px solid ${filter === val ? '#4f46e5' : theme.inputBorder}`,
                  background: filter === val ? '#4f46e5' : theme.card, color: filter === val ? 'white' : theme.text2,
                  cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: theme.text2 }}>
            <p style={{ fontSize: '3rem' }}>🔍</p>
            <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>No se encontraron productos para "{search}"</p>
            <button onClick={() => setSearch('')} style={{ marginTop: '1rem', background: '#4f46e5', color: 'white', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' }}>
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))', gap: '1.8rem' }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  searchBox: { display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.7rem 1rem', borderRadius: '12px' },
};