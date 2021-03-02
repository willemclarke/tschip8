import _ from 'lodash';
import { catchError } from './util';
import { Mnemonic, parseOpcode, Opcode } from './opcode';
import { Audio } from './audio';

export interface OpcodeSummary {
  previous: DebugInfo[];
  current: Opcode;
  next: DebugInfo[];
}

export interface DebugInfo {
  pc: number;
  opcode: Opcode;
}

export interface Trace {
  opcode: Opcode;
  pc: number;
  i: number;
  v: Uint8Array;
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
  v: Uint8Array;
  i: number;
  st: number;
  dt: number;
  keys: boolean[];
  currentKey: number | null;
  awaitingKeypress: boolean;
  onNextKeyPress: null | ((key: number) => void);
  keyInput: { [key: string]: number };
  scale: number;
  width: number;
  height: number;
  screen: number[];
  trace: Trace;
  audio: Audio;

  constructor() {
    this.reset();
  }

  reset() {
    this.memory = [];
    this.pc = 0x200;
    this.sp = 0;
    this.stack = [];
    this.v = new Uint8Array(0x10);
    this.i = 0;
    this.st = 0;
    this.dt = 0;
    this.keys = [];
    this.awaitingKeypress = false;
    this.onNextKeyPress = null;
    this.keyInput = {
      ['Digit1']: 0x1,
      ['Digit2']: 0x2,
      ['Digit3']: 0x3,
      ['Digit4']: 0x4,
      ['KeyQ']: 0x5,
      ['KeyW']: 0x6,
      ['KeyE']: 0x7,
      ['KeyR']: 0x8,
      ['KeyA']: 0x9,
      ['KeyS']: 0xa,
      ['KeyD']: 0xb,
      ['KeyF']: 0xc,
      ['KeyZ']: 0xd,
      ['KeyX']: 0xe,
      ['KeyC']: 0xf,
      ['KeyV']: 0x10,
    };
    this.scale = 10;
    this.width = 64;
    this.height = 32;
    this.screen = new Array(this.width * this.height);
    this.audio = new Audio();

    // Note: if this approach can be improved, refer back to master code
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.onKeyDown(e), false;
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.onKeyUp(e), false;
    });
  }

  // New method based off tutorial
  isKeyPressed(keyCode: number): boolean {
    return this.keys[keyCode];
  }

  onKeyDown(e: KeyboardEvent): void {
    const key: number | undefined = this.keyInput[e.code];
    this.keys[key] = true;

    if (this.onNextKeyPress !== null && key) {
      this.onNextKeyPress(key);
      this.onNextKeyPress = null;
    }
  }

  onKeyUp(e: KeyboardEvent): void {
    this.keys[this.keyInput[e.code]] = false;
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

  loadFontSprites(): void {
    const sprites = [
      0xf0,
      0x90,
      0x90,
      0x90,
      0xf0, // 0
      0x20,
      0x60,
      0x20,
      0x20,
      0x70, // 1
      0xf0,
      0x10,
      0xf0,
      0x80,
      0xf0, // 2
      0xf0,
      0x10,
      0xf0,
      0x10,
      0xf0, // 3
      0x90,
      0x90,
      0xf0,
      0x10,
      0x10, // 4
      0xf0,
      0x80,
      0xf0,
      0x10,
      0xf0, // 5
      0xf0,
      0x80,
      0xf0,
      0x90,
      0xf0, // 6
      0xf0,
      0x10,
      0x20,
      0x40,
      0x40, // 7
      0xf0,
      0x90,
      0xf0,
      0x90,
      0xf0, // 8
      0xf0,
      0x90,
      0xf0,
      0x10,
      0xf0, // 9
      0xf0,
      0x90,
      0xf0,
      0x90,
      0x90, // A
      0xe0,
      0x90,
      0xe0,
      0x90,
      0xe0, // B
      0xf0,
      0x80,
      0x80,
      0x80,
      0xf0, // C
      0xe0,
      0x90,
      0x90,
      0x90,
      0xe0, // D
      0xf0,
      0x80,
      0xf0,
      0x80,
      0xf0, // E
      0xf0,
      0x80,
      0xf0,
      0x80,
      0x80, // F
    ];
    _.forEach(sprites, (sprite, index) => (this.memory[index] = sprite));
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

  playSound() {
    if (this.st > 0) {
      this.audio.play(440);
    } else {
      this.audio.stop();
    }
  }

  updateDelayAndSoundTimers(): void {
    this.dt > 0 ? (this.dt -= 1) : this.dt;
    this.st > 0 ? (this.st -= 1) : this.st;
  }

  step(): void {
    const nextOpcode = this.getNextOpcode();
    this.loadFontSprites();
    this.executeOpcode(nextOpcode);
    this.updateDelayAndSoundTimers();
    this.playSound();
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
    this.screen = new Array(this.width * this.height);
    this.pc += 2;
  }

  _00EE(): void {
    // + 2 here to mimic the values of the flip8
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
    this.v[opcode.x] = this.v[opcode.x] + opcode.kk;
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

  // Note: as this.v is of type Uint8Array, if result > 8 bits (overflows)
  // the Uint8Array will automatically take the lower rightmost 8 bits
  _8xy4(opcode: Opcode): void {
    const result = (this.v[opcode.x] += this.v[opcode.y]);

    if (result > 255) {
      this.v[0xf] = 1;
    } else {
      this.v[0xf] = 0;
    }

    this.v[opcode.x] = result;
    this.pc += 2;
  }

  // Note: like 8xy4, Uint8Array type of this.v will handle
  // the underflow: e.g. -1 equals 255, -2 equals 254
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

  setPixel(x: number, y: number): boolean {
    if (x > this.width) {
      x -= this.width;
    } else if (x < 0) {
      x += this.width;
    }

    if (y > this.height) {
      y -= this.height;
    } else if (y < 0) {
      y += this.height;
    }

    const location = x + y * this.width;

    this.screen[location] ^= 1;

    return !this.screen[location];
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

          if ((sprite & 0x80) > 0) {
            // If setPixel returns 1, which means a pixel was erased, set VF to 1
            if (this.setPixel(x, y)) {
              this.v[0xf] = 1;
            }
          }
        }
        sprite <<= 1;
      }
    }
    this.pc += 2;
  }

  // Note: if this approach is not optimal, start back from code on master
  _Ex9E(opcode: Opcode): void {
    if (this.isKeyPressed(this.v[opcode.x])) {
      this.pc += 4;
    } else {
      this.pc += 2;
    }
  }

  _ExA1(opcode: Opcode): void {
    if (!this.isKeyPressed(this.v[opcode.x])) {
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
    this.awaitingKeypress = true;

    this.onNextKeyPress = (key) => {
      this.awaitingKeypress = false;
      this.v[opcode.x] = key;
      this.pc += 2;
    };
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
