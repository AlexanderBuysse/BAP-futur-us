import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import Phaser from "phaser";
import imgHomeButton from "../static/ui/homeButton.png"
import imgInfoTree from "../static/ui/info.png"
import imgcheck from "../static/ui/check.png"
import imgLeaves from "../static/ui/leaves.png"
import imgWater from "../static/ui/water.png"
import imgCut from "../static/ui/cut.png"

const gui = new dat.GUI();
document.querySelector(`.image-container`).innerHTML  = `<img src="${imgHomeButton}" alt="image" width="144" height="109" class="homeButton">`
document.querySelector(`.image-container`).innerHTML  += `<img src="${imgInfoTree}" alt="image" width="335" height="151" class="info">`
document.querySelector(`.image-container`).innerHTML  += `<img src="${imgcheck}" alt="image" width="144" height="109" class="check">`

//document.querySelector(`.img-tree`).innerHTML  = `<img src="${imgTree}" alt="image" width="75" height="50" class="check">`

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

// -------------------- GLOBALE VERIABELEN HOME -------------------
const basicTextures  = []; 
const basicTexturesLoaded  = []; 
let counters = [0, 0, 0, 0, 0, 0, 0];
let secondPassed = 0;
let once = true;
let meshBackgroundMap;
let meshBackCircle;
let meshBackCircleClouds;
let meshImker;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2( 1, 1 );
let interactionClouds = false;
let interactionLeaves = false;
let countLeaves;

let leavesComfirmed;
let stopClickLeaves = false;

let cloudsComfirmed;
let stopClickClouds = false;

let valuesSliderCloud = 5;

const showUiHome = () => {
    document.querySelector(`.containerUi`).classList.add('absolute');
    document.querySelector(`.containerUi`).classList.add('heightAll');
    document.querySelector(`.containerUi`).style.display ='grid';
}

const dontShowUiHome = () => {
    document.querySelector(`.containerUi`).classList.remove('absolute');
    document.querySelector(`.containerUi`).classList.remove('heightAll');
    document.querySelector(`.containerUi`).style.display ='none';
}


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

//Imker
basicTextures.push(new THREE.MeshBasicMaterial({
    transparent: true
}));
basicTexturesLoaded.push(loadImagesAnimation('Imker', 79))


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
    const animationMesh = (textures, x,y, indexTexture, posX, posY, bool) =>{ 
        if(!bool) {
            const shapeAnimation =  new THREE.PlaneGeometry(x, y);
            basicTextures[indexTexture].map = textures[0];
            const meshAnimation = new THREE.Mesh(shapeAnimation, basicTextures[indexTexture]);
            meshAnimation.position.z = -29.5;
            meshAnimation.position.y = posY;
            meshAnimation.position.x = posX;
            scene.add(meshAnimation);    
        } else {
            const shapeAnimation =  new THREE.PlaneGeometry(x, y);
            basicTextures[indexTexture].map = textures[0];
            meshImker = new THREE.Mesh(shapeAnimation, basicTextures[indexTexture]);
            meshImker.position.z = -29.5;
            meshImker.position.y = posY;
            meshImker.position.x = posX;
            scene.add(meshImker);  
        }
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
    animationMesh(basicTexturesLoaded[4], 7.14, 6, 4, -5.65, 1.6);

    //water
    animationMesh(basicTexturesLoaded[5], 3.54, 2, 5, 8, -2);

    //imker
    animationMesh(basicTexturesLoaded[6], 1.2, 1.99, 6, -2.2, 1.5, true);
}

const interactionOverview = (nameInteraction) => {
    if(nameInteraction === 'leaves') {
        document.querySelector(`.containerOverview`).classList.add('absolute');
        document.querySelector(`.containerOverview`).classList.add('heightAll');
        var modalOVer = document.querySelector(`.myModalOverView`);
        modalOVer.style.display = "grid";
        document.querySelector(`.imgLeaves`).style.opacity= 1;
    }

    if(nameInteraction === 'clouds') {
        document.querySelector(`.containerOverview`).classList.add('absolute');
        document.querySelector(`.containerOverview`).classList.add('heightAll');
        var modalOVer = document.querySelector(`.myModalOverView`);
        modalOVer.style.display = "grid";
        document.querySelector(`.imgWater`).style.opacity= 1;
    }
}

