import * as fct from "/src/js/fonctions.js";

export default class fin extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "fin" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
this.load.image('over', 'src/assets/GameOver.png'); 
this.load.image('retry', 'src/assets/retry.png'); 
this.load.image('quit', 'src/assets/quit.png');

  }

  create() {
    fct.doNothing();
    fct.doAlsoNothing();
    this.add.image(50, 50, "over").setOrigin(0).setDepth(0).setDisplaySize(700, 500);
    var bouton_retry = this.add.image (400,500,"retry").setDepth(1).setDisplaySize(150, 50);
    
    bouton_retry.setInteractive();
    bouton_retry.on("pointerup", () => {
      this.scene.start("selection");
      
    });


  }

  update() {
  
}
}
