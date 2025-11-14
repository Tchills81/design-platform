// hooks/useFadeInLayer.ts
import { useEffect, useRef } from "react";
import Konva from "konva";

import { Layer } from "konva/lib/Layer";

export function useFadeInLayer({
  groupRef,
  templateId,
  setIsTransitioningTemplate,
  hasInitializedZoom
}: {
  groupRef: React. RefObject<Layer| null>
  templateId: string | undefined;
  setIsTransitioningTemplate: (value: boolean) => void;
  hasInitializedZoom: React.RefObject<boolean>;
}) {
  const opacityRef = useRef(0);
  const animationRef = useRef<Konva.Animation | null>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group || !templateId) return;

    opacityRef.current = 0;
    group.opacity(0);
    setIsTransitioningTemplate(true);

    const anim = new Konva.Animation((frame) => {
      if (!frame) return;

      const progress = frame.time / 200;
      opacityRef.current = Math.min(progress, 1);
      group.opacity(opacityRef.current);

      if (opacityRef.current >= 1) {
        anim.stop();
        setIsTransitioningTemplate(false);
        hasInitializedZoom.current = true;
      }
    }, group.getLayer());

    animationRef.current = anim;
    anim.start();

    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [templateId]);
}
