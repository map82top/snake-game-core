import ClassicSnake from "@/entities/snakes/classicSnake.js"

export default class SnakeFactory {
    static createSnake(type, initialSize) {
        switch(type) {
            case "classic":
                return new ClassicSnake(initialSize)
            default:
                throw new Error('Not supported snake type: ' + type)
        }
    }

    static isSupported(type) {
        return ['classic'].includes(type)
    }
}