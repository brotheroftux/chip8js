import opcodes from './opcodes'

const MEMORY_SIZE = 4096

const GRAPHICS_COLS = 64
const GRAPHICS_ROWS = 32

const fontset = [0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
                 0x20, 0x60, 0x20, 0x20, 0x70, // 1
                 0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
                 0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
                 0x90, 0x90, 0xF0, 0x10, 0x10, // 4
                 0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
                 0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
                 0xF0, 0x10, 0x20, 0x40, 0x40, // 7
                 0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
                 0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
                 0xF0, 0x90, 0xF0, 0x90, 0x90, // A
                 0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
                 0xF0, 0x80, 0x80, 0x80, 0xF0, // C
                 0xE0, 0x90, 0x90, 0x90, 0xE0, // D
                 0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
                 0xF0, 0x80, 0xF0, 0x80, 0x80] // F

class EmulationEngine {
    constructor () {
        this.wipeState()
    }

    wipeState () {
        this._opcode = 0x0

        // actual memory
        this._memory = new Uint8Array(MEMORY_SIZE)

        // V0 - VF, I
        this._V = new Uint8Array(16)
        this._index = 0x0

        // program counter & stack pointer
        this._pc = 0x200
        this._sp = 0x0

        // graphics memory
        this._graphicsMemory = new Uint8Array(GRAPHICS_COLS * GRAPHICS_ROWS)

        // stack itself
        this._stack = new Uint16Array(16)

        // key states
        this._keyState = new Uint8Array(16)

        // draw flag
        this.shouldDraw = false

        // timers
        this._delay = 0
        this._sound = 0

        // fontset
        for (let i = 0; i < fontset.length; i++)
            this._memory[i] = fontset[i];	
    }

    loadRom (rom) {
        for (let i = 0; i < rom.length; i++)
            this._memory[0x200 + i] = rom[i]
    }

    initialize () {
        this.wipeState()
    }

    clearScreen () {
        this._graphicsMemory = new Uint8Array(GRAPHICS_COLS * GRAPHICS_ROWS)
    }

    emulateCycle () {
        this._opcode = this._memory[this._pc] << 8 | this._memory[this._pc + 1]

        if (!this._opcode)
            return false

        let decodedOpcode = this._opcode & 0xF000

        if (!decodedOpcode)
            decodedOpcode = this._opcode & 0x000F ? 0x00EE : 0x00E0
        
        if (!!!opcodes[decodedOpcode].call(this))
            this._pc += 2

        if (this._delay > 0)
            this._delay--
        
        if (this._sound > 0) {
            if (this._sound === 1)
                console.log('Beep!')
            this._sound--
        }  

        return true
    }
}

export default EmulationEngine