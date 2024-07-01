import Snake from '@/entities/snakes/snake.js'
import Point from '@/entities/point.js'

export default class ClassicSnake extends Snake {
    #lastVector
    #growOnNextStep
    #dead

    constructor(initialSize) {
        super(initialSize)
        this.#lastVector = [0, 1]
        this.#growOnNextStep = false
        this.#dead = false
    }
    
    grow() {
        this.#growOnNextStep = true
    }

    moveLeft() {
        this.move([-1, 0], 'left')
    }

    moveRight() {
        this.move([1, 0], 'right')
    }

    moveTop() {
        this.move([0, 1], 'top')
    }

    moveBottom() {
        this.move([0, -1], 'bottom')
    }

    testCollision() {
        if (this.#dead) {
            return true
        }
        const head = this.chains[0]
        return this.intersect(head)
    }

    move(vector, name) {
        if (this.#dead) {
            throw new Error('Snake is dead')
        }
        if (Math.abs(vector[0]) > 1 || Math.abs(vector[1] > 1)) {
            throw new Error('Incorrect vector')
        }

        if (vector[0] !== 0 && vector[1] !== 0 || vector[0] === 0 && vector[1] === 0) {
            throw new Error('Incorrect vector')
        }

        if (this.#lastVector[0] + vector[0] === 0 && this.#lastVector[0] !== 0 
                || this.#lastVector[1] + vector[1] === 0 && this.#lastVector[1] !== 0) {
            throw new Error(`Snake can\'t move to the ${name}`)
        }

        const headCoord = this.chains[0].coords
        headCoord[0] += vector[0]
        headCoord[1] += vector[1]
        this.chains.unshift(new Point(headCoord[0], headCoord[1]))
        this.#lastVector = vector

        if (!this.#growOnNextStep) {
            this.chains.pop()
        } else {
            this.#growOnNextStep = false
        }

        if (this.testCollision()) {
            this.#dead = true
        }
    }

    get dead() {
        return this.#dead
    }

    kill() {
        this.#dead = true
    }
}