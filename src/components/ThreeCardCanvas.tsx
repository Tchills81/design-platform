import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CardModel from './CardModel';
import { GroupedSnapshot } from '../utils/groupSnapshotsByTemplate';

interface Props {
  images: GroupedSnapshot;
}

export default function ThreeCardCanvas({ images }: Props) {
  //const width = images.front?.width || 1;
  //const height = images.front?.height || 1;

  const canvasWidth = (images.front?.width || 1) * 2 + 200;
  const canvasHeight = (images.front?.height || 1) + 200;

  // Calculate a comfortable distance based on card size
  const maxDimension = Math.max(canvasWidth, canvasHeight);
  const cameraZ = maxDimension * 1.5; // adjust multiplier for tighter/looser framing



  return (
    <div style={{ width: canvasWidth, height: canvasHeight }}>
      <Canvas camera={{ position: [0, 0, cameraZ], fov: 50 }}>
        {/* scene */}

        <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <CardModel images={images} />
      <OrbitControls />
      </Canvas>
    </div>
  );

}
