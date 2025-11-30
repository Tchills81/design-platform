import { textRegistry } from './textRegistry';
import { toneIconMap } from '../elements/getGlyphForRole';
import { useElementTone } from '../elements/useElementTone';
import { useInsertElement } from '@/src/canvas/hooks/useInsertElement';
import { AnimatePresence, motion } from 'framer-motion';
import { tone } from '@/src/types/tone';
import { SparkleIcon } from 'lucide-react';

interface TextRoleButtonsProps {
  tone: tone | null;
  
}

export function TextRoleButtons({ tone }: TextRoleButtonsProps) {
  const insert = useInsertElement();

  const roleFontSizes: Record<string, number> = {
    heading: 24,
    subheading: 20,
    quote: 18,
    body: 16,
    caption: 14
  };

  return (




    <div className="flex flex-col gap-3">

<div className="flex flex-col gap-3">
  {/* 🟣 Add Text Box — Default Entry */}
  <motion.button
    key="add-text-box"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    onClick={() => {
      console.log(`Inserting default text box with tone="${tone}"`);
      insert.insertText('Add  A Text Box', {
        role: 'textbox',
        tone,
        toneColor: tone ?? '#000',
        font: 'Inter',
        fonstSize:32,
        shapeType: 'text'
      });
    }}
    className="flex items-center cursor-pointer justify-between px-3 py-2 rounded-lg border transition-all hover:scale-[1.03] active:scale-[0.97]"
    style={{
      backgroundColor: '#fff',
      color: '#000000',
      border: '1px solid #d1d5db',
      boxShadow: '0 0 0 2px #d1d5db33',
      fontFamily: 'Inter',
      fontSize: 16
    }}
  >
    <div className="flex items-center gap-2">
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-center justify-center w-8 h-8 rounded-md bg-white/30 shadow-sm ring-1 ring-inset ring-white/20"
        style={{
          fontSize: 0,
          backdropFilter: 'blur(4px)'
        }}
      >
        <SparkleIcon size={20} strokeWidth={2} className="text-current" />
      </motion.span>

      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="font-medium"
        style={{
          fontFamily: 'Inter',
          fontSize: 16
        }}
      >
        Add Text Box
      </motion.span>
    </div>
    <span className="text-xs italic opacity-70">textbox</span>
  </motion.button>

  {/* 🟠 Role-Based Buttons */}
  {textRegistry.map(({ role, label, defaultText, shapeType }, index) => {
    const Icon = tone && toneIconMap[tone] ? toneIconMap[tone] : SparkleIcon;
    const { color, highlight, textColor, fontFamily } = useElementTone({ role, tone, shapeType });
    const fontSize = roleFontSizes[role] ?? 16;

    return (
      <motion.button
        key={role}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
        onClick={() => {
          console.log(`Inserting text element with role="${role}", tone="${tone}", shapeType="${shapeType}"`);
          insert.insertText(defaultText, {
            role,
            tone,
            toneColor: textColor,
            font: fontFamily,
            shapeType
          });
        }}
        className="flex items-center cursor-pointer justify-between px-3 py-2 rounded-lg border transition-all hover:scale-[1.03] active:scale-[0.97]"
        style={{
          backgroundColor: '#fff',
          color: textColor,
          border: `1px solid ${color}`,
          boxShadow: `0 0 0 2px ${highlight}33`,
          fontFamily: tone ? fontFamily : 'Inter',
          fontSize
        }}
      >
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={tone ?? 'default'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-white/30 shadow-sm ring-1 ring-inset ring-white/20"
              style={{
                fontSize: 0,
                backdropFilter: 'blur(4px)'
              }}
            >
              <Icon size={20} strokeWidth={2} className="text-current" />
            </motion.span>
          </AnimatePresence>

          <motion.span
            key={`${role}-${tone ?? 'default'}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="font-medium"
            style={{
              fontFamily: tone ? fontFamily : 'Inter',
              fontSize
            }}
          >
            Add {label}
          </motion.span>
        </div>
        <span className="text-xs italic opacity-70">{role}</span>
      </motion.button>
    );
  })}
</div>

      {textRegistry.map(({ role, label, defaultText, shapeType }, index) => {
        const Icon = tone && toneIconMap[tone] ? toneIconMap[tone] : SparkleIcon;
        const { color, highlight, textColor, fontFamily } = useElementTone({ role, tone, shapeType });
        const fontSize = roleFontSizes[role] ?? 16;

        //console.log(`TextRoleButtons: role=${role}, tone=${tone}, font=${fontFamily}, size=${fontSize}`);

        return (
          <motion.button
            key={role}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
            onClick={() => {
              console.log(`Inserting text element with role="${role}", tone="${tone}", shapeType="${shapeType}"`);
              insert.insertText(defaultText, {
                role,
                tone,
                toneColor: textColor,
                font: fontFamily,
                shapeType
              });
            }}
            className="flex items-center cursor-pointer justify-between px-3 py-2 rounded-lg border transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              backgroundColor: '#fff',
              color: textColor,
              border: `1px solid ${color}`,
              boxShadow: `0 0 0 2px ${highlight}33`,
              fontFamily: tone ? fontFamily : 'Inter',
              fontSize
            }}
          >
            <div className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={tone ?? 'default'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex items-center justify-center w-8 h-8 rounded-md bg-white/30 shadow-sm ring-1 ring-inset ring-white/20"
                  style={{
                    fontSize: 0,
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  <Icon size={20} strokeWidth={2} className="text-current" />
                </motion.span>
              </AnimatePresence>

              <motion.span
                key={`${role}-${tone ?? 'default'}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="font-medium"
                style={{
                  fontFamily: tone ? fontFamily : 'Inter',
                  fontSize
                }}
              >
                Add {label}
              </motion.span>
            </div>
            <span className="text-xs italic opacity-70">{role}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
