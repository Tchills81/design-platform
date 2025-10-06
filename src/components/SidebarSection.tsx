'use client';

import React, { ReactNode } from 'react';

interface SidebarSectionProps {
  label: string;
  isOpen?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}

export default function SidebarSection({ label, isOpen = false, onToggle, children }: SidebarSectionProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-3 w-56">
      <div
        className="flex justify-between items-center cursor-pointer text-sm font-semibold mb-2"
        onClick={onToggle}
      >
        <span>{label}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  );
}
