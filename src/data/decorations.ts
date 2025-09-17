import { TemplateElement } from '../types/template';

const decorations: TemplateElement[] = [
  {
    type: 'image',
    id: 'snowflake-001',
    src: '/assets/decorations/deco1.png',
    position: { x: 0, y: 0 },
    size: { width: 64, height: 64 },
    tone: 'festive',
    role: 'decoration'
  },
  {
    type: 'image',
    id: 'ribbon-001',
    src: '/assets/decorations/deco4.png',
    position: { x: 0, y: 0 },
    size: { width: 80, height: 40 },
    tone: 'warm',
    role: 'decoration'
  },
  {
    type: 'image',
    id: 'ornament-001',
    src: '/assets/decorations/deco5.png',
    position: { x: 0, y: 0 },
    size: { width: 48, height: 48 },
    tone: 'festive',
    role: 'decoration'
  }
];

export default decorations;
