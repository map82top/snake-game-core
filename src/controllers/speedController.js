import Controller from '@/controllers/controller.js'


export default class SpeedController extends Controller {
    #currentSpeed
    #speedAccelerationStep
    #moveInterval
    static SPEED_MEASURE_VALUE = 1000
    static MAX_SUPPORTED_SPEED = 10

    constructor(initialSpeed, speedAccelerationStep) {
        super()
        this.#speedAccelerationStep = speedAccelerationStep
        this.#currentSpeed = initialSpeed
        this.updateCurrentSpeed()
    }

    get moveInterval() {
        return this.#moveInterval
    }

    accelerateSpeed() {
        this.#currentSpeed += this.#speedAccelerationStep
        this.updateCurrentSpeed()
    }

    updateCurrentSpeed() {
        if (SpeedController.MAX_SUPPORTED_SPEED < this.#currentSpeed) {
            this.#currentSpeed = SpeedController.MAX_SUPPORTED_SPEED
        }
        this.#moveInterval = Math.floor(SpeedController.SPEED_MEASURE_VALUE / this.#currentSpeed)
    }
}