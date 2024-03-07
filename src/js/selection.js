//class menu extends Phaser.Scene {
  export default class selection extends Phaser.Scene {


    constructor() {
      super({ key: "selection" });
    }
    //on charge les images
    preload() {
      this.load.image("image_fond", "src/assets/image_fond.jpg");
      this.load.image("imageBoutonPlay", "src/assets/start.png");
      this.load.image('soundon', 'src/assets/SoundOn2.png'); 
    this.load.image('soundoff', 'src/assets/SoundOff2.png'); 
  
  this.load.audio('background', 'src/assets/accueil.mp3');
    }
  
    create() {
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
        this.scene.start("niveau2");
        this.music.stop();
      });
      //bouton_settings.on("pointerup", () => {
        //this.scene.start("commandes");
      //});
      this.music = this.sound.add('background');
      this.musicPlaying = true; // Variable de statut pour suivre si la musique est en cours de lecture
  
      this.bouton_SoundOn = this.add.image(750, 50, "soundon").setDepth(1).setDisplaySize(60, 45);
      this.bouton_SoundOn.setInteractive();
      this.music.play();
  
      this.bouton_SoundOn.on("pointerup", () => {
          if (this.musicPlaying) {
              this.music.stop(); // Arrêter la musique
              this.bouton_SoundOn.setTexture("soundoff").setDisplaySize(40, 40); // Changer le bouton en Sound Off
              this.musicPlaying = false; // Mettre à jour le statut de la musique
          } else {
              this.music.play(); // Reprendre la musique
              this.bouton_SoundOn.setTexture("soundon").setDisplaySize(65, 45); // Changer le bouton en Sound On
              this.musicPlaying = true; // Mettre à jour le statut de la musique
          }
      });
    }
    
  } 

