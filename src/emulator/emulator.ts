import _ from 'lodash';
import { catchError } from './util';
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
  st: number;
  dt: number;
  opcodeSummary: OpcodeSummary;
}

export class Emulator {
  memory: number[];
  pc: number;
  sp: number;
  stack: number[];
  v: number[];
  i: number;
  st: number;
  dt: number;
  keys: boolean[];
  currentKey: number | false;
  awaitingKeypress: boolean;
  keyInput: { [key: string]: number };
  scale: number;
  width: number;
  height: number;
  screen: number[][];
  trace: Trace;
  paused: boolean;

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
    this.st = 0;
    this.dt = 0;
    this.keys = [];
    this.currentKey = false;
    this.awaitingKeypress = false;
    this.keyInput = {
      ['Digit1']: 0x1, // 1
      ['Digit2']: 0x2, // 2
      ['Digit3']: 0x3, // 3
      ['Digit4']: 0x4, // 4
      ['KeyQ']: 0x5, // Q
      ['KeyW']: 0x6, // W
      ['KeyE']: 0x7, // E
      ['KeyR']: 0x8, // R
      ['KeyA']: 0x9, // A
      ['KeyS']: 0xa, // S
      ['KeyD']: 0xb, // D
      ['KeyF']: 0xc, // F
      ['KeyZ']: 0xd, // Z
      ['KeyX']: 0xe, // X
      ['KeyC']: 0xf, // C
      ['KeyV']: 0x10, // V
    };
    this.scale = 10;
    this.width = 64;
    this.height = 32;
    this.screen = [...Array(this.width)].map((e) => Array(this.height).fill(0));

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (_.includes(Object.keys(this.keyInput), e.code)) {
        this.keys[this.keyInput[e.code]] = true;
        this.currentKey = this.keyInput[e.code];
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (_.includes(Object.keys(this.keyInput), e.code)) {
        this.keys[this.keyInput[e.code]] = false;
        this.currentKey = false;
      }
    });
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
      .map((i) =>
        catchError(() => ({
          opcode: parseOpcode(this.getWord16(pc - i * 2)),
          pc: pc - i * 2,
        })),
      )
      .compact()
      .filter((item) => item.opcode.pretty !== '0x0')
      .reverse()
      .value();

    const next = _.chain(_.range(1, 11))
      .map((i) =>
        catchError(() => ({
          opcode: parseOpcode(this.getWord16(pc + i * 2)),
          pc: pc + i * 2,
        })),
      )
      .compact()
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
    const opcodeSummary = this.getOpcodeSummary(opcode, this.pc);

    return {
      opcode,
      pc: this.pc,
      i: this.i,
      v: this.v,
      sp: this.sp,
      stack: this.stack,
      st: this.st,
      dt: this.dt,
      opcodeSummary,
    };
  }

  executeOpcode(opcode: Opcode): void {
    switch (opcode.mnemonic) {
      case Mnemonic['00E0']:
        return this._00E0();
      case Mnemonic['00EE']:
        return this._00EE();
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
        const randomNumber = Math.floor(Math.random() * 0xff);
        return this._Cxkk(opcode, randomNumber);
      case Mnemonic['DXYN']:
        return this._Dxyn(opcode);
      case Mnemonic['EX9E']:
        return this._Ex9E(opcode);
      case Mnemonic['EXA1']:
        return this._ExA1(opcode);
      case Mnemonic['FX07']:
        return this._Fx07(opcode);
      case Mnemonic['FX0A']:
        return this._Fx0A(opcode);
      case Mnemonic['FX15']:
        return this._Fx15(opcode);
      case Mnemonic['FX18']:
        return this._Fx18(opcode);
      case Mnemonic['FX1E']:
        return this._Fx1E(opcode);
      case Mnemonic['FX29']:
        return this._Fx29(opcode);
      case Mnemonic['FX33']:
        return this._Fx33(opcode);
      case Mnemonic['FX55']:
        return this._Fx55(opcode);
      case Mnemonic['FX65']:
        return this._Fx65(opcode);
      default:
        throw new Error(`${opcode.pretty} not implemented`);
    }
  }

  _00E0(): void {
    this.screen = [...Array(this.width)].map((e) => Array(this.height).fill(0));
    this.pc += 2;
  }

  _00EE(): void {
    // + 2 here as flip8 emulator says return to 202, however their PC is set to 204
    this.pc = (this.stack.pop() as number) + 2;
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

  // According to TESTROM, 8xy5, 8xy6 & 8xye are bugged
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

  _Cxkk(opcode: Opcode, randomNumber: number): void {
    this.v[opcode.x] = randomNumber & opcode.kk;
    this.pc += 2;
  }

  _Dxyn(opcode: Opcode): void {
    const width = 8;
    const height = opcode.raw & 0xf;

    this.v[0xf] = 0;

    for (let row = 0; row < height; row++) {
      let sprite = this.memory[this.i + row];

      for (let col = 0; col < width; col++) {
        // If the bit (sprite) is not 0, render/erase the pixel
        if ((sprite & 0x80) > 0) {
          const x = this.v[opcode.x] + col;
          const y = this.v[opcode.y] + row;
          this.screen[x][y] ^= 1;

          // If the pixel was erased, set VF to 1
          if (this.screen[x][y]) {
            this.v[0xf] = 1;
          }
        }
        sprite <<= 1;
      }
    }

    this.pc += 2;
  }

  _Ex9E(opcode: Opcode): void {
    if (this.keyInput[this.v[opcode.x]]) {
      this.pc += 4;
    } else {
      this.pc += 2;
    }
  }

  _ExA1(opcode: Opcode): void {
    if (!this.keyInput[this.v[opcode.x]]) {
      this.pc += 4;
    } else {
      this.pc += 2;
    }
  }

  _Fx07(opcode: Opcode): void {
    this.v[opcode.x] = this.dt;
    this.pc += 2;
  }

  _Fx0A(opcode: Opcode): void {
    if (!_.isNumber(this.currentKey)) {
      console.log('Awaiting keypress...');
      this.awaitingKeypress = true;
      return;
    } else {
      this.awaitingKeypress = false;
      this.v[opcode.x] = this.currentKey;
      this.pc += 2;
    }
  }

  _Fx15(opcode: Opcode): void {
    this.dt = this.v[opcode.x];
    this.pc += 2;
  }

  _Fx18(opcode: Opcode): void {
    this.st = this.v[opcode.x];
    this.pc += 2;
  }

  _Fx1E(opcode: Opcode): void {
    this.i += this.v[opcode.x];
    this.pc += 2;
  }

  _Fx29(opcode: Opcode): void {
    this.i = this.v[opcode.x] * 5;
    this.pc += 2;
  }

  _Fx33(opcode: Opcode): void {
    const hundreds = Math.floor(this.v[opcode.x] / 100);
    const tens = Math.floor((this.v[opcode.x] % 100) / 10);
    const ones = (this.v[opcode.x] % 100) % 10;

    this.memory[this.i] = hundreds;
    this.memory[this.i + 1] = tens;
    this.memory[this.i + 2] = ones;
    this.pc += 2;
  }

  _Fx55(opcode: Opcode): void {
    for (let registerIndex = 0; registerIndex <= opcode.x; registerIndex++) {
      this.memory[this.i + registerIndex] = this.v[registerIndex];
    }
    this.pc += 2;
  }

  _Fx65(opcode: Opcode): void {
    for (let registerIndex = 0; registerIndex <= opcode.x; registerIndex++) {
      this.v[registerIndex] = this.memory[this.i + registerIndex];
    }
    this.pc += 2;
  }
}
