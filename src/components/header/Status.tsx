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

  return (
    <Box px={4} pt={3}>
      <HStack>
        <HStack>
          <Text>Current opcode:</Text>
          <Text fontWeight="bolder" color="green.700">
            {currentTrace}
          </Text>
        </HStack>
        <HStack>
          <Text>Next opcode:</Text>
          <Text fontWeight="bolder" color="green.700">
            {/* {nextTrace?.opcode.pretty} */}
          </Text>
        </HStack>
        <Text fontWeight="bold" as="i">
          {started() ? 'Running' : 'Paused'}
        </Text>
      </HStack>
    </Box>
  );
};
