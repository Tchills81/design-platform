import { useEffect, useState } from 'react';
import { injectAssetIntoTemplateDocument } from '../utils/injectAssetIntoTemplateDocument';
import { loadUnifiedTemplates } from '../utils/loadTemplateDocuments';
import { toDualTemplate } from '../utils/toDualTemplate';
import { DualTemplate, UnifiedTemplate } from '../types/template';
import TemplateTile from './templateTitle';
import { tone } from '../types/tone';
import { toneClasses } from '../types/tone';
import { TemplateSize } from '../enumarations/TemplateSize';
import CategoryStrip from './CategoryStrip';
import { TemplateCategoryMap } from '../enumarations/TemplateSize';

type TemplateGalleryProps = {
  onSelect: (template: DualTemplate) => void;
  setDualFaces: (docs: DualTemplate[]) => void;
  importedAsset?: {
    src: string;
    role: 'background' | 'element';
  };
};

const templateTones = Object.keys(toneClasses);

export default function TemplateGalleryV2({
  onSelect,
  setDualFaces,
  importedAsset
}: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<UnifiedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedTypeRaw] = useState<string>('all');
  const [selectedTone, setSelectedTone] = useState<string>('all');

  const setSelectedType = (type: string) => {
    setSelectedTypeRaw(type);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const selectedCategory =
    selectedType === 'all'
      ? 'all'
      : TemplateCategoryMap[selectedType as TemplateSize] || selectedType;

  useEffect(() => {
    async function fetchTemplates() {
      const unified = await loadUnifiedTemplates('/api/loadChristmasGift');
      setTemplates(unified);
      setLoading(false);
    }

    fetchTemplates();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading templates...</div>;
  }

  // 🎨 Build tone map by type
  const toneBySize: Record<string, string> = {};
  templates.forEach(({ document }) => {
    if (document?.type && document?.tone) {
      toneBySize[document.type] = document.tone;
    }
  });

  // 🧠 Filter and group templates by type → subtype
  const grouped = templates.reduce((acc, tpl) => {
    const doc = tpl.document;
    if (!doc) return acc;

    const typeKey = doc.type ?? 'untagged';
    const toneKey = doc.tone ?? 'neutral';
    const subtypeKey = doc.subtype ?? 'default';

    if (selectedCategory !== 'all' && typeKey !== selectedCategory) return acc;
    if (selectedTone !== 'all' && toneKey !== selectedTone) return acc;

    if (!acc[typeKey]) acc[typeKey] = {};
    if (!acc[typeKey][subtypeKey]) acc[typeKey][subtypeKey] = [];
    acc[typeKey][subtypeKey].push(tpl);

    return acc;
  }, {} as Record<string, Record<string, UnifiedTemplate[]>>);

  return (
    <div className="space-y-10">
      {/* 🎛 Dual Filtering UI */}
      <div className="flex flex-wrap gap-6 mb-6">
        <CategoryStrip
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          toneBySize={toneBySize}
        />

        <div>
          <label htmlFor="tone-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by tone
          </label>
          <select
            id="tone-filter"
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Tones</option>
            {templateTones.map((tone) => (
              <option key={tone} value={tone}>
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🧱 Grouped Layout */}
      {Object.entries(grouped).map(([typeKey, subtypes]) => (
        <div key={typeKey}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {typeKey.charAt(0).toUpperCase() + typeKey.slice(1)} Templates
          </h2>

          {Object.entries(subtypes).map(([subtypeKey, group]) => (
            <div key={subtypeKey} className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {subtypeKey.charAt(0).toUpperCase() + subtypeKey.slice(1)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {group.map(({ document }) => {
                  if (!document) return null;

                  const handleClick = async () => {
                    const enriched = importedAsset
                      ? await injectAssetIntoTemplateDocument(document, importedAsset, 'front')
                      : document;
                    const dual = toDualTemplate(enriched);
                    setDualFaces([dual]);
                    onSelect(dual);
                  };

                  return (
                    <TemplateTile
                      key={document.id}
                      template={document}
                      tone={document.tone as tone}
                      onClick={handleClick}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
