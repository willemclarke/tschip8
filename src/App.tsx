import React from 'react';
import { Box, Flex, VStack } from '@chakra-ui/react';
import { useRafLoop, useUpdate } from 'react-use';
import { Controls } from './components/Controls';
import { Debug } from './components/debug/Debug';
import { Header } from './components/header/Header';
import { Information } from './components/information/Information';
import { Screen } from './components/Screen';
import type { Emulator } from './emulator/emulator';

interface Props {
  emulator: Emulator;
}

export const App = (props: Props) => {
  const { emulator } = props;

  const defaultFps = 100;
  const update = useUpdate();

  const [rom, setRom] = React.useState<string | undefined>('/roms/TESTROM.bin');
  const [fps, setFps] = React.useState<number>(defaultFps);
  const [lastTime, setLastTime] = React.useState<number>(0);

  const [stop, start, started] = useRafLoop((time) => {
    if (time - lastTime < 1000 / fps) {
      return;
    }

    setLastTime(time);
    emulator.step();
  }, false);

  const init = async (romPath: string) => {
    const rom = await fetch(romPath);
    const romBuffer = await rom.arrayBuffer();

    emulator.reset();
    emulator.loadRom(romBuffer);
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
    <Box justifyContent="center" minH="100vh" bg="gray.100">
      <Flex justify="center" flexDir="column" alignItems="center">
        <Header
          fps={fps}
          setFps={setFps}
          trace={emulator.getTrace()}
          started={started}
          awaitingKeypress={emulator.awaitingKeypress}
        />
      </Flex>
      <Flex py={2} px={150} h={600} justify="center">
        <Box w={600} border="1px solid black">
          <VStack spacing={0}>
            <Screen screen={emulator.screen} pc={emulator.pc} />
            <Information value={rom} onChange={setRom} />
          </VStack>
        </Box>
        <Box w={600} border="1px solid black" borderLeftWidth="0px">
          <Debug emulator={emulator} />
        </Box>
      </Flex>
      <Flex justify="center">
        <Controls
          toggle={toggle}
          onStep={onStep}
          onReset={onReset}
          started={started}
        />
      </Flex>
    </Box>
  );
};
