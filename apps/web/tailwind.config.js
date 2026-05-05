/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Colour palette — Precision Field ──────────────────────────────────
      colors: {
        canvas:  { DEFAULT: '#0A1628', 50: '#f0f4f8', 100: '#d9e2ec', 200: '#bcccdc', 900: '#102040', 950: '#0A1628' },
        teal:    { DEFAULT: '#0D9488', 300: '#5EEAD4', 400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488', 700: '#0F766E', 800: '#115E59', 900: '#134E4A' },
        signal:  { DEFAULT: '#10B981', 400: '#34D399', 500: '#10B981', 600: '#059669' },
        amber:   { DEFAULT: '#F59E0B', 300: '#FCD34D', 400: '#FBBF24', 500: '#F59E0B', 600: '#D97706' },
        crimson: { DEFAULT: '#EF4444', 400: '#F87171', 500: '#EF4444', 600: '#DC2626' },
        slate:   { 700: '#334155', 800: '#1E293B', 850: '#172033', 900: '#0F172A', 950: '#080F1D' },
        grid:    'rgba(20,184,166,0.08)',
      },
      // ── Typography — DM Mono + Lora ────────────────────────────────────────
      fontFamily: {
        mono:    ['"DM Mono"', 'monospace'],
        serif:   ['"Lora"', 'Georgia', 'serif'],
        display: ['"DM Mono"', 'monospace'],
      },
      // ── Spacing and sizing ─────────────────────────────────────────────────
      spacing: { '18': '4.5rem', '88': '22rem', '112': '28rem', '128': '32rem' },
      // ── Animations ────────────────────────────────────────────────────────
      keyframes: {
        'slide-in-right': { from: { transform: 'translateX(100%)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        'slide-in-left':  { from: { transform: 'translateX(-100%)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        'slide-in-up':    { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        'fade-in':        { from: { opacity: '0' }, to: { opacity: '1' } },
        'count-up':       { from: { opacity: '0', transform: 'translateY(8px)' }, to: { transform: 'translateY(0)', opacity: '1' } },
        'ping-slow':      { '75%, 100%': { transform: 'scale(2)', opacity: '0' } },
        'scan-line':      { '0%': { top: '0%' }, '100%': { top: '100%' } },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-left':  'slide-in-left  0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-up':    'slide-in-up    0.3s  cubic-bezier(0.16,1,0.3,1)',
        'fade-in':        'fade-in        0.4s  ease',
        'count-up':       'count-up       0.5s  ease',
        'ping-slow':      'ping-slow      2s    cubic-bezier(0,0,0.2,1) infinite',
        'scan-line':      'scan-line      3s    linear infinite',
      },
      // ── Borders ───────────────────────────────────────────────────────────
      borderColor: { DEFAULT: 'rgba(20,184,166,0.2)' },
      // ── Box shadow ────────────────────────────────────────────────────────
      boxShadow: {
        'teal-glow':  '0 0 20px rgba(20,184,166,0.25)',
        'panel':      '0 4px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(20,184,166,0.1)',
        'marker-high':'0 0 0 3px rgba(239,68,68,0.4)',
        'marker-med': '0 0 0 3px rgba(245,158,11,0.4)',
        'marker-low': '0 0 0 3px rgba(16,185,129,0.4)',
      },
    },
  },
  plugins: [],
};
