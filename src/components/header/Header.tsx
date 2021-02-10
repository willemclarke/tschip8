import { VStack, Text, Divider, Flex } from '@chakra-ui/react';
import React from 'react';
import type { Trace } from 'src/emulator/emulator';
import { FpsSlider } from './FpsSlider';
import { Status } from './Status';

interface Props {
  fps: number;
  setFps: (value: number) => void;
  traces: Trace[];
  started: () => boolean;
}

export const Header = (props: Props) => {
  const { fps, setFps, traces, started } = props;

  return (
    <>
      <VStack spacing={-1} py={2}>
        <Text
          fontSize="2xl"
          fontWeight="extrabold"
          bgGradient="linear(to-r, green.600, green.700)"
          bgClip="text"
        >
          tschip8
        </Text>
        <Text>Chip-8 Emulator written in Typescript</Text>
      </VStack>
      <Divider />
      <Flex alignItems="center" flexDir="column" pt={3}>
        <FpsSlider fps={fps} setFps={setFps} />
        <Status traces={traces} started={started} />
      </Flex>
    </>
  );
};