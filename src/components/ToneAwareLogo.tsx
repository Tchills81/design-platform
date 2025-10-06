// src/components/ToneAwareLogo.tsx
'use client';
import Image from 'next/image';
import { useSeasonalTone } from '../themes/useSeasonalTone';

export default function ToneAwareLogo({ size = 64 }) {
  const { logo } = useSeasonalTone();

  return (
    <Image src={logo} alt="GiftCraft Logo" width={size} height={size} priority />
  );
}
