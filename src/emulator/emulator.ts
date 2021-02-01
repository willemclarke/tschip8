import _ from 'lodash';

export interface Trace {
  opcode: Opcode;
  pc: number;
  i: number;
  v: number[];
  sp: number;
  stack: number[];
}

export interface Opcode {
  pretty: string;
  hi: number;
  lo: number;
  nnn: number;
  n: number;
  x: number;
  y: number;
  kk: number;
  raw: number;
  i: number;
}

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
  traces: Trace[];

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
    this.traces = [];
  }

  step() {
    this.pc += 2;
    const nextOpcodeValue = this.getNextOpcode();
    const parsedOpcode = Emulator.parseOpcode(nextOpcodeValue);
    this.addTrace(parsedOpcode);
    // execute switch statement here
  }

  loadRom(rom: ArrayBuffer) {
    this.memory = Array(0x200).fill(0x0).concat(rom);
    console.log('Loading rom...');
  }

  getNextOpcode() {
    return (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
  }

  addTrace(opcode: Opcode) {
    const newTrace = {
      opcode,
      pc: this.pc,
      i: this.i,
      v: this.v,
      sp: this.sp,
      stack: this.stack,
    };
    this.traces.push(newTrace);

    if (this.traces.length > 10) {
      this.traces.shift();
    }
  }

  static parseOpcode(raw: number): Opcode {
    const pretty = '0000' + raw.toString(16).toUpperCase().slice(-4);
    const hi = (raw & 0xff00) >> 8;
    const lo = raw & 0x00ff;
    const nnn = raw & 0x0fff;
    const n = raw & 0x000f;
    const x = (raw & 0x0f00) >> 8;
    const y = (raw & 0x00f0) >> 4;
    const kk = raw & 0x00ff;
    const i = (raw & 0xf000) >> 12;

    return {
      hi,
      lo,
      nnn,
      n,
      x,
      y,
      kk,
      i,
      raw,
      pretty,
    };
  }
}
