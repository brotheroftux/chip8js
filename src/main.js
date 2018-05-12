import EmulationEngine from './EmulationEngine'
import IOController from './IOController'
import Renderer from './Renderer'

let targetCyclerate = 400
let interval = 0

// initialize emulation
EmulationEngine.initialize()

// initialize renderer
Renderer.setEngine(EmulationEngine)
Renderer.setCanvas('renderer')
Renderer.initialize()

// initialize IO controller
IOController.bindToEngine(EmulationEngine)
IOController.initialize()

function runEmulation () {
    EmulationEngine.emulateCycle()

    if (EmulationEngine.shouldDraw) {
        Renderer.render()
        EmulationEngine.shouldDraw = false
    }
} 

window.emulation = EmulationEngine

// emulation.loadRom([0x71, 0x01, 0x31, 0x05, 0x12, 0x00])

window.cb = () => {
    if (!emulation.emulateCycle())
        return

    console.log('opcode: ', `0x${emulation._opcode.toString(16)}`)
    console.log('V1: ', emulation._V[1])
    console.log('next pc: ', emulation._pc)
}

// setInterval(window.cb, 0)

const $file = document.querySelector('#file')

$file.addEventListener('change', (e) => {
    const file = e.target.files[0]

    const fileReader = new FileReader()

    fileReader.addEventListener('load', (e) => {
        if (interval)
            clearInterval(interval)

        EmulationEngine.wipeState()
        EmulationEngine.loadRom(
            new Uint8Array(e.target.result)
        )

        interval = setInterval(runEmulation, 1000 / targetCyclerate)
    })

    fileReader.readAsArrayBuffer(file)
})

const $stopButton = document.querySelector('#stop')

$stopButton.addEventListener('click', () => {
    if (interval)
        clearInterval(interval)
})

const $changeCyclerateButton = document.querySelector('#setCyclerate')

$changeCyclerateButton.addEventListener('click', () => {
    targetCyclerate = document.querySelector('#cyclerate').value

    if (interval) {
        clearInterval(interval)
        interval = setInterval(runEmulation, 1000 / targetCyclerate)
    }
})