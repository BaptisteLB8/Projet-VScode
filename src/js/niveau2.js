export default class niveau2 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
    });
    this.player = null;
    this.groupe_plateformes = null;
    this.clavier = null;
  }
  preload() {
    this.load.image("tuilesdejeu","src/assets/BG_neige.png")
    this.load.image("tuilesdejeu2","src/assets/Tileset_neige.png")
    
    this.load.tilemapTiledJSON("carte","src/assets/map_neige.tmj")
    
    this.load.spritesheet("img_perso", "src/assets/farmer.png", {
      frameWidth: 45,
      frameHeight: 50    }); 
  }

  create() {
    this.player = this.physics.add.sprite(100, 450, 'img_perso'); 
    this.player.setDepth(100);
    this.player.setCollideWorldBounds(true); 
    this.physics.add.collider(this.player, this.groupe_plateformes); 
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

    const map = this.add.tilemap("carte");

    const ts1 = map.addTilesetImage("BG", "tuilesdejeu");
    const ts2 = map.addTilesetImage("Tileset neige", "tuilesdejeu2");

    const Background = map.createLayer("Background", [ts1, ts2]);
    const Decor = map.createLayer("Decor", [ts1, ts2]);
    const niveau_neige = map.createLayer("niveau_neige", [ts1, ts2]);
    const blocs_caches = map.createLayer("blocs_caches", [ts1, ts2]);

    Background.setCollisionByProperty({ estSolide: false });
    Decor.setCollisionByProperty({ estSolide: false });
    niveau_neige.setCollisionByProperty({ estSolide: true });
    blocs_caches.setCollisionByProperty({ estSolide: true });

    // ajout d'une collision entre le joueur et le calque plateformes
    this.physics.add.collider(this.player, niveau_neige ); 
    this.physics.add.collider(this.player, blocs_caches ); 

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 6400, 1000);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 6400, 1000);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(this.player);

    this.groupe_plateformes = this.physics.add.staticGroup();
 
  }

  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-300);
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(300);
      this.player.anims.play("anim_tourne_droite", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face");
    }
    if (this.clavier.up.isDown && this.player.body.blocked.down) {
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

