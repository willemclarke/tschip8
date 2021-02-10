import React from 'react';
import _ from 'lodash';
import type { Trace } from '../../emulator/emulator';
import { VStack, Text, HStack, Box, Spacer } from '@chakra-ui/react';

interface Props {
  processedTrace: Trace | undefined;
}

export const Registers = (props: Props) => {
  const { processedTrace } = props;

  const vRegisterIndexes = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ];

  const vRegisters = _.map(processedTrace?.v, (register, index) => {
    return (
      <HStack key={`V[${vRegisterIndexes[index]}}]`}>
        <Text>{`V[${vRegisterIndexes[index]}]:`}</Text>
        <Text>{register.toString(16)}</Text>
      </HStack>
    );
  });

  const registers = (
    <VStack align="start">
      <HStack>
        <Text>{`PC:`}</Text>
        <Text>{processedTrace?.pc.toString(16)}</Text>
      </HStack>
      <HStack>
        <Text>IR:</Text>
        <Spacer pr={2} />
        <Text>{processedTrace?.i}</Text>
      </HStack>
      {vRegisters}
      <HStack>
        <Text>{`DT:`}</Text>
        <Text>Delay</Text>
      </HStack>
      <HStack>
        <Text>{`ST:`}</Text>
        <Text>Sound</Text>
      </HStack>
    </VStack>
  );

  return (
    <Box w={150}>
      <Text fontWeight="bold" fontSize="xl">
        Registers
      </Text>
      {registers}
    </Box>
  );
};
