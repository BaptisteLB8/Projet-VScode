export default class niveau1 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau1"
    });
    this.player = null;
    this.groupe_plateformes = null;
    this.clavier = null;
    this.gameOver = null;
    this.vie = 3;
    this.text = null;
    this.grossissement = 0.7; // Nouvelle variable pour le grossissement
  }

  preload() {
    this.load.image("Phaser_tuilesdejeu", "src/assets/Tuile.png");
    this.load.tilemapTiledJSON("cartes", "src/assets/Mapforet.json");
    this.load.spritesheet("img_perso", "src/assets/farmer.png", {
      frameWidth: 45,
      frameHeight: 50
    });
    this.load.image("mechant", "src/assets/mechant.png");
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
      key: "anim_tourne_gauche",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 1 }],
      frameRate: 20
    });

    this.physics.world.setBounds(0, 0, 1620, 325);
    this.cameras.main.setBounds(0, -145, 1600, 325);
    this.cameras.main.startFollow(this.player);

    this.groupe_plateformes = this.physics.add.staticGroup();

    // Affichage du nombre de vies
    this.text = this.add.text(
      16,
      16,
      "Il vous reste " + this.vie + " vies",
      {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        fontSize: "22pt",
        fontWeight: "bold"
      }
    ).setOrigin(0);

    // Ajout de l'écouteur pour les collisions avec les bords du monde
    this.player.body.onWorldBounds = true;
    this.player.body.world.on(
      "worldbounds",
      function (body, up, down, left, right) {
        if (body.gameObject === this.player && down == true) {
          this.physics.pause();
          this.player.setTint(0xff0000);
          this.gameOver = true;
        } else if (body.gameObject === this.player && (left || right)) {
          return;
        }
      },
      this
    );

    // Appliquer le grossissement au joueur
    this.player.setScale(this.grossissement);

    // Définir le joueur avec le pipeline Light2D
    this.player.setPipeline('Light2D');
  }


  update() {
    // Gestion des mouvements du joueur
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

    // Gestion du game over
    if (this.gameOver) {
      this.vie--;
      this.text.setText("Il vous reste " + this.vie + " vies");
      if (this.vie <= 0) {
        this.scene.start("fin");
      } else {
        this.player.setPosition(0, 0);
        this.physics.resume();
        this.player.clearTint();
        this.gameOver = false;
      }
    }
  }
}
