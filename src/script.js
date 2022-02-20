import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import flagVertexShader from './shaders/flag/vertex.glsl'
import flagFragmentShader from './shaders/flag/fragment.glsl'
import { getGPUTier } from 'detect-gpu'
;(async () => {
    const gpuTier = await getGPUTier()
    console.log(gpuTier)
})()
import Stats from 'stats.js'

/**
 * Html scripts ------------------------------------------------------------------------
 */

// Navbar
const menu = document.querySelector('.menu')
const navbar = document.querySelector('.navbar')

menu.addEventListener('click', () => {
    navbar.classList.toggle('change')
    menu.classList.toggle('change')
})

/**
 * Loaders
 */
// let volumeParameters = {
//     volume: false,
//     waveVolume: 0.08,
//     bellVolume: 0.7,
//     submergeVolume: 0.1,
//     emergeVolume: 0.4,
//     newWaveVolume: 0.008,
//     bubbleVolume: 1,
// }
let volumeParameters = {
    volume: false,
    waveVolume: 0,
    bellVolume: 0,
    submergeVolume: 0,
    emergeVolume: 0,
    newWaveVolume: 0,
    bubbleVolume: 0,
}
const loadingBarElement = document.querySelector('.loading-bar')
const scrollElement = document.querySelector('.stop-scrolling')

const waveSound = new Audio('/sounds/wavesSound.mp3')
const bellSound = new Audio('/sounds/ship-bell.mp3')

const loadingManager = new THREE.LoadingManager(
    // Loaded
    () => {
        gsap.delayedCall(
            0.5,
            () => {
                gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
                loadingBarElement.classList.add('ended')
                scrollElement.classList.remove('stop-scrolling')
                loadingBarElement.style.transform = ''
                waveSound.play()
                waveSound.loop = true
                waveSound.volume = volumeParameters.waveVolume

                bellSound.volume = volumeParameters.bellVolume
                bellSound.currentTime = 0
                bellSound.play()
            },
            // Progress
            (itemUrl, itemsLoaded, itemsTotal) => {
                const progressRatio = itemsLoaded / itemsTotal
                loadingBarElement.style.transform = `scaleX(${progressRatio})`
            }
        )
    }
)

/**
 * Debug and stats
 */

const stats = new Stats()
stats.showPanel(0)

document.body.appendChild(stats.dom)
stats.dom.style.display = 'none'
let showStats = false

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
    } else if ((e.key === 'g' || e.key === 'G') && showStats == true) {
        stats.dom.style.display = 'block'
        showStats = false
    } else if ((e.key === 'g' || e.key === 'G') && showStats == false) {
        stats.dom.style.display = 'none'
        showStats = true
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

const dracoLoader = new DRACOLoader(loadingManager)
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)

// const gltfLoader = new GLTFLoader(loadingManager)
const textureLoader = new THREE.TextureLoader(loadingManager)
const flagTexture = textureLoader.load('/textures/ph-flag.jpg')

/**
 * Objects
 */

// Texture

const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// const auroraTexture = textureLoader.load('/textures/maps/aurora.jpg')
// scene.background = auroraTexture

// Fog
const fog = new THREE.Fog('#262837', 55, 128)
scene.fog = fog

gui.add(fog, 'near').min(0).max(100).step(1).name('fog near')
gui.add(fog, 'far').min(0).max(1000).step(1).name('fog far')

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
        uBigWavesSpeed: { value: 0.5 },

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

// Meshes
const objectDistance = 2

const cloudGroup = new THREE.Group()
scene.add(cloudGroup)

let cloudMixer = null
gltfLoader.load('/models/clouds.glb', (gltf) => {
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    cloudGroup.add(gltf.scene)
    // // Animation
    // cloudMixer = new THREE.AnimationMixer(gltf.scene)
    // const cloudMove1 = cloudMixer.clipAction(getAnimation(gltf, 'cloudAction1'))
    // const cloudMove2 = cloudMixer.clipAction(getAnimation(gltf, 'cloudAction2'))
    // const cloudMove3 = cloudMixer.clipAction(getAnimation(gltf, 'cloudAction3'))

    // cloudMove1.play()
    // cloudMove2.play()
    // cloudMove3.play()
    // cloudMove1.timeScale = 1 / 5 // add this
    // cloudMove2.timeScale = 1 / 5 // add this
    // cloudMove3.timeScale = 1 / 5 // add this
})

