import { useCallback } from 'react';
import { DesignElement } from '@/src/types/DesignElement';
import { TemplateElement } from '@/src/types/template';
import { useCanvasStore } from '../store/createCanvasStore';
import { useCanvasActions } from '../hooks/useCanvasActions';
import { useCanvasState } from './useCanvasState';

export function useInsertElementFromDesign() {
  const template = useCanvasStore((s) => s.template);
  const setTemplate = useCanvasStore((s) => s.setTemplate);
  const setSelectedTextId = useCanvasStore((s) => s.setSelectedTextId);
  const side = useCanvasStore((s) => s.side);

  const state = useCanvasState();
  const { recordSnapshot, createPrimitiveId } = useCanvasActions(state);

  const insertElementFromDesign = useCallback((el: DesignElement) => {
    if (!template || !template[side]) return;

    recordSnapshot();

    const newId = createPrimitiveId(el.type);
    let newElement: TemplateElement;
    console.log('insertElementFromDesign', el);

    switch (el.type) {
      case 'shape':
        newElement = {
          id: newId,
          type: 'shape',
          position: { x: el.x ?? 100, y: el.y ?? 100 },
          size: {
            width: el.width ?? 60,
            height: el.height ?? 60
          },
          fill: el.fill ?? '#f0f0f0',
          shapeType: el.shapeType,
          stroke: el.stroke,
          strokeWidth: el.strokeWidth,
          tone: template.tone,
          role: 'accent',
          label: el.label ?? ''
        };
        break;

      case 'image':
        newElement = {
          id: newId,
          type: 'image',
          src: el.src ?? '/assets/logo.png',
          position: { x: el.x ?? 100, y: el.y ?? 100 },
          size: {
            width: el.width ?? 100,
            height: el.height ?? 80
          },
          tone: template.tone,
          role: 'decoration',
          label: el.label ?? ''
        };
        break;

        case 'text':
          console.log('inserting text ', el.role)
          newElement = {
            id: newId,
            type: 'text',
            label: el.label ?? el.text ?? 'New Text',
            shapeType: el.shapeType,
            text: el.text ?? el.label ?? 'New Text',
            font: el.font ?? '--font-inter',
            size: el.fontSize ?? 16,
            color: el.fill ?? '#000000',
            position: { x: el.x ?? 200, y: el.y ?? 200 },
            isBold: el.isBold ?? false,
            isItalic: el.isItalic ?? false,
            tone: template.tone,
            role: el.role 

          };
          break;
        

      case 'icon':
        console.log('inserting icon ', el.role)
        newElement = {
          id: newId,
          type: 'icon',
          label: el.label ?? el.emoji ?? 'Icon',
          emoji: el.emoji ?? '⭐',
          position: { x: el.x ?? 120, y: el.y ?? 120 },
          size: {
            width: el.width ?? 48,
            height: el.height ?? 48
          },
          tone: template.tone,
          role: 'symbol'
        };
        break;

        case 'frame':
          newElement = {
            id: newId,
            type: 'shape',
            label: el.label ?? 'Frame',
            shapeType: el.shapeType ?? 'rectangle',
            position: { x: el.x ?? 100, y: el.y ?? 100 },
            size: {
              width: el.width ?? 240,
              height: el.height ?? 180
            },
            fill: el.fill ?? 'transparent',
            stroke: el.stroke ?? '#1e293b',
            strokeWidth: el.strokeWidth ?? 2,
            tone: template.tone,
            role: 'frame'
          };
          break;
        

      default:
        return;
    }


    console.log('newElement', newElement); 

    setTemplate((prev) => {
      if (!prev || !prev[side]) return null;
      return {
        ...prev,
        [side]: {
          ...prev[side],
          elements: [...prev[side].elements, newElement]
        }
      };
    });

    if (el.type === 'text') {
      setSelectedTextId(newId);
    }

    return newId;
  }, [template, side, setTemplate, setSelectedTextId, recordSnapshot, createPrimitiveId]);

  return { insertElementFromDesign };
}
