import Point from '@/entities/point.js'

describe('point.js', () => {
    describe('Creation and properties', () => {
        it('create point', () => {
            const point = new Point(1, 10)
            expect(point.x).toBe(1)
            expect(point.y).toBe(10)
            expect(point.coords).toEqual([1, 10])
        })

        it('x and y value must be integer', () => {
            expect(() => new Point()).toThrow('x value must be integer')
            expect(() => new Point(1)).toThrow('y value must be integer')
            expect(() => new Point(null, 1)).toThrow('x value must be integer')
            expect(() => new Point('a', 1)).toThrow('x value must be integer')
            expect(() => new Point(1, 1.5)).toThrow('y value must be integer')
        })

        it('x and y are unchangable', () => {
            const point = new Point(0, 0)
            expect(() => point.x = 1).toThrow()
            expect(() => point.y = 1).toThrow()
        })
    })

    describe('Equality comparison', () => {
        it('test equal comparing', () => {
            const point1 = new Point(1, -1)
            const point2 = new Point(10, 5)
            const point3 = new Point(1, -1)
            expect(point1.equal(point2)).toBeFalsy()
            expect(point2.equal(point3)).toBeFalsy()
            expect(point1.equal(point3)).toBeTruthy()
        })
    })

    describe('Subtract method', () => {
        it('should return the correct result', () => {
            const point1 = new Point(5, 10)
            const point2 = new Point(2, 3)
            const result = point1.subtract(point2)
            expect(result.x).toBe(3)
            expect(result.y).toBe(7)
        })

        it('should throw an error if argument is not a Point instance', () => {
            const point = new Point(5, 10)
            expect(() => point.subtract()).toThrow('Expected point instance as argument')
            expect(() => point.subtract({ x: 2, y: 3 })).toThrow('Expected point instance as argument')
            expect(() => point.subtract(123)).toThrow('Expected point instance as argument')
            expect(() => point.subtract('point')).toThrow('Expected point instance as argument')
        })
    })

    describe('Add method', () => {
        it('should return the correct result', () => {
            const point1 = new Point(5, 10)
            const point2 = new Point(2, 3)
            const result = point1.add(point2)
            expect(result.x).toBe(7)
            expect(result.y).toBe(13)
        })

        it('should throw an error if argument is not a Point instance', () => {
            const point = new Point(5, 10)
            expect(() => point.add()).toThrow('Expected point instance as argument')
            expect(() => point.add({ x: 2, y: 3 })).toThrow('Expected point instance as argument')
            expect(() => point.add(123)).toThrow('Expected point instance as argument')
            expect(() => point.add('point')).toThrow('Expected point instance as argument')
        })
    })
})