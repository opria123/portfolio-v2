/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bgMidnight: '#09080E',
        bgCard: '#13111C',
        neonCyan: '#00F0FF',
        neonFuchsia: '#FF007F',
        matteSilver: '#E2E8F0',
        mutedGraphite: '#4A4557',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(0, 240, 255, 0.25)',
        'glow-fuchsia': '0 0 15px rgba(255, 0, 127, 0.25)',
      },
      backgroundImage: {
        'cyber-grid':
          'linear-gradient(to bottom, rgba(74,69,87,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(74,69,87,0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [],
}

