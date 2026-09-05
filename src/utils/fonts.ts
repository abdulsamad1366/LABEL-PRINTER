export interface FontOption {
  name: string;
  family: string;
  category: 'Sans-Serif' | 'Serif' | 'Monospace' | 'Script & Display';
}

export const FONT_OPTIONS: FontOption[] = [
  // Sans-Serif
  { name: 'Inter', family: "'Inter', sans-serif", category: 'Sans-Serif' },
  { name: 'Roboto', family: "'Roboto', sans-serif", category: 'Sans-Serif' },
  { name: 'Open Sans', family: "'Open Sans', sans-serif", category: 'Sans-Serif' },
  { name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'Sans-Serif' },
  { name: 'Poppins', family: "'Poppins', sans-serif", category: 'Sans-Serif' },
  { name: 'Lato', family: "'Lato', sans-serif", category: 'Sans-Serif' },
  { name: 'Oswald', family: "'Oswald', sans-serif", category: 'Sans-Serif' },
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", category: 'Sans-Serif' },
  { name: 'Raleway', family: "'Raleway', sans-serif", category: 'Sans-Serif' },
  { name: 'Arial', family: 'Arial, sans-serif', category: 'Sans-Serif' },
  { name: 'Helvetica', family: 'Helvetica, sans-serif', category: 'Sans-Serif' },

  // Serif
  { name: 'Playfair Display', family: "'Playfair Display', serif", category: 'Serif' },
  { name: 'Merriweather', family: "'Merriweather', serif", category: 'Serif' },
  { name: 'Georgia', family: 'Georgia, serif', category: 'Serif' },
  { name: 'Times New Roman', family: "'Times New Roman', Times, serif", category: 'Serif' },
  { name: 'Cinzel', family: "'Cinzel', serif", category: 'Serif' },

  // Monospace
  { name: 'JetBrains Mono', family: "'JetBrains Mono', monospace", category: 'Monospace' },
  { name: 'Fira Code', family: "'Fira Code', monospace", category: 'Monospace' },
  { name: 'Source Code Pro', family: "'Source Code Pro', monospace", category: 'Monospace' },
  { name: 'Courier New', family: "'Courier New', Courier, monospace", category: 'Monospace' },

  // Script & Display
  { name: 'Pacifico', family: "'Pacifico', cursive", category: 'Script & Display' },
  { name: 'Dancing Script', family: "'Dancing Script', cursive", category: 'Script & Display' },
  { name: 'Great Vibes', family: "'Great Vibes', cursive", category: 'Script & Display' },
  { name: 'Caveat', family: "'Caveat', cursive", category: 'Script & Display' },
  { name: 'Permanent Marker', family: "'Permanent Marker', cursive", category: 'Script & Display' },
  { name: 'Lobster', family: "'Lobster', cursive", category: 'Script & Display' },
  { name: 'Impact', family: 'Impact, Charcoal, sans-serif', category: 'Script & Display' },
];

export const FONT_WEIGHT_OPTIONS = [
  { label: 'Thin (100)', value: '100' },
  { label: 'Light (300)', value: '300' },
  { label: 'Normal (400)', value: 'normal' },
  { label: 'Medium (500)', value: '500' },
  { label: 'SemiBold (600)', value: '600' },
  { label: 'Bold (700)', value: 'bold' },
  { label: 'ExtraBold (800)', value: '800' },
  { label: 'Black (900)', value: '900' },
];

export const FONT_SIZE_PRESETS = [6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
