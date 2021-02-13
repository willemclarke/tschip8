export const parseOpcodeDescription = (opcode: number) => {
  switch ((opcode & 0xf000) >> 12) {
    case 0x0:
      switch (opcode & 0xff00) {
        case 0x00e0:
          return 'CLS';
        case 0x00ee:
          return 'RET';
      }
      return '';
    case 0x1:
      return 'JP addr';
    case 0x2:
      return 'CALL addr';
    case 0x3:
      return 'SE Vx, byte';
    case 0x4:
      return 'SNE Vx, byte';
    case 0x5:
      return 'SE Vx, Vy';
    case 0x6:
      return 'LD Vx, byte';
    case 0x7:
      return 'ADD Vx, byte';
    case 0x8:
      switch (opcode & 0x000f) {
        case 0x0:
          return 'LD Vx, Vy';
        case 0x0001:
          return 'OR Vx, Vy';
        case 0x0002:
          return 'AND Vx, Vy';
        case 0x0003:
          return 'XOR Vx, Vy';
        case 0x0004:
          return 'ADD Vx, Vy';
        case 0x0005:
          return 'SUB Vx, Vy';
        case 0x0006:
          return 'SHR Vx {, Vy}';
        case 0x0007:
          return 'SUBN Vx, Vy';
        case 0x000e:
          return 'SHL Vx {, Vy}';
      }
    case 0x9:
      return 'SNE Vx, Vy';
    case 0xa:
      return 'LD I, addr';
    case 0xb:
      return 'JP V0, addr';
    case 0xc:
      return 'RND Vx, byte';
    case 0xd:
      return 'DRW Vx, Vy, nibble';
    case 0xe:
      switch (opcode & 0xff00) {
        case 0x009e:
          return 'SKP Vx';
        case 0x00a1:
          return 'SKNP Vx';
      }
    case 0xf:
      switch (opcode & 0xff00) {
        case 0x0007:
          return 'LD Vx, DT';
        case 0x000a:
          return 'LD Vx, K';
        case 0x0015:
          return 'LD DT, Vx';
        case 0x0018:
          return 'LD ST, Vx';
        case 0x001e:
          return 'ADD I, Vx';
        case 0x0029:
          return 'LD F, Vx';
        case 0x0033:
          return 'LD B, Vx';
        case 0x0055:
          return 'LD [I], Vx';
        case 0x0065:
          return 'LD Vx, [I]';
      }
    default:
      `Couldn't provide description for 0x${opcode.toString(16)}`;
  }
};
