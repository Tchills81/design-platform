import { UnifiedTemplate } from '../types/template';
import { tone } from '../types/tone';
import TemplateThumbnail from './TemplateThumbnail';

type Props = {
  title: string;
  templates: UnifiedTemplate[];
  onSelect: (tpl: UnifiedTemplate) => void;
  tone: string;
};

export function TemplateCategorySection({ title, templates, onSelect, tone }: Props) {
  return (
    <div>
      <h2
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          marginBottom: '0.75rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.5rem',
          color: tone === 'dark' ? '#f8fafc' : '#334155'
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '1rem',
          justifyItems: 'center'
        }}
      >
        {templates.map((tpl) => {
          const { document } = tpl;
          if (!document) return null;

          return (
            <TemplateThumbnail
              key={document.id}
              template={tpl} // ✅ pass full UnifiedTemplate
              tone={document.tone as tone}
              onClick={() => onSelect(tpl)}
              size="small"
            />
          );
        })}
      </div>
    </div>
  );
}
