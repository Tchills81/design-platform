import { openDb } from '../../../lib/db';


export default async function handler(req, res) {
    const db = await openDb();

  const templates = [
    {
      name: 'Modern Minimalist',
      description: 'Clean lines, bold typography, and subtle gradients.',
      category: 'Business',
      front_template: JSON.stringify({
        elements: [
          { type: 'text', text: 'Hello', position: { x: 100, y: 120 }, font: 'Helvetica', size: 24 }
        ]
      }),
      back_template: JSON.stringify({
        elements: [
          { type: 'text', text: 'Contact Info', position: { x: 80, y: 100 }, font: 'Helvetica', size: 18 }
        ]
      }),
      thumbnail_url: 'https://example.com/thumbnails/minimalist.png'
    },
    {
      name: 'Playful Celebration',
      description: 'Bright colors, confetti patterns, and handwritten fonts.',
      category: 'Birthday',
      front_template: JSON.stringify({
        elements: [
          { type: 'text', text: 'Happy Birthday!', position: { x: 90, y: 110 }, font: 'Comic Sans', size: 28 }
        ]
      }),
      back_template: JSON.stringify({
        elements: [
          { type: 'text', text: 'From all of us', position: { x: 70, y: 90 }, font: 'Comic Sans', size: 20 }
        ]
      }),
      thumbnail_url: 'https://example.com/thumbnails/celebration.png'
    }
  ];

  for (const tpl of templates) {
    await db.run(
      `INSERT INTO card_templates (name, description, category, front_template, back_template, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tpl.name, tpl.description, tpl.category, tpl.front_template, tpl.back_template, tpl.thumbnail_url]
    );
  }

  res.status(200).json({ message: '🌱 Sample DualTemplate inserted successfully' });

  console.log('✅ Seeded card_templates table');
}

