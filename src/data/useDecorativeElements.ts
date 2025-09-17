import decorations from '../data/decorations';

export function useDecorativeElements(tone: string) {
  return decorations.filter((el) => el.tone === tone || el.tone === 'generic');
}
