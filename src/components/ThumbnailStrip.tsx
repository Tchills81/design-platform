import React from 'react';
import { SnapshotEntry } from '../types/SnapshotEntry';
import { DualTemplate, TemplateDocument } from '../types/template';
import { transformDualTemplateToDocument } from '../utils/transformDualTemplate';
import { ToneButton } from './ToneButton';
import { ArrowLeft, Copy, NotepadText, PlusIcon, SquarePlus } from 'lucide-react';
import { tone } from '../types/tone';
import { TemplateSize } from '../enumarations/TemplateSize';
import { TemplateSizeLabel } from '../enumarations/TemplateSizeLabel';
import { getDefaultPageType } from '../utils/getDefaultPageType';
import { getMaxPageCount } from '../utils/getMaxPageCount';
type ThumbnailStripProps = {
  stripRef: React.RefObject<HTMLDivElement | null>;
  snapshots: SnapshotEntry[];
  onSelect: (entry: SnapshotEntry) => void;
  template?: DualTemplate | null;
  onAddPage: () => void;
  onDuplicatePage: () => void;
  showPages: boolean;
  activeSide?: 'front' | 'back' | null;
  activeTimestamp: string | null;
  activeIndex?: number | null;
  setActiveIndex?: (index: number) => void;
  isPreviewMode:boolean;
 
  setDocumentTemplates:(documents:TemplateDocument[])=>void;
};

export function ThumbnailStrip({
  stripRef,
  snapshots,
  onSelect,
  onAddPage,
  onDuplicatePage,
  template,
  activeSide,
  activeTimestamp, 
  activeIndex,
  setActiveIndex,
  showPages,
  isPreviewMode,
 
  setDocumentTemplates,
}: ThumbnailStripProps) {
  // 🧩 Group snapshots by timestamp
  const groupedByTimestamp: Record<string, SnapshotEntry[]> = {};
  snapshots.forEach(entry => {
    const key = entry.timestamp;
    if (!groupedByTimestamp[key]) groupedByTimestamp[key] = [];
    groupedByTimestamp[key].push(entry);
  });

  // 🧩 Sort timestamps chronologically
  const sortedTimestamps = Object.keys(groupedByTimestamp).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // 🧩 Flatten into paired entries with correct page numbers
  const pairedEntries: { entry: SnapshotEntry; pageNumber: number }[] = [];
  let pageIndex = 0;

  sortedTimestamps.forEach(ts => {
    const group = groupedByTimestamp[ts];
    const front = group.find(e => e.side === 'front');
    const back = group.find(e => e.side === 'back');

    if (front) {
      pairedEntries.push({ entry: front, pageNumber: pageIndex * 2 + 1 });
    }
    if (back) {
      pairedEntries.push({ entry: back, pageNumber: pageIndex * 2 + 2 });
    }

    if (front || back) pageIndex++;
  });

  // 🧩 Determine default page type based on template size
  const defaultType = getDefaultPageType(template?.size ?? TemplateSize.PRESENTATION);
  const maxPageCount = getMaxPageCount(template?.size ?? TemplateSize.PRESENTATION);
  const currentPageCount = snapshots.length;
  const canAddPage = currentPageCount < maxPageCount;


  // 🧩 Labeling logic for thumbnails
  function getThumbnailLabel(index: number, entry: SnapshotEntry, defaultType: 'page' | 'inside'): string {
    if (defaultType === 'page') {
      // Each side is a separate page
      return ` ${index + 1}`;
    }
  
    // Inside-aware labeling
    if (index === 0) return 'Front';
    if (index === 1) return 'Back';
    if (index === 2) return 'Front Inside';
    if (index === 3) return 'Back Inside';
  
    return `Page ${Math.floor(index / 2) + 1}`;
  }

  const handleAddPage = () => {

    /*logic to add new page based on defaultType can be added here and controlled*/


    // Invoke the provided callback to add a new page
    onAddPage();
  }

  const handleDuplicatePage = () => {
    // Logic to duplicate the currently active page can be added here

    // For now, just invoking onAddPage as a placeholder
   // onAddPage();
   onDuplicatePage();
  }
  

  return (
    <div
    ref={stripRef}
    style={{
      position: 'absolute',
      bottom: 4, // 🧭 Adjust to sit just above the footer
      left: 0,
      width: 'inherit',
      zIndex: 20,
      display: 'flex',
      justifyContent: isPreviewMode?'center':'left',
      alignItems:  isPreviewMode?'center':'left',
      gap: '1rem',
      padding: '0.75rem 1rem',
      borderTop: '1px dotted #e2e8f0',
      background: '#e2e8f0',
      flexWrap: 'wrap',
      overflowX: 'auto',
      boxSizing: 'border-box',
      transition: 'opacity 0.3s ease-in-out, transform 0.9s ease-in-out',
      animation: 'fadeInUp 0.9s ease-out forwards' // ✅ ceremonial entrance
    }}
  >
      {/* ➕ Add Page Button */}

      {!isPreviewMode && (
        <div>

      <ToneButton
      icon={<Copy size={18}/>}
      label={defaultType === 'inside' ? 'Duplicate ' : 'Duplicate '}
      tone={template?.tone as tone || 'ceremonial'}
      onClick={handleDuplicatePage}
      disabled={!canAddPage}
      />
      <ToneButton
      icon={<SquarePlus size={18}/>}
      label={defaultType === 'inside' ? 'Add ' : 'Add '}
      tone={template?.tone as tone || 'ceremonial'}
      onClick={handleAddPage}
      disabled={!canAddPage}
      />
        </div>
        
      ) }


    
      {!canAddPage && (
     <div style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: '0.5rem' }}>
        Max pages reached for this format
        </div>
    )}


      {/* 🖼️ Thumbnails */}
      {pairedEntries.map(({ entry }, index) => {
        const { side, image, timestamp, template: entryTemplate } = entry;
        const document = transformDualTemplateToDocument(entryTemplate);
        const page = document.pages.find(p => p.role === side);
        const time = timestamp ? new Date(timestamp).toLocaleTimeString() : '';
        const label = getThumbnailLabel(index, entry, defaultType);

        const isActive = activeTimestamp === timestamp && activeSide === side;


        console.log('isActive', isActive)

        return (
          <div
            key={side + timestamp + index}
            onClick={() => onSelect(entry)}
            style={{
              border: isActive ? '2px solid #0284c7' : '1px solid #1e!e!e',
              width: 50,
              padding: '0.2rem',
              cursor: 'pointer',
              textAlign: 'center',
              borderRadius: 8,
              background: '#ffffff',
              boxShadow: isActive ? '0 0 6px rgba(2,132,199,0.4)' : 'none',
              transition: 'border 0.2s ease, box-shadow 0.2s ease',
              transform: isPreviewMode ? 'scale(1.05)' : 'transform 0.2s ease',
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

       
           
            <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#334155', height: '1rem',  }}>
              {label}
            </div>
           
          </div>
        );
      })}
    </div>
  );
}
