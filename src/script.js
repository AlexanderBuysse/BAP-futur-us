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

// sprite
const geometry = new THREE.BufferGeometry();
const vertices = [];
let parameters;
let materials = [];

const sprite1 = textureLoader.load(`/detailpage/beesprite.png`);

for ( let i = 0; i < 1; i ++ ) {

    const x = 1;
    const y = 1;
    const z = 1;

    vertices.push( x, y, z );

}

geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

parameters = [
    [[ 1, 1, 1 ], sprite1, .2 ]
];

for ( let i = 0; i < parameters.length; i ++ ) {

    const color = parameters[ i ][ 0 ];
    const sprite = parameters[ i ][ 1 ];
    const size = parameters[ i ][ 2 ];

    materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, depthTest: false, transparent: true } );
    materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

    const particles = new THREE.Points( geometry, materials[ i ] );

    particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.rotation.z = Math.random() * 6;

    console.log(particles);
    scene.add( particles );
}

const baseSizeWidth = 10;
const baseSizeHeight = 5;

const swtichDistance = number => {
    let multiply;
    switch (number) {
        case 0:
            multiply = 99;
            break;
        case 1:
            multiply = 74;
            break;
        case 2:
            multiply = 34;
            break;
        case 3:
            multiply = 18;
            break;
        case 4:
            multiply = 6;
            break;
        default:
            break;
    }
    return multiply;
}

const swtichDistanceTree = number => {
    let multiply;
    switch (number) {
        case 0:
            multiply = 99;
            break;
        case 1:
            multiply = 74;
            break;
        case 2:
            multiply = 34;
            break;
        case 3:
            multiply = 20;
            break;
        case 4:
            multiply = 14;
            break;
        case 5:
            multiply = 8;
            break;
        default:
            break;
    }
    return multiply;
}

const backgroundTexture = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/detailpage/clouds.png`),
    transparent: true
});
const shapeBackground = new THREE.PlaneGeometry(200, 120);
const meshBackground = new THREE.Mesh(shapeBackground, backgroundTexture);
meshBackground.position.z = -60;
meshBackground.position.y = 5;
scene.add(meshBackground);

const beekeeperTexture = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/detailpage/beekeper.png`),
    transparent: true
});
const shapeBeekeeper = new THREE.PlaneGeometry(10, 5);
const meshBeekeeper = new THREE.Mesh(shapeBeekeeper, beekeeperTexture);
meshBeekeeper.position.z = 2;
meshBeekeeper.position.y = 0;
scene.add(meshBeekeeper);


const treeTextures = [];
for (let i = 0; i < 6; i++) {
    treeTextures[i]= new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/detailpage/tree_${i}.png`),
        transparent: true
    });
    let shapeTree;
    let bruh = 24;
    let bruh2 = 12;

    if (i === 0) {
        console.log(`dit werkt`);
        shapeTree = new THREE.PlaneGeometry(bruh * (parseFloat(`1.${swtichDistanceTree(i)*1}`)), bruh2 * (parseFloat(`1.${swtichDistanceTree(i)*1}`)));
    } else {
        shapeTree = new THREE.PlaneGeometry(bruh * (parseFloat(`1.${swtichDistanceTree(i)*i}`)), bruh2 * (parseFloat(`1.${swtichDistanceTree(i)*i}`)));
    }
    console.log();
    const meshTree = new THREE.Mesh(shapeTree, treeTextures[i]);
    meshTree.position.y = window.innerWidth/9000;
    meshTree.position.x = (window.innerWidth/9000);    
    meshTree.position.z = -10+ i;
    // parseFloat(`0.${i}`)
    scene.add(meshTree);
}

const flowerTextures = [];
for (let i = 0; i < 6; i++) {
    flowerTextures[i]= new THREE.MeshBasicMaterial({
        map: textureLoader.load(`/detailpage/flower_${i}.png`),
        transparent: true
    });
    let shapeFlower;
    if (i === 5) {
        shapeFlower = new THREE.PlaneGeometry(baseSizeWidth, baseSizeHeight);
    } else if (i === 0) {
        shapeFlower = new THREE.PlaneGeometry(baseSizeWidth * (parseFloat(`1.${swtichDistance(i)*1}`)), baseSizeHeight * (parseFloat(`1.${swtichDistance(i)*1}`)));
    } else {
        shapeFlower = new THREE.PlaneGeometry(baseSizeWidth * (parseFloat(`1.${swtichDistance(i)*i}`)), baseSizeHeight * (parseFloat(`1.${swtichDistance(i)*i}`)));
    }
    const meshFlower = new THREE.Mesh(shapeFlower, flowerTextures[i]);
    meshFlower.position.z = -3+ i;
    meshFlower.position.x =-(window.innerWidth/3000);
    scene.add(meshFlower);
}

const materialCloud = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/cloud.jpg'),
    transparent: true,
    side: THREE.DoubleSide
});

const material1 = new THREE.MeshBasicMaterial( {
    color: 0xb2dcff,
    side: THREE.DoubleSide
});

const shape = new THREE.PlaneGeometry(500, 500);
const meshTexture = new THREE.Mesh(shape, material1);
meshTexture.position.y = -.5;
meshTexture.position.z = -60;
scene.add(meshTexture);

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
//document.addEventListener(`click`, handleClickDocument);
let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

let conditionMoveCamera = true;

const clock = new THREE.Clock();

const tick = () => {
    targetX= mouseX * .05;
    targetY= mouseY * .05;
    const time = Date.now() * 0.00005;

    TWEEN.update();

    const elapsedTime = clock.getElapsedTime()

    if (conditionMoveCamera) {
        camera.position.x = -.005 * -(targetX -  camera.position.x);
        camera.position.y = -.005 * -(targetY -  camera.position.y);
        meshBackground.position.x = .03 * (targetX -  meshBackground.position.x);
        meshBackground.position.y = .03 * (targetY -  meshBackground.position.y);
    }

    // Update Orbital Controls
    //controls.update()
    for ( let i = 0; i < scene.children.length; i ++ ) {

        const object = scene.children[ i ];

        if ( object instanceof THREE.Points ) {

            object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

        }

    }

    for ( let i = 0; i < materials.length; i ++ ) {

        const color = parameters[ i ][ 0 ];

        const h = ( 360 * ( color[ 0 ] + time ) % 360 ) / 360;
        materials[ i ].color.setHSL( h, color[ 1 ], color[ 2 ] );

    }

    // Render
    renderer.render(scene, camera);


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()