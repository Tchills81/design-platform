import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();

    // Step 1: Clear the registry
    try {
      await db.exec(`DELETE FROM template_registry`);
      const remaining = await db.all(`SELECT COUNT(*) as count FROM template_registry`);
      console.log(`🧹 Templates remaining after DELETE: ${remaining[0].count}`);
    } catch (err) {
      console.error('❌ DELETE failed:', err);
    }

    // Step 2: Define templates
    const templates = [
      {
        name: 'Golden Ratio Post',
        author: 'Tobias Chilonga',
        templateId: 'social-001',
        tone: 'elegant',
        size: 'instagram-post',
        cellSize: 64,
        background: '#fff7ed',
        gridTop: '#fbbf24',
        gridBottom: '#b45309',
        type: 'social',
        theme: 'default',
        previewMode: 'grid'
      },
      {
        name: 'Story of Light',
        author: 'Tobias Chilonga',
        templateId: 'social-002',
        tone: 'playful',
        size: 'instagram-story',
        cellSize: 64,
        background: '#f0f9ff',
        gridTop: '#38bdf8',
        gridBottom: '#0ea5e9',
        type: 'social',
        theme: 'default',
        previewMode: 'carousel'
      },
      {
        name: 'Flyer for Change',
        author: 'Tobias Chilonga',
        templateId: 'print-001',
        tone: 'reflective',
        size: 'flyer-portrait',
        cellSize: 64,
        background: '#eef2ff',
        gridTop: '#6366f1',
        gridBottom: '#4f46e5',
        type: 'print',
        theme: 'minimal',
        previewMode: 'thumbnail'
      },
      {
        name: 'Vision Deck',
        author: 'Tobias Chilonga',
        templateId: 'presentation-001',
        tone: 'celebration',
        size: 'presentation',
        cellSize: 80,
        background: '#e0f2fe',
        gridTop: '#bae6fd',
        gridBottom: '#0284c7',
        type: 'presentation',
        theme: 'bold',
        previewMode: 'fullscreen'
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
    const sizeMap = {
      'instagram-post': { width: 1080, height: 1350 },
      'instagram-story': { width: 1080, height: 1920 },
      'flyer-portrait': { width: 794, height: 1123 },
      'presentation': { width: 1920, height: 1080 }
    };

    for (const tpl of templates) {
      const { width, height } = sizeMap[tpl.size] ?? { width: 600, height: 400 };
      const cellSize = tpl.cellSize;

      const frontGridColors = generateGridColors(width, height, cellSize, tpl.gridTop, tpl.gridBottom);
      const backGridColors = generateGridColors(width, height, cellSize, tpl.gridBottom, tpl.gridTop);

      const frontElements = [
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
          position: { x: width / 2 - 60, y: height / 2 - 30 },
          size: { width: 120, height: 60 },
          tone: tpl.tone
        }
      ];

      const backElements = frontElements;

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

      const registryTemplate = {
        name: tpl.name,
        author: tpl.author,
        templateId: tpl.templateId,
        tone: tpl.tone,
        size: tpl.size,
        type: tpl.type,
        theme: tpl.theme,
        previewMode: tpl.previewMode,
        savedAt: new Date().toISOString(),
        data: JSON.stringify({
          templateId: tpl.templateId,
          tone: tpl.tone,
          mode: 'canvas',
          type: tpl.type,
          theme: tpl.theme,
          previewMode: tpl.previewMode,
          tokens: {
            borderStyle: 'clean',
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
        `INSERT INTO template_registry (name, author, templateId, tone, size, type, theme, previewMode, savedAt, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registryTemplate.name,
          registryTemplate.author,
          registryTemplate.templateId,
          registryTemplate.tone,
          registryTemplate.size,
          registryTemplate.type,
          registryTemplate.theme,
          registryTemplate.previewMode,
          registryTemplate.savedAt,
          registryTemplate.data
        ]
      );
    }

    res.status(200).json({ message: '📦 Templates seeded into template_registry with expanded formats!' });
  } catch (err) {
    console.error('🚨 Insert error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
