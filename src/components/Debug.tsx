import React from 'react';
import _ from 'lodash';
import type { Emulator } from '../emulator/emulator';
import { VStack, Text, HStack, Box, Divider } from '@chakra-ui/react';

interface Props {
  emulator: Emulator;
}

export const Debug = (props: Props) => {
  const { emulator } = props;
  const { traces } = emulator;

  const processedTrace = _.last(_.initial(traces));
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

  const trace = _.map(traces, (trace) => {
    return (
      <HStack>
        <Text fontWeight="bold">PC:</Text>
        <Text>{trace.pc.toString(16)}</Text>
        <Text fontWeight="bold">Opcode:</Text>
        <Text>{trace.opcode.pretty}</Text>
        <Text fontWeight="bold">IR:</Text>
        <Text>{trace.i}</Text>
        <Text fontWeight="bold">SP:</Text>
        <Text>{trace.sp}</Text>
      </HStack>
    );
  });

  const vRegister = _.map(processedTrace?.v, (register, index) => {
    return (
      <>
        <Text>{`V[${vRegisterIndexes[index]}]:`}</Text>
        <Text>{register.toString(16)}</Text>
      </>
    );
  });

  return (
    <Box w="100%">
      <VStack align="start" mx={3} h="70%">
        <Text fontWeight="bold" fontSize="xl">
          Debug log
        </Text>
        {trace}
      </VStack>
      <Divider orientation="horizontal" my={3} />
      <VStack align="start" mx={3}>
        <Text fontWeight="bold" fontSize="xl">
          V Registers
        </Text>
        <HStack align="start" wrap="wrap">
          {vRegister}
        </HStack>
      </VStack>
    </Box>
  );
};
