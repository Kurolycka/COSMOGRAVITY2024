// variables globales
var r_part = 0;
var A_part = 0;

var A_init=0;
var A_part_obs = 0;
var A_init_obs=0;				   
var Dtau1=0;
var Dtau2=0;
var i = 1;
var j = 1;
var clicks = 0;
var title = "V(r)/c²";
var pos1 = [];
const DIAMETRE_PART = 1;
var scale_factor=280;
var mini_obs=0;
var mini_mob=0;
var obs=0;
var z=0;
var z_obs=0;
var nzoom=0;//si on entre rien dans l'entrée nzoom 
var nz_avant_lancement=0;
var c = 299792458;
var G = 6.67385 * Math.pow(10, -11);
var compteurVitesse = 0;
var compteurVitesseAvantLancement =0; 

var point; //pour le graphe du potentiel


//puisqu'il faux initaliser data1 et data2 avant l'appel dans graphique_creation_pot
//var data1 = [];
//var data2 = [];

var onestarrete=0;
var peuxonrelancer = true;
var racines;
var arrayracinesreels = [];
var racinemax;
var rmini;
// liste de couleurs en hexa
const COULEUR_NOIR = '#2F2D2B';
const COULEUR_BLEU = '#4080A4';
const COULEUR_TURQUOISE='#AEEEEE';
const COULEUR_CYAN = '#008B8B';
const COULEUR_BLANC = '#ffffff';
const COULEUR_ROUGE = '#ff0000';
const COULEUR_ROUGE_COSMO= '#b54b3a';
const COULEUR_GRIS = '#C0C0C0';
const COULEUR_GRIS_FONCE = '#A9A9A9';
const COULEUR_JAUNE='#F0E36B';

// couleurs rayons et particule
const COULEUR_PART = COULEUR_ROUGE_COSMO;
const COULEUR_RS = COULEUR_BLEU;
const COULEUR_RH = COULEUR_GRIS_FONCE;
const COULEUR_ERGOS = COULEUR_JAUNE;


																						
function pressionBouttonObservateur2() {
	if (document.getElementById("r3").className == "myButton2") {
		document.getElementById("r3").className = "myButton";
		document.getElementById("r4").className = "myButton2";
		document.getElementById("case_depasser").style="display: none;";

 	}	
}

// actualisation bouton mobile quand pression
function pressionBouttonMobile2() {
	if (document.getElementById("r4").className == "myButton2") {
		document.getElementById("r4").className = "myButton";
		document.getElementById("r3").className = "myButton2";
		document.getElementById("case_depasser").style="display: block;";

	}
}

//----------------------------------------------------{initialisation}----------------------------------------------------

/**
 * Fonction qui permet la récupération des valeurs remplies par l'utilisateur et en fonction le calcul et l'affichage du premier tableau fixe de constantes avant le début de la simulation.
 */
function initialisation(){

	//Je récupère les différentes valeurs rentrées par l'utilisateur :
	M = Number(document.getElementById("M").value); //Masse de l'astre.
	r0 = Number(document.getElementById("r0").value); //Distance initiale au centre de l'astre.
	phi0 = Number(document.getElementById("phi0").value); //Angle initiale phi de la position du mobile.
	teta = Number(document.getElementById("teta").value); // Angle initiale phi de la vitesse du mobile.
	J = Number(document.getElementById("J").value); //Moment angulaire du trou noir. 
	
	//Je convertis les angles en radians : 
	phi0=phi0*Math.PI/180;
	tetarad=teta*Math.PI/180

	//Je calcule le rayon de Schwarzschild correspondant : 
	m = G * M / Math.pow(c, 2); 
	rs = 2 * m;
	//Et le paramètre de spin : 
	a = J / (c * M);


	dr_sur_dlambda=c*Math.cos(tetarad)*Math.sqrt(delta(r0)/(r0*(r0-rs))); //Je calcule dr/dλ. 
	dphi_sur_dlambda=c*Math.sin(tetarad)/Math.sqrt(delta(r0)); //Je calcule dphi/dλ.
	E=1; //Je fixe la constante d'intégration sans dimension E. 
	L = (delta(r0)*dphi_sur_dlambda*r0 - rs*a*c)/(c*(r0-rs)); //Je calcule L la constante d'intégration.

	//Je calcule Rh+ (rhp), Rh- (rhm) et rh (qui sert au calcul de rmax) :
	rhp = 0.5 * ( rs + Math.sqrt(Math.pow(rs, 2) - 4 * Math.pow(a, 2))); 
	rhm = 0.5 * (rs - Math.sqrt(Math.pow(rs, 2) - 4 * Math.pow(a, 2))); 
	rh = m * (1 + Math.sqrt(1 - Math.pow(J * c / (G * M * M), 2))); //Rayon de Kerr

	//Je calcule la gravité de surface théorique pour R=Rh+.
	gravSurface = 0.5 * Math.pow(c, 2) * (Math.pow(rhp, 2) - Math.pow(a, 2)) / ((Math.pow(rhp, 2) + Math.pow(a, 2))*rhp); 			//gravité de surface Kerr
	
	//Calcul des distances radiales nécessaires pour avoir des orbites circulaires : 
	rayon_orbite_pro=rs*(1+Math.cos((2/3)*Math.acos(-(2*a)/rs))); //Orbite circulaire prograde.
	rayon_orbite_retro=rs*(1+Math.cos((2/3)*Math.acos((2*a)/rs))); //Orbite circulaire retrograde.
	//Puis affichage de ces distances radiales : 
	document.getElementById("circulaire_prograde_res").innerHTML=rayon_orbite_pro.toExponential(5);
	document.getElementById("circulaire_retrograde_res").innerHTML=rayon_orbite_retro.toExponential(5); 

	//--------------------------------Affichage--------------------------------
			   
	//J'affiche sur la page le paramètre de spin, le rayon de SCH, E et L ainsi que la gravité de surface :
	document.getElementById("a").innerHTML = a.toExponential(3);
	document.getElementById("m").innerHTML = rs.toExponential(3);
	document.getElementById("L").innerHTML = L.toExponential(3);
	document.getElementById("E").innerHTML = E.toExponential(3);
	document.getElementById("gravS").innerHTML = gravSurface.toExponential(3);

	if (isNaN(rhp)){ //Si je n'ai pas de Rh+ j'affiche 0.
		document.getElementById("rhp").innerHTML = 0;
	}else{ //Sinon j'affiche la valeur calculée.
		document.getElementById("rhp").innerHTML = rhp.toExponential(3);
	}

	if (isNaN(rhm)){ //Si je n'ai pas de Rh- j'affiche 0.
		document.getElementById("rhm").innerHTML = 0;
	}else{ //Sinon j'affiche la valeur calculée.
		document.getElementById("rhm").innerHTML = rhm.toExponential(3);
	}

	textegravetetc_Kerr(); //Pour afficher les infobulles des tableaux etc.
	boutonAvantLancement(false); //J'associe aux différents boutons les fonctions associées d'avant le lancement. 
}

