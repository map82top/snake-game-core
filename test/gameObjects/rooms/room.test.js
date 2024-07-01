import Room from '@/entities/rooms/room.js'

describe('Room class', () => {
    describe('constructor', () => {
        it('should create a Room instance with valid width and height', () => {
            const room = new Room(10, 20)
            expect(room).toBeInstanceOf(Room)
        })

        it('should throw an error if width is not an integer', () => {
            expect(() => new Room('10', 20)).toThrow('Width and Height must be integer values')
        })

        it('should throw an error if height is not an integer', () => {
            expect(() => new Room(10, '20')).toThrow('Width and Height must be integer values')
        })

        it('should throw an error if width is less than 10', () => {
            expect(() => new Room(9, 20)).toThrow('Each side must be at least 10 points')
        })

        it('should throw an error if height is less than 10', () => {
            expect(() => new Room(10, 9)).toThrow('Each side must be at least 10 points')
        })
    })

    describe('width and height getters', () => {
        const room = new Room(15, 25)
        it('should return the correct width', () => {
            expect(room.width).toBe(15)
        })

        it('should return the correct height', () => {
            expect(room.height).toBe(25)
        })
    })

    describe('Not implemented methods', () => {
        const room = new Room(10, 10)
        it('should throw an error when accessing filledCells', () => {
            expect(() => room.filledCells).toThrow('Not implemented!')
        })

        it('should throw an error when calling isInside', () => {
            expect(() => room.isInside()).toThrow('Not implemented!')
        })

        it('should throw an error when calling isFree', () => {
            expect(() => room.isFree()).toThrow('Not implemented!')
        })

        it('should throw an error when calling getRandomFreePoint', () => {
            expect(() => room.getRandomFreePoint()).toThrow('Not implemented')
        })
    })
})