const handleClickCodeButton = () => {
    if(stopClickLeaves && stopClickClouds) {
        document.querySelector(`.containerOverview`).classList.add('absolute');
        document.querySelector(`.containerOverview`).classList.add('heightAll');
        var modalOVer = document.querySelector(`.myModalOverView`);
        modalOVer.style.display = "grid";
        dontShowUiHome();
        document.querySelector(`.code`).textContent = `${leavesComfirmed}${valuesSliderCloud}`;
    }
}

const loadPhaser = () => {
    const config = {
        type: Phaser.AUTO,
        scale: {
            parent: 'game-area',
            width: 1680,
            height: 945
        },
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 600 }
          }
        },
        dom: {
            createContainer: true
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

    var modal = document.querySelector(`.myModal`);
    var Overview = document.querySelector(`.modalOverview`);

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            var element = document.getElementById('game-area').getElementsByTagName('canvas');
            if(element.length >= 2) {
                element[0].parentNode.removeChild(element[0]);  
                element[0].parentNode.removeChild(element[0]);  
            } else {
                for (let i = 0; i < element.length; i++) {
                    element[0].parentNode.removeChild(element[0]);
                }    
            }
            interactionClouds = false;
            interactionLeaves = false;
        } if(event.target == Overview) {
            Overview.style.display = "none";
            document.querySelector(`.containerOverview`).classList.remove('absolute');
            document.querySelector(`.containerOverview`).classList.remove('heightAll');
            showUiHome();
        }
    }

    function preload () {
        this.load.image('broom', 'interaction1design/broom.png');
        this.load.image('platform', 'interaction1design/platform.png');
        this.load.image('badleaf', 'interactie1/badleaf.png');
        this.load.image('goodleaf', 'interaction1design/leave1.png');
        this.load.image('background', 'interaction1design/background.png')    
        
        this.load.image('backgroundCloud', 'testClouds/background.png');
        this.load.image('layer', 'testClouds/layers.png');
        this.load.image('layer1', 'testClouds/layers1.png');
        this.load.image('layer2', 'testClouds/layers2.png');
        this.load.html('slider', 'testClouds/slider.html');
    }

    let layerOne;
    let layerTwo;
    let layerThree;
    let setBackGround; 


    function create () {
        const homeButton = document.querySelector(`.homeButton`);
        const handleClickHomeButton = (e) => {
            modal.style.display = "none";
            var element = document.getElementById('game-area').getElementsByTagName('canvas');
            if(element.length >= 2) {
                element[0].parentNode.removeChild(element[0]);  
                element[0].parentNode.removeChild(element[0]);  
            } else {
                for (let i = 0; i < element.length; i++) {
                    element[0].parentNode.removeChild(element[0]);
                }    
            }
            interactionClouds = false;
            interactionLeaves = false;
            showUiHome();
        }
        homeButton.addEventListener(`click`, handleClickHomeButton);

        const checkButton = document.querySelector(`.check`);
        const handleClickCheckButton = (e) => {
            modal.style.display = "none";
            var element = document.getElementById('game-area').getElementsByTagName('canvas');
            if(element.length >= 2) {
                element[0].parentNode.removeChild(element[0]);  
                element[0].parentNode.removeChild(element[0]);  
            } else {
                for (let i = 0; i < element.length; i++) {
                    element[0].parentNode.removeChild(element[0]);
                }    
            }
            if(interactionLeaves) {
                leavesComfirmed = countLeaves;
                stopClickLeaves = true;
                interactionOverview('leaves');
            }
            if (interactionClouds) {
                stopClickClouds = true;
                interactionOverview('clouds');
            }
            interactionClouds = false;
            interactionLeaves = false;

        }
        checkButton.addEventListener(`click`, handleClickCheckButton);

        if(interactionLeaves) {
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
                repeat: 1,
                setRotation: { value: 0, step: Phaser.Math.FloatBetween(0, 1)},
                setXY: {x:  Phaser.Math.Between(0, 300), y: 600, stepX: Phaser.Math.Between(0, 700)}
            }); 
    
            goodleaves2 = this.physics.add.group({
                key: 'goodleaf',
                repeat: 2,
                setRotation: { value: 0, step: Phaser.Math.FloatBetween(0, 1)},
                setXY: {x:  Phaser.Math.Between(0, 300), y: 600, stepX: Phaser.Math.Between(0, 700)}
            }); 
    
            goodleaves1 = this.physics.add.group({
                key: 'goodleaf',
                repeat: 2,
                setRotation: { value: 0, step: Phaser.Math.FloatBetween(0, 1)},
                setXY: {x: Phaser.Math.Between(0, 300), y: 600, stepX: Phaser.Math.Between(0, 700)}
            });
    
            goodleaves = this.physics.add.group({
                key: 'goodleaf',
                repeat: 1,
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
            
            rect = this.add.rectangle(850, 800, 500, 230).setStrokeStyle(2, 0xffff00);
        }

        if(interactionClouds) {
            this.add.image(840, 473, 'backgroundCloud');
            layerOne = this.add.image(840, 880, 'layer');
            layerTwo = this.add.image(840, 900, 'layer1');
            layerThree = this.add.image(840, 920, 'layer2');

            let slider = this.add.dom(400,400).createFromCache('slider');
            slider.addListener('input');

            slider.on('input', function (event) {
                if( event.target.name ='slider') {
                    const sliderValue = event.target.value;
                    layerOne.y = 880 - sliderValue;
                    layerTwo.y = 900 - (.6*sliderValue);
                    layerThree.y = 920 -  (.5*sliderValue);
                    valuesSliderCloud = event.target.value;
                }
            });
        }
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
        if (interactionLeaves) {
            var x = rect.x - (rect.width / 2);
            var y = rect.y - (rect.height / 2);
        
            var within = this.physics.overlapRect(x, y, rect.width, rect.height);
            countLeaves= 0;
        
            within.forEach(function (body) {
                if(body.width <= 80) {
                    countLeaves ++;
                }
            });
    
            //console.log(countLeaves);
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
    }
}


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
    color: 0xF4EADE
});
let materialBlue = new THREE.MeshBasicMaterial( {
    color: 0xb2dcff
});
const shape = new THREE.PlaneGeometry(500, 500);
const meshTexture = new THREE.Mesh(shape, material1);
meshTexture.position.y = -.5;
meshTexture.position.z = -61;
scene.add(meshTexture);

