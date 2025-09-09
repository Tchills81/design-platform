interface SnapshotGalleryProps {
    snapshots: {
      front: string | null;
      back: string | null;
      
    };
    tone?: string;
    card?:{width:number | null, height:number | null}
  }
  
  const toneBorderClasses: Record<string, string> = {
    warm: 'border-yellow-500',
    reflective: 'border-blue-500',
    minimal: 'border-gray-400',
    neutral: 'border-gray-600'
  };

  const toneTextClass : Record<string, string> = {
    warm: 'text-yellow-700',
    reflective: 'text-blue-600',
    minimal: 'text-gray-500',
    neutral: 'text-gray-700'
  }
  
  export const SnapshotGallery: React.FC<SnapshotGalleryProps> = ({ snapshots, tone = 'neutral' , card}) => {
    const borderClass = toneBorderClasses[tone];
    const textClass=toneTextClass[tone]
    const width = card?.width
    const height = card?.height

    console.log(width, height)

    if (!snapshots.front && !snapshots.back) return null;
  
    return (

        

<section role="region" aria-label="Snapshot Gallery">
  {/* Header + Gallery */}

  <h2 className={`text-xl font-semibold text-center mb-6 ${textClass}`}>
            Your Captured Design
        </h2>


        <div className="mt-6 grid grid-cols-2 gap-4"
             style={{ animation: 'fadeIn 0.6s ease-out' }}>
        {snapshots.front && (
          <div className={`border rounded shadow-md p-2 bg-white ${borderClass}`}>
            <div className={`text-xs font-medium mb-2 text-center ${textClass}`}>Front Face</div>
            <img src={snapshots.front} alt="Front Snapshot" style={{ width: `${width}px`, height: `${height}px` }}
            className="rounded mx-auto"/>
            <a 
              href={snapshots.front}
              download="card-front.png"
              className={`text-xs underline block text-center mt-2 ${textClass}`}
            >
              Download Front
            </a>
          </div>
        )}
        {snapshots.back && (
          <div className={`border rounded shadow-md p-2 bg-white ${borderClass}`}>
            <div className={`text-xs font-medium mb-2 text-center ${textClass}`}>Back Face</div>
            <img src={snapshots.back} alt="Back Snapshot" 
        
            style={{ width: `${width}px`, height: `${height}px` }}
            className="rounded mx-auto"/>
            <a
              href={snapshots.back}
              download="card-back.png"
              className={`text-xs underline block text-center mt-2" ${textClass}`}
            >
              Download Back
            </a>
          </div>
        )}
      </div>
</section>

       
        
        
  
    );
  };
  