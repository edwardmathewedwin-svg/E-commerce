/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        base: {
          black: '#07070B',
          dark: '#0B0B14',
          panel: '#10101C',
          card: '#15152410',
          cardSolid: '#151524',
          border: '#1E1E30',
          hover: '#1C1C32',
        },
        neon: {
          pink: '#FF2D92',
          magenta: '#FF00C8',
          purple: '#9D4EDD',
          violet: '#7B2CBF',
          orange: '#FF6B35',
          cyan: '#00F5FF',
          green: '#00FF9F',
        },
      },
      boxShadow: {
        'glow-pink': '0 0 20px rgba(255, 45, 146, 0.35), 0 0 50px rgba(255, 45, 146, 0.12)',
        'glow-magenta': '0 0 20px rgba(255, 0, 200, 0.35), 0 0 50px rgba(255, 0, 200, 0.12)',
        'glow-purple': '0 0 20px rgba(157, 78, 221, 0.35), 0 0 50px rgba(157, 78, 221, 0.12)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.35), 0 0 50px rgba(255, 107, 53, 0.12)',
        'glow-sm-pink': '0 0 10px rgba(255, 45, 146, 0.25)',
        'glow-sm-purple': '0 0 10px rgba(157, 78, 221, 0.25)',
        'glow-sm-green': '0 0 10px rgba(0, 255, 159, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-up': 'slideUp 0.3s ease forwards',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'pulse-dot': 'pulseDot 1.8s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseGlow: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
        pulseDot: { '0%,100%': { opacity: '1', boxShadow: '0 0 8px rgba(0,255,159,0.6)' }, '50%': { opacity: '0.6', boxShadow: '0 0 4px rgba(0,255,159,0.3)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        gradientShift: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
    },
  },
  plugins: [],
};
