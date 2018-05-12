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

export default Renderer