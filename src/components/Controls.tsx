import { Button, ButtonGroup, HStack } from '@chakra-ui/react';
import React from 'react';

interface Props {
  toggle: () => void;
  onStep: () => void;
  onReset: () => void;
  started: () => boolean;
}

export const Controls = (props: Props) => {
  const { toggle, onStep, onReset, started } = props;

  return (
    <HStack>
      <ButtonGroup size="md" colorScheme="green">
        <Button onClick={toggle}>{started() ? 'Pause' : 'Run'}</Button>
        <Button onClick={onStep}>Step</Button>
        <Button onClick={onReset}>Reset</Button>
      </ButtonGroup>
    </HStack>
  );
};
