import React from 'react';
import _ from 'lodash';
import type { Emulator, Trace } from '../../emulator/emulator';
import { Registers } from './Registers';
import { Memory } from './Memory';
import { VStack, Text, HStack, Flex, Box, Spacer } from '@chakra-ui/react';

interface Props {
  emulator: Emulator;
}

export const Debug = (props: Props) => {
  const { emulator } = props;
  const { traces } = emulator;

  const processedTrace = _.last(_.initial(traces));

  const trace = _.map(traces, (trace) => {
    return (
      <HStack>
        <Text fontWeight="bold">PC:</Text>
        <Text>{trace.pc.toString(16)}</Text>
        <Text fontWeight="bold">Opcode:</Text>
        <Text>{trace.opcode.pretty}</Text>
        <Text fontWeight="bold">SP:</Text>
        <Text>{trace.sp}</Text>
      </HStack>
    );
  });

  return (
    <Flex p={2} w={700}>
      <VStack align="start">
        <Registers processedTrace={processedTrace} />
      </VStack>
      <VStack align="start">
        <Box w={500}>
          <Text fontWeight="bold" fontSize="xl">
            Memory
          </Text>
          {trace}
        </Box>
      </VStack>
    </Flex>
  );
};
