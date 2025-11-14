import { Text, Image, Upload, Layers, LayoutTemplate, AnvilIcon } from 'lucide-react';
import { JSX } from 'react';


export type Tab = 'templates' | 'saved' | 'archive' | 'guided'| 'import'| null;

export type SidebarTab = 'text' | 'images' | 'uploads' | 'elements' | 'templates' |'tools' | null;

export const tabs: { id: SidebarTab; icon: JSX.Element; label: string }[] = [
    { id: 'templates', icon: <LayoutTemplate size={18} />, label: 'Templates' },
    { id: 'elements', icon: <Layers size={24} />, label: 'Elements' },
    { id: 'text', icon: <Text size={24} />, label: 'Text' },
    { id: 'images', icon: <Image size={24} />, label: 'Images' },
    { id: 'uploads', icon: <Upload size={24} />, label: 'Uploads' },
    
    { id: 'tools', icon: <LayoutTemplate size={18} />, label: 'Tools' },
   
  ];