// components/ui/DialogActions.tsx
import React from 'react';

export function DialogActions({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-end gap-2">{children}</div>;
}
