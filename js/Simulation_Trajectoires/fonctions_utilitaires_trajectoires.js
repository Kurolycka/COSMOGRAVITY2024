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


//----------------------------------------------------{Calcules_des_vitesses}----------------------------------------------------

/// Document pour metre des fonctions de calcul

//Okay pour l'observateur distance et l'angle à 0 mais pas à 90
//Okay pour le spationaute et l'angle à 0 mais pas à 90

var calculs = calculs || (function() {
    let c=299792458;
    return {
        ///Calcule la vitess réel en m/s pour la métrique de Schwarzchild
         /**
         *
         * @param {*} E constant de la metrique 
         * @param {*} L constant de la metrique 
         * @param {*} r position de la particule en r
         * @param {*} rs rayon de schwarschild
         * @param {*} ra rayon de la masse central
         * @param {*} ref choix du réferentiel
         * @returns 
         */

        //dans ce qui suit si vous trouvez des math.abs , c'est Khaled qui les a mit pour eviter que 
        //les termes dans les racines soient negatifs mais c'est le cas photon-externe-sch qui posait pb au debut
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

        /**Calcule la vitess réel en m/s pour la métrique de Schwarzchild pour une intéraction non barionique à l'intérieur de l'astre
         * 
         * @param {*} E constant de la metrique 
         * @param {*} L constant de la metrique 
         * @param {*} r position de la particule en r
         * @param {*} rs rayon de schwarschild
         * @param {*} ra rayon de la masse central
         * @param {*} ref choix du réferentiel
         * @returns 
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
         * Calcule de la vitess dans la métrique de Kerr
         * @param {*} E constante
         * @param {*} l constante
         * @param {*} a constante 
         * @param {*} r position de la particule en r
         * @param {*} rs rayon de schwarschild
         * @param {*} ref choix référentiel 
         * @returns 
         */
        MK_vitess :function(E,l,a,r,rs,photon){

            //alert(a);
            delta_=(r**2)-(rs*r)+(a**2); ///delta dans la metric de kerr
            dphi=c*((rs*a*E)/r+(1-rs/r)*l)/((r**2+a**2+(rs/r)*(a**2))*E-rs*a*l/r);   //  OK
            vphie=delta_*(dphi**2)/((1-(rs/r)+rs*a*(dphi)/(c*r))**2);       // OK
            vphie=Math.sqrt(vphie);

            if(photon){
                dr=(c**2)*(E**2+((a**2)*(E**2)-l**2)/(r**2)+rs*(((l-a*E)**2)/(r**3)));
                dr*=(delta_**2)/(((r**2+a**2+(rs/r)*a**2)*E-rs*a*l/r)**2);
                vr=(1-rs/r)*((r**2)*dr/delta_)/(1-(rs/r)+rs*a*(dphi)/(c*r))**2;
                vr=Math.sqrt(Math.abs(vr));
                //alert(vr);
                
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
            //alert(vtot);
            return [vtot,vr,vphie];
        }
    }

})()

//----------------------------------------------------{fonction_reset_de_"recommencer.js"}----------------------------------------------------

function reset() {

	alert("Terminé");
	//context.clearRect(0, 0, canvas.width, canvas.height);
  
  }
  
  //----------------------------------------------------{fonction_arret_de_"stopper.js"}----------------------------------------------------
  function arret(mobile) {
	mobile.pause = true;
	//dtau = 0;

clearInterval(mobile.myInterval);
	document.getElementById("indic_calculs").innerHTML=texte.pages_trajectoire.calcul_termine;
}


function arretkerr() {
	pause = true;
    clearInterval(myInterval);
	document.getElementById("indic_calculs").innerHTML=texte.pages_trajectoire.calcul_termine;
}
