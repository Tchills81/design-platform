// ui/fontList.ts

export type FontOption = {
    name: string;
    family: string;
    category: 'sans-serif' | 'serif' | 'monospace' | 'display';
  };
  
  export const systemFonts: FontOption[] = [
    { name: 'Arial', family: 'Arial', category: 'sans-serif' },
    { name: 'Verdana', family: 'Verdana', category: 'sans-serif' },
    { name: 'Tahoma', family: 'Tahoma', category: 'sans-serif' },
    { name: 'Trebuchet MS', family: 'Trebuchet MS', category: 'sans-serif' },
    { name: 'Georgia', family: 'Georgia', category: 'serif' },
    { name: 'Times New Roman', family: 'Times New Roman', category: 'serif' },
    { name: 'Courier New', family: 'Courier New', category: 'monospace' },
    { name: 'Impact', family: 'Impact', category: 'display' },
    { name: 'Comic Sans MS', family: 'Comic Sans MS', category: 'display' }
  ];
  