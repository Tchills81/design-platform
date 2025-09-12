export interface SnapshotPair {
    front: string | null;
    back: string | null;
  }
  
  export const printSnapshots = ({ front, back }: SnapshotPair): void => {
    if (!front && !back) return;
  
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
  
    const imagesHtml = [front, back]
      .filter(Boolean)
      .map((src, index) => `
        <div style="text-align: center;">
          <img src="${src}" alt="Snapshot ${index + 1}" />
          <div style="font-size: 0.75rem; color: #666;">Snapshot ${index + 1}</div>
        </div>
      `)
      .join('');
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Card Snapshots</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 20px;
              background: white;
              font-family: Inter, sans-serif;
            }
            img {
              max-width: 90%;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          ${imagesHtml}
        </body>
      </html>
    `);
  
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  