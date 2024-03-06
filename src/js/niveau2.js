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
    this.vie = 3;
    this.text = null;
  }
  // mise en place d'une variable groupeCibles
  preload() {
    this.load.image("tuilesdejeu","src/assets/BG_neige.png")
    this.load.image("tuilesdejeu2","src/assets/Tileset_neige.png")
    
    this.load.tilemapTiledJSON("carte","src/assets/map_neige.tmj")
    
    this.load.spritesheet("img_perso", "src/assets/farmer.png", {
      frameWidth: 45,
      frameHeight: 50
    }); 
      // chargement de l'image cible.png
    this.load.image("mammochon", "src/assets/Mammochon.png");  
    this.load.image("flocon", "src/assets/flocon.png");
    this.load.image("farfuret","src/assets/farfuret.png")
    this.load.image('porte', 'src/assets/door3.png');
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

    var mammochons = this.physics.add.group({
      key: 'mammochon',
      repeat: 2,
      setXY: { x: 3200, y: 736, stepX: 128 }
    });

    this.physics.add.collider(mammochons, niveau_neige);
    this.physics.add.overlap(this.player, mammochons, this.chocAvecMammochon, null, this);
    this.projectiles = this.physics.add.group();

    mammochons.children.iterate((mammochon) => {
      mammochon.setVelocityY(Phaser.Math.Between(-100, -150));
      mammochon.setBounce(1);
      mammochon.setCollideWorldBounds(true);

      this.time.addEvent({
        delay: Phaser.Math.Between(4000, 6000),
        callback: () => {
          this.tirerFlocon(mammochon);
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
      farfuret.setVelocityY(Phaser.Math.Between(-100, -150));
      farfuret.setBounce(1);
      farfuret.setCollideWorldBounds(true);

      this.time.addEvent({
        delay: Phaser.Math.Between(4000, 6000),
        callback: () => {
          this.tirerFlocon(farfuret);
        },
        callbackScope: this,
        loop: true,
      });
    });
 // Affichage du nombre de vies
 this.text = this.add.text(
  16,
  320,
  "Il vous reste " + this.vie + " vie(s)",
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
       this.gameOver = true; // Déclenche le game over
     } else if (body.gameObject === this.player && (left || right)) {
       return;
     }
   },
   this
 );

 this.porteContactee =false;

 this.porte_retour = this.physics.add.staticSprite(100, 100, "porte").setDisplaySize(20, 40);

    this.physics.add.collider(this.projectiles, niveau_neige, this.projectileCollision, null, this);
    this.physics.add.collider(this.projectiles, blocs_caches, this.projectileCollision, null, this);
    this.physics.add.collider(this.projectiles, this.player, this.projectileCollisionjoueur, null, this);
  }

  update() {
    if (this.clavier.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play('anim_tourne_droite', true);
    } else if (this.clavier.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play('anim_tourne_gauche', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('anim_face', true)
    }
    if (this.clavier.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-450);
    }

    if (this.gameOver) {
      this.vie--; // Décrémentez le nombre de vies
      this.text.setText("Il vous reste " + this.vie + " vie(s)"); // Mettez à jour le texte affichant le nombre de vies
      if (this.vie <= 0) { // Si le joueur n'a plus qu'une seule vie
        this.scene.start("fin"); // Redirigez vers la scène de fin de jeu

        if (this.vie==0){
          this.vie=4;
          this.scene.start("fin")
        }
      } else {
        this.player.setPosition(100, 450); // Réinitialisez la position du joueur
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
        this.scene.switch("selection");
      }
    }
    } else {
      // Si le joueur n'est plus en collision avec la porte, réinitialiser le marqueur
      this.porteContactee = false;
    }
    if (this.text) {
      this.text.x = this.cameras.main.scrollX + 16;
      this.text.y = this.cameras.main.scrollY + 150;
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
    if (projectile) {
    projectile.setActive(false).setVisible(false);
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("anim_face");
    this.gameOver = true;
    }
  }
  projectileCollision(projectile, layer) {
    if (projectile) {
        projectile.setActive(false).setVisible(false);
    }
    this.physics.world.removeCollider(projectile.body.collider);}
}

