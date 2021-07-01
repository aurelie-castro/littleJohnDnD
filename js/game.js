let config = {
    type: Phaser.CANVAS,
    width: 360,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#f7e07f',
    audio: {
        disableWebAudio: false
    },
    autoCenter: true
};

//------------global vars-----------
let game = new Phaser.Game(config);

//variable de fin de puzzle
let successfulDropoff;

//var de la flèche
var nextArrow;

//vars de son
var holdSound;
var wrongSound;
var correctSound;
var finishSound;

//var du background
var gameBg;

//var de l'étoile de fin
var star;
var starScale;

//
function init() {
}

function preload() {
    //---personnage en transparence---
    this.load.image('background', './assets/bucheron-01.png');
    
    //----membres----
    this.load.image('head', './assets/bucHead-01.png');
    this.load.image('body', './assets/bucBody-01.png');
    this.load.image('legL', './assets/bucLegL-01.png');
    this.load.image('legR', './assets/bucLegR-01.png');
    this.load.image('armL', './assets/bucArmL-01.png');
    this.load.image('armR', './assets/bucArmR-01.png');
    
     //---arrow next---
    this.load.image('nextArrow', './assets/y-refresh.png');
    
    //---audio files---
    this.load.audio('hold', './assets/hold.wav');
    this.load.audio('wrong', './assets/wrong.wav');
    this.load.audio('correct', './assets/correct.wav');
    this.load.audio('finish', './assets/congratulations.wav');
    
    //---star at the end---
    this.load.image('star', './assets/y-badge.png');
    
    //---background pattern---
    this.load.image('gameBg', './assets/leaf--pattern-01.png');

}

function create() {
    gameBg = this.add.image(180, 320, 'gameBg');
    gameBg.setVisible(false);
    gameBg.alpha = 0.8;
    
    var image = this.add.image(200, 250, 'background');
    image.alpha = 0.3;
    
    //---star---
    starScale = 0.1;
    star = this.add.image(90,530, 'star');
    star.setScale(starScale);
    star.setVisible(false);
    star.setDepth(0);
    
    //---audio---
    holdSound = this.sound.add('hold');
    wrongSound = this.sound.add('wrong');
    correctSound = this.sound.add('correct');
    finishSound = this.sound.add('finish');
    
    //drop off counter
    successfulDropoff = 0;
    
    //---next arrow----
    nextArrow = this.add.image(300, 550, 'nextArrow');
    nextArrow.setScale(0.15);
    nextArrow.setVisible(false);
    
    //----les membres-----
    var head = this.add.image(310, 70, 'head', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(head);
    head.setName('head');
    
    var body = this.add.image(300, 512, 'body', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(body);
    body.setName('body');
    
    var armL = this.add.image(70, 550, 'armL', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(armL);
    armL.setName('armL');
    
    var armR = this.add.image(200, 550, 'armR', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(armR);
    armR.setName('armR');
    
    var legR = this.add.image(50, 400, 'legR', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(legR);
    legR.setName('legR');
    
    var legL = this.add.image(50, 250, 'legL', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(legL);
    legL.setName('legL');
    
    //-----les drop zones----
    // margin left, margin top, width, heigth 
    //  A drop zone
    var zone = this.add.zone(201, 125, 100, 80).setRectangleDropZone(100, 80);
    zone.setName('head');
    
    //  A drop zone
    var zone2 = this.add.zone(195, 237, 100, 140).setRectangleDropZone(100, 140);
    zone2.setName('body');
    
    //  A drop zone
    var zone3 = this.add.zone(125, 245, 50, 140).setRectangleDropZone(50, 140);
    zone3.setName('armL');
    
    
    //  A drop zone
    var zone4 = this.add.zone(243, 370, 60, 120).setRectangleDropZone(60, 120);
    zone4.setName('legR');
    
    //  A drop zone
    var zone5 = this.add.zone(169, 370, 60, 120).setRectangleDropZone(60, 120);
    zone5.setName('legL');
    
    //  A drop zone
    var zone6 = this.add.zone(280, 250, 60, 140).setRectangleDropZone(60, 140);
    zone6.setName('armR');
    
 
    //---drag and drop mechanics---
    this.input.on('dragstart', function (pointer, gameObject) {

        this.children.bringToTop(gameObject);
        holdSound.play();

    }, this);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });

    this.input.on('dragenter', function (pointer, gameObject, dropZone) {


    });

    this.input.on('dragleave', function (pointer, gameObject, dropZone) {

    });

    this.input.on('drop', function (pointer, gameObject, dropZone) {
        if(gameObject.name == dropZone.name){
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;

            gameObject.input.enabled = false;
            
            successfulDropoff++;

            correctSound.play();
        }
else{
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
    
            wrongSound.play();
        }
        

    });

    this.input.on('dragend', function (pointer, gameObject, dropped) {

        if (!dropped)
        {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
            
        }
        
        if(successfulDropoff === 6){
            nextArrow.setVisible(true);
            nextArrow.setInteractive();
            finishSound.play();
            star.setVisible(true);
            gameBg.setVisible(true);
    }
        
        nextArrow.on('pointerdown', onClick);

    });
    

}


function update() {
    if(successfulDropoff === 6){
         starScale += 0.001;
        star.setScale(starScale);
        if (starScale > 0.3){
            starScale = 0.3;
        } }

}

function onClick(){
    window.location.replace("https://games.caramel.be/robin-hood/index.html");

}

