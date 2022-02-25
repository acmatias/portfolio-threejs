import * as THREE from 'three'
import Experience from '../Experience.js'
import getAnimation from '../Utils/getAnimation.js'

export default class Diver {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Diver')
        }

        // Setup
        this.resource = this.resources.items.diverModel

        this.setModel()
        this.setAnimation()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.position.set(-3, -20, -20)
        this.model.rotation.set(6.5, 0.5, 0)
        this.model.scale.set(3, 3, 3)
        this.scene.add(this.model)
    }

    setAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        this.animation.actions = {}

        this.animation.actions.idle = this.animation.mixer.clipAction(getAnimation(this.resource, 'Idle'))

        this.animation.actions.idle.play()
        this.animation.actions.idle.timeScale = 0.5
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}
