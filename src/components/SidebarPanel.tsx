import { ReactNode } from 'react';
import { SidebarTab } from '../types/Tab';
import { TEMPLATE_PRESETS } from '../enumarations/TemplateGeometry';
import { TemplatePanelContent } from './TemplatePanelContent';
import { PanelContainer } from './PanelContainer';
import { DualTemplate } from '../types/template';
import { tone } from '../types/tone';

type SidebarPanelProps = {
  tab: SidebarTab;
  tone: string;
  PANEL_WIDTH: number;
  onClose?: () => void;
  handleTemplateSelect: (tpl?: DualTemplate) => void;
  resetDesign: () => void;
};

export function SidebarPanel({
  tab,
  tone,
  PANEL_WIDTH,
  handleTemplateSelect,
  resetDesign,
  onClose
}: SidebarPanelProps) {
  const renderContent = (): ReactNode => {
    switch (tab) {
      case 'templates':
        return (
          <PanelContainer tone='primary'>
            {/* 🎨 Featured Layouts */}
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

            {/* 🧱 Template Content */}
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

      case 'text':
        return <PanelContainer tone={tone as tone}>Text presets, fonts, and tone-aware styles will go here.</PanelContainer>;
      case 'images':
        return <PanelContainer tone={tone as tone}>Image search, tone-aware filters, and previews will go here.</PanelContainer>;
      case 'uploads':
        return <PanelContainer tone={tone as tone}>Uploaded assets and drag-to-canvas logic will go here.</PanelContainer>;
      case 'elements':
        return <PanelContainer tone={tone as tone}>Shapes, icons, and modular components will go here.</PanelContainer>;
      case 'tools':
        return <PanelContainer tone={tone as tone}>Paint, Draw and the like previews and layout suggestions will go here.</PanelContainer>;
      default:
        return null;
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
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </h3>

      {/* ✅ Modular content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
        {renderContent()}
      </div>
    </div>
  );
}
