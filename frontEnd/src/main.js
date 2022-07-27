import { Allies } from "./class.js";
import {
  randomNumber,
  generateEnemy,
  changeMessageStatus,
  isItNullOrUndefined,
  addMonsterInDeadZone,
  clearDeadZone
} from "./generate.js";
import { Menu } from './Menu.js';
import { FightingSurfaceApi } from './FightingSurfaceApi.js';


//Gere le tour true = joueur, false = enemy
let actualTurn = true;
//Permet de gerer l'appuie sur le bouton attack
let canAttack = true;
//Gestion special
let howMuchAttack = 0;
let special = false;
//Les entités
let hero = null;
let actualEnemy;
const enemiesList = await FightingSurfaceApi.getAllMonsters();
// Score joueur
let playerScore = 0;

/**
 * SELECTEUR DE BASES
 */
let game = document.querySelector('.game');
let overlay = document.querySelector('.overlay');
let menu = document.querySelector('.menu');

let newEnemy = document.querySelector(".enemies-generator");
let arrowSelector = document.querySelector(".turn-arrow > img");
let attackBtn = document.querySelector(".attack-js");
let specialBtn = document.querySelector(".special-js");

//Lancement du jeux
beginTheGame();


console.log(await FightingSurfaceApi.getAllMonsters());




/**
 * ! SUITE
 * TODO: Crée un menu en HTML/CSS contenant Jouer - Scores - Crédit et faite les TODO
 */
 game.classList.toggle('disable');
 let menuObj = new Menu(game, overlay, menu);
 menuObj.menuBase();

/**
 * ! SUITE
 * TODO: Evenement pour gerer le bouton play du menu
 * * 1 - Fait disparaitre le menu et apparaitre le jeux
 */

/**
 * ! SUITE
 * TODO: Evenement pour gerer le bouton highscore du menu
 * * 1 - Fait disparaitre le menu et apparaitre le tableau
 */

/**
 * ! SUITE
 * TODO: Evenement pour gerer le bouton crédit du menu
 * * 1 - Fait disparaitre le menu et apparaitre le crédit
 */

/**
 * TODO: Evenement qui lance un combat
 * * 1 - Generer un adversaire - change le message barre status
 * * 2 - Changer le status en round lancer
 * * 3 - Tirer aléatoirement le tour (joueur ou adv)
 */

/**
 * 
 *  TODO: Ce code à un soucis - fait en sorte d'attaquer dans le if (verification null undefined)
 *  TODO: Evenement qui gère l'attaque
 */
attackBtn.addEventListener("click", function () {

  if (actualTurn === true && hero.isDead() === false && canAttack === true) {
    canAttack = false;
  
    changeColorSpecial();
    if (actualEnemy === null || actualEnemy === undefined) {
    } else {
      hero.attack(actualEnemy);
      //Changin color of btn
      removeOrAddAttack();
      changeArrowDirection()
      howMuchAttack++;
      special = checkSpecial(howMuchAttack);
    }

    setTimeout(function () {
      console.log(playerScore);
      actualEnemy.attack(hero);
      if (actualEnemy.isDead() === false && hero.isDead() === false) {
      changeArrowDirection("allies");
      changeColorSpecial();
      } else if (actualEnemy.isDead() === true) {
        hero.healByVictory();
        addMonsterInDeadZone(actualEnemy);
        playerScore += parseInt(actualEnemy.score);
        actualEnemy = generateEnemy(enemiesList);
        newRound();

      } else if(hero.isDead()){
        game.classList.toggle('disable');
        menuObj.overlayZoomOut();
        changeMessageStatus(`Votre score est de : ${playerScore} Voulez-vous le poster ?`);
        menuObj.menuPostScore(playerScore);
        actualEnemy.displayBtn();
        clearDeadZone();
        beginTheGame();
      }
      canAttack = true;

    }, 2000);

  } else {
    console.log("vous ne pouvez pas attaquer")

  }
});

/**
 * TODO: Evenement qui gère le spécial
 *
 */