gltfLoader.load('/models/OceanScene.glb', (gltf) => {
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    scene.add(gltf.scene)
    // updateAllMaterials()
})

let diverMixer = null
gltfLoader.load('/models/diver.glb', (gltf) => {
    gltf.scene.position.set(-3, -20, -20)
    gltf.scene.rotation.set(6.5, 0.5, 0)
    gltf.scene.scale.set(3, 3, 3)
    scene.add(gltf.scene)

    // Diver Animation
    diverMixer = new THREE.AnimationMixer(gltf.scene)
    const diverIdle = diverMixer.clipAction(getAnimation(gltf, 'Idle'))
    diverIdle.play()
    diverIdle.timeScale = 0.5

    gui.add(gltf.scene.position, 'x').min(-50).max(50).step(0.001).name('diver position x')
    gui.add(gltf.scene.position, 'y').min(-50).max(50).step(0.001).name('diver position y')
    gui.add(gltf.scene.position, 'z').min(-50).max(50).step(0.001).name('diver position z')
    gui.add(gltf.scene.rotation, 'x').min(-50).max(50).step(0.0001).name('diver rotation x')
    gui.add(gltf.scene.rotation, 'y').min(-50).max(50).step(0.0001).name('diver rotation y')
    gui.add(gltf.scene.rotation, 'z').min(-50).max(50).step(0.0001).name('diver rotation z')
    // updateAllMaterials()
})

const tresureChestGroup = new THREE.Group()
scene.add(tresureChestGroup)

let chestMixer = null

gltfLoader.load('/models/tresureChest.glb', (gltf) => {
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    tresureChestGroup.add(gltf.scene)

    chestMixer = new THREE.AnimationMixer(tresureChestGroup)
    const chestOpen = chestMixer.clipAction(getAnimation(gltf, 'chestOpen'))

    // Chest Animation *Trigger later
    chestOpen.play()
    chestOpen.timeScale = 2

    // updateAllMaterials()
})

let sharkMixer = null
let fishMixer = null
const fishGroup = new THREE.Group()
const sharkGroup = new THREE.Group()
scene.add(fishGroup, sharkGroup)
gltfLoader.load('/models/anglerFish.glb', (gltf) => {
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    fishGroup.add(gltf.scene)
})
gltfLoader.load('/models/clownFish.glb', (gltf) => {
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    fishGroup.add(gltf.scene)
    fishMixer = new THREE.AnimationMixer(gltf.scene)
    const fishMove1 = fishMixer.clipAction(getAnimation(gltf, 'clownFishSwimming'))
    const fishMove2 = fishMixer.clipAction(getAnimation(gltf, 'Swim.002'))
    const fishMove3 = fishMixer.clipAction(getAnimation(gltf, 'Swim.003'))
    fishMove1.play()
    fishMove2.play()
    fishMove3.play()
})
gltfLoader.load('/models/shark.glb', (gltf) => {
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    sharkGroup.add(gltf.scene)
    sharkMixer = new THREE.AnimationMixer(gltf.scene)
    const sharkMove = sharkMixer.clipAction(getAnimation(gltf, 'sharkSwim'))
    sharkMove.play()

    // gsap.to(gltf.scene.position, { duration: 10, x: 50 })
})

const boatGroup = new THREE.Group()
scene.add(boatGroup)

const flagGeometry = new THREE.PlaneGeometry(1, 1, 32, 32)

const flagCount = flagGeometry.attributes.position.count
const flagRandoms = new Float32Array(flagCount)

for (let i = 0; i < flagCount; i++) {
    flagRandoms[i] = Math.random()
}

flagGeometry.setAttribute('aRandom', new THREE.BufferAttribute(flagRandoms, 1))

const flagMaterial = new THREE.ShaderMaterial({
    vertexShader: flagVertexShader,
    fragmentShader: flagFragmentShader,
    uniforms: {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('cyan') },
        uTexture: { value: flagTexture },
    },
    side: THREE.DoubleSide,
})

