import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
    const db = await openDb();
  

  const templates = [
    {
      name: 'Modern Minimalist',
      description: 'Clean layout with soft background and subtle grid lines.',
      category: 'Business',
      front_template: JSON.stringify({
        background: { color: '#f9f9f9' },
        grid: { color: '#e0e0e0', visible: true },
        elements: [
          {
            type: 'text',
            text: 'Welcome',
            position: { x: 100, y: 120 },
            font: 'Helvetica',
            size: 24,
            color: '#333',
            isBold: false,
            isItalic: false
          }
        ]
      }),
      back_template: JSON.stringify({
        background: { color: '#ffffff' },
        grid: { color: '#e0e0e0', visible: true },
        elements: [
          {
            type: 'text',
            text: 'Contact Info',
            position: { x: 80, y: 100 },
            font: 'Helvetica',
            size: 18,
            color: '#555',
            isBold: false,
            isItalic: false
          }
        ]
      }),
      thumbnail_url: 'https://example.com/thumbnails/minimalist.png'
    },
    {
      name: 'Playful Celebration',
      description: 'Bright colors, confetti grid, and handwritten fonts for joyful occasions.',
      category: 'Birthday',
      front_template: JSON.stringify({
        background: { color: '#fffbe6' },
        grid: { color: '#ffcc00', visible: true },
        elements: [
          {
            type: 'text',
            text: 'Happy Birthday!',
            position: { x: 90, y: 110 },
            font: 'Comic Sans',
            size: 28,
            color: '#ff4081',
            isBold: true,
            isItalic: false
          }
        ]
      }),
      back_template: JSON.stringify({
        background: { color: '#fffbe6' },
        grid: { color: '#ffcc00', visible: true },
        elements: [
          {
            type: 'text',
            text: 'From all of us',
            position: { x: 70, y: 90 },
            font: 'Comic Sans',
            size: 20,
            color: '#ff4081',
            isBold: false,
            isItalic: true
          }
        ]
      }),
      thumbnail_url: 'https://example.com/thumbnails/celebration.png'
    },
    {
      name: 'Elegant Monogram',
      description: 'Dark background with gold grid and serif typography for formal occasions.',
      category: 'Wedding',
      front_template: JSON.stringify({
        background: { color: '#1a1a1a' },
        grid: { color: '#d4af37', visible: true },
        elements: [
          {
            type: 'text',
            text: 'A & B',
            position: { x: 120, y: 140 },
            font: 'Georgia',
            size: 36,
            color: '#d4af37',
            isBold: true,
            isItalic: true
          }
        ]
      }),
      back_template: JSON.stringify({
        background: { color: '#1a1a1a' },
        grid: { color: '#d4af37', visible: true },
        elements: [
          {
            type: 'text',
            text: 'Save the Date',
            position: { x: 100, y: 100 },
            font: 'Georgia',
            size: 20,
            color: '#ffffff',
            isBold: false,
            isItalic: false
          }
        ]
      }),
      thumbnail_url: 'https://example.com/thumbnails/elegant.png'
    }
  ];

  for (const tpl of templates) {
    await db.run(
      `INSERT INTO card_templates (name, description, category, front_template, back_template, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tpl.name, tpl.description, tpl.category, tpl.front_template, tpl.back_template, tpl.thumbnail_url]
    );
  }

  res.status(200).json({ message: '🌱 Sample DualTemplates inserted successfully' });
}

//seedCardTemplates();
