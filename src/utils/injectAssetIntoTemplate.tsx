import { DualTemplate } from '../types/template';

import { TemplateElement } from '../types/template';

export type InjectableAsset = {
  src: string;
  role: 'background' | 'element';
};

export async function injectAssetIntoTemplate(
  template: DualTemplate,
  asset: InjectableAsset
): Promise<DualTemplate> {
  const enrichedTemplate: DualTemplate = {
    ...template,
    front: {
      card: {
        width: template.width,
        height: template.height,
        background: template.front?.card?.background ?? '',
        backgroundImage:
          asset.role === 'background'
            ? asset.src
            : template.front?.card?.backgroundImage ?? '',
        gridColors: template.front?.card?.gridColors ?? [],
        cellSize: template.front?.card?.cellSize ?? 20,
      },
      elements: [...(template.front?.elements ?? [])],
    },
    back: template.back,
  };

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
      tone: 'neutral',
    };

    enrichedTemplate?.front?.elements.push(newElement);
  }

  return enrichedTemplate;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}
