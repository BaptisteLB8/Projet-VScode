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
    this.vie=5;
    this.zone_texte_score;
    this.text=null;
    this.rocher;
    this.deuxiemeRocher; 
    this.nb_aide=0;
    
  }

  preload() {
    this.load.image("tuilesdejeuT", "src/assets/tuiles.png")
    this.load.image("tuilesdejeu2T", "src/assets/ground.png")
    this.load.image("tuilesdejeu3", "src/assets/nuit.jpg")
    this.load.tilemapTiledJSON("carte3", "src/assets/map_niveau3.tmj");
    this.load.image('soundon2', 'src/assets/SoundOn.png'); 
    this.load.image('soundoff2', 'src/assets/SoundOff.png'); 
    this.load.image('porte_retour', 'src/assets/door3.png'); 
    this.load.audio('bgniveau3', 'src/assets/niveau3.mp3');
    this.load.image("rocher", "src/assets/pierre.png");
    this.load.image('3_indice1', 'src/assets/Niveau3_Indice1.png'); 
    this.load.image('3_indice2', 'src/assets/Niveau3_Indice2.png'); 
    this.load.image('3_indice3', 'src/assets/Niveau3_Indice3.png'); 
    this.load.image('icone_indice3', 'src/assets/indiceb.png'); 
    this.load.image('fleche3', 'src/assets/flecheretourb.png'); 
    this.load.image('doublefleche3', 'src/assets/doubleflecheb.png'); 


    this.load.spritesheet("img_perso", "src/assets/farmer.png", {
      frameWidth: 45,
      frameHeight: 50
    });
  }

  create() {
    this.porteContactee=true;
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

    const map3 = this.add.tilemap("carte3");



    

    const ts1 = map3.addTilesetImage("Paysan", "tuilesdejeuT");
    const ts2 = map3.addTilesetImage("Fond", "tuilesdejeu2T");
    const ts3 = map3.addTilesetImage("Background", "tuilesdejeu3");
    this.Background = map3.createLayer("Background", [ts1, ts2, ts3]);

    this.Transparent_solide = map3.createLayer("Transparent_solide", [ts1, ts2, ts3]);
    this.Sol = map3.createLayer("Sol", [ts1, ts2, ts3]);
    this.Pas_solide = map3.createLayer("Pas_solide", [ts1, ts2, ts3]);
    this.Solide_premier_plan = map3.createLayer("Solide_premier_plan", [ts1, ts2, ts3]);
    this.Decoration = map3.createLayer("Decoration", [ts1, ts2, ts3]);
    

this.Transparent_solide.setCollisionByProperty({ estSolide: true }); 
this.Pas_solide.setCollisionByProperty({ estSolide: false }); 
this.Solide_premier_plan.setCollisionByProperty({ estSolide : true});
this.Decoration.setCollisionByProperty({ estSolide : false});
this.Background.setCollisionByProperty({ estSolide : false});
this.Sol.setCollisionByProperty({ estSolide : true});


// ajout d'une collision entre le joueur et le calque plateformes
this.physics.add.collider(this.player, this.Solide_premier_plan ); 
this.physics.add.collider(this.player, this.Transparent_solide ); 
this.physics.add.collider(this.player, this.Sol ); 

    // redimentionnement du monde avec les dimensions calculées via tiled
    this.physics.world.setBounds(0, 0, 3200, 768);
    //  ajout du champs de la caméra de taille identique à celle du monde
    this.cameras.main.setBounds(0, 0, 3600, 768);
    // ancrage de la caméra sur le joueur
    this.cameras.main.startFollow(this.player);

this.groupe_plateformes = this.physics.add.staticGroup();

this.light = this.lights.addLight(600, 300, 300);
this.light.setIntensity(1); 
this.light.setRadius(700);
this.lights.enable().setAmbientColor(0x000000);

this.Background.setPipeline('Light2D');
this.Transparent_solide.setPipeline('Light2D');
this.Decoration.setPipeline('Light2D');
this.Sol.setPipeline('Light2D');
this.Solide_premier_plan.setPipeline('Light2D');   
this.Pas_solide.setPipeline('Light2D'); 



this.text = this.add.text(
  16, // Coordonnée X par rapport à la caméra
  16, // Coordonnée Y par rapport à la caméra
  "Il vous reste " + this.vie + " vie(s)",
  {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    fontSize: "22pt",
    fontWeight: "bold"
  }
).setOrigin(0).setScrollFactor(0);
this.porteContactee =false;

this.porte_retour = this.physics.add.sprite(3145, 230, "porte_retour").setDisplaySize(30, 50).setPipeline('Light2D');

    this.porte_retour.body.allowGravity =false;

    this.music = this.sound.add('bgniveau3');
    this.musicPlaying = true; // Variable de statut pour suivre si la musique est en cours de lecture


    this.bouton_SoundOn = this.add.image(750, 35, "soundon2").setDepth(1).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_SoundOn.setInteractive();
    this.music.play();
    this.musicPlaying=true;

    this.bouton_SoundOn.on("pointerup", () => {
      if (this.musicPlaying) {
          this.music.stop(); // Arrêter la musique
          this.bouton_SoundOn.setTexture("soundoff2").setDisplaySize(40, 40); // Changer le bouton en Sound Off
          this.musicPlaying = false; // Mettre à jour le statut de la musique
      } else {
          this.music.play(); // Reprendre la musique
          this.bouton_SoundOn.setTexture("soundon2").setDisplaySize(60, 45); // Changer le bouton en Sound On
          this.musicPlaying = true; // Mettre à jour le statut de la musique
      }
  });

    this.rocher = this.physics.add.image(2190, 100, 'rocher');
    this.rocher.setCollideWorldBounds(true);
    this.rocher.setInteractive(); // Rend le rocher interactif pour le déplacement
    this.physics.add.collider(this.rocher, this.Sol); // Ajoutez une collision avec les plateformes
    this.physics.add.collider(this.rocher, this.Solide_premier_plan);
    this.physics.add.collider(this.rocher, this.player); // Ajoutez une collision avec les plateformes
    this.rocher.setScale(0.1);
    //this.rocher.setAcceleration(0);
    this.rocher.setMass(1);
    this.rocher.setFrictionX(0.5);

    this.rocher.setPushable(true); // Vous pouvez ajuster le nombre selon vos besoins
    this.rocher.body.maxVelocity.x = 0.1;
    //this.rocher.body.setImmovable (true);
    
    this.physics.add.collider(this.rocher, this.groupe_plateformes, null, null, this);


this.deuxiemeRocher = this.physics.add.sprite(2687, 300, 'rocher');
this.deuxiemeRocher.setCollideWorldBounds(true);
this.deuxiemeRocher.setInteractive(); // Rend le rocher interactif pour le déplacement
this.physics.add.collider(this.deuxiemeRocher, this.Sol); // Ajoutez une collision avec les plateformes
this.physics.add.collider(this.deuxiemeRocher, this.Solide_premier_plan);
this.physics.add.collider(this.deuxiemeRocher, this.player); // Ajoutez une collision avec le joueur
this.deuxiemeRocher.setScale(0.1);
    //this.rocher.setAcceleration(0);
    this.deuxiemeRocher.setMass(1);
    this.deuxiemeRocher.setFrictionX(0.5);

    this.deuxiemeRocher.setPushable(true); // Vous pouvez ajuster le nombre selon vos besoins
    this.deuxiemeRocher.body.maxVelocity.x = 0.1;
this.physics.add.collider(this.deuxiemeRocher, this.groupe_plateformes, null, null, this);

this.bouton_indice3= this.add.image(680, 35, "icone_indice3").setDepth(101).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_indice3.setInteractive();

    this.bouton_indice3.on("pointerup", () => {
      if (this.nb_aide==0) {
        this.bouton_indice3.setVisible(false);
        this.bouton_passer3.setVisible(false);
      this.physics.pause();
      this.image_13=this.add.image(400, 300, "3_indice1").setDepth(101).setDisplaySize(500, 600).setScrollFactor(0);
      this.bouton_retour13= this.add.image(750, 550, "fleche3").setDepth(102).setDisplaySize(60, 45).setScrollFactor(0);
      this.bouton_retour13.setInteractive();
      this.bouton_retour13.on("pointerup", () => {
        this.bouton_indice3.setVisible(true);
        this.bouton_passer3.setVisible(true);
      this.image_13.destroy();
      this.nb_aide=1;
      this.physics.resume();
      this.bouton_retour13.destroy();
     });
    }
      if (this.nb_aide==1) {
        this.bouton_passer3.setVisible(false);
        this.bouton_indice3.setVisible(false);
        this.physics.pause();
        this.image_23=this.add.image(400, 300, "3_indice2").setDepth(101).setDisplaySize(500, 600).setScrollFactor(0);
      this.bouton_retour23= this.add.image(750, 550, "fleche3").setDepth(102).setDisplaySize(60, 45).setScrollFactor(0);
      this.bouton_retour23.setInteractive();
      this.bouton_retour23.on("pointerup", () => {
        this.bouton_indice3.setVisible(true);
        this.bouton_passer3.setVisible(true);
      this.image_23.destroy();
      this.nb_aide=2;
      this.physics.resume();
      this.bouton_retour23.destroy();
    });
      } if (this.nb_aide==2){
        this.bouton_indice3.setVisible(false);
        this.bouton_passer3.setVisible(false);
        this.physics.pause();
        this.image_33=this.add.image(400, 300, "3_indice3").setDepth(101).setDisplaySize(500, 600).setScrollFactor(0);
        this.bouton_retour33= this.add.image(750, 550, "fleche3").setDepth(102).setDisplaySize(60, 45).setScrollFactor(0);
        this.bouton_retour33.setInteractive();
        this.bouton_retour33.on("pointerup", () => {
          this.bouton_indice3.setVisible(true);
          this.bouton_passer3.setVisible(true);
        this.image_33.destroy();
        this.nb_aide=0;
        this.physics.resume();
        this.bouton_retour33.destroy();
      });
      }
  });



  this.bouton_passer3 = this.add.image(700, 550, "doublefleche3").setDepth(1).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_passer3.setInteractive();

    this.bouton_passer3.on("pointerup", () => {
      this.scene.start("niveau4");
  });

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
      this.player.setVelocityY(-315);
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
  this.text.setText("Il vous reste " + this.vie + " vie(s)");
  this.rocher.setPosition(2190, 100);
  this.deuxiemeRocher.setPosition(2687, 300);

  
}

if (this.vie==0){
  this.vie=5;
  this.scene.start("fin")
  this.music.stop();
}

  // Déplacements du joueur
  // ...

  // Gestion des collisions avec les tuiles
  // ...

  // Si le joueur est en collision avec la porte et a appuyé sur la touche d'espace
  if (this.clavier.space.isDown && this.physics.overlap(this.player, this.porte_retour)) {
    // Si la porte n'a pas déjà été contactée
    if (!this.porteContactee) {
      // Marquer la porte comme contactée
      this.porteContactee = true;
      // Rediriger vers la scène de sélection
      this.scene.start("niveau4");
      this.music.stop();
      this.vie=5;
    }
  } else {
    // Si le joueur n'est plus en collision avec la porte, réinitialiser le marqueur
    this.porteContactee = false;
  }

  // Mise à jour de la position de la lumière
  this.light.x = this.player.x;
  this.light.y = this.player.y;
  
  // Mise à jour de la position du texte
 

}
}
