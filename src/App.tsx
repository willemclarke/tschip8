import React from 'react';
import { Flex, Box, Button, HStack, Divider, VStack } from '@chakra-ui/react';
import { Debug } from './components/Debug';
import { Roms } from './components/Roms';
import { FpsSlider } from './components/FpsSlider';
import { Header } from './components/Header';
import { useRafLoop, useUpdate } from 'react-use';
import type { Emulator } from './emulator/emulator';
import { Status } from './components/Status';

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

  // const reset = () => {
  //   init();
  //   toggle();
  // };

  return (
    <Box justifyContent="center" h="100%">
      <Header />
      <Divider />
      <Flex alignItems="center" flexDir="column" mt={3}>
        <FpsSlider fps={fps} setFps={setFps} />
        <Status traces={emulator.traces} started={started} />
      </Flex>
      <Flex border="1px solid green" my={4} mx={200} h={700} justify="center">
        <Box w="45%" h="100%" border="1px solid purple">
          <Roms value={rom} onChange={setRom} />
        </Box>
        <Box w="55%" border="1px solid red">
          <VStack>
            <Box
              bgColor="black"
              border="1px solid green"
              w="100%"
              h={350}
            ></Box>
            <Debug emulator={emulator} />
          </VStack>
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
