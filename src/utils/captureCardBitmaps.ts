import Konva from "konva";

export interface CardSnapshotOptions {
    frontStage: Konva.Stage;
    backStage: Konva.Stage;
    pixelRatio?: number; // default to 2 for high-res
  }
  
  export interface CardSnapshots {
    front: string;
    back: string;
  }
  
  export const captureCardBitmaps = ({
    frontStage,
    backStage,
    pixelRatio = 2
  }: CardSnapshotOptions): CardSnapshots => {
    const front = frontStage.toDataURL({ pixelRatio });
    const back = backStage.toDataURL({ pixelRatio });
  
    return { front, back };
  };
  