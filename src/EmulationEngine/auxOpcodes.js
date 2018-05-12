import { parseXY, parseNNN, parseNN } from './parseOpcode'

export default function aux () {
    const { x } = parseXY(this._opcode)

    switch (this._opcode & 0x00FF) {
        case 0x7: {
            this._V[x] = this._delay
            break
        }

        case 0xA: {
            let keyPress = false

            for (let i = 0; i < this._keyState.length; i++) {
                if (this._keyState[i]) {
                    keyPress = true
                    this._V[x] = i
                    break
                }
            }

            if (!keyPress)
                return true

            break
        }

        case 0x15: {
            this._delay = this._V[x]
            break
        }

        case 0x18: {
            this._sound = this._V[x]
            break
        }

        case 0x1E: {
            this._index = (this._index + this._V[x])
            break
        }

        case 0x29: {
            this._index = this._V[x] * 5
            break
        }

        case 0x33: {
            this._memory[this._index] = this._V[x] / 100;
            this._memory[this._index + 1] = (this._V[x] / 10) % 10;
            this._memory[this._index + 2] = (this._V[x] % 100) % 10;
            break
        }

        case 0x55: {
            for (let i = 0; i <= x; i++)
                this._memory[this._index + i] = this._V[i]

            this._index += x + 1
            break
        }

        case 0x65: {
            for (let i = 0; i <= x; i++)
                this._V[i] = this._memory[this._index + i]

            this._index += x + 1
            break
        }
    }
}