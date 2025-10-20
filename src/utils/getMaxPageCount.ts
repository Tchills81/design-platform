import { TemplateSize } from "../enumarations/TemplateSize";
export function getMaxPageCount(size: string): number {
    switch (size) {
      case TemplateSize.POSTCARD:
      case TemplateSize.GIFT_CARD_SMALL:
      case TemplateSize.PORTRAIT_POSTCARD:
        return 2; // front + back
  
      case TemplateSize.POSTER_WIDE:
      case TemplateSize.INSTAGRAM_POST:
        return 1; // single face
  
      case TemplateSize.FLYER_PORTRAIT:
        return 2; // front + back (optionally inside)
  
      case TemplateSize.PRESENTATION:
      case TemplateSize.INSTAGRAM_STORY:
      case TemplateSize.MOBILE_VIDEO_PORTRAIT:
      case TemplateSize.MOBILE_VIDEO_LANDSCAPE:
        return Infinity; // multi-page formats
  
      default:
        return Infinity;
    }
  }
  