const meshTextureBlue = new THREE.Mesh(shape, materialBlue);
meshTextureBlue.position.y = -.5;
meshTextureBlue.position.z = -60;

//wolk scene overgang
const materialCloud = new THREE.MeshBasicMaterial({
    map: textureLoader.load('transitionClouds/cloudpart1.png'),
    transparent: true
});


//white plaine folows camera
const whiteTexture = new THREE.MeshBasicMaterial( {
    color: 0xffffff
});

const meshWhitePlane = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), whiteTexture);
meshWhitePlane.position.y= 15;
meshWhitePlane.position.z= -26;
scene.add(meshWhitePlane);


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
    meshTextureEight.position.y = 9.5;

    const meshCloudTransition = new THREE.Mesh(shapeCloud, materialCloud);
    meshCloudTransition.position.z = -26;
    meshCloudTransition.position.y = 9.5;

    scene.add(meshTextureEight);
    scene.add(meshCloudTransition);
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
camera.position.x = 8.2
camera.position.y = 1.6
camera.position.z = 5.3
gui.add(camera.position, 'x');
gui.add(camera.position, 'y');
gui.add(camera.position, 'z');
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
    document.removeEventListener(`click`, handleClickDocument);    
    conditionMoveCamera = false;

    new TWEEN.Tween(camera.position)
    .to(
      {
        y: 15,
      }, 1000)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onComplete(() => {
          removeImkerMeshes();
          transitionPlane = true;

          new TWEEN.Tween(camera.position)
          .to(
            {
              z: -23,
            }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.In)
            .onComplete(() => {

                scene.remove(meshTextureBlue);
                transitionPlane = false;
                addHome();
                new TWEEN.Tween(camera.position)
                .to(
                {
                    y: 0,
                }, 1000)
                .easing(TWEEN.Easing.Sinusoidal.In)
                .start();
                new TWEEN.Tween(camera.position)
                .to(
                {
                    x: 0,
                }, 1000)
                .easing(TWEEN.Easing.Sinusoidal.In)
                .start();
                mouse.x = 0;
                mouse.y = 0;
                // start redendering home page
                userOnHome= true;
                userOnDetailImker = false;
                showUiHome();      
            })
          .start();
      })
    .start();
}

