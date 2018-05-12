export function parseXY (opcode) {
    const x = (opcode & 0x0F00) >> 8
    const y = (opcode & 0x00F0) >> 4

    return { x, y }
}

export function parseNNN (opcode) {
    return opcode & 0x0FFF
}

export function parseNN (opcode) {
    return opcode & 0x00FF
}