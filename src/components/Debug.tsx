import React from 'react';
import _ from 'lodash';
import type { Emulator } from '../emulator/emulator';
import { VStack, Text, HStack, Flex } from '@chakra-ui/react';

interface Props {
  emulator: Emulator;
}

export const Debug = (props: Props) => {
  const { emulator } = props;
  const { traces } = emulator;

  const processedTrace = _.last(_.initial(traces));
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

  const vRegisters = _.map(processedTrace?.v, (register, index) => {
    return (
      <HStack>
        <Text>{`V[${vRegisterIndexes[index]}]:`}</Text>
        <Text>{register.toString(16)}</Text>
      </HStack>
    );
  });

  const registers = (
    <>
      <HStack>
        <Text>{`PC:`}</Text>
        <Text>{processedTrace?.pc.toString(16)}</Text>
      </HStack>
      <HStack>
        <Text>{`I:`}</Text>
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
    </>
  );

  return (
    <Flex p={2}>
      <VStack align="start" w={105}>
        <Text fontWeight="bold" fontSize="xl">
          Registers
        </Text>
        {registers}
      </VStack>
      <VStack align="start" pl={4} w={245}>
        <Text fontWeight="bold" fontSize="xl">
          Debug log
        </Text>
        {trace}
      </VStack>
    </Flex>
  );
};
