export const GROUP_COLORS = [
  { id: 'slate', name: 'Charcoal Slate', bg: 'bg-slate-900', text: 'text-slate-900', lightBg: 'bg-slate-50', border: 'border-slate-300', ring: 'ring-slate-900', dot: 'bg-slate-900', hex: '#0f172a' },
  { id: 'blue', name: 'Ocean Blue', bg: 'bg-blue-600', text: 'text-blue-700', lightBg: 'bg-blue-50/70', border: 'border-blue-200', ring: 'ring-blue-600', dot: 'bg-blue-600', hex: '#2563eb' },
  { id: 'indigo', name: 'Deep Indigo', bg: 'bg-indigo-600', text: 'text-indigo-700', lightBg: 'bg-indigo-50/70', border: 'border-indigo-200', ring: 'ring-indigo-600', dot: 'bg-indigo-600', hex: '#4f46e5' },
  { id: 'emerald', name: 'Forest Emerald', bg: 'bg-emerald-600', text: 'text-emerald-700', lightBg: 'bg-emerald-50/70', border: 'border-emerald-200', ring: 'ring-emerald-600', dot: 'bg-emerald-600', hex: '#059669' },
  { id: 'purple', name: 'Royal Purple', bg: 'bg-purple-600', text: 'text-purple-700', lightBg: 'bg-purple-50/70', border: 'border-purple-200', ring: 'ring-purple-600', dot: 'bg-purple-600', hex: '#9333ea' },
  { id: 'amber', name: 'Warm Amber', bg: 'bg-amber-600', text: 'text-amber-700', lightBg: 'bg-amber-50/70', border: 'border-amber-200', ring: 'ring-amber-600', dot: 'bg-amber-600', hex: '#d97706' },
  { id: 'rose', name: 'Terracotta Rose', bg: 'bg-rose-600', text: 'text-rose-700', lightBg: 'bg-rose-50/70', border: 'border-rose-200', ring: 'ring-rose-600', dot: 'bg-rose-600', hex: '#e11d48' },
  { id: 'teal', name: 'Nordic Teal', bg: 'bg-teal-600', text: 'text-teal-700', lightBg: 'bg-teal-50/70', border: 'border-teal-200', ring: 'ring-teal-600', dot: 'bg-teal-600', hex: '#0d9488' }
];

export function getGroupColor(colorId = 'slate') {
  const found = GROUP_COLORS.find(c => c.id === colorId);
  return found || GROUP_COLORS[0];
}