gui.add(flagMaterial.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
gui.add(flagMaterial.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')

const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial)
flagMesh.scale.y = 2 / 3
flagMesh.position.set(-0.02, 3.68, -21)
// boatGroup.add(flagMesh)

gltfLoader.load('/models/boat.glb', (gltf) => {
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    boatGroup.add(gltf.scene)
    gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('boatRotationY')
    const flag = scene.getObjectByName('flag')
    // flagGeometry.setAttribute('aRandom', new THREE.BufferAttribute(flagRandoms, 1))
    flag.material = flagMaterial
    flag.geometry.setAttribute('aRandom', new THREE.BufferAttribute(flagRandoms, 1))
})

let fisherMixer = null
gltfLoader.load('/models/fisher.glb', (gltf) => {
    gltf.scene.position.set(-3.5, -2, -25)
    gltf.scene.rotation.x = 0.2
    gltf.scene.rotation.y = -1.801
    boatGroup.add(gltf.scene)

    fisherMixer = new THREE.AnimationMixer(gltf.scene)
    const fisherMove = fisherMixer.clipAction(getAnimation(gltf, 'fishingAnimation'))
    const fisherRodMove = fisherMixer.clipAction(getAnimation(gltf, 'fishingRodAnimation'))
    fisherMove.play()
    fisherRodMove.play()
})
gui.add(boatGroup.position, 'y').min(-150).max(150).step(0.001).name('y')

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

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

const submergeSound = new Audio('/sounds/submerge.mp3')
const emergeSound = new Audio('/sounds/emerge.mp3')
const bubbleSound = new Audio('/sounds/bubbles.mp3')
const scrollUpBtn = document.querySelector('.scroll-up-btn')

window.addEventListener('scroll', () => {
    scrollY = window.scrollY * 10

    const newSection = Math.round(scrollY / sizes.height) / 5

    if (newSection != currentSection) {
        currentSection = newSection
        if (newSection === 1) {
            submergeSound.volume = volumeParameters.submergeVolume
            submergeSound.currentTime = 0
            submergeSound.play()

            waveSound.volume = volumeParameters.newWaveVolume
        } else if (newSection === 0) {
            scrollUpBtn.classList.add('hidden')
            emergeSound.volume = volumeParameters.emergeVolume
            emergeSound.currentTime = 0
            emergeSound.play()
            waveSound.volume = volumeParameters.waveVolume
        } else if (newSection === 4) {
            bubbleSound.play()
            bubbleSound.volume = volumeParameters.bubbleVolume
        }
    }

    if (currentSection != 0) {
        scrollUpBtn.classList.remove('hidden')
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

window.addEventListener('click', () => {
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case tresureChestGroup:
                console.log('click on object 1')
                break
            case object2:
                console.log('click on object 2')
                break
            case object3:
                console.log('click on object 3')
                break
        }
    }
})

function getAnimation(gltf, name) {
    let result
    gltf.animations.forEach((animation) => {
        if (animation.name === name) {
            result = animation
            return
        }
    })
    if (result == null) {
        console.error('animation: ' + name + ' cannot be found!')
    }
    return result
}

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
let currentIntersect = null

const tick = () => {
    stats.begin()
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Flag animation
    flagMaterial.uniforms.uTime.value = elapsedTime

    // Cast a ray
    raycaster.setFromCamera(cursor, camera)
    const objectsToTest = [tresureChestGroup]
    const intersects = raycaster.intersectObjects(objectsToTest)
    // if (intersects.length) {
    //     if (currentIntersect === null) {
    //         console.log('mouse enter')
    //     }
    //     currentIntersect = intersects[0]
    // } else {
    //     if (currentIntersect) {
    //         console.log('mouse leave')
    //     }
    //     currentIntersect = null
    // }

    // Animate camera
    camera.position.y = (-scrollY / sizes.height) * objectDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Model animation

    // if (cloudMixer) {
    //     cloudMixer.update(deltaTime)
    // }
    if (diverMixer) {
        diverMixer.update(deltaTime)
    }
    if (fishMixer) {
        fishMixer.update(deltaTime)
    }
    if (fisherMixer) {
        fisherMixer.update(deltaTime)
    }
    if (sharkMixer) {
        sharkMixer.update(deltaTime)
    }

    if (chestMixer) {
        chestMixer.update(deltaTime)
    }
    const fishAngle = elapsedTime * 0.5
    fishGroup.position.x = Math.sin(fishAngle) * Math.cos(fishAngle)

    waterMaterial.uniforms.uTime.value = elapsedTime

    boatGroup.position.y = Math.sin(elapsedTime) * 0.08

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    stats.end()
}

tick()
