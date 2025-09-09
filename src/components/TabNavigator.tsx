import { useState } from 'react';
import TemplateGallery from './TemplateGallery';
import SavedDesignGallery from './SavedDesignGallery';
import SnapshotArchiveGallery from './SnapshotArchiveGallery';
import { type DualTemplate } from '../types/template';
import { type SnapshotEntry } from '../types/SnapshotEntry';
import { ToneButton } from './ToneButton';
import { Brush, Save, Archive } from 'lucide-react';
import { type Tab } from '../types/Tab';
import { motion, AnimatePresence } from 'framer-motion';

interface TabNavigatorProps {
  userId: string;
  onSelect: (tpl: DualTemplate) => void;
  snapshotArchive: SnapshotEntry[];
  setSnapshotArchive: React.Dispatch<React.SetStateAction<SnapshotEntry[]>>;
}

export default function TabNavigator({
  userId,
  onSelect,
  snapshotArchive,
  setSnapshotArchive
}: TabNavigatorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('templates');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6">
      {/* Ceremonial Frame */}
      <div className="bg-whisper rounded-2xl shadow-soft px-6 sm:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-serif text-ceremonial tracking-wide mb-2">
            🪄 Design Sanctuary
          </h1>
          <p className="text-base sm:text-lg text-muted font-inter">
            Where every design is a legacy
          </p>
          <div className="w-12 h-1 mx-auto bg-ceremonial rounded-full mt-4 animate-pulse" />
        </header>

        {/* Tab Bar */}
        <nav className="flex flex-wrap justify-center gap-4 mb-4 border-b border-neutral pb-3">
          <ToneButton
            tone={activeTab === 'templates' ? 'primary' : 'neutral'}
            icon={<Brush size={20} />}
            label="Templates"
            onClick={() => setActiveTab('templates')}
            isActive={activeTab === 'templates'}
            fontSize="text-lg"
          />
          <ToneButton
            tone={activeTab === 'saved' ? 'accent' : 'neutral'}
            icon={<Save size={20} />}
            label="My Designs"
            onClick={() => setActiveTab('saved')}
            isActive={activeTab === 'saved'}
            fontSize="text-lg"
          />
          <ToneButton
            tone={activeTab === 'archive' ? 'ceremonial' : 'neutral'}
            icon={<Archive size={20} />}
            label="Archive"
            onClick={() => setActiveTab('archive')}
            isActive={activeTab === 'archive'}
            fontSize="text-lg"
          />
        </nav>

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
            {activeTab === 'templates' && <TemplateGallery onSelect={onSelect} />}
            {activeTab === 'saved' && <SavedDesignGallery userId={userId} onSelect={onSelect} />}
            {activeTab === 'archive' && (
              <>
                <h3 className="text-lg font-serif text-ceremonial mb-4">📸 Snapshot Archive</h3>
                <SnapshotArchiveGallery archive={snapshotArchive} onRestore={onSelect} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