//----------------------------------------------------{verifnbr}----------------------------------------------------

/**
 * Fonction qui affiche un message d'erreur si une saisie n'est pas un nombre dans un des champs. 
 */
function verifnbr() {

	var texte = o_recupereJson(); //Pour les messages d'alerte.

	//Je récupère les données remplies par l'utilisateur : 
	M = document.getElementById("M").value; //La masse de l'astre. 
	r0 = document.getElementById("r0").value; //La distance initiale au centre.
	J = document.getElementById("J").value; //Le moment angulaire.
	phi0 = document.getElementById("phi0").value; //L'angle de la position initiale.
	teta = document.getElementById("teta").value; //L'angle de la vitesse initiale. 

	//Si un des champs a pour saisie autre chose que un nombre j'affiche un message d'alerte :
	if (isNaN(M)){
		alert (texte.pages_trajectoire.alerte_verifier_M);
		document.getElementById("M").value=2e30.toExponential(0);
	}
	if (isNaN(r0)){
		alert (texte.pages_trajectoire.alerte_verifier_r0);
		document.getElementById("r0").value=4455;
	}
	if (isNaN(J)){
		alert (texte.pages_trajectoire.alerte_verifier_J);
		document.getElementById("J").value=8.5e41.toExponential(1);
	}
	if (isNaN(phi0)){
		alert (texte.pages_trajectoire.alerte_verifier_phi0);
		document.getElementById("phi0").value=0;
	}
	if (isNaN(teta)){
		alert (texte.pages_trajectoire.alerte_verifier_teta);
		document.getElementById("teta").value=128;
	}					   
}

//----------------------------------------------------{trajectoire}----------------------------------------------------
/**
 * 
 * @returns Première étape qui lance la partie calculatoire.
 */
