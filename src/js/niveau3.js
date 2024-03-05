export default class niveau3 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau3" //  ici on précise le nom de la classe en tant qu'identifiant
    });
    this.player = null;
    this.groupe_plateformes = null;
    this.clavier = null;
    this.gameOver=null;
    this.light = null; 
    this.vie=3;
    this.zone_texte_score;
    this.text=null;
  }

  preload() {
    this.load.image("tuilesdejeu", "src/assets/tuiles.png")
    this.load.image("tuilesdejeu2", "src/assets/ground.png")
    this.load.image("tuilesdejeu3", "src/assets/nuit.jpg")
    this.load.tilemapTiledJSON("carte", "src/assets/map_niveau3.tmj");
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
    this.player.setPipeline('Light2D');

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

    const ts1 = map.addTilesetImage("Paysan", "tuilesdejeu");
    const ts2 = map.addTilesetImage("Fond", "tuilesdejeu2");
    const ts3 = map.addTilesetImage("Background", "tuilesdejeu3");
    const Background = map.createLayer("Background", [ts1, ts2, ts3]);

    const Transparent_solide = map.createLayer("Transparent_solide", [ts1, ts2, ts3]);
    const Sol = map.createLayer("Sol", [ts1, ts2, ts3]);
    const Pas_solide = map.createLayer("Pas_solide", [ts1, ts2, ts3]);
    this.Solide_premier_plan = map.createLayer("Solide_premier_plan", [ts1, ts2, ts3]);
    const Decoration = map.createLayer("Decoration", [ts1, ts2, ts3]);
    

Transparent_solide.setCollisionByProperty({ estSolide: true }); 
Pas_solide.setCollisionByProperty({ estSolide: false }); 
this.Solide_premier_plan.setCollisionByProperty({ estSolide : true});
Decoration.setCollisionByProperty({ estSolide : false});
Background.setCollisionByProperty({ estSolide : false});
Sol.setCollisionByProperty({ estSolide : true});


// ajout d'une collision entre le joueur et le calque plateformes
this.physics.add.collider(this.player, this.Solide_premier_plan ); 
this.physics.add.collider(this.player, Transparent_solide ); 
this.physics.add.collider(this.player, Sol ); 

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 3200, 768);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3600, 768);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(this.player);

this.groupe_plateformes = this.physics.add.staticGroup();

this.light = this.lights.addLight(600, 300, 300);
this.light.setIntensity(2); 
this.light.setRadius(700);
this.lights.enable().setAmbientColor(0x000000);

Background.setPipeline('Light2D');
Transparent_solide.setPipeline('Light2D');
Decoration.setPipeline('Light2D');
Sol.setPipeline('Light2D');
this.Solide_premier_plan.setPipeline('Light2D');   
Pas_solide.setPipeline('Light2D'); 


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
if (this.player.body.blocked.down) {
    var t = this.Solide_premier_plan.getTileAtWorldXY(this.player.x, this.player.y+30);
    if (t!=null && t.index == 396) this.gameOver=true;
    if (t!=null && t.index == 397) this.gameOver=true;
}



if (this.gameOver) {
  this.player.setPosition(0, 0);
  this.gameOver = false;
  this.vie=this.vie-1;
  this.text.setText("IL vous reste " + this.vie + " vies");
}

if (this.vie==0){
  this.vie=3;
  this.scene.start("fin")
}

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
        if (this.physics.overlap(this.player, this.porte_retour)) {
            console.log("niveau 3 : retour vers selection");
            this.scene.switch("selection");
        }
    }

    this.light.x = this.player.x;
    this.light.y = this.player.y;
    
    if (this.text) {
      this.text.x = this.cameras.main.scrollX + 16;
    this.text.y = this.cameras.main.scrollY + 16;
    }
}
}
