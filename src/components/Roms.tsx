import React from 'react';
import { VStack, Text } from '@chakra-ui/react';

interface Props {}

export const Roms = (props: Props) => {
  return (
    <VStack align="start">
      <Text fontWeight="bold" fontSize="lg">
        Select rom
      </Text>
      <Text>Dummy data</Text>
      <Text>Dummy data</Text>
      <Text>Dummy data</Text>
      <Text>Dummy data</Text>
      <Text>Dummy data</Text>
    </VStack>
  );
};
