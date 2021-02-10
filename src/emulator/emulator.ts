import _ from 'lodash';
import { Mnemonic, parseOpcode } from './opcode';

export interface OpcodeSummary {
  previous: DebugInfo[];
  current: Opcode;
  next: DebugInfo[];
}

export interface DebugInfo {
  pc: number;
  opcode: Opcode;
}

export interface Opcode {
  mnemonic: Mnemonic;
  description: string;
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

export interface Trace {
  opcode: Opcode;
  pc: number;
  i: number;
  v: number[];

  sp: number;
  stack: number[];
  opcodeSummary: OpcodeSummary;
}

export class Emulator {
  memory: number[];
  pc: number;
  sp: number;
  stack: number[];
  v: number[];
  i: number;
  keyInput: { [key: number]: boolean };
  scale: number;
  width: number;
  height: number;
  screen: number[][];
  trace: Trace;

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
    this.keyInput = {
      0x1: false, // 1
      0x2: false, // 2
      0x3: false, // 3
      0xc: false, // 4
      0x4: false, // Q
      0x5: false, // W
      0x6: false, // E
      0xd: false, // R
      0x7: false, // A
      0x8: false, // S
      0x9: false, // D
      0xe: false, // F
      0xa: false, // Z
      0x0: false, // X
      0xb: false, // C
      0xf: false, // V
    };
    this.scale = 10;
    this.width = 64;
    this.height = 32;
    this.screen = [...Array(this.width)].map((e) => Array(this.height).fill(0));
  }

  step(): void {
    const nextOpcode = this.getNextOpcode();
    this.executeOpcode(nextOpcode);
  }

  loadRom(rom: ArrayBuffer): void {
    this.memory = Array(0x200)
      .fill(0x0)
      .concat(...new Uint8Array(rom));
  }

  getWord16(address: number): number {
    return (this.memory[address] << 8) | this.memory[address + 1];
  }

  getNextOpcode(): Opcode {
    return parseOpcode(this.getWord16(this.pc));
  }

  getOpcodeSummary(opcode: Opcode, pc: number): OpcodeSummary {
    const previous = _.chain(_.range(1, 11))
      .map((i) => {
        return {
          opcode: parseOpcode(this.getWord16(pc - i * 2)),
          pc: pc - i * 2,
        };
      })
      .filter((item) => item.opcode.pretty !== '0x0')
      .reverse()
      .value();

    const next = _.chain(_.range(1, 11))
      .map((i) => {
        return {
          opcode: parseOpcode(this.getWord16(pc + i * 2)),
          pc: pc + i * 2,
        };
      })
      .filter((item) => item.opcode.pretty !== '0x0')
      .value();

    return {
      previous,
      current: opcode,
      next,
    };
  }

  getTrace(): Trace {
    const opcode = this.getNextOpcode();
    console.log('testing wun two ', opcode.pretty);
    const opcodeSummary = this.getOpcodeSummary(opcode, this.pc);

    return {
      opcode,
      pc: this.pc,
      i: this.i,
      v: this.v,
      sp: this.sp,
      stack: this.stack,
      opcodeSummary,
    };
  }

  executeOpcode(opcode: Opcode): void {
    // console.log(`executing opcode: ${opcode.pretty}`);
    switch (opcode.mnemonic) {
      case Mnemonic['00E0']:
        return this._00E0();
      case Mnemonic['00EE']:
        return this._00EE(opcode);
      case Mnemonic['1NNN']:
        return this._1nnn(opcode);
      case Mnemonic['2NNN']:
        return this._2nnn(opcode);
      case Mnemonic['3XKK']:
        return this._3xkk(opcode);
      case Mnemonic['4XKK']:
        return this._4xkk(opcode);
      case Mnemonic['5XY0']:
        return this._5xy0(opcode);
      case Mnemonic['6XKK']:
        return this._6xkk(opcode);
      case Mnemonic['7XKK']:
        return this._7xkk(opcode);
      case Mnemonic['8XY0']:
        return this._8xy0(opcode);
      case Mnemonic['8XY1']:
        return this._8xy1(opcode);
      case Mnemonic['8XY2']:
        return this._8xy2(opcode);
      case Mnemonic['8XY3']:
        return this._8xy3(opcode);
      case Mnemonic['8XY4']:
        return this._8xy4(opcode);
      case Mnemonic['8XY5']:
        return this._8xy5(opcode);
      case Mnemonic['8XY6']:
        return this._8xy6(opcode);
      case Mnemonic['8XY7']:
        return this._8xy7(opcode);
      case Mnemonic['8XYE']:
        return this._8xyE(opcode);
      case Mnemonic['9XY0']:
        return this._9xy0(opcode);
      case Mnemonic['ANNN']:
        return this._Annn(opcode);
      case Mnemonic['BNNN']:
        return this._Bnnn(opcode);
      case Mnemonic['CXKK']:
        return this._Cxkk(opcode);
      case Mnemonic['DXYN']:
        return this._Dxyn(opcode);
      default:
        throw new Error(`${opcode.pretty} not implemented`);
    }
  }

