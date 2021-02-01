import React from 'react';
import { VStack, Text, Box, Select } from '@chakra-ui/react';
import _ from 'lodash';

interface Props {
  value?: string;
  onChange: (rom: string) => void;
}

// Rename all roms to end with .bin
// fill in all roms
const roms = ['TICTAC.bin', 'TETRIS.bin'];

export const Roms = (props: Props) => {
  const { onChange, value } = props;

  const options = _.map(roms, (rom) => {
    return <option value={`/roms/${rom}`}>{rom}</option>;
  });

  return (
    <Box border="1px solid purple" mx={4} w="100%">
      <Select
        placeholder="Select rom"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="flush"
      >
        {options}
      </Select>
    </Box>
  );
};
