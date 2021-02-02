import React from 'react';
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  VStack,
  Text,
} from '@chakra-ui/react';

interface Props {
  fps: number;
  setFps: (value: number) => void;
}

export const FpsSlider = (props: Props) => {
  const { fps, setFps } = props;

  return (
    <VStack spacing={0}>
      <Text fontWeight="bold">FPS: {fps}</Text>
      <Slider
        aria-label="fps-slider"
        min={1}
        max={60}
        defaultValue={fps}
        onChange={(val) => setFps(val)}
        w={250}
        colorScheme="green"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </VStack>
  );
};