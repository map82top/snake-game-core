export default class CellType {
    static #empty = 0
    static #snakeHead = 1
    static #snakeChain = 2
    static #snakeTail = 3
    static #wall = 4
    static #apple = 5

    static get EMPTY() {
        return this.#empty
    }

    static get SNAKE_HEAD() {
        return this.#snakeHead
    }

    static get SNAKE_CHAIN() {
        return this.#snakeChain
    }

    static get SNAKE_TAIL() {
        return this.#snakeTail
    }

    static get WALL() {
        return this.#wall
    }

    static get APPLE() {
        return this.#apple
    }
}
