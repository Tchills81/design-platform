import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();

    // Step 1: Clear the table
    try {
      await db.exec(`DELETE FROM christmas_templates`);
      const remaining = await db.all(`SELECT COUNT(*) as count FROM christmas_templates`);
      console.log(`🧹 Templates remaining after DELETE: ${remaining[0].count}`);
    } catch (err) {
      console.error('❌ DELETE failed:', err);
    }

    // Step 2: Define templates
    const templates = [
      {
        name: 'Christmas Joy Card',
        author: 'Tobias Chilonga',
        templateId: 'christmas-001',
        tone: 'festive',
        size: 'postcard',
        cellSize: 64,
        background: '#fef3c7',
        gridTop: '#d97706',
        gridBottom: '#fcd34d'
      },
      {
        name: 'Snowflake Wishes Card',
        author: 'Tobias Chilonga',
        templateId: 'christmas-002',
        tone: 'festive',
        size: 'postcard',
        cellSize: 64,
        background: '#e0f2fe',
        gridTop: '#bae6fd',
        gridBottom: '#0284c7'
      },
      {
        name: 'Cozy Fireplace Card',
        author: 'Tobias Chilonga',
        templateId: 'christmas-003',
        tone: 'festive',
        size: 'postcard',
        cellSize: 64,
        background: '#fff7ed',
        gridTop: '#fdba74',
        gridBottom: '#c2410c'
      },
      {
        name: 'Festive Mini Gift Card',
        author: 'Tobias Chilonga',
        templateId: 'gift-small-001',
        tone: 'festive',
        size: 'gift-card-small',
        cellSize: 20,
        background: '#fff7ed',
        gridTop: '#fdba74',
        gridBottom: '#c2410c'
      },
      {
        name: 'Winter Portrait Card',
        author: 'Tobias Chilonga',
        templateId: 'christmas-004',
        tone: 'festive',
        size: 'portrait-postcard',
        cellSize: 64,
        background: '#f0f9ff',
        gridTop: '#38bdf8',
        gridBottom: '#0ea5e9'
      },
      {
        name: 'Golden Glow Portrait',
        author: 'Tobias Chilonga',
        templateId: 'christmas-005',
        tone: 'festive',
        size: 'portrait-postcard',
        cellSize: 64,
        background: '#fff7ed',
        gridTop: '#fbbf24',
        gridBottom: '#b45309'
      },



      {
        name: 'Elegant Midnight Card',
        author: 'Tobias Chilonga',
        templateId: 'elegant-001',
        tone: 'elegant',
        size: 'postcard',
        cellSize: 64,
        background: '#eef2ff',
        gridTop: '#6366f1',
        gridBottom: '#4f46e5'
      },
      {
        name: 'Playful Confetti Card',
        author: 'Tobias Chilonga',
        templateId: 'playful-001',
        tone: 'playful',
        size: 'postcard',
        cellSize: 64,
        background: '#fff7ed',
        gridTop: '#f97316',
        gridBottom: '#ea580c'
      },
      {
        name: 'Reflective Moonlight Card',
        author: 'Tobias Chilonga',
        templateId: 'reflective-001',
        tone: 'reflective',
        size: 'postcard',
        cellSize: 64,
        background: '#f0f9ff',
        gridTop: '#60a5fa',
        gridBottom: '#1e3a8a'
      }
      
    ];

    // Step 3: Grid generator
    const generateGridColors = (width, height, cellSize, topColor, bottomColor) => {
      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);
      const total = cols * rows;
      const half = Math.floor(total / 2);
      return [
        ...Array(half).fill(topColor),
        ...Array(total - half).fill(bottomColor)
      ];
    };

    // Step 4: Insert templates
    for (const tpl of templates) {
      const isSmall = tpl.size === 'gift-card-small';
      const isPortrait = tpl.size === 'portrait-postcard';

      const width = isSmall ? 400 : isPortrait ? 400 : 700;
      const height = isSmall ? 250 : isPortrait ? 600 : 400;
      const cellSize = tpl.cellSize;

      const frontGridColors = generateGridColors(width, height, cellSize, tpl.gridTop, tpl.gridBottom);
      const backGridColors = generateGridColors(width, height, cellSize, tpl.gridBottom, tpl.gridTop);

      const frontElements = isSmall
        ? [
            {
              type: 'text',
              id: 'greeting',
              label: 'Greeting',
              text: 'With love this season',
              font: 'Georgia',
              size: 20,
              color: '#b91c1c',
              isBold: true,
              isItalic: false,
              tone: tpl.tone,
              position: { x: 40, y: 40 }
            },
            {
              type: 'image',
              id: 'gift-icon',
              src: '/assets/logo.png',
              position: { x: 280, y: 120 },
              size: { width: 80, height: 80 },
              tone: tpl.tone
            }
          ]
        : isPortrait
        ? [
            {
              type: 'text',
              id: 'title',
              label: tpl.name,
              text: tpl.name,
              font: 'Georgia',
              size: 28,
              color: '#b91c1c',
              isBold: true,
              isItalic: false,
              tone: tpl.tone,
              position: { x: 40, y: 80 }
            },
            {
              type: 'image',
              id: 'logo',
              src: '/assets/logo.png',
              position: { x: 140, y: 300 },
              size: { width: 120, height: 60 },
              tone: tpl.tone
            }
          ]
        : [
            {
              type: 'text',
              id: 'title',
              label: tpl.name,
              text: tpl.name,
              font: 'Georgia',
              size: 28,
              color: '#b91c1c',
              isBold: true,
              isItalic: false,
              tone: tpl.tone,
              position: { x: 60, y: 60 }
            },
            {
              type: 'image',
              id: 'logo',
              src: '/assets/logo.png',
              position: { x: 500, y: 200 },
              size: { width: 120, height: 60 },
              tone: tpl.tone
            }
          ];

      const backElements = isSmall
        ? [
            {
              type: 'text',
              id: 'message',
              label: 'Message',
              text: 'May your holidays be bright and warm.',
              font: 'Georgia',
              size: 16,
              color: '#b91c1c',
              isBold: false,
              isItalic: true,
              tone: tpl.tone,
              position: { x: 30, y: 160 }
            }
          ]
        : frontElements;

      const createFace = (elements, gridColors, cellSize) => ({
        card: {
          width,
          height,
          background: tpl.background,
          gridColors,
          cellSize,
          tone: tpl.tone
        },
        elements
      });

      const christmasTemplate = {
        name: tpl.name,
        author: tpl.author,
        templateId: tpl.templateId,
        tone: tpl.tone,
        size: tpl.size,
        sizeLabel: tpl.size === 'gift-card-small'
          ? 'Small Gift Card'
          : tpl.size === 'portrait-postcard'
          ? 'Portrait Postcard'
          : 'Postcard',
        width,
        height,
        type: 'seasonal',
        theme: 'christmas',
        previewMode: 'printable',
        tokens: {
          borderStyle: 'ornate',
          fontFamily: 'Georgia',
          accentColor: '#b91c1c'
        },
        meta: {
          createdBy: 'Tobias',
          lastEditedBy: 'SeederScript',
          approvedBy: 'System'
        },
        savedAt: new Date().toISOString(),
        data: JSON.stringify({
          templateId: tpl.templateId,
          tone: tpl.tone,
          mode: 'card',
          type: 'seasonal',
          theme: 'christmas',
          previewMode: 'printable',
          tokens: {
            borderStyle: 'ornate',
            fontFamily: 'Georgia',
            accentColor: '#b91c1c'
          },
          meta: {
            createdBy: 'Tobias',
            lastEditedBy: 'SeederScript',
            approvedBy: 'System'
          },
          front: createFace(frontElements, frontGridColors, cellSize),
          back: createFace(backElements, backGridColors, cellSize)
        })
      };
      

      await db.run(
        `INSERT INTO christmas_templates (name, author, templateId, tone, size, savedAt, data) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          christmasTemplate.name,
          christmasTemplate.author,
          christmasTemplate.templateId,
          christmasTemplate.tone,
          christmasTemplate.size,
          christmasTemplate.savedAt,
          christmasTemplate.data
        ]
      );
    }

    res.status(200).json({ message: '🎄 Templates seeded with portrait and landscape formats!' });
  } catch (err) {
    console.error('🚨 Insert error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
