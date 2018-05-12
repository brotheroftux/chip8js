/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/EmulationEngine/auxOpcodes.js":
/*!*******************************************!*\
  !*** ./src/EmulationEngine/auxOpcodes.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return aux; });
/* harmony import */ var _parseOpcode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parseOpcode */ "./src/EmulationEngine/parseOpcode.js");


function aux () {
    const { x } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)

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

/***/ }),

/***/ "./src/EmulationEngine/engine.js":
/*!***************************************!*\
  !*** ./src/EmulationEngine/engine.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _opcodes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./opcodes */ "./src/EmulationEngine/opcodes.js");


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
        
        if (!!!_opcodes__WEBPACK_IMPORTED_MODULE_0__["default"][decodedOpcode].call(this))
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

/* harmony default export */ __webpack_exports__["default"] = (EmulationEngine);

/***/ }),

/***/ "./src/EmulationEngine/index.js":
/*!**************************************!*\
  !*** ./src/EmulationEngine/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine */ "./src/EmulationEngine/engine.js");


const engine = new _engine__WEBPACK_IMPORTED_MODULE_0__["default"]()

/* harmony default export */ __webpack_exports__["default"] = (engine);

/***/ }),

/***/ "./src/EmulationEngine/math.js":
/*!*************************************!*\
  !*** ./src/EmulationEngine/math.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return math; });
/* harmony import */ var _parseOpcode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parseOpcode */ "./src/EmulationEngine/parseOpcode.js");


function math () {
    const { x, y } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)

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

/***/ }),

/***/ "./src/EmulationEngine/opcodes.js":
/*!****************************************!*\
  !*** ./src/EmulationEngine/opcodes.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _parseOpcode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parseOpcode */ "./src/EmulationEngine/parseOpcode.js");
/* harmony import */ var _math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math */ "./src/EmulationEngine/math.js");
/* harmony import */ var _auxOpcodes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auxOpcodes */ "./src/EmulationEngine/auxOpcodes.js");





/* harmony default export */ __webpack_exports__["default"] = ({
    0x00E0: function clearScreen () {
        this.clearScreen()
    },

    0x00EE: function ret () {
        this._pc = this._stack[--this._sp]
    },

    0x1000: function jumpToAddress () {
        this._pc = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseNNN"])(this._opcode)
        return true
    },
    
    0x2000: function callAddress () {
        this._stack[this._sp++] = this._pc

        this._pc = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseNNN"])(this._opcode)
        return true
    },

    0x3000: function skipEqualNN () {
        const { x } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)

        if (this._V[x] === Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseNN"])(this._opcode))
            this._pc += 2
    },

    0x4000: function skipNotEqualNN () {
        const { x } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)

        if (this._V[x] !== Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseNN"])(this._opcode))
            this._pc += 2
    },

    0x5000: function skipEqualVY () {
        const { x, y } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)

        if (this._V[x] === this._V[y])
            this._pc += 2
    },

    0x6000: function setVX () {
        const { x } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)
        
        this._V[x] = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseNN"])(this._opcode)
    },

    0x7000: function add () {
        const { x } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)

        this._V[x] = (this._V[x] + Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseNN"])(this._opcode))
    },

    0x8000: _math__WEBPACK_IMPORTED_MODULE_1__["default"],

    0x9000: function skipNotEqualVY () {
        const { x, y } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)

        if (this._V[x] !== this._V[y])
            this._pc += 2
    },

    0xA000: function setI () {
        this._index = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseNNN"])(this._opcode)
    },

    0xB000: function jumpPlusV0 () {
        this._pc = this._V[0] + Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseNNN"])(this._opcode)
        return true
    },

    0xC000: function rand () {
        const { x } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)

        this._V[x] = Math.floor(Math.random() * 255) & Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseNN"])(this._opcode)
    },

    0xD000: function drawSprite () {
        const { x: xIndex, y: yIndex } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)
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
        const { x } = Object(_parseOpcode__WEBPACK_IMPORTED_MODULE_0__["parseXY"])(this._opcode)

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

    0xF000: _auxOpcodes__WEBPACK_IMPORTED_MODULE_2__["default"]
});

/***/ }),

/***/ "./src/EmulationEngine/parseOpcode.js":
/*!********************************************!*\
  !*** ./src/EmulationEngine/parseOpcode.js ***!
  \********************************************/
/*! exports provided: parseXY, parseNNN, parseNN */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseXY", function() { return parseXY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseNNN", function() { return parseNNN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseNN", function() { return parseNN; });
function parseXY (opcode) {
    const x = (opcode & 0x0F00) >> 8
    const y = (opcode & 0x00F0) >> 4

    return { x, y }
}

function parseNNN (opcode) {
    return opcode & 0x0FFF
}

function parseNN (opcode) {
    return opcode & 0x00FF
}

/***/ }),

