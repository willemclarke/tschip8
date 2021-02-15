import React from 'react';
import _ from 'lodash';
import type { Trace } from '../../emulator/emulator';
import { VStack, Text, HStack, Box, Spacer } from '@chakra-ui/react';

interface Props {
  trace: Trace;
}

export const Memory = (props: Props) => {
  const { trace } = props;

  const previous = _.map(trace.opcodeSummary.previous, (summary, index) => {
    return (
      <HStack key={`${summary.opcode.raw}-${index}`} spacing={4}>
        <Text>{`0x${summary.pc.toString(16)}`}</Text>
        <Spacer />
        <Text>{summary.opcode.pretty}</Text>
        <Spacer />
        <Text>{summary.opcode.description}</Text>
      </HStack>
    );
  });

  const current = (
    <HStack bg="green.400" spacing={4}>
      <Text>{`0x${trace.pc.toString(16)}`}</Text>
      <Spacer />
      <Text>{trace.opcodeSummary.current.pretty}</Text>
      <Spacer />
      <Text>{trace.opcodeSummary.current.description}</Text>
    </HStack>
  );

  const next = _.map(trace.opcodeSummary.next, (summary, index) => {
    return (
      <HStack key={`${summary.opcode.raw}-${index}`} spacing={4}>
        <Text>{`0x${summary.pc.toString(16)}`}</Text>
        <Spacer />
        <Text>{summary.opcode.pretty}</Text>
        <Spacer />
        <Text>{summary.opcode.description}</Text>
      </HStack>
    );
  });

  return (
    <Box w={500}>
      <Text fontWeight="bold" fontSize="xl">
        Memory
      </Text>
      <VStack align="start" spacing={1}>
        {previous}
        {current}
        {next}
      </VStack>
    </Box>
  );
};
