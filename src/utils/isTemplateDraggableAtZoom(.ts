import { TemplateSize } from "../enumarations/TemplateSize";

export function isTemplateDraggableAtZoom(templateSize: TemplateSize, zoom: number): boolean {
    switch (templateSize) {
      case TemplateSize.POSTER_WIDE:
      case TemplateSize.FLYER_PORTRAIT:
      case TemplateSize.PRESENTATION:
      case TemplateSize.MOBILE_VIDEO_LANDSCAPE:
      case TemplateSize.MOBILE_VIDEO_PORTRAIT:
      case TemplateSize.INSTAGRAM_STORY:
        return true; // large templates: always draggable
      default:
        return zoom === 1; // small templates: only draggable at 100%
    }
  }
  