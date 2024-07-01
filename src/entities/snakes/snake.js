import Point from '@/entities/point.js'

export default class Snake {
    #chains = []
    constructor(initialSize = 3) {
        if (!Number.isInteger(initialSize) || initialSize < 1) {
            throw new Error('Snake size can\'t be lower 1')
        }
        this.initialSize = initialSize
        this.createChains()
    }

    createChains() {
        for (let i = 0; i < this.initialSize; i++) {
            this.chains.push(new Point(0, -i))
        }
    }

    grow() {
        throw new Error('Not implented')
    }

    moveLeft() {
        throw new Error('Not implented')
    }

    moveRight() {
        throw new Error('Not implented')
    }

    moveTop() {
        throw new Error('Not implented')
    }

    moveBottom() {
        throw new Error('Not implented')
    }
    
    get dead() {
        throw new Error('Not implemented')
    }

    get kill() {
        throw new Error('Not implemented')
    }

    get length() {
        return this.#chains.length
    }

    intersect(point) {
        if (!(point instanceof Point)) {
            throw new Error('Expected point instance as argument')
        }

        let startIndex = 0;
        if (this.head == point) {
            startIndex = 1
        }

        for (let i = startIndex; i < this.length; i++) {
            if (this.chains[i].equal(point)) {
                return true
            }
        }

        return false
    }

    get head() {
        return this.#chains[0]
    }

    get chains() {
        return this.#chains
    }
}