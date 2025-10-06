import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();
    const {
      id, // optional: only present if updating
      name,
      author,
      data,
      thumbnailUrl,
      userId,
      cellSize,
      insideMessage,
      savedAt: clientSavedAt,
      templateId,
      tone,
      size,
      type,
      theme,
      previewMode
    } = req.body;

    if (!name || !author || !data || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

    const ensureCellSize = (face) => {
      if (!face?.card) return face;
      return {
        ...face,
        card: {
          ...face.card,
          cellSize: face.card.cellSize ?? cellSize
        }
      };
    };

    const savedAt = clientSavedAt || new Date().toISOString();

    const enrichedData = {
      ...parsedData,
      front: ensureCellSize(parsedData.front),
      back: ensureCellSize(parsedData.back),
      tokens: {
        ...(parsedData.tokens || {}),
        borderStyle: 'ornate',
        fontFamily: 'Georgia',
        accentColor: '#b91c1c'
      },
      meta: {
        ...(parsedData.meta || {}),
        createdBy: author,
        lastEditedBy: 'SaveDesignHandler',
        approvedBy: 'System',
        savedAt,
        cellSize,
        insideMessage
      }
    };

    if (id) {
      // Check if design exists for this id + userId
      const existing = await db.get(
        `SELECT id FROM save_designs WHERE id = ? AND userId = ?`,
        [id, userId]
      );

      if (existing?.id) {
        await db.run(
          `UPDATE save_designs SET
            name = ?, author = ?, templateId = ?, tone = ?, size = ?, type = ?, theme = ?, previewMode = ?,
            savedAt = ?, data = ?, thumbnailUrl = ?
           WHERE id = ?`,
          [
            name,
            author,
            templateId,
            tone,
            size,
            type,
            theme,
            previewMode,
            savedAt,
            JSON.stringify(enrichedData),
            thumbnailUrl,
            id
          ]
        );

        return res.status(200).json({ message: '🔄 Design updated successfully' });
      }
    }

    // Insert new design
    await db.run(
      `INSERT INTO save_designs (
        name, author, templateId, tone, size, type, theme, previewMode,
        savedAt, data, thumbnailUrl, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        author,
        templateId,
        tone,
        size,
        type,
        theme,
        previewMode,
        savedAt,
        JSON.stringify(enrichedData),
        thumbnailUrl,
        userId
      ]
    );

    res.status(200).json({ message: '✅ Design saved successfully' });
  } catch (err) {
    console.error('🚨 Save error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
