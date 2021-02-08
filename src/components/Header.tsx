import { VStack, Text } from '@chakra-ui/react';
import React from 'react';

export const Header = () => {
  return (
    <VStack spacing={-1} py={2}>
      <Text
        fontSize="2xl"
        fontWeight="extrabold"
        bgGradient="linear(to-r, green.600, green.700)"
        bgClip="text"
      >
        tschip8
      </Text>
      <Text>Chip-8 Emulator written in Typescript</Text>
    </VStack>
  );
};