  _00E0(): void {
    this.screen = [...Array(this.width)].map((e) => Array(this.height).fill(0));
    this.pc += 2;
  }

  _00EE(opcode: Opcode): void {
    this.pc = this.stack.pop() as number;
    this.sp -= 1;
  }

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

  _8xy0(opcode: Opcode): void {
    this.v[opcode.x] = this.v[opcode.y];
    this.pc += 2;
  }

  _8xy1(opcode: Opcode): void {
    this.v[opcode.x] |= this.v[opcode.y];
    this.pc += 2;
  }

  _8xy2(opcode: Opcode): void {
    this.v[opcode.x] &= this.v[opcode.y];
    this.pc += 2;
  }

  _8xy3(opcode: Opcode): void {
    this.v[opcode.x] ^= this.v[opcode.y];
    this.pc += 2;
  }

  _8xy4(opcode: Opcode): void {
    const result = (this.v[opcode.x] += this.v[opcode.y]);

    if (result > 255) {
      this.v[0xf] = 1;
    } else {
      this.v[0xf] = 0;
    }
    this.v[opcode.x] = result & 0xff;
    this.pc += 2;
  }

  _8xy5(opcode: Opcode): void {
    const result = this.v[opcode.x] - this.v[opcode.y];

    if (this.v[opcode.x] > this.v[opcode.y]) {
      this.v[0xf] = 1;
    } else {
      this.v[0xf] = 0;
    }
    this.v[opcode.x] = result;
    this.pc += 2;
  }

  _8xy6(opcode: Opcode): void {
    const lsb = this.v[opcode.x] & 1;

    if (lsb === 1) {
      this.v[0xf] = 1;
    } else {
      this.v[0xf] = 0;
    }
    this.v[opcode.x] /= 2;
    this.pc += 2;
  }

  _8xy7(opcode: Opcode): void {
    const result = this.v[opcode.y] - this.v[opcode.x];

    if (this.v[opcode.y] > this.v[opcode.x]) {
      this.v[0xf] = 1;
    } else {
      this.v[0xf] = 0;
    }
    this.v[opcode.x] = result;
    this.pc += 2;
  }

  _8xyE(opcode: Opcode): void {
    const msb = (this.v[opcode.x] & 0xff) >> 7;

    if (msb === 1) {
      this.v[0xf] = 1;
    } else {
      this.v[0xf] = 0;
    }
    this.v[opcode.x] *= 2;
    this.pc += 2;
  }

  _9xy0(opcode: Opcode): void {
    if (this.v[opcode.x] !== this.v[opcode.y]) {
      this.pc += 4;
    } else {
      this.pc += 2;
    }
  }

  _Annn(opcode: Opcode): void {
    this.i = opcode.nnn;
    this.pc += 2;
  }

  _Bnnn(opcode: Opcode): void {
    this.pc = opcode.nnn + this.v[0x0];
  }

  _Cxkk(opcode: Opcode): void {}

  _Dxyn(opcode: Opcode): void {
    const x = this.v[opcode.x] % 64;
    const y = this.v[opcode.y] % 32;
    const n = opcode.n;

    // this.v[0xf] = 0;

    // for (row = 0; row < height; row++) {
    //   sprite = this.memory[this.i + row];

    //   for (col = 0; col < width; col++) {
    //     if ((sprite & 0x80) > 0) {
    //       this.screen[this.v[opcode.y] + row][this.v[opcode.x] + col] = 1;

    //       const int_x = (this.v[opcode.x] + col) & 0xff;
    //       const int_y = (this.v[opcode.y] + row) & 0xff;

    //       const previousPixel = this.screen[int_y][int_x];
    //       const newPixel =
    //         previousPixel ^ (((sprite & (1 << (7 - this.i))) != 0) as any); // XOR

    //       this.screen[int_y][int_x] = 1;

    //       if (previousPixel && !newPixel) {
    //         this.v[0xf] = 0x01;
    //       }
    //     }

    //     sprite = sprite << 1;
    //   }
    // }

    //   for (let col = 0; col < 8; col++) {
    //     this.screen[x][y] = 1;
    //   }
    // }
    console.log(`setting ${x}, ${y} to on`);
    this.screen[x][y] = 1;
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
}
