## Chip8 Emulator written in Typescript and React

Play here: https://ts-chip8.netlify.app/

---

**emulator.ts:**

- houses the Opcode class, which handles all emulator related logic (loading rom, key events & all 36 opcode functions)

**opcode.ts:**

- Deals with parsing a given 2 byte instruction into the Opcode type
- Parses a given opcode and returns its associated mnemonic (e.g. '7xkk') and description (e.g. 'ADD Vx, byte')

**App.tsx**

- Fill in...

---

#### **Reference material used:**

[Cowgod's Chip-8 Technical Reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM#4.0)

- Cowgod spec used for understanding the Chip8 as a whole

[FLIP8 Redux Emulator by Newsdee](http://wallofgame.com/free-online-games/arcade-fullscreen/791/Flip8_Redux_Emulator.html)

- Used to debug my emulator, has many roms including test roms and a nice UI. Highly recommend if you wish to debug when building your own Chip-8.

[Guide to making a CHIP-8 Emulator by Tobias V. Langhoff](https://tobiasvl.github.io/blog/write-a-chip-8-emulator/)

[How to Create Your Very Own Chip-8 Emulator by Eric Grandt](https://www.freecodecamp.org/news/creating-your-very-own-chip-8-emulator/)
