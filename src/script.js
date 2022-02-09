import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import Phaser from "phaser";

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// -------------------- ALLE BASIS DINGEN -------------------------
// Loading
const textureLoader = new THREE.TextureLoader()
textureLoader.crossOrigin = '';
// Debug

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// -------------------- GLOBALE VERIABELEN HOME -------------------------
const basicTextures  = []; 
const basicTexturesLoaded  = []; 
let counters = [0, 0, 0, 0, 0, 0];
let secondPassed = 0;
let once = true;
let meshBackgroundMap;
let meshBackCircle;
let meshBackCircleClouds;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2( 1, 1 );

// -------------------- HOME PAGE -------------------------
//begin inladen textures voor home
// Objects
const backgroundMapTexture = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/background.png`),
    transparent: false
});

const circleTexture = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/indicators/circle.png`),
    transparent: true
});

const loadImagesAnimation = (animationName, amountFrames) => {
    const arrayOfTextures =[];
    for (let i = 0; i < amountFrames; i++) {
        if(i<10) {
            arrayOfTextures[i] = textureLoader.load(`animatie${animationName}/${animationName}0${i}.png`)
        } else {
            arrayOfTextures[i] = textureLoader.load(`animatie${animationName}/${animationName}${i}.png`)
        }
    }
    return arrayOfTextures;
}

//tuinier inladen
basicTextures.push(new THREE.MeshBasicMaterial({
    transparent: true
}));
basicTexturesLoaded.push(loadImagesAnimation('tuinier', 4))

//vos
basicTextures.push(new THREE.MeshBasicMaterial({
    transparent: true
}));
basicTexturesLoaded.push(loadImagesAnimation('vos', 65))

//oranjerie
basicTextures.push(new THREE.MeshBasicMaterial({
    transparent: true
}));
basicTexturesLoaded.push(loadImagesAnimation('oranjerie', 79))

//hert
basicTextures.push(new THREE.MeshBasicMaterial({
    transparent: true
}));
basicTexturesLoaded.push(loadImagesAnimation('hert', 60))

//wolken
basicTextures.push(new THREE.MeshBasicMaterial({
    transparent: true
}));
basicTexturesLoaded.push(loadImagesAnimation('clouds', 74))

//water
basicTextures.push(new THREE.MeshBasicMaterial({
    transparent: true
}));
basicTexturesLoaded.push(loadImagesAnimation('water', 74))



const home = () => {
    //laadt achtergrond in
    const shapeBackgroundMap = new THREE.PlaneGeometry(20, 10);
    meshBackgroundMap = new THREE.Mesh(shapeBackgroundMap, backgroundMapTexture);
    meshBackgroundMap.position.z = -30;
    meshBackgroundMap.position.y =0;
    scene.add(meshBackgroundMap);

    const shapeCircle = new THREE.PlaneGeometry(.3, .3);
    meshBackCircle = new THREE.Mesh(shapeCircle, circleTexture);
    meshBackCircle.position.z = -25;
    meshBackCircle.position.y =-.4;
    meshBackCircle.position.x =-.6;
    scene.add(meshBackCircle);

    meshBackCircleClouds = new THREE.Mesh(shapeCircle, circleTexture);
    meshBackCircleClouds.position.z = -25;
    meshBackCircleClouds.position.y =.8;
    meshBackCircleClouds.position.x =-1.8;
    scene.add(meshBackCircleClouds);

    //laadt de eerst frame van animatie in
    const animationMesh = (textures, x,y, indexTexture, posX, posY) =>{ 
        const shapeAnimation =  new THREE.PlaneGeometry(x, y);
        basicTextures[indexTexture].map = textures[0];
        const meshAnimation = new THREE.Mesh(shapeAnimation, basicTextures[indexTexture]);
        meshAnimation.position.z = -29.5;
        meshAnimation.position.y = posY;
        meshAnimation.position.x = posX;
        scene.add(meshAnimation);
    }

    //tuinier
    animationMesh(basicTexturesLoaded[0], 1.2, 1.5, 0, 4, .3);

    //vos
    animationMesh(basicTexturesLoaded[1], 1.33, 1, 1, -4, .8);

    //oranjerie
    animationMesh(basicTexturesLoaded[2], 2.1, 1.4, 2, 7.9, 1.3);

    //hert
    animationMesh(basicTexturesLoaded[3], 2.4, 1.5, 3, -2, -2.5);

    //wolken
    animationMesh(basicTexturesLoaded[4], 7.14, 6, 4, -5.75, 1.65);

    //water
    animationMesh(basicTexturesLoaded[5], 3.54, 2, 5, 8, -2);
}

