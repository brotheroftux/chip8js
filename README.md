# chip8js

## CHIP-8 Emulator designed to work in your web browser

### Running the demo

Clone the repository, open `index.html` with your browser. That's it!

Select a ROM file on your disk and enjoy.

You can adjust the cyclerate of the emulation with the controls in the demo.

### Embedding the emulator

This whole project consists of three parts.

- *EmulationEngine*, the emulator class itself.
- *Renderer*, canvas-based graphics output.
- *IOController*, keyboard event handler which binds to `document.body`.

You can replace *Renderer* and *IOController* with your own implementations if
needed.

#### EmulationEngine API

```js
import EmulationEngine from './EmulationEngine'

// initialize the engine
// alias for EmulationEngine.wipeState(), the difference is semantics
EmulationEngine.initialize()

// load the ROM
// the ROM should be either Uint8Array or a normal array of ROM data bytes
// (this sample ROM adds 1 to V1 until 5 is accumulated)
EmulationEngine.loadRom([0x71, 0x01, 0x31, 0x05, 0x12, 0x00])

// emulate one cycle
// returns false if a NOOP (0x0000) was hit, otherwise true
EmulationEngine.emulateCycle()

// graphics memory buffer, useful if you want to 
// override the existing Renderer implementation
EmulationEngine._graphicsMemory

// key states buffer, useful if you want to override
// the existing IOController implementation
EmulationEngine._keyState
```