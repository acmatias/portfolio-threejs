import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Overlay {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.setGeometry()
        this.setTexture()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
    }
    setTexture() {
        this.texture = {}
        this.texture.color = this.resources.items.dirtColorTexture
        this.texture.encoding = THREE.sRGBEncoding
        this.texture.color.repeat.set(1.5, 1.5)
        this.texture.color.wrapS = THREE.RepeatWrapping
        this.texture.color.wrapT = THREE.RepeatWrapping

        this.texture.normal = this.resources.items.dirtNormalTexture
        this.texture.normal.repeat.set(1.5, 1.5)
        this.texture.normal.wrapS = THREE.RepeatWrapping
        this.texture.normal.wrapT = THREE.RepeatWrapping
    }
    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uAlpha: { value: 1 },
            },
            vertexShader: `
                 void main()
                 {
                     gl_Position =  vec4(position, 1.0);
                 }
             `,
            fragmentShader: `
                 uniform float uAlpha;
                 void main()
                 {
                     gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
                 }
             `,
        })
    }
    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }
}
