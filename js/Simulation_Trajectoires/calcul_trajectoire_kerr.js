// variables globales
var r_part = 0;
var A_part = 0;
var J=0;
var A_init=0;
var A_part_obs = 0;
var A_init_obs=0;				   
var Dtau1=0;
var Dtau2=0;
var i = 1;
var j = 1;
var title = "V(r)/c² - 1";
var mini_obs=0;
var mini_mob=0;
var clicks = 0;
const DIAMETRE_PART = 1;
var scale_factor=280;
var z=0;
var z_obs=0;
var input=0;
var compteurVitesseAvantLancement = 0;
var distance_parcourue_totale=0; //Manon
var ns_avant_lancement=0;
var c = 299792458;
var G = 6.67385 * Math.pow(10, -11);

var point; //pour le graphe du potentiel


//puisqu'il faux initaliser data1 et data2 avant l'appel dans graphique_creation_pot
var data1 = [];
var data2 = [];

var onestarrete=0;
var peuxonrelancer = true;
var obs=0;
// liste de couleurs en hexa
const COULEUR_NOIR = '#2F2D2B';

const COULEUR_BLEU = '#4080A4';
const COULEUR_TURQUOISE='#AEEEEE';
const COULEUR_CYAN = '#7F008B8B';
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

	var texte = o_recupereJson(); //Cela me permettra de récupérer le texte pour les infobulles. 

	//Je récupère les différentes valeurs rentrées par l'utilisateur :
	M = Number(document.getElementById("M").value); //Masse de l'astre.
	r0 = Number(document.getElementById("r0").value); //Distance initiale au centre de l'astre.
	v0= Number(document.getElementById("v0").value); //Vitesse initiale du mobile.
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

	if(v0>c){
		alert(texte.pages_trajectoire.alerte_v0_superieure_c);
		return;
	}

	E=c*Math.sqrt((r0-rs)/(r0*(c**2-v0**2))); //Je calcule la constante d'intégration sans dimension E.
	L=(-1)*(a*c*rs/Math.sqrt(r0)-v0*Math.sin(tetarad)*Math.sqrt(r0*delta(r0)))/Math.sqrt((c**2-v0**2)*(r0-rs)); //Je calcule L la constante d'intégration. 
	vr=v0*Math.cos(tetarad)*c*Math.sqrt(delta(r0))/(r0*Math.sqrt(c**2-v0**2)); //Je calcule dr/dtau

	deltam_sur_m = 0; //J'initialise la valeur du rapport d'énergie consommée pendant le pilotage.
	puissance_consommee_calcul=0; //J'initialise la valeur de la puissance consommée pendant le pilotage.
	nombre_de_g_calcul = 0; // Pareil pour le nombre de g ressenti. 
	vitesse_precedente_nombre_g = 0; //Pareil pour la vitesse précédent le pilotage. 

	//Je calcule Rh+ (rhp), Rh- (rhm) et rh (qui sert au calcul de rmax) :
	rh = G * M / Math.pow(c, 2) * (1 + Math.sqrt(1 - Math.pow(J * c / (G * M * M), 2))); //Rayon de Kerr.
	rhp = 0.5*(rs+Math.sqrt((rs**2)-4*(a**2)));
    rhm = 0.5*(rs-Math.sqrt((rs**2)-4*(a**2)));
	
	//Je calcule la gravité de surface théorique pour R=Rh+.
	gravSurface = 0.5 * Math.pow(c, 2) * (Math.pow(rhp, 2) - Math.pow(a, 2)) / (Math.pow(rhp, 2) + Math.pow(a, 2))/rhp;

	//Je calcule la distance radiale maximale que je pourrais atteindre : 
	if( (E>0.99999 && E<1.00001) && (Math.pow(L,4)- Math.pow(2*rs*(L-a),2)) > 0 ){ 
		rmax=1.1*r0;	
   	} 
	else if (E==1 && L==0) {rmax=2*r0;} 
	else { 
		calcul_rmax(); 
		if(rmax<r0) {rmax=r0 ;}
	} 


	if (r0 <= rs){//Dans le cas où le r0 choisit est inférieure à rs j'affiche une alerte.
		alert(texte.pages_trajectoire.alerte_r0_inferieure_rs);
		return;
	} 

	//--------------------------------Calcul des vitesses pour les orbites circulaires--------------------------------


	Y_orbites = (rs/2)*Math.pow(r0,5); //Intermédiaire de calculs.

	//Calcul des E pour les orbites progrades et rétrogrades : 
	E_prograde = (Math.pow(r0,3)*(r0-rs)+a*Math.sqrt(Y_orbites))/(Math.pow(r0,2)*Math.sqrt(Math.pow(r0,3)*(r0-(3/2)*rs)+2*a*Math.sqrt(Y_orbites))); //ManonCirculaire
	E_retrograde = (Math.pow(r0,3)*(r0-rs)-a*Math.sqrt(Y_orbites))/(Math.pow(r0,2)*Math.sqrt(Math.pow(r0,3)*(r0-(3/2)*rs)-2*a*Math.sqrt(Y_orbites))); //ManonCirculaire

	//Si je n'ai pas de E alors l'orbite correspondante n'existe pas sinon je calcule la vitesse correspondante :
	//Cas de l'orbite prograde :
	if (isNaN(E_prograde)){ //ManonCirculaire
		vitesse_orbite_circulaire_prograde_bar = NaN;
	}else{
		vitesse_orbite_circulaire_prograde_bar = c*Math.sqrt(1-(1-(rs/r0))/Math.pow(E_prograde,2))
	}
	//Cas de l'orbite rétrograde :
	if (isNaN(E_retrograde)){ //ManonCirculaire
		vitesse_orbite_circulaire_retrograde_bar = NaN;
	}else{
		vitesse_orbite_circulaire_retrograde_bar = c*Math.sqrt(1-(1-(rs/r0))/Math.pow(E_retrograde,2))
	}

	//Je calcule mes limites de stabilités pour les orbites progrades et rétrogrades : 
	r_stabilite = (-3*rs*Math.pow((L-a*E),2))/(Math.pow(a,2)*(Math.pow(E,2)-1)-Math.pow(L,2)); 
	vitesse_orbite_criculaire_prograde_bar_limite_stabilite = (c*Math.sqrt(2*rs*Math.pow(r_stabilite,5)*delta(r_stabilite))) / (2*Math.pow(r_stabilite,4) - 2*Math.pow(r_stabilite,3)*rs + a*Math.sqrt(2*rs*Math.pow(r_stabilite,5))); 
	vitesse_orbite_criculaire_retrograde_bar_limite_stabilite = (c*Math.sqrt(2*rs*Math.pow(r_stabilite,5)*delta(r0))) / (2*Math.pow(r_stabilite,4) - 2*Math.pow(r_stabilite,3)*rs - a*Math.sqrt(2*rs*Math.pow(r_stabilite,5))); 

	if (!isNaN(E_prograde)){ //Dans les cas où j'ai bien une orbite prograde.
		//En fonction de la stabilité j'affiche une infobulle sur la vitesse : 
		if (vitesse_orbite_circulaire_prograde_bar >= vitesse_orbite_criculaire_prograde_bar_limite_stabilite){
			document.getElementById("circulaire_prograde_res_bar").title=texte.pages_trajectoire.orbite_circulaire_instable;
		}else{
			document.getElementById("circulaire_prograde_res_bar").title=texte.pages_trajectoire.orbite_circulaire_stable;
		}
	}else{ //Si je n'ai pas d'orbite prograde j'enlève l'infobulle.
		document.getElementById("circulaire_prograde_res_bar").removeAttribute("title");
	}

	if (!isNaN(E_retrograde)){ //Dans le cas où j'ai bien une orbite rétrograde.
		//En fonction de la stabilité j'affiche une infobulle sur la vitesse :
		if (vitesse_orbite_circulaire_retrograde_bar >= vitesse_orbite_criculaire_retrograde_bar_limite_stabilite){
			document.getElementById("circulaire_retrograde_res_bar").title=texte.pages_trajectoire.orbite_circulaire_instable;
		}else{
			document.getElementById("circulaire_retrograde_res_bar").title=texte.pages_trajectoire.orbite_circulaire_stable;
		}
	}else{ //Si je n'ai pas d'orbite rétrograde j'enlève l'infobulle.
		document.getElementById("circulaire_retrograde_res_bar").removeAttribute("title");
	}

	//Je récupère les cellules liées aux orbites prograde et rétrograde :
	CirculaireProgradeBarLabelCell = document.getElementById("circulaire_prograde_bar");
	CirculaireProgradeBarCell = document.getElementById("circulaire_prograde_res_bar");
	CirculaireRetrogradeBarLabelCell = document.getElementById("circulaire_retrograde_bar");
	CirculaireRetrogradeBarCell = document.getElementById("circulaire_retrograde_res_bar");

	if (isNaN(E_prograde)){ //Si il n'y a pas d'orbite prograde je n'affiche pas les cases liées :
		document.getElementById("circulaire_prograde_res_bar").innerHTML="";
		CirculaireProgradeBarCell.style.display='none';
		CirculaireProgradeBarLabelCell.style.display='none';
	}else{ //Sinon je les affiches avec la valeur de la vitesse nécessaire.
		document.getElementById("circulaire_prograde_res_bar").innerHTML=vitesse_orbite_circulaire_prograde_bar.toExponential(4); 
		CirculaireProgradeBarCell.style.display='';
		CirculaireProgradeBarLabelCell.style.display='';
	}

	if (isNaN(E_retrograde)){ //Si il n'y a pas d'orbite rétrograde je n'affiche pas les cases liées :
		document.getElementById("circulaire_retrograde_res_bar").innerHTML=""; 
		CirculaireRetrogradeBarCell.style.display='none';
		CirculaireRetrogradeBarLabelCell.style.display='none';
	}else{ //Sinon je les affiches avec la valeur de la vitesse nécessaire.
		document.getElementById("circulaire_retrograde_res_bar").innerHTML=vitesse_orbite_circulaire_retrograde_bar.toExponential(4); 
		CirculaireRetrogradeBarCell.style.display='';
		CirculaireRetrogradeBarLabelCell.style.display='';
	}

	//--------------------------------Affichage--------------------------------
	
	//J'affiche sur la page le paramètre de spin, le rayon de SCH, les constantes E et L et gravité de surface. 
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
	boutonAvantLancement(); //J'associe aux différents boutons les fonctions associées d'avant le lancement. 
} 

