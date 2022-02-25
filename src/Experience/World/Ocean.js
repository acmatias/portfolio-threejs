import * as THREE from 'three'
import Experience from '../Experience.js'
import waterVertexShader from '../shaders/water/vertex.glsl'
import waterFragmentShader from '../shaders/water/fragment.glsl'

export default class Water {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        // Setup
        this.resource = this.resources.items.oceanScene

        this.setModel()
        this.setGeometry()
        this.setTexture()
        this.setMaterial()
        this.setMesh()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.position.set(-3.5, -2, -25)
        this.model.rotation.x = 0.2
        this.model.rotation.y = -1.801
        this.scene.add(this.model)
    }
    setGeometry() {
        this.waterGeometry = new THREE.PlaneGeometry(4, 4, 512, 512)
    }
    setTexture() {
        this.texture = {}
        this.texture.depthColor = '#186691'
        this.texture.surfaceColor = '#9bd8ff'
    }
    setMaterial() {
        this.waterMaterial = new THREE.ShaderMaterial({
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },

                uBigWavesElevation: { value: 0.11 },
                uBigWavesFrequency: { value: new THREE.Vector2(0.24, 0.17) },
                uBigWavesSpeed: { value: 0.5 },

                uSmallWavesElevation: { value: 0.08 },
                uSmallWavesFrequency: { value: 0.31 },
                uSmallWavesSpeed: { value: 0.12 },
                uSmallIterations: { value: 4.0 },

                uDepthColor: { value: new THREE.Color(this.texture.depthColor) },
                uSurfaceColor: { value: new THREE.Color(this.texture.surfaceColor) },
                uColorOffset: { value: 0.08 },
                uColorMultiplier: { value: 5 },
            },
        })
    }
    setMesh() {
        this.water = new THREE.Mesh(this.waterGeometry, this.waterMaterial)
        this.water.rotation.x = -1.34
        this.water.scale.set(18, 20, 20)
        this.water.position.x = 0
        this.water.position.y = -2
        this.water.position.z = -25.5
        this.scene.add(this.water)
    }

    update() {
        this.waterMaterial.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}
