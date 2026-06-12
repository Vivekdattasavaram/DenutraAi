/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#07101F',
        surface: '#111F34',
        surfaceAlt: '#172E4D',
        surfaceSoft: '#1A2A45',
        card: '#0F172A',
        border: '#334155',
        primary: '#3B82F6',
        primarySoft: '#bfdbfe',
        secondary: '#22C55E',
        secondarySoft: '#dcfce7',
        warning: '#F59E0B',
        error: '#EF4444',
        text: '#F8FAFC',
        textMuted: '#94A3B8',
        accent: '#60A5FA',
        accentDeep: '#1E40AF',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.18)',
      },
      borderRadius: {
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
