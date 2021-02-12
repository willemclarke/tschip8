import React from 'react';
import _ from 'lodash';
import type { Emulator } from '../../emulator/emulator';
import { Registers } from './Registers';
import { Memory } from './Memory';
import { VStack, Flex } from '@chakra-ui/react';

interface Props {
  emulator: Emulator;
}

export const Debug = (props: Props) => {
  const { emulator } = props;

  const trace = emulator.getTrace();

  return (
    <Flex p={2} w={700}>
      <VStack>
        <Registers processedTrace={trace} />
      </VStack>
      <VStack>
        <Memory trace={trace} />
      </VStack>
    </Flex>
  );
};
