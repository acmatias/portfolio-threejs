import * as THREE from 'three'
import Experience from '../Experience.js'
import flagVertexShader from '../shaders/flag/vertex.glsl'
import flagFragmentShader from '../shaders/flag/fragment.glsl'
import getAnimation from '../Utils/getAnimation.js'

export default class Boat {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Boat')
        }

        // Setup
        this.boatModel = this.resources.items.boatModel
        this.fisherModel = this.resources.items.fisherModel
        this.boatGroup = new THREE.Group()
        this.scene.add(this.boatGroup)

        this.setBoatModel()
        this.setFlagMaterial()
        this.setFisherModel()
        this.setFisherAnimation()
    }

    setBoatModel() {
        // this.model = this.boatModel.scene
        this.boatModel.scene.position.set(-3.5, -2, -25)
        this.boatModel.scene.rotation.x = 0.2
        this.boatModel.scene.rotation.y = -1.801
        this.boatGroup.add(this.boatModel.scene)
    }

    setFlagMaterial() {
        this.flagTexture = {}
        this.flagTexture.color = this.resources.items.flagTexture
        this.flagGeometry = new THREE.PlaneGeometry(1, 1, 32, 32)
        this.flagCount = this.flagGeometry.attributes.position.count
        this.flagRandoms = new Float32Array(this.flagCount)

        for (this.i = 0; this.i < this.flagCount; this.i++) {
            this.flagRandoms[this.i] = Math.random()
        }
        this.flagMaterial = new THREE.ShaderMaterial({
            vertexShader: flagVertexShader,
            fragmentShader: flagFragmentShader,
            uniforms: {
                uFrequency: { value: new THREE.Vector2(10, 5) },
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('cyan') },
                uTexture: { value: this.flagTexture.color },
            },
            side: THREE.DoubleSide,
        })
        this.flag = this.scene.getObjectByName('flag')
        this.flag.material = this.flagMaterial
        this.flagGeometry.setAttribute('aRandom', new THREE.BufferAttribute(this.flagRandoms, 1))
    }

    setFisherModel() {
        this.fisherModel.scene.position.set(-3.5, -2, -25)
        this.fisherModel.scene.rotation.x = 0.2
        this.fisherModel.scene.rotation.y = -1.801
        this.boatGroup.add(this.fisherModel.scene)
    }

    setFisherAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.fisherModel.scene)

        this.animation.actions = {}

        this.animation.actions.fish = this.animation.mixer.clipAction(
            getAnimation(this.fisherModel, 'fishingAnimation')
        )
        this.animation.actions.rod = this.animation.mixer.clipAction(
            getAnimation(this.fisherModel, 'fishingRodAnimation')
        )

        this.animation.actions.fish.play()
        this.animation.actions.rod.play()
    }

    update() {
        this.flagMaterial.uniforms.uTime.value = this.time.elapsed * 0.002
        this.boatGroup.position.y = Math.sin(this.time.elapsed * 0.001) * 0.08

        this.animation.mixer.update(this.time.delta * 0.001)
    }
}
