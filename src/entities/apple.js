import Point from '@/entities/point.js'

export default class Apple {
    #initialLifeTime
    #countTicks
    #spoiled
    #point

    constructor(point, lifeTime) {
        this.#point = point

        if (!(point instanceof Point)) {
            throw new Error('point must be instance of Point')
        }

        if (!Number.isInteger(lifeTime)) {
            throw new Error('lifeTime must be an integer')
        }
        
        if (lifeTime < 1) {
            throw new Error('lifeTime must be greater than 0')
        }

        this.#initialLifeTime = lifeTime
        this.#countTicks = 0
        this.#spoiled = false
    }

    get x() {
        return this.#point.x
    }

    get y() {
        return this.#point.y
    }

    tick() {
        this.#countTicks += 1
        if (this.#initialLifeTime - this.#countTicks <= 0) {
            this.#spoiled = true
        }
    }

    get spoiled() {
        return this.#spoiled
    }

    equal(point) {
        return this.#point.equal(point)
    }
}