// src/utils/getNodePosition.ts
import Konva from "konva";
export function getNodePosition(node: Konva.Node): { x: number; y: number } {
    const rect = node.getClientRect();
    return {
      x: rect.x + rect.width / 2,
      y: rect.y - 50 // float above the node
    };
  }
  