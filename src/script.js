import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import axios from 'axios';


// DOM
 const formElement = document.querySelector('.form');
   formElement.addEventListener('submit', async(e) => {
    e.preventDefault();

    const data = new FormData();
    data.append(`files`, e.target[0].files[0]);

    const uploadRes = await axios({
        method: 'POST',
        url: 'http://localhost:1337/api/upload',
        data
    })

    axios
    .post('http://localhost:1337/api/sounds', {
        data: {
            name: 'Dolemon Sushi',
            url: uploadRes.data[0].url
        }
    })
    .then(response => {
        console.log(response);
    });
    document.querySelector(`.img`).src = `http://localhost:1337${uploadRes.data[0].url}`;
  });

// Data
const getStaticProps = async () => {
    const resp = await fetch(`http://localhost:1337/api/sounds`);
    const data = await resp.json();
  return data;
}

// Loading
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load(`/textures/golfball.png`)

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry( .5, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness= .7
material.roughness= .2
material.normalMap = normalTexture;


material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(2,2,2);
pointLight2.intensity = 1;

scene.add(pointLight2)

gui.add(pointLight2.position, `y`).min(-3).max(3).step(.01);
gui.add(pointLight2.position, `x`).min(-3).max(3).step(.01);
gui.add(pointLight2.position, `z`).min(-3).max(3).step(.01);
gui.add(pointLight2, `intensity`).min(0).max(6).step(.01);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const handleMoveDocument = e => {
    mouseX = (e.clientX - windowHalfX);
    mouseY = (e.clientY - windowHalfY);
}

const handleScrollWindow = e => {
    sphere.position.y = -(window.scrollY * .008)
}

const handleClickTitle = async (e) => {
    const sounds = await getStaticProps();
    console.log(sounds.data[1].attributes.url);
    document.querySelector(`.img`).src = `http://localhost:1337${sounds.data[0].attributes.url}`;
}

document.addEventListener(`mousemove`, handleMoveDocument);
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

window.addEventListener(`scroll`, handleScrollWindow);
document.querySelector(`.get`).addEventListener(`click`, handleClickTitle)

const clock = new THREE.Clock()

const tick = () =>
{
    targetX= mouseX * .001;
    targetY= mouseY * .001;


    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.rotation.y = .5 * elapsedTime

    // soort paralax effect 
    sphere.rotation.y = .5 * (targetX - sphere.rotation.y);
    sphere.rotation.x = .5 * (targetY - sphere.rotation.x);
    sphere.position.z = .5 * (targetY - sphere.rotation.y);

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()