function trajectoire() {

	texte = o_recupereJson();

	if (pause || debut) {

		document.getElementById("tg2").style.display = "table"; //Fait apparaître le tableau des résultats.
		document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours; //Affiche que le calcul est en cours.
		$("#grsvg_2").empty();  //Je vide le contenue du canvas du potentiel. 

		SurTelephone(); //Affichage de l'information sur les touches claviers en fonction de la taille de l'écran.

		//Interdiction de changer les valeurs de M, r0, J, teta, phi0 une fois la simulation lancée : 
		document.getElementById('M').disabled = true;
		document.getElementById('r0').disabled = true;
		document.getElementById('J').disabled = true;
		document.getElementById('teta').disabled = true;
		document.getElementById('phi0').disabled = true;   

		element2=document.getElementById('traject_type2'); //Récupère la valeur de si on est en mode observateur ou en mode spationaute.

		//Interdiction de changer les valeurs des modes observateur et spationaute une fois la simulation lancée : 
		document.getElementById('r3').disabled = true;
		document.getElementById('r4').disabled = true;

		document.getElementById('trace_present').value="true"; //Permet de déclarer qu'il y a un tracé. 

		pause = false; //Permet de dire que nous ne sommes pas en pause.
		debut = false; //Permet de dire que nous ne sommes plus au début de la simulation.

		scale_factor = 280;	//Fixe un facteur d'échelle initiale/par défaut.
		
		initialisation(); //Permet d'initialiser la simulation en calculant différentes valeurs liées aux paramètres initiaux.
		//Prépare aussi les boutons d'avant lancement.

		//--------------------------------Calcul de la trajectoire en elle-même--------------------------------

		//Je stocke dans les différentes variables de la trajectoire les valeurs initiales pour le début de la simulation :

		phi = phi0; //Angle de la position du mobile dans son référentiel.
		phi_obs = phi0; //Angle de la position du mobile dans le référentiel de l'observateur distant.
		A_init = dr_sur_dlambda; //dr/dλ initiale du mobile dans son référentiel.
		r_init = r0; //Position radiale initiale du mobile dans son référentiel. 
		A_part = A_init; //dr/dλ du mobile dans son référentiel.
		r_part = r_init; //Position radiale du mobile dans son référentiel. 
		A_init_obs = dr_sur_dlambda*delta(r0)/( (Math.pow(r0,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r0)*E - rs*a*L/r0 ); //dr/dt initiale du mobile dans le référentiel de l'observateur distant.
		A_part_obs=A_init_obs; //dr/dt du mobile dans le référentiel de l'observateur distant. 												
		r_init_obs = r0; //Position radiale initiale du mobile dans le référentiel de l'observateur distant.
		r_part_obs=r_init_obs; //Position radiale du mobile dans le référentiel de l'observateur distant. 

		temps_particule = 0; //Temps du mobile dans son référentiel propre.
		temps_observateur = 0; //Temps de l'observateur distant. 

		calcul_rmax(); //Permet d'obtenir la position radiale maximale de la trajectoire.

		temps_chute_libre = (Math.PI * r0 * Math.sqrt(r0 / (2 * G * M)) / 2); //Calcul du temps de chute libre.
		dtau= 1e-3*rmax/c ; //Je fixe le pas de temps de la simulation.
	
		clavierEvenement(false); //Permet une fois démarrée de gérer la simulation avec les touches du clavier.

		//--------------------------------Positions de départ du mobile--------------------------------

		x1part = scale_factor * r0 * Math.cos(phi) / rmax; //x dans le référentiel du mobile.
   		y1part = scale_factor * r0 * Math.sin(phi) / rmax; //y dans le référentiel du mobile.
    	x1obs = scale_factor * r0 * Math.cos(phi_obs) / rmax; //x dans le référentiel de l'observateur distant.
    	y1obs = scale_factor * r0 * Math.sin(phi_obs) / rmax; //y dans le référentiel de l'observateur distant.
		
		//--------------------------------Gestion du canvas--------------------------------

    	canvas = document.getElementById("myCanvas");
    	if (!canvas) {//Si je n'ai pas de canvas récupérable pour la simulation alors message d'alerte et simulation impossible.
			alert(texte.pages_trajectoire.impossible_canvas);
			return;
    	}

    	context = canvas.getContext("2d");
    	if (!context) { //Si je n'ai pas de context de récupérable (interface permettant de dessiner sur le canvas) alors message d'alerte et simulation impossible. 
			alert(texte.pages_trajectoire.impossible_context);
			return;
    	}

    	canvas22 = document.getElementById("myCanvas22");
    	if (!canvas22) { //Si je n'ai pas le canvas22 de récupérable pour la simulation alors message d'alerte et simulation impossible. 
			alert(texte.pages_trajectoire.impossible_canvas);
			return;
    	}

    	context22 = canvas22.getContext("2d");
    	if (!context22) { //Si je n'ai pas le context du canvas22 de récupérable pour la simulation alors message d'alerte et simulation impossible. 
			alert(texte.pages_trajectoire.impossible_context);
			return;
    	}

    	majFondFixe(); //J'efface le canvas et je le remplace par un fond blanc avec le texte visible sur la gauche avec les paramètres d'entrée.
    	majFondFixe22(); //J'efface tout ce qui est lié à la trajectoire d'un mobile spécifique. 

    	diametre_particule = DIAMETRE_PART; //Je fixe le diamètre de la particule.

		//Position du centre du canvas :
		posX3 = (canvas.width / 2.0);
    	posY3 = (canvas.height / 2.0);

		//Je définis la position du mobile sur le canvas, vis à vis de son centre, dans le référentiel du mobile :
		posX1 = posX3 + x1part;
		posY1 = posY3 + y1part;

		//Je définis la position du mobile sur le canvas, vis à vis de son centre, dans le référentiel de l'observateur distant :
		posX2 = posX3 + x1obs;
		posY2 = posY3 + y1obs;
																		 
		myInterval = setInterval(animate, 1000 / 300); //La fonction animate est exécutée toutes les 1000/300 ms pour créer la simulation;

		//Associe au bouton pause la fonction pausee permettant de mettre la simulation en pause :
		document.getElementById('bouton_pause').addEventListener('click', function() {
			pausee();
		}, false);

		//--------------------------------Gestion des boutons d'accélération/décélération--------------------------------

		document.getElementById('plusvite').removeEventListener('click',foncPourVitPlusAvantLancement,false); //Je désassocie la fonction foncPourVitAvantLancement du bouton pour accélérer une fois la simulation commencée.
		document.getElementById('moinsvite').removeEventListener('click',foncPourVitMoinsAvantLancement,false); //Je désassocie la fonction foncPourVitAvantLancement du bouton pour décélérer une fois la simulation commencée.

		Dtau1 = 1e8 * dtau; //Pour permettre une accélération.
    	Dtau2 = dtau/1e8 ;  //Pour permettre une décélération.
 
		document.getElementById('plusvite').addEventListener('click', function() { //J'associe le bouton accélérer à la fonction suivante une fois la simulation lancée. 
			if (dtau >= Dtau1) { //Je mets une limite à mon accélération possible qui est Dtau1.
				dtau = Dtau1;
      		}else{ //Autrement j'accélére et j'incrèmente le clicks qui comptabilise les accélération/décélération.
				dtau += dtau;
				clicks += 1 ;
			}
		  document.getElementById('nsimtxt').innerHTML= "simu="+ clicks.toString(); //J'affiche le ns correspondant sur le site.
		}, false);


    	document.getElementById('moinsvite').addEventListener('click', function() { //J'associe le bouton décélérer à la fonction suivante une fois la simulation lancée. 
	    	if (dtau <= Dtau2) { //Je mets une limite à ma décélération possible qui est Dtau2.
        		dtau = Dtau2;
       		}else{ //Autrement je décélère et j'incrèmente le clicks qui comptabilise les accélération/décélération.			   
          		dtau /= 2;
	        	clicks -= 1 ;  
			}
			document.getElementById('nsimtxt').innerHTML= "simu="+ clicks.toString(); //J'affiche le ns correspondant sur le site.
		}, false);


		if(compteurVitesseAvantLancement>=0){ //Permet de prendre en compte tous les clics sur accélérer fait avant le début de la simulation. 
			for(i=0;i<compteurVitesseAvantLancement;i++){
				if (dtau >= Dtau1) {
					dtau = Dtau1;
				}else{
					dtau += dtau;
					clicks += 1 ;
				}
			}
		}else{ //Permet de prendre en compte tous les clics sur décélérer fait avant le début de la simulation.
			for(i=0;i>compteurVitesseAvantLancement;i--){
				if (dtau <= Dtau2) {
					dtau = Dtau2;
				}else{
					dtau /= 2;
					clicks -= 1 ;
				}
			}
		}

		//--------------------------------Gestion des boutons de zoom--------------------------------

		document.getElementById('moinszoom').removeEventListener('click',foncPourZoomMoinsAvantLancementKerr, false); //Je désassocie foncPourZoomMoinsAvantLancement du bouton pour dézoomer une fois la simulation commencée.
		document.getElementById('pluszoom').removeEventListener('click',foncPourZoomPlusAvantLancementKerr, false); //Je désassocie foncPourZoomPlusAvantLancement du bouton pour zoomer une fois la simulation commencée.

		document.getElementById('moinszoom').addEventListener('click', function() { //J'associe le bouton dézoomer à la fonction suivante une fois la simulation lancée.
			scale_factor /= 1.2;
			//J'ajuste les positions sur le canvas avec le nouveau facteur d'échelle :
			posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2);
			posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2);
			posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2);
			posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2);
			majFondFixe22(); //Je mets à jour tout ce qui est relié au dessin du mobile.																				   
			rafraichir2(context); //Redessine les rayons Rh+, Rh- et rs un fond blanc avec les entrées à gauche.
			nzoom-=1;
			document.getElementById('nzoomtxt').innerHTML= "zoom="+ nzoom.toString(); //Mets à jour l'affichage du zoom sur le site. 
		}, false);


		document.getElementById('pluszoom').addEventListener('click', function() { //J'associe le bouton zoomer à la fonction suivante une fois la simulation lancée.
			scale_factor *= 1.2;
			//J'ajuste les positions sur le canvas avec le nouveau facteur d'échelle :
			posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2);
			posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2);
			posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2);
			posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2);
			majFondFixe22(); //Je mets à jour tout ce qui est relié au dessin du mobile.																			  
			rafraichir2(context); //Redessine les rayons Rh+, Rh- et rs un fond blanc avec les entrées à gauche.
			nzoom+=1;
			document.getElementById('nzoomtxt').innerHTML= "zoom="+ nzoom.toString(); //Mets à jour l'affichage du zoom sur le site.
		}, false);


		document.getElementById('initialiser').addEventListener('click', function() { //Associe le bouton pour initialiser le zoom à la fonction suivante.
			scale_factor =280 ; //Je récupère le facteur d'échelle initial.
			//J'ajuste les positions sur le canvas avec le nouveau facteur d'échelle :
			posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2);
			posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2);
			posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2);
			posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2);	
			majFondFixe22(); //Je mets à jour tout ce qui est relié au dessin du mobile.																				   
			rafraichir2(context); //Redessine les rayons Rh+, Rh- et rs un fond blanc avec les entrées à gauche.
			nzoom=0;
			document.getElementById('nzoomtxt').innerHTML= "zoom="+ nzoom.toString(); //Mets à jour l'affichage du zoom sur le site.
		}, false);

		//Partie qui permet de mettre à l'échelle le dessin de l'astre et du rayon de SCH vis à vis des zooms avant le lancement de la simulation : 
		if (nz_avant_lancement < 0) {
			for (incr = 0; incr > nz_avant_lancement; incr -= 1) {
				scale_factor = scale_factor / 1.2;
			}
		} else if (nz_avant_lancement > 0) {
			for (incr = 0; incr < nz_avant_lancement; incr += 1) {
				scale_factor = scale_factor * 1.2;
			}
		}

		//--------------------------------Graphe du potentiel--------------------------------

		document.getElementById("bloc_resultats").style.display= "block"; //Permet d'afficher le graphe du potentiel en-dessous de la simulation de la trajectoire. 

		function DisparitionGraphesPotentiels() { //Fonction qui permet de faire disparaître tous les graphes de potentiel lorsque la case est décochée.
			var node = document.getElementById('grsvg_2');
			if (node.parentNode){
				node.parentNode.removeChild(node);
			}
		}


		if (document.getElementById("toggle").checked==false) { //Lorsque la case pour afficher les graphes de potentiel est décochée j'appelle la fonction définie précédemment. 
			DisparitionGraphesPotentiels();
		}

		//--------------------------------Gestion du canvas--------------------------------

    	document.getElementById('clear').addEventListener('click', function() { //Lorsque j'appuie sur le bouton reset la fenêtre est rechargée.
			location.reload();
		}, false);

    	creation_blocs(context); //Je trace Rh+, Rh- et rs.											  
															
		//-----------------------------------------------------TRACÉ POTENTIEL -------------------------------------------------
		
		setInterval(function(){ //Fonction qui permet d'avoir un graphe de potentiel dynamique. Ce graphe est renouvelé toutes les 300ms. 
	  		$('#grsvg_2').empty();  //Je vide le contenue du canvas du potentiel. 													   
    		data1=[];
    		data2=[];

			if (element2.value != "mobile"){  //Dans le cas de l'observateur distant. 

    			dr=r_part_obs*0.6/50; //Je calcule l'incrément dr.
		
				for (r = 0.7*r_part_obs; r < 1.3*r_part_obs ; r += dr) {  //Je parcours une gamme de valeurs de r centrée autour de mobile.r_part_obs en incrémentant de mobile.dr .
      				V = Vr_obs(r) ; //Je calcule le potentiel pour chaque r.
      				data1.push({date: r,close: V}); //Je stocke dans data1 les valeurs de r et V.
    			}

				V = Vr_obs(r_part_obs); //Je calcule le potentiel à la position actuelle.
				data2.push({date: r_part_obs,close: V}); //Je stocke dans data2 les valeurs de r et V de la position actuelle.
		
			}else{  //Dans le cas du mobile je procède de manière identique.
		
				dr=r_part*0.6/50;
		
  	  			for (r = 0.7*r_part; r < 1.3*r_part ; r += dr) { 
      				V = Vr_mob(r) ;
      				data1.push({date: r,close: V});  	
				}

				V = Vr_mob(r_part);
				data2.push({date: r_part,close: V}); 
			} 

 			point=graphique_creation_pot(0,data1,data2,null,null); //Trace le graphe du potentiel.
			
		},300);	 
	
	} else { //Dans le cas où ce n'est pas le début de la simulation et où je ne suis pas en pause.												 
    	myInterval = setInterval(animate, 10 / 6); //La fonction animate est exécutée toutes les 10/6 ms pour créer la simulation;
    }

	document.getElementById("pause/resume").addEventListener("click", function() {pausee()}); //J'associe le bouton pause à la fonction pausee.

	document.getElementById('start').style.display = "none"; //Une fois la simulation démarrée le bouton start/débuter disparaît.
	document.getElementById('pause/resume').style.display ="inline-block"; //Une fois la simulation démarrée le bouton pause/resume apparaît. 
	
} 

