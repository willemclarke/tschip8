import * as _ from 'lodash';
import { expect } from 'chai';
import { Emulator } from '../src/emulator/emulator';
import { parseOpcode } from '../src/emulator/opcode';

describe('0 series opcodes', () => {
  it('00E0 - Clear the display', () => {
    const emulator = new Emulator();
    emulator.screen = [[0x1, 0x2, 0x3]];
    const initialState = _.cloneDeep(emulator);
    emulator._00E0();

    expect(emulator.screen).to.deep.equal(
      [...Array(emulator.width)].map((e) => Array(emulator.height).fill(0)),
    );
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('00EE - Return from subroutine', () => {
    const emulator = new Emulator();
    emulator.stack = [0x100, 0x200]; //= 512
    const initialState = _.cloneDeep(emulator);
    emulator._00EE();

    expect(emulator.pc).to.equal((initialState.stack.pop() as number) + 2);
    expect(emulator.sp).to.equal(initialState.sp - 1);
  });
});

describe('1nnn', () => {
  it('1nnn - The interpreter sets the program counter to nnn', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x1234);
    emulator._1nnn(opcode);

    expect(emulator.pc).to.equal(opcode.nnn);
  });
});

describe('2nnn', () => {
  it('2nnn - Call subroutine at nnn.', () => {
    const emulator = new Emulator();
    const initialState = _.cloneDeep(emulator);
    const opcode = parseOpcode(0x2123);
    emulator._2nnn(opcode);

    expect(emulator.sp).to.equal(initialState.sp + 1);
    expect(emulator.stack).to.deep.equal(
      initialState.stack.concat([initialState.pc]),
    );
    expect(emulator.pc).to.equal(opcode.nnn);
  });
});

describe('3xkk - both outcomes', () => {
  it('3xkk - if V[x] === kk', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x3123);
    emulator.v[opcode.x] = 0x23;
    const initialState = _.cloneDeep(emulator);
    emulator._3xkk(opcode);

    expect(emulator.v[opcode.x]).to.equal(opcode.kk);
    expect(emulator.pc).to.equal(initialState.pc + 4);
  });

  it('3xkk - if V[x] !== kk', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x3123);
    emulator.v[opcode.x] = 0x24;
    const initialState = _.cloneDeep(emulator);
    emulator._3xkk(opcode);

    expect(emulator.v[opcode.x]).to.not.equal(opcode.kk);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });
});

describe('4xkk - both outcomes', () => {
  it('4xkk - if V[x] !== kk', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x4123);
    emulator.v[opcode.x] = 0x24;
    const initialState = _.cloneDeep(emulator);
    emulator._4xkk(opcode);

    expect(emulator.v[opcode.x]).to.not.equal(opcode.kk);
    expect(emulator.pc).to.equal(initialState.pc + 4);
  });

  it('4xkk - if V[x] === kk', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x4123);
    emulator.v[opcode.x] = 0x23;
    const initialState = _.cloneDeep(emulator);
    emulator._4xkk(opcode);

    expect(emulator.v[opcode.x]).to.equal(opcode.kk);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });
});

