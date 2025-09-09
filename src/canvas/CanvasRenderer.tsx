'use client';

import React, { useEffect, useState } from 'react';

interface Template {
  tone: string;
  grid: {
    rows: number;
    columns: number;
    cells: string[][];
  };
  elements?: Array<
    | {
        type: 'text';
        label: string;
        position: { x: number; y: number };
        font: string;
        size: number;
        color: string;
      }
    | {
        type: 'image';
        label: string;
        position: { x: number; y: number };
        size?: { width: number; height: number };
      }
  >;
}

const CanvasRenderer = () => {
  const [template, setTemplate] = useState<Template | null>(null);
  const [gridColors, setGridColors] = useState<string[][]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#FFD700');
  const [isPainting, setIsPainting] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [history, setHistory] = useState<string[][][]>([]);
  const [redoStack, setRedoStack] = useState<string[][][]>([]);

  useEffect(() => {
    fetch('/templates/classic-business-card.json')
      .then((res) => res.json())
      .then((data: Template) => {
        setTemplate(data);
        setGridColors(data.grid.cells);
        setHistory([data.grid.cells]);
      });
  }, []);

  const pushToHistory = (newGrid: string[][]) => {
    setHistory((prev) => [...prev, newGrid]);
    setRedoStack([]);
  };

  const handleCellUpdate = (rowIndex: number, colIndex: number) => {
    const updatedGrid = gridColors.map((row, r) =>
      row.map((color, c) => (r === rowIndex && c === colIndex ? selectedColor : color))
    );
    setGridColors(updatedGrid);
    pushToHistory(updatedGrid);
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (!isPainting) return;
    handleCellUpdate(rowIndex, colIndex);
  };

  const handleMouseDown = () => setIsPainting(true);
  const handleMouseUp = () => setIsPainting(false);

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newRedoStack = [history[history.length - 1], ...redoStack];
    const newHistory = history.slice(0, -1);
    setGridColors(newHistory[newHistory.length - 1]);
    setHistory(newHistory);
    setRedoStack(newRedoStack);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextGrid = redoStack[0];
    setGridColors(nextGrid);
    setHistory([...history, nextGrid]);
    setRedoStack(redoStack.slice(1));
  };

  const toggleGrid = () => setShowGrid((prev) => !prev);
  const hideGrid = () => setShowGrid(false);

  if (!template) return <p>Loading canvas...</p>;

  const cellSize = 40;
  const toneStyles: Record<string, { background: string; accent: string }> = {
    professional: { background: '#F5F5F5', accent: '#0077CC' },
    gentle: { background: '#FFF8F0', accent: '#A67C52' },
    celebratory: { background: '#FFFBEA', accent: '#F59E0B' },
    reflective: { background: '#E6F0FF', accent: '#60A5FA' }
  };

  const tone = toneStyles[template.tone] || toneStyles.professional;

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>🎨 Select color:</label>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
        <button onClick={handleUndo} style={{ marginLeft: '1rem' }}>
          ⬅️ Undo
        </button>
        <button onClick={handleRedo} style={{ marginLeft: '0.5rem' }}>
          ➡️ Redo
        </button>
        <button onClick={toggleGrid} style={{ marginLeft: '1rem' }}>
          {showGrid ? '🧹 Finish Painting' : '🎨 Paint Card Background'}
        </button>
      </div>

      <div
        onClick={() => {
          if (showGrid) hideGrid();
        }}
        style={{
          position: 'relative',
          width: template.grid.columns * cellSize,
          height: template.grid.rows * cellSize,
          backgroundColor: tone.background,
          border: `2px solid ${tone.accent}`,
          userSelect: 'none'
        }}
      >
        <div
          onMouseDown={showGrid ? handleMouseDown : undefined}
          onMouseUp={showGrid ? handleMouseUp : undefined}
          onMouseLeave={showGrid ? handleMouseUp : undefined}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${template.grid.columns}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${template.grid.rows}, ${cellSize}px)`
          }}
        >
          {gridColors.map((row, rowIndex) =>
            row.map((color, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={(e) => {
                  if (!showGrid) return;
                  e.stopPropagation();
                  handleCellUpdate(rowIndex, colIndex);
                }}
                onMouseEnter={() => {
                  if (showGrid) handleMouseEnter(rowIndex, colIndex);
                }}
                style={{
                  backgroundColor: color,
                  width: cellSize,
                  height: cellSize,
                  border: showGrid ? '1px solid #eee' : 'none',
                  cursor: showGrid ? 'pointer' : 'default',
                  transition: 'background-color 0.3s ease'
                }}
              />
            ))
          )}
        </div>

        {/* Overlay template elements */}
        {template.elements?.map((el, index) => {
          if (el.type === 'text') {
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: el.position.x,
                  top: el.position.y,
                  fontFamily: el.font,
                  fontSize: el.size,
                  color: el.color,
                  pointerEvents: 'none'
                }}
              >
                {el.label}
              </div>
            );
          }

          if (el.type === 'image') {
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: el.position.x,
                  top: el.position.y,
                  width: el.size?.width || 20,
                  height: el.size?.height || 20,
                  backgroundColor: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: '#666',
                  pointerEvents: 'none'
                }}
              >
                {el.label}
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
};

export default CanvasRenderer;
