import {
  Sparkles,
  Moon,
  AirplayIcon,
  Feather,
  PartyPopper,
  Square,
  Lightbulb,
  HelpCircle,
  AlertCircle,
  Megaphone
} from 'lucide-react';



export const toneIconMap: Record<string, React.FC<any>> = {
  playful: PartyPopper,
  quiet: Moon,
  bold: Megaphone,
  reflective: AirplayIcon,
  elegant: Feather,
  festive: PartyPopper,
  minimal: Square,
  celebration: Sparkles,
  suggestion: Lightbulb,
  concern: AlertCircle,
  question: HelpCircle
};


export function getGlyphForRole(role: string | null): string {
    if (!role) return '🔹'; // default fallback
  
    const glyphMap: Record<string, string> = {
      accent: '✨',         // highlights or decorative frames
      container: '📦',      // layout anchors or grouping frames
      message: '💬',        // text or expressive elements
      cta: '🚀',            // call-to-action buttons or prompts
      background: '🌄',     // full-canvas imagery or tone layers
      logo: '🎯',           // brand marks or identity glyphs
      hero: '🦸',           // primary focal element
      quote: '📜',          // testimonial or poetic text
      reflection: '🪞',     // introspective or commentable element
      badge: '🏷️',         // small symbolic overlays
      divider: '➖',        // visual separators
      overlay: '🩺',        // interactive or assistive layers
      annotation: '🖍️',     // markup or feedback zones
      watermark: '💧',      // subtle branding or protection
    };
  
    return glyphMap[role] ?? '🔹';
  }



  export function getGlyphForRoleAndTone(role: string | null, tone: string | null): string {
    if (!role) return '🔹';
  
    const toneGlyphs: Record<string, string> = {
      playful: '🎈',
      bold: '💥',
      quiet: '🌙',
      reflective: '🪞',
      elegant: '🪶',
      festive: '🎉',
      minimal: '⬜',
      celebration: '🎊',
      suggestion: '💡',
      concern: '🫧',
      question: '❓'
    };
  
    const roleGlyphs: Record<string, string> = {
      accent: '✨',
      container: '📦',
      message: '💬',
      cta: '🚀',
      background: '🌄',
      logo: '🎯',
      hero: '🦸',
      quote: '📜',
      reflection: '🪞',
      badge: '🏷️',
      divider: '➖',
      overlay: '🩺',
      annotation: '🖍️',
      watermark: '💧',
      heading: '🔠',
      subheading: '🔡',
      body: '✏️',
      caption: '📝'
    };
  
    // If tone is defined and has a glyph, return that
    if (tone && toneGlyphs[tone]) return toneGlyphs[tone];
  
    // Otherwise fall back to role glyph
    return roleGlyphs[role] ?? '🔹';
  }
  
  