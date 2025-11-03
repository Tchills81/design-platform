
export type tone ="festive"| "neutral" | "primary" | "accent" | "ceremonial"|"reflective" |"elegant" | "minimal"


export const palettes: Record<tone, string[]> = {
    neutral:['#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'],
    primary:['#2563eb', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed', '#0ea5e9'],
    accent:['#f43f5e', '#22d3ee', '#a3e635', '#e879f9', '#fb923c', '#38bdf8'],
    ceremonial:['#78350f', '#fef3c7', '#fde68a', '#fcd34d', '#eab308', '#92400e'],
    festive: ['#b91c1c', '#fbbf24', '#c2410c', '#fcd34d'],
    reflective: ['#1e3a8a', '#60a5fa', '#f0f9ff', '#94a3b8'],
    elegant: ['#4f46e5', '#6366f1', '#eef2ff', '#a5b4fc'],
    minimal: ['#111827', '#6b7280', '#d1d5db', '#f9fafb']
  };

  export const toneColorMap: Record<string, string> = {
    festive: 'text-red-600',
    neutral: 'text-gray-600',
    primary: 'text-blue-600',
    accent: 'text-pink-500',
    ceremonial: 'text-yellow-700',
    reflective: 'text-indigo-600',
    elegant: 'text-purple-600',
    minimal: 'text-gray-800'
  };


  export const toneFocusClasses: Record<string, string> = {
    warm: 'focus:ring-yellow-500',
    reflective: 'focus:ring-blue-500',
    minimal: 'focus:ring-gray-400',
    neutral: 'focus:ring-gray-600',
  };
  
  export const toneClasses: Record<string, string> = {
    // 🌤️ Core tones
    warm: 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 shadow-yellow-300',
    reflective: 'text-blue-600 bg-blue-100 hover:bg-blue-200 shadow-blue-300',
    minimal: 'text-gray-500 bg-gray-100 hover:bg-gray-200 shadow-gray-300',
    neutral: 'text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-gray-300',
    green: 'bg-green-500 text-white shadow-md',
    danger: 'bg-red-500 text-white shadow-md',
    calm: 'bg-teal-500 text-white shadow-md',
    bold: 'bg-purple-600 text-white shadow-md',
  
    // 🎄 Seasonal and expressive tones
    festive: 'text-red-700 bg-red-100 hover:bg-red-200 shadow-red-300',
    soft: 'text-pink-600 bg-pink-100 hover:bg-pink-200 shadow-pink-300',
    elegant: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 shadow-indigo-300',
    playful: 'text-orange-600 bg-orange-100 hover:bg-orange-200 shadow-orange-300',
  
    // 🧩 Data-derived tones
    announcement: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-indigo-300',
    promo: 'bg-orange-100 text-orange-700 hover:bg-orange-200 shadow-orange-300',
    card: 'bg-red-100 text-red-700 hover:bg-red-200 shadow-red-300',
    print: 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-blue-300',
    social: 'bg-pink-100 text-pink-700 hover:bg-pink-200 shadow-pink-300',
  
    // 🧯 Fallback tone
    accent: 'bg-gray-200 text-gray-700 shadow-md'
  };
  


export const toneActiveClasses: Record<string, string> = {
  warm: 'bg-yellow-500 text-white shadow-md',
  reflective: 'bg-blue-500 text-white shadow-md',
  minimal: 'bg-gray-500 text-white shadow-md',
  neutral: 'bg-gray-600 text-white shadow-md',
  green: 'bg-green-500 text-white shadow-md',
  danger: 'bg-red-500 text-white shadow-md',
  calm: 'bg-teal-500 text-white shadow-md',
  bold: 'bg-purple-600 text-white shadow-md'
};


export const toneBackgroundClasses: Record<tone, string> = {
  festive: 'bg-red-100',
  neutral: 'bg-gray-100',
  primary: 'bg-blue-100',
  accent: 'bg-pink-100',
  ceremonial: 'bg-yellow-100',
  reflective: 'bg-indigo-100',
  elegant: 'bg-purple-100',
  minimal: 'bg-white'
};

