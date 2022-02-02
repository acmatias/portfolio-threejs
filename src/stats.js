import Stats from 'stats.js'

export default () => {
    /**
     * Stats
     */
    const stats = new Stats()
    stats.showPanel(0)
    document.body.appendChild(stats.dom)
}
