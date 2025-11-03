import { SnapshotEntry } from '../types/SnapshotEntry';
import { getDefaultPageType } from '../utils/getDefaultPageType';

export function getPreviewLabel(entry: SnapshotEntry, snapshots: SnapshotEntry[]): string {
  const defaultType = getDefaultPageType(entry.template.size);

  // Group snapshots by timestamp
  const groupedByTimestamp: Record<string, SnapshotEntry[]> = {};
  snapshots.forEach(e => {
    const key = e.timestamp;
    if (!groupedByTimestamp[key]) groupedByTimestamp[key] = [];
    groupedByTimestamp[key].push(e);
  });

  // Sort timestamps chronologically
  const sortedTimestamps = Object.keys(groupedByTimestamp).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Flatten into ordered entries
  const orderedEntries: SnapshotEntry[] = [];
  sortedTimestamps.forEach(ts => {
    const group = groupedByTimestamp[ts];
    const front = group.find(e => e.side === 'front');
    const back = group.find(e => e.side === 'back');
    if (front) orderedEntries.push(front);
    if (back) orderedEntries.push(back);
  });

  const index = orderedEntries.findIndex(
    e => e.timestamp === entry.timestamp && e.side === entry.side
  );

  if (defaultType === 'page') {
    return `Page ${index + 1}`;
  }

  if (index === 0) return 'Front';
  if (index === 1) return 'Back';
  if (index === 2) return 'Front Inside';
  if (index === 3) return 'Back Inside';

  return `Page ${Math.floor(index / 2) + 1}`;
}
