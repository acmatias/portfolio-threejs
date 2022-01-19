import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

/**
 * Debug
 */
const gui = new dat.GUI({ width: 400 })

const parameters = {
    materialColor: '#ffeded',
}

// gui.addColor(parameters, 'materialColor').onChange(() => {
//     material.color.set(parameters.materialColor)
//     particlesMaterial.color.set(parameters.materialColor)
// })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Objects
 */

// Texture
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

const auroraTexture = textureLoader.load('textures/maps/aurora.jpg')
scene.background = auroraTexture
// Material
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture,
})

// Meshes
const objectDistance = 4
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

mesh1.position.y = -objectDistance * 0
mesh2.position.y = -objectDistance * 1
mesh3.position.y = -objectDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

gltfLoader.load('/models/Scene2.glb', (gltf) => {
    // gltf.scene.scale.set(0.3, 0.3, 0.3)
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    scene.add(gltf.scene)

    gui.add(gltf.scene.rotation, 'x').min(-Math.PI).max(Math.PI).step(0.001).name('rotationX')
    gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotationY')
    gui.add(gltf.scene.position, 'x').min(-150).max(150).step(0.001).name('posX')
    gui.add(gltf.scene.position, 'y').min(-150).max(150).step(0.001).name('posY')
    gui.add(gltf.scene.position, 'z').min(-150).max(150).step(0.001).name('posZ')
    updateAllMaterials()
})

// scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
// Geometry
// const particlesCount = 200
// const positions = new Float32Array(particlesCount * 3)

// for (let i = 0; i < particlesCount; i++) {
//     positions[i * 3 + 0] = (Math.random() - 0.5) * 10
//     positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 5
// }

// const particlesGeometry = new THREE.BufferGeometry()
// particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// // Material
// const particlesMaterial = new THREE.PointsMaterial({
//     color: parameters.materialColor,
//     sizeAttenuation: true,
//     size: 0.03,
// })

// Points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 5)
directionalLight.position.set(0.25, 5, 5)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.015
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('moonLightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('moonLightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('moonLightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('moonLightZ')
gui.add(directionalLight.shadow, 'normalBias').min(0).max(0.1).step(0.0001)

const spotLight = new THREE.PointLight('#ffffff', 10)
spotLight.position.set(0, 1.2, 0.6)
gui.add(spotLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(spotLight.position, 'x').min(-5).max(5).step(0.001).name('lightX')
gui.add(spotLight.position, 'y').min(-5).max(5).step(0.001).name('lightY')
gui.add(spotLight.position, 'z').min(-5).max(5).step(0.001).name('lightZ')
scene.add(spotLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 8
cameraGroup.add(camera)

gui.add(camera.position, 'x').min(-50).max(50).step(0.001).name('camera posX')
gui.add(camera.position, 'y').min(-50).max(50).step(0.001).name('camera posY')
gui.add(camera.position, 'z').min(-50).max(50).step(0.001).name('camera posZ')
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
;(renderer.toneMapping = THREE.ACESFilmicToneMapping), (renderer.toneMappingExposure = 0.3)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)
gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
})

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY * 10

    const newSection = Math.round(scrollY / sizes.height)

    if (newSection != currentSection) {
        currentSection = newSection
        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5',
        })
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = (-scrollY / sizes.height) * objectDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
