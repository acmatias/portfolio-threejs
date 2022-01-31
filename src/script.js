import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { getGPUTier } from 'detect-gpu'
;(async () => {
    const gpuTier = await getGPUTier()
    console.log(gpuTier)
})()

import Stats from 'stats.js'

/**
 * Stats
 */
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

/**
 * Loaders
 */
const loadingBarElement = document.querySelector('.loading-bar')

const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        gsap.delayedCall(0.5, () => {
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        })
    },
    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
        console.log(progressRatio)
    }
)

/**
 * Debug
 */
const gui = new dat.GUI({ width: 400 })
let guiToggle = true
gui.show(gui._hidden)
gui.open(gui._closed)

window.addEventListener('keypress', (e) => {
    if ((e.key === 'h' || e.key === 'H') && guiToggle == false) {
        gui.show(guiToggle)
        guiToggle = true
    } else if ((e.key === 'h' || e.key === 'H') && guiToggle == true) {
        gui.show(guiToggle)
        guiToggle = false
    }
})

const debugObject = {}

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
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
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
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader(loadingManager)
const textureLoader = new THREE.TextureLoader(loadingManager)

/**
 * Objects
 */

// Texture
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

const auroraTexture = textureLoader.load('/textures/maps/aurora.jpg')
scene.background = auroraTexture

// Water
const waterGeometry = new THREE.PlaneGeometry(4, 4, 512, 512)

// Color
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.11 },
        uBigWavesFrequency: { value: new THREE.Vector2(0.24, 0.17) },
        uBigWavesSpeed: { value: 0.33 },

        uSmallWavesElevation: { value: 0.08 },
        uSmallWavesFrequency: { value: 0.31 },
        uSmallWavesSpeed: { value: 0.12 },
        uSmallIterations: { value: 4.0 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
    },
})

// Debug
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('uBigWavesElavation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
    .min(0)
    .max(10)
    .step(0.01)
    .name('uBigWavesFrequencX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
    .min(0)
    .max(10)
    .step(0.01)
    .name('uBigWavesFrequencyY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.01).name('uBigWavesSpeed')

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
    .min(0)
    .max(1)
    .step(0.01)
    .name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
    .min(0)
    .max(30)
    .step(0.01)
    .name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.01).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

gui.addColor(debugObject, 'depthColor').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.01).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.01).name('uColorMultiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = -1.34
water.scale.set(18, 20, 20)
water.position.x = 0
water.position.y = -2
water.position.z = -25.5
scene.add(water)

gui.add(water.position, 'x').min(-50).max(50).step(0.001).name('waterPos X')
gui.add(water.position, 'y').min(-50).max(50).step(0.001).name('waterPos Y')
gui.add(water.position, 'z').min(-50).max(50).step(0.001).name('waterPos Z')
gui.add(water.rotation, 'x').min(-10).max(10).step(0.001).name('waterRot x')
gui.add(water.rotation, 'y').min(-10).max(10).step(0.001).name('waterRot y')
gui.add(water.rotation, 'z').min(-10).max(10).step(0.001).name('waterRot z')

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

gltfLoader.load('/models/OceanScene.glb', (gltf) => {
    // gltf.scene.scale.set(0.3, 0.3, 0.3)
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    scene.add(gltf.scene)
    // updateAllMaterials()
})

let mixer = null

const boatGroup = new THREE.Group()
scene.add(boatGroup)

// fbxLoader.load('/models/Fishing-Idle.fbx', (fbx) => {
//     // fbx.scene.scale.set(0.25, 0.25, 0.25)
//     scene.add(fbx)

//     gui.add(fbx.position, 'x').min(-10).max(10).step(0.001).name('modelPos X')
//     gui.add(fbx.position, 'y').min(-10).max(10).step(0.001).name('modelPos Y')
//     gui.add(fbx.position, 'z').min(-10).max(10).step(0.001).name('modelPos Z')

//     // Animation
//     mixer = new THREE.AnimationMixer(fbx.scene)
//     console.log('====================================')
//     console.log(fbx)
//     console.log('====================================')
//     // const action = mixer.clipAction(fbx.animations[2])
//     // action.play()
// })

gltfLoader.load('/models/boat.glb', (gltf) => {
    // gltf.scene.scale.set(0.3, 0.3, 0.3)
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    boatGroup.add(gltf.scene)
    gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('boatRotationY')
    // updateAllMaterials()
})
gui.add(boatGroup.position, 'y').min(-150).max(150).step(0.001).name('y')

// scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 10)
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
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.3
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
    stats.begin()
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
    waterMaterial.uniforms.uTime.value = elapsedTime

    boatGroup.position.y = Math.sin(elapsedTime) * 0.08

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    stats.end()
}

tick()
