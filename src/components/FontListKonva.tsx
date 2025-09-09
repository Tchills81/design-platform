import React from 'react';
import { Stage, Layer, Text } from 'react-konva';
import { FONT_CONFIGS } from '../ui/_fonts';
import { useFontLoader } from '../utils/useFontLoader';

const FontListKonva: React.FC = () => {
  const fontsAreLoaded = useFontLoader(FONT_CONFIGS);

  const renderFontExamples = () => {
    const examples:any = [];
    let yPosition = 50;
    
    FONT_CONFIGS.forEach(font => {
      examples.push(
        <Text
          key={`${font.name}-title`}
          text={font.name}
          fontFamily={font.name}
          fontSize={24}
          fontStyle="bold"
          x={20}
          y={yPosition}
        />
      );
      yPosition += 30;
      
      font.variants.forEach(variant => {
        examples.push(
          <Text
            key={`${font.name}-${variant.weight}-${variant.style}`}
            text={`- ${variant.weight} ${variant.style}`}
            fontFamily={font.name}
            fontSize={18}
            fontStyle={`${variant.weight} ${variant.style}`}
            x={40}
            y={yPosition}
          />
        );
        yPosition += 25;
      });
      yPosition += 20;
    });
    return examples;
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        {fontsAreLoaded ? (
          renderFontExamples()
        ) : (
          <Text text="Loading fonts..." x={20} y={50} fontSize={24} />
        )}
      </Layer>
    </Stage>
  );
};

export default FontListKonva;