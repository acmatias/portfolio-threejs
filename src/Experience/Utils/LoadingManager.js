import * as THREE from 'three'
import gsap from 'gsap'

const loadingBarElement = document.querySelector('.loading-bar')
const scrollElement = document.querySelector('.stop-scrolling')

export default class LoadingManager {
    constructor() {
        this.loadingManager.on('ready', () => {
            this.instance = new THREE.LoadingManager(
                // Loaded
                () => {
                    gsap.delayedCall(
                        0.5,
                        () => {
                            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
                            loadingBarElement.classList.add('ended')
                            scrollElement.classList.remove('stop-scrolling')
                            loadingBarElement.style.transform = ''
                            // waveSound.play()
                            // waveSound.loop = true
                            // waveSound.volume = volumeParameters.waveVolume

                            // bellSound.volume = volumeParameters.bellVolume
                            // bellSound.currentTime = 0
                            // bellSound.play()
                        },
                        // Progress
                        (itemUrl, itemsLoaded, itemsTotal) => {
                            const progressRatio = itemsLoaded / itemsTotal
                            loadingBarElement.style.transform = `scaleX(${progressRatio})`
                        }
                    )
                }
            )
        })
    }
}
