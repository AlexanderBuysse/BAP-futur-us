{
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
        let emitters = [];
        let onceEmitters = true;
        let emittersStart= false;

        let lastTime = 0;
        let forever = false;
        let count = 0;
        let lifeSpanProcent = 1800*.5;
        let life;

        let graphics;
        const curves = [];
        
        function preload() {
            this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
            this.load.image('tree', 'assets/boom.png');
        }

        function create() {
            
            graphics = this.add.graphics();
            socket = io();

            const posX = 30;
            const min = -50;
            const max = 50;

            for (let i = 0; i < 20; i++) {
                //console.log(Phaser.Math.Between(min, max));
                curves.push(new Phaser.Curves.Spline([ 
                    60+posX*i + Phaser.Math.Between(min, max), 571, 
                    100+posX*i+ Phaser.Math.Between(min, max), 410 + Phaser.Math.Between(min, max),
                    100+posX*i + Phaser.Math.Between(min, max), 255 + Phaser.Math.Between(min, max), 
                    104+posX*i + Phaser.Math.Between(min, max), 126 + Phaser.Math.Between(min, max), 
                    101+posX*i, 31]));
            }

            //const topCurve = [new Phaser.Curves.Spline([ 303, 213+posX*1, 173, 143+posX*1, 53])];


            const particles = this.add.particles('flares');
            for (let i = 0; i < curves.length; i++) {
                emitters.push(particles.createEmitter({
                    frame: { frames: 'blue', cycle: true },
                    scale: .5 ,
                    lifespan: 2000,
                    blendMode: 'NORMAL',
                    emitZone: { type: 'edge', source: curves[i], quantity: 250 },
                    alpha: .5
                }));
            }

            emitters.forEach(emitter=> {
                emitter.stop();
            });

            // event listeners
            let slider =  document.querySelector(`.slider`);
            slider.addEventListener('change', handleChangeSlider);
            document.querySelector(`.start`).addEventListener('click', handleClickButton);
            document.querySelector(`.start-forever`).addEventListener('click', handleClickButtonForever);
        }

        function handleChangeSlider(e) {
            console.log(e.target.value);
            /*
            [arraymet emmitters].forEach(emitter => {
                [arraymet emmitters].quantity.propertyValue = valueSlider;
            });
            */
        }

        function handleClickButton() {
            emittersStart= true;
        }

        
        function handleClickButtonForever() {
            emittersStart= true;
            forever = true
        }

        function createLifepoints(sliders) {
            return 99;
        }
        

        function emitterDies() {
            emitters.forEach(emitter => {
                if (emitter.lifespan.propertyValue <= 0) {
                    emitter.stop();
                } else {
                    //console.log( parseFloat(`.${life}`));
                    if(life >= 10) {
                        emitter.alpha.propertyValue = .5* parseFloat(`.${life}`); //lifeSpanProcent * parseFloat(`.${life}`);
                    } else {
                        emitter.alpha.propertyValue = .5* parseFloat(`.0${life}`); //lifeSpanProcent * parseFloat(`.${life}`);
                    }
                }
            });
        }

        function update(time, delta) {

            if (emittersStart) {
                if (lastTime === 0) {
                    lastTime = time;
                    life = createLifepoints(99);
                } else if((time - lastTime) >= 300) {
                    lastTime = time;
                    if (!forever) {
                        console.log(life);
                        life = life - 1;                      
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

            graphics.clear();
            graphics.lineStyle(2, 0xffffff, 1);
        
            curves.forEach(emitter => {
                emitter.draw(graphics);
            })
        }
}
