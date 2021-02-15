import type { Opcode } from './emulator';

export enum Mnemonic {
  '0x0' = '0x0',
  '00E0' = '00E0',
  '00EE' = '00EE',
  '0NNN' = '0NNN',
  '1NNN' = '1NNN',
  '2NNN' = '2NNN',
  '3XKK' = '3XKK',
  '4XKK' = '4XKK',
  '5XY0' = '5XY0',
  '6XKK' = '6XKK',
  '7XKK' = '7XKK',
  '8XY0' = '8XY0',
  '8XY1' = '8XY1',
  '8XY2' = '8XY2',
  '8XY3' = '8XY3',
  '8XY4' = '8XY4',
  '8XY5' = '8XY5',
  '8XY6' = '8XY6',
  '8XY7' = '8XY7',
  '8XYE' = '8XYE',
  '9XY0' = '9XY0',
  'ANNN' = 'ANNN',
  'BNNN' = 'BNNN',
  'CXKK' = 'CXKK',
  'DXYN' = 'DXYN',
  'EX9E' = 'EX9E',
  'EXA1' = 'EXA1',
  'FX07' = 'FX07',
  'FX0A' = 'FX0A',
  'FX15' = 'FX15',
  'FX18' = 'FX18',
  'FX1E' = 'FX1E',
  'FX29' = 'FX29',
  'FX33' = 'FX33',
  'FX55' = 'FX55',
  'FX65' = 'FX65',
}

export const parseOpcode = (raw: number): Opcode => {
  const pretty = '0x' + raw.toString(16).toUpperCase();
  const hi = (raw & 0xff00) >> 8;
  const lo = raw & 0x00ff;
  const nnn = raw & 0x0fff;
  const n = raw & 0x000f;
  const y = (raw & 0x00f0) >> 4;
  const x = (raw & 0x0f00) >> 8;
  const i = (raw & 0xf000) >> 12;
  const kk = raw & 0x00ff;
  const { mnemonic, description } = parseOpcodeMnemonic(raw);

  return {
    mnemonic,
    description,
    pretty,
    hi,
    lo,
    nnn,
    n,
    x,
    y,
    kk,
    i,
    raw,
  };
};

export const parseOpcodeMnemonic = (
  raw: number,
): { mnemonic: Mnemonic; description: string } => {
  switch ((raw & 0xf000) >> 12) {
    case 0x0:
      switch (raw & 0x00ff) {
        case 0x00e0:
          return {
            mnemonic: Mnemonic['00E0'],
            description: 'CLS',
          };
        case 0x00ee:
          return {
            mnemonic: Mnemonic['00EE'],
            description: 'RET',
          };
      }
      return {
        mnemonic: Mnemonic['0x0'],
        description: 'Nil description',
      };
    case 0x1:
      return {
        mnemonic: Mnemonic['1NNN'],
        description: 'JP addr',
      };
    case 0x2:
      return {
        mnemonic: Mnemonic['2NNN'],
        description: 'Call addr',
      };
    case 0x3:
      return {
        mnemonic: Mnemonic['3XKK'],
        description: 'SE Vx, byte',
      };
    case 0x4:
      return {
        mnemonic: Mnemonic['4XKK'],
        description: 'SNE Vx, byte',
      };
    case 0x5:
      return {
        mnemonic: Mnemonic['5XY0'],
        description: 'SE Vx, byte',
      };
    case 0x6:
      return {
        mnemonic: Mnemonic['6XKK'],
        description: 'LD Vx, byte',
      };
    case 0x7:
      return {
        mnemonic: Mnemonic['7XKK'],
        description: 'ADD Vx, byte',
      };
    case 0x8:
      switch (raw & 0x000f) {
        case 0x0:
          return {
            mnemonic: Mnemonic['8XY0'],
            description: 'LD Vx, Vy',
          };
        case 0x0001:
          return {
            mnemonic: Mnemonic['8XY1'],
            description: 'OR Vx, Vy',
          };
        case 0x0002:
          return {
            mnemonic: Mnemonic['8XY2'],
            description: 'AND Vx, Vy',
          };
        case 0x0003:
          return {
            mnemonic: Mnemonic['8XY3'],
            description: 'XOR Vx, Vy',
          };
        case 0x0004:
          return {
            mnemonic: Mnemonic['8XY4'],
            description: 'ADD Vx, Vy',
          };
        case 0x0005:
          return {
            mnemonic: Mnemonic['8XY5'],
            description: 'SUB Vx, Vy',
          };
        case 0x0006:
          return {
            mnemonic: Mnemonic['8XY6'],
            description: 'SHR Vx, {, Vy}',
          };
        case 0x0007:
          return {
            mnemonic: Mnemonic['8XY7'],
            description: 'SUBN Vx, Vy',
          };
        case 0x000e:
          return {
            mnemonic: Mnemonic['8XYE'],
            description: 'SHL Vx {, Vy}',
          };
      }
    case 0x9:
      return {
        mnemonic: Mnemonic['9XY0'],
        description: 'SNE Vx, Vy',
      };
    case 0xa:
      return {
        mnemonic: Mnemonic['ANNN'],
        description: 'LD I, addr',
      };
    case 0xb:
      return {
        mnemonic: Mnemonic['BNNN'],
        description: 'JP V0, addr',
      };
    case 0xc:
      return {
        mnemonic: Mnemonic['CXKK'],
        description: 'RND Vx, byte',
      };
    case 0xd:
      return {
        mnemonic: Mnemonic['DXYN'],
        description: 'DRW Vx, Vy, nibble',
      };
    case 0xe:
      switch (raw & 0x00ff) {
        case 0x009e:
          return {
            mnemonic: Mnemonic['EX9E'],
            description: 'SKP Vx',
          };
        case 0x00a1:
          return {
            mnemonic: Mnemonic['EXA1'],
            description: 'SKNP Vx',
          };
      }
    case 0xf:
      switch (raw & 0x00ff) {
        case 0x0007:
          return {
            mnemonic: Mnemonic['FX07'],
            description: 'LD Vx, DT',
          };
        case 0x000a:
          return {
            mnemonic: Mnemonic['FX0A'],
            description: 'LD Vx, K',
          };
        case 0x0015:
          return {
            mnemonic: Mnemonic['FX15'],
            description: 'LD DT, Vx',
          };
        case 0x0018:
          return {
            mnemonic: Mnemonic['FX18'],
            description: 'LD ST, Vx',
          };
        case 0x001e:
          return {
            mnemonic: Mnemonic['FX1E'],
            description: 'ADD I, Vx',
          };
        case 0x0029:
          return {
            mnemonic: Mnemonic['FX29'],
            description: 'LD F, Vx',
          };
        case 0x0033:
          return {
            mnemonic: Mnemonic['FX33'],
            description: 'LD B, Vx',
          };
        case 0x0055:
          return {
            mnemonic: Mnemonic['FX55'],
            description: 'LD [I], Vx',
          };
        case 0x0065:
          return {
            mnemonic: Mnemonic['FX65'],
            description: 'LD Vx, [I]',
          };
      }
    default:
      throw new Error(`Couldnt parse mnemonic for 0x${raw.toString(16)}`);
  }
};
