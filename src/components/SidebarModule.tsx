'use client';

import React, { ReactNode, useState, ReactElement, RefObject } from 'react';
import { tone } from '@/src/types/tone';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';

interface SidebarSectionProps {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  
}

interface SidebarModuleProps {
  tone: tone;
  children: ReactElement<SidebarSectionProps> | ReactElement<SidebarSectionProps>[];
  sideBarRef: RefObject<HTMLDivElement | null>
}

export default function SidebarModule({ tone, children, sideBarRef}: SidebarModuleProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();
  

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
    <aside ref={sideBarRef} className={`absolute left-10 top-30 z-30 ${backgroundClass} shadow-lg 
                     rounded-xl w-64 max-h-[calc(100vh-5rem)] overflow-y-auto p-4 flex flex-col gap-6`}>
      <div className="text-xs uppercase tracking-wide text-muted">{tone} Mode</div>
      {enhancedChildren}
    </aside>
  );
}