const loadPhaser = () => {
    const config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            parent: 'game-area',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1680,
            height: 945
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 600 }
          }
        },
        scene: {
          preload: preload,
          create: create,
          update: update
        }
      };
      
    new Phaser.Game(config);
      
    let rect;
    let goodleaves;    
    let goodleaves1;   
    let goodleaves2;   
    let goodleaves3;   
    let scene;
    let broom;

    function preload () {
        this.load.image('broom', 'interaction1design/broom.png');
        this.load.image('platform', 'interaction1design/platform.png');
        this.load.image('badleaf', 'interactie1/badleaf.png');
        this.load.image('goodleaf', 'interaction1design/leave1.png');
        this.load.image('background', 'interaction1design/background.png')
    }

    function create () {
        scene= this;

        this.add.image(840, 473, 'background');
        broom = this.physics.add.sprite(840, 300, 'broom');
        broom.body.setAllowGravity(false);

        const numberRandom = Phaser.Math.Between(0, 700);

        let platforms = this.physics.add.staticGroup();
        platforms.create(840, 900, 'platform').refreshBody();
        platforms.children.entries[0].alpha=0;
        platforms.create(840, 860, 'platform').refreshBody();
        platforms.children.entries[1].alpha=0;
        platforms.create(840, 820, 'platform').refreshBody();
        platforms.children.entries[2].alpha=0;
        platforms.create(840, 780, 'platform').refreshBody();
        platforms.children.entries[3].alpha=0;

        
        goodleaves3 = this.physics.add.group({
            key: 'goodleaf',
            repeat: 3,
            setRotation: { value: 0, step: Phaser.Math.FloatBetween(0, 1)},
            setXY: {x:  Phaser.Math.Between(0, 300), y: 600, stepX: Phaser.Math.Between(0, 700)}
        }); 

        goodleaves2 = this.physics.add.group({
            key: 'goodleaf',
            repeat: 3,
            setRotation: { value: 0, step: Phaser.Math.FloatBetween(0, 1)},
            setXY: {x:  Phaser.Math.Between(0, 300), y: 600, stepX: Phaser.Math.Between(0, 700)}
        }); 

        goodleaves1 = this.physics.add.group({
            key: 'goodleaf',
            repeat: 3,
            setRotation: { value: 0, step: Phaser.Math.FloatBetween(0, 1)},
            setXY: {x: Phaser.Math.Between(0, 300), y: 600, stepX: Phaser.Math.Between(0, 700)}
        });

        goodleaves = this.physics.add.group({
            key: 'goodleaf',
            repeat: 3,
            setRotation: { value: 0, step: Phaser.Math.FloatBetween(0, 1)},
            setXY: {x:  Phaser.Math.Between(50, 200), y: 600, stepX: numberRandom}
        });

        const handleColiBroom = (eBroom, eLeave) => {
            if(Math.sign((eLeave.x-eBroom.x)) === -1) {
                eLeave.x = eLeave.x -10; 
            } else {
                eLeave.x = eLeave.x +10; 
            }
        }

        this.input.setDraggable(broom.setInteractive());

        goodleaves.children.entries.forEach(leaf => {
            this.input.setDraggable(leaf.setInteractive());
            leaf.setCollideWorldBounds(true);
        })

        goodleaves1.children.entries.forEach(leaf => {
            this.input.setDraggable(leaf.setInteractive());
            leaf.setCollideWorldBounds(true);
        })

        goodleaves2.children.entries.forEach(leaf => {
            this.input.setDraggable(leaf.setInteractive());
            leaf.setCollideWorldBounds(true);
        })

        goodleaves3.children.entries.forEach(leaf => {
            this.input.setDraggable(leaf.setInteractive());
            leaf.setCollideWorldBounds(true);
        })

        this.input.on('dragstart', function (pointer, obj)
        {
            obj.body.moves = false;
        });
    
        this.input.on('drag', function (pointer, obj, dragX, dragY)
        {
            obj.setPosition(dragX, dragY);
        });
    
        this.input.on('dragend', function (pointer, obj)
        {
            obj.body.moves = true;
        });

        //this.physics.add.collider(badleaves, platforms);
        this.physics.add.collider(goodleaves, platforms.children.entries[0]);
        this.physics.add.collider(goodleaves1, platforms.children.entries[1]);
        this.physics.add.collider(goodleaves2, platforms.children.entries[2]);
        this.physics.add.collider(goodleaves3, platforms.children.entries[3]);
        this.physics.add.collider(broom, goodleaves, handleColiBroom);
        this.physics.add.collider(broom, goodleaves1, handleColiBroom);
        this.physics.add.collider(broom, goodleaves2, handleColiBroom);
        this.physics.add.collider(broom, goodleaves3, handleColiBroom);

        this.physics.add.collider(goodleaves, goodleaves, customSeparate);
        this.physics.add.collider(goodleaves1, goodleaves1, customSeparate);
        this.physics.add.collider(goodleaves2, goodleaves2, customSeparate);
        this.physics.add.collider(goodleaves3, goodleaves3, customSeparate);
        
        rect = this.add.rectangle(780, 600, 730, 600).setStrokeStyle(2, 0xffff00);
    }

    function customSeparate(s1, s2) {
        var b1 = s1.body;
        var b2 = s2.body;
    
        //for dragged object, we have no velocity, so we take pointer direction
        let pointFacingX = "left";
        let pointFacingY = "top";
        if (scene.input.activePointer.position.x > scene.input.activePointer.prevPosition.x) pointFacingX = "right";
        if (scene.input.activePointer.position.y > scene.input.activePointer.prevPosition.y) pointFacingY = "bottom";
    
        //if we have velocity we use that - could add priority to fastest object
        if (b1.velocity.x > 0) pointFacingX = "right";
        if (b2.velocity.x > 0) pointFacingX = "right";
        if (b1.velocity.y > 0) pointFacingY = "bottom";
        if (b2.velocity.y > 0) pointFacingY = "bottom";
    
        let overlapX = 0;
        let overlapY = 0;
        if(b1.x > b2.x) {
            overlapX = b2.right - b1.left;
        }
        else {
            overlapX = b1.right - b2.left;
        }
    
        if(b1.y > b2.y) {
            overlapY = b2.bottom - b1.top;
        }
        else {
            overlapY = b1.bottom - b2.top;
        }
    
        //we move according to smallest overlap **no overlap is coded at 10000
        if (overlapX <= 0) overlapX = 10000;
        if (overlapY <= 0) overlapY = 10000;
        if(overlapX < overlapY){
            if (pointFacingX === "left"){
                if (b1.x > b2.x) {
                    b2.x -= overlapX;
                    b2.stop();
                }
                else {
                    b1.x -= overlapX;
                    b1.stop();
                }
            }
            else{
                if (b1.x < b2.x) {
                    b2.x += overlapX;
                    b2.stop();
                }
                else {
                    b1.x += overlapX;
                    b1.stop();
                }
            }
        }
        else{
            if (pointFacingY === "top"){
                if (b1.y > b2.y) {
                    b2.y -= overlapY;
                    b2.stop();
                }
                else {
                    b1.y -= overlapY;
                    b1.stop();
                }
            }
            else{
                if (b1.y < b2.y) {
                    b2.y += overlapY;
                    b2.stop();
                }
                else {
                    b1.y += overlapY;
                    b1.stop();
                }
            }
        }
    }
      

    function update () {
        var x = rect.x - (rect.width / 2);
        var y = rect.y - (rect.height / 2);
    
        var within = this.physics.overlapRect(x, y, rect.width, rect.height);
        let countLeaves= 0;
    
        within.forEach(function (body) {
            //console.log(body.width);
            if(body.width !== 95) {
                countLeaves ++;
            }
        });

        document.querySelector(`.countLeaves`).textContent= countLeaves;

    

        goodleaves.children.entries.forEach(leaf => {
            if (leaf.y > 860) {
                leaf.y = 860;
            }
        })

        goodleaves1.children.entries.forEach(leaf => {
            if (leaf.y > 820) {
                leaf.y = 820;
            }
        })

        goodleaves2.children.entries.forEach(leaf => {
            if (leaf.y > 780) {
                leaf.y = 780;
            }
        })

        goodleaves3.children.entries.forEach(leaf => {
            if (leaf.y > 740) {
                leaf.y = 740;
            }
        })

        if (broom.y >780) {
            broom.y = 780;
        }
    }
    var modal = document.querySelector(`.myModal`);
    var btn = document.getElementById("myBtn");
    var span = document.getElementsByClassName("close")[0]; 
    //var cont = document.querySelector(`.container`).getElementsByTagName("canvas")[0].classList.add('nomargin'); 

    btn.onclick = function() {
        modal.style.display = "grid";
        let frame = document.getElementById("myBtn");
        frame.style.width= sizes.width - 400;
        frame.style.height= sizes.height - 400;        
    }
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}
loadPhaser();


