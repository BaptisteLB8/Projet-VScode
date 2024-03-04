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

  }

  create() {
    fct.doNothing();
    fct.doAlsoNothing();
    this.add.image(0, 0, "livre").setOrigin(0).setDepth(0).setDisplaySize(800, 600)



  }

  update() {
  
}
}
