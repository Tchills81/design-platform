import { DualTemplate } from "../types/template";

interface DualFaceTimelineProps {
  dualFace: DualTemplate[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function DualFaceTimeline({
  dualFace,
  activeIndex,
  onSelect
}: DualFaceTimelineProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-2 flex gap-2 justify-center shadow-inner z-50">
      {dualFace.map((face, index) => (
        <button
          key={index}
          className={`w-16 h-24 rounded-md border ${
            index === activeIndex ? "border-black shadow-lg" : "border-neutral-300"
          } overflow-hidden bg-white hover:border-neutral-500 transition`}
          onClick={() => onSelect(index)}
        >
          {/* Placeholder thumbnail */}
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
            {index === 0 ? "Front–Back" : "Inside"}
          </div>
        </button>
      ))}
    </div>
  );
}
