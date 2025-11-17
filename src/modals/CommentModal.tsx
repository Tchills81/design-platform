import React, { useState } from 'react';
import { Dialog } from '../components/Dialog';
import { DialogTitle } from '../components/DialogTitle';
import { DialogContent } from '../components/DialogContent';
import { DialogActions } from '../components/DialogActions';
import { DualTemplate } from '../types/template';
import { useSelectedElement } from '../components/elements/useSelectedElement';
import { getGlyphForRole } from '../components/elements/getGlyphForRole';
import { useElementTone } from '../components/elements/useElementTone';

interface CommentModalProps {
  isOpen: boolean;
  designId: string;
  elementId: string | null;
  selectedTextId?: string | null;
  template: DualTemplate | null;
  side: 'front' | 'back';
  createdBy: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function CommentModal({
  isOpen,
  designId,
  elementId,
  createdBy,
  selectedTextId,
  side,
  template,
  onClose,
  onSubmitSuccess
}: CommentModalProps) {
  const {
    selectedElement,
    isText,
    isShape,
    isFrame,
    role,
    shapeType,
    type
  } = useSelectedElement({ selectedImageId: elementId, selectedTextId, template, side });

  const glyph = getGlyphForRole(role);
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'celebration' | 'concern' | 'suggestion' | 'question'>('suggestion');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { color, highlight, textColor, border } = useElementTone({ role, tone, shapeType });

  async function handleSubmit() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/addReflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId, elementId, message, tone, createdBy })
      });

      if (!res.ok) throw new Error('Failed to submit reflection');

      setMessage('');
      setTone('suggestion');
      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error('🚨 Reflection submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        <div
          className="flex items-center gap-2 text-lg font-semibold px-2 py-1 rounded"
          style={{
            color,
            borderColor: color,
            borderStyle: border,
            borderWidth: '1px'
          }}
        >
          {glyph} Reflecting on{' '}
          <span className="italic text-gray-700">
            {isText && 'Text'}
            {isFrame && 'Frame'}
            {isShape && !isFrame && shapeType}
            {type === 'image' && 'Image'}
            {role && ` (${role})`}
          </span>
        </div>
      </DialogTitle>

      <DialogContent>
        <div
          className="flex flex-col gap-4 animate-fade-in rounded-lg p-1"
          style={{
            backgroundColor: highlight,
            color: textColor
          }}
        >
          <div>
            <label className="text-sm font-medium mb-1 block" style={{ color: textColor }}>
              Tone
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'celebration', label: '🎉 Celebration' },
                { value: 'suggestion', label: '🛠 Suggestion' },
                { value: 'concern', label: '⚠️ Concern' },
                { value: 'question', label: '❓ Question' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setTone(option.value as any)}
                  className={`px-3 py-2 rounded text-sm border transition-all ${
                    tone === option.value
                      ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {selectedElement && (
            <p className="text-sm italic mb-2" style={{ color: textColor }}>
              What does this {role} express? How might it evolve?
            </p>
          )}

          <div>
            <label className="text-sm font-medium mb-1 block" style={{ color: textColor }}>
              Message
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Share your thoughts with clarity and care..."
              className="w-full rounded border border-gray-300 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 h-28"
              style={{ color: '#111827', backgroundColor: '#fff' }}
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
      </DialogContent>

      <DialogActions>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 px-4 py-2 rounded hover:bg-gray-100 transition"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded text-sm font-medium transition ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Reflection'}
        </button>
      </DialogActions>
    </Dialog>
  );
}
