import BorderedRoom from "@/entities/rooms/borderedRoom.js"

export default class RoomFactory {
    static createRoom(type, width, height) {
        switch(type) {
            case "bordered":
                return new BorderedRoom(width, height)
            default:
                throw new Error('Not supported room type: ' + type)
        }
    }

    static isSupported(type) {
        return ['bordered'].includes(type)
    }
}