/***/ "./src/IOController/index.js":
/*!***********************************!*\
  !*** ./src/IOController/index.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const mappings = {
    49: 0x1, // 1
    50: 0x2, // 2
    51: 0x3, // 3
    52: 0xC, // 4

    81: 0x4, // Q
    87: 0x5, // W,
    69: 0x6, // E
    82: 0xD, // R

    65: 0x7, // A
    83: 0x8, // S
    68: 0x9, // D
    70: 0xE, // F

    90: 0xA, // Z
    88: 0x0, // X
    67: 0xB, // C
    86: 0xF  // V
}

class IOController {
    bindToEngine (engine) {
        this._engine = engine
    }

    initialize () {
        document.body.addEventListener('keydown', e => {
            if (mappings.hasOwnProperty(e.which))
                this._engine._keyState[mappings[e.which]] = 1
        })

        document.body.addEventListener('keyup', e => {
            if (mappings.hasOwnProperty(e.which))
                this._engine._keyState[mappings[e.which]] = 0
        })
    }
}

const controller = new IOController()

/* harmony default export */ __webpack_exports__["default"] = (controller);

/***/ }),

/***/ "./src/Renderer/index.js":
/*!*******************************!*\
  !*** ./src/Renderer/index.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderer */ "./src/Renderer/renderer.js");


const renderer = new _renderer__WEBPACK_IMPORTED_MODULE_0__["default"]()

/* harmony default export */ __webpack_exports__["default"] = (renderer);

/***/ }),

/***/ "./src/Renderer/renderer.js":
/*!**********************************!*\
  !*** ./src/Renderer/renderer.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const pixel = 12
const width = 64 * pixel, height = 32 * pixel

class Renderer {
    setCanvas (canvas) {
        this.$canvas = document.getElementById(canvas)
        this.$canvas.width = width
        this.$canvas.height = height

        this._context = this.$canvas.getContext('2d')
    }

    setEngine (engine) {
        this._engine = engine
    }

    initialize () {
        if (!this._context)
            return
        
        this._context.fillStyle = 'black'
        this._context.fillRect(0, 0, width, height)
    }

    render () {
        if (!this._context && !this.memory)
            return

        this._context.fillStyle = 'black'
        this._context.fillRect(0, 0, width, height)

        this._context.fillStyle = 'lime'

        for (let i = 0; i < this._engine._graphicsMemory.length; i++) {
            if (this._engine._graphicsMemory[i]) {
                const coordX = i % 64
                const coordY = Math.floor(i / 64)

                this._context.fillRect(coordX * pixel, coordY * pixel, pixel, pixel)
            }
        }
    }
}

/* harmony default export */ __webpack_exports__["default"] = (Renderer);

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EmulationEngine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EmulationEngine */ "./src/EmulationEngine/index.js");
/* harmony import */ var _IOController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IOController */ "./src/IOController/index.js");
/* harmony import */ var _Renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Renderer */ "./src/Renderer/index.js");




let targetCyclerate = 400
let interval = 0

// initialize emulation
_EmulationEngine__WEBPACK_IMPORTED_MODULE_0__["default"].initialize()

// initialize renderer
_Renderer__WEBPACK_IMPORTED_MODULE_2__["default"].setEngine(_EmulationEngine__WEBPACK_IMPORTED_MODULE_0__["default"])
_Renderer__WEBPACK_IMPORTED_MODULE_2__["default"].setCanvas('renderer')
_Renderer__WEBPACK_IMPORTED_MODULE_2__["default"].initialize()

// initialize IO controller
_IOController__WEBPACK_IMPORTED_MODULE_1__["default"].bindToEngine(_EmulationEngine__WEBPACK_IMPORTED_MODULE_0__["default"])
_IOController__WEBPACK_IMPORTED_MODULE_1__["default"].initialize()

function runEmulation () {
    _EmulationEngine__WEBPACK_IMPORTED_MODULE_0__["default"].emulateCycle()

    if (_EmulationEngine__WEBPACK_IMPORTED_MODULE_0__["default"].shouldDraw) {
        _Renderer__WEBPACK_IMPORTED_MODULE_2__["default"].render()
        _EmulationEngine__WEBPACK_IMPORTED_MODULE_0__["default"].shouldDraw = false
    }
} 

window.emulation = _EmulationEngine__WEBPACK_IMPORTED_MODULE_0__["default"]

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

        _EmulationEngine__WEBPACK_IMPORTED_MODULE_0__["default"].wipeState()
        _EmulationEngine__WEBPACK_IMPORTED_MODULE_0__["default"].loadRom(
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

/***/ })

/******/ });