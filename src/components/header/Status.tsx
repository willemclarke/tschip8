import React from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import type { Trace } from '../../emulator/emulator';
import _ from 'lodash';

interface Props {
  traces: Trace[];
  started: () => boolean;
}

export const Status = (props: Props) => {
  const { traces, started } = props;

  const nextTrace = _.last(traces);
  const processedTrace = _.last(_.initial(traces));

  return (
    <Box px={4} pt={3}>
      <HStack>
        <HStack>
          <Text>Processed opcode:</Text>
          <Text fontWeight="bolder" color="green.700">
            {processedTrace?.opcode.pretty}
          </Text>
        </HStack>
        <HStack>
          <Text>Next opcode:</Text>
          <Text fontWeight="bolder" color="green.700">
            {nextTrace?.opcode.pretty}
          </Text>
        </HStack>
        <Text fontWeight="bold" as="i">
          {started() ? 'Running' : 'Paused'}
        </Text>
      </HStack>
    </Box>
  );
};
