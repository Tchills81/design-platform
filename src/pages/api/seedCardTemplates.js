import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();

    /* 🔥 Step 1: Clear the registry
    console.log('🧹 Starting registry cleanup...');
    try {
      await db.exec(`DELETE FROM template_registry`);
      const remaining = await db.all(`SELECT COUNT(*) as count FROM template_registry`);
      console.log(`✅ Registry cleared. Remaining entries: ${remaining[0].count}`);
    } catch (err) {
      console.error('❌ DELETE failed:', err);
      return res.status(500).json({ message: 'Failed to clear registry' });
    }*/

    // 📦 Step 2: Define templates
    const templates = [
      {
        name: 'Ceremonial Invite',
        templateId: 'tpl-ceremonial-001',
        tone: 'ceremonial',
        size: 'invite-a6',
        cellSize: 64,
        background: '#fdf4ff',
        gridTop: '#c084fc',
        gridBottom: '#a855f7',
        type: 'card',
        subtype: 'invite',
        theme: 'ceremony',
        previewMode: 'carousel'
      },
      {
        name: 'Primary Color Poster',
        templateId: 'tpl-primary-001',
        tone: 'primary',
        size: 'poster-portrait',
        cellSize: 64,
        background: '#fef2f2',
        gridTop: '#ef4444',
        gridBottom: '#b91c1c',
        type: 'print',
        subtype: 'poster',
        theme: 'bold',
        previewMode: 'fullscreen'
      },
      {
        name: 'Spring Glyph Invocation',
        templateId: 'tpl-spring-001',
        tone: 'hopeful',
        size: 'greeting-square',
        cellSize: 64,
        background: '#f0fdf4',
        gridTop: '#86efac',
        gridBottom: '#22c55e',
        type: 'card',
        subtype: 'greeting',
        theme: 'seasonal',
        previewMode: 'thumbnail'
      },
      {
        name: 'Summer Glyph Invocation',
        templateId: 'tpl-summer-001',
        tone: 'radiant',
        size: 'poster-portrait',
        cellSize: 64,
        background: '#fff7ed',
        gridTop: '#fbbf24',
        gridBottom: '#f97316',
        type: 'print',
        subtype: 'poster',
        theme: 'seasonal',
        previewMode: 'fullscreen'
      },
      {
        name: 'Business Card Classic',
        templateId: 'tpl-business-001',
        tone: 'professional',
        size: 'business-card',
        cellSize: 64,
        background: '#f9fafb',
        gridTop: '#9ca3af',
        gridBottom: '#6b7280',
        type: 'card',
        subtype: 'business',
        theme: 'identity',
        previewMode: 'card'
      },
      {
        name: 'Flyer Portrait Promo',
        templateId: 'tpl-flyer-001',
        tone: 'promo',
        size: 'flyer-portrait',
        cellSize: 64,
        background: '#fff1f2',
        gridTop: '#fb7185',
        gridBottom: '#f43f5e',
        type: 'flyer',
        subtype: 'portrait',
        theme: 'event',
        previewMode: 'grid'
      },
      {
        name: 'Flyer Landscape Promo',
        templateId: 'tpl-flyer-002',
        tone: 'promo',
        size: 'flyer-landscape',
        cellSize: 64,
        background: '#f0f9ff',
        gridTop: '#38bdf8',
        gridBottom: '#0ea5e9',
        type: 'flyer',
        subtype: 'landscape',
        theme: 'event',
        previewMode: 'grid'
      },
      {
        name: 'Winter Card Landscape',
        templateId: 'tpl-winter-001',
        tone: 'quiet',
        size: 'card-landscape',
        cellSize: 64,
        background: '#eff6ff',
        gridTop: '#60a5fa',
        gridBottom: '#1d4ed8',
        type: 'card',
        subtype: 'landscape',
        theme: 'seasonal',
        previewMode: 'card'
      },
      {
        name: 'Square Greeting Card',
        templateId: 'tpl-greeting-001',
        tone: 'festive',
        size: 'card-square',
        cellSize: 64,
        background: '#ecfccb',
        gridTop: '#84cc16',
        gridBottom: '#65a30d',
        type: 'card',
        subtype: 'square',
        theme: 'seasonal',
        previewMode: 'thumbnail'
      },
      {
        name: 'Wide Banner Promo',
        templateId: 'tpl-banner-001',
        tone: 'bold',
        size: 'banner-wide',
        cellSize: 64,
        background: '#fefce8',
        gridTop: '#facc15',
        gridBottom: '#eab308',
        type: 'promo',
        subtype: 'wide',
        theme: 'announcement',
        previewMode: 'fullscreen'
      },
      {
        name: 'Tall Banner Promo',
        templateId: 'tpl-banner-002',
        tone: 'bold',
        size: 'banner-tall',
        cellSize: 64,
        background: '#fefce8',
        gridTop: '#facc15',
        gridBottom: '#eab308',
        type: 'promo',
        subtype: 'tall',
        theme: 'announcement',
        previewMode: 'fullscreen'
      },
      {
        name: 'Square Announcement',
        templateId: 'tpl-announcement-001',
        tone: 'urgent',
        size: 'announcement-square',
        cellSize: 64,
        background: '#fef2f2',
        gridTop: '#f87171',
        gridBottom: '#b91c1c',
        type: 'announcement',
        subtype: 'square',
        theme: 'alert',
        previewMode: 'grid'
      },
      {
        name: 'Portrait Promo Card',
        templateId: 'tpl-promo-001',
        tone: 'promo',
        size: 'promo-portrait',
        cellSize: 64,
        background: '#f0fdf4',
        gridTop: '#4ade80',
        gridBottom: '#22c55e',
        type: 'promo',
        subtype: 'portrait',
        theme: 'offer',
        previewMode: 'carousel'
      },
      {
        name: 'Landscape Promo Card',
        templateId: 'tpl-promo-002',
        tone: 'promo',
        size: 'promo-landscape',
        cellSize: 64,
        background: '#f0fdf4',
        gridTop: '#4ade80',
        gridBottom: '#22c55e',
        type: 'promo',
        subtype: 'landscape',
        theme: 'offer',
        previewMode: 'carousel'
      }
    ];

    const sizeMap = {
      'invite-a6': { width: 1050, height: 1480 },
      'poster-portrait': { width: 794, height: 1123 },
      'greeting-square': { width: 1080, height: 1080 },
      'business-card': { width: 1050, height: 600 },
      'flyer-portrait': { width: 794, height: 1123 },
      'flyer-landscape': { width: 1123, height: 794 },
      'card-landscape': { width: 1480, height: 1050 },
      'card-square': { width: 1080, height: 1080 },
      'banner-wide': { width: 1920, height: 600 },
      'banner-tall': { width: 600, height: 1920 },
      'announcement-square': { width: 1200, height: 1200 },
      'promo-portrait': { width: 900, height: 1600 },
      'promo-landscape': { width: 1600, height: 900 }
    };

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

    for (const tpl of templates) {
      const { width, height } = sizeMap[tpl.size] ?? { width: 600, height: 400 };
      const cellSize = tpl.cellSize;
    
      console.log(`📐 ${tpl.templateId} → ${width} × ${height}`);
    
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
        author: 'Tobias Chilonga',
        templateId: tpl.templateId,
        tone: tpl.tone,
        size: tpl.size,
        type: tpl.type,
        subtype: tpl.subtype ?? null,
        theme: tpl.theme,
        previewMode: tpl.previewMode,
        savedAt: new Date().toISOString(),
        data: JSON.stringify({
          templateId: tpl.templateId,
          tone: tpl.tone,
          mode: 'canvas',
          type: tpl.type,
          subtype: tpl.subtype ?? null,
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
          back: createFace(frontElements, backGridColors, cellSize)
        })
      };
  
      try {
        await db.run(
          `INSERT INTO template_registry (
            name, author, templateId, tone, size, type, subtype, theme, previewMode, savedAt, data
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            registryTemplate.name,
            registryTemplate.author,
            registryTemplate.templateId,
            registryTemplate.tone,
            registryTemplate.size,
            registryTemplate.type,
            registryTemplate.subtype,
            registryTemplate.theme,
            registryTemplate.previewMode,
            registryTemplate.savedAt,
            registryTemplate.data
          ]
        );
        console.log(`✅ Inserted: ${tpl.templateId}`);
      } catch (err) {
        console.error(`❌ Failed to insert ${tpl.templateId}:`, err);
      }
    } // end of for loop
  
    // ✅ Final response after all inserts
    res.status(200).json({
      message: '✅ Registry cleared and templates seeded successfully!',
      templatesInserted: templates.length
    });
  } catch (err) {
    console.error('🚨 Seeding error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
  
  }