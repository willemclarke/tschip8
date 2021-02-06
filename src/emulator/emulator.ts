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
    this.v = Array(0x10).fill(0);
    this.i = 0;
    this.scale = 10;
    this.width = 64;
    this.height = 32;
    this.screen = [...Array(this.width)].map((e) => Array(this.height).fill(0));
    this.traces = [];
  }

  step() {
    const nextOpcodeValue = this.getNextOpcode();
    const parsedOpcode = Emulator.parseOpcode(nextOpcodeValue);
    this.addTrace(parsedOpcode);
    this.executeOpcode(parsedOpcode);
  }

  loadRom(rom: ArrayBuffer) {
    this.memory = Array(0x200)
      .fill(0x0)
      .concat(...new Uint8Array(rom));
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
    const pretty = '0x' + raw.toString(16).toUpperCase();
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

  executeOpcode(opcode: Opcode): void {
    // console.log(`executing opcode: ${opcode.pretty}`);
    switch (opcode.i) {
      case 0x0:
        switch (opcode.kk) {
          case 0x00e0:
            return this._00E0();
        }
      case 0x1:
      // return this._1nnn(opcode);
      case 0x6:
        return this._6xkk(opcode);
      case 0x7:
        return this._7xkk(opcode);
      case 0xa:
        return this._Annn(opcode);
      case 0xd:
        return this._Dxyn(opcode);
      default:
        throw new Error(`${opcode.pretty} not implemented`);
    }
  }

  _00E0(): void {
    for (let x = 0; x < this.screen.length; x++) {
      for (let y = 0; y < this.screen.length; y++) {
        this.screen[x][y] = 0;
      }
    }
    this.pc += 2;
  }

  _00EE(opcode: Opcode): void {}

  _0nnn(opcode: Opcode): void {}

  _1nnn(opcode: Opcode): void {
    this.pc = opcode.nnn;
  }

  _2nnn(opcode: Opcode): void {
    this.sp += 1;
    this.stack.push(this.pc);
    this.pc = opcode.nnn;
  }

  _3xkk(opcode: Opcode): void {
    if (this.v[opcode.x] === opcode.kk) {
      this.pc += 4;
    } else {
      this.pc += 2;
    }
  }

  _4xkk(opcode: Opcode): void {
    if (this.v[opcode.x] !== opcode.kk) {
      this.pc += 4;
    } else {
      this.pc += 2;
    }
  }

  _5xy0(opcode: Opcode): void {
    if (this.v[opcode.x] === this.v[opcode.y]) {
      this.pc += 4;
    } else {
      this.pc += 2;
    }
  }

  _6xkk(opcode: Opcode): void {
    this.v[opcode.x] = opcode.kk;
    this.pc += 2;
  }

  _7xkk(opcode: Opcode): void {
    this.v[opcode.x] = (this.v[opcode.x] + opcode.kk) & 0xff;
    this.pc += 2;
  }

  _8xy0(opcode: Opcode): void {}

  _8xy1(opcode: Opcode): void {}

  _8xy2(opcode: Opcode): void {}

  _8xy3(opcode: Opcode): void {}

  _8xy4(opcode: Opcode): void {}

  _8xy5(opcode: Opcode): void {}

  _8xy6(opcode: Opcode): void {}

  _8xy7(opcode: Opcode): void {}

  _8xyE(opcode: Opcode): void {}

  _9xy0(opcode: Opcode): void {}

  _Annn(opcode: Opcode): void {
    this.i = opcode.nnn;
    this.pc += 2;
  }

  _Bnnn(opcode: Opcode): void {}

  _Cxkk(opcode: Opcode): void {}

  _Dxyn(opcode: Opcode): void {
    let row,
      col,
      sprite,
      width = 8,
      height = opcode.n;

    this.v[0xf] = 0;

    for (row = 0; row < height; row++) {
      sprite = this.memory[this.i + row];

      for (col = 0; col < width; col++) {
        if ((sprite & 0x80) > 0) {
          this.screen[this.v[opcode.y] + row][this.v[opcode.x] + col] = 1;

          const int_x = (this.v[opcode.x] + col) & 0xff;
          const int_y = (this.v[opcode.y] + row) & 0xff;

          const previousPixel = this.screen[int_y][int_x];
          const newPixel =
            previousPixel ^ (((sprite & (1 << (7 - this.i))) != 0) as any); // XOR

          this.screen[int_y][int_x] = 1;

          if (previousPixel && !newPixel) {
            this.v[0xf] = 0x01;
          }
        }

        sprite = sprite << 1;
      }
    }

    this.pc += 2;
  }

  _Ex9E(opcode: Opcode): void {}

  _ExA1(opcode: Opcode): void {}

  _Fx07(opcode: Opcode): void {}

  _Fx0A(opcode: Opcode): void {}

  _Fx15(opcode: Opcode): void {}

  _Fx18(opcode: Opcode): void {}

  _Fx1E(opcode: Opcode): void {}

  _Fx29(opcode: Opcode): void {}

  _Fx33(opcode: Opcode): void {}

  _Fx55(opcode: Opcode): void {}

  _Fx65(opcode: Opcode): void {}

  _00Cn(opcode: Opcode): void {}

  _00FB(opcode: Opcode): void {}

  _00FC(opcode: Opcode): void {}

  _00FD(opcode: Opcode): void {}

  _00FE(opcode: Opcode): void {}

  _00FF(opcode: Opcode): void {}

  _Dxy0(opcode: Opcode): void {}

  _Fx30(opcode: Opcode): void {}

  _Fx75(opcode: Opcode): void {}

  _Fx85(opcode: Opcode): void {}
}
