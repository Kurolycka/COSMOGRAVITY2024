//----------------------------------------------------{testnum}----------------------------------------------------

/**
 * Fonction qui sert à trouver la puissance de 10 nécessaire (entre -30 et 29) pour écrire le paramètre en écriture scientifique.
 * @param {number} a : Nombre dont on cherche la puissance de 10 à laquelle il est. 
 * @returns la puissance de 10 de a : un seul nombre entre -30 et 29. 
 */
function testnum(a){
    for (var i = -30; i<30; i++){
        resu = a/(10**i);
        if (resu>=1 && resu <=10){
            z=i;
            return z;
        }
    }
}

//----------------------------------------------------{testvaleur}----------------------------------------------------

/**
 * Fonction qui sert à retourner "Not a Number!" si la variable passée en paramètre n'est pas un nombre et sinon retourne le nombre. 
 * @param {*} x variable dont on veut vérifier si le type est un nombre.
 * @returns la chaîne de caractère "Not a Number" ou la variable qui est alors un number.
 */
function testvaleur(x) {
	if (isNaN(x)) {
		return 'Not a Number!';
	}
	return x ;
}

//----------------------------------------------------{siTrajectoireSimple}----------------------------------------------------

/** 
 * Fonction qui appelle les fonction majFondFixe() et creations_blocs(context) puis fixe le diamètre de la particule à 2 si l'utilisateur a choisi une trajectoire simple au lieu de complète. C
 * Cela permet de faire en sorte que seule la position de la particule à l'instant t apparaissent sur le canva et pas ses précédentes positions.
 */
function siTrajectoireSimple() {
	if (element.value == 'simple') {
		majFondFixe();
		creation_blocs(context);
		diametre_particule = DIAMETRE_PART*2;
	}
}

//----------------------------------------------------{siTrajectoireComplete}----------------------------------------------------

/**
 * Fonction qui permet d'avoir le diamètre de la particule/mobile à 1 lorsque l'utilisateur choisit d'avoir une trajectoire complète. 
 */
function siTrajectoireComplete() {
	if (element.value == 'complete') {
		diametre_particule = DIAMETRE_PART;
	}
}


//----------------------------------------------------{traceEstAbsent}----------------------------------------------------

/**
 * Fonction qui fixe la valeur de l'élément d'ID "trace_present" à 0, cela permet de déclarer qu'aucune trajectoire n'a encore été tracée. 
 */
function traceEstAbsent(){
	document.getElementById('trace_present').value="0";
}

//----------------------------------------------------{estUnMobile}----------------------------------------------------

/**
 * Fonction qui vérifie si la largeur de l'écran est inférieure ou égale à 960 pixels et ajuste la visibilité (cachée ou non) d'un élément HTML avec l'ID "bouton_info" en conséquence. 
 * Si l'écran fait moins ou égal à 960 pixels alors l'élement sera caché et sinon il sera visible.
 */
function estUnMobile(){
	var x = window.matchMedia("(max-width: 960px)")
	if(x.matches){
		document.getElementById("bouton_info").style.visibility='hidden';
	}
	else{
		document.getElementById("bouton_info").style.visibility='visible';
	}
}

//----------------------------------------------------{generateurCouleur}----------------------------------------------------

/**
 * Fonction qui génère aléatoirement une couleur pour le tracé du mobile.
 * Elle est faites de manière à ce que seulement des couleurs foncées soient générées.
 * @returns une liste avec les codes rgb (rouge, vert et bleu) en Number pour générer une couleur. [redd, greenn, bluee]
 */
function generateurCouleur(){
	redd=Math.floor(Math.random() * 255); 
	greenn=Math.floor(Math.random() * 255); 
	bluee=Math.floor(Math.random() * 255); 
	if (0.3*redd+0.59*greenn+0.11*bluee>=100){ //teste pour mettre que des couleurs foncer
		cool=generateurCouleur()
		redd=cool[0]
		greenn=cool[1]
		bluee=cool[2]
	}
	return [redd,greenn,bluee];
}

//----------------------------------------------------{boutonAvantLancement}----------------------------------------------------

/**
 * Fonction qui gère et initialise les différents boutons de la simulation avant le début de cette simulation (comme les boutons pour accélérer et zoomer par exemple).
 */
function boutonAvantLancement(){
    //Gestion de l'accélération/décélération de la simu
    document.getElementById("panneau_mobile").style.visibility='visible';
    
    // Gestion des bouttons Zoom moins
    document.getElementById("panneau_mobile2").style.visibility='visible';
    
    document.getElementById('moinszoom').addEventListener('click',foncPourZoomMoinsAvantLancement, false);
    document.getElementById('pluszoom').addEventListener('click',foncPourZoomPlusAvantLancement, false);
    document.getElementById('plusvite').addEventListener('click',foncPourVitAvantLancement,false);
    document.getElementById('plusvite').myParam = true
    document.getElementById('moinsvite').addEventListener('click',foncPourVitAvantLancement,false);
    document.getElementById('moinsvite').myParam = false
}

//----------------------------------------------------{foncPourVitAvantLancement}----------------------------------------------------

/**
 * Fonction qui permet de voir avant le lancement si l'utilisateur souhaite accélérer ou décélérer la simulation.
 * En fonction l'affichage de ns est modifié.
 * @param {*} accelerer 
 */
function foncPourVitAvantLancement(accelerer){
	if(accelerer.currentTarget.myParam){
		compteurVitesseAvantLancement += 1
	}
	else{
		compteurVitesseAvantLancement -= 1
	}
	document.getElementById('nsimtxt').innerHTML= "ns="+ compteurVitesseAvantLancement.toString();
}