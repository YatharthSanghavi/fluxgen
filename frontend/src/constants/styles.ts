export const STYLE_PRESETS = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard generation without style modifications',
    gradient: 'from-gray-400 to-gray-600'
  },
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    description: 'High-quality, realistic photography style',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    id: 'artistic',
    name: 'Artistic',
    description: 'Creative, expressive fine art style',
    gradient: 'from-purple-400 to-pink-600'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Dramatic lighting and film-like composition',
    gradient: 'from-amber-400 to-orange-600'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Magical, mystical, and enchanted themes',
    gradient: 'from-violet-400 to-purple-600'
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Japanese animation and manga style',
    gradient: 'from-pink-400 to-rose-600'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro, nostalgic, and classic aesthetic',
    gradient: 'from-amber-400 to-amber-600'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple, and modern design',
    gradient: 'from-slate-400 to-slate-600'
  }
];

export const DIMENSION_PRESETS = [
  { label: 'Square (1024x1024)', width: 1024, height: 1024 },
  { label: 'Portrait (768x1024)', width: 768, height: 1024 },
  { label: 'Landscape (1024x768)', width: 1024, height: 768 },
  { label: 'Widescreen (1280x720)', width: 1280, height: 720 },
  { label: 'Instagram Square (1088x1088)', width: 1088, height: 1088 },
  { label: 'Custom', width: 1024, height: 1024 }
];