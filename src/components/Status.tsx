import React from 'react';
import { Box, Text, HStack } from '@chakra-ui/react';
import type { Trace } from '../emulator/emulator';
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
    <Box mx={4} mt={3}>
      <HStack>
        <Text>Processed opcode: {processedTrace?.opcode.pretty}</Text>
        <Text>Next opcode: {nextTrace?.opcode.pretty}</Text>
        <Text>{started() ? 'Running' : 'Paused'}</Text>
      </HStack>
    </Box>
  );
};
