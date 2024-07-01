import GameController from "@/controllers/gameController.js"
import GameMap from "@/presenters/gameMap.js"
import CellType from "@/presenters/cellType.js"
import Snapshot from "@/presenters/snapshot.js"

export default class Presenter {
    #gameController
    #snapshot

    constructor(gameController) {
        this.#gameController = gameController
        this.#gameController.on('update', () => this.updateState())
        this.updateState()
    }

    updateState() {
        this.#snapshot = this.createSnapshot()
    }

    get snapshot() {
        return this.#snapshot
    }

    createSnapshot() {
        let message = null
        if (this.#gameController.youDied) {
            message = 'Game over!'
        } else if (this.#gameController.youWon) {
            message = 'You won!'
        } else if (this.#gameController.paused) {
            message = 'Game paused!'
        }

        return new Snapshot(
            this.createMap(),
            this.convertToViewFormat(this.#gameController.time), 
            this.#gameController.points,
            this.#gameController.level,
            message
        )
    }

    createMap() {
        const room  = this.#gameController.room
        const map = new GameMap(room.width, room.height)
        if (!Array.isArray(room.filledCells)) {
            throw new Error('Room filled cells must be an array')
        }
        room.filledCells.forEach((point) => {
            map.fillCell(point.x, point.y, CellType.WALL)
        })
        
        const snake = this.#gameController.snake
        if (!Array.isArray(snake)) {
            throw new Error('Snake must be an array')
        }
        snake.forEach((chainPoint, index) => {
            if (index === 0 && this.#gameController.youDied) {
                return
            }
            if (index === 0) {
                map.fillCell(chainPoint.x, chainPoint.y, CellType.SNAKE_HEAD)
            } else if (index === snake.length - 1) {
                map.fillCell(chainPoint.x, chainPoint.y, CellType.SNAKE_TAIL)
            } else {
                map.fillCell(chainPoint.x, chainPoint.y, CellType.SNAKE_CHAIN)
            }
        })

        const apple = this.#gameController.apple
        if (apple) {
            map.fillCell(apple.x, apple.y, CellType.APPLE)
        }

        return map
    }

    convertToViewFormat(gameTimestamp) {
        const minutes = Math.floor(gameTimestamp / 60000);
        const seconds = Math.floor((gameTimestamp % 60000) / 1000);
        const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${formattedMinutes}:${formattedSeconds}`;
    }
}