import Apple from '@/entities/apple.js'
import SnakeFactory from '@/factories/snakeFactory.js'
import RoomFactory from '@/factories/roomFactory.js'
import GameTimer from '@/controllers/gameTimer.js'
import GameEventsController from '@/controllers/gameEventsController.js'
import Point from '@/entities/point.js'
import Controller from '@/controllers/controller.js'
import SpeedController from '@/controllers/speedController.js'

class Move {
    static #top = "top"
    static #bottom = "bottom"
    static #left = "left"
    static #right = "right"

    static get TOP() {
        return this.#top
    }

    static get BOTTOM() {
        return this.#bottom
    }

    static get LEFT() {
        return this.#left
    }

    static get RIGHT() {
        return this.#right
    }
}

function isNumber(n){
    return Number(n) === n
}

export default class GameController extends Controller {
    static defaultSettings = {
        initialSnakeSize: 3,
        roomWidth: 64,
        roomHeight: 64,
        appleLifeTime: 100,
        snakeType: 'classic',
        roomType: 'bordered',
        winPoints: 100,
        pointsToNewLevel: 10,
        initialSpeed: 2,
        speedAccelerationStep: 0.5
    }

    #settings
    #timePassedSinceLastMove = 0

    #snake
    #room
    #apple

    #timer = null
    #gameEventsController
    #speedController
    #moveDirection = Move.TOP
    #headInitialPos = null

    static TIMER_DELTA = 10

    constructor(settings) {
        super()
        this.#settings = this.mergeWithDefault(settings)
        this.validateSettings(this.settings)

        this.#snake = SnakeFactory.createSnake(this.settings.snakeType, this.settings.initialSnakeSize)
        this.#room = RoomFactory.createRoom(this.settings.roomType, this.settings.roomWidth, this.settings.roomHeight)
        this.#headInitialPos = this.calculateSnakeHeadInitialPosition()
        
        this.#speedController = new SpeedController(this.settings.initialSpeed, this.settings.speedAccelerationStep)
        this.#timer = new GameTimer(GameController.TIMER_DELTA)
        this.#timer.on('tick', (timer, deltaTimestamp) => this.onTick(deltaTimestamp))
        this.#gameEventsController = new GameEventsController(this.settings.winPoints, this.settings.pointsToNewLevel)
        this.#gameEventsController.on('newLevel', (controller, newLevel) => this.onNewLevel(newLevel))
        this.#gameEventsController.on('win', (controller) => this.onWin())
    }

    get settings() {
        return this.#settings
    }

    get apple() {
        return this.#apple
    }

    get snake() {
        return this.#snake.chains.map(chain => chain.add(this.#headInitialPos))
    }

    get room() {
        return this.#room
    }

    get points() {
        return this.#gameEventsController.points
    }

    get level() {
        return this.#gameEventsController.level
    }

    get time() {
        return this.#timer.time
    }

    get youWon() {
        return this.#gameEventsController.youWon
    }

    get youDied()  {
        return this.#snake.dead
    }

    get active() {
        return this.#timer.active
    }

    get paused() {
        return this.#timer.paused
    }

    get snakeHeadPosition() {
        return this.#headInitialPos.add(this.#snake.head)
    }

    static get MAX_SUPPORTED_SPEED() {
        return SpeedController.MAX_SUPPORTED_SPEED
    }

    mergeWithDefault(settings) {
        const defaultSettings = GameController.defaultSettings
        const getFirstNonNull = (optionA, optionB) =>{
            if (optionA != null) {
                return optionA
            } else {
                return optionB
            }
        }
        return {
            initialSnakeSize: getFirstNonNull(settings.initialSnakeSize, defaultSettings.initialSnakeSize),
            roomHeight: getFirstNonNull(settings.roomHeight, defaultSettings.roomHeight),
            roomWidth: getFirstNonNull(settings.roomWidth, defaultSettings.roomWidth),
            appleLifeTime: getFirstNonNull(settings.appleLifeTime, defaultSettings.appleLifeTime),
            snakeType: getFirstNonNull(settings.snakeType, defaultSettings.snakeType),
            roomType: getFirstNonNull(settings.roomType, defaultSettings.roomType),
            winPoints: getFirstNonNull(settings.winPoints, defaultSettings.winPoints),
            pointsToNewLevel: getFirstNonNull(settings.pointsToNewLevel, defaultSettings.pointsToNewLevel),
            initialSpeed: getFirstNonNull(settings.initialSpeed, defaultSettings.initialSpeed),
            speedAccelerationStep: getFirstNonNull(settings.speedAccelerationStep, defaultSettings.speedAccelerationStep)
        }
    }

