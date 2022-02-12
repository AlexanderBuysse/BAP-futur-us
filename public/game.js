{
    const config = {
        type: Phaser.WEBGL,
        width: 800,
        height: 600,
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

            const colors = ['blue', 'red'];

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
                    frame: { frames:[colors[Phaser.Math.Between(0, 1)]], cycle: true },
                    scale: .1 ,
                    lifespan: 2000,
                    blendMode: 'NORMAL',
                    emitZone: { type: 'edge', source: curves[i], quantity: 350 },
                    alpha: 1
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
            const sliderValue = (e.target.value*400)
            emitters.forEach(emitter => {
                emitter.lifespan.propertyValue = sliderValue;
            });
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
                        life = life - 1;                      
                    }
                    count++;
                    if (Math.sign(life) == -1) {
                        life = 0;
                    }
                }

                if(onceEmitters) {
                    emitters.forEach(emitter=> {
                        var callback = function() {
                            emitter.start();
                          }
                        setTimeout(callback, Phaser.Math.Between(0, 3000)); 
                    });
                    onceEmitters = false;
                }
            }
            // life time of emitter
            emitterDies();

            graphics.clear();
            graphics.lineStyle(6, 0xffffff, .25);
    
            curves.forEach(emitter => {
                emitter.draw(graphics);
            })
        }
}
