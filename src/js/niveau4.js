export default class niveau4 extends Phaser.Scene {
    // constructeur de la classe
    constructor() {
      super({
        key: "niveau4" //  ici on précise le nom de la classe en tant qu'identifiant
      });
      this.player = null;
      this.groupe_plateformes = null;
      this.clavier = null;
      this.gameOver=null; 
      this.vie=3;
      this.zone_texte_score;
      this.text=null;
    }
  
    preload() {
      this.load.image("tuilesdejeu", "src/asset/Cube.png")
      this.load.image("tuilesdejeu2", "src/assets/ciel.png")
      this.load.image("tuilesdejeu3", "src/assets/Background.png")
      this.load.image("tuilesdejeu4", "src/assets/Deco.png")

      this.load.tilemapTiledJSON("carte", "src/assets/map_niveau_bonus.tmj");

      this.load.image('soundon', 'src/assets/SoundOn.png'); 
      this.load.image('soundoff', 'src/assets/SoundOff.png'); 
  
      this.load.spritesheet("img_perso", "src/assets/farmer.png", {
        frameWidth: 45,
        frameHeight: 50
      });
    }
  
    create() {
      const grossisment =0.7;
      this.player = this.physics.add.sprite(0, 0, 'img_perso');
      this.player.setDepth(100);
      this.player.setCollideWorldBounds(true); 
      this.physics.add.collider(this.player, this.groupe_plateformes); 
      this.physics.world.setBounds(-50,0, 2800, 1000);
      this.player.setBounce(0.2); 
      this.player.setScale(grossisment);
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
  
      const ts1 = map.addTilesetImage("Cube", "tuilesdejeu");
      const ts2 = map.addTilesetImage("Ciel", "tuilesdejeu2");
      const ts3 = map.addTilesetImage("Fond", "tuilesdejeu3");
      const ts4 = map.addTilesetImage("Deco","tuilesdejeu4")

      
      const Mur_transparent = map.createLayer("Mur_transparent", [ts1, ts2, ts3, ts4]);     
      const Plateforme = map.createLayer("Plateforme", [ts1, ts2, ts3, ts4]); 
      const Fond = map.createLayer("Fond", [ts1, ts2, ts3]);
     
      const Invisible_solide = map.createLayer("Invisible_solide", [ts1, ts2, ts3]);
      const Deco = map.createLayer("Deco", [ts1, ts2, ts3, ts4]);


      Plateforme.setCollisionByProperty({ estSolide: true }); 
      Fond.setCollisionByProperty({ estSolide : false});
      Deco.setCollisionByProperty({ estSolide : false});
      Invisible_solide.setCollisionByProperty({ estSolide : true});
      
      Mur_transparent.setCollisionByProperty({ estSolide: false });
  
  
  // ajout d'une collision entre le joueur et le calque plateformes
  this.physics.add.collider(this.player, this.Invisible_solide ); 
  this.physics.add.collider(this.player, Plateforme ); 
   
  
      // redimentionnement du monde avec les dimensions calculées via tiled
      this.physics.world.setBounds(0, 0, 3200, 960);
      //  ajout du champs de la caméra de taille identique à celle du monde
      this.cameras.main.setBounds(0, 0, 3200, 960);
      // ancrage de la caméra sur le joueur
      this.cameras.main.startFollow(this.player);
  
  this.groupe_plateformes = this.physics.add.staticGroup();
  
  this.text = this.add.text(
    16, // Coordonnée X par rapport à la caméra
    16, // Coordonnée Y par rapport à la caméra
    "IL vous reste " + this.vie + " vies",
    {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt",
      fontWeight: "bold"
    }
  ).setOrigin(0);

    }
  
  
    update() {
      if (this.clavier.right.isDown) {
        this.player.setVelocityX(160);
        this.player.anims.play('anim_tourne_droite', true);
      }
      else if (this.clavier.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.anims.play('anim_tourne_gauche', true);
      } else {
        this.player.setVelocityX(0);
        this.player.anims.play('anim_face', true)
      }
  
      if (this.clavier.up.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-320);
      }
 
  
      if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
          if (this.physics.overlap(this.player, this.porte_retour)) {
              console.log("niveau 4 : retour vers selection");
              this.scene.switch("selection");
          }
      }
  
  
      if (this.text) {
        this.text.x = this.cameras.main.scrollX + 16;
      this.text.y = this.cameras.main.scrollY + 16;
      }
  
  
    }
}