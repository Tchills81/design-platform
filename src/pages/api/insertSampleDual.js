import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();

    // Step 1: Clear the table
    await db.exec(`DELETE FROM dual_templates`);

    // Step 2: Define multiple expressive templates
    const templates = [
      {
        name: 'Reflective Ceremony Card',
        author: 'Tobias Chilonga',
        tone: 'reflective',
        templateId: 'reflective-001',
        background: '#ff0000',
        gridTop: '#fdf6e3',
        gridBottom: '#657b83'
      },
      {
        name: 'Warm Welcome Card',
        author: 'Tobias Chilonga',
        tone: 'warm',
        templateId: 'warm-001',
        background: '#ffe4b5',
        gridTop: '#fff8dc',
        gridBottom: '#deb887'
      },
      {
        name: 'Minimalist Archive Card',
        author: 'Tobias Chilonga',
        tone: 'minimal',
        templateId: 'minimal-001',
        background: '#eeeeee',
        gridTop: '#cccccc',
        gridBottom: '#999999'
      }
    ];

    // Step 3: Insert each template
    for (const tpl of templates) {
      const face = {
        card: {
          width: 600,
          height: 300,
          background: tpl.background,
          gridColors: [
            ...Array(30).fill(tpl.gridTop),
            ...Array(30).fill(tpl.gridBottom)
          ]
        },
        elements: [
          {
            type: 'text',
            id: 'title',
            label: tpl.author,
            text: tpl.author,
            position: { x: 40, y: 40 },
            font: 'Arial',
            size: 24,
            color: '#333333',
            isBold: false,
            isItalic: true,
            tone: tpl.tone
          },
          {
            type: 'image',
            id: 'logo',
            src: '/assets/logo.png',
            position: { x: 400, y: 180 },
            size: { width: 120, height: 60 },
            tone: tpl.tone
          }
        ]
      };

      const dualTemplate = {
        name: tpl.name,
        author: tpl.author,
        savedAt: new Date().toISOString(),
        data: JSON.stringify({
          templateId: tpl.templateId,
          tone: tpl.tone,
          mode: 'card',
          front: face,
          back: face
        })
      };

      await db.run(
        `INSERT INTO dual_templates (name, author, savedAt, data) VALUES (?, ?, ?, ?)`,
        [
          dualTemplate.name,
          dualTemplate.author,
          dualTemplate.savedAt,
          dualTemplate.data
        ]
      );
    }

    res.status(200).json({ message: '🌱 Multiple DualTemplates seeded successfully' });
  } catch (err) {
    console.error('🚨 Insert error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
