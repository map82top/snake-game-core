import Controller from '@/controllers/controller.js'

export default class GameTimer extends Controller {
    #intervalId
    #paused = false
    #gameTimestamp = 0
    #lastTimestamp = null
    #delay

    constructor(delay) {
        super()
        if (!Number.isInteger(delay)) {
            throw new Error('delay must be integer')
        }
        if (delay < 10) {
            throw new Error('delay must be greater 10')
        }
        this.#intervalId = null
        this.#delay = delay
    }

    start() {
        if (this.active) {
            if (this.#paused) {
                this.#lastTimestamp = new Date().getTime()
                this.#paused = false
            } else {
                throw new Error('Timer already started')
            }
        } else {
            this.#lastTimestamp = new Date().getTime()
            this.#intervalId = setInterval(() => this.tick(), this.#delay)
        }
    }

    pause() {
        this.tick()
        this.#paused = true
    }

    stop() {
        if (!this.#intervalId) {
            throw new Error('Timer isn\'t running')
        }
        clearInterval(this.#intervalId)
        this.#intervalId = null
    }

    tick() {
        if (this.#paused) {
            return
        }

        const currentTimestamp = new Date().getTime()
        const deltaTimestamp = currentTimestamp - this.#lastTimestamp
        this.#gameTimestamp += deltaTimestamp

        this.getListeners('tick').forEach(listener => listener(this, deltaTimestamp))
        this.#lastTimestamp = currentTimestamp
    }

    get active() {
        return this.#intervalId != null
    }

    get paused() {  
        return this.#paused
    }

    get time() {
        return this.#gameTimestamp
    }

}