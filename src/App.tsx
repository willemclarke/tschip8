import React from 'react';
import { Flex, Box, Button, HStack, VStack } from '@chakra-ui/react';
import { Debug } from './components/debug/Debug';
import { Roms } from './components/Roms';
import { Header } from './components/header/Header';
import { useRafLoop, useUpdate } from 'react-use';
import type { Emulator } from './emulator/emulator';

interface Props {
  emulator: Emulator;
}

export const App = (props: Props) => {
  const { emulator } = props;

  const defaultFps = 1;
  const update = useUpdate();

  const [rom, setRom] = React.useState<string | undefined>('/roms/IBMLOGO.bin');
  const [fps, setFps] = React.useState<number>(defaultFps);
  const [lastTime, setLastTime] = React.useState<number>(0);

  const [stop, start, started] = useRafLoop((time) => {
    if (time - lastTime < 1000 / fps) {
      return;
    }
    setLastTime(time);
    emulator.step();
  }, false);

  const init = () => {
    if (rom) {
      fetch(rom)
        .then((resp) => {
          return resp.arrayBuffer();
        })
        .then((buffer) => {
          emulator.reset();
          emulator.loadRom(buffer);
          start();
        });
    }
  };

  React.useEffect(init, [rom]);

  const toggle = () => {
    started() ? stop() : start();
    update();
  };

  return (
    <Box justifyContent="center" h="100%">
      <Header
        fps={fps}
        setFps={setFps}
        traces={emulator.traces}
        started={started}
      />
      <Flex py={4} px={150} h={700} justify="center" border="1px solid green">
        <Box w={700} border="1px solid red">
          <VStack spacing={0}>
            <Box bgColor="black" w={700} h={350}></Box>
            <Roms value={rom} onChange={setRom} />
          </VStack>
        </Box>
        <Box w={700} border="1px solid red">
          <Debug emulator={emulator} />
        </Box>
      </Flex>
      <Flex justify="center">
        <HStack>
          <Button colorScheme="green" onClick={toggle}>
            {started() ? 'Stop' : 'Run'}
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
