import { TemplateDocument, FacePage } from '../types/template';
import { TemplateElement } from '../types/template';

export type InjectableAsset = {
  src: string;
  role: 'background' | 'element';
};

export async function injectAssetIntoTemplateDocument(
  template: TemplateDocument,
  asset: InjectableAsset,
  activePageId: string = 'front' // default to front
): Promise<TemplateDocument> {
  const enrichedPages: FacePage[] = await Promise.all(template.pages.map(async page => {
    if (page.id !== activePageId) return page;

    const updatedCard = {
      ...page.card,
      backgroundImage:
        asset.role === 'background' ? asset.src : page.card.backgroundImage ?? '',
    };

    const updatedElements = [...page.elements];

    if (asset.role === 'element') {
      const img = await loadImage(asset.src);
      const aspectRatio = img.width / img.height;
      const baseWidth = 200;

      const newElement: TemplateElement = {
        type: 'image',
        id: `img-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
        src: asset.src,
        position: { x: 100, y: 100 },
        size: {
          width: baseWidth,
          height: baseWidth / aspectRatio,
        },
        tone: template.tone ?? 'neutral',
      };

      updatedElements.push(newElement);
    }

    return {
      ...page,
      card: updatedCard,
      elements: updatedElements
    };
  }));

  return {
    ...template,
    pages: enrichedPages
  };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}
