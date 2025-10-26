import { useState, useEffect, useRef } from 'react';
import { Brush, Save, Archive, Brain, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateGalleryV2 from './TemplateGallery-v1';
import SavedDesignGallery from './SavedDesignGallery';
import SnapshotArchiveGallery from './SnapshotArchiveGallery';
import ImportFlow from './ImportFlow';
import { AddImageButton } from './AddImageButton';
import { groupSnapshotsByTemplate } from '../utils/groupSnapshotsByTemplate';
import { type Tab } from '../types/Tab';
import { type SnapshotEntry } from '../types/SnapshotEntry';
import { type DualTemplate } from '../types/template';
import { useSeasonalTone } from '@/src/themes/useSeasonalTone';

interface TabNavigatorProps {
  userId: string;
  onSelect: (tpl: DualTemplate) => void;
  snapshotArchive: SnapshotEntry[];
  setSnapshotArchive: React.Dispatch<React.SetStateAction<SnapshotEntry[]>>;
  setDualFaces: (dualFaces: DualTemplate[]) => void;
  showDesigns?: boolean;
}

export default function TabNavigator({
  userId,
  onSelect,
  snapshotArchive,
  setSnapshotArchive,
  setDualFaces,
  showDesigns
}: TabNavigatorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('templates');
  const [importedAsset, setImportedAsset] = useState<{
    src: string;
    role: 'background' | 'element';
  } | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const { heroText, logo, cta, backgroundClass, nextSeason } = useSeasonalTone();

  useEffect(() => {
    if (showDesigns) setActiveTab('archive');
  }, [showDesigns]);

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeTab]);

  const tabs = [
    { icon: <Brush size={18} />, title: 'Templates', tab: 'templates' },
    { icon: <Save size={18} />, title: 'My Designs', tab: 'saved' },
    { icon: <Archive size={18} />, title: 'Archive', tab: 'archive' },
    { icon: <Package size={18} />, title: 'Import', tab: 'import' },
    { icon: <Brain size={18} />, title: 'Guided', tab: 'guided' }
  ];

  const grouped = groupSnapshotsByTemplate(snapshotArchive);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6">
      <div className={`${backgroundClass} rounded-2xl shadow-soft px-6 sm:px-8 py-8`} >
        {/* Tab Bar */}
        <div className="flex justify-center gap-12 mb-8 overflow-x-auto scrollbar-hide">
  {tabs.map(({ icon, title, tab }) => (
   <button
   key={tab}
   onClick={() => setActiveTab(tab as Tab)}
   className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border-2 ${
     activeTab === tab
       ? 'bg-gradient-to-r from-ceremonial to-accent text-gray border-b-blue-500 shadow-lg hover:from-ceremonial hover:to-accent'
       : 'bg-bottom text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
   }`}
 >
   {icon}
   <span>{title}</span>
 </button>
  ))}
</div>

        {/* Tab Content */}
        <div ref={contentRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-whisper rounded-xl p-6 shadow-soft"
            >
              {activeTab === 'templates' && (
                <TemplateGalleryV2
                  onSelect={onSelect}
                  importedAsset={importedAsset ?? undefined}
                  setDualFaces={setDualFaces}
                />
              )}

              {activeTab === 'saved' && (
                <SavedDesignGallery
                  userId={userId}
                  onSelect={onSelect}
                  setDualFaces={setDualFaces}
                />
              )}

              {activeTab === 'archive' && (
                <>
                  <h3 className="text-lg font-serif text-ceremonial mb-4">
                    📸 Your Completed Designs
                  </h3>
                  <SnapshotArchiveGallery archive={snapshotArchive} onRestore={onSelect} />
                </>
              )}

              {activeTab === 'import' && (
                <div className="text-center">
                  <h2 className="text-xl font-serif text-ceremonial mb-2">📦 Import Design Asset</h2>
                  <p className="text-muted font-inter mb-6">
                    Upload your image and choose its role in your story.
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
      </div>
    </section>
  );
}