//----------------------------------------------------{verifnbr}----------------------------------------------------

function verifnbr() {

	r0 = document.getElementById("r0").value;
	M = document.getElementById("M").value;
	J = document.getElementById("J").value;

	if (isNaN(r0)){
		alert ("Veuillez vérifier vos saisie en r0");}

	if (isNaN(M)){
		alert ("Veuillez vérifier vos saisie en M");
	}
	if (isNaN(J)){
		alert ("Veuillez vérifier vos saisie en J");
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
		$("#grsvg_2").empty(); //Je vide le contenue du canvas du potentiel.  

		SurTelephone(); //Affichage de l'information sur les touches claviers en fonction de la taille de l'écran.

		//Interdiction de changer les valeurs de M, r0, J, teta, phi0 une fois la simulation lancée : 
		document.getElementById('M').disabled = true;
		document.getElementById('r0').disabled = true;
		document.getElementById('J').disabled = true;
		document.getElementById('teta').disabled = true;
		document.getElementById('phi0').disabled = true;

		element2=document.getElementById('traject_type2'); //Récupère la valeur de si on est en mode observateur ou en mode spationaute.

		if(element2.value == "mobile") { //Dans le cas spationaute. 
			//Permet de faire apparaître les options de pilotages et les cases reliées concernant le nombre de g ressenti ainsi que la distance parcourue :
			document.getElementById("joyDiv").style.visibility='visible';
			document.getElementById("nb_g").style.visibility='visible'; 
			document.getElementById("g_ressenti").style.visibility='visible'; 
			document.getElementById("dernier_g").style.visibility='visible'; 
			document.getElementById("dernier_g_res").style.visibility='visible'; 
			document.getElementById("puissance_consommee").style.display='';
			document.getElementById("puissance_consommee_label").style.display='';
		}else{ //Dans le cas observateur distant.
			//Permet de faire disparaître les cases concernant le nombre de g ressenti et la distance parcourue :
			document.getElementById("g_ressenti").style.display='none'; 
			document.getElementById("nb_g").style.display='none'; 
			document.getElementById("dernier_g").style.display='none'; 
			document.getElementById("dernier_g_res").style.display='none'; 
			document.getElementById("puissance_consommee").style.display='none';
			document.getElementById("puissance_consommee_label").style.display='none';
		}

		//Interdiction de changer les valeurs des modes observateur et spationaute une fois la simulation lancée : 
		document.getElementById('r3').disabled = true; //Observateur
		document.getElementById('r4').disabled = true; //Spationaute.

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
		A_init = vr; //dr/dτ initiale du mobile dans son référentiel.
		r_init = r0; //Position radiale initiale du mobile dans son référentiel. 
		A_part = A_init; //dr/dτ du mobile dans son référentiel.
		r_part = r_init; //Position radiale du mobile dans son référentiel. 	 
		A_init_obs = vr*delta(r0)/( (Math.pow(r0,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r0)*E - rs*a*L/r0 ); //dr/dt initiale du mobile dans le référentiel de l'observateur distant.
		A_part_obs=A_init_obs; //dr/dt du mobile dans le référentiel de l'observateur distant. 												   
		r_init_obs = r0; //Position radiale initiale du mobile dans le référentiel de l'observateur distant. 
		r_part_obs=r_init_obs; //Position radiale du mobile dans le référentiel de l'observateur distant. 	

		temps_particule = 0; //Temps du mobile dans son référentiel propre.
		temps_observateur = 0; //Temps de l'observateur distant. 

		temps_chute_libre = (Math.PI * r0 * Math.sqrt(r0 / (2 * G * M)) / 2); //Calcul du temps de chute libre.
		dtau= temps_chute_libre*1e-3; //Je fixe le pas de temps à une fraction du temps de chute libre.

		deltam_sur_m = 0; //ΔE/E consommé pendant le pilotage.
		temps_chute_libre = (Math.PI * r0 * Math.sqrt(r0 / (2 * G * M)) / 2);
	
		clavierEvenement(false); //Permet une fois démarrée de gérer la simulation avec les touches du clavier.

		//--------------------------------Positions de départ du mobile--------------------------------

		x1part = scale_factor * r0 * Math.cos(phi) / rmax; //x dans le référentiel du mobile.
		y1part = scale_factor * r0 * Math.sin(phi) / rmax; //y dans le référentiel du mobile.
		x1obs = scale_factor * r0 * Math.cos(phi_obs) / rmax; //x dans le référentiel de l'observateur distant.
		y1obs = scale_factor * r0 * Math.sin(phi_obs) / rmax; //y dans le référentiel de l'observateur distant. 

		//--------------------------------Gestion du canvas--------------------------------

		canvas = document.getElementById("myCanvas");
		if (!canvas) { //Si je n'ai pas de canvas récupérable pour la simulation alors message d'alerte et simulation impossible. 
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

		myInterval = setInterval(animate, 10 / 6); //La fonction animate est exécutée toutes les 10/6 ms pour créer la simulation;

		//Associe au bouton pause la fonction pausee permettant de mettre la simulation en pause : 
		document.getElementById('bouton_pause').addEventListener('click', function() {
			pausee();
		}, false);

		//--------------------------------Gestion du pilotage--------------------------------

		var temps_allumage_reacteur = Number(document.getElementById("temps_allumage").value); //Récupération du temps d'allumage des réacteurs à chaque click. 
		temps_allumage_reacteur = temps_allumage_reacteur*Math.pow(10,-3); //Conversion des ms du temps d'allumage des réacteurs en s.
		var puissance_reacteur = Number(document.getElementById("puissance_reacteur").value); //Récupération de la puissance des réacteurs en W/kg.
		var temps_total_reacteur=0; //Initialisation du temps total d'allumage des réacteurs au cours du pilotage. 


		if (element2.value=="mobile"){//Dans le cas spationaute
			setInterval(function(){ //J'effectue les actions suivantes toutes les 50 ms. 

				if (Number(deltam_sur_m) <= 0.03) { //Si je consomme moins de ΔE/E=0.03 la led près du décalage spectrale est verte.
					document.getElementById('DivClignotantePilot').innerHTML = " <img src='./Images/diodever.gif' height='14px' />";
					document.getElementById('DivClignotantePilot').style.color = "green";
				}
				else if (0.3 < Number(deltam_sur_m) && Number(deltam_sur_m) < 0.05) { //Si je consomme entre ΔE/E=0.03 et ΔE/E=0.05 la led près du décalage spectrale est orange.
					document.getElementById('DivClignotantePilot').innerHTML = " <img src='./Images/diodejaune.gif' height='14px' />";
					document.getElementById('DivClignotantePilot').style.color = "yellow";
				} 
				else if (Number(deltam_sur_m) >= 0.05) { //Si je consomme plus de ΔE/E=0.05 la led près du décalage spectrale est rouge. 
					document.getElementById('DivClignotantePilot').innerHTML = " <img src='./Images/dioderouge.gif' height='14px' />";
					document.getElementById('DivClignotantePilot').style.color = "red";
				}

				if (joy.GetPhi()!=0){ //Contrôle du pilotage
					if (isNaN(vtot)){ //Dans le cas où je n'ai pas de vitesse une fois rs dépassée je ne dois pas pouvoir piloter.
						joy.GetPhi()=0; 
					}else{ //Autrement il est possible de piloter.

						vitesse_precedente_nombre_g = vtot; //Stockage de la vitesse précédent l'accélération pour le calcul du nombre de g ressenti. 

						Delta_E_sur_E = joy.GetPhi()*(puissance_reacteur*temps_allumage_reacteur)/Math.pow(c,2); //Calcul du ΔE/E en fonction de la puissance et du temps d'allumage des réacteurs.
						Delta_L_sur_L = Delta_E_sur_E; 

						L = L + L*Delta_L_sur_L; //Calcul du nouveau L associé à ce mobile.
						E = E + E*Delta_E_sur_E //Calcul du nouveau E associé à ce mobile. 
						deltam_sur_m = deltam_sur_m + Math.abs(Delta_E_sur_E); //Calcul de l'énergie ΔE/E consommée au total.
						temps_total_reacteur = Math.abs(joy.GetPhi()*temps_allumage_reacteur); //Calcul du temps total durant lequel les réacteurs sont allumés.
						puissance_consommee_calcul = (deltam_sur_m/temps_total_reacteur)*Math.pow(c,2); //Calcul de la puissance consommée au total en W/kg. 

						document.getElementById("E").innerHTML = E.toExponential(3); //Affichage sur le site du nouveau E. 
						document.getElementById("L").innerHTML = L.toExponential(3); //Affichage sur le site du nouveau L. 
						document.getElementById("decal").innerHTML = deltam_sur_m.toExponential(3); //Affichage sur le site de l'énergie consommée.
						document.getElementById("puissance_consommee").innerHTML = puissance_consommee_calcul.toExponential(3); //Affichage sur le site de la puissance consommée. 
					}

				}
			}, 50);
		}
		
		
		//--------------------------------Gestion des boutons d'accélération/décélération--------------------------------

		document.getElementById('plusvite').removeEventListener('click',foncPourVitAvantLancement,false); //Je désassocie la fonction foncPourVitAvantLancement du bouton pour accélérer une fois la simulation commencée.
		document.getElementById('moinsvite').removeEventListener('click',foncPourVitAvantLancement,false); //Je désassocie la fonction foncPourVitAvantLancement du bouton pour décélérer une fois la simulation commencée.

		Dtau1 = 1e8*temps_chute_libre ; //Pour permettre une accélération.
		Dtau2 = temps_chute_libre / 1e8; //Pour permettre une décélération.

		document.getElementById('plusvite').addEventListener('click', function() { //J'associe le bouton accélérer à la fonction suivante une fois la simulation lancée. 
			if (dtau >= Dtau1) { //Je mets une limite à mon accélération possible qui est Dtau1.
				dtau = Dtau1;} 
			else { //Autrement j'accélére et j'incrèmente le clicks qui comptabilise les accélération/décélération.
				dtau += dtau;
				clicks += 1 ;
			}
			document.getElementById('nsimtxt').innerHTML= "ns="+ clicks.toString(); //J'affiche le ns correspondant sur le site.
		}, false);


		document.getElementById('moinsvite').addEventListener('click', function() {//J'associe le bouton décélérer à la fonction suivante une fois la simulation lancée. 
			if (dtau <= Dtau2) { //Je mets une limite à ma décélération possible qui est Dtau2.
				dtau = Dtau2;
			}else{ //Autrement je décélère et j'incrèmente le clicks qui comptabilise les accélération/décélération.
				dtau /= 2;
				clicks -= 1 ;
			}
			document.getElementById('nsimtxt').innerHTML= "ns="+ clicks.toString(); //J'affiche le ns correspondant sur le site.
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

		document.getElementById('moinszoom').removeEventListener('click',function(){foncPourZoomMoinsAvantLancement(false)}, false); //Je désassocie foncPourZoomMoinsAvantLancement du bouton pour dézoomer une fois la simulation commencée.
		document.getElementById('pluszoom').removeEventListener('click',function(){foncPourZoomPlusAvantLancement(false)}, false); //Je désassocie foncPourZoomPlusAvantLancement du bouton pour zoomer une fois la simulation commencée.

		document.getElementById('moinszoom').addEventListener('click', function() { //J'associe le bouton dézoomer à la fonction suivante une fois la simulation lancée.
			scale_factor /= 1.2;
			//J'ajuste les positions sur le canvas avec le nouveau facteur d'échelle :
			posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2);
			posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2);
			posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2);
			posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2);	
			majFondFixe22(); //Je mets à jour tout ce qui est relié au dessin du mobile.																		   
			rafraichir2(context); //Redessine les rayons Rh+, Rh- et rs un fond blanc avec les entrées à gauche. 
			input-=1;
			document.getElementById('nzoomtxt').innerHTML= "nz="+ input.toString(); //Mets à jour l'affichage du zoom sur le site. 
		}, false);


		document.getElementById('pluszoom').addEventListener('click', function() { //J'associe le bouton zoomer à la fonction suivante une fois la simulation lancée.
			//J'ajuste les positions sur le canvas avec le nouveau facteur d'échelle :
			scale_factor *= 1.2;
			posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2);
			posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2);
			posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2);
			posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2);
			majFondFixe22(); //Je mets à jour tout ce qui est relié au dessin du mobile.																						  
			rafraichir2(context); //Redessine les rayons Rh+, Rh- et rs un fond blanc avec les entrées à gauche. 
			input+=1;
			document.getElementById('nzoomtxt').innerHTML= "nz="+ input.toString(); //Mets à jour l'affichage du zoom sur le site.
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
			input=0;
			document.getElementById('nzoomtxt').innerHTML= "nz="+ input.toString(); //Mets à jour l'affichage du zoom sur le site.
		}, false);

		//Partie qui permet de mettre à l'échelle le dessin de l'astre et du rayon de SCH vis à vis des zooms avant le lancement de la simulation : 
		if (ns_avant_lancement < 0) {
			for (incr = 0; incr > ns_avant_lancement; incr -= 1) {
				scale_factor = scale_factor / 1.2;
			}
		} else if (ns_avant_lancement > 0) {
			for (incr = 0; incr < ns_avant_lancement; incr += 1) {
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

		document.getElementById('clear').addEventListener('click', function() { //Lorsque j'appuie sur le bouton reset la fenêtre est rechargée et le mode observateur est choisit par défaut. 
			rafraichir();
		}, false);		
	
		creation_blocs(context); //Je trace Rh+, Rh- et rs. 
	  
		setInterval(function(){ //Fonction qui permet d'avoir un graphe de potentiel dynamique. Ce graphe est renouvelé toutes les 300ms. 												
			$('#grsvg_2').empty(); //Je vide le contenue du canvas du potentiel. 
			data1=[]; 
			data2=[];																
 		  								
			if (element2.value == "observateur"){ //Dans le cas de l'observateur distant. 

				dr = 0.6*r_part_obs/ 50; //Je calcule l'incrément dr.
		
   				for (r = 0.7*r_part_obs; r < 1.3*r_part_obs; r += dr) { //Je parcours une gamme de valeurs de r centrée autour de mobile.r_part_obs en incrémentant de mobile.dr .
      				V = Vr_obs(r); //Je calcule le potentiel pour chaque r.
      				data1.push({date: r, close: V }); //Je stocke dans data1 les valeurs de r et V.
    			}
	
    			V = Vr_obs(r_part_obs); //Je calcule le potentiel à la position actuelle.
    			data2.push({date: r_part_obs, close: V }); //Je stocke dans data2 les valeurs de r et V de la position actuelle.

			}else{ //Dans le cas du mobile je procède de manière identique.

				dr = 0.6*r_part/ 50;
	 
				for (r = 0.7*r_part; r < 1.3*r_part; r += dr) { 								   
     				V = Vr_mob(r);
      				data1.push({date: r, close: V });
    			}

    			V = Vr_mob(r_part);
    			data2.push({date: r_part, close: V });  
  
	 		}

			point=graphique_creation_pot(0,data1,data2,null,null); //Trace le graphe du potentiel.
	
		},300);	
	
	} else { //Dans le cas où ce n'est pas le début de la simulation et où je ne suis pas en pause.
    	myInterval = setInterval(animate, 10/6); //La fonction animate est exécutée toutes les 10/6 ms pour créer la simulation;
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

	onestarrete=0; // condition pour arreter le mobile
	element = document.getElementById('traject_type'); // on recupere le boutton de type de trajectoire
	element2=document.getElementById('traject_type2');//on recupere le boutton de observateur ou mobile
	SurTelephone();//on verifie si on est sur telephone ou ordinateur
	choixTrajectoire(context);// on vérifie le type de trajectoire sélectionné

	/*----------------------------------------------------------{{{{  CAS_OBSERVATEUR  }}}-----------------------------------------------------------*/
	if (element2.value != "mobile")
	//Tout ce qui est dans cette condition concerne le cas du referentiel de l'observateur	
	{
		/* Une condition pour ne pas calculer audela de RH+ */
		if(r_part_obs >rhp*1.0000001)
		{
			//-----------------------------------------------------PARTIE CALCULE-----------------------------------------------------------
			val_obs = rungekutta_obs(dtau, r_part_obs, A_part_obs); //calcul de l'equation differentielle avec RK4 ça donne le r et dr/dt

			r_part_obs = val_obs[0]; //valeur de r calculée par RK (Runge Kutta)
			A_part_obs = val_obs[1]; //valeur de dr/dtau calculée par RK

			pvr=0;//pvr c'est la projection de la vitesse totale sur la direction de l'observateur ici = 0 car on a prit l'observateur est perpendiculaire au plan de mouvement du mobile
			
			temps_particule += dtau*delta(r_part_obs)/( (Math.pow(r_part_obs,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r_part_obs)*E - rs*a*L/r_part_obs );//calcul temps du mobile
			
			//Calcul du gradient d'accélération
			gm = derivee_seconde_Kerr_massif_obs(r_part_obs);
			gmp = derivee_seconde_Kerr_massif_obs(r_part_obs + 1);
			fm = Math.abs(gm - gmp);

			if(r_part_obs>rs*1.000001)
			{
				/*Calcul des vitesses dans metrique de Kerr qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
				Fonctions_utilitaires_trajectoire):*/
				resulta=calculs.MK_vitess(E,L,a,r_part_obs,rs,false); 
				vtot=resulta[0]; //	vitesse total ( module )
				//calcul de la vitesse radiale en tenant compte du signe de la derivée calculée avec RK
				vr_3_obs=resulta[1]*Math.sign(A_part_obs); 
				vp_3_obs= resulta[2]; //calcul de la vitesse angulaire

				z_obs=(1+pvr/c)/((1-(vtot/c)**2)**(1/2))*(1-rs/r_part_obs)**(-1/2)-1;//calcul du decalage spectrale

				distance_parcourue_totale+=vtot*dtau*delta(r_part_obs)/( (Math.pow(r_part_obs,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r_part_obs)*E - rs*a*L/r_part_obs ); //calcul de la distance parcourue


				//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------

				//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AVANT RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			
				document.getElementById("vrk").innerHTML = vr_3_obs.toExponential(3);
				document.getElementById("vpk").innerHTML = vp_3_obs.toExponential(3);
				document.getElementById("v_tot").innerHTML = vtot.toExponential(3);
				document.getElementById("distance_parcourue").innerHTML = distance_parcourue_totale.toExponential(3); 
				document.getElementById("decal").innerHTML=z_obs.toExponential(3)
			}

			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> APRES RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			else
			{ 
				 //on affiche que les vitesses et distance parcourue ne sont plus definies	
				document.getElementById("v_tot").innerHTML = texte.page_trajectoire_massive_kerr.vitesse_pas_définie;
				document.getElementById("vrk").innerHTML = texte.page_trajectoire_massive_kerr.vitesse_pas_définie;
				document.getElementById("vpk").innerHTML = texte.page_trajectoire_massive_kerr.vitesse_pas_définie;
				document.getElementById("distance_parcourue").innerHTML = texte.page_trajectoire_massive_kerr.vitesse_pas_définie; 
				document.getElementById("decal").innerHTML=1/0;

			}
			/*Les variables suivantes s'affiche de la meme manière meme apres Rs:*/
			document.getElementById("ga").innerHTML = fm.toExponential(3);
			document.getElementById("r_par").innerHTML = r_part_obs.toExponential(3);
			document.getElementById("tp").innerHTML = temps_particule.toExponential(3);
		}

		//	Quand on arrive à RH+ 
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

		//-----------------------------------------------------PARTIE TRACÉ POTENTIEL -------------------------------------------------
		data2 = []; //on vide la liste dans la quelle on met nos données
		V = Vr_obs(r_part_obs); // on recupere la valeur du poteniel au rayon actuel
		data2.push({date: r_part_obs, close: V }); //on met les valeur dans la liste
		if(point !== undefined){update_graphique_2(point,data2,null);} // on appelle la fonction qui dessine le potentiel (Fonctions_utilitaires)

		//-----------------------------------------------------PARTIE TRACÉ -------------------------------------------------
		//on dessine le trait derriere le mobile
		context.beginPath();//on ouvre le context
		context.fillStyle = COULEUR_NOIR;//on choisit la couleur pour remplir parce que c'est fill
		context.rect(posX2, posY2, 1, 1);//on dessine le tracé
		context.lineWidth = "1";//en choisissant la bonne largeur des traits
		context.fill();//on le met sur le canva

		majFondFixe22(); // on efface l'ancienne position de la boule

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
			var temps_allumage_reacteur = Number(document.getElementById("temps_allumage").value); //recuperation de la valeur de l'input de temps d'allumage
			/*Ce qui suit verifie si on a appuyé pour accelerer et adapte le pas de calcul pour RK:*/
			if (joy.GetPhi()!=0)
			{
				/*Calcul avec RK4 avec un dtau de temps d'allumages des reacteurs dans le cas d'une acceleration de la part du spationaute */
				val = rungekutta(temps_allumage_reacteur, r_part, A_part); 
			}
			else
			{
				//calcul avec RK4 avec le dtau par defaut
				val = rungekutta(dtau, r_part, A_part); 
			}

			r_part = val[0]; //on recupere le resultat de RK pour le rayon
			A_part = val[1]; //on recupere le resultat de RK pour le dr/dtau
			
			/*Calcul des vitesses dans metrique de KERR qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
			Fonctions_utilitaires_trajectoire):*/
			resulta=calculs.MK_vitess(E,L,a,r_part,rs,false); 
			vtot=resulta[0]; //calcul de la vitesse total
			 //calcul de la vitesse radiale en tenant compte du signe de la derivée calculée avec RK
			vr_3=resulta[1]*Math.sign(A_part);
			vp_3=resulta[2]; //calcul de la vitesse angulaire

			if(J==0) {vp_3= c*L/r_part;} //pour calculer la vitesse angulaire si J=0 

			/*Ce qui suit verifie si on a appuyé pour accelerer et calcul le nombre de g :*/
			if(joy.GetPhi()!=0)
			{ 
				nombre_de_g_calcul = (Math.abs(vtot-vitesse_precedente_nombre_g)/(temps_allumage_reacteur))/9.80665 //calcul du nombre de g ressenti
				nombre_de_g_calcul_memo = nombre_de_g_calcul; // on stocke sa valeur pour afficher la derniere valeur calculée
			}
			else //apres chaque acceleration il devient nul
			{
				nombre_de_g_calcul_memo = 0;
			}
			
			distance_parcourue_totale+=vtot*dtau; //calcul de la distance parcourue

			temps_particule+=dtau; //calcul du temps du mobile
			temps_observateur+=dtau*( (Math.pow(r_part,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r_part)*E - rs*a*L/r_part )/delta(r_part); //calcul du temps observateur
		
			// calcul gradient d'accélération
			gm = derivee_seconde_Kerr_massif(r_part);
			gmp = derivee_seconde_Kerr_massif(r_part + 1);
			fm = Math.abs(gm - gmp);

			varphi = c *dtau* ( rs*a*E/r_part + (1-rs/r_part)*L )/delta(r_part);//calcul de la variation de l'angle phi
			phi = phi + varphi; //on l'ajoute à la valeur precedente 

			//Calcul des positions X, Y pour le tracé
			posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2.);
			posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2.);
			

			//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------

		    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AVANT RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			if (r_part>rs*1.000001)
				{
					document.getElementById("to").innerHTML = temps_observateur.toExponential(3); //temps observateur
					document.getElementById("ga").innerHTML = fm.toExponential(3); // gradient d'acceleration
					document.getElementById("vrk").innerHTML = vr_3.toExponential(3); // vitesse radiale
					document.getElementById("vpk").innerHTML = vp_3.toExponential(3); //vitesse angulaire
					document.getElementById("v_tot").innerHTML = vtot.toExponential(3); //vitesse total (module)
					document.getElementById("distance_parcourue").innerHTML = distance_parcourue_totale.toExponential(3); //distance parcourue
					/* Decalage spectrale */
					if(deltam_sur_m ==0) {document.getElementById("decal").innerHTML="";}	
					else{document.getElementById("decal").innerHTML=deltam_sur_m.toExponential(3);}
				}
			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> APRES RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			else
			{
				document.getElementById("ga").innerHTML = fm.toExponential(3);// gradient d'acceleration
				//on affiche que les vitesses et distance parcourue ne sont plus definies	
				document.getElementById("v_tot").innerHTML = texte.page_trajectoire_massive_kerr.vitesse_pas_définie; //vitesse total (module)
				document.getElementById("vrk").innerHTML = texte.page_trajectoire_massive_kerr.vitesse_pas_définie; // vitesse radiale
				document.getElementById("vpk").innerHTML = texte.page_trajectoire_massive_kerr.vitesse_pas_définie;//vitesse angulaire
				document.getElementById("distance_parcourue").innerHTML = texte.page_trajectoire_massive_kerr.vitesse_pas_définie; //distance parcourue
				
				document.getElementById("joyDiv").style.display = 'none'; //on enleve le pilotage
				/*Au dela de RH+ le temps observateur et gradient d'acceleration sont infinis */
				if (r_part<=rhp)
				{	
					document.getElementById("to").innerHTML = 1/0; 	
					document.getElementById("ga").innerHTML = 1/0;
				}
			 }
			 /*Ces variables sont affichées independament de si on a depassé Rs ou RH+ */
			 document.getElementById("r_par").innerHTML = r_part.toExponential(3); //rayon
			 document.getElementById("g_ressenti").innerHTML = nombre_de_g_calcul_memo.toExponential(3); //nombre de g ressenti
			 document.getElementById("dernier_g_res").innerHTML = nombre_de_g_calcul.toExponential(3); //dernier g 
			 document.getElementById("tp").innerHTML = temps_particule.toExponential(3);  //temps du mobile
		}	

		else
		{	
			r_part=0; // on met la valeur theorique du rayon
			document.getElementById("r_par").innerHTML = r_part.toExponential(3); //on l'affiche
			document.getElementById("ga").innerHTML = 1/0; //on affiche un gradient infini
			arretkerr(); //on arrete la simulation
		}
		
		//-----------------------------------------------------PARTIE TRACÉ -------------------------------------------------
		//Dessin du tracé derriere la particule
		context.beginPath();
		context.fillStyle = COULEUR_ROUGE_COSMO; 
		/*On dessine le tracé derriere la particule en evitant les problemes de r non defini :*/
		if (r_part==0){context.rect((canvas.width / 2.), (canvas.height / 2.), 1,1);} 
		else{context.rect(posX1, posY1, 1, 1);}
		context.lineWidth = "1";
		context.fill();

		majFondFixe22(); // on efface l'ancienne position de la boule

		//Dessin du de la boule avec les memes etapes
		context22.beginPath();
		context22.fillStyle = COULEUR_BLEU;
		/*On dessine la particule en evitant les problemes de r non defini :*/
		if (r_part==0){context22.arc((canvas.width / 2.), (canvas.height / 2.) , 5, 0, Math.PI * 2); }
		else{ context22.arc(posX1, posY1 , 5, 0, Math.PI * 2);}
		context22.lineWidth = "1";
		context22.fill();

		//-----------------------------------------------------PARTIE TRACÉ POTENTIEL -------------------------------------------------
		
		data2 = []; //on vide la liste dans la quelle on met nos données
		V = Vr_mob(r_part);// on recupere la valeur du poteniel au rayon actuel
		data2.push({date: r_part, close: V });	//on met les valeur dans la liste
		if(point !== undefined){update_graphique_2(point,data2,null)} ; // on appelle la fonction qui dessine le potentiel (Fonctions_utilitaires)

		//-----------------------------------------------------NE PAS DEPASSER RH_ -------------------------------------------------
		//l'utilisateur veut arrêter la trajectoire à Rh- et ne pas le depasser
		if(r_part<=rhm && ! document.getElementById("depasser").checked)
		{ 
			r_part=rhm ; // le rayon est egale à RH-
			document.getElementById("r_par").innerHTML = r_part.toExponential(3); // on l'affiche
			alert(texte.page_trajectoire_massive.particule_atteint_rh); //on met une alerte
			arretkerr(); //on arrete la simulation
			peuxonrelancer=false; //on met qu'on peut pas relancer
		}
		
		//----------------------------------------------------GESTION DIODES------------------------------------------------
		
		/* Diode pour le gradient 
			gradient < 1 ------- vert
			1< gradient < 7 ------- jaune
			gradient > 7 -------  rouge
		*/
		if (Number(fm) <= 1) 
		{
			document.getElementById('DivClignotante').innerHTML = " <img src='./Images/diodever.gif' height='14px' />";
			document.getElementById('DivClignotante').style.color = "green";
		} 
		else if (1 < Number(fm) && Number(fm) < 7) 
		{
			document.getElementById('DivClignotante').innerHTML = " <img src='./Images/diodejaune.gif' height='14px' />";
			document.getElementById('DivClignotante').style.color = "yellow";
		} 
		else if (Number(fm) >= 7) 
		{
			document.getElementById('DivClignotante').innerHTML = " <img src='./Images/dioderouge.gif' height='14px' />";
			document.getElementById('DivClignotante').style.color = "red";
		} 
		else 
		{
			document.getElementById('DivClignotante').innerHTML = texte.pages_trajectoire.erreur;
			document.getElementById('DivClignotante').style.color = "blue";
		}
	
		/* Diode pour le nombre de g ressenti
			g_ressenti < 4 ------- vert
			4 < g_ressenti < 9------- jaune
			g_ressenti > 9 -------  rouge
		*/

		if (nombre_de_g_calcul_memo <= 4) 
		{
			document.getElementById('DivClignotanteNbG').innerHTML = " <img src='./Images/diodever.gif' height='14px' />";
			document.getElementById('DivClignotanteNbG').style.color = "green";
		} 
		else if (4 < nombre_de_g_calcul_memo && nombre_de_g_calcul_memo <= 9) 
		{
			document.getElementById('DivClignotanteNbG').innerHTML = " <img src='./Images/diodejaune.gif' height='14px' />";
			document.getElementById('DivClignotanteNbG').style.color = "yellow";
		} 
		else if (nombre_de_g_calcul_memo > 9) 
		{
			document.getElementById('DivClignotanteNbG').innerHTML = " <img src='./Images/dioderouge.gif' height='14px' />";
			document.getElementById('DivClignotanteNbG').style.color = "red";
		} 
		
	}

}    // fin fonction animate


// Expression du potentiel divisé par c^2
function Vr_mob(r) {
	return  potentiel_Kerr_massif(r)-1;
}

function Vr_obs(r) {
	denom=(Math.pow(r,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r)*E-rs*a*L/r;
	dtausurdtaucarre = Math.pow(delta(r)/denom,2);
	return Math.pow(E,2)-( Math.pow(E,2)-potentiel_Kerr_massif(r) )*dtausurdtaucarre -1 ;
}


function potentiel_Kerr_massif(r) {
	return 1 - rs / r - (a * a * (E * E - 1) - L * L) / (r * r) - rs / Math.pow(r, 3) * Math.pow(L - a * E, 2);
}


function derivee_seconde_Kerr_massif(r) {
	return -c * c / (2 * Math.pow(r, 4)) * (rs * r * r + 2 * r * (a * a * (E * E - 1) - L * L) + 3 * rs * Math.pow(L - a * E, 2));
}

function rungekutta(h, r, A) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_Kerr_massif(r);
	k[1] = derivee_seconde_Kerr_massif(r + 0.5 * h * A);
	k[2] = derivee_seconde_Kerr_massif(r + 0.5 * h * A + 0.25 * h * h * k[0]);
	k[3] = derivee_seconde_Kerr_massif(r + h * A + 0.5 * h * h * k[1]);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
}


function delta(r) {
	var d=r**2-rs*r+a**2;
	return d;
}

function derivee_seconde_Kerr_massif_obs(r) {
	EaL2_a2=Math.pow(E*a,2)-Math.pow(L,2)- Math.pow(a,2);  
	Ea_L2=Math.pow(L-a*E,2) ;  
	denom=(Math.pow(r,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r)*E-rs*a*L/r ;
    return   0.5*Math.pow(c,2)*delta(r)/Math.pow(denom,2)*( 

             ( -rs/Math.pow(r,2)-2*(EaL2_a2)/Math.pow(r,3)-3*rs*Ea_L2/Math.pow(r,4) )*delta(r)

            +2*(Math.pow(E,2)-1+rs/r+(EaL2_a2)/Math.pow(r,2)+rs*Ea_L2/Math.pow(r,3))*(2*r-rs)  

            -2*(Math.pow(E,2)-1+rs/r+(EaL2_a2)/Math.pow(r,2)+rs*Ea_L2/Math.pow(r,3))*delta(r)*((2*r-rs*Math.pow(a,2)/Math.pow(r,2))*E+rs*a*L/Math.pow(r,2))/denom )   ;
}

function rungekutta_obs(h, r, A) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_Kerr_massif_obs(r);
	k[1] = derivee_seconde_Kerr_massif_obs(r + 0.5 * h * A);
	k[2] = derivee_seconde_Kerr_massif_obs(r + 0.5 * h * A + 0.25 * h * h * k[0]);
	k[3] = derivee_seconde_Kerr_massif_obs(r + h * A + 0.5 * h * h * k[1]);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
}


function calcul_rmax(){
	r1 = (L * (L - Math.sqrt(Math.pow(L, 2) - 3 * Math.pow(rh, 2))) / (rh));
	r2 = (L * (L + Math.sqrt(Math.pow(L, 2) - 4 * Math.pow(rh, 2))) / (2 * rh));

	ra = rh * Math.pow(L, 2);
	rb = ((rh / r0) - 1) * Math.pow(L, 2);
	X0 = 1 / r0;
	rc = rh - Math.pow(L, 2) * X0 + rh * Math.pow(L * X0, 2);
	DELTA = Math.pow(rb, 2) - 4 * ra * rc;
	r3 = (-rb - Math.sqrt(DELTA)) / (2*ra);

	if (L < Math.sqrt(3) * rh) {
		rmax = r0;
	} 
	else if (L <= 2 * rh && L > Math.sqrt(3) * rh) {
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
	else if (L > 2 * rh) {
		if (r0 > r2) {
			if (r3 > r0) {
				rmax = r3;
			} 
			else if (r3 < r0) {
				rmax = r0;
			}
		} 
		else{
			rmax = r0;
		}
	}
	else{rmax=r0;}
}


// Fonction bouton pause
function pausee() {
	if (! pause) {
		//dtau = 0;
		pause = true;
		document.getElementById("pau").src = "Images/lecture.png";
		document.getElementById("pau").title = texte.pages_trajectoire.bouton_lecture;
		document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_enpause;
		document.getElementById("pause/resume").innerHTML =texte.pages_trajectoire.bouton_resume;
		clearInterval(myInterval);
	} 
	else {
		if(peuxonrelancer) {
			pause = false;
			document.getElementById("pause/resume").innerHTML = texte.pages_trajectoire.bouton_pause;
			document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours;
			document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
			document.getElementById("pau").src = "Images/pause.png";
			myInterval = setInterval(animate, 10 / 6);
		}

	}
}

function rafraichir() {
	window.location.reload();
	element2.value="observateur";
}


function enregistrer(){
	// ces 2 fonctions sont issues des biblios saveSvgAsPng.js et canvas-to-image.js
	var texte = o_recupereJson();

	if(document.getElementById('trace_present').value=="true") {
		var nomFichier = prompt(texte.pages_trajectoire.message_nomFichier, "traject_Kerr_B_B");

		if (nomFichier !== null && nomFichier.trim() !== '') {
			canvas3 = document.getElementById("myCanvas3");
			context3 = canvas3.getContext("2d");
			context3.drawImage(canvas, 0, 0);
			if (element2.value != "mobile") {
				context3.beginPath();
				context3.fillStyle = COULEUR_BLEU;
				context3.arc(posX2, posY2, 5, 0, Math.PI * 2);
				context3.lineWidth = "1";
				context3.fill();

				//Dessiner le logo en bas :
				var logo = new Image() //ManonLogo
				logo.src='Images/CosmoGravity_logo.png'; //ManonLogo
				logo.onload = function() {
				var largeurLogo = 100; //ManonLogo
				var hauteurLogo = (logo.height / logo.width) * largeurLogo; //ManonLogo
				var x = canvas3.width - largeurLogo; // Position en x pour le coin inférieur droit
				var y = canvas3.height - hauteurLogo; // Position en y pour le coin inférieur droit
				context3.drawImage(logo,x,y, largeurLogo, hauteurLogo); //ManonLogo

				canvasToImage(canvas3, {
					name: nomFichier.trim(),
					type: 'png'
				});
				majFondFixe3();};
			} else {
				context3.beginPath();
				context3.fillStyle = COULEUR_BLEU;
				context3.arc(posX1, posY1, 5, 0, Math.PI * 2);
				context3.lineWidth = "1";
				context3.fill();

				//Dessiner le logo en bas :
				var logo = new Image() //ManonLogo
				logo.src='Images/CosmoGravity_logo.png'; //ManonLogo
				logo.onload = function() {
				var largeurLogo = 100; //ManonLogo
				var hauteurLogo = (logo.height / logo.width) * largeurLogo; //ManonLogo
				var x = canvas3.width - largeurLogo; // Position en x pour le coin inférieur droit
				var y = canvas3.height - hauteurLogo; // Position en y pour le coin inférieur droit
				context3.drawImage(logo,x,y, largeurLogo, hauteurLogo); //ManonLogo

				canvasToImage(canvas3, {
					name: nomFichier.trim(),
					type: 'png'
				});
				majFondFixe3();};
			}

		} else {
			alert(texte.pages_trajectoire.alerte_nomFichier);
		} 
	} else {
		alert(texte.pages_trajectoire.message_enregistrer);
	}
}

function commandes(){
	var texte = o_recupereJson();
	alert(texte.pages_trajectoire.commandes_horsSchwarMassif);
}

// utile pour l'exportation d'images
function majFondFixe(){ phi_degres=phi0*180/Math.PI;
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Ajout d'un fond blanc pour l'exportation
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = "15pt bold";
	context.fillStyle = "black";
	context.fillText(texte.page_trajectoire_massive_kerr.titre,5,40);
	context.font = "13pt bold";
	context.fillText(texte.pages_trajectoire.entrees,5,70);
	context.font = "11pt normal";
	context.fillText("M = "+M.toExponential(3)+" kg",5,90);
	context.fillText("r\u2080 = "+r0.toExponential(3)+" m",5,110);
	context.fillText("a = "+a.toExponential(3)+" m",5,130);
	context.fillText("V\u2080 = "+v0.toExponential(3)+" m.s\u207B\u00B9",5,150);
	context.fillText("\u03C6\u2080 = "+phi_degres.toExponential(3)+" °",5,170);
	if(document.getElementById('traject_type2').value=="observateur"){
		context.fillText(texte.pages_trajectoire.observateur,5,190);
	} 
	else {context.fillText(texte.pages_trajectoire.mobile,5,190); }

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
// teste si r0 et J0 sont valides pour la simulation
function tests_lancement(){
	var val_test=test_Jmax()&&test_r0();
	if(val_test==true){
		save_kerr_massif();
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
	context.beginPath();      // Début du chemin
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

function MAJGraphePotentiel(){
	data1=[]
	dr = 0.6*r_part /50;
	for (r = 0.7*r_part; r < 1.3*r_part; r += dr) {									   
		V = Vr_mob(r);
		data1.push({date: r, close: V });
	}
	V = Vr_mob(r0);
	data2.push({date: r0, close: V });
	$('#grsvg_2').empty();   //<----------------------JPC
	graphique_creation_pot();
}


function foncPourZoomPlusAvantLancement(){
		ns_avant_lancement+=1;
		document.getElementById('nzoomtxt').innerHTML= "nz="+ ns_avant_lancement.toString();
		
}

function foncPourZoomMoinsAvantLancement(){
		ns_avant_lancement-=1;
		document.getElementById('nzoomtxt').innerHTML= "nz="+ ns_avant_lancement.toString();
}

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

function foncPourVitAvantLancement(){
	if(accelerer.currentTarget.myParam){
		compteurVitesseAvantLancement += 1
	}
	else{
		compteurVitesseAvantLancement -= 1
	}
	document.getElementById('nsimtxt').innerHTML= "ns="+ compteurVitesseAvantLancement.toString();
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