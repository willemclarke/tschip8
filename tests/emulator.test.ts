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
  it('2nnn - The interpreter increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn.', () => {
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

    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('3xkk - if V[x] !== kk', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x3123);

    emulator.v[opcode.x] = 0x24;
    const initialState = _.cloneDeep(emulator);
    emulator._3xkk(opcode);

    expect(emulator.pc).to.equal(initialState.pc + 1);
  });
});

describe('4xkk - both outcomes', () => {
  it('4xkk - if V[x] !== kk', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x4123);

    emulator.v[opcode.x] = 0x24;
    const initialState = _.cloneDeep(emulator);
    emulator._4xkk(opcode);

    expect(emulator.pc).to.equal(initialState.pc + 2);
  });

  it('4xkk - if V[x] === kk', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x4123);

    emulator.v[opcode.x] = 0x23;
    const initialState = _.cloneDeep(emulator);
    emulator._4xkk(opcode);

    expect(emulator.pc).to.equal(initialState.pc + 1);
  });
});
