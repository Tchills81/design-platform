import { ReactNode, RefObject, useEffect } from 'react';
import { SidebarTab } from '../types/Tab';
import { TEMPLATE_PRESETS } from '../enumarations/TemplateGeometry';
import { TemplatePanelContent } from './TemplatePanelContent';
import { PanelContainer } from './PanelContainer';
import { DualTemplate } from '../types/template';
import { tone } from '../types/tone';
import { useTabContext } from '../canvas/hooks/TabContext';
import { ElementPanelContent } from './ElementPanel';
import { GenerateImagePanel } from './elements/renderGenerateImage';

type SidebarPanelProps = {
    tone: string;
    PANEL_WIDTH: number;
    onClose?: () => void;
    handleTemplateSelect: (tpl?: DualTemplate) => void;
    resetDesign: () => void;
    PanelRef: RefObject<HTMLDivElement | null>;

  };
  

  export function SidebarPanel({
    tone,
    PANEL_WIDTH,
    handleTemplateSelect,
    resetDesign,
    onClose,
    PanelRef
  }: SidebarPanelProps) {
    const [tab] = useTabContext();
  
  useEffect(() => {
    console.log('SidebarPanel mounted with tab:', tab);
  }, [tab]);

  const renderContent = (): ReactNode => {
    if (!tab) {
      return (
        <div className="text-sm text-gray-500 italic">
          No active tab. Panel is visible but tab state is missing.
        </div>
      );
    }

    switch (tab) {

      case 'templates':
        return (
          <PanelContainer tone="primary" PanelRef={PanelRef}>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Featured Layouts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEMPLATE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={preset.onSelect}
                    className="p-3 rounded-md bg-sky-50 hover:bg-sky-100 border border-sky-200 text-left"
                  >
                    <strong className="text-sm text-sky-800">{preset.name}</strong>
                    <p className="text-xs text-sky-600">{preset.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <TemplatePanelContent
              onSelect={(template: DualTemplate) => {
                resetDesign();
                handleTemplateSelect(template);
              }}
              setDualFaces={(doc) => {
                console.log(doc);
              }}
            />
          </PanelContainer>
        );


        case 'elements':
  return (
    <>

    <GenerateImagePanel onGenerate={()=>{}}/>
    <div className="px-3 pt-4">
  <h2 className="text-base font-semibold text-foreground mb-2">Browse Categories</h2>
</div>
    <PanelContainer tone={'primary'} PanelRef={PanelRef}>
      <ElementPanelContent
        tone={'primary'}
        
      />
    </PanelContainer></>
  );

      case 'text':
      case 'images':
      case 'uploads':
      case 'tools':
        return (
          <PanelContainer tone={tone as tone} PanelRef={PanelRef}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} presets and layout suggestions will go here.
          </PanelContainer>
        );

      default:
        return (
          <div className="text-sm text-red-500 italic">
            Unknown tab: {tab}. Unable to render panel content.
          </div>
        );
    }
  };

  return (
    <div
      style={{
        width: PANEL_WIDTH,
        height: '100%',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        padding: '1rem',
        boxShadow: '0 0 6px rgba(0,0,0,0.05)',
        animation: 'fadeInRight 0.3s ease-out',
        position: 'relative',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: tone === 'dark' ? '#f8fafc' : '#334155'
          }}
          aria-label="Close panel"
        >
          ×
        </button>
      )}

      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 600,
          color: '#334155',
          marginBottom: '1rem'
        }}
      >
        {tab ? tab.charAt(0).toUpperCase() + tab.slice(1) : 'Panel'}
      </h3>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {renderContent()}
      </div>
    </div>
  );
}
