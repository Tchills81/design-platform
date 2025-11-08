import { DualTemplate } from '../types/template';

import { TemplateElement } from '../types/template';

export type InjectableAsset = {
  src: string;
  role: 'background' | 'element';
};


export function getInjectionSideFromIndex(index: number | null): 'front' | 'back' {

  if(index){

    return index % 2 === 0 ? 'front' : 'back';

  }
  return 'front';
  
}


export async function injectAssetIntoTemplate(
  template: DualTemplate,
  asset: InjectableAsset,
  side: 'front' | 'back'
): Promise<DualTemplate> {
  const currentFace = template[side];
  if (!currentFace) {
    console.warn(`Side "${side}" not found in template`);
    return template;
  }

  const updatedCard = {
    ...currentFace.card,
    backgroundImage:
      asset.role === 'background' ? asset.src : currentFace.card?.backgroundImage ?? '',
  };

  let updatedElements = [...(currentFace.elements ?? [])];

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
    ...template,
    [side]: {
      card: updatedCard,
      elements: updatedElements,
    },
  };
}


export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
    
  });
}
