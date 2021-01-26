import React from 'react';
import _ from 'lodash';
import type { Emulator } from '../emulator';
import { VStack, Text } from '@chakra-ui/react';

interface Props {
  fps: number;
  emulator: Emulator;
}

export const State = (props: Props) => {
  const { fps, emulator } = props;
  const { pc, stack, v, i } = emulator;

  return (
    <VStack align="start">
      <Text fontWeight="bold" fontSize="lg">
        State
      </Text>
      <Text>FPS: {fps}</Text>
      <Text>Program counter: {pc}</Text>
      <Text>Stack: {stack}</Text>
      <Text>vRegister: {v}</Text>
      <Text>iRegister: {i}</Text>
    </VStack>
  );
};
