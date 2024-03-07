import * as fct from "/src/js/fonctions.js";

export default class regles extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "regles" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
this.load.image('regle', 'src/assets/regles_du_jeu.png'); 

  }

  create() {
    fct.doNothing();
    fct.doAlsoNothing();
    this.add.image(0, 0, "regle").setOrigin(0).setDepth(0).setDisplaySize(800, 600);

    



  }

  update() {
    this.input.keyboard.on('keydown-ENTER', () => {
        this.scene.start('niveau1');
    });
  
}
}
