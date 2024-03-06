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
    this.grossissement = 0.7;
    this.levier = null; 
    this.tween_mouvement = null;
    this.bloquage=true;
    this.fleche=null;
    this.groupeBullets=null; 
    this.aide=0;
  }

  preload() {
    this.load.image("Phaser_tuilesdejeu", "src/assets/Tuile.png");
    this.load.tilemapTiledJSON("cartes", "src/assets/Mapforet.json");
    this.load.spritesheet("img_perso", "src/assets/farmer.png", {frameWidth: 45,frameHeight: 50});
    this.load.image('porte', 'src/assets/door3.png');
    this.load.image('caillou', 'src/assets/cayu2.png');
    this.load.image("img_levier", "src/assets/levier.png");
    this.load.image("bullet", "src/assets/fleche.png"); 
    this.load.image("mzelda", "src/assets/mzelda.png");  
    this.load.audio('bgniveau1', 'src/assets/niveau1.mp3');
    this.load.image('soundon1', 'src/assets/SoundOn2.png'); 
    this.load.image('soundoff1', 'src/assets/SoundOff2.png'); 
    this.load.image('clue1', 'src/assets/indicen.png'); 

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

    const grossisment =0.7;
    this.player = this.physics.add.sprite(0, 0, 'img_perso');
    this.player.setDepth(100);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, calque_plateformes);
    this.player.setBounce(0.2);
    this.player.setScale(grossisment);
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

    var mzelda = this.physics.add.group({
      key: 'mzelda',
      repeat: 2,
      setXY: { x: 720, y: 250, stepX: 80 }
    });
      // Ajuster la taille de l'image de mzelda
      mzelda.children.iterate((child) => {
        child.setScale(0.07); // Réglez la valeur de l'échelle selon vos besoins
    });
    this.physics.add.collider(mzelda, calque_plateformes);
    this.physics.add.collider(this.player, mzelda, this.chocAvecmzelda, null, this);
    this.projectiles = this.physics.add.group();

    mzelda.children.iterate((mzelda) => {
      mzelda.setVelocityY(Phaser.Math.Between(-100, -50));
      mzelda.setBounce(1);
      mzelda.setCollideWorldBounds(true);
    });


    // Affichage du nombre de vies
    this.text = this.add.text(
      16,
      160,
      "Il vous reste " + this.vie + " vie(s)",
      {
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        fontSize: "22pt",
        fontWeight: "bold"
      }
    ).setOrigin(0).setScrollFactor(0);

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

    this.porte_retour = this.physics.add.staticSprite(990, 110, "porte").setDisplaySize(20, 40);
    var caillou_mobile = this.physics.add.sprite(
      993,
      107,
      "caillou"
    ); 
    caillou_mobile.setScale(0.15);
    caillou_mobile.body.allowGravity = false;
    caillou_mobile.body.immovable = true; 
    this.tween_mouvement = this.tweens.add({
      targets: [caillou_mobile],  // on applique le tween sur platefprme_mobile
      paused: true, // de base le tween est en pause
      ease: "Linear",  // concerne la vitesse de mouvement : linéaire ici 
      duration: 2000,  // durée de l'animation pour monter 
      yoyo: false,   // mode yoyo : une fois terminé on "rembobine" le déplacement 
      y: "-=300",   // on va déplacer la plateforme de 300 pixel vers le haut par rapport a sa position
      delay: -1,     // délai avant le début du tween une fois ce dernier activé
      hold: 10000000,   // délai avant le yoyo : temps qeu al plate-forme reste en haut
      repeatDelay: -1, // deléi avant la répétition : temps que la plate-forme reste en bas
      repeat: 0 // répétition infinie 
    });
    this.levier = this.physics.add.staticSprite(1550, 270, "img_levier").setScale(0.6);
    this.levier.active = false;

    // A l'intérieur de la méthode create()
this.fleche = this.input.keyboard.addKey('A'); // Correction: utilisez this pour référencer fleche
this.groupeBullets = this.physics.add.group(); // Correction: utilisez this pour référencer groupeBullets
// A l'intérieur de la méthode create()
this.physics.add.collider(this.groupeBullets, calque_plateformes, function(bullet, platform) {
  bullet.destroy(); // Détruisez la balle lorsqu'elle entre en collision avec une plateforme
});
this.physics.add.collider(this.groupeBullets, mzelda, this.collisionFlecheMzelda, null, this);

