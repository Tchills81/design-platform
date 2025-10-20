import { useEffect, useState } from 'react';

import { injectAssetIntoTemplateDocument } from '../utils/injectAssetIntoTemplateDocument';
import { loadUnifiedTemplates } from '../utils/loadTemplateDocuments';
import { getToneColor, galleryStyles as styles } from '../styles/galleryStyles';
import { DualTemplate, TemplateDocument,UnifiedTemplate } from '../types/template';
import { toDualTemplate } from '../utils/toDualTemplate';

type TemplateGalleryProps = {
  onSelect: (template: DualTemplate) => void;
  setDualFaces: (docs: DualTemplate[]) => void;
  importedAsset?: {
    src: string;
    role: 'background' | 'element';
  };
};

export default function TemplateGalleryV2({
  onSelect,
  importedAsset,
  setDualFaces
}: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<UnifiedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTone, setSelectedTone] = useState<string>('all');

  const filteredTemplates = templates.filter(tpl =>
    selectedTone === 'all' ? true : tpl?.document?.tone === selectedTone
  );

  useEffect(() => {
    async function fetchTemplates() {
      const unified = await loadUnifiedTemplates('/api/loadChristmasGift');
      setTemplates(unified);
      setLoading(false);
    }

    fetchTemplates();
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
        {filteredTemplates.map(({ document }) => {
          if (!document) return null; // 🛡️ Guard against undefined
          const toneColor = getToneColor(document.tone);

          return (
            <div
              key={document.id}
              style={styles.card}
              onClick={async () => {
                const enriched = importedAsset
                  ? await injectAssetIntoTemplateDocument(document, importedAsset, 'front')
                  : document;
                  const dual:DualTemplate = toDualTemplate(enriched);
                setDualFaces([dual]);
                onSelect(dual);
              }}
            >
              <div
                style={{
                  ...styles.thumbPlaceholder,
                  backgroundColor: toneColor.bg,
                  color: toneColor.text,
                }}
              >
                <span>{document.tone} tone</span>
              </div>
              <h3 style={styles.title}>{document.name}</h3>
              <p style={styles.description}>by {document.author}</p>
              <p style={styles.description}>
                {document.width} × {document.height}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
