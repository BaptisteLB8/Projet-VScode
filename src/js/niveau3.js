
export default class niveau3 extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "niveau3" //  ici on précise le nom de la classe en tant qu'identifiant
    });
    this.player = null;
    this.groupe_plateformes = null;
    this.clavier = null;
  }
    
  preload() {
    this.load.image("tuilesdejeu","src/assets/tuiles.png")
    this.load.image("tuilesdejeu2","src/assets/ground.png")
    this.load.image("tuilesdejeu3","src/assets/nuit.jpg")
    this.load.tilemapTiledJSON("carte","src/assets/map_niveau3.tmj");

    this.load.spritesheet("img_perso", "src/assets/farmer.png", {
      frameWidth: 45,
      frameHeight: 50
    }); 
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
      frames: this.anims.generateFrameNumbers("img_perso", { start:6 , end: 8 }), // on prend toutes les frames de img perso numerotées de 0 à 3
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
    const Solide_premier_plan = map.createLayer("Solide_premier_plan", [ts1, ts2, ts3]);
    const Decoration = map.createLayer("Decoration", [ts1, ts2, ts3]);
    


Transparent_solide.setCollisionByProperty({ estSolide: true }); 
Pas_solide.setCollisionByProperty({ estSolide: false }); 
Solide_premier_plan.setCollisionByProperty({ estSolide : true});
Decoration.setCollisionByProperty({ estSolide : false});
Background.setCollisionByProperty({ estSolide : false});
Sol.setCollisionByProperty({ estSolide : true});



// ajout d'une collision entre le joueur et le calque plateformes
this.physics.add.collider(this.player, Solide_premier_plan ); 
this.physics.add.collider(this.player, Transparent_solide ); 
this.physics.add.collider(this.player, Sol ); 


// redimentionnement du monde avec les dimensions calculées via tiled
this.physics.world.setBounds(0, 0, 3600, 768);
//  ajout du champs de la caméra de taille identique à celle du monde
this.cameras.main.setBounds(0, 0, 3600, 768);
// ancrage de la caméra sur le joueur
this.cameras.main.startFollow(this.player);

this.groupe_plateformes = this.physics.add.staticGroup();
player.body.world.on(
  "worldbounds", // evenement surveillé
  function (body, up, down, left, right) {
    // on verifie si la hitbox qui est rentrée en collision est celle du player,
    // et si la collision a eu lieu sur le bord inférieur du player
    if (body.gameObject === player && down == true) {
      // si oui : GAME OVER on arrete la physique et on colorie le personnage en rouge
      this.physics.pause();
      player.setTint(0xff0000);
    }
  },
  this
); 
    
      
  }

  update() {
    if (this.clavier.right.isDown) {
    this.player.setVelocityX(160);
    this.player.anims.play('anim_tourne_droite', true); 
  } 
  else if ( this.clavier.left.isDown) {
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
        console.log("niveau 3 : retour vers selection");
        this.scene.switch("selection");
      }
    }
  }
}
