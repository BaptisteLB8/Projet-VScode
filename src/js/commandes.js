import * as fct from "/src/js/fonctions.js";

export default class commandes extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "commandes" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
this.load.image('livre', 'src/assets/book.png'); 
this.load.image('retour1', 'src/assets/retour.png'); 

  }

  create() {
    fct.doNothing();
    fct.doAlsoNothing();
    var bouton_return = this.add.image (650,565,"retour1").setDepth(1).setDisplaySize(50, 50);;
    bouton_return.setInteractive();
    bouton_return.on("pointerup", () => {
      this.scene.start("selection");
    });
    //this.add.image(0, 0, "livre").setOrigin(0).setDepth(1).setDisplaySize(800, 600);
    



  }

  update() {
  
}
}
