import React from 'react';
import _ from 'lodash';

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
            context.fillStyle = 'blue';
            context.fillRect(x * scale, y * scale, scale, scale);
          }
        }
      }
    }
  }, [screen, pc]);

  return <canvas ref={ref} width="640" height="320" />;
};
