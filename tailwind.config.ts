import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}', 
  ],
  theme: {
    extend: {
      colors: {
        panel: '#0f172a',        // dark slate panel
        panelBorder: '#1e293b',
        ok: '#22c55e',
        alarm: '#ef4444',
        insufficient: '#eab308',
        mutedText: '#94a3b8',
      },
      boxShadow: {
        panel: '0 0 0 1px rgba(148,163,184,0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
