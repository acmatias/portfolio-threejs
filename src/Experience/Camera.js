import * as THREE from 'three'
import Experience from './Experience.js'

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.time = this.experience.time

        this.setInstance()
        // this.setOrbitControls()
        this.setCameraAnimation()
    }

    setInstance() {
        this.cameraGroup = new THREE.Group()
        this.scene.add(this.cameraGroup)
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.z = 8
        this.cameraGroup.add(this.instance)
    }

    setOrbitControls() {
        // this.controls = new OrbitControls(this.instance, this.canvas)
        // this.controls.enableDamping = true
    }

    setCameraAnimation() {
        this.cursor = {
            x: 0,
            y: 0,
        }

        window.addEventListener('mousemove', (event) => {
            this.cursor.x = event.clientX / this.sizes.width - 0.5
            this.cursor.y = event.clientY / this.sizes.height - 0.5
        })
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.instance.position.y =
            ((-window.scrollY * 10) / this.sizes.height) * this.experience.objectsDistance

        this.parallaxX = this.cursor.x * 0.5
        this.parallaxY = -this.cursor.y * 0.5

        this.cameraGroup.position.x +=
            (this.parallaxX - this.cameraGroup.position.x) * 5 * (this.time.delta * 0.001)
        this.cameraGroup.position.y +=
            (this.parallaxY - this.cameraGroup.position.y) * 5 * (this.time.delta * 0.001)
    }
}
