
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