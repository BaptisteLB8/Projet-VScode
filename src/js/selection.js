//class menu extends Phaser.Scene {
  export default class selection extends Phaser.Scene {




    constructor() {
      super({ key: "selection" });
    }
    //on charge les images
    preload() {
      this.load.image("image_fond", "src/assets/image_fond.jpg");
      this.load.image("imageBoutonPlay", "src/assets/start.png");
      //this.load.image("img_ciel", "src/assets/sky.png"); 
    //this.load.image("img_plateforme", "src/assets/platform.png");
    this.load.image("img_settings", "src/assets/SETTINGS.png");
    //this.load.spritesheet("img_perso", "src/assets/dude.png", {
      //frameWidth: 32,
      //frameHeight: 48
    //}); 
    //this.load.image("img_etoile", "src/assets/star.png"); 
    //this.load.image("img_bombe", "src/assets/bomb.png");  
    //this.load.image('img_porte1', 'src/assets/door1.png');
  //this.load.image('img_porte2', 'src/assets/door2.png');
  
  this.load.audio('background', 'src/assets/ambiant.mp3');
    }
  
    create() {
     // on place les éléments de fond
      this.add.image(0, 0, "image_fond").setOrigin(0).setDepth(0).setDisplaySize(800, 600)
  
      //on ajoute un bouton de clic, nommé bouton_play
      var bouton_play = this.add.image(400, 300, "imageBoutonPlay").setDepth(1);
      bouton_play.setDisplaySize(300, 75)
      var bouton_settings = this.add.image(400, 400, "img_settings").setDepth(1);
      bouton_settings.setDisplaySize(300, 75)
     
      //=========================================================
      //on rend le bouton interratif
      bouton_play.setInteractive();
      bouton_settings.setInteractive();
  
      //Cas ou la souris passe sur le bouton play
      bouton_play.on("pointerover", () => {
        
      });
      bouton_settings.on("pointerover", () => {
        
      });
      
      //Cas ou la souris ne passe plus sur le bouton play
      bouton_play.on("pointerout", () => {
      
      });
      bouton_settings.on("pointerout", () => {
      
      });
  
  
      //Cas ou la sourris clique sur le bouton play :
      // on lance le niveau 1
      bouton_play.on("pointerup", () => {
        this.scene.start("niveau1");
      });
      bouton_settings.on("pointerup", () => {
        this.scene.start("commandes");
      });
    }
    
  } 