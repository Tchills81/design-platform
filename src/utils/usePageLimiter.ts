import { getMaxPageCount } from "./getMaxPageCount";
import { DualTemplate} from "../types/template";
import { SnapshotEntry } from "../types/SnapshotEntry";
import { TemplateSize } from "../enumarations/TemplateSize";


export function usePageLimiter(template: DualTemplate | null, archive: SnapshotEntry[]) {
    const maxCount = getMaxPageCount(template?.size ?? TemplateSize.PRESENTATION);
    const currentPageCount = archive.length;
    const canAddPage = currentPageCount < maxCount;
    const isMaxReached = currentPageCount >= maxCount;
  
    const limitStatus = isMaxReached ? 'full' : 'available';
  
    return { maxCount, currentPageCount, canAddPage, isMaxReached, limitStatus };
  }
  