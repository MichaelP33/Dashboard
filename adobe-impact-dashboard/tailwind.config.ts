import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cursor-inspired color palette
        background: {
          primary: '#161722',
          secondary: '#25273c',
          tertiary: '#2d2f42',
        },
        text: {
          primary: '#cacde8',
          secondary: '#777a92',
          accent: '#e4e5f1',
          muted: '#555866',
        },
        border: {
          primary: '#353847',
          secondary: '#444757',
        },
        impact: {
          1: '#ef4444', // red-500
          2: '#f97316', // orange-500
          3: '#eab308', // yellow-500
          4: '#22c55e', // green-500
          5: '#3b82f6', // blue-500
        },
        ai: {
          low: '#64748b',    // slate-500
          medium: '#6366f1', // indigo-500
          high: '#8b5cf6',   // violet-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config; 