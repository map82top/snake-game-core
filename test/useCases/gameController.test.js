import GameController from '@/controllers/gameController.js'
import Point from '@/entities/point.js'

function expectPoint(point, x, y) {
    expect(point.x).toBe(x)
    expect(point.y).toBe(y)
}

function getApplePoint(xValue, yValue, width, height) {
    const x = Math.floor(xValue * (width - 2) + 1)
    const y = Math.floor(yValue * (height - 2) + 1)
    return new Point(x, y);
}

function getRandomValue(minValue = 0, maxValue = 1) {
    return Math.floor(Math.random() * (maxValue - minValue - 1) + minValue);
}

function getNewStepInterval(gameController, accelerationCount) {
    const newSpeed = gameController.settings.initialSpeed + gameController.settings.speedAccelerationStep * accelerationCount
    return Math.floor(1000 / newSpeed)
}

function getTimeValue(...args) {
    let sum = 0;
    for (let arg of args) sum += arg;
    return Math.floor(sum / 10) * 10
}  

describe('gameController.js', () => {
    let gameController
    let initialStepInterval


    beforeEach(() => {
        // reset to default
        gameController = null
        initialStepInterval = 1000 / GameController.defaultSettings.initialSpeed
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('constructor', () => {
        describe('fail on incorrect settings', () => {
            it('should throw an error if initialSnakeSize is not an integer', () => {
                const settings = {
                    initialSnakeSize: '3'
                }
                expect(() =>  new GameController(settings)).toThrow('Initial snake size must be integer')
            })
        
            it('should throw an error if roomWidth is not an integer', () => {
                const settings = {
                    roomWidth: '64'
                }
                expect(() =>  new GameController(settings)).toThrow('Room width must be integer')
            })
        
            it('should throw an error if roomHeight is not an integer', () => {
                const settings = {
                    roomHeight: '64'
                }
                expect(() =>  new GameController(settings)).toThrow('Room height must be integer')
            })
        
            it('should throw an error if appleLifeTime is not an integer', () => {
                const settings = {
                    appleLifeTime: '100'
                }
                expect(() =>  new GameController(settings)).toThrow('Apple life time must be integer')
            })

            it('should throw an error if appleLifeTime is lower 10', () => {
                const settings = {
                    appleLifeTime: 4
                }
                expect(() =>  new GameController(settings)).toThrow('Apple life time must be greater 9')
            })
        
            it('should throw an error if winPoints is not an integer', () => {
                const settings = {
                    winPoints: '10'
                }
                expect(() =>  new GameController(settings)).toThrow('Win points must be integer')
            })
    
            it('should throw an error if winPoints is lower 1', () => {
                const settings = {
                    winPoints: 0
                }
                expect(() =>  new GameController(settings)).toThrow('Win points must be greater than 0')
            })
        
            it('should throw an error if pointsToNewLevel is not an integer', () => {
                const settings = {
                    pointsToNewLevel: '10'
                }
                expect(() =>  new GameController(settings)).toThrow('Points to new level must be integer')
            })
    
            it('should throw an error if pointsToNewLevel is lower 1', () => {
                const settings = {
                    pointsToNewLevel: 0
                }
                expect(() =>  new GameController(settings)).toThrow('Points to new level must be greater than 0')
            })
        
            it('should throw an error if initialSnakeSize * 2 > roomHeight', () => {
                const settings = {
                    initialSnakeSize: 33,
                    roomHeight: 64,
                }
                expect(() =>  new GameController(settings)).toThrow('Initial snake size must be lower half height of room')
            })
        
            it('should throw an error if snakeType is incorrect', () => {
                const settings = {
                    snakeType: 'invalid'
                }
                expect(() =>  new GameController(settings)).toThrow('Incorrect snake type')
            })
        
            it('should throw an error if roomType is incorrect', () => {
                const settings = {
                    roomType: 'invalid'
                }
                expect(() =>  new GameController(settings)).toThrow('Incorrect room type')
            })

            it('should throw an error if initialSpeed is not a number', () => {
                const settings = {
                    initialSpeed: '2'
                }
                expect(() => new GameController(settings)).toThrow('Speed acceleration step must be interger or float number');
            })
    
            it('should throw an error if initialSpeed is less than or equal to 0', () => {
                const settings = {
                    initialSpeed: -1
                }
                expect(() => new GameController(settings)).toThrow('Initial speed must be greater or equal than 1');
            })
    
            it('should throw an error if speedAccelerationStep is not a number', () => {
                const settings = {
                    speedAccelerationStep: '0.5'
                }
                expect(() => new GameController(settings)).toThrow('Speed acceleration step must be interger or float number');
            })
    
            it('should throw an error if speedAccelerationStep is less than or equal to 0', () => {
                const settings = {
                    speedAccelerationStep: -0.5
                }
                expect(() => new GameController(settings)).toThrow('Speed acceleration step must be greater than 0');
            })
    
            it('should throw an error if initialSpeed greater than max supported speed', () => {
                const settings = {
                    initialSpeed: 11
                }
                expect(() => new GameController(settings)).toThrow(`Initial speed must be equal or lower than ${GameController.MAX_SUPPORTED_SPEED}`);
            })
    
            it('should throw an error if speedAccelerationStep greater than max supported speed', () => {
                const settings = {
                    speedAccelerationStep: 3
                }
                expect(() => new GameController(settings)).toThrow('Speed acceleration step can not be greater than initial speed');
            })
        })

        it('should create a new game controller with default settings successfully', () => {
            gameController = new GameController({})
            expect(gameController).toBeDefined()
        })
    
    
        it('should merge settings with default settings correctly', () => {
            const settings = {
                initialSnakeSize: 5,
                roomWidth: 80,
                roomHeight: 80,
                appleLifeTime: 200,
                snakeType: 'classic',
                roomType: 'bordered',
                winPoints: 15,
                pointsToNewLevel: 1,
                initialSpeed:3.3,
                speedAccelerationStep: 0.3
            }
            gameController = new GameController(settings)
            expect(gameController.settings).toEqual(settings)
        })

    })

    describe('initial positionin in room', () => {
        it('should create a new apple with valid coordinates', () => {
            let roomWidth = 1000;
            let roomHeight = 1000;
            while(roomWidth > 10 && roomHeight > 10) {
                let randomXValue = getRandomValue()
                let randomYValue = getRandomValue()
                
                gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight})
                jest.spyOn(global.Math, 'random')
                        .mockReturnValueOnce(randomXValue)
                        .mockReturnValueOnce(randomYValue)

                gameController.play()
                let expectedApple = getApplePoint(randomXValue, randomYValue, roomWidth, roomHeight)
                expect(gameController.apple.equal(expectedApple)).toBeTruthy()

                jest.spyOn(global.Math, 'random').mockRestore()
                roomWidth -= getRandomValue(10, 50)
                roomHeight -= getRandomValue(10, 50)
            }
        })
    
        it('failed if can\'t find free place for new apple', () => {
            gameController = new GameController({roomWidth: 100, roomHeight: 100})
            jest.spyOn(global.Math, 'random').mockReturnValue(0.5)
            expect(() => gameController.play()).toThrow('Too much iterations of finding new apple place!')
        })
    
        it('test snake head default position in bordered room', () => {
            let roomWidth = 1000;
            let roomHeight = 1000;
            while(roomWidth > 10 && roomHeight > 10) {
                const initialSnakeSize = getRandomValue(3, Math.floor(roomHeight / 2))
                gameController = new GameController({initialSnakeSize: initialSnakeSize, roomWidth: roomWidth, roomHeight: roomHeight})
                const xPosition = Math.floor((roomWidth - 1) / 2)
                const yPosition = Math.floor((roomHeight - 1) / 2) + Math.floor(initialSnakeSize / 2)

                expectPoint(gameController.snakeHeadPosition, xPosition, yPosition)
                roomWidth -= getRandomValue(10, 56)
                roomHeight -= getRandomValue(10, 56)
            }
        })
    })

    describe('properties', () => {
        it('snake property returns snake chains positions in room coordinates', () => {
            let roomWidth = 10
            let roomHeight = 10
            jest.spyOn(global.Math, 'random')
                        .mockReturnValue(0.2)
            gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight})
            gameController.play()

            // Initially, the snake should be at the calculated starting position
            let expectedInitialPositions = [
                { x: 4, y: 5 }, // head initial position based on default settings
                { x: 4, y: 4 },
                { x: 4, y: 3 }
            ];
            expectedInitialPositions.forEach((pos, index) => {
                expect(gameController.snake[index].x).toBe(pos.x);
                expect(gameController.snake[index].y).toBe(pos.y);
            });

            // Move the snake to the right and check positions
            gameController.moveRight();
            jest.advanceTimersByTime(initialStepInterval);
            let expectedPositionsAfterRightMove = [
                { x: 5, y: 5 }, // new head position
                { x: 4, y: 5 }, // old head position becomes second part of the snake
                { x: 4, y: 4 }  // and so on...
            ];
            expectedPositionsAfterRightMove.forEach((pos, index) => {
                expect(gameController.snake[index].x).toBe(pos.x);
                expect(gameController.snake[index].y).toBe(pos.y);
            });

            // Move the snake to the bottom and check positions
            gameController.moveBottom();
            jest.advanceTimersByTime(initialStepInterval);
            let expectedPositionsAfterBottomMove = [
                { x: 5, y: 4 }, // new head position
                { x: 5, y: 5 }, // old head position becomes second part of the snake
                { x: 4, y: 5 }  // and so on...
            ];
            expectedPositionsAfterBottomMove.forEach((pos, index) => {
                expect(gameController.snake[index].x).toBe(pos.x);
                expect(gameController.snake[index].y).toBe(pos.y);
            });
        })
    })

    describe('snake move API', () => {
        beforeEach(() => {
            jest.spyOn(global.Math, 'random').mockReturnValue(0.1)
            gameController = new GameController({})
            gameController.play()
        })

        it('snake move to the top on one ceil', () => {
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 31, 33)
            expect(gameController.snake.length).toBe(3)
        })
    
        it('snake move to the right on one ceil', () => {           
            gameController.moveRight()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 32, 32)
            expect(gameController.snake.length).toBe(3)
        })
    
        it('snake move to the left on one ceil', () => {
            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 30, 32)
            expect(gameController.snake.length).toBe(3)
        })
    
        it('snake move to the botom on one ceil', () => {
            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 30, 32)
            expect(gameController.snake.length).toBe(3)
    
            gameController.moveBottom()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 30, 31)
            expect(gameController.snake.length).toBe(3)
        })

        it('snake move to the top on one ceil', () => {
            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 30, 32)
            expect(gameController.snake.length).toBe(3)
    
            gameController.moveTop()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 30, 33)
            expect(gameController.snake.length).toBe(3)
        })

        it('snake move to the top by default', () => {
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 31, 33)
            expect(gameController.snake.length).toBe(3)
        })

        it('ignore move to the bottom if current direction is top', () => {
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 31, 33)
            
            // direction didn't change
            gameController.moveBottom()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 31, 34)
            
            // another durection allowed
            gameController.moveRight()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 32, 34)
        })

        it('ignore move to the top if current direction is bottom', () => {
            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 30, 32)
    
            gameController.moveBottom()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 30, 31)

            // direction didn't change
            gameController.moveTop()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 30, 30)

            // another durection allowed
            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 29, 30)
        })

        it('ignore move to the left if current direction is right', () => {
            gameController.moveRight()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 32, 32)
            
            // direction didn't change
            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 33, 32)

            // another durection allowed
            gameController.moveTop()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 33, 33)
        })

        it('ignore move to the right if current direction is left', () => {
            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 30, 32)
            
            // direction didn't change
            gameController.moveRight()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 29, 32)

            // another durection allowed
            gameController.moveBottom()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 29, 31)
        })
    })

    describe('game pause behavior', () => {
        const checkGameStateProperties = (active, paused) => {
            expect(gameController.active).toBe(active)
            expect(gameController.paused).toBe(paused)
        }
        it('snake doesn\'t move if game paused', () => {
            gameController = new GameController({})
            const onUpdataListener = jest.fn()
            gameController.on('update', onUpdataListener)
            gameController.play()
            checkGameStateProperties(true, false)
            expect(onUpdataListener).toHaveBeenCalledTimes(1)
    
            jest.advanceTimersByTime(initialStepInterval)
            expect(onUpdataListener).toHaveBeenCalledTimes(2)
            expectPoint(gameController.snakeHeadPosition, 31, 33)
    
            gameController.pause()
            checkGameStateProperties(true, true)
            expect(onUpdataListener).toHaveBeenCalledTimes(3)
            for (let i = 0; i < 30; i++) {
                jest.advanceTimersByTime(initialStepInterval)
                expectPoint(gameController.snakeHeadPosition, 31, 33)
                expect(gameController.apple.spoiled).toBeFalsy()
            }
            expect(onUpdataListener).toHaveBeenCalledTimes(3)
    
            gameController.play()
            checkGameStateProperties(true, false)
            expect(onUpdataListener).toHaveBeenCalledTimes(4)
            jest.advanceTimersByTime(initialStepInterval)
            expect(onUpdataListener).toHaveBeenCalledTimes(5)
            expectPoint(gameController.snakeHeadPosition, 31, 34)

            gameController.end()
            checkGameStateProperties(false, false)
            expect(onUpdataListener).toHaveBeenCalledTimes(6)
            jest.advanceTimersByTime(initialStepInterval)
            expect(onUpdataListener).toHaveBeenCalledTimes(6)
            expectPoint(gameController.snakeHeadPosition, 31, 34)
        })

        it('apple don\'t change position after resume the game', () => {
            let randomXValue = getRandomValue()
            let randomYValue = getRandomValue()

            gameController = new GameController({})
            let expectedApple = getApplePoint(randomXValue, randomYValue, 
                                                gameController.settings.roomWidth, gameController.settings.roomHeight)
            
            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(randomXValue)
                                    .mockReturnValueOnce(randomYValue)
            
            gameController.play()
            jest.advanceTimersByTime(initialStepInterval)
            expect(gameController.apple.equal(expectedApple)).toBeTruthy()
    
            gameController.pause()
            jest.advanceTimersByTime(initialStepInterval)
            expect(gameController.apple.equal(expectedApple)).toBeTruthy()
    
            gameController.play()
            jest.advanceTimersByTime(initialStepInterval)
            expect(gameController.apple.equal(expectedApple)).toBeTruthy()
    
            gameController.end()
            expect(gameController.apple.equal(expectedApple)).toBeTruthy()
        })
    })

    
    describe('game events', () => {
        let roomWidth = 10
        let roomHeight = 10

        const checkInteractionDisabledAfterEndGame = () => {
            const headPosition = gameController.snakeHeadPosition
            // no reaction
            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            expect(headPosition.equal(gameController.snakeHeadPosition)).toBeTruthy()

            gameController.moveRight()
            jest.advanceTimersByTime(initialStepInterval)
            expect(headPosition.equal(gameController.snakeHeadPosition)).toBeTruthy()

            gameController.moveBottom()
            jest.advanceTimersByTime(initialStepInterval)
            expect(headPosition.equal(gameController.snakeHeadPosition)).toBeTruthy()

            gameController.moveTop()
            jest.advanceTimersByTime(initialStepInterval)
            expect(headPosition.equal(gameController.snakeHeadPosition)).toBeTruthy()

            expect(() => gameController.play()).toThrow('You can\'t play after end game')
            expect(() => gameController.pause()).toThrow('You can\'t pause after end game')
            expect(() => gameController.end()).toThrow('You can\'t end after end game')
        }

        const checkGameNotEnded = () => {
            expect(gameController.youWon).toBeFalsy()
            expect(gameController.youDied).toBeFalsy()
        }

        const checkSnakeDied = () => {
            expect(gameController.youWon).toBeFalsy()
            expect(gameController.youDied).toBeTruthy()
        }

        const checkGameWon = () => {
            expect(gameController.youWon).toBeTruthy()
            expect(gameController.youDied).toBeFalsy()
        }

        const checkGameStatistic = (points, level) => {
            expect(gameController.points).toBe(points)
            expect(gameController.level).toBe(level)
        }

        it('snake die by hit the wall', () => {
            gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight})
            gameController.play()
    
            for (let i = 1; i < 4; i++) {
                jest.advanceTimersByTime(initialStepInterval)
                expectPoint(gameController.snakeHeadPosition, 4, 5 + i)
                expect(gameController.youDied).toBeFalsy()
                expect(gameController.youWon).toBeFalsy()
            }
    
            jest.advanceTimersByTime(initialStepInterval)
            checkSnakeDied()
            checkInteractionDisabledAfterEndGame()
        })

        it('snake die by hit itself', () => {
            gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight, initialSnakeSize: 5})
            gameController.play()
            expectPoint(gameController.snakeHeadPosition, 4, 6)

            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 3, 6)
            checkGameNotEnded()

            gameController.moveBottom()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 3, 5)
            checkGameNotEnded()

            gameController.moveRight()
            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 4, 5)
            checkSnakeDied()
            checkInteractionDisabledAfterEndGame()
        })

        it('snake eat apple', () => {
            gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight})            
            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.4)
                                    .mockReturnValueOnce(0.7)

            gameController.play()
            expectPoint(gameController.apple, 3, 5)
            checkGameStatistic(0, 1)

            gameController.moveLeft()
            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.2)
                                    .mockReturnValueOnce(0.2)

            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 3, 5)
            expect(gameController.snake.length).toBe(3)
            expectPoint(gameController.apple, 2, 2)
            checkGameStatistic(1, 1)
            checkGameNotEnded()

            jest.advanceTimersByTime(initialStepInterval)
            expectPoint(gameController.snakeHeadPosition, 2, 5)
            expect(gameController.snake.length).toBe(4)
            checkGameStatistic(1, 1)
            checkGameNotEnded()
        })

        it('win game', () => {
            gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight, winPoints: 1})            
            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.4)
                                    .mockReturnValueOnce(0.7)

            gameController.play()
            checkGameStatistic(0, 1)
            checkGameNotEnded()

            gameController.moveLeft()
            jest.advanceTimersByTime(initialStepInterval)
            checkGameStatistic(1, 1)
            checkGameWon()
            checkInteractionDisabledAfterEndGame()
        })

        it('time value changes', () => {
            gameController = new GameController({})
            expect(gameController.time).toBe(0)
            gameController.play()
            expect(gameController.time).toBe(0)
            
    
            jest.advanceTimersByTime(1)
            expect(gameController.time).toBe(0)
    
            jest.advanceTimersByTime(GameController.TIMER_DELTA - 1)
            expect(gameController.time).toBe(GameController.TIMER_DELTA)
            
            jest.advanceTimersByTime(GameController.TIMER_DELTA * 0.9)
            expect(gameController.time).toBe(GameController.TIMER_DELTA)

            jest.advanceTimersByTime(GameController.TIMER_DELTA * 0.5)
            expect(gameController.time).toBe(GameController.TIMER_DELTA * 2)

            gameController.pause()
            expect(gameController.time).toBe(GameController.TIMER_DELTA * 2.4)
            jest.advanceTimersByTime(GameController.TIMER_DELTA * 10)
            expect(gameController.time).toBe(GameController.TIMER_DELTA * 2.4)

            gameController.play()
            jest.advanceTimersByTime(GameController.TIMER_DELTA * 3.6)
            expect(gameController.time).toBe(GameController.TIMER_DELTA * 6)

            gameController.end()
            expect(gameController.time).toBe(GameController.TIMER_DELTA * 6)
            jest.advanceTimersByTime(GameController.TIMER_DELTA * 5)
            expect(gameController.time).toBe(GameController.TIMER_DELTA * 6)
        })

        it('test speed increase on new level', () => {
            gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight, pointsToNewLevel: 1})            
            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.5)
                                    .mockReturnValueOnce(0.8)

            gameController.play()
            checkGameStatistic(0, 1)
            expectPoint(gameController.apple, 4, 6)


            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.2)
                                    .mockReturnValueOnce(0.2)
            
            jest.advanceTimersByTime(initialStepInterval)

            expectPoint(gameController.snakeHeadPosition, 4, 6)
            checkGameStatistic(1, 2)

            const newStepDelay = getNewStepInterval(gameController, 1)
            jest.advanceTimersByTime(newStepDelay)
            expectPoint(gameController.snakeHeadPosition, 4, 7)
            expect(gameController.snake.length).toBe(4)
            checkGameNotEnded()
        })

        it('speed does not affect time changes', () => {
            gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight, pointsToNewLevel: 1})            
            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.5)
                                    .mockReturnValueOnce(0.8)

            gameController.play()
            checkGameStatistic(0, 1)
            expectPoint(gameController.apple, 4, 6)
            expect(gameController.time).toBe(0)

            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.2)
                                    .mockReturnValueOnce(0.2)
            
            jest.advanceTimersByTime(initialStepInterval)

            expectPoint(gameController.snakeHeadPosition, 4, 6)
            expect(gameController.time).toBe(getTimeValue(initialStepInterval))
            checkGameStatistic(1, 2)

            gameController.moveLeft()

            const newStepDelay = getNewStepInterval(gameController, 1)
            expect(initialStepInterval > newStepDelay).toBeTruthy()
            jest.advanceTimersByTime(newStepDelay)
            expectPoint(gameController.snakeHeadPosition, 3, 6)
            expect(gameController.time).toBe(getTimeValue(initialStepInterval, newStepDelay))

            jest.advanceTimersByTime(newStepDelay)
            expectPoint(gameController.snakeHeadPosition, 2, 6)
            expect(gameController.time).toBe(getTimeValue(initialStepInterval, newStepDelay * 2))

            jest.advanceTimersByTime(newStepDelay)
            expectPoint(gameController.snakeHeadPosition, 1, 6)
            expect(gameController.time).toBe(getTimeValue(initialStepInterval, newStepDelay * 3))
        })

        it('speed can not be greater max supported speed', () => {
            gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight, pointsToNewLevel: 1, 
                                                        initialSpeed: 9, speedAccelerationStep: 1})
            initialStepInterval = getNewStepInterval(gameController, 0)
            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.5)
                                    .mockReturnValueOnce(0.8)

            gameController.play()
            expectPoint(gameController.apple, 4, 6)

            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.7)
                                    .mockReturnValueOnce(0.8)
            // initialStepInterval equal to 111
            jest.advanceTimersByTime(initialStepInterval + 9)
            expectPoint(gameController.snakeHeadPosition, 4, 6)
            expectPoint(gameController.apple, 5, 6)
            checkGameStatistic(1, 2)

            gameController.moveRight()
            jest.spyOn(global.Math, 'random')
                                    .mockReturnValueOnce(0.2)
                                    .mockReturnValueOnce(0.2)

            const newStepInterval = getNewStepInterval(gameController, 1)
            jest.advanceTimersByTime(newStepInterval)
            expectPoint(gameController.snakeHeadPosition, 5, 6)
            expect(gameController.snake.length).toBe(4)
            checkGameStatistic(2, 3)
            
            // no acceleration
            jest.advanceTimersByTime(newStepInterval * 0.95)
            expectPoint(gameController.snakeHeadPosition, 5, 6)
            expect(gameController.snake.length).toBe(4)

            jest.advanceTimersByTime(newStepInterval * 0.05)
            expectPoint(gameController.snakeHeadPosition, 6, 6)
            expect(gameController.snake.length).toBe(5)
        })

        it('create new apple if old is spoiled', () => {
            gameController = new GameController({roomWidth: roomWidth, roomHeight: roomHeight, appleLifeTime: 10})
            let randomXValue = 0.2
            let randomYValue = 0.2
            jest.spyOn(global.Math, 'random')
                                        .mockReturnValueOnce(randomXValue)
                                        .mockReturnValueOnce(randomYValue)
            let expectedApple = getApplePoint(randomXValue, randomYValue, roomWidth, roomHeight)

            const checkAppleState = (stepsCount) => {
                for (let i = 0; i < stepsCount; i++) {
                    jest.advanceTimersByTime(initialStepInterval)
                    expect(gameController.apple.equal(expectedApple)).toBeTruthy()
                }
            }
            
            gameController.play()
            let apple = gameController.apple
            checkAppleState(3)
           
            gameController.moveRight()
            checkAppleState(4)

            gameController.moveBottom()
            checkAppleState(2)

            randomXValue = 0.1
            randomYValue = 0.3
            expectedApple = getApplePoint(randomXValue, randomYValue, roomWidth, roomHeight)
    
            jest.spyOn(global.Math, 'random')
                                .mockReturnValueOnce(randomXValue)
                                .mockReturnValueOnce(randomYValue)
    
            // old apple is spoiled should created new one
            jest.advanceTimersByTime(initialStepInterval)
            expect(gameController.apple.equal(expectedApple)).toBeTruthy()
            expect(apple.spoiled).toBeTruthy()
        })
    })
})