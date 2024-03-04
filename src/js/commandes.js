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

    // Create a new HTML document
var newDoc = document.implementation.createHTMLDocument("New Document");

// Clear the body content
newDoc.body.innerHTML = '';

// Append the new document to the current window
document.documentElement.replaceWith(newDoc.documentElement);

  }

  update() {
  
}
}
