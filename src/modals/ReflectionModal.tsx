import React from 'react';
import { Dialog } from '../components/Dialog';
import { DialogTitle } from '../components/DialogTitle';
import { DialogContent } from '../components/DialogContent';
import { DialogActions } from '../components/DialogActions';
import type { Reflection } from '../types/reflection';

interface ReflectionModalProps {
  isOpen: boolean;
  reflections: Reflection[];
  onClose: () => void;
  konvaStageRef?: React.RefObject<any>; // Pass Konva stage ref
}

export default function ReflectionModal({
  isOpen,
  reflections,
  onClose,
  konvaStageRef
}: ReflectionModalProps) {
    function highlightElement(id: string) {
        if (!konvaStageRef?.current) return;
      
        const node = konvaStageRef.current.findOne(`#${id}`);

        console.log('node...', node)
        if (node) {
          node.stroke('#3b82f6');
          node.strokeWidth(10);
          node.shadowColor('#3b82f6');
          node.shadowBlur(10);
          node.shadowEnabled(true);
          node.draw();
        }
      }
      
      function clearHighlight() {
        if (!konvaStageRef?.current) return;
      
        konvaStageRef.current.find('Shape').forEach((node: any) => {
          node.stroke(null);
          node.strokeWidth(0);
          node.shadowEnabled(false);
          node.draw();
        });
      }
      

  async function resolveReflection(id: number) {
    try {
      await fetch('/api/resolveReflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      window.location.reload(); // Or trigger a refresh callback
    } catch (err) {
      console.error('Failed to resolve reflection:', err);
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>🪞 Reflections</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
          {reflections.length === 0 ? (
            <div className="text-sm text-gray-500">
              No reflections yet. This space is waiting to be filled.
            </div>
          ) : (
            reflections.map(ref => (
              <div
                key={ref.id}
                className={`border p-2 rounded transition-all ${
                  ref.resolved ? 'opacity-50' : 'hover:bg-blue-50'
                }`}
                onMouseEnter={() => ref.elementId && highlightElement(ref.elementId)}
                onMouseLeave={clearHighlight}
              >
                <div className="text-sm text-gray-500 flex justify-between items-center">
                  <span>
                    {ref.tone} · {new Date(ref.createdAt).toLocaleString()}
                    {ref.elementId && (
                      <span className="ml-2 text-xs text-blue-500 italic">
                        ↳ {ref.elementId}
                      </span>
                    )}
                  </span>
                  {!ref.resolved && (
                    <button
                      onClick={() => resolveReflection(ref.id)}
                      className="text-xs text-green-600 hover:underline"
                    >
                      ✅ Resolve
                    </button>
                  )}
                </div>
                <div className="text-md mt-1">{ref.message}</div>
                <div className="text-xs text-right text-gray-400">— {ref.createdBy}</div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <button onClick={onClose} className="text-sm text-gray-500 px-3 py-1">
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}
