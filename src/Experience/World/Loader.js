import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

const loadingBarElement = document.querySelector('.loading-bar')
const scrollElement = document.querySelector('.stop-scrolling')

export default class Loader {
    constructor(_progress) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.progress = _progress

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.setLoader()
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(2, 2, 1, 1)
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

    setLoader() {
        loadingBarElement.style.transform = `scaleX(${this.progress})`
        if ((this.progress = 1)) {
            gsap.delayedCall(0.5, () => {
                gsap.to(this.material.uniforms.uAlpha, { duration: 3, value: 0 })
                scrollElement.classList.remove('stop-scrolling')
                loadingBarElement.style.transform = ''
            })
        }
    }
}
