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


//----------------------------------------------------{traceEstAbsent}----------------------------------------------------

/**
 * Fonction qui fixe la valeur de l'élément d'ID "trace_present" à false, cela permet de déclarer qu'aucune trajectoire n'a encore été tracée. 
 */
function traceEstAbsent(){
	document.getElementById('trace_present').value=false;
}

//----------------------------------------------------{surTelephone}----------------------------------------------------

/**
 * Fonction qui vérifie si la largeur de l'écran est inférieure ou égale à 960 pixels et ajuste la visibilité (cachée ou non) d'un élément HTML avec l'ID "bouton_info" en conséquence. 
 * Si l'écran fait moins ou égal à 960 pixels alors l'élement sera caché et sinon il sera visible.
 */

function SurTelephone(){
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

//----------------------------------------------------{calculs}----------------------------------------------------


//Okay pour l'observateur distance et l'angle à 0 mais pas à 90
//Okay pour le spationaute et l'angle à 0 mais pas à 90

var calculs = calculs || (function() {
    let c=299792458;
    return {

         /**
         * Calcule la vitesse réelle en m/s pour la métrique de Schwarzschild extérieure.
         * @param {Number} E constante de la metrique, sans dimension.
         * @param {Number} L constante de la métrique, en m.
         * @param {Number} r position du mobile en r, en m.
         * @param {Number} rs rayon de Schwarzschild, en m.
         * @param {boolean} photon indique si le mobile est un photon ou non.
         * @returns [vtot,vr,vphi] une liste avec des variables qui sont respectivement la vitesse physique totale, la vitesse radiale et la vitesse tangentielle.
         */

        /*dans ce qui suit si vous trouvez des math.abs , c'est Khaled qui les a mit pour eviter que 
        les termes dans les racines soient negatifs mais c'est le cas photon-externe-sch qui posait pb au debut*/

        MSC_Ex_vitess : function (E,L,r,rs,photon) {
            var vtot=0;
            dt=E/(1-(rs/r)); //dt/dtau ou dt/dlambda pour photon
            dphi=c*L/(r**2);// dphi/dtau ou dphi/dlambda pour photon
            vphi=  r*dphi/dt*Math.sqrt(1/(1-rs/r));
            
            if(photon){ // calcule photon
                dr=E**2-(1-rs/r)*((L/r)**2);   //dr=(c/E)**2*(1-rs/r)**2*(E**2-(1-rs/r)*((L/r)**2));
                vr=c/E*Math.sqrt(Math.abs(dr));    //vr=Math.sqrt(dr/((1-rs/r)**2));
            }
            else{ // calcul particule
                dr=E**2-(1-rs/r)*(1+(L/r)**2);  //dr=(c/E)**2*(1-rs/r)**2*(E**2-(1-rs/r)*(1+(L/r)**2));
                vr=c/E*Math.sqrt(Math.abs(dr));   //vr=Math.sqrt(dr)/(1-rs/r);
				
            }
            vtot=Math.sqrt(vphi**2+vr**2);  

            return [vtot,vr,vphi];
        },

        /**
         * Calcule la vitesse réelle en m/s pour la métrique de Schwarzschild pour une interaction non baryonique à l'intérieur de l'astre.
         * @param {Number} E constante de la métrique, sans dimension.
         * @param {Number} L constante de la métrique, en m.
         * @param {Number} r position du mobile en r, en m.
         * @param {Number} rs rayon de Schwarzschild, en m.
         * @param {Number} ra rayon de la masse centrale, en m.
         * @param {boolean} photon indique si le mobile est un photon ou non.
         * @returns [vtot,vr,vphi] une liste avec des variables qui sont respectivement la vitesse physique totale, la vitesse radiale et la vitesse tangentielle. 
         */
        
        MSC_In_vitess : function(E,L,r,rs,ra,photon){
            alpha_=1-((r**2)*rs)/(ra**3); /// alpha pour la métrique de Schawr interne
            beta_=(3/2)*Math.sqrt(Math.abs(1-rs/ra))-(1/2)*Math.sqrt(Math.abs(alpha_));/// beta pour la métrique de Schawr interne
            vphi=Math.sqrt(Math.abs((r**2/beta_**2)*(c*L*beta_**2/(E*r**2))**2));
            if(photon){
                dr=((c/E)**2)*alpha_*(beta_**4)*((E/beta_)**2-(L/r)**2);
                vr=Math.sqrt(Math.abs(dr/(alpha_*beta_**2)));
            }
            else{
                dr=((c/E)**2)*alpha_*(beta_**4)*((E/beta_)**2-(L/r)**2-1);
                vr=Math.sqrt(Math.abs(dr/(alpha_*beta_**2)));
            }
            vtot=Math.sqrt(vphi**2+vr**2);

            return [vtot,vr,vphi];
        },
        
        /**
         * Calcule de la vitesse dans la métrique de Kerr.
         * @param {Number} E constante de la métrique, sans dimension.
         * @param {Number} l constante de la métrique, en m.
         * @param {Number} a paramètre de spin, en m.
         * @param {Number} r position du mobile en r, en m.
         * @param {Number} rs rayon de Schwarzschild, en m.
         * @param {boolean} photon indique si le mobile est un photon ou non.
         * @returns [vtot,vr,vphie] une liste avec des variables qui sont respectivement la vitesse physique totale, la vitesse radiale et la vitesse tangentielle. 
         */
        MK_vitess :function(E,l,a,r,rs,photon){

            delta_=(r**2)-(rs*r)+(a**2); ///delta dans la metric de kerr
            dphi=c*((rs*a*E)/r+(1-rs/r)*l)/((r**2+a**2+(rs/r)*(a**2))*E-rs*a*l/r);   //  OK
            vphie=delta_*(dphi**2)/((1-(rs/r)+rs*a*(dphi)/(c*r))**2);       // OK
            vphie=Math.sqrt(vphie);

            if(photon){
                dr=(c**2)*(E**2+((a**2)*(E**2)-l**2)/(r**2)+rs*(((l-a*E)**2)/(r**3)));
                dr*=(delta_**2)/(((r**2+a**2+(rs/r)*a**2)*E-rs*a*l/r)**2);
                vr=(1-rs/r)*((r**2)*dr/delta_)/(1-(rs/r)+rs*a*(dphi)/(c*r))**2;
                vr=Math.sqrt(Math.abs(vr));
                
            }
            else{
                partie1= E**2 - 1 + rs/r + ((a**2)*(E**2 - 1)-l**2)/(r**2) + (rs*((l-a*E)**2))/(r**3); //Manon
                partie2= (a**2 + r**2 - r*rs)**2; //Manon
                partie3= ((r**2 + a**2 + (a**2)*(rs/r))*E - (rs*a*l)/r)**2; //Manon

                dr2= (c**2)*((partie1*partie2)/(partie3)); //Manon

                vr_au_carre=(1-rs/r)*(((r**2)*dr2)/delta_)/((1-(rs/r)+rs*a*(dphi)/(c*r))**2);   //Manon
                vr=Math.sqrt(Math.abs(vr_au_carre));
            }
            vtot=Math.sqrt(vr**2+vphie**2);
            return [vtot,vr,vphie];
        }
    }

})()


//----------------------------------------------------{arretKerr}----------------------------------------------------

/**
 * Fonction qui permet l'arrêt du mobile dans la métrique de Kerr.
 * A distinguer de la fonction pause pausee(), la fonction arret ne permet pas de relancer la simulation ensuite.
 */
function arretkerr() {
	pause = true;
    clearInterval(myInterval);
	document.getElementById("indic_calculs").innerHTML=texte.pages_trajectoire.calcul_termine;
    document.getElementById("pause/resume").style.display='none';  //on enleve les 2 buttons pause
	document.getElementById('bouton_pause').style.display='none'; 
}

//----------------------------------------------------{htmlDecode}----------------------------------------------------

/**
 * Fonction utile pour convertir des entités HTML encodées (par exemple &lt;) en leurs caractères correspondants (<).
 * Peut-être nécessaire lorsque l'on récupère des données HTML encodées d'un serveur ou d'une API et que l'on souhaite les afficher correctement sur une page web.
 * @param {*} input : entité HTML que l'on souhaite convertir.
 * @returns doc.documentElement.textContent qui est l'entité HTML décodée.
 */
function htmlDecode(input) {
	var doc = new DOMParser().parseFromString(input, "text/html");
	return doc.documentElement.textContent;
}

//----------------------------------------------------{rendreVisibleNbG}----------------------------------------------------

/**
 * Fonction permettant de cacher les cases g ressenti, Dernier g et P consommée quand on est dans le mode observateur mais pas quand on est dans le mode spationaute.
 */
function rendreVisibleNbG() {

	blyo = Number(document.getElementById("nombredefusees").value);//nombre de mobiles
	element2=document.getElementById('traject_type2');//si spationaute ou observateur
	
    // Sélectionne toutes les cellules dont l'ID commence par "nb_g" :
    var nbGCells = document.querySelectorAll('[id^="nb_g"]');

	// Sélectionne toutes les cellules dont l'ID commence par "g_ressenti" :
	var gRessCells = document.querySelectorAll('[id^="g_ressenti"]');

	var dernier_g_Cells = document.querySelectorAll('[id^="dernier_g"]');

	var dernier_g_res_Cells = document.querySelectorAll('[id^="dernier_g_res"]');

	var puissance_consommee_label_Cells = document.querySelectorAll('[id^="puissance_consommee_label"]'); 

	var puissance_consommee_Cells = document.querySelectorAll('[id^="puissance_consommee"]'); 

    var distance_metrique_cell = document.querySelectorAll('[id^="distance_metrique"]'); 

    var distance_metrique_res_cell = document.querySelectorAll('[id^="distance_parcourue"]'); 
    
    // Si element2.value est "mobile" et que y a que 1 mobile, rend les cellules visibles, sinon les cache
    if (element2.value == "mobile" && blyo==1) {
        nbGCells.forEach(function(cell) {
            cell.style.display = ''; // Rend visible la cellule nb_g
        });
		gRessCells.forEach(function(cell) {
            cell.style.display = ''; // Rend visible la cellule g_ressenti
        });
		dernier_g_Cells.forEach(function(cell) {
            cell.style.display = ''; 
        });
		dernier_g_res_Cells.forEach(function(cell) {
            cell.style.display = ''; 
        });
		puissance_consommee_label_Cells.forEach(function(cell) {
            cell.style.display = ''; 
        });
		puissance_consommee_Cells.forEach(function(cell) {
            cell.style.display = ''; 
        });
    } else {
        nbGCells.forEach(function(cell) {
            cell.style.display = 'none';
        });
		gRessCells.forEach(function(cell) {
            cell.style.display = 'none'; 
        });
		dernier_g_Cells.forEach(function(cell) {
            cell.style.display = 'none'; 
        });
		dernier_g_res_Cells.forEach(function(cell) {
            cell.style.display = 'none';
        });
		puissance_consommee_Cells.forEach(function(cell) {
            cell.style.display = 'none';
        });
		puissance_consommee_label_Cells.forEach(function(cell) {
            cell.style.display = 'none'; 
        });
    }
}

//----------------------------------------------------{clavierEvenement}----------------------------------------------------

/**
 * Fonction qui permet de gérer certaines actions de la simulation avec les touches du clavier.
 * @param {boolean} SCH : indique si je suis dans la métrique de Schwarzschild et sinon si false je suis en métrique de Kerr.
 */
function clavierEvenement(SCH){
	$(document).keyup(function(event) { // the event variable contains the key pressed
	if(event.which == 65) { // touche a
		$('#r1').click();
	}
	if(event.which == 90) { // touche z
		$('#r2').click();
	}
	if(event.which == 83) { // touche s
		$('#clear').click();
	}
	if(event.which == 68) { // touche d
		$('#boutton_enregis').click();
	}
	if(event.which == 87) { // touche w
		$('#moinsvite').click();
	}
	if(event.which == 88) { // touche x
		$('#pau').click();
	}
	if(event.which == 67) { // touche c
		$('#plusvi').click();
	}
    if(SCH){
        if (event.which == 69) { // touche e
            $('#rebondd').click();
        }
    }

	});
}

//----------------------------------------------------{foncPourZoomMoinsAvantLancement}----------------------------------------------------

/**
 * Fonction qui permet de dézoomer avant le début de la simulation dans la métrique de SCH. 
 */
function foncPourZoomMoinsAvantLancement(){
    factGlobalAvecClef = factGlobalAvecClef/1.2; //Division de la variable du zoom par 1.2.
	nz_avant_lancement-=1; //Je comptabilise ce dézoom avant le lancement.

    //J'affiche le zoom correct :
    nzoom-=1;
    document.getElementById('nzoomtxt').innerHTML= "zoom="+ nzoom.toString();

    canvasAvantLancement(); //Je mets à jour la position de la particule avec ce nouveau zoom. 
}

//----------------------------------------------------{foncPourZoomPlusAvantLancement}----------------------------------------------------

/**
 * Fonction qui permet de zoomer avant le début de la simulation dans la métrique de SCH. 
 */
function foncPourZoomPlusAvantLancement(){
	
	factGlobalAvecClef = factGlobalAvecClef*1.2; //Multiplication de la variable du zoom par 1.2.
	nz_avant_lancement+=1; //Je comptabilise ce zoom avant le lancement.

    //J'affiche le zoom correct :
	nzoom+=1;
	document.getElementById('nzoomtxt').innerHTML= "zoom="+ nzoom.toString();
	canvasAvantLancement(); //Je mets à jour la position de la particule avec ce nouveau zoom. 

}

//----------------------------------------------------{foncPourZoomMoinsAvantLancementKerr}----------------------------------------------------

/**
 * Fonction qui permet de dézoomer avant le début de la simulation dans la métrique de Kerr.
 */
function foncPourZoomMoinsAvantLancementKerr(){
    nz_avant_lancement-=1; //Je comptabilise le dézoom.
    document.getElementById('nzoomtxt').innerHTML= "zoom="+ nz_avant_lancement.toString(); //Je l'affiche correctement sur la page. 
}

//----------------------------------------------------{foncPourZoomPlusAvantLancementKerr}----------------------------------------------------

/**
 * Fonction qui permet de zoomer avant le début de la simulation dans la métrique de Kerr.
 */
function foncPourZoomPlusAvantLancementKerr(){
    nz_avant_lancement+=1; //Je comptabilise le zoom.
    document.getElementById('nzoomtxt').innerHTML= "zoom="+ nz_avant_lancement.toString(); //Je l'affiche correctement sur la page.
}

//----------------------------------------------------{boutonAvantLancement}----------------------------------------------------

/**
 * Fonctions qui prépare les boutons de zoom/dézoom et d'accélération/décélération de la simulation avant le lancement de cette dernière.
 * @param {boolean} SCH : précise si on est dans la métrique de SCH (true) ou bien de Kerr (false).
 */
function boutonAvantLancement(SCH){

    //Fais apparaître les boutons d'accélération/décélération : 
    document.getElementById("panneau_mobile").style.visibility='visible';
    
    //Fais apparaître les boutons zoom/dézoom : 
    document.getElementById("panneau_mobile2").style.visibility='visible';
    
    //J'associe les fonctions d'avant lancement aux boutons de zoom :
    if(SCH){ //Pour la métrique de SCH : 
        document.getElementById('moinszoom').addEventListener('click',foncPourZoomMoinsAvantLancement, false);
        document.getElementById('pluszoom').addEventListener('click',foncPourZoomPlusAvantLancement, false);
    }else{ //Pour la métrique de Kerr :
        document.getElementById('moinszoom').addEventListener('click',foncPourZoomMoinsAvantLancementKerr, false);
        document.getElementById('pluszoom').addEventListener('click',foncPourZoomPlusAvantLancementKerr, false);
    }

    //J'associe les fonctions d'avant lancement aux bouton d'accélération/décélération. 
    document.getElementById('plusvite').addEventListener('click',foncPourVitPlusAvantLancement,false);
    document.getElementById('moinsvite').addEventListener('click',foncPourVitMoinsAvantLancement,false);
}

//----------------------------------------------------{foncPourVitMoinsAvantLancement}----------------------------------------------------

/**
 * Fonction qui permet de décélérer la vitesse de la simulation avant le début de cette dernière.
 */
function foncPourVitMoinsAvantLancement(){

    //Je mets à jour les compteurs : 
	compteurVitesseAvantLancement -= 1
	compteurVitesse-=1;

    //J'affiche correctement simu sur la page :
	document.getElementById('nsimtxt').innerHTML= "simu="+ Math.round(compteurVitesse).toString();
}


//----------------------------------------------------{foncPourVitPlusAvantLancement}----------------------------------------------------

/**
 * Fonction qui permet d'accélérer la vitesse de la simulation avant le début de cette dernière.
 */
function foncPourVitPlusAvantLancement(){

    //Je mets à jour les compteurs :
	compteurVitesseAvantLancement += 1
	compteurVitesse+=1;

    //J'affiche correctement simu sur la page :
	document.getElementById('nsimtxt').innerHTML= "simu="+ Math.round(compteurVitesse).toString();
}

//----------------------------------------------------{rungekutta}----------------------------------------------------

/**
 * Fonction de runge-kutta d'ordre 4 générale pour ne pas avoir 16 rungekutta différents comme avant. 
 * @param {Number} h : pas temporel. 
 * @param {Number} A : correspond à dr/dt ou dr/dτ en fonction du référentiel.
 * @param {Number} r : coordonnée radiale, en m. 
 * @param {Number} E : constante d'intégration, sans dimension. 
 * @param {Number} L : constante d'intégration, avec la dimension d'une longueur
 * @param {Function} deriveeSeconde : fonction de la dérivée seconde utilisée dans la méthode de runge-kutta.
 * @returns {Array} [r,A]
 */
function rungekutta_general(h,A,r,E,L,deriveeSeconde) {
    let k=[0,0,0,0];

    if (E === null){
        if (L === null){
            k[0] = deriveeSeconde(r);
            k[1] = deriveeSeconde(r + 0.5 * h * A);
            k[2] = deriveeSeconde(r + 0.5 * h * A + 0.25 * h * h * k[0]);
            k[3] = deriveeSeconde(r + h * A + 0.5 * h * h * k[1]);
        }else{
            k[0] = deriveeSeconde(L, r);
            k[1] = deriveeSeconde(L, r + 0.5 * h * A);
            k[2] = deriveeSeconde(L, r + 0.5 * h * A + 0.25 * h * h * k[0]);
            k[3] = deriveeSeconde(L, r + h * A + 0.5 * h * h * k[1]);
        }
    }else{
        k[0] = deriveeSeconde(E, L, r);
        k[1] = deriveeSeconde(E, L, r + 0.5 * h * A);
        k[2] = deriveeSeconde(E, L, r + 0.5 * h * A + 0.25 * h * h * k[0]);
        k[3] = deriveeSeconde(E, L, r + h * A + 0.5 * h * h * k[1]);
    }

    r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
    A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
    return [r, A];
}