describe('5xyo - both outcomes', () => {
  it('5xy0 - V[x] === V[y]', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x4123);
    emulator.v[opcode.x] = 0x5;
    emulator.v[opcode.y] = 0x5;
    const initialState = _.cloneDeep(emulator);
    emulator._5xy0(opcode);

    expect(emulator.v[opcode.x]).to.equal(emulator.v[opcode.y]);
    expect(emulator.pc).to.equal(initialState.pc + 4);
  });

  it('5xy0 - V[x] !== V[y]', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x4123);
    emulator.v[opcode.x] = 0x5;
    emulator.v[opcode.y] = 0x4;
    const initialState = _.cloneDeep(emulator);
    emulator._5xy0(opcode);

    expect(emulator.v[opcode.x]).to.not.equal(emulator.v[opcode.y]);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  describe('6xkk', () => {
    it('6xkk - Set V[x] = kk ', () => {
      const emulator = new Emulator();
      const opcode = parseOpcode(0x6123);
      const initialState = _.cloneDeep(emulator);
      emulator._6xkk(opcode);

      expect(emulator.v[opcode.x]).to.equal(opcode.kk);
      expect(emulator.pc).to.equal(initialState.pc + 2);
    });
  });

  describe('7xkk', () => {
    it('7xkk - Set V[x] = V[x] + kk', () => {
      // Note V[x] + kk in this case is = 0x4(4) + 0x23(35) === opcode.kk(0x27 = 39)
      const emulator = new Emulator();
      const opcode = parseOpcode(0x7123);
      emulator.v[opcode.x] = 0x4;
      const initialState = _.cloneDeep(emulator);
      emulator._7xkk(opcode);

      expect(emulator.v[opcode.x]).to.equal(
        initialState.v[opcode.x] + opcode.kk,
      );
      expect(emulator.pc).to.equal(initialState.pc + 2);
    });
  });

  describe('Annn', () => {
    it('Annn - Set I = nnn', () => {
      const emulator = new Emulator();
      const opcode = parseOpcode(0x6123);
      const initialState = _.cloneDeep(emulator);
      emulator._Annn(opcode);

      expect(emulator.i).to.equal(opcode.nnn);
      expect(emulator.pc).to.equal(initialState.pc + 2);
    });
  });
});

describe('8 series opcodes', () => {
  it('8xy0 - Set V[x] = V[y]', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8120);
    emulator.v[opcode.y] = 0x4;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy0(opcode);

    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.y]);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy1 - Set Vx = Vx OR Vy', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8121);
    emulator.v[opcode.x] = 0x8;
    emulator.v[opcode.y] = 0x7;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy1(opcode);

    expect(emulator.v[opcode.x]).to.equal(
      initialState.v[opcode.x] | initialState.v[opcode.y],
    );
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy2 - Set Vx = Vx AND Vy', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8122);
    emulator.v[opcode.x] = 0x8;
    emulator.v[opcode.y] = 0x7;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy2(opcode);

    expect(emulator.v[opcode.x]).to.equal(
      initialState.v[opcode.x] & initialState.v[opcode.y],
    );
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy3 - Set Vx = Vx XOR Vy', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8673);
    emulator.v[opcode.x] = 0x7;
    emulator.v[opcode.y] = 0x5;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy3(opcode);

    expect(emulator.v[opcode.x]).to.equal(
      initialState.v[opcode.x] ^ initialState.v[opcode.y],
    );
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy4 - Set Vx = Vx + Vy, set VF = carry - If result of V[x] > 255, set V[f] to 1', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8674);
    emulator.v[opcode.x] = 0x80;
    emulator.v[opcode.y] = 0x80;
    const result = emulator.v[opcode.x] + emulator.v[opcode.y];
    const initialState = _.cloneDeep(emulator);
    emulator._8xy4(opcode);

    expect(result).to.be.greaterThan(255);
    expect(emulator.v[0xf]).to.equal(1);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy4 - Set Vx = Vx + Vy, set VF = carry - If result of V[x] < 255, set V[f] to 0', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8674);
    emulator.v[opcode.x] = 0x80;
    emulator.v[opcode.y] = 0x50;
    const result = emulator.v[opcode.x] + emulator.v[opcode.y];
    const initialState = _.cloneDeep(emulator);
    emulator._8xy4(opcode);

    expect(result).to.not.be.greaterThan(255);
    expect(emulator.v[0xf]).to.equal(0);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy5 - Set Vx = Vx - Vy, set VF = NOT borrow - If V[x] > V[y], set V[f] to 1', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8675);
    emulator.v[opcode.x] = 0x80;
    emulator.v[opcode.y] = 0x50;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy5(opcode);

    expect(emulator.v[0xf]).to.equal(1);
    expect(emulator.v[opcode.x]).to.equal(0x80 - 0x50);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy5 - Set Vx = Vx - Vy, set VF = NOT borrow - If V[x] < V[y], set V[f] to 0', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8675);
    emulator.v[opcode.x] = 0x50;
    emulator.v[opcode.y] = 0x60;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy5(opcode);

    expect(emulator.v[0xf]).to.equal(0);
    expect(emulator.v[opcode.x]).to.equal(0x50 - 0x60);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy6 - Set Vx = Vx SHR 1. - If lsb of V[x] is 1, set V[f] to 1', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8676);
    emulator.v[opcode.x] = 0x1;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy6(opcode);

    expect(emulator.v[0xf]).to.equal(0x1);
    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.x] / 2);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy6 - Set Vx = Vx SHR 1. - If lsb of V[x] is not 1, set V[f] to 0', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8676);
    emulator.v[opcode.x] = 0x4;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy6(opcode);

    expect(emulator.v[0xf]).to.equal(0x0);
    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.x] / 2);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy7 - Set Vx = Vy - Vx, set VF = NOT borrow - If V[y] > V[x], set V[f] to 1', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8687);
    emulator.v[opcode.y] = 0x8;
    emulator.v[opcode.x] = 0x5;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy7(opcode);

    expect(emulator.v[0xf]).to.equal(0x1);
    expect(emulator.v[opcode.x]).to.equal(
      initialState.v[opcode.y] - initialState.v[opcode.x],
    );
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy7 - Set Vx = Vy - Vx, set VF = NOT borrow - If V[y] < V[x], set V[f] to 0', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x8687);
    emulator.v[opcode.y] = 0x5;
    emulator.v[opcode.x] = 0x8;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy7(opcode);

    expect(emulator.v[0xf]).to.equal(0x0);
    expect(emulator.v[opcode.x]).to.equal(
      initialState.v[opcode.y] - initialState.v[opcode.x],
    );
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xyE - Set Vx = Vx SHL 1 - If msb of V[x] is 1, set V[f] to 1', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x843e);
    emulator.v[opcode.x] = 0x80; // 0x80 is equal to 128, whereby msb is 1
    const initialState = _.cloneDeep(emulator);
    emulator._8xyE(opcode);

    expect(emulator.v[0xf]).to.equal(0x1);
    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.x] * 2);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xyE - Set Vx = Vx SHL 1 - If msb of V[x] is not 1, set V[f] to 0', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x843e);
    emulator.v[opcode.x] = 0x11;
    const initialState = _.cloneDeep(emulator);
    emulator._8xyE(opcode);

    expect(emulator.v[0xf]).to.equal(0x0);
    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.x] * 2);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });
});

