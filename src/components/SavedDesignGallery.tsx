import { useEffect, useState } from 'react';

import { type DualTemplate } from '../types/template';

type Props = {
  userId: string;
  onSelect: (template: DualTemplate) => void;
};

export default function SavedDesignGallery({ userId, onSelect }: Props) {
  const [designs, setDesigns] = useState<DualTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/loadSavedDesigns?userId=${encodeURIComponent(userId)}`)
      .then(res => res.json())
      .then(data => {
        const parsed = data.map((entry: any) => {
          try {
            const parsedData = JSON.parse(entry.data);
            return {
              id: String(entry.id),
              name: entry.name,
              author: entry.author,
              savedAt: entry.savedAt,
              tone: parsedData.tone,
              mode: parsedData.mode,
              front: parsedData.front,
              back: parsedData.back,
              thumbnailUrl: entry.thumbnailUrl
            };
          } catch (err) {
            console.warn(`Failed to parse saved design ${entry.id}:`, err);
            return null;
          }
        }).filter(Boolean);

        setDesigns(parsed);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load saved designs:', err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading your designs...</div>;
  if (designs.length === 0) return <div>No saved designs yet. Start creating!</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
      {designs.map(design => (
        <div key={design.id} style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={() => onSelect(design)}>
          <img src={design.thumbnailUrl} alt={design.name} style={{ width: '100%', borderRadius: '6px', marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{design.name}</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>{design.tone} tone</p>
        </div>
      ))}
    </div>
  );
}
