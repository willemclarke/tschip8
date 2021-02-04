import * as _ from 'lodash';
import { expect } from 'chai';
import { Emulator } from '../src/emulator/emulator';

// to.eql = deep equal, which is same as to.deep.equal
// to.equal = strict equal (===)

describe('0 series opcodes', () => {});

describe('1nnn opcode', () => {
  it('1nnn - The interpreter sets the program counter to nnn', () => {
    const emulator = new Emulator();
    const opcode = Emulator.parseOpcode(0x1234);
    emulator._1nnn(opcode);

    expect(emulator.pc).to.equal(opcode.nnn);
  });
});

describe('2nnn opcode', () => {
  it('2nnn - The interpreter increments the stack pointer, then puts the current PC on the top of the stack. The PC is then set to nnn.', () => {
    const emulator = new Emulator();
    const initialState = _.cloneDeep(emulator);
    const opcode = Emulator.parseOpcode(0x2123);
    emulator._2nnn(opcode);

    console.log('sp: ', emulator.sp);
    console.log('initial state sp: ', initialState.sp + 1);

    expect(emulator.sp).to.equal(initialState.sp + 1);
    expect(emulator.stack).to.deep.equal(
      _.concat(initialState.stack, [initialState.pc]),
    );
    expect(emulator.pc).to.equal(opcode.nnn);
  });
});
