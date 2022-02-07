{
    class AnimatedParticle extends Phaser.GameObjects.Particles.Particle
    {
        constructor (emitter)
        {
            super(emitter);
    
            this.t = 0;
            this.i = 0;
        }
    
        update (delta, step, processors)
        {
            var result = super.update(delta, step, processors);
    
            this.t += delta;
    
            if (this.t >= anim.msPerFrame)
            {
                this.i++;
    
                if (this.i > 17)
                {
                    this.i = 0;
                }
    
                this.frame = anim.frames[this.i].frame;
    
                this.t -= anim.msPerFrame;
            }
    
            return result;
        }
    }    

    const config = {
        type: Phaser.WEBGL,
        width: 700,
        height: 800,
        parent: 'phaser-example',
        backgroundColor: '#1c1917',
        dom: {
            createContainer: true
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
                gravity: { y: 400 }
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

        let game = new Phaser.Game(config);
        let emitter;
        let emitterLeaves;
        let lifeSpanProcent = 1800*.5;
        let emitterWater;
        let emitterWater2;
        let emitterWater3;
        let emitterWater4;
        let socket;
        let particles;
        let particlesWater;
        let lastTime = 0;
        let emitters = [];
        let emittersWater = [];        
        let onceEmitters = true;
        let life;
        let emittersStart = false;
        let valueSlider=1;
        let group;
        let count = 0;
        let scene;
        let anim;
        let gui;
        let forever = false;
        var angleConfig = {
            min: 0, max: 360
        };
        var angleConfig2 = {
            min: 0, max: 360
        };
        var gravityConfig = {
            min: -400, max: 200
        };
        
        function preload() {
            this.load.spritesheet('butterfly', 'assets/butterfly.png', {
                frameWidth: 32, frameHeight: 39
            });
            this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
            this.load.image('tree', 'assets/boom.png');
            this.load.image('bar', 'assets/twist/flectrum.png');
        }

        function create() {
            var rect1 = new Phaser.Geom.Rectangle(90, 280, 200, 400);
            var rect2 = new Phaser.Geom.Rectangle(420, 280, 200, 400);
        
            var rectangles = {
                contains: function (x, y)
                {
                    return Phaser.Geom.Rectangle.Contains(rect1, x, y) ||
                           Phaser.Geom.Rectangle.Contains(rect2, x, y)
                }
            };
        
            gui = new dat.GUI();
            gui.add(angleConfig, 'max', 0, 360, 5).name('angle max').onChange(function(value) { 
                emitterWater.setAngle(value); 
            });
            gui.add(gravityConfig, 'max', -400, 200, 5).name('gravity').onChange(function(value) { 
                emitterWater.setGravityY(value); 
                emitterWater2.setGravityY(value); 
            });
            gui.add(angleConfig2, 'max', 0, 360, 5).name('angle max').onChange(function(value) {
                emitterWater2.setAngle(value);
            });
            gui.add({save: saveEmitter.bind(this)}, 'save').name('save JSON');



            var curve = new Phaser.Curves.Spline([ 50, 300, 164, 246, 274, 342, 412, 257, 522, 341, 664, 264 ]);

            scene=this;
            const tree = this.add.image(350, 400, 'tree');
            tree.scale = 2;

            group = this.add.group({
                key: 'bar',
                frameQuantity: 0,
                setXY: { x: 400, y: 300 },
                setRotation: { value: 0, step: 0.1 },
                setScale: { x: 1, y: 2, stepY: 0.1 }
            });

            socket = io();
            let slider =  document.querySelector(`.slider`);
            slider.addEventListener('change', handleChangeSlider);
            document.querySelector(`.sliderButter`).addEventListener('change', handleChangeSliderButter);
            document.querySelector(`.sliderGreen`).addEventListener('change', handleChangeSliderGreen);
            document.querySelector(`.start`).addEventListener('click', handleClickButton);
            document.querySelector(`.start-forever`).addEventListener('click', handleClickButtonForever);


            let config = {
                key: 'walk',
                frames: this.anims.generateFrameNumbers('butterfly'),
                frameRate: 10,
                repeat: -1
            };
            anim = this.anims.create(config);
            particles = this.add.particles('butterfly');

            emitter = particles.createEmitter({
                x: 350,
                y: 250,
                frame: 10,
                quantity: 1,
                frequency: 200,
                angle: { min: 0, max: 360 },
                speed: 200,
                lifespan: { min: 1000, max: 2000 },
                particleClass: AnimatedParticle
            });


            particlesWater = this.add.particles('flares');
            emitterWater = particlesWater.createEmitter({
                frame: 'red',
                x: 230,
                y: 750,
                gravityY: gravityConfig,
                angle: angleConfig,
                lifespan: 2500,
                speed: { min: 100, max: 200 },
                scale: { start: 0.2, end: 0 },
                quantity: 2,
                blendMode: 'ADD',
                deathZone: { type: 'onEnter', source: rectangles }
            });

            emitterWater2 = particlesWater.createEmitter({
                frame: 'red',
                x: 480,
                y: 750,
                angle: angleConfig2,
                gravityY: gravityConfig,
                lifespan: 2500,
                speed: { min: 100, max: 200 },
                scale: { start: 0.2, end: 0 },
                quantity: 2,
                blendMode: 'ADD',
                deathZone: { type: 'onEnter', source: rectangles }
            });

            emitterWater3 = particlesWater.createEmitter({
                frame: 'red',
                x: 340,
                y: 750,
                angle: 270,
                gravityX: -20,
                lifespan: 1500,
                speed: { min: 100, max: 200 },
                scale: { start: 0.2, end: 0 },
                quantity: 2,
                blendMode: 'ADD'
            });

            emitterWater4 = particlesWater.createEmitter({
                frame: 'red',
                x: 360,
                y: 750,
                angle: 270,
                gravityX: 20,
                lifespan: 1500,
                speed: { min: 100, max: 200 },
                scale: { start: 0.2, end: 0 },
                quantity: 1,
                blendMode: 'ADD'
            });

            emitterLeaves = particlesWater.createEmitter({
                frame: 'red',
                x: 350, y: 250,
                lifespan: 100,
                angle: { start: 0, end: 360, steps: 64 },
                speed: 200,
                quantity: 64,
                scale: { start: 0.2, end: 0.1 },
                frequency: 32,
                blendMode: 'ADD'
            });
            emitterLeaves.name= `leaves`;

            emitters.push(emitter);
            emitters.push(emitterWater);
            emitters.push(emitterWater2);
            emitters.push(emitterWater3);
            emitters.push(emitterWater4);
            emitters.push(emitterLeaves);
            console.log(emitterLeaves)
            emittersWater.push(emitterWater)
            emittersWater.push(emitterWater2)
            emittersWater.push(emitterWater3)
            emittersWater.push(emitterWater4)
            emitters.forEach(emitter => {
                emitter.stop();
            })
            emitterWater2.setAngle(180);
            emitterWater.setAngle(360);
            emitterWater.setGravityY(-400);
            emitterWater2.setGravityY(-400);

            var graphics = this.add.graphics();

            // graphics.lineStyle(1, 0x00ff00, 1);
        
            // graphics.strokeRectShape(rect1);
            // graphics.strokeRectShape(rect2);
        }

        function handleChangeSlider(e) {
            console.log(e.target.value);
            valueSlider = e.target.value;
            emittersWater.forEach(emitter => {
                emitter.quantity.propertyValue = valueSlider;
            });
        }

        function handleChangeSliderButter(e) {
            console.log(e.target.value);
            valueSlider = e.target.value;
            emitter.quantity.propertyValue = e.target.value;
        }

        function handleChangeSliderGreen(e) {
            console.log(e.target.value);
            let valueSlider = e.target.value;
            if(valueSlider == 10) {
                lifeSpanProcent = 1800 * 0.99;
                emitterLeaves.quantity.propertyValue = 64  * 0.99;
            } else {
                lifeSpanProcent = 1800 * parseFloat(`0.${valueSlider}`);
                emitterLeaves.quantity.propertyValue = 64 * parseFloat(`0.${e.target.value}`);
            }
        }

        function createLifepoints(sliders) {
            return 99;
        }

        function emitterDies() {
            emitters.forEach(emitter => {
                if (emitter.lifespan.propertyValue <= 0) {
                    emitter.stop();
                } else { 
                    if(emitter.name !== 'leaves') {
                        emitter.lifespan.propertyValue = 2500 * parseFloat(`.${life}`);  
                    } else {
                        emitter.lifespan.propertyValue = lifeSpanProcent * parseFloat(`.${life}`);  
                    }
                }
            });
        }

        function handleClickButton() {
            emittersStart= true;
        }

        
        function handleClickButtonForever() {
            emittersStart= true;
            forever = true
        }

        function update(time, delta) {
            // start emitters 
            if (emittersStart) {
                if (lastTime === 0) {
                    lastTime = time;
                    life = createLifepoints(99);
                } else if((time - lastTime) >= 1000) {
                    lastTime = time;
                    if (!forever) {
                        life = life - 5;                      
                    }
                    count++;
                    if (Math.sign(life) == -1) {
                        life = 0;
                    }
                }

                if(onceEmitters) {
                    emitters.forEach(emitter=> {
                        emitter.start();
                    });
                    onceEmitters = false;
                }
            }
            // life time of emitter
            emitterDies();

            //mesure intensity
        }

        function saveEmitter () {
            this.load.saveJSON(emitterWater.toJSON(), emitterWater.name + '.json');
            this.load.saveJSON(emitterWater2.toJSON(), emitterWater2.name + '.json');
        }
}