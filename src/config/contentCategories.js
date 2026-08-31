export const CONTENT_CATEGORIES = [
  { 
    id: 'programming', 
    label: 'Pemrograman & IT', 
    description: 'Web development, mobile apps, backend, DevOps & coding',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  { 
    id: 'design', 
    label: 'Desain & UI/UX', 
    description: 'Product design, graphic design, visual art & prototyping',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  { 
    id: 'data', 
    label: 'Sains Data & AI', 
    description: 'Data analytics, machine learning, Python & prompt engineering',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  { 
    id: 'business', 
    label: 'Bisnis & Manajemen', 
    description: 'Digital marketing, startup, finance, sales & product management',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  { 
    id: 'language', 
    label: 'Bahasa & Komunikasi', 
    description: 'English proficiency, public speaking & interpersonal communication',
    color: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  { 
    id: 'general', 
    label: 'Umum & Fundamental', 
    description: 'Konsep dasar, pengetahuan umum dan pengenalan materi',
    color: 'bg-slate-100 text-slate-700 border-slate-200'
  }
];

export const DEFAULT_CATEGORY_ID = 'general';

export function getCategoryInfo(categoryId) {
  const cleanId = String(categoryId || '').trim().toLowerCase();
  return CONTENT_CATEGORIES.find(c => c.id === cleanId) || {
    id: cleanId || 'general',
    label: cleanId ? cleanId.charAt(0).toUpperCase() + cleanId.slice(1) : 'Umum & Fundamental',
    description: 'Kategori Pembelajaran',
    color: 'bg-slate-100 text-slate-700 border-slate-200'
  };
}