// -------------------- GLOBALE VERIABELEN IMKER -------------------------
const geometry = new THREE.BufferGeometry();
const vertices = [];
let parameters;
let materials = [];
const baseSizeWidth = 10;
const baseSizeHeight = 5;
let beePatricles;
const treeTextures = [];
const treeMeshes = [];
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
let conditionMoveCamera = true;

// -------------------- GLOBALE FUNCTIES IMKER -------------------------
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

// -------------------- BIJ PARTICLE IMKER -------------------------
const sprite1 = textureLoader.load(`/detailpage/beesprite.png`);
for ( let i = 0; i < 100; i ++ ) {
    const x = Math.random() * 20 - 10;
    const y = Math.random() * 20 - 10;
    const z = Math.random() * 20 - 10;;

    vertices.push( x, y, z );
}
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
parameters = [
    [[ 1, 1, 1 ], sprite1, .2 ]
];

// -------------------- BIJ TEXTURES INLADEN IMKER -------------------------
const backgroundTexture = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/detailpage/clouds.png`),
    transparent: true
});
const shapeBackground = new THREE.PlaneGeometry(200, 120);
const meshBackground = new THREE.Mesh(shapeBackground, backgroundTexture);
meshBackground.position.z = -60;
meshBackground.position.y = 6;

const beekeeperTexture = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`/detailpage/beekeper.png`),
    transparent: true
});

//background blue BLIJVEN ALGEMEEN
const material1 = new THREE.MeshBasicMaterial( {
    color: 0xb2dcff,
    side: THREE.DoubleSide
});
const shape = new THREE.PlaneGeometry(500, 500);
const meshTexture = new THREE.Mesh(shape, material1);
meshTexture.position.y = -.5;
meshTexture.position.z = -60;
scene.add(meshTexture);

//wolk scene overgang
const materialCloud = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/cloud.jpg'),
    transparent: true,
    side: THREE.DoubleSide
});


const imkerPage = () => {
    for (let i = 0; i < 6; i++) {
        treeTextures[i]= new THREE.MeshBasicMaterial({
            map: textureLoader.load(`/detailpage/tree_${i}.png`),
            transparent: true
        });
        let shapeTree;
        let bruh = 24;
        let bruh2 = 12;
    
        if (i === 0) {
            shapeTree = new THREE.PlaneGeometry(bruh * (parseFloat(`1.${swtichDistanceTree(i)*1}`)), bruh2 * (parseFloat(`1.${swtichDistanceTree(i)*1}`)));
        } else {
            shapeTree = new THREE.PlaneGeometry(bruh * (parseFloat(`1.${swtichDistanceTree(i)*i}`)), bruh2 * (parseFloat(`1.${swtichDistanceTree(i)*i}`)));
        }
        const meshTree = new THREE.Mesh(shapeTree, treeTextures[i]);
        meshTree.position.y = window.innerWidth/9000;
        meshTree.position.x = (window.innerWidth/9000);    
        meshTree.position.z = -10+ i;
        scene.add(meshTree);
        treeMeshes.push(meshTree);
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
    
    for ( let i = 0; i < parameters.length; i ++ ) {
        const color = parameters[ i ][ 0 ];
        const sprite = parameters[ i ][ 1 ];
        const size = parameters[ i ][ 2 ];
    
        materials[ i ] = new THREE.PointsMaterial( { size: size, map: sprite, depthTest: false, transparent: true } );
        materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );
    
        const particles = new THREE.Points( geometry, materials[ i ] );
    
        //particles.rotation.x = Math.random() * 6;
        //particles.rotation.y = Math.random() * 6;
        //particles.rotation.z = Math.random() * 6;
    
        beePatricles = particles;
        scene.add( particles );
    }
    
    materialCloud.map.repeat.set(1,1)
    const shapeCloud = new THREE.PlaneGeometry(20,10);
    const meshTextureEight = new THREE.Mesh(shapeCloud, materialCloud);
    meshTextureEight.position.z = 0;
    meshTextureEight.position.y = 9;
    scene.add(meshTextureEight);
    scene.add(meshBackground);
    
    const shapeBeekeeper = new THREE.PlaneGeometry(10, 5);
    const meshBeekeeper = new THREE.Mesh(shapeBeekeeper, beekeeperTexture);
    meshBeekeeper.position.z = 2;
    meshBeekeeper.position.y = 0;
    scene.add(meshBeekeeper);
    
}


// -------------------- BASIS STUFF VOOR THREE JS -------------------------
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
camera.position.x = 15
camera.position.y = 0
camera.position.z = 5
scene.add(camera);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// -------------------- OVERGANGEN PAGINAS -------------------------
const removeImkerMeshes = () => {
    for (let i = 0; i < 6; i++) {
        scene.remove(treeMeshes[i]);
    } 
    scene.remove(meshBackground);
    scene.remove(beePatricles);
}

const addImkerMeshes = () =>{
    for (let i = 0; i < 6; i++) {
        scene.add(treeMeshes[i]);
    } 
    scene.add(meshBackground);
    scene.add(beePatricles);
}

const removeHome = () => {
    scene.remove(meshBackgroundMap);
}

const addHome = () =>{
    scene.add(meshBackgroundMap);
}

const sceneToHome = () => {
    // event verwijderen voor bewegen
    document.removeEventListener(`mousemove`, handleMoveDocument);
    document.addEventListener(`click`, handleClickDocument);

    conditionMoveCamera = false;

    new TWEEN.Tween(camera.position)
    .to(
      {
        y: 9,
      }, 800)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onComplete(() => {
          removeImkerMeshes();

          new TWEEN.Tween(camera.position)
          .to(
            {
              y: 40,
            }, 500)
            .easing(TWEEN.Easing.Sinusoidal.In)
          .start();
          new TWEEN.Tween(camera.position)
          .to(
            {
              z: -23,
            }, 500)
            .easing(TWEEN.Easing.Sinusoidal.In)
            .onComplete(() => {
                addHome();
                camera.position.x = 0
                camera.position.y = 0
            // start redendering home page
              userOnHome= true;
              userOnDetailImker = false;
          })
          .start();
      })
    .start();
}

const sceneToImker = () => {
    addImkerMeshes();
    new TWEEN.Tween(camera.position)
    .to(
      {
        y: 0,
      }, 300)
      .easing(TWEEN.Easing.Sinusoidal.In)
    .start();

    new TWEEN.Tween(camera.position)
    .to(
      {
        z: 5,
      }, 500)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onComplete(() => {
        removeHome();
        userOnHome= false;
        userOnDetailImker = true;

        //event voor imker
        conditionMoveCamera = true;
        document.addEventListener(`mousemove`, handleMoveDocument);
    })
    .start();
}

const loadAll = () => {
    conditionMoveCamera = false;
    new TWEEN.Tween(camera.position)
    .to(
      {
        z: -23,
      }, 300)
      .easing(TWEEN.Easing.Sinusoidal.In)
    .start();

    new TWEEN.Tween(camera.position)
    .to(
      {
        y: 0,
      }, 300)
      .easing(TWEEN.Easing.Sinusoidal.In)
    .start();

    new TWEEN.Tween(camera.position)
    .to(
      {
        x: 0,
      }, 300)
      .easing(TWEEN.Easing.Sinusoidal.In)
    .start();
}

const handleClickDocument = e => {
    if (userOnDetailImker) {
        sceneToHome();
    }
    if(userOnHome) {
        sceneToImker();
    }
}

const handleMoveDocument = e => {
    mouseX = (e.clientX - windowHalfX);
    mouseY = (e.clientY - windowHalfY);
}


function handleMoveDocumentTest( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

//document.addEventListener(`click`, handleClickDocument);
//document.addEventListener(`click`, handleMoveDocumentStuff);
//document.addEventListener(`mousemove`, handleMoveDocument);
document.addEventListener(`click`, handleMoveDocumentTest);


// gebruiker op welke pagina
let loadHomeOnce = true;
let loadImkerOnce = true;

let userOnHome = true;
let userOnDetailImker = false;

const clock = new THREE.Clock();

let onceStart = true;

const tick = () => {

    if(loadHomeOnce) {
        home();
        loadHomeOnce = false;
    }

    if(loadImkerOnce) {
        imkerPage();
        loadImkerOnce = false;
        var callback = function() {
            loadAll();
            removeImkerMeshes();
          }
        setTimeout(callback, 300);
    }    

    targetX= mouseX * .05;
    targetY= mouseY * .05;

    const time = Date.now() * 0.005;
    TWEEN.update();

    if(userOnDetailImker) {
        if (conditionMoveCamera) {
            camera.position.x = -.005 * -(targetX -  camera.position.x);
            camera.position.y = -.005 * -(targetY -  camera.position.y);
            meshBackground.position.x = .03 * (targetX -  meshBackground.position.x);
            meshBackground.position.y = .03 * (targetY -  meshBackground.position.y);
        }
    }
    
    if (userOnHome) {
        if (once) {
            secondPassed = time;
            once = false;
        }
        if((time-secondPassed) >= .3) {
            secondPassed = time;
            const newCounters = counters.map(counter =>{
                counter++
                return counter++
            });
    
            counters = newCounters;
        }

        //TEXTURE CHANGER
        for (let i = 0; i < basicTextures.length; i++) {
            basicTextures[i].map = basicTexturesLoaded[i][counters[i]];
            if(counters[i] > basicTexturesLoaded[i].length-1) {
                counters[i] = 0;
            }
        }

        raycaster.setFromCamera( mouse, camera );
		const intersection = raycaster.intersectObject( meshBackCircle );
        if ( intersection.length > 0 && intersection.length !== 2 ) {
            var modal = document.querySelector(`.myModal`);
            modal.style.display = "grid";
            let frame = document.getElementById("myBtn");
            frame.style.width= sizes.width - 400;
            frame.style.height= sizes.height - 800;
            mouse.x = 10;
            mouse.y = 10;
        }

        const intersectionClouds = raycaster.intersectObject( meshBackCircleClouds );
        if ( intersectionClouds.length > 0 && intersectionClouds.length !== 2 ) {
            var modal = document.querySelector(`.myModal`);
            modal.style.display = "grid";
            let frame = document.getElementById("myBtn");
            frame.style.width= sizes.width - 400;
            frame.style.height= sizes.height - 800;
            mouse.x = 10;
            mouse.y = 10;
        }

    }


    // dingen dat ik niet weet of ik ze mag verwijderen
    const elapsedTime = clock.getElapsedTime();

    // Render
    renderer.render(scene, camera);


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()