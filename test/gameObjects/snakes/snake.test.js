import Snake from '@/entities/snakes/snake.js'
import Point from '@/entities/point.js'

describe('Snake class', () => {
    describe('constructor', () => {
        it('should create a snake with the default initial size', () => {
            const snake = new Snake()
            expect(snake.length).toBe(3)
        })

        it('should create a snake with a specified initial size', () => {
            const initialSize = 5
            const snake = new Snake(initialSize)
            expect(snake.length).toBe(initialSize)
        })

        it('should throw an error if initial size is less than 1', () => {
            expect(() => new Snake(0)).toThrow('Snake size can\'t be lower 1')
        })

        it('should throw an error if initial size is not an integer', () => {
            expect(() => new Snake(2.5)).toThrow('Snake size can\'t be lower 1')
        })
    })

    describe('Not implemented methods', () => {
        const snake = new Snake()
        it('should throw an error when calling grow', () => {
            expect(() => snake.grow()).toThrow('Not implented')
        })

        it('should throw an error when calling moveLeft', () => {
            expect(() => snake.moveLeft()).toThrow('Not implented')
        })

        it('should throw an error when calling moveRight', () => {
            expect(() => snake.moveRight()).toThrow('Not implented')
        })

        it('should throw an error when calling moveTop', () => {
            expect(() => snake.moveTop()).toThrow('Not implented')
        })

        it('should throw an error when calling moveBottom', () => {
            expect(() => snake.moveBottom()).toThrow('Not implented')
        })

        it('should throw an error when accessing dead property', () => {
            expect(() => snake.dead).toThrow('Not implemented')
        })

        it('should throw an error when calling kill', () => {
            expect(() => snake.kill()).toThrow('Not implemented')
        })
    })

    describe('intersect method', () => {
        it('should return false if the snake does not intersect the given point', () => {
            const snake = new Snake()
            const point = new Point(10, 10)
            expect(snake.intersect(point)).toBe(false)
        })

        it('should throw an error if the argument is not a Point instance', () => {
            const snake = new Snake()
            expect(() => snake.intersect({ x: 10, y: 10 })).toThrow('Expected point instance as argument')
        })

        // Assuming the snake can intersect with a given point, might need adjustments
        it('should return true if the snake intersects the given point', () => {
            const snake = new Snake()
            const point = new Point(0, 0) // Assuming the head is at 0,0
            expect(snake.intersect(point)).toBe(true)
        })

        it('snake head can not intersect with itself', () => {
            const snake = new Snake()
            expect(snake.intersect(snake.head)).toBe(false)
        })
    })

    describe('head property', () => {
        it('should return the first chain as the head', () => {
            const snake = new Snake()
            expect(snake.head).toBe(snake.chains[0])
        })
    })
})