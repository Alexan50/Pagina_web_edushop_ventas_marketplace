import { createContext, useContext, useState } from 'react';
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);
  const toggle = () => setDark(d => !d);

  const theme = dark ? {
    bg: '#0f0f1a',
    bg2: '#1a1a2e',
    bg3: '#16213e',
    card: 'rgba(255,255,255,0.05)',
    cardBorder: 'rgba(255,255,255,0.08)',
    text: '#f1f5f9',
    text2: '#94a3b8',
    text3: '#64748b',
    input: 'rgba(255,255,255,0.06)',
    inputBorder: 'rgba(255,255,255,0.12)',
    navBg: 'rgba(15,15,26,0.97)',
    navBorder: 'rgba(255,255,255,0.07)',
    footerBg: '#070714',
    isDark: true,
  } : {
    bg: '#f8faff',
    bg2: '#eef2ff',
    bg3: '#ffffff',
    card: '#ffffff',
    cardBorder: '#e8edf5',
    text: '#0f172a',
    text2: '#475569',
    text3: '#94a3b8',
    input: '#f8faff',
    inputBorder: '#dde3ee',
    navBg: 'rgba(255,255,255,0.97)',
    navBorder: '#e8edf5',
    footerBg: '#0f172a',
    isDark: false,
  };

  return (
    <ThemeContext.Provider value={{ theme, dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}