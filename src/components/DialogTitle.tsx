// components/ui/DialogTitle.tsx
import React from 'react';

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold mb-2">{children}</h2>;
}
