import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        papier: { DEFAULT: '#FDFCF7', fonce: '#F4EFE3' },
        seyes: { DEFAULT: '#B9CBE4', clair: '#DCE6F2' },
        faience: { DEFAULT: '#2F5D8C', fonce: '#234A72', clair: '#E3ECF6' },
        vichy: { DEFAULT: '#C9463D', fonce: '#A8362F', clair: '#F6DEDB' },
        beurre: { DEFAULT: '#F2D16B', clair: '#FBF0C9' },
        sauge: { DEFAULT: '#7E9C7A', fonce: '#55704F', clair: '#E5EDE3' },
        encre: { DEFAULT: '#23324A', douce: '#4F5D73' },
        nuit: { DEFAULT: '#16233A', carte: '#1F2F4A', ligne: '#2C4166' },
      },
      fontFamily: {
        titre: ['"Young Serif"', 'Georgia', 'serif'],
        texte: ['Nunito', 'system-ui', 'sans-serif'],
        main: ['Kalam', 'cursive'],
      },
      borderRadius: {
        fiche: '0.375rem',
        bouton: '999px',
      },
      boxShadow: {
        fiche: '0 1px 0 rgba(35, 50, 74, 0.06), 0 6px 14px -8px rgba(35, 50, 74, 0.35)',
        scotch: '0 2px 4px rgba(35, 50, 74, 0.15)',
      },
      maxWidth: {
        lecture: '68ch',
      },
    },
  },
  plugins: [],
} satisfies Config;
