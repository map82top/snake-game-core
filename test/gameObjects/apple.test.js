import Apple from '@/entities/apple.js'
import Point from '@/entities/point.js'

describe('apple.js', () => {

    describe('Creation and properties', () => {
        it('should throw an error if point is not provided', () => {
            expect(() => new Apple()).toThrow('point must be instance of Point')
        })

        it('should throw an error if lifeTime is not provided', () => {
            expect(() => new Apple(new Point(1, 1))).toThrow('lifeTime must be an integer')
        })

        it('should throw an error if lifeTime is 0', () => {
            expect(() => new Apple(new Point(1, 1), 0)).toThrow('lifeTime must be greater than 0')
        })

        it('should throw an error if lifeTime is not an integer', () => {
            expect(() => new Apple(new Point(1, 1), 15.5)).toThrow('lifeTime must be an integer')
        })

        it('should create an apple with the provided point and lifeTime', () => {
            const point = new Point(1, 1)
            const lifeTime = 15
            const apple = new Apple(point, lifeTime)
            expect(apple.x).toBe(point.x)
            expect(apple.y).toBe(point.y)
            expect(apple.spoiled).toBeFalsy()
        })
    })
    

    it('apple should be spoiled after expire life time', () => {
        const appleLifeTime = 15
        const apple = new Apple(new Point(1, 1), appleLifeTime)
        for (let i = 0; i < appleLifeTime; i++) {
            expect(apple.spoiled).toBeFalsy()
            apple.tick()
        }
        expect(apple.spoiled).toBeTruthy()
    })

    it('test equal method', () => {
        const point1 = new Point(1, 1)
        const point2 = new Point(2, 2)
        const apple1 = new Apple(point1, 10)
        const apple2 = new Apple(point2, 10)
        const apple3 = new Apple(point1, 10)

        expect(apple1.equal(apple2)).toBeFalsy()
        expect(apple1.equal(apple3)).toBeTruthy()
    })
})