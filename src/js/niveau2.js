export default class niveau2 extends Phaser.Scene {
  // constructeur de la classe
  
  constructor() {
    super({
      key: "niveau2" //  ici on précise le nom de la classe en tant qu'identifiant
    }); 
    this.player = null;
    this.groupe_plateformes = null;
    this.clavier = null;
    this.projectiles = null; 
    this.gameOver = null;
    this.vie = 5;
    this.text = null;
    this.boule=null;
    this.groupeBullets=null; 
    this.nb_aide=0;
  }
  // mise en place d'une variable groupeCibles
  preload() {
    this.load.image("tuilesdejeu","src/assets/BG_neige.png")
    this.load.image("tuilesdejeu2","src/assets/Tileset_neige.png")
    
    this.load.tilemapTiledJSON("carte2","src/assets/map_neige.tmj")
    
    this.load.spritesheet("img_perso", "src/assets/farmer.png", {
      frameWidth: 45,
      frameHeight: 50
    }); 
      // chargement de l'image cible.png
    this.load.image("mammochon", "src/assets/Mammochon.png");  
    this.load.image("flocon", "src/assets/flocon.png");
    this.load.image("farfuret","src/assets/farfuret.png");
    this.load.image('porte', 'src/assets/door3.png');
    this.load.image('feunard','src/assets/feunard.png');
    this.load.image('feu','src/assets/feu.png');
    this.load.audio('bgniveau2', 'src/assets/niveau2.mp3');
    this.load.image('soundon3', 'src/assets/SoundOn2.png'); 
      this.load.image('soundoff3', 'src/assets/SoundOff2.png');

      this.load.image('2_indice1', 'src/assets/Niveau2_Indice1.png'); 
      this.load.image('2_indice2', 'src/assets/Niveau2_Indice2.png'); 
      this.load.image('2_indice3', 'src/assets/Niveau2_Indice3.png'); 
      this.load.image('icone_indice', 'src/assets/indicen.png'); 
      this.load.image('fleche', 'src/assets/flecheretour.png'); 
      this.load.image('doublefleche2', 'src/assets/doublefleche.png'); 
  }

  create() {
     
    this.player = this.physics.add.sprite(416, 576, 'img_perso'); 
    this.player.setDepth(100);
    this.player.setCollideWorldBounds(true); 
    this.physics.add.collider(this.player, this.groupe_plateformes); 
    this.player.setBounce(0.2); 
    this.clavier = this.input.keyboard.createCursorKeys(); 
    

    this.anims.create({
      key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    }); 
  
    this.anims.create({
      key: "anim_tourne_droite", // key est le nom de l'animation : doit etre unique poru la scene.
      frames: this.anims.generateFrameNumbers("img_perso", { start:5 , end: 8 }), // on prend toutes les frames de img perso numerotées de 0 à 3
      frameRate: 10, // vitesse de défilement des frames
      repeat: -1 // nombre de répétitions de l'animation. -1 = infini
    }); 
  
    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 4 }],
      frameRate: 20
    });

    const map2 = this.add.tilemap("carte2");

    const ts1 = map2.addTilesetImage("BG", "tuilesdejeu");
    const ts2 = map2.addTilesetImage("Tileset neige", "tuilesdejeu2");

    const Background = map2.createLayer("Background", [ts1, ts2]);
    const Decor = map2.createLayer("Decor", [ts1, ts2]);
    const niveau_neige = map2.createLayer("niveau_neige", [ts1, ts2]);
    const blocs_caches = map2.createLayer("blocs_caches", [ts1, ts2]);

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

    var mammochons = this.physics.add.group({
      key: 'mammochon',
      repeat: 2,
      setXY: { x: 3200, y: 736, stepX: 128 }
    });

    this.physics.add.collider(mammochons, niveau_neige);
    this.physics.add.overlap(this.player, mammochons, this.chocAvecMammochon, null, this);
    this.projectiles = this.physics.add.group();

    mammochons.children.iterate((mammochon) => {
      mammochon.peutTirer = true; 
      mammochon.setVelocityY(Phaser.Math.Between(-100, -150));
      mammochon.setBounce(1);
      mammochon.setCollideWorldBounds(true);

      this.time.addEvent({
        delay: Phaser.Math.Between(7000, 8000),
        callback: () => {
          if (mammochon.peutTirer) {
          this.tirerFlocon(mammochon);
          }
        },
        callbackScope: this,
        loop: true,
      });
    });

    var farfurets = this.physics.add.group({
      key: 'farfuret',
      repeat: 2,
      setXY: { x: 2048, y: 224, stepX: 128 }
    });

    this.physics.add.collider(farfurets, niveau_neige);
    this.physics.add.overlap(this.player, farfurets, this.chocAvecMammochon, null, this);

    farfurets.children.iterate((farfuret) => {
      farfuret.peutTirer = true; 
      farfuret.setVelocityY(Phaser.Math.Between(-100, -150));
      farfuret.setBounce(1);
      farfuret.setCollideWorldBounds(true);

      this.time.addEvent({
        delay: Phaser.Math.Between(7000, 8000),
        callback: () => {
          if (farfuret.peutTirer) {
          this.tirerFlocon(farfuret);
          }
        },
        callbackScope: this,
        loop: true,
      });
    });
    
    var feunards = this.physics.add.group({
      key: 'feunard',
      repeat: 2,
      setXY: { x: 4352, y: 320, stepX: 128 }
    });

    this.physics.add.collider(feunards, niveau_neige);
    this.physics.add.overlap(this.player, feunards, this.chocAvecMammochon, null, this);

    feunards.children.iterate((feunard) => {
      feunard.peutTirer = true;
      feunard.setVelocityY(Phaser.Math.Between(-100, -150));
      feunard.setBounce(1);
      feunard.setCollideWorldBounds(true);

      this.time.addEvent({
        delay: Phaser.Math.Between(7000, 8000),
        callback: () => {
          if (feunard.peutTirer) {
          this.tirerFlocon(feunard);
          }
        },
        callbackScope: this,
        loop: true,
      });
    });
