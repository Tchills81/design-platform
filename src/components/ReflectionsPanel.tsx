import React from 'react';
import { MessageCircle, Check, X } from 'lucide-react';

type ToneTag = 'celebration' | 'concern' | 'suggestion' | 'question';

interface Reflection {
  id: string;
  elementId: string;
  message: string;
  tone: ToneTag;
  resolved: boolean;
}

interface ReflectionsPanelProps {
  reflections: Reflection[];
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ReflectionsPanel({ reflections, onResolve, onDelete }: ReflectionsPanelProps) {
  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg p-4 overflow-y-auto z-50">
      <h2 className="text-lg font-semibold mb-4">💬 Reflections</h2>
      {reflections.map((r) => (
        <div key={r.id} className="border-b py-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{r.tone}</span>
            <div className="flex gap-2">
              {!r.resolved && <button onClick={() => onResolve(r.id)}><Check size={16} /></button>}
              <button onClick={() => onDelete(r.id)}><X size={16} /></button>
            </div>
          </div>
          <p className="text-sm mt-1">{r.message}</p>
        </div>
      ))}
    </div>
  );
}
