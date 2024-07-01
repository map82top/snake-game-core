import CellType from '@/presenters/cellType.js'

export default class GameMap {
    #map
    constructor(width, height) {
        if (!Number.isInteger(width) || width < 10 || !Number.isInteger(height) || height < 10) {
            throw new Error('width and height must be integer and greater than 10');
        }
        this.#map = this.createMap(width, height);
    }

    createMap(width, height) {
        const map = [];
        for (let i = 0; i < width; i++) {
            map.push(new Array(height).fill(CellType.EMPTY));
        }
        return map;
    }

    get width() {
        return this.#map.length
    }

    get height() {
        return this.#map[0].length;
    }

    getCell(x, y) {
        if (this.isValidPosition(x, y)) {
            return this.#map[x][y];
        } else {
            throw new Error('Invalid position');
        }
    }

    fillCell(x, y, value) {
        if (!this.isValidPosition(x, y)) {
            throw new Error('Invalid position');
        } 
        if (this.getCell(x, y) !== CellType.EMPTY) {
            throw new Error('Cell is already filled');
        }
        this.#map[x][y] = value;
    }

    isValidPosition(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    equal(otherMap) {
        if (!(otherMap instanceof GameMap)) {
            throw new Error('Invalid argument. Must be an instance of GameMap.');
        }
        if (this.width !== otherMap.width || this.height !== otherMap.height) {
            return false;
        }
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.getCell(x, y) !== otherMap.getCell(x, y)) {
                    return false
                }
            }
        }
        return true;
    }
}