/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Schibsted Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        dose: {
          paper: '#0c1313',
          'paper-2': '#121a1a',
          'paper-3': '#172222',
          elevated: '#1c2b2b',
          ink: '#f0f5f4',
          'ink-2': '#c6d6d2',
          muted: '#809692',
          rule: 'rgba(85, 115, 110, 0.32)',
          accent: '#10b981',
          'accent-deep': '#059669',
          'accent-soft': '#a7f3d0',
          emergency: '#f43f5e',
          'emergency-deep': '#be123c',
          'emergency-surface': '#221016',
        },
        telegram: {
          blue: '#0284c7',
          dark: '#0369a1',
        },
        whatsapp: {
          green: '#25d366',
          dark: '#128c7e',
        }
      },
      borderRadius: {
        card: '14px',
        input: '10px',
      },
      boxShadow: {
        'tray': 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 12px 28px -12px rgba(4, 15, 14, 0.45)',
        'tray-lift': 'inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 18px 36px -14px rgba(4, 15, 14, 0.6)',
        'btn': 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 2px 0 rgba(4, 120, 87, 0.8)',
      }
    },
  },
  plugins: [],
}
