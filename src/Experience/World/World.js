import Experience from '../Experience.js'
import Environment from './Environment.js'
import Island from './Island.js'
import Ocean from './Ocean.js'
import Boat from './Boat.js'
import Diver from './Diver.js'
import Shark from './Shark.js'
import TresureChest from './TresureChest.js'
import ClownFish from './ClownFish.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            // Setup
            // this.island = new Island()
            this.ocean = new Ocean()
            this.boat = new Boat()
            this.diver = new Diver()
            this.shark = new Shark()
            this.clownFish = new ClownFish()
            this.tresureChest = new TresureChest()
            this.environment = new Environment()
        })
    }
    update() {
        if (this.ocean) {
            this.ocean.update()
        }
        if (this.boat) {
            this.boat.update()
        }
        if (this.diver) {
            this.diver.update()
        }
        if (this.shark) {
            this.shark.update()
        }
        if (this.clownFish) {
            this.clownFish.update()
        }
        if (this.tresureChest) {
            this.tresureChest.update()
        }
    }
}
