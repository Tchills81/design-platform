'use client';

import React, { ReactNode, useState, ReactElement } from 'react';
import { tone } from '@/src/types/tone';

interface SidebarSectionProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

interface SidebarModuleProps {
  tone: tone;
  children: ReactElement<SidebarSectionProps> | ReactElement<SidebarSectionProps>[];
}

export default function SidebarModule({ tone, children }: SidebarModuleProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const label = child.props.label;

    const toggleSection = () => {
      setOpenSection((prev) => (prev === label ? null : label));
    };

    return React.cloneElement(child, {
      isOpen: label === openSection,
      onToggle: toggleSection,
    });
  });

  return (
    <aside className="absolute left-10 top-20 z-20 bg-white shadow-lg 
                     rounded-xl w-64 max-h-[calc(100vh-5rem)] overflow-y-auto p-4 flex flex-col gap-6">
      <div className="text-xs uppercase tracking-wide text-muted">{tone} Mode</div>
      {enhancedChildren}
    </aside>
  );
}
