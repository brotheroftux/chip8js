import { parseXY, parseNNN, parseNN } from './parseOpcode'

import math from './math'
import aux from './auxOpcodes'

export default {
    0x00E0: function clearScreen () {
        this.clearScreen()
    },

    0x00EE: function ret () {
        this._pc = this._stack[--this._sp]
    },

    0x1000: function jumpToAddress () {
        this._pc = parseNNN(this._opcode)
        return true
    },
    
    0x2000: function callAddress () {
        this._stack[this._sp++] = this._pc

        this._pc = parseNNN(this._opcode)
        return true
    },

    0x3000: function skipEqualNN () {
        const { x } = parseXY(this._opcode)

        if (this._V[x] === parseNN(this._opcode))
            this._pc += 2
    },

    0x4000: function skipNotEqualNN () {
        const { x } = parseXY(this._opcode)

        if (this._V[x] !== parseNN(this._opcode))
            this._pc += 2
    },

    0x5000: function skipEqualVY () {
        const { x, y } = parseXY(this._opcode)

        if (this._V[x] === this._V[y])
            this._pc += 2
    },

    0x6000: function setVX () {
        const { x } = parseXY(this._opcode)
        
        this._V[x] = parseNN(this._opcode)
    },

    0x7000: function add () {
        const { x } = parseXY(this._opcode)

        this._V[x] = (this._V[x] + parseNN(this._opcode))
    },

    0x8000: math,

    0x9000: function skipNotEqualVY () {
        const { x, y } = parseXY(this._opcode)

        if (this._V[x] !== this._V[y])
            this._pc += 2
    },

    0xA000: function setI () {
        this._index = parseNNN(this._opcode)
    },

    0xB000: function jumpPlusV0 () {
        this._pc = this._V[0] + parseNNN(this._opcode)
        return true
    },

    0xC000: function rand () {
        const { x } = parseXY(this._opcode)

        this._V[x] = Math.floor(Math.random() * 255) & parseNN(this._opcode)
    },

    0xD000: function drawSprite () {
        const { x: xIndex, y: yIndex } = parseXY(this._opcode)
        const height = this._opcode & 0x000F

        const x = this._V[xIndex]
        const y = this._V[yIndex]

        let pixel

        this._V[0xF] = 0 // clear carry

        for (let yLine = 0; yLine < height; yLine++) {
            pixel = this._memory[this._index + yLine]

            for(let xLine = 0; xLine < 8; xLine++) {
                if (pixel & (0x80 >> xLine)) {
                    if (this._graphicsMemory[(x + xLine + ((y + yLine) * 64))])
                        this._V[0xF] = 1           
                       
                    this._graphicsMemory[x + xLine + ((y + yLine) * 64)] ^= 1
                }
            }
        }
 
        this.shouldDraw = true
    },

    0xE000: function skipKeyCond () {
        const { x } = parseXY(this._opcode)

        let flag = false

        switch (this._opcode & 0x00FF) {
            case 0x9E: {
                if (this._keyState[this._V[x]])
                    flag = true

                break
            }

            case 0xA1: {
                if (!this._keyState[this._V[x]])
                    flag = true
                    
                break
            }
        }

        if (flag)
            this._pc += 2
    },

    0xF000: aux
}