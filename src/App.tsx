import React from 'react';
import {
  Flex,
  Box,
  Text,
  Button,
  Center,
  VStack,
  ButtonGroup,
  HStack,
} from '@chakra-ui/react';
import { State } from './components/State';
import { useRafLoop } from 'react-use';
import type { Emulator } from './emulator';

interface Props {
  emulator: Emulator;
}

export const App = (props: Props) => {
  const { emulator } = props;

  const [lastTime, setLastTime] = React.useState<number>(0);
  const fps = 1;

  const [stop, start, started] = useRafLoop((time) => {
    if (time - lastTime < 1000 / fps) {
      return;
    }
    setLastTime(time);
    console.log(time);
    emulator.step();
  }, false);

  const toggle = () => {
    started() ? stop() : start();
  };

  return (
    <Center>
      <VStack spacing={4}>
        <Text fontSize="xl" fontWeight="bolder" mt={4}>
          CHIP8 Emulator Written in TypeScript
        </Text>
        {/* Emulator here */}
        <HStack>
          <Box h="400px" w="500px" bgColor="black"></Box>
          <State fps={fps} emulator={emulator} />
        </HStack>
        <Button size="sm" colorScheme="green" onClick={toggle}>
          {started() ? 'Stop' : 'Run'}
        </Button>
        <Text fontSize="2xl">{lastTime}</Text>
      </VStack>
    </Center>
  );
};
