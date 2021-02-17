import React from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import type { Trace } from '../../emulator/emulator';
import _ from 'lodash';

interface Props {
  trace: Trace;
  started: () => boolean;
}

export const Status = (props: Props) => {
  const { trace, started } = props;

  const currentTrace = trace.opcodeSummary.current.pretty;
  const nextOpcode = trace.opcodeSummary.next[0]?.opcode?.pretty;

  // Note: come back and clean this up, im positive it can be simplified
  return (
    <Box pt={3}>
      <HStack>
        <HStack>
          <Text>Current opcode:</Text>
          <Box w={70}>
            <Text fontWeight="extrabold" color="green.700">
              {currentTrace}
            </Text>
          </Box>
        </HStack>
        <HStack>
          <Text>Next opcode:</Text>
          <Box w={70}>
            <Text fontWeight="extrabold" color="green.700">
              {nextOpcode}
            </Text>
          </Box>
        </HStack>
        <Text fontWeight="bold" as="i">
          {started() ? 'Running' : 'Paused'}
        </Text>
      </HStack>
    </Box>
  );
};
