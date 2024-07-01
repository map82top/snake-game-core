

export default class Room {
    #width
    #height

    constructor(width, height) {
        if (width == null || !Number.isInteger(width) || height == null || !Number.isInteger(height)) {
            throw new Error('Width and Height must be integer values')
        }

        if (width < 10 || height < 10) {
            throw new Error('Each side must be at least 10 points')
        }
        this.#width = width
        this.#height = height
    }

    get width() {
        return this.#width
    }

    get height() {
        return this.#height
    }

    get filledCells() {
        throw new Error('Not implemented!')
    }

    isInside(point) {
        throw new Error('Not implemented!')
    }

    isFree(point) {
        throw new Error('Not implemented!')
    }

    getRandomFreePoint() {
        throw new Error('Not implemented')
    }
}