    validateSettings() {
        if (!Number.isInteger(this.settings.initialSnakeSize)) {
            throw new Error('Initial snake size must be integer')
        }

        if (!Number.isInteger(this.settings.roomWidth)) {
            throw new Error('Room width must be integer')
        }

        if (!Number.isInteger(this.settings.roomHeight)) {
            throw new Error('Room height must be integer')
        }

        if (!Number.isInteger(this.settings.appleLifeTime)) {
            throw new Error('Apple life time must be integer')
        }

        if (!Number.isInteger(this.settings.winPoints)) {
            throw new Error('Win points must be integer')
        }

        if (!Number.isInteger(this.settings.pointsToNewLevel)) {
            throw new Error('Points to new level must be integer')
        }

        if (this.settings.initialSnakeSize * 2 > this.settings.roomHeight) {
            throw new Error('Initial snake size must be lower half height of room');
        }

        if (!SnakeFactory.isSupported(this.settings.snakeType)) {
            throw new Error('Incorrect snake type')
        }

        if (!RoomFactory.isSupported(this.settings.roomType)) {
            throw new Error('Incorrect room type')
        }

        if (this.settings.winPoints < 1) {
            throw new Error('Win points must be greater than 0')
        }

        if (this.settings.pointsToNewLevel < 1) {
            throw new Error('Points to new level must be greater than 0')
        }

        if (!isNumber(this.settings.initialSpeed)) {
            throw new Error('Speed acceleration step must be interger or float number')
        }

        if (this.settings.initialSpeed <= 1) {
            throw new Error('Initial speed must be greater or equal than 1')
        }

        if (!isNumber(this.settings.speedAccelerationStep)) {
            throw new Error('Speed acceleration step must be interger or float number')
        }

        if (this.settings.speedAccelerationStep <= 0) {
            throw new Error('Speed acceleration step must be greater than 0')
        }

        if (this.settings.initialSpeed > SpeedController.MAX_SUPPORTED_SPEED) {
            throw new Error(`Initial speed must be equal or lower than ${SpeedController.MAX_SUPPORTED_SPEED}`)
        }

        if (this.settings.speedAccelerationStep > this.settings.initialSpeed) {
            throw new Error('Speed acceleration step can not be greater than initial speed')
        }

        if (this.settings.appleLifeTime < 10) {
            throw new Error('Apple life time must be greater 9')
        }
    }

