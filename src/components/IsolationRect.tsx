import Konva from "konva";


import React, { useEffect, useRef, useState } from "react";
import { Rect } from "react-konva";

type IsolationRectProps = {
  width: number;
  height: number;
  isIsolationMode: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  dashPattern?: number[];
  animationSpeed?: number;
  
};

export const IsolationRect: React.FC<IsolationRectProps> = ({
  width,
  height,
  isIsolationMode,
  strokeColor = "blue",
  strokeWidth = 2,
  dashPattern = [6, 4],
  animationSpeed = 1,
  
}) => {
  const [dashOffset, setDashOffset] = useState(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (isIsolationMode) {
      const animate = () => {
        setDashOffset((prev) => prev + animationSpeed);
        animRef.current = requestAnimationFrame(animate);
      };
      animRef.current = requestAnimationFrame(animate);
    }
  
    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
    };
  }, [isIsolationMode, animationSpeed]);


 

  return (
    <>

<Rect
 
  x={0}
  y={0}
  width={width}
  height={height}
  stroke={strokeColor}
  strokeWidth={strokeWidth}
  dash={isIsolationMode ? dashPattern : []}
  dashOffset={dashOffset}
  listening={true}
  fill={isIsolationMode ? "gray" : "transparent"}
  opacity={isIsolationMode ? 0.5 : 1}
  attrs={{ name: "isolationRectangle" }}   // ✅ guaranteed
/>

   
    </>
    
  );
};
