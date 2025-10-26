import { TemplateDocument } from '../types/template';
import { tone, toneColorMap } from '../types/tone';

interface TemplateTileProps {
  template: TemplateDocument;
  tone: tone;
  onClick: () => void;
}

export default function TemplateTile({ template, onClick }: TemplateTileProps) {
  const {
    name,
    tone,
    size,
    sizeLabel,
    width,
    height,
    thumbnailUrl,
    type,
    theme,
    previewMode,
    author
  } = template;

  const toneClass = toneColorMap[tone] ?? 'text-gray-600';

  return (
    <div
      onClick={onClick}
      className="cursor-pointer block rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-200 p-4 bg-white group"
    >
      <div className="aspect-video w-full bg-gray-100 rounded-lg mb-3 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Preview of ${name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted text-sm">
            No preview available
          </div>
        )}
      </div>

      <h3 className="text-lg font-serif text-gray-800 group-hover:text-ceremonial transition">
        {name}
      </h3>

      <p className="text-sm text-muted mt-1">
        {sizeLabel} · {type ?? 'Untyped'} · {theme ?? 'Unthemed'}
      </p>

      <p className="text-xs text-muted mt-1 italic">by {author}</p>

      <span className={`text-xs mt-2 inline-block ${toneClass}`}>
        {tone.charAt(0).toUpperCase() + tone.slice(1)} tone
      </span>
    </div>
  );
}
