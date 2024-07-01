import Room from '@/entities/rooms/room.js'
import Point from '@/entities/point.js'

export default class BorderedRoom extends Room {
    #walls = []
    constructor(width, height) {
        super(width, height)

        for (let i = 0; i < this.width; i++) {
            this.#walls.push(new Point(i, 0))
            this.#walls.push(new Point(i, this.height - 1))
        }

        for (let i = 1; i < this.height - 1; i++) {
            this.#walls.push(new Point(0, i))
            this.#walls.push(new Point(this.width - 1, i))
        }
    }

    isInside(point) {
        if (!point) {
            throw new Error('Argument is empty')
        }

        if (!(point instanceof Point)) {
            throw new Error('Argument must be an instance of Point')
        }

        return 0 < point.x && point.x < this.width - 1 && 0 < point.y && point.y < this.height - 1
    }

    get filledCells() {
        return this.#walls
    }

    isFree(point) {
        return this.isInside(point)
    }

    getRandomFreePoint() {
        const xPoint = this.getRandomInt(1, this.width - 2)
        const yPoint = this.getRandomInt(1, this.height - 2)
        return new Point(xPoint, yPoint)
    }

    getRandomInt(minValue, maxValue) {
        return Math.floor(Math.random() * (maxValue - minValue)) + minValue
    }
}