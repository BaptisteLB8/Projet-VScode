export default class niveau1 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau1"
    });
    this.player = null;
    this.groupe_plateformes = null;
    this.clavier = null;
  }

  preload() {
    this.load.image("Phaser_tuilesdejeu", "src/assets/Tuile.png");
    this.load.tilemapTiledJSON("cartes", "src/assets/Mapforet.json");
    this.load.spritesheet("img_perso", "src/assets/farmer.png", {
      frameWidth: 45,
      frameHeight: 50
    });
  }

  create() {
    const largeurFenetre = 1600;
    const hauteurFenetre = 600;

    const carteDuNiveau = this.add.tilemap("cartes", largeurFenetre, hauteurFenetre);
    const tileset = carteDuNiveau.addTilesetImage("Tuile", "Phaser_tuilesdejeu");
    
    const calque_background = carteDuNiveau.createLayer("calque_background", tileset, 0, 0);
    const calque_objets = carteDuNiveau.createLayer("calque_objets", tileset, 0, 0);
    const calque_plateformes = carteDuNiveau.createLayer("calque_plateformes", tileset, 0, 0);

    calque_plateformes.setCollisionByProperty({ estSolide: true });
    calque_objets.setCollisionByProperty({ estSolide: false });
    calque_background.setCollisionByProperty({ estSolide: false });
    this.player = this.physics.add.sprite(0, 0, 'img_perso');
    this.player.setDepth(100);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, calque_plateformes);
    this.player.setBounce(0.2);
    this.clavier = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", { start: 3, end: 5 }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    this.anims.create({
      key: "anim_tourne_droite", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", { start: 6, end: 8 }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    });

    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 1 }],
      frameRate: 20
    });

    this.physics.world.setBounds(0, 0, 1610, 320);
    this.cameras.main.setBounds(0, -145, 1600, 320);
    this.cameras.main.startFollow(this.player);

    this.groupe_plateformes = this.physics.add.staticGroup();
  }

  update() {
    if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('anim_tourne_droite', true);
    } else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('anim_tourne_gauche', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('anim_face', true)
    }
    if (this.clavier.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-320);
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space)) {
      // Assurez-vous que this.porte_retour est correctement initialisé
      if (this.physics.overlap(this.player, this.porte_retour)) {
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("selection");
      }
    }
  }
}
