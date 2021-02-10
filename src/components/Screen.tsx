import React from 'react';
import _ from 'lodash';

interface Props {
  screen: number[][];
  pc: number;
}

export const Screen = (props: Props) => {
  const { screen, pc } = props;

  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    console.log('rerendeirng screen');

    const context = ref.current?.getContext('2d');
    if (context) {
      context.scale(10, 10);
      context.clearRect(0, 0, 64, 32);

      for (let x = 0; x < 64; x++) {
        for (let y = 0; y < 32; y++) {
          const pixel = screen[x][y];

          if (pixel === 1) {
            console.log(`pixel at ${x}, ${y} is on`);
            context.fillStyle = 'blue';
          } else {
            context.fillStyle = 'white';
          }
          context.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [screen, pc]);

  return <canvas ref={ref} width="640" height="320" />;
};
