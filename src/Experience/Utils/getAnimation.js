export default function getAnimation(gltf, name) {
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
