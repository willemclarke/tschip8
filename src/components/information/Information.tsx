import React from 'react';
import _ from 'lodash';
import { RomSelector } from './Roms';
import { Text, Kbd, Flex, SimpleGrid, VStack } from '@chakra-ui/react';

interface Props {
  value?: string;
  onChange: (rom: string) => void;
}

const keys = [
  1,
  2,
  3,
  4,
  'Q',
  'W',
  'E',
  'R',
  'A',
  'S',
  'D',
  'F',
  'Z',
  'X',
  'C',
  'V',
];

const Keys = () => {
  const keyboardKeys = _.map(keys, (key) => <Kbd key={key}>{key}</Kbd>);

  return (
    <VStack align="start">
      <Text fontSize="xl" fontWeight="bold">
        Keypad input
      </Text>
      <SimpleGrid columns={4} spacingX={2} spacingY={2}>
        {keyboardKeys}
      </SimpleGrid>
    </VStack>
  );
};

const Instructions = () => {
  return (
    <VStack align="start">
      <Text fontSize="xl" fontWeight="bold">
        Instructions
      </Text>
      <Text>Select a rom from drop the down</Text>
      <Text>Press play and enjoy</Text>
      <Text>If a game runs too slowly, use the fps slider to adjust speed</Text>
    </VStack>
  );
};

export const Information = (props: Props) => {
  const { value, onChange } = props;

  return (
    <Flex p={4} w={600} h={300} flexDir="column">
      <RomSelector value={value} onChange={onChange} />
      <Flex justify="space-between" py={2}>
        <Keys />
        <Instructions />
      </Flex>
    </Flex>
  );
};
