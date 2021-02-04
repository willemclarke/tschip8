import * as _ from 'lodash';
import { expect } from 'chai';
import { Emulator } from '../src/emulator/emulator';

// to.eql = deep equal, which is same as to.deep.equal
// to.equal = strict equal (===)

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

  describe.only('6xkk', () => {
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
      const initialState = _.cloneDeep(emulator);
      const opcode = Emulator.parseOpcode(0x6123);
      emulator._Annn(opcode);

      expect(emulator.i).to.equal(opcode.nnn);
      expect(emulator.pc).to.equal(initialState.pc + 2);
    });
  });
});
