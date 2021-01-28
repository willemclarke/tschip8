import React from 'react';
import _ from 'lodash';
import type { Emulator } from '../emulator/emulator';
import { VStack, Text, HStack, Tag, Box } from '@chakra-ui/react';

interface Props {
  fps: number;
  emulator: Emulator;
}

export const DebugLog = (props: Props) => {
  const { fps, emulator } = props;
  const { pc, sp, v, i, getNextOpcode, traces } = emulator;

  const x = _.map(traces, (trace) => {
    return <div>{JSON.stringify(trace)}</div>;
  });

  return (
    <Box w="80%" border="1px solid purple" mx={4}>
      <VStack align="start">
        <Text fontWeight="bold" fontSize="lg">
          Debug log:
        </Text>
        <HStack>
          <Tag colorScheme="teal" variant="solid">
            FPS:
          </Tag>
          <Text>{fps}</Text>
        </HStack>
        <HStack>
          <Tag colorScheme="teal" variant="solid">
            Program counter:
          </Tag>
          <Text>{pc}</Text>
        </HStack>
        <HStack>
          <Tag colorScheme="teal" variant="solid">
            I register:
          </Tag>
          <Text>{i}</Text>
        </HStack>
        <HStack>
          <Tag colorScheme="teal" variant="solid">
            V register:
          </Tag>
          <Text>{v}</Text>
        </HStack>
        <HStack>
          <Tag colorScheme="teal" variant="solid">
            Stack pointer:
          </Tag>
          <Text>{sp}</Text>
        </HStack>
      </VStack>
    </Box>
  );
};
