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
        
        function preload() {
            this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
            this.load.image('tree', 'assets/boom.png');
        }

        function create() {
            socket = io();
            var curve = new Phaser.Curves.Spline([ 50, 300, 164, 246, 274, 342, 412, 257, 522, 341, 664, 264 ]);
    
            const tree = this.add.image(350, 400, 'tree');
            tree.scale = 2;

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
            //emittersStart= true;
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
            /*
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
        emitterDies();*/
        }
}
