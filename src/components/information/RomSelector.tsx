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

export const RomSelector = (props: Props) => {
  const { onChange, value } = props;

  const options = _.map(roms, (rom) => {
    return (
      <option value={`/roms/${rom}`} key={rom}>
        {rom}
      </option>
    );
  });

  return (
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
  );
};
