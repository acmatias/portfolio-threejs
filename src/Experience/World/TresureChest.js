import * as THREE from 'three'
import Experience from '../Experience.js'
import getAnimation from '../Utils/getAnimation.js'

export default class TresureChest {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // if (this.debug.active) {
        //     this.debugFolder = this.debug.ui.addFolder('Fox')
        // }

        // Setup
        this.resource = this.resources.items.tresureChestModel

        this.setModel()
        this.setAnimation()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.position.set(-3, -2, -25)
        this.model.rotation.set(0.2, -1.8, 0)
        this.scene.add(this.model)
    }

    setAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        this.animation.actions = {}
        this.animation.actions.chestOpen = this.animation.mixer.clipAction(
            getAnimation(this.resource, 'chestOpen')
        )
        this.animation.actions.chestOpen.play()
        this.animation.actions.chestOpen.timeScale = 2
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}
