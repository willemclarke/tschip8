import _ from 'lodash';

export class Emulator {
  memory: number[];
  pc: number;
  sp: number;
  stack: number[];
  v: number[];
  i: number;
  scale: number;
  width: number;
  height: number;
  screen: number[][];

  constructor() {
    this.reset();
  }

  reset() {
    this.memory = [];
    this.pc = 0x200;
    this.sp = 0;
    this.stack = [];
    this.v = [];
    this.i = 0;
    this.scale = 10;
    this.width = 64;
    this.height = 32;
    this.screen = [...Array(this.width)].map((e) => Array(this.height).fill(0));
  }

  step() {
    console.log('Emulator ticking');
  }
}
