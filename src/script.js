import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'

// Loading
const textureLoader = new THREE.TextureLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects

// Materials

const treeTextures = [];
for (let i = 1; i < 7; i++) {
    treeTextures[i]= new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/detailpage/tree_${i}.png`),
        transparent: true
    });
}

console.log(treeTextures);

const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/detailpagetest/background.png'),
    transparent: true,
    side: THREE.DoubleSide
});

const materialTwo = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/detailpagetest/bij.png'),
    transparent: true,
    side: THREE.DoubleSide
});

const materialImker = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/detailpagetest/imker.png'),
    transparent: true,
    side: THREE.DoubleSide
});

const materialMadeliefje = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/detailpagetest/madeliefje.png'),
    transparent: true,
    side: THREE.DoubleSide
});

const materialPaardenbloem = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/detailpagetest/paardenbloem.png'),
    transparent: true,
    side: THREE.DoubleSide
});

const materialPaardenbloemjong = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/detailpagetest/paardenbloemjong.png'),
    transparent: true,
    side: THREE.DoubleSide
});

const materialTree = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/detailpagetest/tree.png'),
    transparent: true,
    side: THREE.DoubleSide
});

const materialCloud = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/cloud.jpg'),
    transparent: true,
    side: THREE.DoubleSide
});

const wait = async() => {
    console.log(materialTree.map.repeat.set(1,1));  
    console.log(materialImker.map.repeat.set(1,1));
}
wait();

const material1 = new THREE.MeshBasicMaterial( {
    color: 0xb2dcff,
    side: THREE.DoubleSide
});

// Mesh
// const shapeFlat = new THREE.PlaneGeometry(100, 100);
// shapeFlat.rotateX(-Math.PI * 0.5);
// const meshPlane = new THREE.Mesh(shapeFlat, material1);

// meshPlane.overdraw = true;
// meshPlane.position.y = -3;
//scene.add(meshPlane);

const shape = new THREE.PlaneGeometry(500, 500);
const meshTexture = new THREE.Mesh(shape, material1);
meshTexture.position.y = -.5;
meshTexture.position.z = -60;
scene.add(meshTexture);

const shapeTwo = new THREE.PlaneGeometry(10, 5);
let meshTextureTwo = new THREE.Mesh(shapeTwo, materialTwo);
meshTextureTwo.position.y = .3;
meshTextureTwo.position.z = 2;
scene.add(meshTextureTwo);

console.log(window.innerHeight, window.innerWidth);
const shapeTree = new THREE.PlaneGeometry(160,80);
let meshTextureThree = new THREE.Mesh(shapeTree, materialTree);
meshTextureThree.position.z = -50;
meshTextureThree.position.y = 5;
scene.add(meshTextureThree);

const shapeImker = new THREE.PlaneGeometry(53,27);
const meshTextureFour = new THREE.Mesh(shapeImker, materialImker);
meshTextureFour.position.z = -15;
meshTextureFour.position.y = -2.5;
meshTextureFour.position.x = 1.5;
scene.add(meshTextureFour);

const meshTextureFive = new THREE.Mesh(shapeTwo, materialPaardenbloem);
meshTextureFive.position.z = 1.4;
meshTextureFive.position.y = -.4;
scene.add(meshTextureFive);

const meshTextureSix = new THREE.Mesh(shapeTwo, materialPaardenbloemjong);
meshTextureSix.position.z = 1.6;
meshTextureSix.position.y = -.4;
scene.add(meshTextureSix);

const meshTextureSeven = new THREE.Mesh(shapeTwo, materialMadeliefje);
meshTextureSeven.position.z = 1.8;
meshTextureSeven.position.y = -.4;
scene.add(meshTextureSeven);

materialCloud.map.repeat.set(1,1)
const shapeCloud = new THREE.PlaneGeometry(20,10);
const meshTextureEight = new THREE.Mesh(shapeCloud, materialCloud);
meshTextureEight.position.z = 0;
meshTextureEight.position.y = 12;
scene.add(meshTextureEight);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight);


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    console.log(sizes, window.innerWidth, window.innerHeight);
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
camera.position.z = 5
scene.add(camera);
gui.add(camera.position, `y`);
gui.add(camera.position, `x`);
gui.add(camera.position, `z`);

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

const sceneTwo = () => {
    //scene.remove(meshTextureThree);
    //scene.remove(meshTextureSeven);
    new TWEEN.Tween(camera.position)
    .to(
      {
        y: 25,
      }, 800)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onComplete(() => { 
            document.addEventListener(`mousemove`, handleMoveDocument);
            document.removeEventListener(`click`, handleClickDocument);
      })
    .start();
}

const handleClickDocument = e => {
    document.removeEventListener(`mousemove`, handleMoveDocument);
    conditionMoveCamera = false;
    new TWEEN.Tween(camera.position)
    .to(
      {
        y: 12,
      }, 800)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onComplete(() => { 
          sceneTwo();
      })
    .start();
}

document.addEventListener(`mousemove`, handleMoveDocument);
document.addEventListener(`click`, handleClickDocument);
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let conditionMoveCamera = true;

const clock = new THREE.Clock();

const tick = () =>
{
    targetX= mouseX * .05;
    targetY= mouseY * .05;

    TWEEN.update();

    const elapsedTime = clock.getElapsedTime()

    if (conditionMoveCamera) {
        camera.position.x = -.005 * -(targetX -  camera.position.x);
        camera.position.y = -.005 * -(targetY -  camera.position.y);
    }

    // Update Orbital Controls
    //controls.update()

    // Render
    renderer.render(scene, camera);


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()