describe('9xy0', () => {
  it('9xy0 - Skip next instruction if Vx != Vy, PC += 4', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x9450);
    emulator.v[opcode.x] = 0x7;
    emulator.v[opcode.y] = 0x5;
    const initialState = _.cloneDeep(emulator);
    emulator._9xy0(opcode);

    expect(emulator.v[opcode.x]).to.not.equal(emulator.v[opcode.y]);
    expect(emulator.pc).to.equal(initialState.pc + 4);
  });

  it('9xy0 - Skip next instruction if Vx === Vy, PC += 2', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0x9450);
    emulator.v[opcode.x] = 0x7;
    emulator.v[opcode.y] = 0x7;
    const initialState = _.cloneDeep(emulator);
    emulator._9xy0(opcode);

    expect(emulator.v[opcode.x]).to.equal(emulator.v[opcode.y]);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });
});

describe('Annn', () => {
  it('Annn - Set I = nnn.', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xa123);
    const initialState = _.cloneDeep(emulator);
    emulator._Annn(opcode);

    expect(emulator.i).to.equal(opcode.nnn);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });
});

describe('Bnnn', () => {
  it('Bnnn - Jump to location nnn + V0', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xb123);
    emulator.v[0x0] = 0x33;
    emulator._Bnnn(opcode);

    expect(emulator.pc).to.equal(opcode.nnn + emulator.v[0x0]);
  });
});

describe('Cxkk', () => {
  it('Cxkk - Set Vx = random byte AND kk.', () => {
    const emulator = new Emulator();
    const randomNumber = Math.floor(Math.random() * 0xff);
    const opcode = parseOpcode(0xc470);
    const initialState = _.cloneDeep(emulator);
    emulator._Cxkk(opcode, randomNumber);

    expect(emulator.v[opcode.x]).to.equal(randomNumber & opcode.kk);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });
});

