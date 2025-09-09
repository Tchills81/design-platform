import { useEffect, useState } from 'react';
import { type DualTemplate } from '../types/template';

type TemplateGalleryProps = {
  onSelect: (template: DualTemplate) => void;
};

export default function TemplateGallery({ onSelect }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<DualTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTone, setSelectedTone] = useState<string>('all');

  const filteredTemplates = templates.filter(tpl =>
    selectedTone === 'all' ? true : tpl.tone === selectedTone
  );

  useEffect(() => {
    fetch('/api/loadDualTemplates')
      .then(res => res.json())
      .then(data => {
        const parsedTemplates: DualTemplate[] = data
          .map((entry: any) => {
            try {
              const parsed = JSON.parse(entry.data);
              return {
                id: String(entry.id),
                name: entry.name,
                author: entry.author,
                savedAt: entry.savedAt,
                tone: parsed.tone ?? 'neutral',
                mode: parsed.mode ?? 'card',
                front: parsed.front,
                back: parsed.back
              };
            } catch (err) {
              console.warn(`🛑 Failed to parse template ${entry.id}:`, err);
              return null;
            }
          })
          .filter(Boolean);

        setTemplates(parsedTemplates);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load templates:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.loading}>Loading templates...</div>;

  return (
    <>
      <select
        value={selectedTone}
        onChange={(e) => setSelectedTone(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem' }}
      >
        <option value="all">All Tones</option>
        <option value="reflective">Reflective</option>
        <option value="warm">Warm</option>
        <option value="minimal">Minimal</option>
      </select>

      <div style={styles.gallery}>
        {filteredTemplates.map(template => {
          const toneColor = getToneColor(template.tone);

          return (
            <div
              key={template.id}
              style={styles.card}
              onClick={() => onSelect(template)}
            >
              <div style={{ ...styles.thumbPlaceholder, backgroundColor: toneColor.bg, color: toneColor.text }}>
                <span>{template.tone} tone</span>
              </div>
              <h3 style={styles.title}>{template.name}</h3>
              <p style={styles.description}>by {template.author}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

function getToneColor(tone: string) {
  switch (tone) {
    case 'reflective':
      return { bg: '#DBEAFE', text: '#1E3A8A' }; // blue-100 / blue-900
    case 'warm':
      return { bg: '#FEF3C7', text: '#92400E' }; // amber-100 / amber-900
    case 'minimal':
      return { bg: '#F3F4F6', text: '#374151' }; // gray-100 / gray-700
    default:
      return { bg: '#F0F0F0', text: '#666666' }; // neutral fallback
  }
}

const styles: Record<string, React.CSSProperties> = {
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
    padding: '2rem'
  },
  card: {
    cursor: 'pointer',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    padding: '1.25rem',
    transition: 'transform 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  thumbPlaceholder: {
    width: '100%',
    height: '180px',
    borderRadius: '12px',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: 500
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 600,
    margin: '0.5rem 0',
    textAlign: 'center'
  },
  description: {
    fontSize: '1rem',
    color: '#666',
    textAlign: 'center'
  },
  loading: {
    padding: '2rem',
    fontSize: '1rem',
    textAlign: 'center'
  }
};
