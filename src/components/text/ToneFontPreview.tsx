
import { useTextStylePayload } from './useTextStylePayload';
import { toneToFont } from '@/src/types/tone';

const sampleText = 'The quick brown fox… '

type ToneFontPreviewProps = {
  tone?: string;
  role?: string;
};

export const ToneFontPreview = ({ tone, role = 'body' }: ToneFontPreviewProps) => {
  const tones = tone ? [tone] : Object.keys(toneToFont);

  return (
    <div className={`grid ${tone ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
      {tones.map((toneKey) => {
        const style = useTextStylePayload({ role, tone: toneKey, shapeType: 'text' });

        return (
          <div
            key={toneKey}
            className="rounded-lg p-4 shadow-sm"
            style={{ backgroundColor: style.highlight }}
          >
            <div className="text-sm font-medium mb-2" style={{ color: style.fill }}>
              {toneKey.charAt(0).toUpperCase() + toneKey.slice(1)}
            </div>
            <div
              style={{
                fontFamily: style.fontFamily,
                color: style.fill,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                lineHeight: style.lineHeight
              }}
            >
              {sampleText}
            </div>
          </div>
        );
      })}
    </div>
  );
};
