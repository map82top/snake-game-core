export default class Point {
    #x
    #y
    constructor(x, y) {
        if (!Number.isInteger(x)) {
            throw new Error('x value must be integer')
        }

        if (!Number.isInteger(y)) {
            throw new Error('y value must be integer')
        }

        this.#x = x
        this.#y = y
    }

    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    subtract(point) {
        if (!(point instanceof Point)) {
            throw new Error('Expected point instance as argument')
        }

        return new Point(this.x - point.x, this.y - point.y)
    }

    add(point) {
        if (!(point instanceof Point)) {
            throw new Error('Expected point instance as argument')
        }

        return new Point(this.x + point.x, this.y + point.y)
    }

    get coords() {
        return [this.x, this.y]
    }

    equal(point) {
        return this.x === point.x && this.y === point.y
    }
}