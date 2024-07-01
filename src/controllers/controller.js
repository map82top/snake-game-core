export default class Controller {
    #listeners = {}

    constructor() {
    }

    getListeners(eventType) {
        return this.#listeners[eventType] || []
    }

    on(eventType, listener) {
        if (!this.#listeners[eventType]) {
            this.#listeners[eventType] = []
        }
        const listeners = this.#listeners[eventType]
        if (listeners.indexOf(listener) === -1) {
            listeners.push(listener)
        }
    }
}