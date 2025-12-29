import { Font } from '@react-pdf/renderer';

// Register fonts for PDF rendering
// Using Fontsource CDN with latin-ext for Czech character support

// Roboto
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-ext-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-ext-700-normal.ttf',
      fontWeight: 700,
    },
  ],
});

// Open Sans
Font.register({
  family: 'Open Sans',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/open-sans@latest/latin-ext-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/open-sans@latest/latin-ext-700-normal.ttf',
      fontWeight: 700,
    },
  ],
});

// Lato
Font.register({
  family: 'Lato',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/lato@latest/latin-ext-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/lato@latest/latin-ext-700-normal.ttf',
      fontWeight: 700,
    },
  ],
});

// Merriweather (for Georgia, Times New Roman)
Font.register({
  family: 'Merriweather',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-ext-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-ext-700-normal.ttf',
      fontWeight: 700,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-ext-400-italic.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
  ],
});

// Playfair Display
Font.register({
  family: 'Playfair Display',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-ext-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-ext-700-normal.ttf',
      fontWeight: 700,
    },
  ],
});

// Montserrat
Font.register({
  family: 'Montserrat',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-ext-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-ext-700-normal.ttf',
      fontWeight: 700,
    },
  ],
});

// Inter
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-700-normal.ttf',
      fontWeight: 700,
    },
  ],
});

// Roboto Mono (for Courier New)
Font.register({
  family: 'Roboto Mono',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/roboto-mono@latest/latin-ext-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/roboto-mono@latest/latin-ext-700-normal.ttf',
      fontWeight: 700,
    },
  ],
});

// Configure hyphenation (disable for cleaner CVs)
Font.registerHyphenationCallback((word) => [word]);

// Font mapping for converting web fonts (CSS variables) to PDF fonts
export const fontMapping = {
  "var(--font-inter), sans-serif": 'Inter',
  "var(--font-roboto), sans-serif": 'Roboto',
  "var(--font-open-sans), sans-serif": 'Open Sans',
  "var(--font-lato), sans-serif": 'Lato',
  "var(--font-montserrat), sans-serif": 'Montserrat',
  "var(--font-merriweather), serif": 'Merriweather',
  "var(--font-playfair-display), serif": 'Playfair Display',
  "var(--font-roboto-mono), monospace": 'Roboto Mono',
};

// Get PDF-compatible font family
export const getPDFFont = (webFont) => {
  if (!webFont) return 'Roboto';
  return fontMapping[webFont] || 'Roboto';
};

export default { fontMapping, getPDFFont };