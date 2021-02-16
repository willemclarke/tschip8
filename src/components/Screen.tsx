import React from 'react';
import _ from 'lodash';
import { Box, Flex } from '@chakra-ui/react';

interface Props {
  screen: number[][];
  pc: number;
}

export const Screen = (props: Props) => {
  const { screen, pc } = props;
  const ref = React.useRef<HTMLCanvasElement>(null);
  const scale = 10;

  React.useEffect(() => {
    const context = ref.current?.getContext('2d');

    if (context) {
      context.clearRect(0, 0, 64 * scale, 32 * scale);

      for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 32; y++) {
          const pixel = screen[x][y];
          if (pixel === 1) {
            context.fillStyle = '#4DED30';
            context.fillRect(x * scale, y * scale, scale, scale);
          }
        }
      }
    }
  }, [screen, pc]);

  return (
    <Flex bg="black" w={600} h={300} border="2px solid green">
      <canvas ref={ref} width="600" height="300" style={{ padding: '4px' }} />
    </Flex>
  );
};
