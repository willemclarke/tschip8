import React from 'react';
import _ from 'lodash';
import type { Trace } from '../../emulator/emulator';
import { VStack, Text, HStack, Box } from '@chakra-ui/react';

interface Props {
  trace: Trace;
}

export const Memory = (props: Props) => {
  const { trace } = props;

  const previous = _.map(trace.opcodeSummary.previous, (summary, index) => {
    return (
      <HStack key={`${summary.raw}-${index}`}>
        <Text>{summary.pretty}</Text>
      </HStack>
    );
  });

  const current = (
    <HStack bg="green.400">
      <Text>{`0x${trace.pc.toString(16)}`}</Text>
      <Text>{trace.opcodeSummary.current.pretty}</Text>
    </HStack>
  );

  return (
    <Box w={500}>
      <Text fontWeight="bold" fontSize="xl">
        Memory
      </Text>
      <VStack align="start" spacing={1}>
        {previous}
        {current}
      </VStack>
    </Box>
  );
};
