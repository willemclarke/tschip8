import React from 'react';
import _ from 'lodash';
import { Flex } from '@chakra-ui/react';

interface Props {
  screen: number[];
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

      for (let i = 0; i < 64 * 32; i++) {
        let x = (i % 64) * scale;

        // Grabs the y position of the pixel based off of `i`
        let y = Math.floor(i / 64) * scale;

        if (screen[i] === 1) {
          context.fillStyle = '#68D391';
          context.fillRect(x, y, scale, scale);
        }
      }
    }
  }, [screen, pc]);

  return (
    <Flex bg="black" w={600} h={300} border="2px solid green">
      <canvas ref={ref} width="640" height="320" style={{ padding: '4px' }} />
    </Flex>
  );
};
