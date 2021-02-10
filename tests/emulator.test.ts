import * as _ from 'lodash';
import { expect } from 'chai';
import { Emulator } from '../src/emulator/emulator';

describe('0 series opcodes', () => {});

describe('1nnn', () => {
  it('1nnn - The interpreter sets the program counter to nnn', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x1234);
    emulator._1nnn(opcode);

    expect(emulator.pc).to.equal(opcode.nnn);
  });
});

describe('2nnn', () => {
  it('2nnn - Call subroutine at nnn.', () => {
    const emulator = new Emulator();
    const initialState = _.cloneDeep(emulator);
    const opcode = Emulator.parseOpcode(0x2123);
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
    const opcode = Emulator.parseOpcode(0x3123);
    emulator.v[opcode.x] = 0x23;
    const initialState = _.cloneDeep(emulator);
    emulator._3xkk(opcode);

    expect(emulator.v[opcode.x]).to.equal(opcode.kk);
    expect(emulator.pc).to.equal(initialState.pc + 4);
  });

  it('3xkk - if V[x] !== kk', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x3123);
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
    const opcode = Emulator.parseOpcode(0x4123);
    emulator.v[opcode.x] = 0x24;
    const initialState = _.cloneDeep(emulator);
    emulator._4xkk(opcode);

    expect(emulator.v[opcode.x]).to.not.equal(opcode.kk);
    expect(emulator.pc).to.equal(initialState.pc + 4);
  });

  it('4xkk - if V[x] === kk', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x4123);
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
    const opcode = Emulator.parseOpcode(0x4123);
    emulator.v[opcode.x] = 0x5;
    emulator.v[opcode.y] = 0x5;
    const initialState = _.cloneDeep(emulator);
    emulator._5xy0(opcode);

    expect(emulator.v[opcode.x]).to.equal(emulator.v[opcode.y]);
    expect(emulator.pc).to.equal(initialState.pc + 4);
  });

  it('5xy0 - V[x] !== V[y]', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x4123);
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
      const opcode = Emulator.parseOpcode(0x6123);
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
      const opcode = Emulator.parseOpcode(0x7123);
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
      const opcode = Emulator.parseOpcode(0x6123);
      const initialState = _.cloneDeep(emulator);
      emulator._Annn(opcode);

      expect(emulator.i).to.equal(opcode.nnn);
      expect(emulator.pc).to.equal(initialState.pc + 2);
    });
  });
});

describe.only('8 series opcodes', () => {
  it('8xy0 - Set V[x] = V[y]', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x8120);
    emulator.v[opcode.y] = 0x4;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy0(opcode);

    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.y]);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy1 - Set Vx = Vx OR Vy', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x8121);
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
    const opcode = Emulator.parseOpcode(0x8122);
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
    const opcode = Emulator.parseOpcode(0x8673);
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
    const opcode = Emulator.parseOpcode(0x8674);
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
    const opcode = Emulator.parseOpcode(0x8674);
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
    const opcode = Emulator.parseOpcode(0x8675);
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
    const opcode = Emulator.parseOpcode(0x8675);
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
    const opcode = Emulator.parseOpcode(0x8676);
    emulator.v[opcode.x] = 0x1;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy6(opcode);

    expect(emulator.v[0xf]).to.equal(0x1);
    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.x] / 2);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy6 - Set Vx = Vx SHR 1. - If lsb of V[x] is not 1, set V[f] to 0', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x8676);
    emulator.v[opcode.x] = 0x4;
    const initialState = _.cloneDeep(emulator);
    emulator._8xy6(opcode);

    expect(emulator.v[0xf]).to.equal(0x0);
    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.x] / 2);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xy7 - Set Vx = Vy - Vx, set VF = NOT borrow - If V[y] > V[x], set V[f] to 1', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x8687);
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
    const opcode = Emulator.parseOpcode(0x8687);
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
    const opcode = Emulator.parseOpcode(0x843e);
    emulator.v[opcode.x] = 0x80; // 0x80 is equal to 128, whereby msb is 1
    const initialState = _.cloneDeep(emulator);
    emulator._8xyE(opcode);

    expect(emulator.v[0xf]).to.equal(0x1);
    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.x] * 2);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('8xyE - Set Vx = Vx SHL 1 - If msb of V[x] is not 1, set V[f] to 0', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x843e);
    emulator.v[opcode.x] = 0x11;
    const initialState = _.cloneDeep(emulator);
    emulator._8xyE(opcode);

    expect(emulator.v[0xf]).to.equal(0x0);
    expect(emulator.v[opcode.x]).to.equal(initialState.v[opcode.x] * 2);
    expect(emulator.pc).to.equal(initialState.pc + 2);
  });
});
