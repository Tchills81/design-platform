const GRID_SPACING = 50;
const snapToGrid = (value: number, spacing = GRID_SPACING) =>
    Math.round(value / spacing) * spacing;
  