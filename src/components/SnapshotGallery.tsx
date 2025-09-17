'use client';
import React from 'react';
import FoldedCardPreview from './FoldedCardPreview';
import { useState } from 'react';
import InsideEditorView from './InsideEditorView';
import InsideEditorModal from './InsideEditorModal';



type ToneType = 'warm' | 'reflective' | 'minimal' | 'neutral' | 'festive' | 'elegant' | 'playful';
type ViewMode = 'default' | 'spread';

interface SnapshotGalleryProps {
  snapshots: {
    front: string | null;
    back: string | null;
  };
  tone?: ToneType;
  card?: {
    width: number | null;
    height: number | null;
  };
  viewMode?: ViewMode;
  setInsideMessage:(msg:string)=>void;
}

const toneBorderClasses: Record<ToneType, string> = {
  warm: 'border-yellow-500',
  reflective: 'border-blue-500',
  minimal: 'border-gray-400',
  neutral: 'border-gray-600',
  festive: 'border-red-500',
  elegant: 'border-indigo-500',
  playful: 'border-orange-500'
};

const toneTextClasses: Record<ToneType, string> = {
  warm: 'text-yellow-700',
  reflective: 'text-blue-600',
  minimal: 'text-gray-500',
  neutral: 'text-gray-700',
  festive: 'text-red-700',
  elegant: 'text-indigo-700',
  playful: 'text-orange-600'
};

const toneBackgrounds: Record<ToneType, string> = {
  warm: 'bg-gradient-to-r from-yellow-50 via-white to-yellow-100',
  reflective: 'bg-gradient-to-r from-blue-50 via-white to-blue-100',
  minimal: 'bg-gradient-to-r from-gray-50 via-white to-gray-100',
  neutral: 'bg-gradient-to-r from-gray-100 via-white to-gray-200',
  festive: 'bg-gradient-to-r from-red-50 via-white to-red-100',
  elegant: 'bg-gradient-to-r from-indigo-50 via-white to-indigo-100',
  playful: 'bg-gradient-to-r from-orange-50 via-white to-orange-100'
};

export const SnapshotGallery: React.FC<SnapshotGalleryProps> = ({
  snapshots,
  tone = 'neutral',
  card,
  viewMode = 'default',
  setInsideMessage
}) => {
  const width = card?.width ?? 320;
  const height = card?.height ?? 220;

  if (!snapshots.front || !snapshots.back) return null;

  const borderClass = toneBorderClasses[tone];
  const textClass = toneTextClasses[tone];
  const backgroundClass = toneBackgrounds[tone];

  const [showInsidePrompt, setShowInsidePrompt] = useState(true);
  const [showInsideEditor, setShowInsideEditor] = useState(false);

  //const [insideMessage, setInsideMessage] = useState<string | null>(null);



  return (
    <section
      role="region"
      aria-label="Snapshot Gallery"
      className={`relative rounded-xl p-6 overflow-hidden ${backgroundClass} transition-all duration-500 font-inter`}
    >
    <div className="mb-6 flex flex-col items-start gap-1">
  <div className="flex items-center gap-2">
    {/* 🎨 Optional Seasonal Icon */}
    {tone === 'festive' && <span className="text-red-500 text-xl">🎄</span>}
    {tone === 'elegant' && <span className="text-indigo-500 text-xl">💎</span>}
    {tone === 'playful' && <span className="text-orange-500 text-xl">🎉</span>}
    {tone === 'reflective' && <span className="text-blue-500 text-xl">🌙</span>}
    {tone === 'warm' && <span className="text-yellow-500 text-xl">☀️</span>}
    {tone === 'minimal' && <span className="text-gray-400 text-xl">🧾</span>}
    {tone === 'neutral' && <span className="text-gray-600 text-xl">📄</span>}

    <h2 className={`text-xl font-semibold ${textClass}`}>
      Your Captured Design
    </h2>
  </div>

  {/* ✨ Ceremonial Subtitle */}
  <p className="text-sm italic text-gray-500">
    A moment of expressive clarity, ready to be received.
  </p>
</div>

      {viewMode === 'spread' ? (
        // 🌟 Ceremonial Spread Mode
        <div className="relative z-10 flex justify-center items-center gap-6">
          {/* ✨ Animated Decorations Layer */}
          <div className="absolute inset-0 pointer-events-none z-0 animate-fadeInSlow">
            <div
              className={`w-full h-full bg-[url('/assets/decorations/sparkle.svg')] bg-center bg-no-repeat opacity-10`}
            />
          </div>

          {/* 🖼️ Angled Snapshots */}
          <div
            className="transform -rotate-2 transition-transform duration-500 hover:rotate-0"
            style={{ width, height }}
          >
            <img
              src={snapshots.front}
              alt="Front Snapshot"
              className="rounded shadow-lg object-contain w-full h-full"
            />
          </div>
          <div
            className="transform rotate-2 transition-transform duration-500 hover:rotate-0"
            style={{ width, height }}
          >
            <img
              src={snapshots.back}
              alt="Back Snapshot"
              className="rounded shadow-lg object-contain w-full h-full"
            />
          </div>
        </div>
      ) : (
        // 🎯 Default Layout: Flip + Snapshot Grid
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
  {/* 🎁 Left Column: Folded Preview + Prompt + Editor */}
  <div className="flex flex-col items-center">
    <FoldedCardPreview
      frontSnapshot={snapshots.front}
      backSnapshot={snapshots.back}
      width={width}
      height={height}
      tone={tone}
      textClass={textClass}
    />

    {/* 🧭 Prompt */}
    {showInsidePrompt && !showInsideEditor && (
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setShowInsidePrompt(false);
            setShowInsideEditor(true);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition text-sm ${textClass}`}
        >
          <svg width="18" height="18" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path d="M12 20h9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Message
        </button>
      </div>
    )}

    {/* 💌 Inside Editor */}
    {showInsideEditor && (
      <div className="w-full mt-6">
        <InsideEditorModal
          tone={tone}
          onClose={() => setShowInsideEditor(false)}
          onSave={(msg) => {
            setInsideMessage(msg);
            setShowInsideEditor(false);
            console.log('💌 Saved message:', msg);
         }}
        />
      </div>
    )}



  </div>

          {/* 🖼️ Snapshot Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Front Face */}
            <div
              className={`relative border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition-all duration-300 ${borderClass}`}
            >
              <div className={`text-xs font-medium mb-2 text-center ${textClass}`}>Front Face</div>
              <img
                src={snapshots.front}
                alt="Front Snapshot"
                style={{ width: `${width}px`, height: `${height}px` }}
                className="rounded mx-auto object-contain"
              />
              <a
                href={snapshots.front}
                download="card-front.png"
                className={`absolute top-4 right-4 text-xs underline ${textClass}`}
              >
                Download
              </a>
            </div>

            {/* Back Face */}
            <div
              className={`relative border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition-all duration-300 ${borderClass}`}
            >
              <div className={`text-xs font-medium mb-2 text-center ${textClass}`}>Back Face</div>
              <img
                src={snapshots.back}
                alt="Back Snapshot"
                style={{ width: `${width}px`, height: `${height}px` }}
                className="rounded mx-auto object-contain"
              />
              <a
                href={snapshots.back}
                download="card-back.png"
                className={`absolute top-4 right-4 text-xs underline ${textClass}`}
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ✨ Caption */}
      {viewMode === 'spread' && (
        <p className="text-center text-sm mt-6 text-gray-600 italic">
          This is the full ceremonial envelope—the outside story.
        </p>
      )}
    </section>





  );
};
