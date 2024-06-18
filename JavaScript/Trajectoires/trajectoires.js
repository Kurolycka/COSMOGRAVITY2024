
/*Ce fichier est appelé pour s'occuper du changement des bouttons (observateur,spationaute,
trajectoire_simple, trajectoire_complete,rebond) quand on clique dessus*/

/**
 * Fonction appelé pour eviter le bug d'actualisation du bouton rebond entre 2 rafraichissements.
 */
function init_rebond()
{
  document.getElementById("rebondd").className = "myButton2";
  document.getElementById("boutton_ammorti").value = "0";
}

/**
 * Fonction qui est appellé quand on appuie sur trajectoire Complete, elle change le style 
 * du bouton trajectoire simple et le bouton trajectoire complete.
 */
function pressionBouttonTrajectoireComplete() 
{
  //on verifie d'abord le style du bouton
  if (document.getElementById("r1").className == "myButton2") 
  {
    //On change le style des deux boutons 
    document.getElementById("r1").className = "myButton"; //trajectoire complete
    document.getElementById("r2").className = "myButton2"; //trajectoire simple
  }
}

/**
 * Fonction qui est appellé quand on appuie sur trajectoire simple, elle change le style 
 * du bouton Trajectoire simple et le bouton Trajectoire complete.
 */
function pressionBouttonTrajectoireSimple() 
{
  //on verifie d'abord le style du bouton
  if (document.getElementById("r2").className == "myButton2") 
  {
    //On change le style des deux boutons 
    document.getElementById("r2").className = "myButton";//trajectoire simple
    document.getElementById("r1").className = "myButton2";//trajectoire complete
  }
}

/**
 * Fonction qui est appellé quand on appuie sur rebond, pour changer son style. 
 */
function changerBouttonRebond() 
{
  //on verifie d'abord le style du bouton puis on le change
  if (document.getElementById("rebondd").className == "myButton2") 
  {
    document.getElementById("rebondd").className = "myButton";
  } 
  else 
  {
    document.getElementById("rebondd").className = "myButton2";
  }
}

/**
 * Fonction qui est appellé quand on appuie sur observateur, elle change le style 
 * du bouton observateur et le bouton spationaute.
 */
function pressionBouttonObservateur() 
{
  //on verifie d'abord le style du bouton
  if (document.getElementById("r3").className == "myButton2") 
  {
    //On change le style des deux boutons 
    document.getElementById("r3").className = "myButton";//observateur
    document.getElementById("r4").className = "myButton2";//spationaute
  }
}

/**
 * Fonction qui est appellé quand on appuie sur spationaute, elle change le style 
 * du bouton observateur et le bouton spationaute.
 */
function pressionBouttonMobile() 
{
  //on verifie d'abord le style du bouton
  if (document.getElementById("r4").className == "myButton2") 
  {
    //On change le style des deux boutons 
    document.getElementById("r4").className = "myButton";//spationaute
    document.getElementById("r3").className = "myButton2";//observateur
  }
}

/**
 * Fonction associée à rebond qui fait afficher la barre du coefficient d'amortissement.
 */
function ammort() 
{
  //verifier si la barre n'est pas affichée
  if (document.getElementById("boutton_ammorti").value == "0") 
  {
    document.getElementById("boutton_ammorti").value = "1"; //on stocke la valeur à 1 pour savoir que c'est affiché à present
    document.getElementById("barre_reb").style.display = "block"; //on l'affiche
    document.getElementById('ammorti').innerHTML=document.getElementById("reb").value; //on met à jour la valeur

  } 
  //Si la barre est affichée
  else {
    document.getElementById("boutton_ammorti").value = "0";//on stocke la valeur à 0 pour savoir que ce n'est pas affiché à present
    document.getElementById("barre_reb").style.display = "none"; //on le cache
  
  }
}

/**
 * Fonction associée à rebond qui active le robond pour photon.
 */
function ammort_photon() {
  //verifier si la barre n'est pas affichée
  if (document.getElementById("boutton_ammorti").value == "0") 
  {
    document.getElementById("boutton_ammorti").value = "1";//on met la valeur à 1 pour savoir que c'est affiché
  } 
  else 
  {
    document.getElementById("boutton_ammorti").value = "0"; //on stocke la valeur à 1 pour savoir que c'est affiché
  }
}


/**
 * Fonctiion qui s'occupe de l'actualisation de la valeur sélectionnée du 
 * coefficient d'amortissement pour visuel avec chiffre.
 * @param {*} val : valeur avec la quelle on va mettre à jour la barre.
 */
function ammortUpdate(val)
{
  document.getElementById('ammorti').innerHTML=val/100; //on met à jour la valeur
}
