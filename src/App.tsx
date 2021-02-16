import React from 'react';
import _ from 'lodash';
import type { Emulator } from './emulator/emulator';
import { Header } from './components/header/Header';
import { Screen } from './components/Screen';
import { Debug } from './components/debug/Debug';
import { Information } from './components/information/Information';
import { useRafLoop, useUpdate } from 'react-use';
import {
  Flex,
  Box,
  Button,
  HStack,
  VStack,
  ButtonGroup,
} from '@chakra-ui/react';

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

  const init = async (rom: string) => {
    await fetch(rom)
      .then((resp) => {
        return resp.arrayBuffer();
      })
      .then((buffer) => {
        emulator.reset();
        emulator.loadRom(buffer);
      });
  };

  React.useEffect(() => {
    if (rom) {
      init(rom);
    }
  }, [rom]);

  const toggle = () => {
    started() ? stop() : start();
    update();
  };

  const onStep = () => {
    emulator.step();
    stop();
    update();
  };

  const onReset = async () => {
    if (rom) {
      await init(rom);
    }
    stop();
    update();
  };

  return (
    <Box justifyContent="center" h="100vh" bg="gray.100">
      <Header
        fps={fps}
        setFps={setFps}
        trace={emulator.getTrace()}
        started={started}
      />
      <Flex py={2} px={150} h={600} justify="center">
        <Box w={600} border="1px solid black">
          <VStack spacing={0}>
            <Screen screen={emulator.screen} pc={emulator.pc} />
            <Information value={rom} onChange={setRom} />
          </VStack>
        </Box>
        <Box w={600} border="1px solid black">
          <Debug emulator={emulator} />
        </Box>
      </Flex>
      <Flex justify="center">
        <HStack>
          <ButtonGroup size="md" colorScheme="green">
            <Button onClick={toggle}>{started() ? 'Pause' : 'Run'}</Button>
            <Button onClick={onStep}>Step</Button>
            <Button onClick={onReset}>Reset</Button>
          </ButtonGroup>
        </HStack>
      </Flex>
    </Box>
  );
};
