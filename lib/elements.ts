import { DesignElement,  } from '@/src/types/DesignElement';


// group: 'Text' | 'Shapes' | 'Media'

export const ELEMENT_LIBRARY: DesignElement[] = [
  // 📝 Text Elements
  { id: 'text-1', type: 'text', label: 'Heading', x: 250, y: 250, shapeType:'heading' },
  { id: 'text-2', type: 'text', label: 'Body Text', x: 200, y: 100, shapeType:'body' },

  // 🟦 Shape Elements
  { id: 'shape-1', type: 'shape', label: 'Rectangle', x: 100, y: 100, shapeType: 'rectangle' },
  { id: 'shape-2', type: 'shape', label: 'Circle', x: 100, y: 100, shapeType: 'circle' },
  { id: 'shape-3', type: 'shape', label: 'Star', x: 160, y: 160, shapeType: 'star' },
  { id: 'shape-4', type: 'shape', label: 'Ring', x: 180, y: 180, shapeType: 'ring' },
  { id: 'shape-5', type: 'shape', label: 'Polygon', x: 200, y: 200, shapeType: 'regularPolygon' },
  { id: 'shape-6', type: 'shape', label: 'Line', x: 140, y: 140, shapeType: 'line', width:200, height: 0 },
  { id: 'shape-7', type: 'shape', label: 'Arrow', x: 100, y: 100, shapeType: 'arrow', width: 10, height: 0 },
  { id: 'shape-8', type: 'shape', label: 'Heart', x: 100, y: 100, shapeType: 'heart', width:120, height: 105 },
  //{ id: 'shape-9', type: 'shape', label: 'Flower', x: 100, y: 100, shapeType: 'flower', width:120, height: 105 },

  // 🖼️ Media Elements
  { id: 'image-1', type: 'image', label: 'Placeholder Image', x: 240, y: 240 , shapeType:'image'}
];
