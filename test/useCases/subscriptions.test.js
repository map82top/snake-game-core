import Controller from '@/controllers/controller.js';

describe('controller.js', () => {
    let controller;

    beforeEach(() => {
        controller = new Controller();
    });

    describe('subscription behavior', () => {
        it('should allow subscribing to an event with a listener', () => {
            const eventType = 'testEvent';
            const listener = jest.fn();

            controller.on(eventType, listener);
            const listeners = controller.getListeners(eventType);

            expect(listeners).toContain(listener);
        });

        it('should not add the same listener twice for the same event', () => {
            const eventType = 'testEvent';
            const listener = jest.fn();

            controller.on(eventType, listener);
            controller.on(eventType, listener); // Attempt to add the same listener again
            const listeners = controller.getListeners(eventType);

            expect(listeners.length).toBe(1);
        });

        it('should allow multiple unique listeners for the same event', () => {
            const eventType = 'testEvent';
            const listener1 = jest.fn();
            const listener2 = jest.fn();

            controller.on(eventType, listener1);
            controller.on(eventType, listener2);
            const listeners = controller.getListeners(eventType);

            expect(listeners).toContain(listener1);
            expect(listeners).toContain(listener2);
            expect(listeners.length).toBe(2);
        });

        it('should return an empty array for events with no listeners', () => {
            const eventType = 'nonExistentEvent';
            const listeners = controller.getListeners(eventType);

            expect(listeners).toEqual([]);
        });
    });
});