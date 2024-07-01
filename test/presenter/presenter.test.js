import CellType from '@/presenters/cellType.js'
import GameMap from '@/presenters/gameMap.js'
import Presenter from '@/presenters/presenter.js';

function createMockGameController(values) {
    const defaultValues = {
        apple: { x: 2, y: 2},
        snake: [
            { x: 4, y: 5 },
            { x: 4, y: 4 },
            { x: 4, y: 3 },
        ],
        roomWidth: 10,
        roomHeight: 10,
        points: 0,
        level: 1,
        time: 0,
        youWon: false,
        youDied: false,
        paused: false,
        snakeHeadPosition: { x: 4, y: 5 }
    }
    const mergedValues = {...defaultValues, ...values}
    return {
        listeners: {},
        apple: mergedValues.apple,
        snake: mergedValues.snake,
        room: createMockBorderedRoom(mergedValues.roomWidth, mergedValues.roomHeight),
        points: mergedValues.points,
        level: mergedValues.level,
        time: mergedValues.time,
        youWon: mergedValues.youWon,
        youDied: mergedValues.youDied,
        paused: mergedValues.paused,
        snakeHeadPosition: mergedValues.snakeHeadPosition,
       
        appendNewPointToSnake(point, grow = false) {
            this.snake.unshift(point)
            this.snakeHeadPosition = point
            if (!grow) {
                this.snake.pop()
            }
        },

        on(event, listener) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push(listener);
        },
        fireUpdate() {
            this.listeners.update.forEach(listener => listener());
        }
    };
}

function createMockBorderedRoom(width = 10, height = 10) {    
    return {
        width: width,
        height: height,
        filledCells: createWallsArray(width, height),
    }
}

function createWallsArray(width, height) {
    const walls = []
    // Top wall
    for (let x = 0; x < width; x++) {
        walls.push({ x: x, y: 0 });
    }
    // Bottom wall
    for (let x = 0; x < width; x++) {
        walls.push({ x: x, y: height - 1 });
    }
    // Left wall
    for (let y = 1; y < height - 1; y++) {
        walls.push({ x: 0, y: y });
    }
    // Right wall
    for (let y = 1; y < height - 1; y++) {
        walls.push({ x: width - 1, y: y });
    }
    return walls
}

class ExpectedGameMapCreater {
    constructor(width = 10, height = 10, initialSnakeHeadPos = {x: 4, y:5}, initialSnakeSize = 3, initialApple = {x: 2, y: 2}) {
        this.width = width
        this.height = height
        this.apple = initialApple
        this.snake = this.createSnake(initialSnakeHeadPos, initialSnakeSize)
        this.walls = createWallsArray(width, height)
    }

    createGameMap(dead = false) {
        const map = new GameMap(this.width, this.height)
    
        Array.isArray(this.snake) && this.snake.forEach((chain, index) => {
            if (dead && index === 0) {
                return
            }
            if (index === 0) {
                map.fillCell(chain.x, chain.y, CellType.SNAKE_HEAD)
            } else if (index === this.snake.length - 1) {
                map.fillCell(chain.x, chain.y, CellType.SNAKE_TAIL)
            } else {
                map.fillCell(chain.x, chain.y, CellType.SNAKE_CHAIN)
            }
        })

        Array.isArray(this.walls) && this.walls.forEach(wall => {
            map.fillCell(wall.x, wall.y, CellType.WALL)
        })
    
        if (this.apple) {
            map.fillCell(this.apple.x, this.apple.y, CellType.APPLE)
        }
    
        return map
    }
    
    createSnake(initialPoint, initialSnakeSize = 3) {
        const snake = [];
        for (let i = 0; i < initialSnakeSize; i++) {
            snake.push({x: initialPoint.x, y: initialPoint.y - i});
        }
        
        return snake;
    }
    
    moveSnake(direction, grow = false) {
        let newHead = null
        switch (direction) {
            case 'top':
                newHead = {x: this.snake[0].x, y: this.snake[0].y + 1}
                break
            case 'bottom':
                newHead = {x: this.snake[0].x, y: this.snake[0].y - 1}
                break
            case 'left':
                newHead = {x: this.snake[0].x - 1, y: this.snake[0].y}
                break
            case 'right':
                newHead = {x: this.snake[0].x + 1, y: this.snake[0].y}
                break
            default:
                throw new Error('Invalid direction')
        }
    
        this.snake.unshift(newHead)
        if (!grow) {
            this.snake.pop()
        }
    }
}