this.music = this.sound.add('bgniveau1');

    this.bouton_SoundOn1 = this.add.image(750, 180, "soundon1").setDepth(1).setDisplaySize(60, 45).setScrollFactor(0);
    this.bouton_SoundOn1.setInteractive();
    this.music.play();
    this.musicPlaying=true;

    this.bouton_SoundOn1.on("pointerup", () => {
      if (this.musicPlaying) {
          this.music.stop(); // Arrêter la musique
          this.bouton_SoundOn1.setTexture("soundoff1").setDisplaySize(40, 40); // Changer le bouton en Sound Off
          this.musicPlaying = false; // Mettre à jour le statut de la musique
      } else {
          this.music.play(); // Reprendre la musique
          this.bouton_SoundOn1.setTexture("soundon1").setDisplaySize(60, 45); // Changer le bouton en Sound On
          this.musicPlaying = true; // Mettre à jour le statut de la musique
      }
  });
  this.bouton_indice1 = this.add.image(700, 180, "clue1").setDepth(1).setDisplaySize(60, 45).setScrollFactor(0);
  this.bouton_indice1.setInteractive();
  this.bouton_indice1.on("pointerup", () => {
    if (this.aide==0){
      window.alert("Indice 1");
      aide=aide+1;
    }
    if (this.aide==1){
      window.alert("Indice 2");
      aide=aide+1;
    }
    
  });

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
      this.player.setVelocityY(-250);
    }

    if (this.gameOver) {
      this.vie--; // Décrémentez le nombre de vies
      this.text.setText("Il vous reste " + this.vie + " vie(s)"); // Mettez à jour le texte affichant le nombre de vies
      if (this.levier.flipX = true){
        this.levier.active = false;
        this.levier.flipX = false; // on tourne l'image du levier
        this.tween_mouvement.stop();  // on relance le tween
        this.bloquage=true;
        var caillou_mobile = this.physics.add.sprite(
          993,
          107,
          "caillou"
        ); 
        caillou_mobile.setScale(0.15);
        caillou_mobile.body.allowGravity = false;
        caillou_mobile.body.immovable = true; }



      if (this.vie <= 0) { // Si le joueur n'a plus qu'une seule vie
        this.scene.start("fin"); // Redirigez vers la scène de fin de jeu

        if (this.vie==0){
          this.vie=4;
          this.scene.start("fin")
        }
      } else {
        this.player.setPosition(0, 0); // Réinitialisez la position du joueur
        this.physics.resume(); // Reprenez la simulation physique
        this.player.clearTint(); // Effacez la couleur rouge
        this.gameOver = false; // Réinitialisez la variable gameOver
      }
    }

    if (this.clavier.space.isDown && this.physics.overlap(this.player, this.porte_retour)) {
      if (this.bloquage==false){
      // Si la porte n'a pas déjà été contactée
      if (!this.porteContactee) {
        // Marquer la porte comme contactée
        this.porteContactee = true;
        // Rediriger vers la scène de sélection
        this.scene.switch("niveau3");
        this.affichage=1;
        this.music.stop();
      }
    }
    } else {
      // Si le joueur n'est plus en collision avec la porte, réinitialiser le marqueur
      this.porteContactee = false;
    }
    if (this.clavier.space.isDown && this.physics.overlap(this.player, this.levier)) {
      // Si la touche d'espace est enfoncée et que le joueur est en collision avec le levier
      // Activer le levier et déclencher l'action du caillou mobile
      this.levier.active = true;
        this.levier.flipX = true; // on tourne l'image du levier
        this.tween_mouvement.resume();  // on relance le tween
        this.bloquage=false;
      
    } 

// A l'intérieur de la méthode update()
if (Phaser.Input.Keyboard.JustDown(this.fleche)) { // Correction: utilisez this.fleche
  this.tirer(this.player); // Correction: utilisez this.tirer
}
  }
tirer(player) {
  var bullet = this.groupeBullets.create(player.x, player.y - 10, 'bullet');
  bullet.setCollideWorldBounds(true);
  bullet.body.allowGravity = true;
  bullet.body.gravity.y = 1000;
  var coefDir;
  if (player.body.velocity.x < 0) {
      coefDir = -1;
  } else {
      coefDir = 1;
  }

  bullet.setScale(0.05); // Réduire la taille de la flèche selon vos besoins

  bullet.setVelocity(300 * coefDir, -400);
}

chocAvecmzelda(player, mzelda){
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play("anim_face");
  this.gameOver = true;
  mzelda.setVelocityY(Phaser.Math.Between(-100, 50));
}

// Ajoutez la fonction de collision
collisionFlecheMzelda(bullet, mzelda) {
  bullet.destroy(); // Détruisez la flèche
  mzelda.destroy(); // Détruisez Mzelda


  
}

}


