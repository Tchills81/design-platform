import { ReactNode } from 'react';
import { tone, toneBackgroundClasses } from '../types/tone';

type PanelContainerProps = {
  tone: tone;
  children: ReactNode;
};

export function PanelContainer({ tone, children }: PanelContainerProps) {
  const backgroundClass = toneBackgroundClasses[tone] || toneBackgroundClasses['ceremonial'];

  return (
    <div
      className={`sidebar-scroll ${backgroundClass}`}
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '.5rem .5rem',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      {children}
    </div>
  );
}
