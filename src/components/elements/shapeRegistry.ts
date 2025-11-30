import React from 'react';
import { Rect, Circle, Line, Star, Ring, RegularPolygon, Arrow } from 'react-konva';
import type { DesignElement } from '@/src/types/DesignElement';
import { Heart } from './shapes/customShapes';
import { Flower } from './shapes/FlowerShape';


import type { ReactElement } from 'react';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

type CommonProps = {
  ref: React.Ref<any>;
  onClick?: (e: KonvaEventObject<MouseEvent>) => void;
  onDragMove: (e: any) => void;
  onDragEnd: (e: any) => void;
  onTransformEnd: () => void;
  cursor: string;
  isSelected: boolean;
  zoom: number;
  fillColor?: string;
  showTransformer?: boolean;
  listening?:boolean;
};

export type ShapeRenderer = (
  element: DesignElement,
  props: CommonProps
) => ReactElement;

export type ShapeMeta = {
    render: ShapeRenderer;
    getAnchorOffset?: (node: Konva.Node) => { x: number; y: number };
    drawsFromCenter?: boolean;
  };
  

  export const supportedShapes: Record<string, ShapeMeta> = {
    rectangle: {
      render: (element, props) =>
        React.createElement(Rect, {
           id:element.id,
          x: element.x,
          y: element.y,
          width: element.width ?? 100,
          height: element.height ?? 100,
          fill: props.fillColor ?? element.fill,
          stroke: props.isSelected ? '#00f0ff' : element.stroke,
          strokeWidth: props.isSelected ? 2 : element.strokeWidth,
          draggable:true,
          name: 'Shape',
          ...props
        }),
      drawsFromCenter: false
    },


  
    // 🎉 Frame variants
    'frame-basic': {
      render: (element, props) =>
        React.createElement(Rect, {
          id: element.id,
          x: element.x,
          y: element.y,
          width: element.width ?? 240,
          height: element.height ?? 180,
          fill: 'transparent',
          stroke: props.isSelected ? '#00f0ff' : element.stroke ?? '#1e293b',
          strokeWidth: props.isSelected ? 2 : element.strokeWidth ?? 2,
          hitStrokeWidth: 12, // or 16 for extra forgiveness
          listening:true,
          draggable: true,
          name: 'Frame',
          ...props
        }),
      drawsFromCenter: false
    },
  
    'frame-dashed': {
      render: (element, props) =>
        React.createElement(Rect, {
          id: element.id,
          x: element.x,
          y: element.y,
          width: element.width ?? 240,
          height: element.height ?? 180,
          fill: 'transparent',
          stroke: props.isSelected ? '#00f0ff' : element.stroke ?? '#64748b',
          strokeWidth: props.isSelected ? 2 : element.strokeWidth ?? 2,
          dash: [6, 4],
          hitStrokeWidth: 12, // or 16 for extra forgiveness
          listening:true,

          draggable: true,
          name: 'Frame',
          ...props
        }),
      drawsFromCenter: false
    },
  
    'frame-rounded': {
      render: (element, props) =>
        React.createElement(Rect, {
          id: element.id,
          x: element.x,
          y: element.y,
          width: element.width ?? 240,
          height: element.height ?? 180,
          fill: '#00f0ff',
          stroke: props.isSelected ? '#00f0ff' : element.stroke ?? '#334155',
          strokeWidth: props.isSelected ? 2 : element.strokeWidth ?? 2,
          hitStrokeWidth: 12, // or 16 for extra forgiveness
          listening:true,
          cornerRadius: 12,
          draggable: true,
          name: 'Frame',
          ...props
        }),
      drawsFromCenter: false
    },
  
    circle: {
      render: (element, props) =>
        React.createElement(Circle, {
          id:element.id,
          x: element.x,
          y: element.y,
          radius: Math.min(element.width ?? 100, element.height ?? 100) / 2,
          fill: props.fillColor ?? element.fill,
          stroke: props.isSelected ? '#00f0ff' : element.stroke,
          strokeWidth: props.isSelected ? 2 : element.strokeWidth,
          draggable: true,
          name: 'Shape',
          ...props
        }),
        getAnchorOffset: node => {
            const circleNode = node as Konva.Circle;
            const r = circleNode.radius?.() ?? 50;
            return { x: -r, y: -r };
          },
          
      drawsFromCenter: true
    },
  
    line: {
      render: (element, props) =>
        React.createElement(Line, {
          id:element.id,
          x: element.x,
          y: element.y,
          width: element.width ?? 100,
          height: element.height ?? 1,
          points: [0, 0, element.width ?? 100, element.height ?? 100],
          stroke: props.isSelected ? '#00f0ff' : element.stroke ?? '#000',
          fill: props.fillColor ?? element.fill,
          strokeWidth: props.isSelected ? 2 : element.strokeWidth ?? 1,
          draggable: true,
          hitStrokeWidth: 12,
          name: 'Shape',
          ...props
        }),
      drawsFromCenter: false
    },
  
    star: {
      render: (element, props) =>
        React.createElement(Star, {
          id:element.id,
          x: element.x,
          y: element.y,
          numPoints: 5,
          innerRadius: (element.width ?? 100) / 4,
          outerRadius: (element.width ?? 100) / 2,
          fill: props.fillColor ?? element.fill,
          stroke: props.isSelected ? '#00f0ff' : element.stroke,
          strokeWidth: props.isSelected ? 2 : element.strokeWidth,
          draggable: true,
          name: 'Shape',
          ...props
        }),
        getAnchorOffset: node => {
            const starNode = node as Konva.Star;
            const r = starNode.outerRadius?.() ?? 50;
            return { x: -r, y: -r };
          },
      drawsFromCenter: true
    },
  
    ring: {
      render: (element, props) =>
        React.createElement(Ring, {
          id:element.id,
          x: element.x,
          y: element.y,
          innerRadius: (element.width ?? 100) / 3,
          outerRadius: (element.width ?? 100) / 2,
          fill: props.fillColor ?? element.fill,
          stroke: props.isSelected ? '#00f0ff' : element.stroke,
          strokeWidth: props.isSelected ? 2 : element.strokeWidth,
          draggable: true,
          name: 'Shape',
          ...props
        }),
        getAnchorOffset: node => {
            const ringNode = node as Konva.Ring;
            const r = ringNode.outerRadius?.() ?? 50;
            return { x: -r, y: -r };
          },
          
      drawsFromCenter: true
    },
  
    regularPolygon: {
      render: (element, props) =>
        React.createElement(RegularPolygon, {
          id:element.id,
          x: element.x,
          y: element.y,
          sides: 6,
          radius: Math.min(element.width ?? 100, element.height ?? 100) / 2,
          fill: props.fillColor ?? element.fill,
          stroke: props.isSelected ? '#00f0ff' : element.stroke,
          strokeWidth: props.isSelected ? 2 : element.strokeWidth,
          draggable: true,
          name: 'Shape',
          ...props
        }),
        getAnchorOffset: node => {
            const polygonNode = node as Konva.RegularPolygon;
            const r = polygonNode.radius?.() ?? 50;
            return { x: -r, y: -r };
          },
          
      drawsFromCenter: true
    },
  
    arrow: {
      render: (element, props) =>
        React.createElement(Arrow, {
          id:element.id,
          x: element.x,
          y: element.y,
          points: [0, 0, element.width ?? 100, element.height ?? 100],
          pointerLength: 10,
          pointerWidth: 10,
          fill: props.fillColor ?? element.fill,
          stroke: props.isSelected ? '#00f0ff' : element.stroke,
          strokeWidth: props.isSelected ? 2 : element.strokeWidth,
          draggable: true,
          name: 'Shape',
          ...props
        }),
      drawsFromCenter: false
    },
  
    heart: {
      render: (element, props) =>
        React.createElement(Heart, {
          id:element.id,
          x: element.x,
          y: element.y,
          width: element.width ?? 120,
          height: element.height ?? 105,
          fill: props.fillColor ?? element.fill,
          stroke: props.isSelected ? '#00f0ff' : element.stroke,
          strokeWidth: props.isSelected ? 2 : element.strokeWidth,
          draggable: true,
          name: 'Shape',
          ...props
        }),
      getAnchorOffset: () => ({ x: 0, y: 0 }),
      drawsFromCenter: false
    },

    flower: {
      render: (element, props) =>
        React.createElement(Flower, {
          id:element.id,
          x: element.x,
          y: element.y,
          petals: 6,
          radius: (element.width ?? 100) / 2,
          petalWidth: 12,
          fill: props.fillColor ?? element.fill,
          stroke: props.isSelected ? '#00f0ff' : element.stroke,
          strokeWidth: props.isSelected ? 2 : element.strokeWidth,
          draggable: true,
          name: 'Shape',
          ...props
        }),
      getAnchorOffset: (node) => {
        const shapeNode = node as Konva.Shape;
        const width = shapeNode.width?.() ?? 100;
        const height = shapeNode.height?.() ?? 100;
        return { x: width / 2, y: height / 2 };
      },
      drawsFromCenter: true
    }
    
    
  };