describe('presenter.js', () => {
    let gameController
    let presenter

    it('draw initial state', () => {
        gameController = createMockGameController()
        presenter = new Presenter(gameController)
        expect(presenter.snapshot).toBeDefined()
        
        const expectedGameMap = new ExpectedGameMapCreater()
        const expectedMap = expectedGameMap.createGameMap()
        const snapshot = presenter.snapshot
        expect(snapshot.time).toBe('00:00')
        expect(snapshot.message).toBeNull()
        expect(snapshot.points).toBe(0)
        expect(snapshot.level).toBe(1)
        expect(expectedMap.equal(snapshot.map)).toBeTruthy()
    })

    it('presenter update state on fire \'update\' event in gameController', () => {
        gameController = createMockGameController()
        presenter = new Presenter(gameController)
        const gameMapCreator = new ExpectedGameMapCreater()
        let expectedMap = gameMapCreator.createGameMap()
        let snapshot = presenter.snapshot
        expect(snapshot.time).toBe('00:00')
        expect(snapshot.message).toBeNull()
        expect(snapshot.points).toBe(0)
        expect(snapshot.level).toBe(1)
        expect(expectedMap.equal(snapshot.map)).toBeTruthy()

        gameController.time = 2500
        gameController.appendNewPointToSnake({ x: 3, y: 5})
        gameMapCreator.moveSnake('left')
        gameController.apple = {x: 3, y: 3}
        gameMapCreator.apple = {x: 3, y: 3}
        gameController.points = 5
        gameController.level = 2
        gameController.fireUpdate()

        expectedMap = gameMapCreator.createGameMap()
        snapshot = presenter.snapshot
        expect(snapshot.time).toBe('00:02')
        expect(snapshot.message).toBeNull()
        expect(snapshot.points).toBe(5)
        expect(snapshot.level).toBe(2)
        expect(expectedMap.equal(snapshot.map)).toBeTruthy()
    })

    it('do not draw snake head if youDied property of gameController is true', () => {
        gameController = createMockGameController({youDied: true})
        presenter = new Presenter(gameController)
        const gameMapCreator = new ExpectedGameMapCreater()
        let expectedMap = gameMapCreator.createGameMap(true)
        expect(expectedMap.equal(presenter.snapshot.map)).toBeTruthy()
    })

    it('throw an error if snake have incorrect chain position', () => {
        gameController = createMockGameController({
            snake: [
                { x: -1, y: 15 },
                { x: 4, y: 4 },
                { x: 4, y: 3 },
                { x: 4, y: 2 },
            ]
        })
        expect(() => {  new Presenter(gameController) }).toThrowError('Invalid position')
    })

    it('should draw map correctly apple is null', () => {
        gameController = createMockGameController({
            apple: null,
        })
        presenter = new Presenter(gameController)
        const gameMapCreator = new ExpectedGameMapCreater()
        gameMapCreator.apple = null

        let expectedMap = gameMapCreator.createGameMap()
        let snapshot = presenter.snapshot
        expect(snapshot.time).toBe('00:00')
        expect(snapshot.message).toBeNull()
        expect(snapshot.points).toBe(0)
        expect(snapshot.level).toBe(1)
        expect(expectedMap.equal(snapshot.map)).toBeTruthy()
    })

    it('throw an error if snake is null', () => {
        gameController = createMockGameController({
            snake: null,
        })
        expect(() => {  new Presenter(gameController) }).toThrowError('Snake must be an array')
    })

    it('throw an error if room filled cells is null', () => {
        gameController = createMockGameController()
        gameController.room.filledCells = null
        expect(() => {  new Presenter(gameController) }).toThrowError('Room filled cells must be an array')
    })

    it('throw an error if apple have incorrect position', () => {
        gameController = createMockGameController({
            apple: { x: 12, y: 8 }
        })
        expect(() => {  new Presenter(gameController) }).toThrowError('Invalid position')
    })

    it('throw an error if wall have incorrect position', () => {
        gameController = createMockGameController()
        gameController.room.filledCells.push({ x: -1, y: -1 })
        expect(() => {  new Presenter(gameController) }).toThrowError('Invalid position')
    })

    it('points value in snapshot should be equal value got from gameController', () => {
        gameController = createMockGameController({ points: 10 });
        presenter = new Presenter(gameController);
        const snapshot = presenter.snapshot;
        expect(snapshot.points).toBe(10);
    });

    it('level value in snapshot should be equal value got from gameController', () => {
        gameController = createMockGameController({level: 3});
        presenter = new Presenter(gameController);
        const snapshot = presenter.snapshot;
        expect(snapshot.level).toBe(3);
    });

    it('time value should be formated to format mm:ss', () => {
        gameController = createMockGameController({time: 8000});
        presenter = new Presenter(gameController);
        expect(presenter.snapshot.time).toBe('00:08');

        gameController.time = 16000
        gameController.fireUpdate()
        expect(presenter.snapshot.time).toBe('00:16');

        gameController.time = 61000
        gameController.fireUpdate()
        expect(presenter.snapshot.time).toBe('01:01');

        gameController.time = 660000
        gameController.fireUpdate()
        expect(presenter.snapshot.time).toBe('11:00');
    });

    it('should throw an error if have intersection wall point and snake point', () => {
        gameController = createMockGameController()
        gameController.room.filledCells.push({ x: 4, y: 4 })
        expect(() => {  new Presenter(gameController) }).toThrowError('Cell is already filled')
    })

    it('should throw an error if have intersection apple point and snake point', () => {
        gameController = createMockGameController({
            apple: { x: 4, y: 5 }
        })
        expect(() => {  new Presenter(gameController) }).toThrowError('Cell is already filled')
    })

    it('succesful game map render if snake head intersect with the walll and snake is died', () => {
        gameController = createMockGameController({
            snake: [
                { x: 4, y: 9 },
                { x: 4, y: 8 },
                { x: 4, y: 7 },
            ],
            youDied: true
        })
        const gameMapCreator = new ExpectedGameMapCreater(undefined, undefined, {x: 4, y: 9})
        let expectedMap = gameMapCreator.createGameMap(true)
        presenter = new Presenter(gameController)
        expect(expectedMap.equal(presenter.snapshot.map)).toBeTruthy()
    })

    it('message should be equal You won! if youWon property of gameController is true', () => {
        gameController = createMockGameController({youWon: true});
        presenter = new Presenter(gameController);
        const snapshot = presenter.snapshot;
        expect(snapshot.message).toBe('You won!');
    });

    it('message should be equal Game over! if youDied property of gameController is true', () => {
        gameController = createMockGameController({youDied: true});
        presenter = new Presenter(gameController);
        const snapshot = presenter.snapshot;
        expect(snapshot.message).toBe('Game over!');
    });

    it('message should be equal Game paused! if paused property of gameController is true', () => {
        gameController = createMockGameController({paused: true});
        presenter = new Presenter(gameController);
        const snapshot = presenter.snapshot;
        expect(snapshot.message).toBe('Game paused!');
    });
});