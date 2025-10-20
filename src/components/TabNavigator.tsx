import { useState, useEffect } from 'react';
import TemplateGallery from './TemplateGallery';
import SavedDesignGallery from './SavedDesignGallery';
import SnapshotArchiveGallery from './SnapshotArchiveGallery';
import { TemplateDocument, type DualTemplate } from '../types/template';
import { type SnapshotEntry } from '../types/SnapshotEntry';
import { Brush, Save, Archive, Brain, Package } from 'lucide-react';
import { type Tab } from '../types/Tab';
import { motion, AnimatePresence } from 'framer-motion';
import { groupSnapshotsByTemplate } from '../utils/groupSnapshotsByTemplate';
import Tile from './Tile';
import ImportFlow from './ImportFlow';
import { AddImageButton } from './AddImageButton';
import TemplateGalleryV2 from './TemplateGallery-v1';


interface TabNavigatorProps {
  userId: string;
  onSelect: (tpl: DualTemplate) => void;
  snapshotArchive: SnapshotEntry[];
  setDualFaces:(dualFaces:DualTemplate[])=>void;
  //setTemplateDocuments:(docs:TemplateDocument[])=>void;
  setSnapshotArchive: React.Dispatch<React.SetStateAction<SnapshotEntry[]>>;
  showDesigns?: boolean;
}

export default function TabNavigator({
  userId,
  onSelect,
  snapshotArchive,
  setSnapshotArchive,
  setDualFaces,
 
  showDesigns,
}: TabNavigatorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('templates');
  const [importedAsset, setImportedAsset] = useState<{
    src: string;
    role: 'background' | 'element';
  } | null>(null);
  

  const grouped = groupSnapshotsByTemplate(snapshotArchive);
  if (grouped) console.log('grouped....', grouped);

  useEffect(() => {
    if (showDesigns) setActiveTab('archive');
  }, [showDesigns]);

  const tiles = [
    {
      icon: <Brush size={24} />,
      title: 'Templates',
      tab: 'templates',
      tooltip: 'Start fresh with tone-aware layouts',
    },
    {
      icon: <Save size={24} />,
      title: 'My Designs',
      tab: 'saved',
      tooltip: 'Resume or refine your saved creations',
    },
    {
      icon: <Archive size={24} />,
      title: 'Archive',
      tab: 'archive',
      tooltip: 'Celebrate completed designs and restore with ceremony',
    },
    {
      icon: <Package size={24} />,
      title: 'Import',
      tab: 'import',
      tooltip: 'Upload external designs or snapshots',
    },
    {
      icon: <Brain size={24} />,
      title: 'Guided Mode',
      tab: 'guided',
      tooltip: 'Let the system guide your design journey',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6">
      <div className="bg-whisper rounded-2xl shadow-soft px-6 sm:px-8 py-8">
        {/* Hero */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-serif text-ceremonial tracking-wide">
            🪄 Welcome to Your Design Sanctuary
          </h1>
          <p className="text-lg text-muted font-inter mt-2">
            Every design is a legacy. Every click, a ceremony.
          </p>
          <div className="w-12 h-1 mx-auto bg-ceremonial rounded-full mt-4 animate-pulse" />
        </header>

        {/* Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {tiles.map(({ icon, title, tab, tooltip }) => (
            <Tile
              key={tab}
              icon={icon}
              title={title}
              description={tooltip}
              onClick={() => setActiveTab(tab as Tab)}
              isActive={activeTab === tab}
            />
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-xl p-6 shadow-soft"
          >
            {activeTab === 'templates' && 
            <TemplateGalleryV2 
              onSelect={onSelect}  
              importedAsset={importedAsset ?? undefined}
              setDualFaces={setDualFaces}
              />}
              
            {activeTab === 'saved' && <SavedDesignGallery 
                                        userId={userId} 
                                        onSelect={onSelect} 
                                        setDualFaces={setDualFaces}
                                        />}
            {activeTab === 'archive' && (
              <>
                <h3 className="text-lg font-serif text-ceremonial mb-4">
                  📸 Your All In One Complete Design
                </h3>
                <SnapshotArchiveGallery archive={snapshotArchive} onRestore={onSelect} />
              </>
            )}
           {activeTab === 'import' && (
  <div className="text-center">
    <h2 className="text-2xl font-serif text-ceremonial mb-2">📦 Import Your Design Asset</h2>
    <p className="text-muted font-inter mb-6">
      Welcome your image into the sanctuary. Choose its role in your story.
    </p>

    <AddImageButton
      tone="ceremonial"
      onUpload={(src, role) => setImportedAsset({ src, role })}
    />

    {importedAsset && (
      <div className="mt-6">
        <p className="text-muted font-inter mb-2">
          Your image is ready. Let’s choose a template to begin your design journey.
        </p>
        <button
          onClick={() => setActiveTab('templates')}
          className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition"
        >
          Select Template
        </button>
      </div>
    )}
  </div>
)}


            {activeTab === 'guided' && (
              <div className="text-center text-muted font-inter">
                🧠 Guided Mode launching soon — a step-by-step journey through tone, layout, and decoration.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
