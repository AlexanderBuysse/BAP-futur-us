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
        
        function preload() {
            this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
            this.load.image('tree', 'assets/boom.png');
        }

        function create() {
            socket = io();
            const tree = this.add.image(350, 400, 'tree');
            tree.scale = 2;

            const posX = 200;
            const moreX = 1;
            const more = 2;

            const curves = [new Phaser.Curves.Spline([ 152, 552, 208, 440, 150, 303, 213, 173, 143, 53]),
            new Phaser.Curves.Spline([ 152+posX*moreX, 552, 208+posX*moreX, 440, 150+posX*moreX, 303, 213+posX*moreX, 173, 143+posX*moreX, 53]),
            new Phaser.Curves.Spline([ 152+posX*more, 552, 208+posX*more, 440, 150+posX*more, 303, 213+posX*more, 173, 143+posX*more, 53])]

            const particles = this.add.particles('flares');
            for (let i = 0; i < curves.length; i++) {
                emitters.push(particles.createEmitter({
                    frame: { frames: 'blue', cycle: true },
                    scale: { start: 0.5, end: 0 },
                    blendMode: 'ADD',
                    emitZone: { type: 'edge', source: curves[i], quantity: 100, yoyo: false }
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
            //emittersStart= true;
            //forever = true
        }

        /*        
        function createLifepoints(sliders) {
            return 99;
        }
        */

        /*  function emitterDies() {
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
        }*/

        function update(time, delta) {
            if (emittersStart) {
                /*if (lastTime === 0) {
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
                }*/

                if(onceEmitters) {
                    emitters.forEach(emitter=> {
                        emitter.start();
                    });
                    onceEmitters = false;
                }
            }
        // life time of emitter
        //emitterDies();
        }
}
