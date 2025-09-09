/**
 * 
 * @param colors 
 * Handles both short and long arrays gracefully

Returns a soft averaged tone in rgb(r, g, b) format

Modular and ready for reuse in grid, canvas, or palette logic
 * @returns 
 */

export function computeAverageColor(colors: string[]): string {
    let r = 0, g = 0, b = 0;
  
    colors.forEach((hex) => {
      const [cr, cg, cb] = hexToRgb(hex);
      r += cr;
      g += cg;
      b += cb;
    });
  
    const count = colors.length || 1;
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);
  
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255
    ];
  }
  