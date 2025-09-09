import { Image as KonvaImageNode } from 'react-konva';

interface KonvaImageProps {
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
}

const  KonvaImage: React.FC<KonvaImageProps> = ({ image, x, y, width, height }) => {
  return (
    <KonvaImageNode
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      listening={false} // optional: disables interaction
      perfectDrawEnabled={false} // optional: performance tweak
    />
  );
};

export default KonvaImage;
