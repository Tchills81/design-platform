//import { CanvasMetadataProps } from './types/CanvasMetadata.types';
import { DualTemplate } from "@/src/types/template";
import { ArrowLeft, ArrowUpRight, Icon} from 'lucide-react';
import { toneColorMap } from "@/src/types/tone";
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';

export interface CanvasMetadataProps {
    template: DualTemplate | null;
  }



  export default function CanvasMetadata({ template }: CanvasMetadataProps) {
    if (!template) return null;


    const toneClass = toneColorMap[template.tone] ?? 'text-gray-700';
    const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();
  
    return (
      <div className={`absolute bottom-8 left-60 z-40 bg-white/80 backdrop-blur-sm px-4 
                      py-2 rounded-md shadow-md pointer-events-none ${backgroundClass}`}>
        <h3 className={`text-base font-semibold ${toneClass}`}>{template.name + '->'} </h3>
        <p className="text-sm text-gray-600">by {template.author}</p>
        <p className="mt-1 text-xs text-gray-500 italic">
          {template.sizeLabel} ({template.width}×{template.height})
        </p>
      </div>
    );
  }
  