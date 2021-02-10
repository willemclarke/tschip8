import React from 'react';
import {
  Kbd,
  Select,
  SimpleGrid,
  VStack,
  Text,
  Flex,
  Center,
} from '@chakra-ui/react';
import _ from 'lodash';

interface Props {
  value?: string;
  onChange: (rom: string) => void;
}

const roms = [
  '15PUZZLE.bin',
  'BLINKY.bin',
  'BLITZ.bin',
  'BRIX.bin',
  'CONNECT4.bin',
  'GUESS.bin',
  'HIDDEN.bin',
  'IBMLOGO.bin',
  'INVADERS.bin',
  'KALEID.bin',
  'MAZE.bin',
  'MERLIN.bin',
  'MISSILE.bin',
  'PONG.bin',
  'PONG2.bin',
  'PUZZLE.bin',
  'SYZYGY.bin',
  'TANK.bin',
  'TETRIS.bin',
  'TICTAC.bin',
  'UFO.bin',
  'VBRIX.bin',
  'VERS.bin',
  'WIPEOFF.bin',
];

export const Roms = (props: Props) => {
  const { onChange, value } = props;

  const keys = [
    1,
    2,
    3,
    4,
    'Q',
    'W',
    'E',
    'R',
    'A',
    'S',
    'D',
    'F',
    'Z',
    'X',
    'C',
    'V',
  ];

  const options = _.map(roms, (rom) => {
    return (
      <option value={`/roms/${rom}`} key={rom}>
        {rom}
      </option>
    );
  });

  const keyboardKeys = _.map(keys, (key) => <Kbd key={key}>{key}</Kbd>);

  return (
    <Flex flexDir="column" w={700}>
      <Select
        p={1}
        placeholder="Select rom"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="filled"
        fontWeight="bold"
        size="sm"
      >
        {options}
      </Select>
      <Center>
        <VStack align="start" p={2}>
          <Text fontSize="xl" fontWeight="bold">
            Keypad input
          </Text>
          <SimpleGrid columns={4} spacingX={2} spacingY={2}>
            {keyboardKeys}
          </SimpleGrid>
        </VStack>
      </Center>
    </Flex>
  );
};
