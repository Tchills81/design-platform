import { type SnapshotEntry } from '../types/SnapshotEntry';
import { loadTemplateFromSnapshot } from '../utils/loadTemplateFromSnapshot';
import { type DualTemplate } from '../types/template';

interface Props {
  archive: SnapshotEntry[];
  onRestore: (tpl: DualTemplate) => void;
}

export default function SnapshotArchiveGallery({ archive, onRestore }: Props) {

    console.log("archive", archive)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
      {archive.map((entry, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '8px',
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <img
            src={entry.image}
            alt={`${entry.side} snapshot`}
            style={{ width: '100%', borderRadius: '4px' }}
          />
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
              border: 'none'
            }}
          >
            Restore This Design
          </button>
        </div>
      ))}
    </div>
  );
}