//----------------------------------------------------{animate}----------------------------------------------------

/**
 * Fonction qui s'occupe de l'animation, tracé et calculs en cours, elle est appelé dans trajectoire() en utilisant un setInterval. 
 */
function animate() {
    onestarrete=0;  // condition pour arreter le mobile
    element = document.getElementById('traject_type');//on recupere le boutton de observateur ou mobile
    element2=document.getElementById('traject_type2');;//on recupere le boutton de observateur ou mobile

    SurTelephone();	//on verifie si on est sur telephone ou ordinateur
    choixTrajectoire(context); // on vérifie le type de trajectoire sélectionné

	/*----------------------------------------------------------{{{{  CAS_OBSERVATEUR  }}}-----------------------------------------------------------*/
	if (element2.value != "mobile")
	//Tout ce qui est dans cette condition concerne le cas du referentiel de l'observateur	
	{
		/* Une condition pour ne pas calculer audela de RH+ */
		if(r_part_obs >rhp*1.0000001)
		{
			//-----------------------------------------------------PARTIE CALCULE-----------------------------------------------------------

			val_obs = rungekutta_general(dtau, A_part_obs, r_part_obs, null, null, derivee_seconde_Kerr_photon_obs); //calcul de l'equation differentielle avec RK4 ça donne le r et dr/dt
			r_part_obs = val_obs[0];  //valeur de r calculée par RK (Runge Kutta)
			A_part_obs = val_obs[1];  //valeur de dr/dlamda calculée par RK
		
			if(r_part_obs>rs*1.000001)
			{	
				resulta=calculs.MK_vitess(E,L,a,r_part_obs,rs,true);
				vtot=resulta[0];
				vr_3_obs=resulta[1]*Math.sign(A_part_obs);
				vp_3_obs=resulta[2]; // r_part_obs*varphi_obs/dtau;
				//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------

				//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AVANT RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
				document.getElementById("vrkp").innerHTML = vr_3_obs.toExponential(3);
				document.getElementById("vpkp").innerHTML = vp_3_obs.toExponential(3);
				document.getElementById("v_tot").innerHTML = vtot.toExponential(8);

			}
			else
			{
				//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> APRES RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
				//on affiche que les vitesses et distance parcourue ne sont plus definies	
				document.getElementById("v_tot").innerHTML = texte.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("vrkp").innerHTML = texte.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("vpkp").innerHTML = texte.page_trajectoire_photon_kerr.vitesse_pas_définie;
			}
			/*Les variables suivantes s'affiche de la meme manière meme apres Rs:*/
			document.getElementById("tp").innerHTML = temps_particule.toExponential(3);
			document.getElementById("r_par").innerHTML = r_part_obs.toExponential(3);

		}

		else 
		{
			r_part_obs=rhp; // r est theoriquement egale à RH+ 
			document.getElementById("r_par").innerHTML = r_part_obs.toExponential(3); //affichage du rayon
		}
		/*En dehors des conditions car se fait toujours : */
		//calcul de la vriation de l'angle phi
		varphi_obs = c *dtau* ( rs*a*E/r_part_obs + (1-rs/r_part_obs)*L )/( (Math.pow(r_part_obs,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r_part_obs)*E - rs*a*L/r_part_obs ); 
		phi_obs=phi_obs+varphi_obs; // on l'ajoute à la valeur precedente

		//Calcul des positions X, Y pour le tracé
		posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2.);
		posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2.);

		//-----------------------------------------------------PARTIE TRACÉ -------------------------------------------------
		//on dessine le trait derriere le mobile
		context.beginPath();//on ouvre le context
		context.fillStyle = COULEUR_NOIR;//on choisit la couleur pour remplir parce que c'est fill
		context.rect(posX2, posY2, 1, 1);//on dessine le tracé
		context.lineWidth = "1";//en choisissant la bonne largeur des traits
		context.fill();//on le met sur le canva

		majFondFixe22();// on efface l'ancienne position de la boule

		//on dessine le mobile au bout du trait avec les memes etapes
		context22.beginPath();
		context22.fillStyle = COULEUR_BLEU;
		context22.arc(posX2, posY2 , 5, 0, Math.PI * 2);
		context22.lineWidth = "1";
		context22.fill();

		/*Calcul et affichage du temps_obsevateur (qui s'affiche meme apres RH+:*/
		temps_observateur += dtau;
        document.getElementById("to").innerHTML = temps_observateur.toExponential(3);	
	}
	/*----------------------------------------------------------{{{{  CAS_SPATIONAUTE  }}}-----------------------------------------------------------*/
    
	else
	//Tout ce qui est dans cette condition concerne le cas du referentiel du spationaute
	{
		/* Une condition pour ne pas calculer audela attiendre zero */
		if(r_part>0)
		{	
			//-----------------------------------------------------PARTIE CALCULE-----------------------------------------------------------

			val = rungekutta_general(dtau, A_part, r_part, null, null, derivee_seconde_Kerr_photon);//calcul de l'equation differentielle avec RK4 ça donne le r et dr/dt
			r_part = val[0]; //valeur de r calculée par RK (Runge Kutta)
			A_part = val[1]; //valeur de dr/dtau calculée par RK

			/*Calcul des vitesses dans metrique de Kerr qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
			Fonctions_utilitaires_trajectoire):*/
			resulta=calculs.MK_vitess(E,L,a,r_part,rs,true);
			vtot=resulta[0];//	vitesse total ( module )
			//calcul de la vitesse radiale en tenant compte du signe de la derivée calculée avec RK
			vr_3=resulta[1]*Math.sign(A_part);
			vp_3=resulta[2];//calcul de la vitesse angulaire

			if(J==0) {vp_3= c*L/r_part;}//pour calculer la vitesse angulaire si J=0 

			varphi = c *dtau* ( rs*a*E/r_part + (1-rs/r_part)*L )/delta(r_part);//calcul de la variation de l'angle phi
			phi = phi + varphi; //on l'ajoute à la valeur precedente 

			//Calcul des positions X, Y pour le tracé
			posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2.);
			posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2.);

			temps_observateur+=dtau; //calcul du temps observateur distant
			
			//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------
		    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AVANT RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			if (r_part>rs*1.000001)
			{
				document.getElementById("to").innerHTML = temps_observateur.toExponential(3);//temps observateur
				document.getElementById("vrkp").innerHTML = vr_3.toExponential(3);  // vitesse radiale
				document.getElementById("vpkp").innerHTML = vp_3.toExponential(3);  //vitesse angulaire
				document.getElementById("v_tot").innerHTML = vtot.toExponential(8);	 //vitesse total (module)
			}

			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> APRES RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			else
			{	
				document.getElementById("to").innerHTML = temps_observateur.toExponential(3);//temps observateur
				//on affiche que les vitesses et distance parcourue ne sont plus definies	
				document.getElementById("v_tot").innerHTML = texte.page_trajectoire_photon_kerr.vitesse_pas_définie;//vitesse total (module)
				document.getElementById("vrkp").innerHTML = texte.page_trajectoire_photon_kerr.vitesse_pas_définie;// vitesse radiale
				document.getElementById("vpkp").innerHTML = texte.page_trajectoire_photon_kerr.vitesse_pas_définie;//vitesse angulaire

				if (r_part<=rhp)
				{	
					/*Au dela de RH+ le temps observateur est infini */
					document.getElementById("to").innerHTML = 1/0; 	
				}
			}
			/*Ces variables sont affichées independament de si on a depassé à Rs ou RH+ */
			document.getElementById("tp").innerHTML = temps_particule.toExponential(3); //temps du mobile
			document.getElementById("r_par").innerHTML = r_part.toExponential(3);  //rayon
		}	
		else
		{	
			r_part=0; // on met la valeur theorique du rayon
			document.getElementById("r_par").innerHTML = r_part.toExponential(3); //on l'affiche
			arretkerr(); //on arrete la simulation
		}
		//-----------------------------------------------------PARTIE TRACÉ -------------------------------------------------

		//Dessin du tracé derriere la particule
		context.beginPath();
		context.fillStyle = COULEUR_ROUGE_COSMO;
		context.rect(posX1, posY1, 1, 1);
		context.lineWidth = "1";
		context.fill();

		majFondFixe22();// on efface l'ancienne position de la boule

		//Dessin du de la boule avec les memes etapes
		context22.beginPath();
		context22.fillStyle = COULEUR_BLEU;
		/*On dessine la particule en evitant les problemes de r non defini :*/
		if (r_part==0){context22.arc((canvas.width / 2.), (canvas.height / 2.) , 5, 0, Math.PI * 2);} 
		else{ context22.arc(posX1, posY1 , 5, 0, Math.PI * 2);}
		context22.lineWidth = "1";	
		context22.fill();

		//-----------------------------------------------------NE PAS DEPASSER RH_ -------------------------------------------------

		if(r_part<=rhm && ! document.getElementById("depasser").checked)
		{
			r_part=rhm ; // le rayon est egale à RH-
			document.getElementById("r_par").innerHTML = r_part.toExponential(3); // on l'affiche
			textesfinarret_kerrphoton();
			onestarrete=1; //on met à jour la variable qui gere l'arret
			alert(texte.page_trajectoire_massive.particule_atteint_rh);//on met une alerte
			arretkerr();//on arrete la simulation
			peuxonrelancer=false; //on met qu'on peut pas relancer
		}	

	}             
		
}//  fin fonction animate

						
// Expression du potentiel divisé par c^2
function Vr_mob(r) {
	return potentiel_Kerr_photon(r);
}

