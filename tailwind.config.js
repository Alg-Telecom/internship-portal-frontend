export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'var(--color-primary)', hover: 'var(--color-primary-hover)', foreground: 'var(--color-on-primary)' },
        accent: { DEFAULT: 'var(--color-accent)', hover: 'var(--color-accent-hover)', foreground: 'var(--color-on-accent)' },
        destructive: { DEFAULT: 'var(--color-destructive)', hover: 'var(--color-destructive-hover)', foreground: 'var(--color-on-destructive)' },
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: { DEFAULT: 'var(--color-card)', foreground: 'var(--color-card-foreground)' },
        muted: { DEFAULT: 'var(--color-muted)', foreground: 'var(--color-muted-foreground)' },
        border: 'var(--color-border)',
        ring: 'var(--color-ring)',
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}