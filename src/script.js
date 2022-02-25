import './style.css'
import Experience from './Experience/Experience.js'

const experience = new Experience(document.querySelector('canvas.webgl'))

// Navbar
const menu = document.querySelector('.menu')
const navbar = document.querySelector('.navbar')

menu.addEventListener('click', () => {
    navbar.classList.toggle('change')
    menu.classList.toggle('change')
})
