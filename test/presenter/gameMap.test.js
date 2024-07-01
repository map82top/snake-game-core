import GameMap from '@/presenters/gameMap.js';
import CellType from '@/presenters/cellType.js';

describe('GameMap', () => {
    describe('constructor', () => {
        it('should create a map filled with empty cellType values', () => {
            const width = 10;
            const height = 10;
            const gameMap = new GameMap(width, height);

            expect(gameMap.width).toBe(width);
            expect(gameMap.height).toBe(height);

            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    expect(gameMap.getCell(i, j)).toBe(CellType.EMPTY);
                }
            }
        });

        it('should throw an error if width or height is not an integer or less than 10', () => {
            expect(() => new GameMap(5, 10)).toThrow('width and height must be integer and greater than 10');
            expect(() => new GameMap(10, 5)).toThrow('width and height must be integer and greater than 10');
            expect(() => new GameMap(10.5, 10)).toThrow('width and height must be integer and greater than 10');
            expect(() => new GameMap(10, 10.5)).toThrow('width and height must be integer and greater than 10');
            expect(() => new GameMap('10', 10)).toThrow('width and height must be integer and greater than 10');
            expect(() => new GameMap(10, '10')).toThrow('width and height must be integer and greater than 10');
        });
    });

    describe('fillCell', () => {
        it('should fill the cell with the given value', () => {
            const width = 10;
            const height = 10;
            const gameMap = new GameMap(width, height);

            const x = 5;
            const y = 5;
            const value = CellType.APPLE;

            gameMap.fillCell(x, y, value);

            expect(gameMap.getCell(x, y)).toBe(value);
        });

        it('should throw an error if the position is invalid', () => {
            const width = 10;
            const height = 10;
            const gameMap = new GameMap(width, height);
            const x = -1;
            const y = 5;
            const value = CellType.FOOD;
            expect(() => gameMap.fillCell(x, y, value)).toThrow('Invalid position');
        });
    });

    describe('getCell', () => {
        it('should return the correct cell type for a valid position', () => {
            const width = 10;
            const height = 10;
            const gameMap = new GameMap(width, height);
            const x = 3;
            const y = 3;
            gameMap.fillCell(x, y, CellType.SNAKE);

            expect(gameMap.getCell(x, y)).toBe(CellType.SNAKE);
        });

        it('should throw an error if position is invalid', () => {
            const width = 10;
            const height = 10;
            const gameMap = new GameMap(width, height);
            const x = 11;
            const y = 0;

            expect(() => gameMap.getCell(x, y)).toThrow('Invalid position');
        });
    });

    describe('isValidPosition', () => {
        it('should return true for a valid position inside the map', () => {
            const width = 10;
            const height = 10;
            const gameMap = new GameMap(width, height);
            const x = 5;
            const y = 5;

            expect(gameMap.isValidPosition(x, y)).toBe(true);
        });

        it('should return false for a position outside the map', () => {
            const width = 10;
            const height = 10;
            const gameMap = new GameMap(width, height);
            const x = -1;
            const y = 11;

            expect(gameMap.isValidPosition(x, y)).toBe(false);
        });
    });

    describe('equal', () => {
        it('should throw an error if the argument is not an instance of GameMap', () => {
            const gameMap = new GameMap(10, 10);
            expect(() => gameMap.equal({})).toThrow('Invalid argument. Must be an instance of GameMap.');
        })
        it('should return true when comparing two identical maps', () => {
            const width = 10;
            const height = 10;
            const gameMap1 = new GameMap(width, height);
            const gameMap2 = new GameMap(width, height);

            expect(gameMap1.equal(gameMap2)).toBe(true);
        });

        it('should return false if maps has different width', () => {
            const height = 10;
            const gameMap1 = new GameMap(10, height);
            const gameMap2 = new GameMap(11, height);
            expect(gameMap1.equal(gameMap2)).toBe(false);
        })

        it('should return false if maps has different height', () => {
            const width = 10;
            const gameMap1 = new GameMap(width, 11);
            const gameMap2 = new GameMap(width, 10);
            expect(gameMap1.equal(gameMap2)).toBe(false);
        })

        it('should return false when comparing two different maps', () => {
            const width = 10;
            const height = 10;
            const gameMap1 = new GameMap(width, height);
            const gameMap2 = new GameMap(width, height);
            gameMap2.fillCell(5, 5, CellType.SNAKE);

            expect(gameMap1.equal(gameMap2)).toBe(false);
        });
    });
});