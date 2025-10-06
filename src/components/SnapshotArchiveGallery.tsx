import { type SnapshotEntry } from '../types/SnapshotEntry';
import { loadTemplateFromSnapshot } from '../utils/loadTemplateFromSnapshot';
import { type DualTemplate } from '../types/template';

import { groupSnapshotsByTemplate } from '../utils/groupSnapshotsByTemplate';

import CompleteCardPreview from './CompleteCardPreview';
import React, { useState } from 'react';
import ThreeCardCanvas from './ThreeCardCanvas';


interface Props {
  archive: SnapshotEntry[];
  onRestore: (tpl: DualTemplate) => void;
}



export default function SnapshotArchiveGallery({ archive, onRestore }: Props) {
  const [showCompleteView, setShowCompleteView] = useState(false);
  const grouped = groupSnapshotsByTemplate(archive);




  //.log(grouped)
  //console.log( "archive", JSON.stringify( archive, null, 2));


  return (
    <div>
      <button
         className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 transition text-sm font-medium"
        onClick={() => setShowCompleteView(prev => !prev)}
        
      >
        {showCompleteView ? '🔙 See Spread View ->' : '📖 See Complete Preview ->'}
      </button>

      {showCompleteView ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {Object.entries(grouped).map(([id, card]) => (
            <div key={id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', background: '#fff' }}>
              <CompleteCardPreview card={card} onExit={()=>setShowCompleteView(false)}/>
              <button
                onClick={() => onRestore(card.template)}
                style={{
                  marginTop: '1rem',
                  fontSize: '0.75rem',
                  textDecoration: 'underline',
                  display: 'block',
                  textAlign: 'center',
                  color: '#0077cc',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Restore Complete Design
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {archive.map((entry, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                padding: '1rem',
                borderRadius: '8px',
                background: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <img src={entry.image} alt={`${entry.side} snapshot`} style={{ width: '100%', borderRadius: '4px' }} />
              <div style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '0.5rem', color: '#555' }}>
                {entry.side} • {new Date(entry.timestamp).toLocaleString()}
              </div>
              <button
                onClick={() => onRestore(loadTemplateFromSnapshot(entry))}
                style={{
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                  textDecoration: 'underline',
                  display: 'block',
                  textAlign: 'center',
                  color: '#0077cc',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                Restore This Design
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

