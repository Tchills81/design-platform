export const renderToCanvasInsideFaces = (
    design: any, // expected to be DualTemplate
    setTemplate: (updater: (prev: any) => any) => void,
    setMode: (mode: 'card' | 'painting') => void
  ) => {
    const width = design?.front?.card?.width ?? 600;
    const height = design?.front?.card?.height ?? 400;
  
    const blankCard = {
      width,
      height,
      background: '#fff',
      backgroundImage: '',
      gridColors: Array(20).fill('#f3f4f6'),
      cellSize: 64
    };
  
    const blankElements: any[] = [];
  
    setTemplate(prev => {
      const safePrev = prev ?? {
        front: { card: {}, elements: [] },
        back: { card: {}, elements: [] }
      };
  
      return {
        ...safePrev,
        inside: {
          card: {
            width: blankCard.width,
            height: blankCard.height,
            background: blankCard.background,
            backgroundImage: blankCard.backgroundImage,
            gridColors: blankCard.gridColors,
            cellSize: blankCard.cellSize
          },
          elements: blankElements
        }
      };
    });
  
    setMode('card'); // Optional: switch to design mode
  };
  