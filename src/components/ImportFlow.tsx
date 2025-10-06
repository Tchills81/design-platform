import { useState } from 'react';

export default function ImportFlow() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<'element' | 'background' | null>(null);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-serif text-ceremonial mb-2">📦 Import Your Design Asset</h2>
      <p className="text-muted font-inter mb-6">
        Welcome your creation into the sanctuary. Choose its role in your story.
      </p>

      <label className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg cursor-pointer hover:bg-yellow-200 transition">
        Select File
        <input
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>

      {file && (
        <div className="mt-4">
          <p className="text-sm text-muted mb-2">
            Selected: <span className="font-medium">{file.name}</span>
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setCategory('element')}
              className={`px-4 py-2 rounded-lg ${
                category === 'element' ? 'bg-yellow-300' : 'bg-yellow-100'
              }`}
            >
              Use as Image Element
            </button>
            <button
              onClick={() => setCategory('background')}
              className={`px-4 py-2 rounded-lg ${
                category === 'background' ? 'bg-yellow-300' : 'bg-yellow-100'
              }`}
            >
              Use as Background Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
