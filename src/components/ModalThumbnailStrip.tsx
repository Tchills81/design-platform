import React from 'react';
import { SnapshotEntry } from '../types/SnapshotEntry';
import { transformDualTemplateToDocument } from '../utils/transformDualTemplate';
import { TemplateSize } from '../enumarations/TemplateSize';
import { getDefaultPageType } from '../utils/getDefaultPageType';

type ModalThumbnailStripProps = {
  snapshots: SnapshotEntry[];
  activeEntry: SnapshotEntry | null;
  onSelect: (entry: SnapshotEntry) => void;
};

export function ModalThumbnailStrip({
  snapshots,
  activeEntry,
  onSelect
}: ModalThumbnailStripProps) {
  const defaultType = getDefaultPageType(
    activeEntry?.template.size ?? TemplateSize.PRESENTATION
  );

  function getThumbnailLabel(index: number, entry: SnapshotEntry): string {
    if (defaultType === 'page') return `${index + 1}`;
    if (index === 0) return 'Front';
    if (index === 1) return 'Back';
    if (index === 2) return 'Inside Front';
    if (index === 3) return 'Inside Back';
    return `Page ${Math.floor(index / 2) + 1}`;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '0.5rem 1rem',
        background: '#f1f5f9',
        borderTop: '1px solid #cbd5e1',
        overflowX: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {snapshots.map((entry, index) => {
        const { side, image, timestamp } = entry;
        const label = getThumbnailLabel(index, entry);
        const isActive =
          activeEntry?.timestamp === timestamp && activeEntry?.side === side;

        return (
          <div
            key={side + timestamp}
            onClick={() => onSelect(entry)}
            style={{
              border: isActive ? '2px solid #0284c7' : '1px solid #cbd5e1',
              width: 20,
              padding: '0.25rem',
              cursor: 'pointer',
              textAlign: 'center',
              borderRadius: 6,
              background: '#ffffff',
              boxShadow: isActive ? '0 0 6px rgba(2,132,199,0.4)' : 'none',
              transition: 'border 0.2s ease, box-shadow 0.2s ease'
            }}
          >
            <img
              src={image}
              alt={`${label} Thumbnail`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 4
              }}
            />
            <div
              style={{
                fontSize: '0.7rem',
                marginTop: '0.4rem',
                color: '#334155'
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
