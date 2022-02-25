import Experience from '../Experience.js'

export default class Island {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Island')
        }

        // Setup
        this.resource = this.resources.items.oceanScene

        this.setModel()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.position.set(-3.5, -2, -25)
        this.model.rotation.x = 0.2
        this.model.rotation.y = -1.801
        this.scene.add(this.model)
    }

    update() {}
}
