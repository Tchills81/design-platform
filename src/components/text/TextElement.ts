export type TextElement = {
  id: string;
  content: string;
  font: string;
  fontSize: number;
  color: string;
  position: {
    x: number;
    y: number;
  };
  isBold?: boolean;
  isItalic?: boolean;
};
