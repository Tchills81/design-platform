// src/components/AddFaceButton.tsx
'use client';

import { Plus } from 'react-feather';
import { ToneButton } from './ToneButton';
import { tone } from '../types/tone';

interface AddFaceButtonProps {
    tone: tone;
    onAddFace: () => void;
    canvasWidth: number;
    canvasHeight: number;
    cardX: number;
    cardY: number;
    cardWidth: number;
  }
  
  export default function AddFaceButton({
    tone,
    onAddFace,
    canvasWidth,
    canvasHeight,
    cardX,
    cardY,
    cardWidth
  }: AddFaceButtonProps) {
    const offset = 30;
  
    const style = {
      position: 'absolute' as const,
      left: (cardX + canvasWidth) / 2 + offset,
      top: cardY + canvasHeight,
      zIndex: 40
    };
  
    return (
      <div className='fade-in'
           style={style}>
        <ToneButton
          icon={<Plus size={18} />}
          label="Add Face ->"
          tone={tone}
          isActive={true}
          onClick={onAddFace}
          title="Add a new face to your design"
        />
      </div>
    );
  }
  