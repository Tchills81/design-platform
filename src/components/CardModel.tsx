import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GroupedSnapshot } from '../utils/groupSnapshotsByTemplate';

interface Props {
  images: GroupedSnapshot;
}

export default function CardModel({ images }: Props) {
  // Load textures
  const frontTexture = useLoader(THREE.TextureLoader, images.front?.image || '');
  const insideFrontTexture = useLoader(THREE.TextureLoader, images.insideFront?.image || '');
  const backTexture = useLoader(THREE.TextureLoader, images.back?.image || '');
  const insideBackTexture = useLoader(THREE.TextureLoader, images.insideBack?.image || '');

  // Dimensions
  const width = images.front?.width || 1;
  const height = images.front?.height || 1;

  const foldAngle = Math.PI / 2.2; // ~81° open
  const tiltAngle = Math.PI / 6;   // ~30° forward tilt
  const yOffset = height / 2;
  const xOffset = width / 2 + 0.01; // separate left/right halves

  return (
    <group rotation={[-tiltAngle, 0, 0]}>
  {/* Front + insideFront (left half) */}
  <group position={[-xOffset, yOffset, 0]}>
    <mesh rotation={[0, -foldAngle, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={frontTexture} side={THREE.DoubleSide} />
    </mesh>
    <mesh rotation={[0, foldAngle, 0]} position={[0, 0, 0.01]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={insideFrontTexture} side={THREE.DoubleSide} />
    </mesh>
  </group>

  {/* Back + insideBack (right half) */}
  <group position={[xOffset, yOffset, 0]}>
    <mesh rotation={[0, foldAngle, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={backTexture} side={THREE.DoubleSide} />
    </mesh>
    <mesh rotation={[0, -foldAngle, 0]} position={[0, 0, -0.01]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={insideBackTexture} side={THREE.DoubleSide} />
    </mesh>
  </group>
</group>

  );
}
