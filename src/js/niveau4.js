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
      this.vie=10;
      this.zone_texte_score;
      this.text=null;
      this.plateforme_supprime;
      this.plateforme_mobile;
      this.tween_mouvement; 
      this.levier; 
      this.nb_aide=0;
      
      
    }
  
    preload() {
      this.load.image("tuilesdejeuA", "src/assets/Cube.png")
      this.load.image("tuilesdejeu2A", "src/assets/ciel.png")
      this.load.image("tuilesdejeu3A", "src/assets/Background.png")
      this.load.image("tuilesdejeu4", "src/assets/Deco.png")
      this.load.image("tuilesdejeu5", "src/assets/pic.png")
      this.load.image("img_plateforme_mobile", "src/assets/plateforme_amovible.png"); 
      this.load.tilemapTiledJSON("carte4", "src/assets/map_niveau_bonus.tmj");
      this.load.image("img_levier", "src/assets/levier.png");
      this.load.image('porte_retour2', 'src/assets/door3.png'); 
      this.load.audio('bgniveau4', 'src/assets/niveau4.mp3');
      this.load.image('4_indice1', 'src/assets/Niveau4_Indice1.png'); 
    this.load.image('4_indice2', 'src/assets/Niveau4_Indice2.png'); 
    this.load.image('4_indice3', 'src/assets/Niveau4_Indice3.png'); 
    this.load.image('icone_indice', 'src/assets/indicen.png'); 
    this.load.image('fleche', 'src/assets/flecheretourb.png'); 


      this.load.image('soundon4', 'src/assets/SoundOn2.png'); 
      this.load.image('soundoff4', 'src/assets/SoundOff2.png'); 
  
      this.load.spritesheet("img_perso", "src/assets/farmer.png", {
        frameWidth: 45,
        frameHeight: 50
      });
    }
  
    create() {
      this.affichage=4;
      const grossisment =0.7;
      this.player = this.physics.add.sprite(440, 0, 'img_perso');
      this.player.setDepth(100);
      this.player.setCollideWorldBounds(true); 
      this.physics.add.collider(this.player, this.groupe_plateformes); 
      this.physics.world.setBounds(-50,0, 2800, 1000);
      
      this.player.setScale(grossisment);
      this.clavier = this.input.keyboard.createCursorKeys(); 

      this.levier = this.physics.add.staticSprite(20, 140, "img_levier");
      this.levier.active = false;
      this.levier.setDepth(1); // Vous pouvez ajuster la valeur selon vos besoins
      this.levier.setScale(0.7);
      this.levier.setOrigin(0.5, 0.5);

      
     
  
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
  
      const map4 = this.add.tilemap("carte4");
  
      const ts1 = map4.addTilesetImage("Cube", "tuilesdejeuA");
      const ts2 = map4.addTilesetImage("Ciel", "tuilesdejeu2A");
      const ts3 = map4.addTilesetImage("Fond", "tuilesdejeu3A");
      const ts4 = map4.addTilesetImage("Deco","tuilesdejeu4")
      const ts5 = map4.addTilesetImage("Pic","tuilesdejeu5")

      const Fond = map4.createLayer("Fond", [ts1, ts2, ts3,ts4]);
      const Invisible_solide = map4.createLayer("Invisible_solide", [ts1, ts2, ts3,ts4]);
      const Deco = map4.createLayer("Deco", [ts1, ts2, ts3, ts4, ts5]);
      const Mur_transparent = map4.createLayer("Mur_transparent", [ts1, ts2, ts3, ts4]);     
      this.Plateforme = map4.createLayer("Plateforme", [ts1, ts2, ts3, ts4, ts5]); 
     
    
      this.Plateforme.setCollisionByProperty({ estSolide: true }); 
      Fond.setCollisionByProperty({ estSolide : false});
      Deco.setCollisionByProperty({ estSolide : false});
      Invisible_solide.setCollisionByProperty({ estSolide: true });
      Mur_transparent.setCollisionByProperty({ estSolide: false });
  
  
  // ajout d'une collision entre le joueur et le calque plateformes
  this.physics.add.collider(this.player, Invisible_solide ); 
  this.physics.add.collider(this.player, this.Plateforme ); 

   
  
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
    "Il vous reste " + this.vie + " vie(s)",
    {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      fontSize: "22pt",
      fontWeight: "bold"
    }
  ).setOrigin(0);


  this.plateforme_supprime = this.physics.add.sprite(
    2430,
    250,
    "img_plateforme_mobile"
  ); 

  this.plateforme_mobile = this.physics.add.sprite(
    2430,
    400,
    "img_plateforme_mobile"
  ); 

  this.physics.add.collider(this.player, this.plateforme_mobile);

  this.plateforme_supprime.body.allowGravity = false;
  this.plateforme_supprime.body.immovable = true; 
  this.plateforme_supprime.setScale(0.62);

  this.plateforme_mobile.body.allowGravity = false;
  this.plateforme_mobile.body.immovable = true; 
  this.plateforme_mobile.setScale(0.62);


  this.tween_mouvement = this.tweens.add({
    targets: [this.plateforme_mobile],  // on applique le tween sur platefprme_mobile
    paused: true, // de base le tween est en pause
    ease: "Linear",  // concerne la vitesse de mouvement : linéaire ici 
    duration: 5000,  // durée de l'animation pour monter 
    yoyo: true,   // mode yoyo : une fois terminé on "rembobine" le déplacement 
    y: "-=300",   // on va déplacer la plateforme de 300 pixel vers le haut par rapport a sa position
    delay: 0,     // délai avant le début du tween une fois ce dernier activé
    hold: 1000,   // délai avant le yoyo : temps qeu al plate-forme reste en haut
    repeatDelay: 1000, // deléi avant la répétition : temps que la plate-forme reste en bas
    repeat: -1 // répétition infinie 

    
    
  });
    this.porteContactee =false;

    this.porte_retour2 = this.physics.add.sprite(373, 872, "porte_retour2").setDisplaySize(30, 50).setDepth(10);

    this.porte_retour2.body.allowGravity =false;
    


    this.music = this.sound.add('bgniveau4');
    this.musicPlaying = true; // Variable de statut pour suivre si la musique est en cours de lecture


    this.bouton_SoundOn = this.add.image(750, 35, "soundon4").setDepth(1).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_SoundOn.setInteractive();
    this.music.play();
    this.musicPlaying=true;

    this.bouton_SoundOn.on("pointerup", () => {
      if (this.musicPlaying) {
          this.music.stop(); // Arrêter la musique
          this.bouton_SoundOn.setTexture("soundoff4").setDisplaySize(40, 40); // Changer le bouton en Sound Off
          this.musicPlaying = false; // Mettre à jour le statut de la musique
      } else {
          this.music.play(); // Reprendre la musique
          this.bouton_SoundOn.setTexture("soundon4").setDisplaySize(60, 45); // Changer le bouton en Sound On
          this.musicPlaying = true; // Mettre à jour le statut de la musique
      }
  });


  this.bouton_indice4= this.add.image(680, 35, "icone_indice").setDepth(101).setDisplaySize(60, 45).setScrollFactor(0);
  this.bouton_indice4.setInteractive();

  this.bouton_indice4.on("pointerup", () => {
    if (this.nb_aide==0) {
      this.bouton_indice4.setVisible(false);
    this.physics.pause();
    this.image_14=this.add.image(450, 300, "4_indice1").setDepth(101).setDisplaySize(500, 600).setScrollFactor(0);
    this.bouton_retour14= this.add.image(750, 550, "fleche").setDepth(102).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_retour14.setInteractive();
    this.bouton_retour14.on("pointerup", () => {
      this.bouton_indice4.setVisible(true);
    this.image_14.destroy();
    this.nb_aide=1;
    this.physics.resume();
    this.bouton_retour14.destroy();
   });
  }
    if (this.nb_aide==1) {
      this.bouton_indice4.setVisible(false);
      this.physics.pause();
      this.image_24=this.add.image(450, 300, "4_indice2").setDepth(101).setDisplaySize(500, 600).setScrollFactor(0);
    this.bouton_retour24= this.add.image(750, 550, "fleche").setDepth(102).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_retour24.setInteractive();
    this.bouton_retour24.on("pointerup", () => {
      this.bouton_indice4.setVisible(true);
    this.image_24.destroy();
    this.nb_aide=2;
    this.physics.resume();
    this.bouton_retour24.destroy();
  });
    } if (this.nb_aide==2){
      this.bouton_indice4.setVisible(false);
      this.physics.pause();
      this.image_34=this.add.image(450, 300, "4_indice3").setDepth(101).setDisplaySize(500, 600).setScrollFactor(0);
      this.bouton_retour34= this.add.image(750, 550, "fleche").setDepth(102).setDisplaySize(60, 45).setScrollFactor(0);
      this.bouton_retour34.setInteractive();
      this.bouton_retour34.on("pointerup", () => {
        this.bouton_indice4.setVisible(true);
      this.image_34.destroy();
      this.nb_aide=0;
      this.physics.resume();
      this.bouton_retour34.destroy();
    });
    }
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
        this.player.setVelocityY(-250);
      }
 
  
      if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
          if (this.physics.overlap(this.player, this.porte_retour)) {
              console.log("niveau 4 : retour vers selection");
              this.scene.start("fin");
              this.music.stop();
          }
      }
  
  
      if (this.text) {
        this.text.x = this.cameras.main.scrollX + 16;
      this.text.y = this.cameras.main.scrollY + 16;
      }
  
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.plateforme_supprime.x,
        this.plateforme_supprime.y
      );
    
      // Si la distance est inférieure à une certaine valeur, détruire la plateforme
      const distanceLimite = 100; // Définissez la distance limite selon vos besoins
      if (distance < distanceLimite) {
        this.plateforme_supprime.destroy();
      }
    
      // Ajoutez ici le reste de votre logique update
    
      if (this.clavier.space.isDown && this.physics.overlap(this.player, this.levier)) {
        // Si la touche d'espace est enfoncée et que le joueur est en collision avec le levier
        // Activer le levier et déclencher l'action du caillou mobile
        this.levier.active = true;
        this.levier.flipX = true; // on tourne l'image du levier
        this.tween_mouvement.resume();  // on relance le tween
        this.bloquage = false;
      }

      if (this.player.body.blocked.down) {
        var t = this.Plateforme.getTileAtWorldXY(this.player.x, this.player.y+30);
        if (t!=null && t.index == 11076) this.gameOver=true;
        if (t!=null && t.index == 11077) this.gameOver=true;
    }
    
    if (this.gameOver) {
      this.player.setPosition(440, 0);
      this.gameOver = false;
      this.vie=this.vie-1;
      this.text.setText("Il vous reste " + this.vie + " vie(s)");
      this.plateforme_supprime.setPosition(2687, 300);
    }
    
    if (this.vie==0){
      this.vie=10;
      this.scene.start("fin")
      this.music.stop();
    }

    if (this.clavier.space.isDown && this.physics.overlap(this.player, this.porte_retour2)) {
      // Si la porte n'a pas déjà été contactée
      if (!this.porteContactee) {
        // Marquer la porte comme contactée
        this.porteContactee = true;
        // Rediriger vers la scène de sélection
        this.scene.start("commandes");
        this.music.stop();
        this.vie=5;
      }
    } else {
      // Si le joueur n'est plus en collision avec la porte, réinitialiser le marqueur
      this.porteContactee = false;
    }
}
}