function Vr_obs(r) {
	denom=(Math.pow(r,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r)*E-rs*a*L/r;
	dtausurdtaucarre = Math.pow(delta(r)/denom,2);
	return Math.pow(E,2)-( Math.pow(E,2)-potentiel_Kerr_photon(r) )*dtausurdtaucarre  ;
}

function potentiel_Kerr_photon(r) {
	return -(Math.pow(a*E,2)-Math.pow(L,2)) / Math.pow(r, 2) - rs / Math.pow(r, 3) * Math.pow(L - a * E, 2);
}

function derivee_seconde_Kerr_photon(r) {
	return -Math.pow(c, 2) / (2 * Math.pow(r, 4)) * (2 * r * (Math.pow(a * E, 2) - L * L) 
	+ 3 * rs  * Math.pow(L - a * E, 2));
}	

function delta(r) {
	return r * r - rs * r + a * a;
}

function derivee_seconde_Kerr_photon_obs(r) {

	EaL2_a2=Math.pow(E*a,2)-Math.pow(L,2);  
	Ea_L2=Math.pow(L-a*E,2) ;  
	denom=(Math.pow(r,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r)*E-rs*a*L/r ;
	
	return  0.5*Math.pow(c,2)*delta(r)/Math.pow(denom,2)*( 

            ( -2*(EaL2_a2)/Math.pow(r,3)-3*rs*Ea_L2/Math.pow(r,4) )*delta(r)

            +2*(Math.pow(E,2)+(EaL2_a2)/Math.pow(r,2)+rs*Ea_L2/Math.pow(r,3))*(2*r-rs)  

            -2*(Math.pow(E,2)+(EaL2_a2)/Math.pow(r,2)+rs*Ea_L2/Math.pow(r,3))*delta(r)*((2*r-rs*Math.pow(a,2)/Math.pow(r,2))*E+rs*a*L/Math.pow(r,2))/denom );
}


function calcul_rmax(){
	rmax = 5000; //eq3d(L,m,E);
	// Ici, les positions de départ de la particule, dans son référentiel et dans celui de l'observateur//
	if (E > 1) {
		rmax = 5 * r0;
	}

	/* --- */

	r1 = (L * (L - Math.sqrt(Math.pow(L, 2) - 12 * Math.pow(m, 2))) / (2 * m));
	r2 = (L * (L + Math.sqrt(Math.pow(L, 2) - 16 * Math.pow(m, 2))) / (4 * m));

	ra = 2 * m * Math.pow(L, 2);
	rb = ((2 * m / r0) - 1) * Math.pow(L, 2);
	X0 = 1 / r0;
	rc = 2 * m - Math.pow(L, 2) * X0 + 2 * m * Math.pow(L * X0, 2);
	DELTA = Math.pow(rb, 2) - 4 * ra * rc;
	r3 = (-rb - Math.sqrt(DELTA)) / (2*ra);

	if (L < 2 * Math.sqrt(3) * m) {
		rmax = r0;
	} 
	else if (L <= 4 * m && L > 2 * Math.sqrt(3) * m) {
		if (Vr_mob(r0) <= Vr_mob(r1) && r0 > r1) {
			if (r3 > r0) {
				rmax = r3;
			} 
			else if (r3 < r0) {
				rmax = r0;
			}
		} 
		else {
			rmax = r0;
		}
	} 
	else if (L > 4 * m) {
		if (r0 > r2) {
			if (r3 > r0) {
				rmax = r3;
			} else if (r3 < r0) {
				rmax = r0;
			}
		} 
		else {
			rmax = r0;
		}
	}

}


/*ATTENTIEN : cette fonction est differente de celle utilisé dans la partie SCH car on a pas besoin de plusieurs
mobiles, ni de Timers, pusique SetInterval suffit bien, alors on a gardé cette fonction pour Kerr Ainsi */

/**
 * Cette fonction est associé aux bouttons pause, avec les quels on peut pauser et reprendre la simulaiton.
 */
function pausee() 
{
	//si la simultion est en marche
	if (! pause) 
	{
		pause = true; //on la met en pause
		document.getElementById("pause/resume").innerHTML =texte.pages_trajectoire.bouton_resume;//on change le texte du boutton pause en haut
		document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_enpause;//on change le texte qui s'affiche "Calculs en pause"
		document.getElementById("pau").title = texte.pages_trajectoire.bouton_lecture;//on change l'icone du boutton pause en bas
		document.getElementById("pau").src = "Images/lecture.png";//infobulle du boutton pause en bas
		clearInterval(myInterval); // on arrete l'appel de animte
	} 
	//si la simultion est en pause
	else 
	{
		//on verifie si on peut relancer
		if(peuxonrelancer) 
		{
			pause = false;//on la met en pause
			document.getElementById("pause/resume").innerHTML = texte.pages_trajectoire.bouton_pause;//on change le texte du boutton pause en haut
			document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours;//on change le texte qui s'affiche "Calculs en pause"
			document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;//infobulle du boutton pause en bas
			document.getElementById("pau").src = "Images/pause.png";//on change l'icone du boutton pause en bas
			myInterval = setInterval(animate, 10 / 6); //on appelle animate à chaque 10/6 ms avec setInterval et on stocke dans myInterval
		}

	}
}

function rafraichir() {
	window.location.reload(); 						   
	element2.value="non";
}


// -------------------------------------{enregistrer}--------------------------------------------

/**
 * Fonction qui sert à enregistrer une image de la simulation. 
 */
function enregistrer(){
	
	var texte = o_recupereJson(); //Pour avoir accès au contenu des fichiers json.

	if(document.getElementById('trace_present').value=="true") { //Lorsqu'il y a un tracé de simulation. 

		//On demande à l'utilisateur le nom du fichier, avec "traject_Kerr_B_P" comme nom du fichier par défaut :
		var nomFichier = prompt(texte.pages_trajectoire.message_nomFichier, "traject_Kerr_B_P");

		//Si l'utilisateur a renseigné un nom de fichier non null et qui n'est pas juste des blancs :
		if (nomFichier !== null && nomFichier.trim() !== '') {
			
			//Je récupère dans canvas3 l'élément d'ID "myCanvas3three" et dans context3 son context :
			canvas3 = document.getElementById("myCanvas3");
			context3 = canvas3.getContext("2d");

			//Je dessine sur context3 ce qu'il y a dans canvas, donc dans context donc le texte, rs et l'astre et le tracé :
			context3.drawImage(canvas, 0, 0);

			//Tracé sur le context3 de la boule du mobile :
			context3.beginPath();
			context3.fillStyle = COULEUR_BLEU;
			if (element2.value != "mobile"){ //Dans le référentiel de l'observateur distant : 
				context3.arc(posX2, posY2, 5, 0, Math.PI * 2);
			}else{ //Dans le référentiel du mobile :
				context3.arc(posX1, posY1, 5, 0, Math.PI * 2);
			}
			context3.lineWidth = "1";
			context3.fill();

			//Dessin du logo :
			var logo = new Image()
			logo.src='Images/CosmoGravity_logo.png'; //Je récupère le chemin de l'image du logo.
			logo.onload = function() {
				var largeurLogo = 100; //largeur de l'image du logo
				var hauteurLogo = (logo.height / logo.width) * largeurLogo; //hauteur de l'image du logo
				var x = canvas3.width - largeurLogo; // Position en x pour le coin inférieur droit du logo.
				var y = canvas3.height - hauteurLogo; // Position en y pour le coin inférieur droit du logo.
				context3.drawImage(logo,x,y, largeurLogo, hauteurLogo); //Je dessine le logo sur context3. 

			canvasToImage(canvas3, { //Je transforme le canvas en image :
				name: nomFichier.trim(),
				type: 'png'
			});

			//J'efface tout le contenu du context3 une fois le canvas enregistrer en tant qu'image :
			majFondFixe3();};

		} else { //Si il n'y a pas de nom de renseigné alors j'ai un message d'alerte.
			alert(texte.pages_trajectoire.alerte_nomFichier);
		}
	} else { //Si il n'y a pas de tracé de simulation alors message d'alerte.
		alert(texte.pages_trajectoire.message_enregistrer);
	}
}

// -------------------------------------{majFondFixe}--------------------------------------------

function majFondFixe(){phi_degres=phi0*180/Math.PI;
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Ajout d'un fond blanc pour l'exportation
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = "15pt bold";
	context.fillStyle = "black";
	context.fillText(texte.page_trajectoire_photon_kerr.titre,5,40);
	context.font = "13pt bold";
	context.fillText(texte.pages_trajectoire.entrees,5,70);
	context.font = "11pt normal";
	context.fillText("M = "+M.toExponential(3)+" kg",5,90);
	context.fillText("r\u2080 = "+r0.toExponential(3)+" m",5,110);
	context.fillText("a = "+a.toExponential(3)+" m",5,130);
	context.fillText("V\u2080 = "+c.toExponential(3)+" m.s\u207B\u00B9",5,150);
	context.fillText("\u03C6\u2080 = "+phi_degres.toExponential(3)+" °",5,170);
	if(document.getElementById('traject_type2').value=="observateur"){
		context.fillText(texte.pages_trajectoire.observateur,5,190);
	} 
	else { context.fillText(texte.pages_trajectoire.photon,5,190); }

}

function majFondFixe22(){
	context22.clearRect(0, 0, canvas.width, canvas.height);
}

function majFondFixe3(){
	context3.clearRect(0, 0, canvas.width, canvas.height);
}


function test_Jmax() { //teste si la valeur de J est supérieure à sa valeur maximale
  var texte = o_recupereJson();
  initialisation();
  J_max=G * Math.pow(M, 2) / c;
  if (Math.abs(J) > J_max) {
    alert(texte.page_trajectoire_massive_kerr.moment_angulaire +"("  + J_max.toExponential(4) + "\u0020kg.m\u00b2s\u207B\u00B9)"   );
    return false;
   
					 
			   
   
					   
  }
  else{
    return true;
  }
}

function test_r0(){
	var texte = o_recupereJson();
	initialisation();
	if(dr_sur_dlambda==0 && dphi_sur_dlambda==0) {	
		alert(texte.pages_trajectoire.vitesses_initiales_nulles);
		arretkerr();
	}		
	if(r0<=rhp){
		alert(texte.pages_trajectoire.rayonHorzInfRayon);
		return false;
	}
	else if(isNaN(E) || isNaN(L)){
		alert(texte.pages_trajectoire.EouLisNaN);
		return false;
	}
	else{
		return true;
	}
}

function tests_lancement(){
	var val_test=test_Jmax()&&test_r0();
	if(val_test==true){
	save_generalise(false);
	trajectoire();

    //  Le cas où les valeurs de E et L ne sont pas calculables(Test)
	if (isNaN(E) || isNaN(L)){
		document.getElementById("L").innerHTML = "Non calculable" ;
		document.getElementById("E").innerHTML = "Non calculable";
	}
  }
}

// crée les différentes couches visuelles
function creation_blocs(context){
	context.lineWidth = "1";
	var posX3 = (canvas.width / 2.0);
	var posY3 = (canvas.height / 2.0);
	if (((scale_factor * rs / rmax)) < 6) {
		context.beginPath();
		context.strokeStyle = COULEUR_RS;
		context.moveTo(posX3 - 10, posY3);
		context.lineTo(posX3 - 3, posY3);
		context.stroke();
		context.beginPath();
		context.moveTo(posX3 + 3, posY3);
		context.lineTo(posX3 + 10, posY3);
		context.stroke();
		context.beginPath();
		context.moveTo(posX3, posY3 - 10);
		context.lineTo(posX3, posY3 - 3);
		context.stroke();
		context.beginPath();
		context.moveTo(posX3, posY3 + 3);
		context.lineTo(posX3, posY3 + 10);
		context.stroke();
	} 
	else {
		context.beginPath();
		context.setLineDash([]);
		context.fillStyle = COULEUR_ERGOS;
		context.arc((canvas.width / 2.0), (canvas.height / 2.0), ((scale_factor * rs / rmax)), 0, Math.PI * 2);
		context.fill();
		context.beginPath();
		context.setLineDash([5, 5]);
		context.arc((canvas.width / 2.0), (canvas.height / 2.0), ((scale_factor * rhp / rmax)), 0, Math.PI * 2);
		context.fillStyle = 'white';
		context.fill();
		context.beginPath();
		context.setLineDash([5, 5]);
		context.arc((canvas.width / 2.0), (canvas.height / 2.0), ((scale_factor * rhp / rmax)), 0, Math.PI * 2);
		context.strokeStyle = COULEUR_RS;
		context.stroke();
		// tracé de RH- en bleue
		context.strokeStyle = 'blue';
		context.beginPath()
		
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, (rhm * scale_factor)/rmax, 0, 2 * Math.PI);
		context.stroke();
			// tracé de RH+ en rouge
		context.strokeStyle = 'red';
		context.beginPath();
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, (rhp * scale_factor)/rmax, 0, 2 * Math.PI);
		context.stroke();
		context.closePath();
		context.closePath();
		context.strokeStyle = COULEUR_RS;
		context.beginPath();
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, (rs * scale_factor)/rmax, 0, 2 * Math.PI);
		context.stroke();
		context.closePath();
		context.closePath();


		//la partie qui vient est ajouté par Khaled elle gere les infos bulles sur le graphe
		var infobulle = document.createElement('div');
		infobulle.id = 'infobulle_graphe';
		infobulle.className = 'infobulle_graphe';
		document.body.appendChild(infobulle);

		var canvas4 = document.getElementById('myCanvas4');
		var ctx = canvas4.getContext('2d');

		// Dessiner un cercle
		var circle_RHM = { x: posX3, y: posY3, radius: (rhm * scale_factor)/rmax };
		var circle_RHP = { x: posX3, y: posY3, radius: (rhp* scale_factor)/rmax };
		var circle_RS = { x: posX3, y: posY3, radius: (rs* scale_factor)/rmax };



		ctx.fillStyle = 'rgba(0, 0, 0, 0)';  // Remplissage transparent
		ctx.strokeStyle = 'rgba(0, 0, 0, 0)';  // Contour transparent
		ctx.beginPath();
		ctx.arc(circle_RHM.x, circle_RHM.y, circle_RHM.radius, 0, 2 * Math.PI);
		ctx.arc(circle_RHP.x, circle_RHP.y, circle_RHP.radius, 0, 2 * Math.PI);
		ctx.arc(circle_RS.x, circle_RS.y, circle_RS.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
		// Vérifier si la souris est proche du bord du cercle
		canvas4.addEventListener('mousemove', function(event) {
			var rect = canvas4.getBoundingClientRect();
			var mouseX = event.clientX - rect.left;
			var mouseY = event.clientY - rect.top;

			// Calculer la distance entre la souris et le centre du cercle
			var dx_RHM= mouseX - circle_RHM.x;
			var dy_RHM = mouseY - circle_RHM.y;

			var dx_RHP= mouseX - circle_RHP.x;
			var dy_RHP = mouseY - circle_RHP.y;

			var dx_RS= mouseX - circle_RS.x;
			var dy_RS = mouseY - circle_RS.y;

			var distanceFromCenter_RHM = Math.sqrt(dx_RHM * dx_RHM + dy_RHM * dy_RHM);
			var distanceFromCenter_RHP = Math.sqrt(dx_RHP * dx_RHP + dy_RHP * dy_RHP);
			var distanceFromCenter_RS = Math.sqrt(dx_RS * dx_RS + dy_RS * dy_RS);


			var onEdge_RHM = Math.abs(distanceFromCenter_RHM - circle_RHM.radius) <= 5;
			var onEdge_RHP= Math.abs(distanceFromCenter_RHP - circle_RHP.radius) <= 5;
			var onEdge_RS= Math.abs(distanceFromCenter_RS - circle_RS.radius) <= 5;




			if (onEdge_RHM) {
				infobulle.style.visibility = 'visible';
				infobulle.style.left = event.clientX + 'px';
				infobulle.style.top = "800" + 'px';//event.clientY + 'px';
				var latex = 'Rh-';
				infobulle.innerHTML = '\\(' + latex + '\\)';
				MathJax.typeset();
			} 
			else if (onEdge_RHP) {
				infobulle.style.visibility = 'visible';
				infobulle.style.left = event.clientX + 'px';
				infobulle.style.top = "750" + 'px';//event.clientY + 'px';
				var latex = 'Rh+';
				infobulle.innerHTML = '\\(' + latex + '\\)';
				MathJax.typeset();
			} 
			
			else if (onEdge_RS) {
				infobulle.style.visibility = 'visible';
				infobulle.style.left = event.clientX + 'px';
				infobulle.style.top = "700" + 'px';//event.clientY + 'px';
				var latex = 'rs';
				infobulle.innerHTML = '\\(' + latex + '\\)';
				MathJax.typeset();
			} 
			
			
			else {
				infobulle.style.visibility = 'hidden';
			}
		});

	}
	context.fillStyle = 'white';

	r2bis=(80*r0)/(scale_factor);
	r1bis=Math.round((80*r0)/(scale_factor*10**testnum(r2bis)));
	ech=r1bis*10**testnum(r2bis);
	xe=((r1bis*10**testnum(r2bis))*scale_factor)/r0;

	context.fillStyle = COULEUR_RS;
	context.fillText(ech.toExponential(1)+" m",605,90);
	context.stroke();
	context.beginPath();// Début du chemin
	context.strokeStyle = COULEUR_RS;

	//context.moveTo(canvas.width / 2.0,canvas.height / 2.0);    // Tracé test1
	//context.lineTo((canvas.width / 2.0)+280,canvas.height / 2.0);  // Tracé test2
	context.moveTo(600,110);
	context.lineTo(600+((r1bis*10**testnum(r2bis))*scale_factor)/r0,110);
	context.moveTo(600,105);
	context.lineTo(600,115);
	context.moveTo(600+((r1bis*10**testnum(r2bis))*scale_factor)/r0,105);
	context.lineTo(600+((r1bis*10**testnum(r2bis))*scale_factor)/r0,115);
	// Fermeture du chemin (facultative)
	context.stroke();

}



