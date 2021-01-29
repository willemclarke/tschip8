import React from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';

interface Props {}

export const Roms = (props: Props) => {
  return (
    <Box border="1px solid purple" mx={4} w="100%">
      <VStack align="start">
        <Text fontWeight="bold" fontSize="xl">
          Select rom
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
