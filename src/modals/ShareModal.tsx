import React, { useState } from 'react';
import { Dialog } from '../components/Dialog';
import { DialogTitle } from '../components/DialogTitle';
import { DialogContent } from '../components/DialogContent';
import { DialogActions } from '../components/DialogActions';
import { Copy, Send, Lock, Unlock } from 'lucide-react';
import { AccessLevel } from '../types/access';



interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: string;
  onAccessChange: (level: AccessLevel) => void;
  accessLevel: AccessLevel;
  onInvite: (email: string) => void;
}

export default function ShareModal({
  isOpen,
  onClose,
  shareLink,
  accessLevel,
  onAccessChange,
  onInvite
}: ShareModalProps) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        <div className="flex items-center gap-2 text-blue-600 text-lg font-semibold">
          📤 Share Your Design Ceremony
        </div>
      </DialogTitle>

      <DialogContent>
        <div className="flex flex-col gap-5 animate-fade-in rounded-lg p-1">
          {/* Access Level */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Access Level</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 'view', icon: <Lock size={16} />, label: 'View' },
                { level: 'comment', icon: '💬', label: 'Comment' },
                { level: 'edit', icon: <Unlock size={16} />, label: 'Edit' }
              ].map(({ level, icon, label }) => (
                <button
                  key={level}
                  onClick={() => onAccessChange(level as AccessLevel)}
                  className={`px-3 py-2 rounded text-sm border transition-all flex items-center justify-center gap-1 ${
                    accessLevel === level
                      ? 'bg-blue-100 border-blue-500 text-blue-700 font-semibold'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-blue-300'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Invite by Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Invite by Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={() => onInvite(email)}
                className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Shareable Link */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Shareable Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="w-full rounded border border-gray-300 p-2 text-sm bg-gray-50"
              />
              <button
                onClick={handleCopy}
                className={`px-3 py-2 rounded text-sm font-medium transition ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? 'Copied!' : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}
