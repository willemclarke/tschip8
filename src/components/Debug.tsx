import React from 'react';
import _ from 'lodash';
import type { Emulator } from '../emulator/emulator';
import { VStack, Text, HStack, Box } from '@chakra-ui/react';

interface Props {
  emulator: Emulator;
}

export const Debug = (props: Props) => {
  const { emulator } = props;
  const { traces } = emulator;

  const trace = _.map(traces, (trace) => {
    return (
      <HStack>
        <Text fontWeight="bold">PC:</Text>
        <Text>{trace.pc.toString(16)}</Text>
        <Text fontWeight="bold">Opcode:</Text>
        <Text>{trace.opcode.pretty}</Text>
        <Text fontWeight="bold">IR:</Text>
        <Text>{trace.i}</Text>
        <Text fontWeight="bold">VR:</Text>
        <Text>{trace.v.map((v) => v.toString(16))}</Text>
        <Text fontWeight="bold">SP:</Text>
        <Text>{trace.sp}</Text>
        <Text fontWeight="bold">Stack:</Text>
        <Text>{trace.stack.map((v) => v.toString(16))}</Text>
      </HStack>
    );
  });

  return (
    <Box border="1px solid purple" mx={4} overflow="scroll" w="100%">
      <VStack align="start">
        <Text fontWeight="bolder" fontSize="xl">
          Debug log
        </Text>
        {trace}
      </VStack>
    </Box>
  );
};
