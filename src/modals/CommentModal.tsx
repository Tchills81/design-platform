import React, { useState } from 'react';
import { Dialog } from '../components/Dialog';
import { DialogTitle } from '../components/DialogTitle';
import { DialogContent } from '../components/DialogContent';
import { DialogActions } from '../components/DialogActions';

interface CommentModalProps {
  isOpen: boolean;
  designId: string;
  elementId?: string | null;
  createdBy: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export default function CommentModal({
  isOpen,
  designId,
  elementId,
  createdBy,
  onClose,
  onSubmitSuccess
}: CommentModalProps) {
  const [message, setMessage] = useState('');
  const [tone, setTone] = useState<'celebration' | 'concern' | 'suggestion' | 'question'>('suggestion');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/addReflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId, elementId, message, tone, createdBy })
      });

      if (!res.ok) {
        throw new Error('Failed to submit reflection');
      }

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
      <DialogTitle>💬 Add Reflection</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-3 animate-fade-in rounded-lg">
          <label className="text-sm font-medium">Tone</label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value as any)}
            className="input"
          >
            <option value="celebration">🎉 Celebration</option>
            <option value="suggestion">🛠 Suggestion</option>
            <option value="concern">⚠️ Concern</option>
            <option value="question">❓ Question</option>
          </select>

          <label className="text-sm font-medium">Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Share your thoughts..."
            className="input h-24 resize-none"
          />

          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
      </DialogContent>
      <DialogActions>
        <button onClick={onClose} className="text-sm text-gray-500 px-3 py-1" disabled={loading}>
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className={`px-3 py-1 rounded text-sm ${loading ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </DialogActions>
    </Dialog>
  );
}