const sceneToImker = () => {
    dontShowUiHome();
    new TWEEN.Tween(camera.position)
    .to(
      {
        y: 15,
      }, 1000)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .onComplete(()=> {
        transitionPlane = true;
        addImkerMeshes();
        new TWEEN.Tween(camera.position)
        .to(
          {
            z: 5,
          }, 2000)
          .easing(TWEEN.Easing.Sinusoidal.In)
          .onComplete(() => {
            removeHome();
            userOnHome= false;
            userOnDetailImker = true;
            transitionPlane = false;
            scene.add(meshTextureBlue);
            new TWEEN.Tween(camera.position)
            .to(
              {
                y: 0,
              }, 1000)
              .easing(TWEEN.Easing.Sinusoidal.In)
              .onComplete(()=>{
                conditionMoveCamera = true;
                document.addEventListener(`click`, handleClickDocument);
                document.addEventListener(`mousemove`, handleMoveDocument);    
              })
            .start();
            //event voor imker
        })
        .start();
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
      .onComplete(()=> {
        document.querySelector(`.containerUi`).classList.add('absolute');
        document.querySelector(`.containerUi`).classList.add('heightAll');
        var modalUi = document.querySelector(`.myModalUi`);
        modalUi.style.display = "block";
        document.querySelector(`.uiInteractions`).innerHTML = `            <img class="imgLeaves" src="${imgLeaves}" alt="" width="74" height="74">
        <img class="imgWater" src="${imgWater}" alt="" width="74" height="74">
        <img class="imgCut" src="${imgCut}" alt="" width="74" height="74">`
        document.querySelector(`.imgCut`).style.opacity ='0.5';
        document.querySelector(`.imgWater`).style.opacity ='0.5';
        document.querySelector(`.imgLeaves`).style.opacity ='0.5';
      })
    .start();
}

const handleClickDocument = () => {
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

const handleClickLeft = () => {
    loadAll();
    removeImkerMeshes();
    document.querySelector(`.menu`).style.display = "none"
}

//document.addEventListener(`click`, handleClickDocument);
//document.addEventListener(`mousemove`, handleMoveDocument);
document.addEventListener(`click`, handleMoveDocumentTest);
document.querySelector(`.ontdekButton`).addEventListener(`click`, handleClickLeft);
document.querySelector(`.buttonCode`).addEventListener(`click`, handleClickCodeButton);

// gebruiker op welke pagina
let loadHomeOnce = true;
let loadImkerOnce = true;

let userOnHome = true;
let userOnDetailImker = false;

const clock = new THREE.Clock();

let onceStart = true;
let doubleClickPrevent = true;

let transitionPlane = false;

const tick = () => {
    if(transitionPlane) {
        meshWhitePlane.position.y = camera.position.y;
        meshWhitePlane.position.z = camera.position.z - 5;   
    }

    if(loadHomeOnce) {
        home();
        loadHomeOnce = false;
    }

    if(loadImkerOnce) {
        imkerPage();
        loadImkerOnce = false;
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
        if ( intersection.length > 0 && intersection.length !== 2 && stopClickLeaves === false) {
            if(doubleClickPrevent && !interactionLeaves) {
                var modal = document.querySelector(`.myModal`);
                modal.style.display = "grid";
                let frame = document.getElementById("myBtn");
                frame.style.width= sizes.width ;
                frame.style.height= sizes.height ;
                mouse.x = 100;
                mouse.y = 100;
                interactionLeaves = true;
                loadPhaser();
                doubleClickPrevent = false;
                dontShowUiHome();
                var callback = function() {
                    doubleClickPrevent= true;
                  }
                setTimeout(callback, 2000);
            }
        }

        const intersectionClouds = raycaster.intersectObject( meshBackCircleClouds );
        if ( intersectionClouds.length > 0 && intersectionClouds.length !== 2 ) {
            if (doubleClickPrevent && !interactionClouds && stopClickClouds === false) {
                var modal = document.querySelector(`.myModal`);
                modal.style.display = "grid";
                let frame = document.getElementById("myBtn");
                console.log(sizes);
                frame.style.width= sizes.width;
                frame.style.height= sizes.height;
                mouse.x = 100;
                mouse.y = 100;
                interactionClouds = true; 
                loadPhaser();
                doubleClickPrevent = false;
                dontShowUiHome();
                var callback = function() {
                    doubleClickPrevent= true;
                  }
                setTimeout(callback, 2000); 
            }
        }

        const intersectionImker = raycaster.intersectObject( meshImker);
        if ( intersectionImker.length > 0 && intersectionImker.length !== 2 ) {
            console.log('dit gebeurt om 1 of andere reden?');
            if (doubleClickPrevent) {
                mouse.x = 100;
                mouse.y = 100;
                doubleClickPrevent = false;
                handleClickDocument();
                var callback = function() {
                    doubleClickPrevent= true;
                    }
                setTimeout(callback, 1000); 
            }
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