describe('E series opcodes', () => {
  it('Ex9e - Skip next instruction if key with the value of Vx is pressed - Key IS pressed', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xe29e);
    emulator.v[opcode.x] = 0x9;
    emulator.keyInput[emulator.v[opcode.x]] = true;
    const initialState = _.cloneDeep(emulator);
    emulator._Ex9E(opcode);

    expect(emulator.keyInput[emulator.v[opcode.x]]).to.equal(true);
    expect(emulator.pc).to.equal(initialState.pc + 4);
  });

  it('Ex9e - Do not skip next instruction if key with the value of Vx is pressed - Key is NOT pressed', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xe29e);
    emulator.v[opcode.x] = 0x9;
    emulator.keyInput[emulator.v[opcode.x]] = false;
    const initialState = _.cloneDeep(emulator);
    emulator._Ex9E(opcode);

    expect(emulator.keyInput[emulator.v[opcode.x]]).to.equal(false);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('Exa1 - Skip next instruction if key with the value of Vx is not pressed - Key is NOT pressed', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xe2a1);
    emulator.v[opcode.x] = 0x9;
    emulator.keyInput[emulator.v[opcode.x]] = false;
    const initialState = _.cloneDeep(emulator);
    emulator._ExA1(opcode);

    expect(emulator.keyInput[emulator.v[opcode.x]]).to.equal(false);
    expect(emulator.pc).to.equal(initialState.pc + 4);
  });

  it('Exa1 - Do not skip next instruction if key with the value of Vx is not pressed - Key Is pressed', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xe2a1);
    emulator.v[opcode.x] = 0x9;
    emulator.keyInput[emulator.v[opcode.x]] = true;
    const initialState = _.cloneDeep(emulator);
    emulator._ExA1(opcode);

    expect(emulator.keyInput[emulator.v[opcode.x]]).to.equal(true);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });
});

describe('F series opcodes', () => {
  it('Fx07 - Set Vx = delay timer value', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xf207);
    emulator.dt = 0x40;
    const initialState = _.cloneDeep(emulator);
    emulator._Fx07(opcode);

    expect(emulator.v[opcode.x]).to.equal(emulator.dt);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  // Note: still need to implement opcode and test
  it('Fx0A - Wait for a key press, store the value of the key in Vx', () => {});

  it('Fx15 - Set delay timer = Vx', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xf215);
    emulator.v[opcode.x] = 0x5;
    const initialState = _.cloneDeep(emulator);
    emulator._Fx15(opcode);

    expect(emulator.dt).to.equal(emulator.v[opcode.x]);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('Fx18 - Set sound timer = Vx', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xf218);
    emulator.v[opcode.x] = 0x5;
    const initialState = _.cloneDeep(emulator);
    emulator._Fx18(opcode);

    expect(emulator.st).to.equal(emulator.v[opcode.x]);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('Fx1e - Set I = I + Vx', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xf21e);
    emulator.i = 0x5;
    emulator.v[opcode.x] = 0x2;
    const initialState = _.cloneDeep(emulator);
    emulator._Fx1E(opcode);

    expect(emulator.i).to.equal(initialState.i + emulator.v[opcode.x]);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('Fx29 - Set I = location of sprite for digit Vx', () => {
    const emulator = new Emulator();
    const opcode = parseOpcode(0xf129);
    emulator.v[opcode.x] = 0x2;
    const initialState = _.cloneDeep(emulator);
    emulator._Fx29(opcode);

    expect(emulator.i).to.equal(initialState.v[opcode.x] * 5);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('Fx33 - Store BCD representation of Vx in memory locations I, I+1, and I+2.', () => {
    const emulator = new Emulator();
    const parsedOpcode = parseOpcode(0xf133);
    emulator.v[parsedOpcode.x] = 0x200;
    const initialState = _.cloneDeep(emulator);
    emulator._Fx33(parsedOpcode);

    expect(emulator.memory[emulator.i]).to.equal(5);
    expect(emulator.memory[emulator.i + 1]).to.equal(1);
    expect(emulator.memory[emulator.i + 2]).to.equal(2);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  // Note: need to figure out way to test
  it('Fx55 - Store registers V0 through Vx in memory starting at location I', () => {});

  it('Fx65 - Read registers V0 through Vx from memory starting at location I.', () => {});
});
