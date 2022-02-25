import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class TestMesh {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Mesh')
        }

        this.setTexture()
        this.setMaterial()
        this.setMesh()
        this.setMeshAnimation()
    }

    setTexture() {
        this.texture = {}
        this.texture.color = '#ffeded'
        this.texture.gradientMap = this.resources.items.gradientTexture
    }
    setMaterial() {
        this.texture.gradientMap.magFilter = THREE.NearestFilter
        this.material = new THREE.MeshToonMaterial({
            color: this.texture.color,
            gradientMap: this.texture.gradientMap,
        })
        // Debug
        if (this.debug.active) {
            this.debugFolder.addColor(this.material, 'color')
        }
    }
    setMesh() {
        const objectsDistance = 4

        this.mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), this.material)
        this.mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), this.material)
        this.mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), this.material)

        this.mesh1.position.x = 2
        this.mesh2.position.x = -2
        this.mesh3.position.x = 2

        this.mesh1.position.y = -objectsDistance * 0
        this.mesh2.position.y = -objectsDistance * 1
        this.mesh3.position.y = -objectsDistance * 2

        this.scene.add(this.mesh1, this.mesh2, this.mesh3)

        this.sectionMeshes = [this.mesh1, this.mesh2, this.mesh3]
    }
    setMeshAnimation() {
        this.currentSection = 0
        window.addEventListener('scroll', () => {
            this.newSection = Math.round(window.scrollY / this.sizes.height)
            if (this.newSection != this.currentSection) {
                this.currentSection = this.newSection

                gsap.to(this.sectionMeshes[this.currentSection].rotation, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3',
                    z: '+=1.5',
                })
            }
        })
    }

    update() {
        for (this.mesh of this.sectionMeshes) {
            this.mesh.rotation.x += this.time.delta * 0.001
            this.mesh.rotation.y += this.time.delta * 0.001
            this.mesh.rotation.z += this.time.delta * 0.001
        }
    }
}
