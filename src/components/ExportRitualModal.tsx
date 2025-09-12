import React from 'react';

import { SnapshotPair, printSnapshots } from './printSnapshots';

interface ExportRitualModalProps {
  snapshots: SnapshotPair;
  tone: 'minimal' | 'reflective' | 'warm' | 'playful';
  onClose: () => void;
}

const toneStyles: Record<string, React.CSSProperties> = {
  minimal: {
    background: '#f9f9f9',
    fontFamily: 'Satoshi, sans-serif',
  },
  reflective: {
    background: '#eef2ff',
    fontFamily: 'Playfair Display, serif',
  },
  warm: {
    background: '#fff8f0',
    fontFamily: 'Open Sans, sans-serif',
  },
  playful: {
    background: '#fef6ff',
    fontFamily: 'Comic Neue, cursive',
  },
};

export const ExportRitualModal: React.FC<ExportRitualModalProps> = ({
  snapshots,
  tone,
  onClose,
}) => {
  const style = toneStyles[tone] || toneStyles.minimal;

  const handlePrint = () => {
    printSnapshots(snapshots);
  };

  return (
    <div
      className="overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
      }}
    >
      <div
        className="modal"
        style={{
          ...style,
          padding: '2rem',
          margin: '2rem',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '12px',
          boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Export Ritual</h2>
  
        <div
          className="preview"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {snapshots.front && (
            <img
              src={snapshots.front}
              alt="Front Snapshot"
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
          )}
          {snapshots.back && (
            <img
              src={snapshots.back}
              alt="Back Snapshot"
              style={{ maxWidth: '100%', borderRadius: '8px' }}
            />
          )}
        </div>
  
        <div
          className="metadata"
          style={{
            marginTop: '1rem',
            fontSize: '0.85rem',
            color: '#555',
          }}
        >
          <p>Created: {new Date().toLocaleString()}</p>
          <p>Tone: {tone}</p>
        </div>
  
        <div
          className="actions"
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={handlePrint}
            style={{
              padding: '0.5rem 1rem',
              background: '#333',
              color: '#fff',
              borderRadius: '6px',
            }}
          >
            Print Artifact
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              background: '#eee',
              borderRadius: '6px',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
  
};
