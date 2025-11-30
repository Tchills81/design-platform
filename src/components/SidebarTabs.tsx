
import { Dispatch, RefObject, SetStateAction } from 'react';
import { SidebarTab, tabs } from '../types/Tab';

import { useTabContext } from '../canvas/hooks/TabContext';

import { has } from 'lodash';

type SidebarTabsProps = {
  recenterCanvas: () => void;
  PANEL_WIDTH: number;
  SIDEBAR_WIDTH: number;
  hasInitializedZoom: RefObject<boolean>;
  SidebarTabsRef: RefObject<HTMLDivElement | null>;
  setStagePosition: (pos: {x: number; y: number;} ) => void;

  setStageStyle: (style: React.CSSProperties) => void
  tone: string;
};


export function SidebarTabs({
  SidebarTabsRef, 
  SIDEBAR_WIDTH, 
  PANEL_WIDTH, 
  hasInitializedZoom, 
  setStageStyle, 
  recenterCanvas, 
  setStagePosition,
  tone 
}: SidebarTabsProps)
 {
  const [activeTab, setActiveTab] = useTabContext();

  return (
    <div ref={SidebarTabsRef} id='side-bar-tabs'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 60,
        height: '100%',
        background: '#f8fafc',
        borderRight: '1px solid #e2e8f0',
        paddingTop: '0.75rem',      // ✅ top padding
        paddingLeft: '0.5rem',      // ✅ left padding
        paddingRight: '0.55rem',
        paddingBottom: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        boxSizing: 'border-box'
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => {
            const nextTab = tab.id === activeTab ? null : tab.id;

            
            
          
            const nextLeft = nextTab ? PANEL_WIDTH+SIDEBAR_WIDTH : 0;


            if(nextTab){
                setStageStyle({ backgroundColor: '#1e1e1e', position: 'absolute' });
                setStagePosition({x:PANEL_WIDTH+SIDEBAR_WIDTH, y:0})
                recenterCanvas();
                setActiveTab(nextTab);
                hasInitializedZoom.current=false;
            }else{
                 setActiveTab(null)
                hasInitializedZoom.current=false;
            }
            
          }}
          
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 60,
            borderRadius: 8,
            background: tab.id === activeTab ? '#e0f2fe' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: tab.id === activeTab ? '#0284c7' : '#334155',
            transition: 'background 0.2s ease'
          }}
        >
          {tab.icon}
          <span style={{ fontSize: '0.7rem', marginTop: 2 }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
