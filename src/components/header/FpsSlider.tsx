import React from 'react';
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  VStack,
  Text,
  Box,
} from '@chakra-ui/react';

interface Props {
  fps: number;
  setFps: (value: number) => void;
}

export const FpsSlider = (props: Props) => {
  const { fps, setFps } = props;

  return (
    <Box px={4} w={300}>
      <VStack spacing={0}>
        <Text fontWeight="bold">FPS: {fps}</Text>
        <Slider
          aria-label="fps-slider"
          min={1}
          max={60}
          defaultValue={fps}
          onChange={(val) => setFps(val)}
          w={250}
        >
          <SliderTrack bg="green.400">
            <SliderFilledTrack bg="green.600" />
          </SliderTrack>
          <SliderThumb boxSize={3} />
        </Slider>
      </VStack>
    </Box>
  );
};
