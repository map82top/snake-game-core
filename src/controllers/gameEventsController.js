import Controller from "@/controllers/controller.js"

export default class GameEventsController extends Controller {
    #level
    #points
    #winPoints
    #pointsToNewLevel

    constructor(winPoints = 100, pointsToNewLevel = 10) {
        super()
        this.#level = 1
        this.#points = 0
        this.#winPoints = winPoints
        this.#pointsToNewLevel = pointsToNewLevel
    }

    get level() {
        return this.#level
    }

    get points() {
        return this.#points
    }

    get youWon() {
        return this.#points >= this.#winPoints
    }

    reward() {
        this.#points += 1
        const newLevel = Math.floor(this.#points / this.#pointsToNewLevel) + 1 
        if (newLevel > this.#level) {
            this.#level = newLevel
            this.getListeners('newLevel').forEach(listener => listener(this, newLevel))
        }

        if (this.youWon) {
            this.getListeners('win').forEach(listener => listener(this))
        }
    }
}