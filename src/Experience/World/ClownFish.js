import * as THREE from 'three'
import Experience from '../Experience.js'
import getAnimation from '../Utils/getAnimation.js'

export default class ClownFish {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // if (this.debug.active) {
        //     this.debugFolder = this.debug.ui.addFolder('Fish')
        // }

        // Setup
        this.resource = this.resources.items.clownFishModel

        this.fishGroup = new THREE.Group()
        this.scene.add(this.fishGroup)

        this.setModel()
        this.setAnimation()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.position.set(-3.5, -2, -25)
        this.model.rotation.x = 0.2
        this.model.rotation.y = -1.801
        this.fishGroup.add(this.model)
    }

    setAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.resource.scene)

        this.animation.actions = {}

        this.animation.actions.fishMove1 = this.animation.mixer.clipAction(
            getAnimation(this.resource, 'clownFishSwimming')
        )
        this.animation.actions.fishMove2 = this.animation.mixer.clipAction(
            getAnimation(this.resource, 'Swim.002')
        )
        this.animation.actions.fishMove3 = this.animation.mixer.clipAction(
            getAnimation(this.resource, 'Swim.003')
        )

        this.animation.actions.fishMove1.play()
        this.animation.actions.fishMove2.play()
        this.animation.actions.fishMove3.play()
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}
