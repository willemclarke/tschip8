import React from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';

interface Props {}

export const Roms = (props: Props) => {
  return (
    <Box w="80%" border="1px solid purple" mx={4}>
      <VStack align="start">
        <Text fontWeight="bold" fontSize="lg">
          Select rom:
        </Text>
        <Text>Dummy data</Text>
        <Text>Dummy data</Text>
        <Text>Dummy data</Text>
        <Text>Dummy data</Text>
        <Text>Dummy data</Text>
      </VStack>
    </Box>
  );
};
