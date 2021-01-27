import React from 'react';
import _ from 'lodash';
import type { Emulator } from '../emulator/emulator';
import { VStack, Text } from '@chakra-ui/react';

interface Props {
  fps: number;
  emulator: Emulator;
}

export const State = (props: Props) => {
  const { fps, emulator } = props;
  const { pc, stack, v, i, traces } = emulator;

  const x = _.map(traces, (trace) => {
    return <div>{JSON.stringify(trace)}</div>;
  });

  return (
    <VStack align="start">
      <Text fontWeight="bold" fontSize="lg">
        {x}
      </Text>
      <Text>FPS: {fps}</Text>
      <Text>Program counter: {pc}</Text>
      <Text>Stack: {stack}</Text>
      <Text>vRegister: {v}</Text>
      <Text>iRegister: {i}</Text>
    </VStack>
  );
};
