import React from 'react';
import _ from 'lodash';
import type { Trace } from '../../emulator/emulator';
import { VStack, Text, HStack, Box, Spacer, Divider } from '@chakra-ui/react';

interface Props {
  trace: Trace;
}

const vRegisterIndexes = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
];

export const Registers = (props: Props) => {
  const { trace } = props;

  const vRegisters = _.map(trace.v, (register, index) => {
    return (
      <HStack key={`V[${vRegisterIndexes[index]}}]`}>
        <Text>{`V${vRegisterIndexes[index]}:`}</Text>
        <Text>{register.toString(16)}</Text>
      </HStack>
    );
  });

  const registers = (
    <VStack align="start" spacing={0}>
      <HStack>
        <Text>{`PC:`}</Text>
        <Text>{trace.pc.toString(16).toUpperCase()}</Text>
      </HStack>
      <HStack>
        <Text>IR:</Text>
        <Text>{trace.i.toString(16).toUpperCase()}</Text>
      </HStack>
      {vRegisters}
      <HStack>
        <Text>{`DT:`}</Text>
        <Text>Delay</Text>
      </HStack>
      <HStack>
        <Text>{`ST:`}</Text>
        <Text>Sound</Text>
      </HStack>
    </VStack>
  );

  return (
    <Box w={150} h={600}>
      <VStack spacing={-1} align="start">
        <Text fontWeight="bold" fontSize="xl">
          Registers
        </Text>
        <HStack>
          <Text fontWeight="bold">Reg</Text>
          <Text fontWeight="bold">Value</Text>
        </HStack>
      </VStack>
      <Divider my={2} />
      {registers}
    </Box>
  );
};
