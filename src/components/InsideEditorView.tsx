'use client';
import React, { useState } from 'react';
import { Sparkles, Paintbrush, Image, Save } from 'lucide-react';

type ToneType = 'warm' | 'reflective' | 'minimal' | 'neutral' | 'festive' | 'elegant' | 'playful';

interface InsideEditorViewProps {
  tone?: ToneType;
  onSave?: (message: string) => void;
}

const toneTextClasses: Record<ToneType, string> = {
  warm: 'text-yellow-700',
  reflective: 'text-blue-600',
  minimal: 'text-gray-500',
  neutral: 'text-gray-700',
  festive: 'text-red-700',
  elegant: 'text-indigo-700',
  playful: 'text-orange-600'
};

const toneButtonClasses: Record<ToneType, string> = {
  warm: 'bg-yellow-100 hover:bg-yellow-200',
  reflective: 'bg-blue-100 hover:bg-blue-200',
  minimal: 'bg-gray-100 hover:bg-gray-200',
  neutral: 'bg-gray-200 hover:bg-gray-300',
  festive: 'bg-red-100 hover:bg-red-200',
  elegant: 'bg-indigo-100 hover:bg-indigo-200',
  playful: 'bg-orange-100 hover:bg-orange-200'
};

const InsideEditorView: React.FC<InsideEditorViewProps> = ({ tone = 'neutral', onSave }) => {
  const [message, setMessage] = useState('');
  const textClass = toneTextClasses[tone];
  const buttonClass = toneButtonClasses[tone];

  const handleSave = () => {
    if (onSave) onSave(message.trim());
  };

  return (
    <section
      role="dialog"
      aria-label="Inside Message Editor"
      className="p-6 rounded-xl bg-white shadow-xl transition-all duration-300"
    >
      <h3 className={`text-lg font-semibold mb-2 ${textClass}`}>
        This is the heart of the card—the message that matters.
      </h3>

      {/* 📝 Writing Area */}
      <textarea
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full h-40 p-4 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
        aria-label="Message input"
      />

      {/* 🎨 Decoration Options */}
      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 transition"
          aria-label="Add sticker"
        >
          <Sparkles size={18} />
          <span className="text-sm">Add Sticker</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 transition"
          aria-label="Apply gradient"
        >
          <Paintbrush size={18} />
          <span className="text-sm">Apply Gradient</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 transition"
          aria-label="Use motif"
        >
          <Image size={18} />
          <span className="text-sm">Use Motif</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className={`flex items-center gap-2 px-3 py-2 rounded transition ${buttonClass}`}
          aria-label="Save message"
        >
          <Save size={18} />
          <span className="text-sm">Save Message</span>
        </button>
      </div>
    </section>
  );
};

export default InsideEditorView;
