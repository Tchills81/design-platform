// src/canvas/CanvasWrapper.tsx
'use client';

import TabNavigator from '../components/TabNavigator';
import { useCanvasState } from './hooks/useCanvasState';
import { useCanvasActions } from './hooks/useCanvasActions';
import { useRouter } from 'next/navigation';

export default function CanvasWrapper() {

  const router = useRouter();
  const state = useCanvasState();
  const actions = useCanvasActions(state);

  const {
    template,
    snapshotArchive,
    designComplete,
    setSelectedDualTemplate,
    setTemplate,
    setLastSavedTemplate,
    stageSize
    
  } = state;

  const {
    setSnapshotArchive,
    setDualFaces,
    handleTemplateSelect,
    resetDesign
   
  } = actions;

  

  return (
    <div className="fade-in relative pt-20 pl-6">
      <TabNavigator
        userId="chilongatobias@gmail.com"
        snapshotArchive={snapshotArchive}
        setSnapshotArchive={setSnapshotArchive}
        setDualFaces={setDualFaces}
        showDesigns={designComplete}
        onSelect={(tpl)=>{

          console.log('stageSize', stageSize)

         
          resetDesign();

          setSelectedDualTemplate(tpl);

          router.push(`/design-platform?selected=true`);

        }}
        
        
      />
    </div>
  );
}
