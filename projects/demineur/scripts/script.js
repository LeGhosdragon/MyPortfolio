let sec = 0;
let min = 0;

let timerInterval;

$(document).ready(function () {
  // Pour assurer que first click n'est pas une bombe
  let firstClick = true;
  let nbFlags = 0;
  let nbBombes = 0;

  /**
   * Génère une grille de jeu avec des bombes et des cases.
   *
   * @param {number} nbLignes - Le nombre de lignes de la grille.
   * @param {number} nbColonnes - Le nombre de colonnes de la grille.
   */
  function genererGrille(nbLignes, nbColonnes) {
    nbFlags = 0;
    firstClick = true;
    $(".grille").html("");
    $(".ctn-flag").text("FLAG: " + nbFlags);
    const PIXEL_SIZE = 500; // La grandeur de grille en pixels
    let cellule = $('<div class="box-hov"></div>');
    $(".grille").css({
      gridTemplateColumns: `repeat(${nbColonnes}, 1fr)`,
      margin: "auto",
    });

    nbDeCases = nbLignes * nbColonnes;
    if (nbDeCases === 25) {
      nbBombes = 5;
    } else if (nbDeCases === 100) {
      nbBombes = 30;
    } else if (nbDeCases === 400) {
      nbBombes = 140;
    }
    $(".ctn-bomb").text("BOMB: " + nbBombes);

    // Calculate border size based on the grid size
    let borderSize = Math.max(1, Math.floor(15 / Math.sqrt(nbLignes)));

    for (let i = 0; i < nbLignes; i++) {
      for (let j = 0; j < nbColonnes; j++) {
        let clone = cellule.clone();
        clone.attr("id", "tuile" + i + "-" + j);
        clone.css({
          width: `${PIXEL_SIZE / nbColonnes}px`,
          height: `${PIXEL_SIZE / nbLignes}px`,
          borderWidth: `${borderSize}px`,
        });

        clone.on("click", function () {
          if (firstClick && !clone.hasClass("flag")) {
            ajouterBombes(nbLignes * nbColonnes, i, j);
            ajouterNombres(nbLignes * nbColonnes);
            firstClick = false;
            clone.click();
            clearInterval(timerInterval); // Clear any existing timer
            min = 0;
            sec = 0;
            timerInterval = setInterval(startTimer, 1000);
          }
        });

        clone.on("contextmenu", function (event) {
          event.preventDefault();
          if (!clone.hasClass("box-clicked")) {
            if (clone.text() != "🚩" && !firstClick) {
              clone.text("🚩");
              clone.addClass("flag");
              nbFlags++;
              $(".ctn-flag").text("FLAG: " + nbFlags);
              if (isWin(nbDeCases) && !firstClick) gererWin(nbDeCases);
            } else if (clone.text() == "🚩") {
              clone.text("");
              clone.removeClass("flag");
              nbFlags--;
              $(".ctn-flag").text("FLAG: " + nbFlags);
            }
            clone.css({
              "font-size": 40 - Math.sqrt(nbLignes * nbColonnes) + "px",
              "font-family": "impact", // Change font style
              "font-weight": "bold", // Make the font bold
              "text-align": "center", // Center the text
              "line-height": clone.height() + "px", // Vertically center the text
            });
          }
        });

        $(".grille").append(clone);
      }
    }
  }

  // Fonction pour ajouter les bombes dans la grille
  /**
   * Ajoute des bombes aléatoirement sur une grille de jeu.
   *
   * @param {number} nbDeCases - Le nombre total de cases dans la grille.
   * @param {number} ligne - La ligne initiale où placer la première bombe.
   * @param {number} colonne - La colonne initiale où placer la première bombe.
   *
   * @description Cette fonction place des bombes aléatoirement sur une grille de jeu, en s'assurant qu'il n'y ait pas de doublons.
   * Chaque bombe est représentée par une tuile avec une classe CSS "bombe". Lorsqu'une tuile contenant une bombe est cliquée,
   * elle révèle une bombe et déclenche la fonction `echec`.
   */
  function ajouterBombes(nbDeCases, ligne, colonne) {
    let bombes = [];
    bombes.push(ligne + "," + colonne);

    for (let i = 0; i < nbBombes; i++) {
      let ligne = Math.floor(Math.random() * Math.sqrt(nbDeCases));
      let colonne = Math.floor(Math.random() * Math.sqrt(nbDeCases));

      // Faire en sorte qu'il n'y ait pas de bombes en doublons
      if (!bombes.includes(ligne + "," + colonne)) {
        bombes.push(ligne + "," + colonne);
        let tuile = $("#tuile" + ligne + "-" + colonne);
        tuile.addClass("bombe");

        // Click event to reveal the bomb
        tuile.on("click", function () {
          if (!tuile.hasClass("flag")) {
            tuile.removeClass("box-hov");
            tuile.addClass("box-clicked");
            tuile.css({
              "font-size": 45 - Math.sqrt(nbDeCases) + "px", // Adjust the text size
              "font-family": "impact", // Change font style
              "font-weight": "bold", // Make the font bold
              "text-align": "center", // Center the text
              "line-height": tuile.height() + "px", // Vertically center the text
              "background-color": "red",
            });
            tuile.text("💣"); // Add bomb emoji
            echec(nbDeCases);
          }
        });
      } else {
        i--;
      }
    }
  }

  /**
   * Ajoute des nombres aux tuiles en fonction du nombre de bombes voisines.
   *
   * @param {number} nbDeCases - Le nombre total de cases dans la grille.
   */
  function ajouterNombres(nbDeCases) {
    const gridSize = Math.sqrt(nbDeCases); // Assuming square grid (rows and columns)

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const tuile = $("#tuile" + i + "-" + j);
        if (!tuile.hasClass("bombe")) {
          let nbBombes = 0;
          let voisins = obtenirVoisins(i, j, nbDeCases);
          voisins.forEach((voisin) => {
            let k = voisin[0];
            let l = voisin[1];
            if ($("#tuile" + k + "-" + l).hasClass("bombe")) {
              nbBombes++;
            }
          });

          if (nbBombes > 0) {
            tuile.on("click", function () {
              if (tuile.text() != "🚩") {
                tuile.removeClass("box-hov");
                tuile.addClass("box-clicked");
                tuile.text(nbBombes);
                tuile.css({
                  "font-size": 45 - Math.sqrt(nbDeCases) + "px", // Adjust the text size
                  "font-family": "impact", // Change font style
                  "font-weight": "bold", // Make the font bold
                  "text-align": "center", // Center the text
                  "line-height": tuile.height() + "px", // Vertically center the text
                  "background-color": "white", // Change color on click
                });
                if (isWin(nbDeCases)) gererWin(nbDeCases);
              }
            });

            // Colors the tiles based on the number of surrounding bombs
            if (nbBombes == 1) {
              tuile.css({ color: "blue" });
            } else if (nbBombes == 2) {
              tuile.css({ color: "green" });
            } else if (nbBombes == 3) {
              tuile.css({ color: "red" });
            } else if (nbBombes == 4) {
              tuile.css({ color: "purple" });
            } else if (nbBombes == 5) {
              tuile.css({ color: "maroon" });
            } else if (nbBombes == 6) {
              tuile.css({ color: "turquoise" });
            } else if (nbBombes == 7) {
              tuile.css({ color: "black" });
            } else if (nbBombes == 8) {
              tuile.css({ color: "darkgreen" });
            }
          } else {
            // Si la tuile n'a pas de bombes voisines, on lui donne la class vide
            tuile.addClass("vide");
            tuile.on("click", function () {
              if (tuile.text() != "🚩") {
                tuile.removeClass("box-hov");
                tuile.addClass("box-clicked");
                tuile.css("background-color", "white");
                if (isWin(nbDeCases)) gererWin(nbDeCases);
                obtenirZoneDiffusion(i, j, nbDeCases);
              }
            });
          }
        }
      }
    }
  }

  /**
   * Obtient et traite la zone de diffusion pour une tuile donnée dans une grille.
   *
   * @param {number} ligne - L'index de la ligne de la tuile.
   * @param {number} colonne - L'index de la colonne de la tuile.
   * @param {number} gridSize - La taille de la grille.
   */
  function obtenirZoneDiffusion(ligne, colonne, gridSize) {
    let voisins = obtenirVoisins(ligne, colonne, gridSize);
    voisins.forEach((element) => {
      let tuile = $("#tuile" + element[0] + "-" + element[1]);
      if (!tuile.hasClass("box-clicked") && !tuile.hasClass("flag")) {
        tuile.addClass("box-clicked");
        tuile.click();
      }
    });
  }

  /**
   * Obtient les cellules voisines d'une cellule donnée dans une grille.
   *
   * @param {number} ligne - L'index de la ligne de la cellule.
   * @param {number} colonne - L'index de la colonne de la cellule.
   * @param {number} gridSize - Le nombre total de cellules dans la grille.
   * @returns {Array<Array<number>>} Un tableau des coordonnées des cellules voisines.
   */
  function obtenirVoisins(ligne, colonne, gridSize) {
    let voisins = [];
    if (ligne > 0 && colonne > 0) {
      voisins.push([ligne - 1, colonne - 1]);
    }

    if (ligne > 0) {
      voisins.push([ligne - 1, colonne]);
    }

    if (ligne > 0 && colonne < Math.sqrt(gridSize) - 1) {
      voisins.push([ligne - 1, colonne + 1]);
    }

    if (colonne > 0) {
      voisins.push([ligne, colonne - 1]);
    }

    if (colonne < Math.sqrt(gridSize) - 1) {
      voisins.push([ligne, colonne + 1]);
    }

    if (colonne > 0 && ligne < Math.sqrt(gridSize) - 1) {
      voisins.push([ligne + 1, colonne - 1]);
    }

    if (ligne < Math.sqrt(gridSize) - 1) {
      voisins.push([ligne + 1, colonne]);
    }

    if (ligne < Math.sqrt(gridSize) - 1 && colonne < Math.sqrt(gridSize) - 1) {
      voisins.push([ligne + 1, colonne + 1]);
    }

    return voisins;
  }

  /**
   * Vérifie si le joueur a gagné la partie en vérifiant l'état de toutes les tuiles.
   *
   * @param {number} nbDeCases - Le nombre total de tuiles dans la grille.
   * @returns {boolean} - Retourne true si le joueur a gagné, sinon false.
   */
  function isWin(nbDeCases) {
    const gridSize = Math.sqrt(nbDeCases);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const tuile = $("#tuile" + i + "-" + j);
        if (tuile.hasClass("bombe") && !tuile.hasClass("flag")) {
          return false;
        }
        if (!tuile.hasClass("bombe") && !tuile.hasClass("box-clicked")) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Gère la condition de victoire du jeu en révélant toutes les tuiles et en arrêtant le chronomètre.
   *
   * @param {number} nbDeCases - Le nombre total de tuiles dans la grille.
   *
   * Cette fonction effectue les actions suivantes :
   * - Arrête le chronomètre du jeu.
   * - Parcourt toutes les tuiles de la grille.
   * - Révèle toutes les tuiles qui n'ont pas été cliquées.
   * - Si une tuile contient une bombe, elle change l'apparence de la tuile et affiche une icône de bombe.
   * - Arrête le chronomètre.
   */
  function gererWin(nbDeCases) {
    clearInterval(timerInterval);
    const gridSize = Math.sqrt(nbDeCases);

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const tuile = $("#tuile" + i + "-" + j);
        if (!tuile.hasClass("box-clicked")) {
          tuile.removeClass("box-hov");
          tuile.removeClass("flag");
          tuile.addClass("box-clicked");

          if (tuile.hasClass("bombe")) {
            tuile.css({
              "font-size": 45 - Math.sqrt(nbDeCases) + "px",
              "font-family": "impact",
              "font-weight": "bold",
              "text-align": "center",
              "line-height": tuile.height() + "px",
              "background-color": "green",
            });
            tuile.text("💣");
            tuile.off("click");
          }
        }
      }
    }
    stopTimer();
    //alert("Bravo, vous avez gagné !");
  }

  /**
   * Gère la fin de la partie lorsque le joueur perd.
   * Révèle toutes les tuiles, en marquant les bombes avec un style et une icône spécifiques.
   * Arrête le chronomètre du jeu et empêche toute interaction ultérieure avec les tuiles.
   *
   * @param {number} nbDeCases - Le nombre total de tuiles dans la grille.
   */
  function echec(nbDeCases) {
    clearInterval(timerInterval);
    const gridSize = Math.sqrt(nbDeCases);

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const tuile = $("#tuile" + i + "-" + j);
        if (!tuile.hasClass("box-clicked")) {
          tuile.removeClass("box-hov");
          tuile.addClass("box-clicked");
          if (tuile.hasClass("bombe")) {
            tuile.css({
              "font-size": 45 - Math.sqrt(nbDeCases) + "px",
              "font-family": "impact",
              "font-weight": "bold",
              "text-align": "center",
              "line-height": tuile.height() + "px",
              "background-color": "red",
            });
            tuile.text("💣");
            tuile.off("click").click();
          }
        }
      }
    }
    stopTimer();
    //alert("Vous avez perdu !");
  }

  //Commence le timer affiché lorsqu'appelé
  function startTimer() {
    sec++;
    if (sec == 60) {
      sec = 0;
      min++;
    }
    montrerTimer();
  }
  //Arrête le timer affiché lorsqu'appelé
  function stopTimer() {
    clearInterval(timerInterval);
    montrerTimer();
  }
  //Mets le timer à 0 lorsqu'appelé
  function resetTimer() {
    stopTimer();
    min = 0;
    sec = 0;
    montrerTimer();
  }
  //Affiche le timer updaté lorsqu'appelé
  function montrerTimer() {
    if (min < 10) {
      $("#min").text("0" + min + ":");
    } else {
      $("#min").text(min + ":");
    }
    if (sec < 10) {
      $("#sec").text("0" + sec);
    } else {
      $("#sec").text(sec);
    }
  }

  $("[id*=btn-difficulte]").hide();
  $(".grille").hide();
  $(".ctn-display-box").hide();

  $("#btn-play").click(function () {
    $("#btn-play").hide();
    $("[id*=btn-difficulte]").show();
  });

  $("[id*=btn-difficulte]").click(function () {
    resetTimer();
    if ($(this).attr("id") == "btn-difficulte1") {
      genererGrille(5, 5);
    } else if ($(this).attr("id") == "btn-difficulte2") {
      genererGrille(10, 10);
    } else if ($(this).attr("id") == "btn-difficulte3") {
      genererGrille(20, 20);
    }
    nbFlags = 0;

    $("[id*=btn-difficulte]").css({
      background: "lightgray",
      "font-size": "2em",
      "margin-top": "2%",
      width: "30%",
      height: "10%",
      "font-weight": "bold",
    });

    $(".grille").css({
      "margin-left": "auto",
      "margin-right": "auto",
      "margin-top": "18vh",
      position: "absolute",
    });

    $(".grille").show();
    $(".ctn-display-box").show();
  });
});
