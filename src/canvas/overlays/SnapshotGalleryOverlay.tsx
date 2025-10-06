
import { SnapshotGallery } from '@/src/components/SnapshotGallery';
import { ToneButton } from '@/src/components/ToneButton';
import { Save, CreditCard, LayoutIcon, EyeOff, XIcon } from 'lucide-react';
import { DualTemplate } from '@/src/types/template';
import { CanvasMode } from '@/src/types/CanvasMode';

export interface SnapshotGalleryOverlayProps {
    snapshots: { front: string | null; back: string | null };
    showGallery: boolean;
    template: DualTemplate;
    card: {
      width: number;
      height: number;
    };
    viewMode: 'default' | 'spread';
    designInside: boolean;
    mode: CanvasMode;
    designComplete?:boolean;
    handleSaveToArchive: (mode?: CanvasMode) => void;
    handleRenderBlankTemplate: () => void;
    showCompleteDesign: () => void;
    setDesignComplete: React.Dispatch<React.SetStateAction<boolean>>;
    setDesignInside: React.Dispatch<React.SetStateAction<boolean>>;
    showDesignView: (bool:boolean) => void;
    setInsideMessage: (msg: string) => void;
    setViewMode: (mode: 'default' | 'spread') => void;
    handleSaveCard: () => void;
    handlePrint: () => void;
    setShowExportModal: (show: boolean) => void;
  }


export default function SnapshotGalleryOverlay({
  snapshots,
  showGallery,
  template,
  card,
  viewMode,
  designInside,
  designComplete,
  mode,
  handleSaveToArchive,
  handleRenderBlankTemplate,
  showCompleteDesign,
  setDesignComplete,
  setDesignInside,
  showDesignView,
  setInsideMessage,
  setViewMode,
  handleSaveCard,
  handlePrint,
  setShowExportModal
}: SnapshotGalleryOverlayProps) {
  if (!snapshots.front || !snapshots.back || !showGallery) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto p-8">
      <SnapshotGallery
        snapshots={snapshots}
        tone={template.tone as 'warm' | 'reflective' | 'minimal' | 'neutral'}
        card={card}
        viewMode={viewMode}
        setInsideMessage={setInsideMessage}
      />

      <div className="absolute top-4 right-4 z-60 flex gap-3 bg-white/90 px-3 py-2 rounded-lg shadow-md">
        {mode === 'insideFace' && (
          <div className="mt-6 text-center">
            {designInside ? (
              <button
                onClick={() => {
                  handleSaveToArchive('insideFace');
                  setDesignComplete(true);
                  setDesignInside(false);
                  showCompleteDesign();
                }}
                className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 transition text-sm font-medium"
              >
                🎉 See your complete design →
              </button>
            ) : (
              <button
                onClick={() => {
                  handleSaveToArchive('front');
                  setDesignInside(true);
                  setDesignComplete(false);
                  handleRenderBlankTemplate();
                }}
                className="px-4 py-2 rounded bg-indigo-100 hover:bg-indigo-200 transition text-sm"
              >
                ✨ Click here to design and include inside faces
              </button>
            )}
          </div>
        )}

        <ToneButton
          label={viewMode === 'spread' ? 'View as Preview' : 'View as Spread'}
          icon={viewMode === 'spread' ? <EyeOff size={18} /> : <LayoutIcon size={18} />}
          tone={template.tone}
          isActive={false}
          fontSize="text-sm"
          onClick={() => setViewMode(viewMode === 'spread' ? 'default' : 'spread')}
        />

        <ToneButton icon={<Save size={18} />} label="Save" tone={template.tone} onClick={handleSaveCard} />
        <ToneButton icon={<CreditCard size={18} />} label="Save to Archive" tone={template.tone} onClick={handleSaveToArchive} />
        <ToneButton icon={<Save size={18} />} label="Print" tone={template.tone} onClick={handlePrint} />
        <ToneButton icon={<Save size={18} />} label="Export" tone={template.tone} onClick={() => setShowExportModal(true)} />
        <ToneButton icon={<XIcon size={18} />} label="Exit" tone={template.tone} onClick={()=>{showDesignView(true)}} />
      </div>
    </div>
  );
}
  