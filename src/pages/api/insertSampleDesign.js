import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  const db = await openDb();

  const sampleDualTemplate = {
    name: 'Test Ceremony Card',
    author: 'Tobias Chilonga',
    savedAt: new Date().toISOString(),
    data: JSON.stringify({
      templateId: 'test-001',
      tone: 'light',
      mode: 'card',
      front: {
        card: {
          width: 600,
          height: 400,
          background: '#ffffff',
          backgroundImage: '',
          gridColors: Array(60).fill('#e0e0e0')
        },
        elements: [
          {
            id: 'text-1',
            type: 'text',
            label: 'Front Greeting',
            text: 'Welcome to the Ceremony',
            font: 'Georgia',
            size: 24,
            color: '#333333',
            isBold: true,
            isItalic: false,
            tone: 'neutral',
            position: { x: 100, y: 80 }
          },
          {
            id: 'image-1',
            type: 'image',
            src: '/images/sample-flower.png',
            tone: 'soft',
            position: { x: 200, y: 200 },
            size: { width: 100, height: 100 }
          }
        ]
      },
      back: {
        card: {
          width: 600,
          height: 400,
          background: '#fafafa',
          backgroundImage: '',
          gridColors: Array(60).fill('#f5f5f5')
        },
        elements: [
          {
            id: 'text-2',
            type: 'text',
            label: 'Back Message',
            text: 'Thank you for being part of this moment.',
            font: 'Georgia',
            size: 20,
            color: '#555555',
            isBold: false,
            isItalic: true,
            tone: 'warm',
            position: { x: 80, y: 120 }
          }
        ]
      }
    })
  };

  try {
    await db.run(
      `INSERT INTO dual_templates (name, author, savedAt, data) VALUES (?, ?, ?, ?)`,
      [
        sampleDualTemplate.name,
        sampleDualTemplate.author,
        sampleDualTemplate.savedAt,
        sampleDualTemplate.data
      ]
    );

    res.status(200).json({ message: '🌱 Sample DualTemplate inserted successfully' });
  } catch (err) {
    console.error('🚨 Insert error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
