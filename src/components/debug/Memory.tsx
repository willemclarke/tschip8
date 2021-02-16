import React from 'react';
import _ from 'lodash';
import type { Trace } from '../../emulator/emulator';
import { VStack, Text, HStack, Box, Spacer, Divider } from '@chakra-ui/react';

interface Props {
  trace: Trace;
}

export const Memory = (props: Props) => {
  const { trace } = props;

  const previous = _.map(trace.opcodeSummary.previous, (summary, index) => {
    return (
      <HStack key={`${summary.opcode.raw}-${index}`} spacing={4}>
        <Text>{`0x${summary.pc.toString(16)}:`}</Text>
        <Spacer />
        <Text>{summary.opcode.pretty}</Text>
        <Spacer />
        <Text>{summary.opcode.description}</Text>
      </HStack>
    );
  });

  const current = (
    <Box bg="green.400">
      <HStack spacing={4}>
        <Text>{`0x${trace.pc.toString(16)}:`}</Text>
        <Spacer />
        <Text>{trace.opcodeSummary.current.pretty}</Text>
        <Spacer />
        <Text>{trace.opcodeSummary.current.description}</Text>
      </HStack>
    </Box>
  );

  const next = _.map(trace.opcodeSummary.next, (summary, index) => {
    return (
      <HStack key={`${summary.opcode.raw}-${index}`} spacing={4}>
        <Text>{`0x${summary.pc.toString(16)}:`}</Text>
        <Spacer />
        <Text>{summary.opcode.pretty}</Text>
        <Spacer />
        <Text>{summary.opcode.description}</Text>
      </HStack>
    );
  });

  return (
    <Box w={400}>
      <VStack spacing={-1} align="start">
        <Text fontWeight="bold" fontSize="xl">
          Memory
        </Text>
        <HStack spacing={8}>
          <Text fontWeight="bold">B Loc</Text>
          <Text fontWeight="bold" pl={4}>
            Opcode
          </Text>
          <Text fontWeight="bold">Desc</Text>
        </HStack>
      </VStack>
      <Divider my={2} />
      <VStack align="start" spacing={0} pl={2}>
        {previous}
        {current}
        {next}
      </VStack>
    </Box>
  );
};
