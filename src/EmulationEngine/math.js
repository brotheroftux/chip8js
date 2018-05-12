import { parseXY, parseNNN, parseNN } from './parseOpcode'

export default function math () {
    const { x, y } = parseXY(this._opcode)

    switch (this._opcode & 0x000F) {
        // VX = VY
        case 0: {
            this._V[x] = this._V[y]
            break
        }

        // VX = VX | VY
        case 1: {
            this._V[x] |= this._V[y]
            break
        }

        // VX = VX & VY
        case 2: {
            this._V[x] &= this._V[y]
            break
        }

        // VX = VX ^ VY
        case 3: {
            this._V[x] ^= this._V[y]
            break
        }

        // addc
        case 4: {
            if (this._V[x] + this._V[y] > 255)
                this._V[0xF] = 1 // stc
            else
                this._V[0xF] = 0 // clc

            this._V[x] = (this._V[x] + this._V[y])
            break
        }

        case 5: {
            if (this._V[y] > this._V[x])
                this._V[0xF] = 1 // stc
            else
                this._V[0xF] = 0 // clc

            this._V[x] = (this._V[x] - this._V[y])
            break
        }

        case 6: {
            this._V[0xF] = this._V[x] & 0x1
            this._V[x] >>= 1
            break
        }

        case 7: {
            if (this._V[x] > this._V[y])
                this._V[0xF] = 1 // stc
            else
                this._V[0xF] = 0 // clc

            this._V[x] = (this._V[y] - this._V[x])
            break
        }

        case 0xe: {
            this._V[0xF] = this._V[x] >> 7
            this._V[x] <<= 1
            break
        }
    }
}