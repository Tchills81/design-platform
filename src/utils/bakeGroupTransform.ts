import Konva from 'konva';

type BakeOptions = {
  bakeRotation?: boolean;
};

/**
 * Bake a group's transform into its children.
 * - Positions: preserved via absolute transforms (rotation-safe).
 * - Text nodes: bake scale into fontSize, lineHeight, letterSpacing, width, padding, strokeWidth, shadowBlur.
 * - Image/Shape nodes: bake scale into width/height and style props.
 * - Resets child scales to 1.
 * - Optionally bakes rotation into children.
 * - Resets group scale (and rotation if baked).
 */
export function bakeGroupTransform(
  groupNode: Konva.Group,
  options: BakeOptions = {}
) {
  const bakeRotation = !!options.bakeRotation;

  const groupScaleX = groupNode.scaleX();
  const groupScaleY = groupNode.scaleY();
  const groupRotation = groupNode.rotation();

  // Capture stage-space positions before baking
  const absBefore = groupNode.getAbsoluteTransform();
  const children = groupNode.getChildren() as Konva.Node[];
  const preBakeChildStage = children.map((child) => {
    const stagePt = absBefore.point({ x: child.x(), y: child.y() });
    return { child, stagePt };
  });

  children.forEach((child) => {
    // ---- Text nodes ----
    if (child instanceof Konva.Text) {
      const sx = groupScaleX;
      const sy = groupScaleY;

      // Use raw attrs to avoid double-scaling
      const baseFontSize = child.getAttr('fontSize') ?? child.fontSize();
      child.fontSize(baseFontSize * sy);

      const baseLineHeight = child.getAttr('lineHeight') ?? child.lineHeight();
      if (baseLineHeight) {
        child.lineHeight(baseLineHeight * sy);
      }

      const baseLetterSpacing = child.getAttr('letterSpacing') ?? child.letterSpacing();
      if (baseLetterSpacing) {
        child.letterSpacing(baseLetterSpacing * sx);
      }

      const baseWidth = child.getAttr('width') ?? child.width();
      child.width(baseWidth * sx);

      const basePadding = child.getAttr('padding') ?? child.padding();
      if (basePadding) {
        child.padding(basePadding * Math.max(sx, sy));
      }

      const baseStroke = child.getAttr('strokeWidth') ?? child.strokeWidth();
      if (baseStroke) {
        child.strokeWidth(baseStroke * Math.max(sx, sy));
      }

      const baseShadow = child.getAttr('shadowBlur') ?? child.shadowBlur();
      if (baseShadow) {
        child.shadowBlur(baseShadow * Math.max(sx, sy));
      }

      // Reset child scale
      child.scaleX(1);
      child.scaleY(1);
    }

    // ---- Other shapes (Rect, Circle, Image, etc.) ----
    else if (child instanceof Konva.Shape) {
      const anyChild = child as any;

      const baseWidth = child.getAttr('width') ?? (typeof anyChild.width === 'function' ? anyChild.width() : 0);
      const baseHeight = child.getAttr('height') ?? (typeof anyChild.height === 'function' ? anyChild.height() : 0);

      if (baseWidth && typeof anyChild.width === 'function') {
        anyChild.width(baseWidth * groupScaleX);
      }
      if (baseHeight && typeof anyChild.height === 'function') {
        anyChild.height(baseHeight * groupScaleY);
      }

      const baseStroke = child.getAttr('strokeWidth') ?? (typeof anyChild.strokeWidth === 'function' ? anyChild.strokeWidth() : 0);
      if (baseStroke && typeof anyChild.strokeWidth === 'function') {
        anyChild.strokeWidth(baseStroke * Math.max(groupScaleX, groupScaleY));
      }

      const baseShadow = child.getAttr('shadowBlur') ?? (typeof anyChild.shadowBlur === 'function' ? anyChild.shadowBlur() : 0);
      if (baseShadow && typeof anyChild.shadowBlur === 'function') {
        anyChild.shadowBlur(baseShadow * Math.max(groupScaleX, groupScaleY));
      }

      child.scaleX(1);
      child.scaleY(1);
    }

    // ---- Optionally bake rotation ----
    if (bakeRotation && groupRotation !== 0) {
      child.rotation(child.rotation() + groupRotation);
    }
  });

  // Reset group transform
  groupNode.scaleX(1);
  groupNode.scaleY(1);
  if (bakeRotation) {
    groupNode.rotation(0);
  }

  // Reposition children to preserve stage-space positions
  const absAfterInv = groupNode.getAbsoluteTransform().copy().invert();
  preBakeChildStage.forEach(({ child, stagePt }) => {
    const newLocal = absAfterInv.point(stagePt);
    child.position({ x: newLocal.x, y: newLocal.y });
  });
}
