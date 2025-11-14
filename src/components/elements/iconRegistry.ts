// src/components/canvas/iconRegistry.ts
import React from 'react';
import { Text } from 'react-konva';
import Konva from 'konva';
import type { DesignElement } from '@/src/types/DesignElement';

type CommonProps = {
  ref: React.Ref<any>;
  onClick: () => void;
  onDragMove: (e: any) => void;
  onDragEnd: (e: any) => void;
  onTransformEnd: () => void;
  cursor: string;
  isSelected: boolean;
  zoom: number;
  fillColor?: string;
  showTransformer?: boolean;
};

export type IconRenderer = (
  element: DesignElement,
  props: CommonProps
) => React.ReactElement;

export type IconMeta = {
  render: IconRenderer;
  getAnchorOffset?: (node: Konva.Node) => { x: number; y: number };
};

export const supportedIcons: Record<string, IconMeta> = {
  emoji: {
    render: (element, props) =>
      React.createElement(Text, {
        id: element.id,
        x: element.x,
        y: element.y,
        text: element.emoji ?? '⭐',
        fontSize: element.width ?? 48,
        fontFamily: 'Apple Color Emoji, Segoe UI Emoji, sans-serif',
        fill: props.fillColor ?? '#000',
        draggable: true,
        name: 'Icon',
        ...props
      }),
    getAnchorOffset: (node) => {
      const textNode = node as Konva.Text;
      return {
        x: textNode.width() / 2,
        y: textNode.height() / 2
      };
    }
  }
};
