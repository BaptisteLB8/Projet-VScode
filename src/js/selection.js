//class menu extends Phaser.Scene {
  export default class selection extends Phaser.Scene {


    constructor() {
      super({ key: "selection" });
    }
    //on charge les images
    preload() {
      this.load.image("image_fond", "src/assets/image_fond.jpg");
      this.load.image("imageBoutonPlay", "src/assets/start.png");
      this.load.image('soundon', 'src/assets/SoundOn.png'); 
    this.load.image('soundoff', 'src/assets/SoundOff.png'); 
  
  this.load.audio('background', 'src/assets/ambiant.mp3');
    }
  
    create() {
     // on place les éléments de fond
      this.add.image(0, 0, "image_fond").setOrigin(0).setDepth(0).setDisplaySize(800, 600)
  
      //on ajoute un bouton de clic, nommé bouton_play
      var bouton_play = this.add.image(400, 300, "imageBoutonPlay").setDepth(1);
      bouton_play.setDisplaySize(300, 75)
      //var bouton_settings = this.add.image(400, 400, "img_settings").setDepth(1);
      //bouton_settings.setDisplaySize(300, 75)
     
      //=========================================================
      //on rend le bouton interratif
      bouton_play.setInteractive();
      //bouton_settings.setInteractive();
  
      //Cas ou la souris passe sur le bouton play
      bouton_play.on("pointerover", () => {
        
      });
      //bouton_settings.on("pointerover", () => {
        
      //});
      
      //Cas ou la souris ne passe plus sur le bouton play
      bouton_play.on("pointerout", () => {
      
      });
      //bouton_settings.on("pointerout", () => {
      
     // });
  
  
      //Cas ou la sourris clique sur le bouton play :
      // on lance le niveau 1
      bouton_play.on("pointerup", () => {
        this.scene.start("niveau3");
      });
      //bouton_settings.on("pointerup", () => {
        //this.scene.start("commandes");
      //});
      var bouton_SoundOn = this.add.image (550,50,"soundon").setDepth(1).setDisplaySize(150, 50);
    bouton_SoundOn.setInteractive();
    bouton_SoundOn.on("pointerup", () => {

    });
    }
    
  } 