// Affichage du nombre de vies
this.text = this.add.text(
  16,
  16,
  "Il vous reste " + this.vie + " vie(s)",
  {
    fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
    fontSize: "22pt",
    fontWeight: "bold",
    color: "#000000" // Définir la couleur du texte en noir
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
       this.gameOver = true; // Déclenche le game over
     } else if (body.gameObject === this.player && (left || right)) {
       return;
     }
   },
   this
 );

 this.porteContactee =false;

 this.porte_retour = this.physics.add.sprite(5984, 576, "porte").setDisplaySize(64, 96).setDepth(-100);

 this.porte_retour.body.allowGravity = false;
    this.physics.add.collider(this.projectiles, niveau_neige, this.projectileCollision, null, this);
    this.physics.add.collider(this.projectiles, blocs_caches, this.projectileCollision, null, this);
    this.physics.add.collider(this.projectiles, this.player, this.projectileCollisionjoueur, null, this);
  
    this.boule = this.input.keyboard.addKey('A'); 

    this.groupeBullets = this.physics.add.group(); // Correction: utilisez this pour référencer groupeBullets
// A l'intérieur de la méthode create()
this.physics.add.collider(this.groupeBullets, niveau_neige, function(bullet, platform) {
  bullet.destroy(); // Détruisez la balle lorsqu'elle entre en collision avec une plateforme
});
this.physics.add.collider(this.groupeBullets, blocs_caches, function(bullet, platform) {
  bullet.destroy(); // Détruisez la balle lorsqu'elle entre en collision avec une plateforme
});
this.physics.add.overlap(this.groupeBullets, mammochons, this.collisionFeuEnnemi, null, this);
this.physics.add.overlap(this.groupeBullets, farfurets, this.collisionFeuEnnemi, null, this);
this.physics.add.overlap(this.groupeBullets, feunards, this.collisionFeuEnnemi, null, this);
this.physics.add.overlap(this.groupeBullets, this.projectiles, this.collisionFeuEnnemi, null, this);

this.music = this.sound.add('bgniveau2');
    this.musicPlaying = true; // Variable de statut pour suivre si la musique est en cours de lecture


    this.bouton_SoundOn = this.add.image(750, 35, "soundon3").setDepth(1).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_SoundOn.setInteractive();
    this.music.play();
    this.musicPlaying=true;

    this.bouton_SoundOn.on("pointerup", () => {
      if (this.musicPlaying) {
          this.music.stop(); // Arrêter la musique
          this.bouton_SoundOn.setTexture("soundoff3").setDisplaySize(40, 40); // Changer le bouton en Sound Off
          this.musicPlaying = false; // Mettre à jour le statut de la musique
      } else {
          this.music.play(); // Reprendre la musique
          this.bouton_SoundOn.setTexture("soundon3").setDisplaySize(60, 45); // Changer le bouton en Sound On
          this.musicPlaying = true; // Mettre à jour le statut de la musique
      }
  });



  this.bouton_indice2= this.add.image(680, 35, "icone_indice").setDepth(101).setDisplaySize(60, 45).setScrollFactor(0);
  this.bouton_indice2.setInteractive();

  this.bouton_indice2.on("pointerup", () => {
    if (this.nb_aide==0) {
      this.bouton_indice2.setVisible(false);
      this.bouton_passer2.setVisible(false);
    this.physics.pause();
    this.image_12=this.add.image(450, 300, "2_indice1").setDepth(101).setDisplaySize(400, 500).setScrollFactor(0);
    this.bouton_retour12= this.add.image(750, 550, "fleche").setDepth(102).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_retour12.setInteractive();
    this.bouton_retour12.on("pointerup", () => {
      this.bouton_indice2.setVisible(true);
      this.bouton_passer2.setVisible(true);
    this.image_12.destroy();
    this.nb_aide=1;
    this.physics.resume();
    this.bouton_retour12.destroy();
   });
  }
    if (this.nb_aide==1) {
      this.bouton_indice2.setVisible(false);
      this.bouton_passer2.setVisible(false);
      this.physics.pause();
      this.image_22=this.add.image(450, 300, "2_indice2").setDepth(101).setDisplaySize(400, 500).setScrollFactor(0);
    this.bouton_retour22= this.add.image(750, 550, "fleche").setDepth(102).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_retour22.setInteractive();
    this.bouton_retour22.on("pointerup", () => {
      this.bouton_indice2.setVisible(true);
      this.bouton_passer2.setVisible(true);
    this.image_22.destroy();
    this.nb_aide=2;
    this.physics.resume();
    this.bouton_retour22.destroy();
  });
    } if (this.nb_aide==2){
      this.bouton_indice2.setVisible(false);
      this.bouton_passer2.setVisible(false);
      this.physics.pause();
      this.image_32=this.add.image(450, 300, "2_indice3").setDepth(101).setDisplaySize(400, 500).setScrollFactor(0);
      this.bouton_retour32= this.add.image(750, 550, "fleche").setDepth(102).setDisplaySize(60, 45).setScrollFactor(0);
      this.bouton_retour32.setInteractive();
      this.bouton_retour32.on("pointerup", () => {
        this.bouton_indice2.setVisible(true);
        this.bouton_passer2.setVisible(true);
      this.image_32.destroy();
      this.nb_aide=0;
      this.physics.resume();
      this.bouton_retour32.destroy();
    });
    }
});


