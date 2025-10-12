export const  DOMViewport: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const SIDEBAR_WIDTH = 280;
    const RULER_THICKNESS = 24;
    const TOP_BAR_HEIGHT = 64;
    const FOOTER_HEIGHT = 48;
    const RIGHT_MARGIN = 280;
  
    const maskX = SIDEBAR_WIDTH + RULER_THICKNESS;
    const maskY = TOP_BAR_HEIGHT + RULER_THICKNESS;
    const maskWidth = window.innerWidth - maskX - RIGHT_MARGIN;
    const maskHeight = window.innerHeight - maskY - FOOTER_HEIGHT;
  
    return (
      <div
        style={{
          position: 'absolute',
          top: maskY,
          left: maskX,
          width: maskWidth,
          height: maskHeight,
          overflow: 'hidden',
          pointerEvents: 'none', // allow canvas interactions to pass through
          zIndex: 1
        }}
      >
        {children}
      </div>
    );
  };
  