import { TemplateSize } from "../enumarations/TemplateSize";
import { SnapshotEntry } from "../types/SnapshotEntry";
export function getDefaultPageType(size: string): 'page' | 'inside' {
    switch (size) {
      case TemplateSize.POSTCARD:
      case TemplateSize.GIFT_CARD_SMALL:
      case TemplateSize.PORTRAIT_POSTCARD:
        return 'inside'; // small formats often have inside faces
  
      case TemplateSize.PRESENTATION:
      case TemplateSize.POSTER_WIDE:
      case TemplateSize.FLYER_PORTRAIT:
      case TemplateSize.MOBILE_VIDEO_LANDSCAPE:
        return 'page'; // multi-page or slide-based formats
  
      case TemplateSize.INSTAGRAM_POST:
      case TemplateSize.INSTAGRAM_STORY:
      case TemplateSize.MOBILE_VIDEO_PORTRAIT:
        return 'page'; // single-frame but may support sequences
  
      default:
        return 'page';
    }
  }

  export function getPreviewPages(entries: SnapshotEntry[], size: string) {
    if (size === TemplateSize.POSTCARD || size === TemplateSize.GIFT_CARD_SMALL) {
      return [
        { label: 'Front Face', image: entries.find(e => e.side === 'front')?.image },
        { label: 'Back Face', image: entries.find(e => e.side === 'back')?.image }
      ];
    }
  
    return entries.map((entry, i) => ({
      label: `Page ${i + 1}`,
      image: entry.image
    }));
  }
  
  