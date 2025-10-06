import { openDb } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = await openDb();

    // Step 1: Clear the table
    try {
      await db.exec(`DELETE FROM save_designs`);
      const remaining = await db.all(`SELECT COUNT(*) as count FROM save_designs`);
      console.log(`🧹 Templates remaining after DELETE: ${remaining[0].count}`);
    } 
    catch (err) 
    {
      console.error('❌ DELETE failed:', err);
    }
  }catch(e){}
  res.status(200).json({ message: '🎄 designs deleted from save_designs!' });
}

    
  