specialBtn.addEventListener("click", function () {
  if(special === true){
    if (actualTurn === true && hero.isDead() === false && canAttack === true) {
      canAttack = false;
      hero.specialAttack(actualEnemy);
      howMuchAttack = 0;
      changeArrowDirection();
      special = false;
    }
  
    setTimeout(function () {
      
      if (actualEnemy.isDead() === false && hero.isDead() === false) {
        actualEnemy.attack(hero);
        changeArrowDirection("allies");
        
      } else if (actualEnemy.isDead() === true) {
        hero.healByVictory();
        addMonsterInDeadZone(actualEnemy);
        playerScore += parseInt(actualEnemy.score);
        actualEnemy = generateEnemy(enemiesList);
        newRound();

      } else if(hero.isDead()){
        game.classList.toggle('disable');
        menuObj.overlayZoomOut();
        changeMessageStatus(`Votre score est de : ${playerScore} Voulez-vous le poster ?`);
        menuObj.menuPostScore(playerScore);
        actualEnemy.displayBtn();
        clearDeadZone();
        beginTheGame();
      }
      canAttack = true;
    }, 2000);
  
  }else{
    changeMessageStatus("Le spécial n'est pas encore prêt !")
  }

});
/**
 * TODO: Evènement qui ajoute un enemy et lance une manche 
 */
newEnemy.addEventListener("click", function () {
  try {
    //1
    actualEnemy = generateEnemy(enemiesList);

    //
    newRound();
  } catch (error) {
    console.error(`Une erreur est survenue ${error}`);
    console.log(error);
  }
});

/**
 * TODO : Instanciation du héros, ICI démarre le JEUX 
 */
function beginTheGame() {
  //*Le bug ce trouve ici, il manquais un argument, le chemin vers l'image
  //*Le code pourrait être améliorer, il y a des soucis dans l'organisation selon moi
  playerScore = 0;
  hero = new Allies("Jeanjean", 100, 60, 3, "");
  hero.statusInit();

  
}
/**
 * TODO: Permet de mettre ou retirer la possibilité d'attaquer
 * @param {String} action
 */
function removeOrAddAttack(action = "", special = false) {
  if (action === "add") {
    attackBtn.classList.add("is-error");
    attackBtn.classList.remove("is-disabled");
  } else {
    attackBtn.classList.remove("is-error");
    attackBtn.classList.add("is-disabled");
  }
  if (special === true) {
    specialBtn.classList.add("is-primary");
    specialBtn.classList.remove("is-disabled");
  } else {
    specialBtn.classList.remove("is-primary");
    specialBtn.classList.add("is-disabled");
  }
}

/**
 * TODO: fonction qui change la fleche de direction
 * *   Prend une direction en argument
 * *   La fleche tourne lentement vers l'ennemis
 * @param { STRING }
 * @return { VOID }
 */

function changeArrowDirection(direction = "") {
  if (direction === "allies") {
    if(arrowSelector.classList.contains("quick-allies-turn")){
    arrowSelector.classList.add("allies-turn");
    arrowSelector.classList.remove("quick-allies-turn");

    }else{
      arrowSelector.classList.add("allies-turn");

      arrowSelector.classList.remove("quick-allies-turn");
    }
    arrowSelector.classList.remove("quick-enemy-turn");
    arrowSelector.classList.remove("enemy-turn");

  } else {
    arrowSelector.classList.add("enemy-turn");
    arrowSelector.classList.remove("quick-allies-turn");
    arrowSelector.classList.remove("allies-turn");

    arrowSelector.classList.remove("quick-enemy-turn");
  }
}
/**
 * TODO: fonction qui change la fleche de direction démarrage du jeux ou d'un round
 * *    Selon un nombre aléatoire définis qui commence
 * *
 */
function newRound() {
  
  let rand = randomNumber();
  rand = 49;
  if (rand <= 50) {
    changeMessageStatus("c'est vous qui commencer");
    changeArrowDirection("allies");
    //Changin color of btn
    changeColorSpecial();

  } else {
    changeMessageStatus("c'est l'ennemis qui commence");
    changeArrowDirection();
    setTimeout(function () {
      actualEnemy.attack(hero);
    changeArrowDirection("allies");
    changeColorSpecial() ;
    },3000);
    
  }
}

/**
 * TODO: Fonction/méthode qui vérifie si le joueur à un special graçe au compteur d'attaque
 * @param { Number } 
 * @return { Boolean }
 */
function checkSpecial(attackCount) {
  if (attackCount >= 3) {
    return true;
  } else {
    return false;
  }
}

/**
 * TODO: Fonction qui active ou non le btn special
 * @return { VOID }
 */
function changeColorSpecial() {
  if (checkSpecial(howMuchAttack)) {
    removeOrAddAttack("add", true);
  } else {
    removeOrAddAttack("add");

  }
}

/**
 * Mettre en place un pierre feuille sciseaux, 
 */