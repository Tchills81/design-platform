 export type RegistryKey = {
    tone: string;
    category: string;
    season?: string;
  };
  
 export type ComponentRegistry = {
    [key: string]: () => Promise<{ default: React.ComponentType<any> }>;
  };

  import dynamic from 'next/dynamic';

const registry: ComponentRegistry = {
  'ceremonial|text|spring': () => import('../components/CeremonialTextSpring'),
  'playful|image|summer': () => import('../components/PlayfulImageSummer'),
  'minimal|quote|autumn': () => import('../components/MinimalQuoteAutumn'),
  'ceremonial|background': () => import('../components/CeremonialBackground'),
  // Add more mappings as needed
};

  