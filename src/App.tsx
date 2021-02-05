import React from 'react';
import { Flex, Box, Button, HStack, Divider } from '@chakra-ui/react';
import { Debug } from './components/Debug';
import { Roms } from './components/Roms';
import { FpsSlider } from './components/FpsSlider';
import { Header } from './components/Header';
import { useRafLoop } from 'react-use';
import type { Emulator } from './emulator/emulator';
import { Status } from './components/Status';

interface Props {
  emulator: Emulator;
}

export const App = (props: Props) => {
  const { emulator } = props;

  const defaultFps = 1;

  const [rom, setRom] = React.useState<string | undefined>('roms/IBMLOGO.bin');
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
  };

  return (
    <Box justifyContent="center" h="100%">
      <Header />
      <Divider />
      <Flex alignItems="center" flexDir="column" mt={3}>
        <FpsSlider fps={fps} setFps={setFps} />
        <Status traces={emulator.traces} started={started} />
      </Flex>
      <Flex border="1px solid green" my={4} mx={12} h={500} justify="center">
        <Roms value={rom} onChange={setRom} />
        <Box bgColor="black" border="1px solid green" w="100%"></Box>
        <Debug emulator={emulator} />
      </Flex>
      <Flex justify="center">
        <HStack>
          <Button colorScheme="teal" onClick={toggle}>
            {started() ? 'Stop' : 'Run'}
          </Button>
          <Button colorScheme="teal">Step</Button>
          <Button colorScheme="teal">Pause</Button>
        </HStack>
      </Flex>
    </Box>
  );
};