//Cette fonction viens d'ici
//https://gist.github.com/weepy/6009631
function CubicSolve(a, b, c, d){

	b /= a;
	c /= a;
	d /= a;

	var discrim, q, r, dum1, s, t, term1, r13;

	q = (3.0*c - (b*b))/9.0;
	r = -(27.0*d) + b*(9.0*c - 2.0*(b*b));
	r /= 54.0;

	discrim = q*q*q + r*r;

	var roots = [ {real: 0, i: 0}, {real: 0, i: 0}, {real: 0, i: 0} ]

	term1 = (b/3.0);

	if (discrim > 0) { // one root real, two are complex
		s = r + Math.sqrt(discrim);
		s = ((s < 0) ? -Math.pow(-s, (1.0/3.0)) : Math.pow(s, (1.0/3.0)));
		t = r - Math.sqrt(discrim);
		t = ((t < 0) ? -Math.pow(-t, (1.0/3.0)) : Math.pow(t, (1.0/3.0)));

		roots[0].real = -term1 + s + t;
		term1 += (s + t)/2.0;
		roots[2].real = roots[2].real = -term1;
		term1 = Math.sqrt(3.0)*(-t + s)/2;

		roots[1].i = term1;
		roots[2].i = -term1;
		return roots;
	} // End if (discrim > 0)

	// The remaining options are all real


	if (discrim == 0){ // All roots real, at least two are equal.
		r13 = ((r < 0) ? -Math.pow(-r,(1.0/3.0)) : Math.pow(r,(1.0/3.0)));
		roots[0].real = -term1 + 2.0*r13;
		roots[2].real = roots[1].real = -(r13 + term1);
		return roots;
	} // End if (discrim == 0)

	// Only option left is that all roots are real and unequal (to get here, q < 0)
	q = -q;
	dum1 = q*q*q;
	dum1 = Math.acos(r/Math.sqrt(dum1));
	r13 = 2.0*Math.sqrt(q);

	roots[0].real = -term1 + r13*Math.cos(dum1/3.0);
	roots[1].real = -term1 + r13*Math.cos((dum1 + 2.0*Math.PI)/3.0);
	roots[2].real = -term1 + r13*Math.cos((dum1 + 4.0*Math.PI)/3.0);

	return roots;
}
	

	
/**
 * Fonction qui permet de préparer le canvas de la simulation en fonction de si on choisit une trajectoire complète ou simple. 
 * @param {Number} compteur : numéro de la fusée entre 0 et le nombre de fusées total, sans dimension. 
 * @param {object} context : objet de contexte de rendu 2D obtenu à partir d'un élément <canvas> en HTML. Cet objet de contexte de rendu 2D contient toutes les méthodes et propriétés nécessaires pour dessiner la simulation en terme de graphes.
 * @param {Number} mobilefactor : le facteur d'échelle lié à ce mobile, sans dimension.
 * @param {Number} rmaxjson : valeur maximale de la coordonnée radiale, en m.   
 * @param {Number} r0ou2 : distance initiale au centre de l'astre qui est la plus grande parmi les différentes mobiles, en m.  
 */
function choixTrajectoire(context) {
	if (element.value == 'simple') {
		majFondFixe();
		// Tracé du Rayon de Schwarzchild,...
		creation_blocs(context);
		diametre_particule = DIAMETRE_PART*2;
	}else if (element.value=='complete'){
		diametre_particule = DIAMETRE_PART;
	}
}

function rafraichir2(context) {
	majFondFixe();
	creation_blocs(context); 
}
