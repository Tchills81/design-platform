import { useEffect, useRef, useState } from 'react';
import { injectAssetIntoTemplateDocument } from '../utils/injectAssetIntoTemplateDocument';
import { loadUnifiedTemplates } from '../utils/loadTemplateDocuments';
import { toDualTemplate } from '../utils/toDualTemplate';
import { DualTemplate, UnifiedTemplate } from '../types/template';
import { tone } from '../types/tone';
import { TemplateSize } from '../enumarations/TemplateSize';
import { TemplateCategoryMap } from '../enumarations/TemplateSize';
import CategoryStrip from './CategoryStrip';
import TemplateThumbnail from './TemplateThumbnail';
import { ToneSelect } from './ToneSelect';

type TemplatePanelContentProps = {
  onSelect: (template: DualTemplate) => void;
  setDualFaces: (docs: DualTemplate[]) => void;
  importedAsset?: {
    src: string;
    role: 'background' | 'element';
  };
};

export function TemplatePanelContent({
  onSelect,
  setDualFaces,
  importedAsset
}: TemplatePanelContentProps) {
  const [templates, setTemplates] = useState<UnifiedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedTypeRaw] = useState<string>('all');
  const [selectedTone, setSelectedToneRaw] = useState<string>('all');

  const topRef = useRef<HTMLDivElement>(null);

  const setSelectedType = (type: string) => {
    setSelectedTypeRaw(type);
    //window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const setSelectedTone = (tone: string) => {
    setSelectedToneRaw(tone);
    //topRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    return <div className="text-center text-gray-500 py-4">Loading templates...</div>;
  }

  const toneBySize: Record<string, string> = {};
  templates.forEach(({ document }) => {
    if (document?.type && document?.tone) {
      toneBySize[document.type] = document.tone;
    }
  });

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
    <>
      <div ref={topRef} />

      {/* 🎛 Modular Filtering Strip */}
      
        <CategoryStrip
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          toneBySize={toneBySize}
        />
       
    

      <ToneSelect selectedTone={selectedTone} setSelectedTone={setSelectedTone} />

      {/* 🧱 Grouped Templates */}
      {Object.entries(grouped).map(([typeKey, subtypes]) => (
        <div key={typeKey} className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {typeKey.charAt(0).toUpperCase() + typeKey.slice(1)} Templates
          </h2>

          {Object.entries(subtypes).map(([subtypeKey, group]) => (
            <div key={subtypeKey} className="mb-8">
              <h3 className="text-md font-medium text-gray-700 mb-2">
                {subtypeKey.charAt(0).toUpperCase() + subtypeKey.slice(1)}
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {group.map((tpl) => {
                  const { document } = tpl;
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
                    <TemplateThumbnail
                      key={document.id}
                      template={tpl}
                      tone={document.tone as tone}
                      onClick={handleClick}
                      size="small"
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
