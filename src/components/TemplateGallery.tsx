import { useEffect, useState } from 'react';
import { type DualTemplate } from '../types/template';
import { TemplateSize } from '../enumarations/TemplateSize';
import { TemplateGeometry } from '../enumarations/TemplateGeometry';
import { TemplateSizeLabel } from '../enumarations/TemplateSizeLabel';
import { injectAssetIntoTemplate } from '../utils/injectAssetIntoTemplate';
import { getToneColor, galleryStyles as styles } from '../styles/galleryStyles';
import { loadTemplates } from '../utils/loadTemplates';


type TemplateGalleryProps = {
  onSelect: (template: DualTemplate) => void;
  setDualFaces:(dualFaces:DualTemplate[])=>void;
  importedAsset?: {
    src: string;
    role: 'background' | 'element';
  };
};

export default function TemplateGallery({ onSelect, importedAsset, setDualFaces }: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<DualTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTone, setSelectedTone] = useState<string>('all');

  const filteredTemplates = templates.filter(tpl =>
    selectedTone === 'all' ? true : tpl.tone === selectedTone
  );

  useEffect(() => {
    loadTemplates('/api/loadChristmasGift').then(setTemplates);
    setLoading(false);
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
              onClick={async () => {
                const enriched = importedAsset
                  ? await injectAssetIntoTemplate(template, importedAsset)
                  : template;

                  const dualFaces:DualTemplate[]=[enriched]
                  setDualFaces(dualFaces);

                  console.log("setDualFaces", setDualFaces, 'dualFaces', dualFaces)

                onSelect(enriched);
              }}
            >
              <div
                style={{
                  ...styles.thumbPlaceholder,
                  backgroundColor: toneColor.bg,
                  color: toneColor.text,
                }}
              >
                <span>{template.tone} tone</span>
              </div>
              <h3 style={styles.title}>{template.name}</h3>
              <p style={styles.description}>by {template.author}</p>
              <p style={styles.description}>by {template.width} x {template.height}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