    calculateSnakeHeadInitialPosition() {
        const halfX = Math.ceil((this.#room.width - 2) / 2)
        const halfY = Math.ceil((this.#room.height - 2) / 2)
        const topChainsLength = Math.ceil((this.#snake.length - 1) / 2)
        const bottomChainsLength = (this.#snake.length - 1) % 2

        const freeToPutSnake = (xOffset) => {
            if (!this.#room.isFree(new Point(halfX + xOffset, halfY))) {
                return false;
            }

            for (let topOffset = 1; topOffset <= topChainsLength; topOffset++) {
                if (!this.#room.isFree(new Point(halfX + xOffset, halfY + topOffset))) {
                    return false;
                }
            }

            for (let bottomOffset = 1; bottomOffset <= bottomChainsLength; bottomOffset++) {
                if (!this.#room.isFree(new Point(halfX + xOffset, halfY - bottomOffset))) {
                    return false;
                }
            }
            return true;
        }

        if (freeToPutSnake(0)) {
            return new Point(halfX, halfY + topChainsLength)
        }

        for (let xOffset = 1; xOffset <= halfX; xOffset++) {
            if (halfX + xOffset < this.#room.width && freeToPutSnake(xOffset)) {
                return new Point(halfX + xOffset , halfY + topChainsLength)
            }

            if (halfX - xOffset >= 0 && freeToPutSnake(-xOffset)) {
                return new Point(halfX - xOffset, halfY + topChainsLength)
            }
        }

        throw new Error('Free line didn\'t find');
        
    }

    createNewApple() {
        const maxIterations = 100
        let freePoint = null;
        let i = 0
        while (i < maxIterations) {
            freePoint = this.#room.getRandomFreePoint()
            const pointInLocalSnakeCoord = freePoint.subtract(this.#headInitialPos)
            if (!this.#snake.intersect(pointInLocalSnakeCoord)) {
                break
            }
            i++
        }

        if (i >= maxIterations) {
            throw new Error('Too much iterations of finding new apple place!')
        }

        return new Apple(freePoint, this.settings.appleLifeTime)
    }

    moveLeft() {
        debugger
        if (this.finished || !this.active || this.paused) {
            return;
        }

        if (this.#moveDirection === Move.RIGHT) {
            return;
        }

        this.#moveDirection = Move.LEFT
    }

    moveRight() {
        if (this.finished || !this.active || this.paused) {
            return;
        }

        if (this.#moveDirection === Move.LEFT) {
            return;
        }

        this.#moveDirection = Move.RIGHT
    }

    moveTop() {
        if (this.finished || !this.active || this.paused) {
            return;
        }

        if (this.#moveDirection === Move.BOTTOM) {
            return;
        }

        this.#moveDirection = Move.TOP
    }

    moveBottom() {
        if (this.finished || !this.active || this.paused) {
            return;
        }

        if (this.#moveDirection === Move.TOP) {
            return;
        }

        this.#moveDirection = Move.BOTTOM
    }

    play() {
        if (this.finished) {
            throw new Error('You can\'t play after end game')
        }

        if (!this.#timer.active) {
            this.#apple = this.createNewApple()
            this.#timer.start()
            this.notifyAboutStateUpdate()

        } else if (this.#timer.paused) {
            this.#timer.start()
            this.notifyAboutStateUpdate()
        }
    }

    pause() {
        if (this.finished) {
            throw new Error('You can\'t pause after end game')
        }

        this.#timer.pause()
        this.notifyAboutStateUpdate()
    }

    end() {
        if (this.finished) {
            throw new Error('You can\'t end after end game')
        }

        this.finishGame()
        this.notifyAboutStateUpdate()
    }

    finishGame() {
        this.#timer.stop()
    }

    get finished() {
        return this.#snake.dead || this.youWon
    }

    onTick(deltaTimestamp) {
        if (this.#snake.dead) {
            return
        }
        this.#timePassedSinceLastMove += deltaTimestamp
        if (this.#timePassedSinceLastMove < this.#speedController.moveInterval) {
            return
        }
        this.#timePassedSinceLastMove -= this.#speedController.moveInterval

        this.updateGameObjectStates(deltaTimestamp)
        this.checkRoomCollisions()
        this.checkAppleState()

        if (this.#snake.dead) {
            this.finishGame()
        }

        this.notifyAboutStateUpdate()
    }

    onWin() {
        this.finishGame()
    }

    updateGameObjectStates() {
        switch(this.#moveDirection) {
            case Move.TOP:
                this.#snake.moveTop()
                break;
            case Move.BOTTOM:
                this.#snake.moveBottom()
                break;
            case Move.RIGHT:
                this.#snake.moveRight()
                break;;
            case Move.LEFT:
                this.#snake.moveLeft()
                break;
            default:
                throw new Error('Not supported move type')
        }
        this.#apple.tick()
    }

    checkRoomCollisions() {
        if (!this.#room.isFree(this.snakeHeadPosition) || !this.#room.isInside(this.snakeHeadPosition)) {
            this.#snake.kill()
        }
    }

    checkAppleState() {
        if (this.#apple.equal(this.snakeHeadPosition)) {
            this.#gameEventsController.reward()
            this.#snake.grow()
            this.#apple = this.createNewApple()

        } else if (this.#apple.spoiled) {
            this.#apple = this.createNewApple()
        }
    }

    onNewLevel(newLevel) {
        this.#speedController.accelerateSpeed()
    }

    notifyAboutStateUpdate() {
        this.getListeners('update').forEach(listener => listener(this))
    }
}