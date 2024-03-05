
export default class niveau3 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau3" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_tuilesdejeu","src/assets/tuiles.png")
    this.load.image("Phaser_tuilesdejeu2","src/assets/ground.png")
    this.load.image("Phaser_tuilesdejeu3","src/assets/nuit.jpg")
    this.load.tilemapTiledJSON("carte","src/assets/map_niveau3.tmj");
  }

  create() {

    const carteDuNiveau = this.add.tilemap("carte");

    const tileset = carteDuNiveau.addTilesetImage(
      "tuiles",
      "Phaser_tuilesdejeu"
      
    );  

    const tileset2 = carteDuNiveau.addTilesetImage(
      "ground",
      "Phaser_tuilesdejeu2"
      
    );  

    const tileset3 = carteDuNiveau.addTilesetImage(
      "nuit",
      "Phaser_tuilesdejeu3"
      
    );  
  
    // chargement du calque calque_background
const Transparent_solide = carteDuNiveau.createLayer(
  "Transparent_solide",
  tileset
);

// chargement du calque calque_background_2
const Pas_solide = carteDuNiveau.createLayer(
  "Pas_solide",
  tileset
);

// chargement du calque calque_plateformes
const Solide_premier_plan = carteDuNiveau.createLayer(
  "Solide_premier_plan",
  tileset
);  
// chargement du calque calque_background_2
const Decoration = carteDuNiveau.createLayer(
  "Decoration",
  tileset
);

// chargement du calque calque_plateformes
const Background = carteDuNiveau.createLayer(
  "Background",
  tileset3
);  

Transparent_solide.setCollisionByProperty({ estSolide: true }); 
Pas_solide.setCollisionByProperty({ estSolide: false }); 
Solide_premier_plan.setCollisionByProperty({ estSolide : true});
Decoration.setCollisionByProperty({ estSolide : false});
Background.setCollisionByProperty({ estSolide : false});


    this.groupe_plateformes = this.physics.add.staticGroup();
    
    // ajout d'un texte distintcif  du niveau
    this.add.text(400, 100, "Vous êtes dans le niveau 3", {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt"
    });


    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.groupe_plateformes);
  }

  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face");
    }
    if (this.clavier.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("selection");
      }
    }
  }
}
