export function DesignModeLabel({ faceMode = '', mode = '' }: { faceMode?: string; mode?: string }) {
    let label = 'Design Mode';
  
    if (mode === 'card') {
      switch (faceMode) {
        case 'front':
          label = 'Designing Front Face';
          break;
        case 'back':
          label = 'Designing Back Face';
          break;
        case 'insideFront':
          label = 'Designing Inside Front';
          break;
        case 'insideBack':
          label = 'Designing Inside Back';
          break;
          case 'painting':
            label = 'Painting Mode';
            break;
        default:
          label = 'Designing Card';
      }
    } else if (mode === 'gallery') {
      label = 'Gallery View';
    } else if (mode === 'preview') {
      label = 'Preview Mode';
    }

    else if (mode === 'painting') {
        label = 'Painting Mode';
      }
  
      return (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 mt-4 
                px-4 py-2 rounded-md shadow-soft 
                font-inter text-xl italic font-semibold text-gray-700 
                opacity-30 bg-white/90 backdrop-blur-sm z-30">
            {label}
        </div>

      );
      
      
  }
  