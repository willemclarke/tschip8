import React from 'react';
import { Flex, Box, Text, Button, HStack, VStack } from '@chakra-ui/react';
import { Debug } from './components/Debug';
import { useRafLoop } from 'react-use';
import type { Emulator } from './emulator/emulator';
import { Roms } from './components/Roms';

interface Props {
  emulator: Emulator;
}

export const App = (props: Props) => {
  const { emulator } = props;
  const fps = 20;

  const [lastTime, setLastTime] = React.useState<number>(0);
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
    <Box border="1px solid red" justifyContent="center" h="100vh">
      <VStack spacing={-1} my={2}>
        <Text fontSize="xl" fontWeight="bolder">
          tschip8
        </Text>
        <Text>CHIP8 Emulator written in typescript</Text>
      </VStack>
      <Flex
        justify="space-between"
        border="1px solid green"
        my={4}
        mx={12}
        h={500}
      >
        <Roms />
        <Box h={500} w="100%" bgColor="black">
          {/*Draw screen here*/}
        </Box>
        <Debug emulator={emulator} />
      </Flex>
      <Flex justify="center">
        <HStack>
          <Button colorScheme="teal" onClick={toggle}>
            {started() ? 'Stop' : 'Run'}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
