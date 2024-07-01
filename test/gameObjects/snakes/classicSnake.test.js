
import ClassicSnake from "@/entities/snakes/classicSnake.js"

describe('classicSnake.js', () => {
    describe('constructor', () => {
        it('the snake size can\'t be equal to 0', () => {
            expect(() => new ClassicSnake(0)).toThrow('Snake size can\'t be lower 1');
        });

        it('create snake with custom size', () => {
            const customSize = 10;
            const snake = new ClassicSnake(customSize);
            expect(snake.length).toBe(customSize);
            expect(snake.dead).toBeFalsy();
        });

        it('create snake and check default parameters', () => {
            const snake = new ClassicSnake();
            expect(snake.length).toBe(3);
            expect(snake.dead).toBeFalsy();
            for (let i = 0; i < snake.length; i++) {
                expect(snake.chains[i].x).toBe(0);
                expect(snake.chains[i].y).toBe(-i);
            }
        });
    });

    describe('movement', () => {
        let snake
        beforeEach(() => {
            snake = new ClassicSnake();
        });

        function checkSnakeState(expectedLength, expectedDeadStatus) {
            expect(snake.length).toBe(expectedLength);
            expect(snake.dead).toBe(expectedDeadStatus);
        }

        it('throw error when moving snake to the left against last vector', () => {
            snake.moveRight();
            expect(() => snake.moveLeft()).toThrow('Snake can\'t move to the left');
        });

        it('throw error when moving snake to the top against last vector', () => {
            snake.moveRight();
            snake.moveBottom();
            expect(() => snake.moveTop()).toThrow('Snake can\'t move to the top');
        });

        it('throw error when moving snake to the bottom when already at the bottom', () => {
            expect(() => snake.moveBottom()).toThrow('Snake can\'t move to the bottom');
        });

        it('throw error when moving snake with incorrect vector', () => {
            expect(() => snake.move([2, 1], 'right')).toThrow('Incorrect vector');
            expect(() => snake.move([0, 0], 'right')).toThrow('Incorrect vector');
        });

        it('move snake to the left', () => {
            snake.moveLeft(); // not grow
            checkSnakeState(3, false);
            snake.grow();
            snake.moveLeft();
            checkSnakeState(4, false);
        });

        it('move snake to the right', () => {
            snake.moveRight(); // not grow
            checkSnakeState(3, false);
            snake.grow();
            snake.moveRight();
            checkSnakeState(4, false);
        });

        it('move snake to the top', () => {
            snake.moveTop(); // not grow
            checkSnakeState(3, false);
            snake.grow();
            snake.moveTop();
            checkSnakeState(4, false);
        });

        it('move snake to the bottom', () => {
            expect(() => snake.moveBottom()).toThrow('Snake can\'t move to the bottom');

            snake.moveRight();
            snake.moveBottom(); // not grow
            checkSnakeState(3, false);

            snake.grow();
            snake.moveBottom();
            checkSnakeState(4, false);
        });

        it('snake can\'t move against last vector', () => {
            snake.moveRight();
            expect(() => snake.moveLeft()).toThrow('Snake can\'t move to the left');
            snake.moveBottom();
            expect(() => snake.moveTop()).toThrow('Snake can\'t move to the top');
        });

        it('snake can\'t move against last vector', () => {
            snake.moveRight();
            expect(() => snake.moveLeft()).toThrow('Snake can\'t move to the left');
            snake.moveBottom();
            expect(() => snake.moveTop()).toThrow('Snake can\'t move to the top');
        });
    });

    describe('death state', () => {
        let snake
        let snakeSize = 6

        beforeEach(() => {
            snake = new ClassicSnake(snakeSize);

            snake.moveRight();
            snake.moveBottom();
        })
        it('snake ate itself', () => {
            snake.moveLeft();
            expect(snake.length).toBe(snakeSize);
            expect(snake.dead).toBeTruthy();
            expect(snake.testCollision()).toBeTruthy();
        });

        it('snake can not move after death', () => {
            snake.moveLeft();

            expect(() => snake.moveBottom()).toThrow('Snake is dead');
            expect(() => snake.moveTop()).toThrow('Snake is dead');
            expect(() => snake.moveRight()).toThrow('Snake is dead');
            expect(() => snake.moveLeft()).toThrow('Snake is dead');
        })

        it('snake is dead after calling kill()', () => {
            snake.kill();
            expect(snake.dead).toBeTruthy();
            expect(snake.testCollision()).toBeTruthy();
        });

    });
});