import { useState, useRef, useEffect } from 'react';
import api from '../services/api';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: '¡Hola! 👋 Soy el asistente de EduShop.\n¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/chatbot', { message: input });
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'Lo siento, ocurrió un error. Intenta de nuevo.' }]);
    }
    setLoading(false);
  };

  const quickQuestions = ['Ver cursos', 'Ver libros', 'Precios', 'Métodos de pago'];

  return (
    <div style={styles.wrapper}>
      {open && (
        <div style={styles.chatBox}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.avatar}>🤖</div>
              <div>
                <div style={styles.botName}>Asistente EduShop</div>
                <div style={styles.botStatus}>● En línea</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={styles.closeBtn}>✕</button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', marginBottom: '0.7rem' }}>
                {m.from === 'bot' && <div style={styles.botAvatar}>🤖</div>}
                <div style={m.from === 'user' ? styles.userBubble : styles.botBubble}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={styles.botAvatar}>🤖</div>
                <div style={styles.botBubble}>
                  <span style={styles.typing}>●●●</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          <div style={styles.quickRow}>
            {quickQuestions.map(q => (
              <button key={q} onClick={() => { setInput(q); }} style={styles.quickBtn}>{q}</button>
            ))}
          </div>

          {/* Input */}
          <div style={styles.inputRow}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Escribe tu pregunta..."
              style={styles.input}
            />
            <button onClick={send} style={styles.sendBtn} disabled={loading}>➤</button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setOpen(!open)} style={styles.fab}>
        {open ? '✕' : '💬'}
        {!open && messages.length > 1 && <span style={styles.fabDot} />}
      </button>
    </div>
  );
}

const styles = {
  wrapper: { position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 },
  fab: {
    width: '58px', height: '58px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: 'white', border: 'none', fontSize: '1.5rem', cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(79,70,229,0.45)', position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  fabDot: {
    position: 'absolute', top: '4px', right: '4px', width: '10px', height: '10px',
    background: '#22c55e', borderRadius: '50%', border: '2px solid white',
  },
  chatBox: {
    position: 'absolute', bottom: '70px', right: 0, width: '340px',
    background: '#ffffff', borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden',
    border: '1px solid #e8edf5',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 1.2rem', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '0.8rem' },
  avatar: { fontSize: '1.8rem', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  botName: { color: 'white', fontWeight: '700', fontSize: '0.95rem' },
  botStatus: { color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' },
  closeBtn: { background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  messages: {
    height: '280px', overflowY: 'auto', padding: '1rem',
    background: '#f8faff', display: 'flex', flexDirection: 'column',
  },
  botAvatar: { fontSize: '1.2rem', marginRight: '0.5rem', marginTop: '2px', flexShrink: 0 },
  botBubble: {
    background: '#ffffff', color: '#1e293b', padding: '0.7rem 1rem',
    borderRadius: '4px 16px 16px 16px', fontSize: '0.88rem', lineHeight: 1.6,
    maxWidth: '230px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e8edf5', whiteSpace: 'pre-line',
  },
  userBubble: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#ffffff',
    padding: '0.7rem 1rem', borderRadius: '16px 4px 16px 16px',
    fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '220px',
  },
  typing: { color: '#94a3b8', letterSpacing: '3px', fontSize: '1rem' },
  quickRow: {
    display: 'flex', gap: '0.4rem', padding: '0.7rem 1rem',
    overflowX: 'auto', background: '#f8faff', borderTop: '1px solid #e8edf5',
  },
  quickBtn: {
    background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe',
    padding: '0.3rem 0.8rem', borderRadius: '20px', cursor: 'pointer',
    fontSize: '0.78rem', fontWeight: '600', whiteSpace: 'nowrap',
  },
  inputRow: { display: 'flex', borderTop: '1px solid #e8edf5', background: 'white' },
  input: {
    flex: 1, padding: '0.9rem 1rem', border: 'none', outline: 'none',
    fontSize: '0.9rem', color: '#1e293b', background: 'transparent',
    fontFamily: 'inherit',
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white',
    border: 'none', padding: '0 1.2rem', cursor: 'pointer', fontSize: '1.1rem',
  },
};