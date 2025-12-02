import React from 'react';
import { SnapshotEntry } from '../types/SnapshotEntry';
import { transformDualTemplateToDocument } from '../utils/transformDualTemplate';
import { createPortal } from 'react-dom';
import {
  isPrimitiveTextElement,
  isPrimitiveImageElement,
  isPrimitiveShapeElement
} from '../types/template';
import { ModalThumbnailStrip } from './ModalThumbnailStrip';
import { getPreviewLabel } from '../utils/getPreviewLabel';

type PreviewModalProps = {

  entry: SnapshotEntry | null;
  snapshots: SnapshotEntry[];
  isOpen: boolean;
  handlePreview: (entry: SnapshotEntry) => void;
  onClose: () => void;
  setZoom: (newZoom: number) => void;
  zoom: number;
};

export const PreviewModal: React.FC<PreviewModalProps> = ({
  entry,
  snapshots,
  handlePreview,
 
  isOpen,
  onClose,
  setZoom,
  zoom
}) => {
  if (!isOpen || !entry) return null;

  const { image, side, timestamp, template } = entry;
  const templateDocument = transformDualTemplateToDocument(template);
  const page = templateDocument.pages.find(p => p.role === side);
  const accentColor = template.tokens?.accentColor ?? '#0284c7';
  const insideMessage = template.meta?.insideMessage;
  const label = getPreviewLabel(entry, snapshots);
  const time = timestamp ? new Date(timestamp).toLocaleString() : '';
  const aspectRatio = page ? page.card.width / page.card.height : 1;

  const bodyText = page?.elements.find(
    el => isPrimitiveTextElement(el) && el.role?.toLowerCase() === 'body'
  );

  const motifImage = page?.elements.find(
    el => isPrimitiveImageElement(el) && el.role === 'motif'
  );

  const accentShape = page?.elements.find(isPrimitiveShapeElement);


  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    setZoom(newZoom);
  };


  return createPortal(
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, borderColor: accentColor }}>
        <button style={closeStyle} onClick={onClose}>×</button>

        {/* 🧠 Scrollable Content */}
        <div style={scrollableContentStyle}>
          <div style={metaStyle}>
            <div style={labelStyle}>{label} • {template.sizeLabel}</div>
            <div style={timestampStyle}>{time}</div>

            {insideMessage && (
              <div style={messageStyle}>
                <strong>Inside Message:</strong> {insideMessage}
              </div>
            )}

            {bodyText && isPrimitiveTextElement(bodyText) && (
              <div style={messageStyle}>
                <strong>Body Text:</strong> {bodyText.text}
              </div>
            )}

            {motifImage && (
              <div style={messageStyle}>
                <strong>Motif:</strong> {motifImage.label ?? 'Decorative Image'}
              </div>
            )}

            {accentShape && (
              <div style={messageStyle}>
                <strong>Accent Shape:</strong> {accentShape.shapeType}
              </div>
            )}
          </div>

          <div style={imageWrapperStyle}>
  <div style={scrollContainerStyle}>
  <div
  style={{
    width: '100%',
    height: template.height * zoom,
    transition: 'width 0.2s ease-in-out, height 0.2s ease-in-out'
  }}
>
  <img
    src={image}
    alt={`${label} preview`}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }}
  />
</div>

  </div>
</div>

        </div>
        <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.01}
              value={zoom}
              onChange={handleSliderChange}
              className="w-32 h-2 rounded-full accent-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {Math.round(zoom * 100)}%
            </span>
          </div>

        {/* 🖼️ Fixed Thumbnail Strip */}
        <div style={thumbnailStripWrapperStyle}>
          <ModalThumbnailStrip
            snapshots={snapshots}
            activeEntry={entry}
            onSelect={handlePreview}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

// 🎨 Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.85)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  position: 'relative',
  background: '#fff',
  padding: '1rem',
  borderRadius: 12,
  width: '90vw',
  height: '100vh',
  boxShadow: '0 0 20px rgba(0,0,0,0.3)',
  textAlign: 'center',
  border: '4px solid',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const scrollableContentStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  paddingRight: '0.5rem'
};

const closeStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  fontSize: 24,
  background: 'none',
  border: 'none',
  cursor: 'pointer'
};

const metaStyle: React.CSSProperties = {
  marginBottom: '1rem',
  fontSize: '0.85rem',
  color: '#475569'
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: '1rem'
};

const timestampStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  marginTop: 4
};

const messageStyle: React.CSSProperties = {
  marginTop: '0.5rem',
  fontSize: '0.8rem',
  color: '#334155'
};

const imageWrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow:'auto',
  
};

const thumbnailStripWrapperStyle: React.CSSProperties = {
  paddingTop: '0.2rem',
  borderTop: '1px dotted #e2e8f0',
  background: '#f1f5f9'
};

const scrollContainerStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '80vh',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'grab'
  };
  
