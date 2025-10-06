import React, { useState } from 'react';
import { DialogTitle } from '../components/DialogTitle';
import { DialogContent } from '../components/DialogContent';
import { DialogActions } from '../components/DialogActions';
import { Dialog } from '../components/Dialog';
import { Copy, Send, Lock, Unlock } from 'lucide-react';

type AccessLevel = 'view' | 'comment' | 'edit';

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
  const designId = 'your-design-id'; // Replace 'your-design-id' with the actual design ID
  const userId = 'your-user-id'; // Replace 'your-user-id' with the actual user ID


  async function handleInvite(email: string) {
    await fetch('/api/shareDesign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        designId,
        userId,
        accessLevel,
        invitedEmail: email
      })
    });
  }
  
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>🔗 Share Your Ceremony</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Access Level</label>
          <div className="flex gap-2">
            <button onClick={() => onAccessChange('view')} className={accessLevel === 'view' ? 'selected' : ''}>
              <Lock size={16} /> View
            </button>
            <button onClick={() => onAccessChange('comment')} className={accessLevel === 'comment' ? 'selected' : ''}>
              💬 Comment
            </button>
            <button onClick={() => onAccessChange('edit')} className={accessLevel === 'edit' ? 'selected' : ''}>
              <Unlock size={16} /> Edit
            </button>
          </div>

          <label className="text-sm font-medium">Invite by Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="input"
            />
            <button onClick={() => onInvite(email)}><Send size={16} /></button>
          </div>

          <label className="text-sm font-medium">Shareable Link</label>
          <div className="flex gap-2 items-center">
            <input type="text" value={shareLink} readOnly className="input" />
            <button onClick={() => navigator.clipboard.writeText(shareLink)}><Copy size={16} /></button>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <button onClick={onClose}>Close</button>
      </DialogActions>
    </Dialog>
  );
}
