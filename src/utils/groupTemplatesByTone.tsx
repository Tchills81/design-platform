import React from 'react';
import { tone } from '../types/tone';

import { TemplateDocument } from '../types/template';
import { toneColorMap } from '../types/tone';

import TemplateTile from '../components/templateTitle';

export function groupTemplatesByTone(templates: TemplateDocument[]) {
  const groups: Record<tone, TemplateDocument[]> = {
    festive: [],
    neutral: [],
    primary: [],
    accent: [],
    ceremonial: [],
    reflective: [],
    elegant: [],
    minimal: []
  };

  for (const tpl of templates) {
    const key = tpl.tone as tone;
    if (groups[key]) {
      groups[key].push(tpl);
    }
  }

  return groups;
}



interface TemplateGroupProps {
  tone: string;
  templates: TemplateDocument[];
  onSelect: (template: TemplateDocument) => void;
}

export function TemplateGroup({ tone, templates, onSelect }: TemplateGroupProps) {
  return (
    <section className="mb-12">
      <h2 className={`text-2xl font-serif mb-2 ${toneColorMap[tone]}`}>
        {tone.charAt(0).toUpperCase() + tone.slice(1)} Templates
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <TemplateTile key={tpl.id} template={tpl} onClick={() => onSelect(tpl)} tone={tpl.tone as tone} />
        ))}
      </div>
    </section>
  );
}

