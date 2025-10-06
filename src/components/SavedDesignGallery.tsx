import { useEffect, useState } from 'react';
import { type DualTemplate } from '../types/template';
import { getToneColor, galleryStyles as styles } from '../styles/galleryStyles';
import { loadDesigns } from '../utils/parseSavedDesigns';

type Props = {
  userId: string;
  onSelect: (template: DualTemplate) => void;
  setDualFaces: (dualFaces: DualTemplate[]) => void;
};

export default function SavedDesignGallery({ userId, onSelect, setDualFaces }: Props) {
  const [designs, setDesigns] = useState<DualTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTone, setSelectedTone] = useState<string>('all');

  const filteredDesigns = designs.filter(design =>
    selectedTone === 'all' ? true : design.tone === selectedTone
  );

  useEffect(() => {
    //loadDesigns(`/api/loadSavedDesigns?userId=${encodeURIComponent(userId)}`)
    loadDesigns(`/api/loadSavedDesigns?userId=chilongatobias@gmail.com`)
      .then(setDesigns)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div style={styles.loading}>Loading your saved designs...</div>;
  if (designs.length === 0) return <div style={styles.loading}>No saved designs yet. Start creating!</div>;

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
        {filteredDesigns.map(design => {
          const toneColor = getToneColor(design.tone);

          return (
            <div
              key={design.id}
              style={styles.card}
              onClick={() => {
                const dualFaces: DualTemplate[] = [design];
                setDualFaces(dualFaces);
                onSelect(design);
              }}
            >
              <div
                style={{
                  ...styles.thumbPlaceholder,
                  backgroundColor: toneColor.bg,
                  color: toneColor.text,
                }}
              >
                <span>{design.tone} tone</span>
              </div>
              <h3 style={styles.title}>{design.name}</h3>
              <p style={styles.description}>by {design.author}</p>
              <p style={styles.description}>{design.width} × {design.height}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
