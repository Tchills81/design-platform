import type { TextElement } from './TextElement';
import type { ImageElement } from './ImageElement';
import { TemplateElement } from './template';
export type CardState = {
  width: number;
  height: number;
  background: string;
  backgroundImage?: string;
  gridColors?: string[];
  textElements?: TextElement[];
  imageElements?: ImageElement[];
  elements: TemplateElement[];
};

