import BorderedRoom from '@/entities/rooms/borderedRoom.js'
import Point from '@/entities/point.js'

describe('borderedRoom.js', () => {
    describe('constructor', () => {
        it('should throw an error if width and height are not integer values', () => {
            expect(() => new BorderedRoom()).toThrow('Width and Height must be integer values')
            expect(() => new BorderedRoom('a', 1.5)).toThrow('Width and Height must be integer values')
        })

        it('should throw an error if each side is less than 10 points', () => {
            expect(() => new BorderedRoom(0, 0)).toThrow('Each side must be at least 10 points')
            expect(() => new BorderedRoom(15, 5)).toThrow('Each side must be at least 10 points')
        })

        it('should create a room successfully with valid width and height', () => {
            const room = new BorderedRoom(15, 40)
            expect(room.width).toBe(15)
            expect(room.height).toBe(40)
        })
    })

    describe('isInside function', () => {
        let room;

        beforeEach(() => {
            room = new BorderedRoom(24, 48)
        })

        it('should throw an error for empty argument', () => {
            expect(() => room.isInside()).toThrow('Argument is empty');
        });

        it('should validate the argument is a Point instance', () => {
            expect(() => room.isInside([1, 2])).toThrow('Argument must be an instance of Point');
        });

        it('should return false for outside points', () => {
            const width = room.width
            const height = room.height

            expect(room.isInside(new Point(-1, -1))).toBeFalsy()
            expect(room.isInside(new Point(1, height + 1))).toBeFalsy()
            expect(room.isInside(new Point(width + 1, -1))).toBeFalsy()
            expect(room.isInside(new Point(width + 1, height + 1))).toBeFalsy()
        })

        it('should return false for edge points', () => {
            const width = room.width
            const height = room.height

            expect(room.isInside(new Point(0, 0))).toBeFalsy()
            expect(room.isInside(new Point(0, height))).toBeFalsy()
            expect(room.isInside(new Point(width, 0))).toBeFalsy()
            expect(room.isInside(new Point(width, height))).toBeFalsy()
        })

        it('should return true for points inside the room', () => {
            expect(room.isInside(new Point(10, 15))).toBeTruthy()
            expect(room.isInside(new Point(5, 40))).toBeTruthy()
        })
    })

    describe('filledCells function', () => {
        it('should return correct number of filled cells for given room dimensions', () => {
            const width = 24;
            const height = 48;
            const room = new BorderedRoom(width, height)
            const expectedWallCount = 2 * width + 2 * (height - 2); // Top + Bottom + Left + Right (excluding corners)
            expect(room.filledCells.length).toBe(expectedWallCount);
            room.filledCells.forEach(cell => {
                expect(cell instanceof Point).toBeTruthy()
            })
        })

        it('should return correct number of filled cells for minimum room dimensions', () => {
            const room = new BorderedRoom(10, 10)
            const filledCells = room.filledCells
            expect(filledCells.length).toBe(36)
        })
    })

    describe('isFree function', () => {
        let room;

        beforeEach(() => {
            room = new BorderedRoom(24, 48)
        })

        it('should return true for points inside the room', () => {
            expect(room.isFree(new Point(10, 15))).toBeTruthy()
            expect(room.isFree(new Point(5, 40))).toBeTruthy()
        })

        it('should return false for points on the edge or outside the room', () => {
            const width = room.width
            const height = room.height
            expect(room.isFree(new Point(0, 0))).toBeFalsy()
            expect(room.isFree(new Point(0, height - 1))).toBeFalsy()
            expect(room.isFree(new Point(width - 1, 0))).toBeFalsy()
            expect(room.isFree(new Point(width - 1, height - 1))).toBeFalsy()
        })
    })

    describe('getRandomFreePoint function', () => {
        it('should return a point inside the room for valid room dimensions', () => {
            const room = new BorderedRoom(24, 48)
            const testRunningCount = 50
            for (let i = 0; i < testRunningCount; i++) {
                const randomPoint = room.getRandomFreePoint()
                expect(room.isInside(randomPoint)).toBeTruthy()
            }
        })

        it('should return a point inside the room for minimum room dimensions', () => {
            const room = new BorderedRoom(10, 10)
            const testRunningCount = 50
            for (let i = 0; i < testRunningCount; i++) {
                const randomPoint = room.getRandomFreePoint()
                expect(room.isInside(randomPoint)).toBeTruthy()
            }
        })
    })
})