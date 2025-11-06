'use client';

import React, { ReactNode } from 'react';

interface SidebarSectionProps {
  label: string;
  isOpen?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}

export default function SidebarSection({
  label,
  isOpen = false,
  onToggle,
  children,
}: SidebarSectionProps) {
  return (
    <section className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-3 w-56">
      <button
        type="button"
        onClick={onToggle}
        className="flex justify-between items-center w-full text-sm font-light mb-2 cursor-pointer"
        aria-expanded={isOpen}
        aria-controls={`section-${label}`}
      >
        <span>{label}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>

      {isOpen && (
        <div id={`section-${label}`} className="flex flex-col gap-2">
          {children}
        </div>
      )}
    </section>
  );
}
