// chargement des librairies

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/

// configuration générale du jeu
var config = {
    type: Phaser.AUTO,
    width: 800, // largeur en pixels
    height: 600, // hauteur en pixels
    physics: {
      // définition des parametres physiques
      default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
      arcade: {
        // parametres du mode arcade
        gravity: {
          y: 300 // gravité verticale : acceleration ddes corps en pixels par seconde
        },
        debug: false // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
      }
    },
    scene: {
      // une scene est un écran de jeu. Pour fonctionner il lui faut 3 fonctions  : create, preload, update
      preload: preload, // la phase preload est associée à la fonction preload, du meme nom (on aurait pu avoir un autre nom)
      create: create, // la phase create est associée à la fonction create, du meme nom (on aurait pu avoir un autre nom)
      update: update // la phase update est associée à la fonction update, du meme nom (on aurait pu avoir un autre nom)
    }
  };
  
  var groupe_plateformes; 
  var player; // désigne le sprite du joueur 
  var clavier; 
  var groupe_etoiles; // contient tous les sprite etoiles 
  var score = 0;
  var zone_texte_score; 
  var groupe_bombes; 
  var gameOver = false; 
  
  // création et lancement du jeu
  new Phaser.Game(config);
  
  
  /***********************************************************************/
  /** FONCTION PRELOAD 
  /***********************************************************************/
  
  /** La fonction preload est appelée une et une seule fois,
   * lors du chargement de la scene dans le jeu.
   * On y trouve surtout le chargement des assets (images, son ..)
   */
  function preload() {
    this.load.spritesheet("img_perso", "src/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    }); 
    // chargement tuiles de jeu
  this.load.image("Phaser_tuilesdejeu", "src/assets/tuilesJeu.png");
  
  // chargement de la carte
  this.load.tilemapTiledJSON("carte", "src/assets/map.tmj"); 
  }
  
  /***********************************************************************/
  /** FONCTION CREATE 
  /***********************************************************************/
  
  /* La fonction create est appelée lors du lancement de la scene
   * si on relance la scene, elle sera appelée a nouveau
   * on y trouve toutes les instructions permettant de créer la scene
   * placement des peronnages, des sprites, des platesformes, création des animations
   * ainsi que toutes les instructions permettant de planifier des evenements
   */
  function create() {
  
    player = this.physics.add.sprite(100, 450, 'img_perso'); 
    player.setDepth(100);
    player.setCollideWorldBounds(true); 
    this.physics.add.collider(player, groupe_plateformes); 
    player.setBounce(0.2); 
    clavier = this.input.keyboard.createCursorKeys(); 
  
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
  
  
    // chargement de la carte
  const carteDuNiveau = this.add.tilemap("carte");
  
  // chargement du jeu de tuiles
  const tileset = carteDuNiveau.addTilesetImage(
            "tuiles_de_jeu",
            "Phaser_tuilesdejeu"
          );  
  
  // chargement du calque calque_background
  const calque_background = carteDuNiveau.createLayer(
    "calque_background",
    tileset
  );
  
  // chargement du calque calque_background_2
  const calque_background_2 = carteDuNiveau.createLayer(
    " calque_background_2",
    tileset
  );
  
  // chargement du calque calque_plateformes
  const calque_plateformes = carteDuNiveau.createLayer(
    "calque_plateforme",
    tileset
  );  
  // définition des tuiles de plateformes qui sont solides
  // utilisation de la propriété estSolide
  calque_plateformes.setCollisionByProperty({ estSolide: true }); 
  
  // ajout d'une collision entre le joueur et le calque plateformes
  this.physics.add.collider(player, calque_plateformes); 
  
  // redimentionnement du monde avec les dimensions calculées via tiled
  this.physics.world.setBounds(0, 0, 3200, 640);
  //  ajout du champs de la caméra de taille identique à celle du monde
  this.cameras.main.setBounds(0, 0, 3200, 640);
  // ancrage de la caméra sur le joueur
  this.cameras.main.startFollow(player);  
  }
  
  
  /***********************************************************************/
  /** FONCTION UPDATE 
  /***********************************************************************/
  
  function update() {
    if (clavier.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('anim_tourne_droite', true); 
    } 
    else if ( clavier.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('anim_tourne_gauche', true); 
    } else {
      player.setVelocityX(0);
      player.anims.play('anim_face', true)
    } 
    if (clavier.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-320);
    }  
   if (gameOver) {
    return;
  } 
  }
  