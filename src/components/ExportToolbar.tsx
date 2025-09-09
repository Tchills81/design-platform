export const ExportToolbar = ({ onCapture, onExit }: { onCapture: () => void; onExit: () => void }) => (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded px-4 py-2 border border-gray-300 animate-fadeIn">
      <button onClick={onCapture} className="text-sm font-medium text-blue-600 hover:underline">
        Capture Snapshot
      </button>
      <button onClick={onExit} className="text-xs text-gray-500 mt-2 hover:underline">
        Exit Print Mode
      </button>
    </div>
  );
  