this.bouton_passer2 = this.add.image(700, 550, "doublefleche2").setDepth(1).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_passer2.setInteractive();

    this.bouton_passer2.on("pointerup", () => {
      this.scene.start("niveau3");
  });



  }
  

  update() {
    if (this.clavier.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play('anim_tourne_droite', true);
    } else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play('anim_tourne_gauche', true);
    }
    if (this.clavier.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-330);
    }

    if (this.gameOver) {
      this.vie--; // Décrémentez le nombre de vies
      this.text.setText("Il vous reste " + this.vie + " vie(s)"); // Mettez à jour le texte affichant le nombre de vies
      if (this.vie <= 0) { // Si le joueur n'a plus qu'une seule vie
        this.music.stop();
        this.scene.start("fin"); // Redirigez vers la scène de fin de jeu

        if (this.vie==0){
          this.vie=5;
          this.scene.start("fin")
          this.music.stop();
        }
      } else {
        this.player.setPosition(416, 576); // Réinitialisez la position du joueur
        this.physics.resume(); // Reprenez la simulation physique
        this.player.clearTint(); // Effacez la couleur rouge
        this.gameOver = false; // Réinitialisez la variable gameOver
      }
    }

  // Vérifiez si la touche espace est enfoncée et que le joueur est en collision avec la porte
    if (this.clavier.space.isDown && this.physics.overlap(this.player, this.porte_retour)) {
      // Si la porte n'a pas déjà été contactée
      if (!this.porteContactee) {
          // Marquer la porte comme contactée
          this.porteContactee = true;
          // Rediriger vers le menu de sélection
          this.scene.start("niveau3"); 
          this.music.stop();
          this.porteContactee = false;
          // Remplacez "nom_de_votre_scene_de_menu" par le nom de votre scène de menu
      }
  } else {
      // Si le joueur n'est plus en collision avec la porte, réinitialisez le marqueur
      this.porteContactee = false;
  }

    if (this.text) {
      this.text.x = this.cameras.main.scrollX + 16;
      this.text.y = this.cameras.main.scrollY + 50;
  }
  if (Phaser.Input.Keyboard.JustDown(this.boule)) { // Correction: utilisez this.fleche
    this.tirer(this.player); // Correction: utilisez this.tirer
  }
  
  }
  
  
  
  tirerFlocon(mammochon) {
    const flocon = this.projectiles.create(mammochon.x, mammochon.y, 'flocon');
    flocon.setCollideWorldBounds(true);
    flocon.setVelocityX(Phaser.Math.Between(-100, -300));
    flocon.body.setAllowGravity(false);
}

  chocAvecMammochon(player, mammochon){
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("anim_face");
    this.gameOver = true;
  }

  projectileCollisionjoueur(player, projectile) {
    
    projectile.setActive(false).setVisible(false);
    this.physics.world.removeCollider(projectile.body.collider);
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("anim_face");
    this.gameOver = true;
    
  }
  projectileCollision(projectile, layer) {
    if (projectile) {
        projectile.setActive(false).setVisible(false);
        projectile.body.checkCollision.none = true;
    }
}
tirer(player) {
  var bullet = this.groupeBullets.create(player.x, player.y , 'feu');
  bullet.setCollideWorldBounds(true);
  bullet.body.allowGravity = false;
  var coefDir;
  if (player.body.velocity.x < 0) {
      coefDir = -1;
  } else {
      coefDir = 1;
  }
  bullet.setScale(0.5); 
bullet.setVelocity(300 * coefDir, 0);
}

collisionFeuEnnemi(bullet,ennemi){
  bullet.destroy(); 
  ennemi.destroy(); 
  ennemi.peutTirer = false;

}
}


