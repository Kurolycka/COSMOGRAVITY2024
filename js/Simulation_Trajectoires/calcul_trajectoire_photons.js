// -------------------------------------{Variables globales}--------------------------------------------

const DIAMETRE_PART = 1;
var z=0;
var z_obs=0;
var c = 299792458;
var G = 6.67385 * Math.pow(10, -11);

var title = "V(r)/c²";		  
var clicks = 0;
var nzoom=0;
var nz_avant_lancement=0;
var facteurDeMalheur;
var fact_defaut;

var factGlobalAvecClef ;//pour l'échelle avant lancement
var compteurVitesseAvantLancement = 0;
var compteurVitesse = 0;
var compteurVitesseAvantLancement =0; 


// -------------------------------------{Variables globales, key values}--------------------------------------------

var rmaxjson = {};
var mobilefactor = {};
var r0o2 ={};

var maximum;
var cle;
var fuseecompteur;
var listejsonfusees={};

// -------------------------------------{Liste de couleurs en hexa}--------------------------------------------

const COULEUR_NOIR = '#2F2D2B';
const COULEUR_BLEU = '#4080A4';
const COULEUR_CYAN = '#008B8B';
const COULEUR_BLANC = '#ffffff';
const COULEUR_ROUGE = '#ff0000';
const COULEUR_ROUGE_COSMO= '#b54b3a';
const COULEUR_GRIS = '#CCCCCC';
const COULEUR_MARRON = '#673B15';
const COULEUR_BLEU_MARINE='#1A03FF'	

// -------------------------------------{Couleurs rayons et particule}--------------------------------------------

const COULEUR_PART = COULEUR_ROUGE_COSMO;
const COULEUR_RS = COULEUR_BLEU;
const COULEUR_RPHY = COULEUR_GRIS;													  

// -------------------------------------{Autres variables}--------------------------------------------


ifUneFois=true // booleen qui permet plus bas d'utiliser la condition if une seule fois durant la simulation
ifUneFois2=true
ifUneFois3=true 

//-----------------------------------------------------------KHALED--------------------------------------------------
//ceci est une fonction que j'ai trouvé sur StackOverflow de ce brave monsieur Nisse Engström
//je l'ai adapté avec l'aide de chatGPT pour avoir une class de Timer
//puis j'ai fait de sorte que ça remplace setinterval et ça marche 1000x mieux

class Timer {
    constructor(funct,compteur,delayMs, times) {
        if (times === undefined) times = -1;
        if (delayMs === undefined) delayMs = 10;

        this.funct = funct;
        this.times = times;
        this.timesCount = 0;
        this.ticks = (delayMs / 10) | 0;
        this.count = 0;
		this.compteur=compteur
        Timer.instances[this.compteur]=this;
    }

    tick() {
        if (this.count >= this.ticks) {
            this.funct();
            this.count = 0;
            if (this.times > -1) {
                this.timesCount++;
                if (this.timesCount >= this.times) {
                    this.stop();
                }
            }
        }
        this.count++;
    }

    stop() {
        delete Timer.instances[this.compteur];}}

Timer.instances = {};
Timer.paused = false;


Timer.ontick = function () {
    if (!Timer.paused) {
        for (const instance of Object.values(Timer.instances)) {
            instance.tick();
        }
    }
};

window.setInterval(Timer.ontick, 1);
//-----------------------------------------------------------KHALED--------------------------------------------------

// -------------------------------------{fonction initialisationGenerale}-------------------------------------------

/**
 * Fonction qui permet l'initialisation de toutes les fusées. 
 * @param {Number} fuseecompteur : nombre de fusées générées.
 */
function initialisationGenerale(fuseecompteur){
	for (compteur = 1; compteur <= fuseecompteur; compteur += 1) {
	    listejsonfusees[compteur]=initialisation(compteur);  
	}
}

// -------------------------------------{fonction lancerDeFusees}--------------------------------------------

function lancerDeFusees(fuseecompteur){
    c = 299792458;
    G = 6.67385 * Math.pow(10, -11);
    M = Number(document.getElementById("M").value);
    r_phy = Number(document.getElementById("r_phy").value);
    m = G * M / Math.pow(c, 2); 
    rs=2*m;

	for (compteur = 1; compteur <= fuseecompteur; compteur += 1) {
        trajectoire(compteur,listejsonfusees[compteur]);
	}

	document.getElementById("pause/resume").addEventListener("click", function() {
        pausee()}); //ajouté Là par Khaled car le fonctionnement du button à ete changé

	//Associe au bouton pause la fonction pausee permettant de mettre la simulation en pause : 
	 document.getElementById('bouton_pause').addEventListener('click', function() {
		pausee();
	});
}

// -------------------------------------{fonction supprHtml}--------------------------------------------


function supprHtml(){
	var nbrfuseesuppr = sessionStorage.getItem("nombredefusees");
    document.getElementById('tableauconstanteslers').innerHTML = ''; 
    document.getElementById('tableauresultatsimu').innerHTML = ''; 


   	if (sessionStorage.getItem("nombredefusees")){
       var nbrfuseesuppr = sessionStorage.getItem("nombredefusees");
   	}
	var elementcanvasasuppr = document.getElementById("myCanvas");
	elementcanvasasuppr.parentNode.removeChild(elementcanvasasuppr);
  	var canvaswh = document.getElementById("canvaswidthheight").value;
  

	for (countt = 1; countt <= nbrfuseesuppr; countt += 1) {
		var elementrayonasuppr = document.getElementById("rayon"+countt.toString()+"");
		elementrayonasuppr.parentNode.removeChild(elementrayonasuppr);
		var elementvpasuppr = document.getElementById("vitessep"+countt.toString()+"");
		elementvpasuppr.parentNode.removeChild(elementvpasuppr);
		var elementvrasuppr = document.getElementById("vitesser"+countt.toString()+"");
		elementvrasuppr.parentNode.removeChild(elementvrasuppr);
		var elementcanvasbouleasuppr = document.getElementById("myCanvasBoule"+countt.toString()+"");
		elementcanvasbouleasuppr.parentNode.removeChild(elementcanvasbouleasuppr);
		if(canvaswh=="750"){
			var elementgrapheasuppr = document.getElementById("grsvg_"+countt.toString()+"");
			elementgrapheasuppr.parentNode.removeChild(elementgrapheasuppr);
		}

	}

	var elementcanvas3asuppr = document.getElementById("myCanvas3three");
	elementcanvas3asuppr.parentNode.removeChild(elementcanvas3asuppr);

}

// -------------------------------------{fonction genereHtml}--------------------------------------------

function genereHtml(){
	nbredefuseesgenere = Number(document.getElementById("nombredefusees").value);
	lenbdefusees = nbredefuseesgenere;

	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		var span = document.createElement("span");
		span.setAttribute("id","rayon"+countt.toString()+"");
		var divchampsr = document.getElementById('champs_a_remplir');
		divchampsr.appendChild(span);
		if(countt==1){
			var newlabel = document.createElement("Label");
			newlabel.setAttribute("id","ctreastre");
			newlabel.setAttribute("title","");											 
			newlabel.setAttribute("for","r01");
			newlabel.innerHTML = " r<sub>0</sub> (m) =";
			span.appendChild(newlabel);
		}
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","r0"+countt.toString()+"");
		newinput.setAttribute("value","1.7685e11");
		newinput.setAttribute("align","left");
		newinput.setAttribute("maxlength","11");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","10");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		span.appendChild(newinput);
	}

	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		var span = document.createElement("span");
		span.setAttribute("id","vitessep"+countt.toString()+"");
		var divchampsr = document.getElementById('champs_a_remplir');
		divchampsr.appendChild(span);
		if(countt==1){
			var newlabel = document.createElement("Label");
			newlabel.setAttribute("id","philabel");
			newlabel.setAttribute("title","");
			newlabel.setAttribute("for","phi01");
			newlabel.innerHTML =" "+ htmlDecode("&phi;")+"<sub>0</sub>° =";
			span.appendChild(newlabel);
		}
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","phi0"+countt.toString()+"");
		newinput.setAttribute("value","-10");
		newinput.setAttribute("maxlength","10");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","10");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		span.appendChild(newinput);
	}	


	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		var span = document.createElement("span");
		span.setAttribute("id","vitesser"+countt.toString()+"");

		var divchampsr = document.getElementById('champs_a_remplir');

		divchampsr.appendChild(span);
		if(countt==1){
			var newlabel = document.createElement("Label"); 
			newlabel.setAttribute("id","thetalabel");
			newlabel.setAttribute("title","");
			newlabel.setAttribute("for","teta1");
			newlabel.innerHTML = " "+htmlDecode("&#632;")+"<sub>0</sub>° =";      //  &#632; c'est phi majuscule
			span.appendChild(newlabel);
		}

		var newinput = document.createElement("Input");
		newinput.setAttribute("id","teta"+countt.toString()+"");
		newinput.setAttribute("value","190");
		newinput.setAttribute("maxlength","10");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","5");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		span.appendChild(newinput);
	}

	var newRow=document.getElementById('tableauconstanteslers').insertRow();

	var jstring = '<tr id="tgggg1" >'
	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		jstring += '<th class="tg-aicv">$L'+countt.toString()+'(m)$</th>';}

	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		jstring += '<th class="tg-aicv">$E'+countt.toString()+'$</th>';
	}
	for (countt = 1; countt <= nbredefuseesgenere; countt +=1) {
		jstring += '<th class="tg-aicv" id="rayon_orb_circ'+countt.toString()+'" title="">$rc'+countt.toString()+'(m)$</th>'; //ManonCirculaire
	}
																		 
 
    //pour katex il faux mettre un antislash devant le antislash  	
	jstring +='<th class="tg-6l4m" id="rayonschwars" title="" >$rs=\\frac{2GM}{c^{2}}(m)$</th>';

	jstring +='<th class="tg-6l4m" style="display: none;" id="gravtxt" title="">$grav=\\frac{GM}{R^{2}}\\frac{1}{9.81}(g)$</th>';		
	jstring +='<th class="tg-6l4m" style="display: none;" id="vitesseLibéra" title="">$Vlib=c(\\frac{rs}{R})^{1/2}(m.s^{-1}) $</th>';
	jstring +='<th class="tg-6l4m" style="display: none;" id="TempTrouNoirtxt" title="">$T=6.15*10^{-8}\\frac{M\\odot}{M}(K)$</th>';
	jstring +='<th class="tg-6l4m" style="display: none;" id="tempsEvaporationTrouNoirtxt" title="">$t=6.6*10^{74}(\\frac{M}{M\\odot})^{3}(s)$</th>';
	jstring +='</tr>';

          
	newRow.innerHTML = jstring;

	var newRow2=document.getElementById('tableauconstanteslers').insertRow();

	var jstring = '<tr id="tgggg2" >'
	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		jstring += '<td class="tg-3ozo" id="L'+countt.toString()+'">0</td>';
	}

	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		jstring += '<td class="tg-3ozo" id="E'+countt.toString()+'">0</td>';
	}

	for (countt = 1; countt<= nbredefuseesgenere; countt += 1) {
		jstring += '<td class="tg-3ozo" id="rayon_orbite_circ_res'+countt.toString()+'">0</td>'; //ManonCirculaire
	}

	jstring +='<td class="tg-3ozo" id="m">0</td>';
	jstring +='<td class="tg-3ozo" style="display: none;" id="g">0</td>';
	jstring +='<td class="tg-3ozo" style="display: none;" id="Vlib"></td>';
	jstring +='<td class="tg-3ozo" style="display: none;" id="TempTN">0</td>';
	jstring +='<td class="tg-3ozo" style="display: none;" id="tempsEvapTN">0</td>';
	jstring +='</tr>';

	newRow2.innerHTML = jstring;

	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		var newRow=document.getElementById('tableauresultatsimu').insertRow();
		// il faudrait songer a la sécurité ici, 'never trust user input', serait il possible pour un utilisateur de prendre le controle avec ses user input?
		newRow.innerHTML = `<tr id="tg2gga`+countt.toString()+`">
					<th class="tg-aicv">r(m)</th>
					<th id="temps_ecoule`+countt.toString()+`" class="tg-aicv"></th>
					<!--<th id="acceleration`+countt.toString()+`" title="" class="tg-6l4m"></th>-->
					<th id="vitesseur`+countt.toString()+`" title="" class="tg-aicv"  >V<SUB>r</SUB>(m.s<sup>-1</sup>) </th>
					<th id="vitesseuphi`+countt.toString()+`" title="" class="tg-aicv"  >V<SUB>&phi;</SUB>(m.s<sup>-1</sup>)</th>
					<th id="temps_obs`+countt.toString()+`" class="tg-aicv"></th>
					<th id="v_total`+countt.toString()+`" class="tg-aicv">V<SUB>physique</SUB> (m.s<sup>-1</sup>)</th>`; 

		var newRow2=document.getElementById('tableauresultatsimu').insertRow();

		newRow2.innerHTML =       `<tr id="tg2ggb`+countt.toString()+`">
					<td class="tg-3ozo" id="r_par`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="tp`+countt.toString()+`">res</td>
					<!--<td class="tg-3ozo" id="ga`+countt.toString()+`">res</td>-->
					<td class="tg-3ozo" id="vr_sc_mas`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="vp_sc_mas`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="to`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="v_tot`+countt.toString()+`">res</td>`; 

	}

  	var canvaswidthheight = document.getElementById("canvaswidthheight").value;

	var canvasgenere = document.createElement("canvas");
    canvasgenere.setAttribute("id","myCanvas");
    canvasgenere.setAttribute("width",canvaswidthheight);
    canvasgenere.setAttribute("height",canvaswidthheight);
    canvasgenere.setAttribute("class","canvaslaclasse");
    if(canvaswidthheight=="750"){var wrappergenere = document.getElementById('wrapper');}
    else{var wrappergenere = document.getElementById('wrapperengrand');}
	
    wrappergenere.appendChild(canvasgenere);

	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		var canvasboulegenere = document.createElement("canvas");
		canvasboulegenere.setAttribute("id","myCanvasBoule"+countt.toString()+"");
		canvasboulegenere.setAttribute("width",canvaswidthheight);
		canvasboulegenere.setAttribute("height",canvaswidthheight);

		canvasboulegenere.setAttribute("class","canvaslaclasse");
		if(canvaswidthheight=="750"){var wrappergenere = document.getElementById('wrapper');}
		else{var wrappergenere = document.getElementById('wrapperengrand');}
		wrappergenere.appendChild(canvasboulegenere);

	}

	var canvas3genere = document.createElement("canvas");
    canvas3genere.setAttribute("id","myCanvas3three");
    canvas3genere.setAttribute("width",canvaswidthheight);
    canvas3genere.setAttribute("height",canvaswidthheight);

    canvas3genere.setAttribute("class","canvaslaclasse");
    if(canvaswidthheight=="750"){var wrappergenere = document.getElementById('wrapper');}
    else{var wrappergenere = document.getElementById('wrapperengrand');}
    wrappergenere.appendChild(canvas3genere);

	if(canvaswidthheight=="750"){
		for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
			var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.setAttribute("id", "grsvg_"+countt.toString()+""); 
			document.getElementById("wrapper2").appendChild(svg);
		}
	}

	texteTrajectoirePhoton(nbredefuseesgenere);
	notationvitesseree1();
	infobulleobservateurdistant();
	textegravetetc();						
    //pour le bon affichage du katex
	renderMathInElement(document.body, {
		// ...options...
		delimiters:[
			{left:"$",right:'$',display: false},
		]
	});
	 
}

//----------------------------------------------------{initialisation}----------------------------------------------------

/**
 * Fonction qui permet la récupération des valeurs remplies par l'utilisateur et en fonction le calcul et l'affichage du premier tableau fixe de constantes avant le début de la simulation.
 * @param {Number} compteur : renseigne sur le numéro du mobile qu'on initialise.
 * @returns {Object} mobile : objet contenant toutes les informations sur un mobile/fusée/particule... 
 */
function initialisation(compteur){

	//Je récupère les différentes valeurs rentrées par l'utilisateur :
	M = Number(document.getElementById("M").value); //Masse de l'astre.
	r_phy = Number(document.getElementById("r_phy").value); //Rayon physique de l'astre.
	r0 = Number(document.getElementById("r0"+compteur.toString()).value); //Distance initiale au centre de l'astre.
	phi0 = Number(document.getElementById("phi0"+compteur.toString()).value); //Angle initiale phi de la position du mobile.
	teta = Number(document.getElementById("teta"+compteur.toString()).value); // Angle initiale phi de la vitesse du mobile.

	teta1=teta; //Je garde une trace de l'angle en degrés avant de le convertir en radians.
	//Je convertis les deux angles obtenus en degrés en radians :
	phi0=(phi0*Math.PI)/180;
	teta=(teta*Math.PI)/180;

	//Je calcule le rayon de Schwarzschild correspondant : 
	m = G * M / Math.pow(c, 2); 
	rs=2*m;

	E = 1 ; //La constante d'intégration sans dimension E.
	dphi_sur_dlambda=Math.sin(teta)*c/(Math.sqrt(1-rs/r0)*r0); //Je calcule dphi/dlambda.
	vr=Math.cos(teta)*c; //Je calcule dr/dlambda. 
	L = (dphi_sur_dlambda*(r0**2))/c; //Je calcule L la constante d'intégration. 

	rayon_orbite = (3/2)*rs; //Calcul de la distance r pour une orbite circulaire. 

	//J'affiche dans le tableau les valeurs calculée de L, E, rs, la distance r pour une orbite circulaire :
	document.getElementById("L"+compteur.toString()).innerHTML = L.toExponential(3);
	document.getElementById("E"+compteur.toString()).innerHTML = E.toExponential(3);
	document.getElementById("m").innerHTML = rs.toExponential(3);
	document.getElementById("rayon_orbite_circ_res"+compteur.toString()).innerHTML = rayon_orbite.toExponential(5); //ManonCirculaire

	//Je récupère mon facteur d'échelle : 
	scale_factor = Number(document.getElementById("scalefactor").value);

	//Je calcule la distance radiale maximale que je pourrais atteindre : 
	calcul_rmax(L,E,vr,r0,1);

	//--------------------------------Initialisation de mon objet mobile--------------------------------

	mobile = { r0:r0, dphi_sur_dlambda:dphi_sur_dlambda, vr:vr, L:L, E:E, phi0:phi0 }; //Je créé un objet mobile dans lequel je stocke différentes valeurs initiales associées à ce mobile.

	//J'associe à mon mobile des strings associés à mon graphe de potentiel : 
	mobile["pointsvg"]="pointg"+compteur.toString();
	mobile["graphesvg"]="#grsvg_"+compteur.toString();

	//J'initialise et j'associe d'autres variables à mon objet mobile : 
	mobile["rmax"]=rmax; //Ma position radiale maximale atteinte. 
	mobile["blups"]=0;
	mobile["pause"]=true; //Si je suis en pause, initialement oui. 
	mobile["debut"]=true; //Si je suis au début de ma simulation, initialement oui.
	couleurs = generateurCouleur();
	mobile["couleur"]="rgb("+couleurs[0]+", "+couleurs[1]+", "+couleurs[2]+")";//La couleur générée aléatoirement associée à mon mobile.
	//Les nombres rgb associés à cette couleurs : 
	mobile["red"]=couleurs[0];
	mobile["green"]=couleurs[1];
	mobile["blue"]=couleurs[2];

	mobile["condition_trace"]=true //Cette condition c'est pour arreter le tracer et l'affichage quand on en a besoin.


	rmaxjson[compteur]=rmax; // Je stocke dans la liste rmaxjson à la clé associée à ce mobile la position radiale maximale atteinte.
	mobilefactor[compteur]=scale_factor; //Je stocke dans la liste mobilefactor à la clé associée à ce mobile le facteur d'échelle.
	r0o2[compteur] = r0; //Je stocke dans la liste r0o2 à la clé associée à ce mobile ma distance initiale au centre de l'astre.

	//--------------------------------Gravité à la surface--------------------------------

	//Je récupère les cellules associée à cette gravité à la surface. 
	gCell = document.getElementById("g");
	gLabelCell = document.getElementById("gravtxt");

  	g=(G*M)/(Math.pow(r_phy,2)*9.81); //Je la calcule.

	if(r_phy==0){ //Dans le cas d'un trou noir je n'affiche pas la case.
		document.getElementById("g").innerHTML=" ";
		gCell.style.display = 'none';
		gLabelCell.style.display = 'none';
	}
	else{ //Autrement je l'affiche avec la valeur. 
		document.getElementById("g").innerHTML=g.toExponential(3);
		gCell.style.display = '';
		gLabelCell.style.display = '';
	}
  
	//--------------------------------Vitesse de libération--------------------------------

	//Je récupère les cellules associée à la vitesse de libération. 
	VlibLabelCell = document.getElementById("vitesseLibéra");
	VlibCell = document.getElementById("Vlib");

	Vlib=c*Math.pow(rs/r_phy,1/2); //Je la calcule.

	if(r_phy>=rs){ //Dans le cas où mon rayon physique est plus grand que le rayon de SCH j'affiche les cases avec la valeur.
		document.getElementById("Vlib").innerHTML=Vlib.toExponential(3);
		VlibLabelCell.style.display='';
		VlibCell.style.display='';
	}
	else{ //Dans le cas contraire je n'affiche pas les cases. 
		document.getElementById("Vlib").innerHTML=" ";
		VlibCell.style.display = "none";
		VlibLabelCell.style.display = "none";
	
	}

	//--------------------------------Rayonnement de Hawking d'un trou noir & temps d'évaporation du trou noir--------------------------------
	
	//Je récupère les cellules associées :
	TempTrouNoirLabelCell=document.getElementById("TempTrouNoirtxt");
	TempTrouNoirCell=document.getElementById("TempTN");
	tempsEvapTNCell=document.getElementById("tempsEvapTN");
	tempsEvapTNLabelCell=document.getElementById("tempsEvaporationTrouNoirtxt");

	if(r_phy<rs){ //Dans le cas où le rayon physique de l'astre est plus petit que le rayon de Schwarzschild. 

		M_soleil = 1.989e30	; //Masse du soleil en kg.
		Temp_trouNoir = 6.5e-8 * M_soleil/M; //Température du trou noir en K. 
		tempsEvaporation_trouNoir = 6.6e74*((M/M_soleil)**3); //Temps d'évaporation du trou noir en secondes. (Calcul simplifié.)

		//J'affiche les cases avec les valeurs :
		document.getElementById("TempTN").innerHTML=Temp_trouNoir.toExponential(3);
		document.getElementById("tempsEvapTN").innerHTML=tempsEvaporation_trouNoir.toExponential(3);
        TempTrouNoirLabelCell.style.display = '';
        TempTrouNoirCell.style.display = '';
		tempsEvapTNCell.style.display = '';
		tempsEvapTNLabelCell.style.display = '';
	}
	else{ //Autrement je n'affiche pas les cases car vides.
		document.getElementById("TempTN").innerHTML=" ";
		document.getElementById("tempsEvapTN").innerHTML = " ";

		TempTrouNoirLabelCell.style.display = 'none';
		TempTrouNoirCell.style.display = 'none';
		tempsEvapTNCell.style.display = 'none';
		tempsEvapTNLabelCell.style.display = 'none';
	}

	//--------------------------------Graphe--------------------------------

	//Jusqu'à 2 mobiles je peux afficher les entrées sur le graphe. 
	if (compteur==1){
		vphiblab=c; //Je récupère la vitesse initiale.
		vrblab=phi0*180/Math.PI; //Je récupère l'angle de la position initiale en degrés. 
	}
	if(compteur==2){
		vphi2i = c; //Je récupère la vitesse initiale. 
		vr2i = phi0*180/Math.PI; //Je récupère l'angle de la position initiale en degrés. 
	}

	boutonAvantLancement(true); //J'associe aux différents boutons les fonctions associées d'avant le lancement. 
	canvasAvantLancement(); //J'affiche l'échelle du canvas avant le début de la simulation. 

	return mobile; //Je récupère au final de cette fonction l'objet mobile correctement initialisé.
}  

//----------------------------------------------------{verifnbr}----------------------------------------------------

/**
 * Fonction qui affiche un message d'erreur si une saisie n'est pas un nombre dans un des champs. 
 */
function verifnbr() {

	var texte = o_recupereJson(); //Pour les messages d'alerte.
  
	//Je récupère les données remplies par l'utilisateur :
	r_phy = document.getElementById("r_phy").value; //Le rayon physique.
	M = document.getElementById("M").value; //La masse de l'astre. 
	nbredefuseesverifnbr = Number(document.getElementById("nombredefusees").value); //Le nombre de mobiles. 

	//Pour stocker dans des variables si un des champs n'est pas un nombre pour un mobile :
	var oneboolean=false;
	var twoboolean=false;
	var threeboolean=false;
	var indice = 0; //Pour récupérer sur quel mobile il y a une erreur de saisie.

	for (count = 1; count <= nbredefuseesverifnbr; count += 1) { //Pour chaque mobile :
			//Je récupère la distance initiale au centre de l'astre r0, l'angle de la position et l'angle de la vitesse : 
			var r0verifnbr = Number(document.getElementById("r0"+count.toString()+"").value); 
			var phi0verifnbr =  Number(document.getElementById("phi0"+count.toString()+"").value);
			var tetaverifnbr = Number(document.getElementById("teta"+count.toString()+"").value);

			if(isNaN(r0verifnbr)){ //Si un seul des mobiles n'a pas de nombre pour r0 alors oneboolean est true. 
				oneboolean=true;
				indice=count;
			}
			if(isNaN(phi0verifnbr)){ //Si un seul des mobiles n'a pas de nombre pour l'angle de position initiale alors twoboolean est true.
				twoboolean=true;
				indice=count;
			}
			if(isNaN(tetaverifnbr)){ //Si un seul des mobiles n'a pas de nombre pour l'angle de vitesse initiale alors threeboolean est true.
				threeboolean=true;
				indice=count;
			}
	}

	if (oneboolean){ //Si un seul des mobiles n'a pas un nombre pour r0.
		alert(texte.pages_trajectoire.alerte_verifier_r0);
		document.getElementById("r0"+indice.toString()).value=1.7685e11.toExponential(4);
	}
	if (twoboolean){ //Si un seul des mobiles n'a pas un nombre pour phi0.
		alert(texte.pages_trajectoire.alerte_verifier_phi0);
		document.getElementById("phi0"+indice.toString()).value=-10;
	}
	if (threeboolean){ //Si un seul des mobiles n'a pas un nombre pour teta.
		alert(texte.pages_trajectoire.alerte_verifier_teta);
		document.getElementById("teta"+indice.toString()).value=190;
	}
	if (isNaN(r_phy)){ //Si il n'y a pas un nombre pour le rayon physique de l'astre.
		alert(texte.pages_trajectoire.alerte_verifier_rphy);
		document.getElementById("r_phy").value=0;
	}
	if (isNaN(M)){ //Si il n'y a pas un nombre pour la masse de l'astre.
		alert(texte.pages_trajectoire.alerte_verifier_M);		
		document.getElementById("M").value=8e36.toExponential(0);													
	}
  
}

// -------------------------------------{fonction pressionBouttonObservateur}--------------------------------------------

//pas sur qu'il y ait besoin que ceci soit ici, je l'ai mis car il y avait changerBouttonObs avant ici
// actualisation bouton observateur quand pression
function pressionBouttonObservateur() {
	if (document.getElementById("r3").className == "myButton2") {
		document.getElementById("r3").className = "myButton";
		document.getElementById("r4").className = "myButton2";
 	}	
}

// -------------------------------------{fonction pressionBouttonMobile}--------------------------------------------

// actualisation bouton mobile quand pression
function pressionBouttonMobile() {
	if (document.getElementById("r4").className == "myButton2") {
		document.getElementById("r4").className = "myButton";
		document.getElementById("r3").className = "myButton2";
	}
}

// -------------------------------------{trajectoire}--------------------------------------------

/**
 * Première étape qui lance la partie calculatoire.
 * @param {Number} compteur : numéro du mobile si il y en a plusieurs.
 * @param {Object} mobile : objet baryonique peut être un spationaute ou autre.
 * @returns 
 */
function trajectoire(compteur,mobile) {

	texte = o_recupereJson();

	if (mobile.pause || mobile.debut) {
 
		document.getElementById("tg2").style.display = "table";	//Fait apparaître le tableau des résultats.											   
		document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours; //Affiche que le calcul est en cours.

		SurTelephone(); //Affichage de l'information sur les touches claviers en fonction de la taille de l'écran.

		//Interdiction de changer les valeurs de M, r_phy et le nombre de fusées une fois la simulation lancée : 
		document.getElementById('M').disabled = true;
		document.getElementById('r_phy').disabled = true;
		document.getElementById('nombredefusees').disabled = true;

		var nbredefusees = Number(document.getElementById("nombredefusees").value); //Récupère la valeur du nombre de fusées.

		for (countt = 1; countt <= nbredefusees; countt += 1) { //Pour toutes les fusées :
			//Interdiction de changer les valeurs de r0, phi0, v0 et teta une fois la simulation lancée.
			document.getElementById('r0'+countt.toString()+'').disabled = true;
			document.getElementById('phi0'+countt.toString()+'').disabled = true;
			document.getElementById('teta'+countt.toString()+'').disabled = true;
		}

		//Interdiction de changer les valeurs des modes observateur et spationaute une fois la simulation lancée : 
   		document.getElementById('r3').disabled = true; //Observateur.
   		document.getElementById('r4').disabled = true; //Photon.

		element2=document.getElementById('traject_type2'); //Récupère la valeur de si on est en mode observateur ou en mode photon.

    	document.getElementById('trace_present').value="true"; //Permet de déclarer qu'il y a un tracé. 

    	mobile.pause = false; //Permet de dire que nous ne sommes pas en pause.
   		mobile.debut = false; //Permet de dire que nous ne sommes plus au début de la simulation. 

		//--------------------------------Calcul de la trajectoire en elle-même--------------------------------

		mobile["phi"]=mobile.phi0;//J'attribue à l'élement phi du mobile dans son référentiel la valeur phi0 du mobile.
		mobile["phi_obs"]=mobile.phi0; //J'attribue à l'élement phi du mobile dans le référentiel de l'observateur distant la valeur de phi0 du mobile. 

		temps_chute_libre = Math.PI * rmax * Math.sqrt(rmax / (2 * G * M)) / 2; //Calcul du temps de chute libre. 
		mobile["temps_chute_libre"]=temps_chute_libre; //J'attribue à l'élément temps_chute_libre du mobile la valeur de temps_chute_libre.

		A_init = mobile.vr; //Dans A_init je mets la valeur initiale de vr du mobile.
		r_init = mobile.r0; //Dans r_init je mets la valeur initiale de r du mobile qui est r0. 

		//--------------------------------Récupération de la distance initiale maximum--------------------------------

		if (nbredefusees==1) {//Si je n'ai que un seul mobile.
			if(ifUneFois2){ //On ne passe dans cette condition que une fois. 
				maximum=r0o2[1]; //Je stocke dans la variable maximum la distance initiale la plus grande. 
				cle = 1; //Je récupère l'indice qui correspond à ce maximum dans la liste r0o2 qui contient les r0 de tous les mobiles.
				ifUneFois2=false; //Je fais en sorte de ne plus revenir dans cette condition. 
			}
		}else if(nbredefusees>=2){//Si j'ai plusieurs mobiles.
        	if(ifUneFois){ //On ne passe dans cette condition que une fois.
				maximum=0; //Stockera le maximum des distances initiales. 
           		cle=0; //Stockera l'indice de r0o2 du maximum des distances initiales. 
				for (key = 1; key <= nbredefusees; key += 1) { //Je parcours toute la liste r0o2.
					if(r0o2[key]>=maximum){ //Je trouve ensuite la valeur de r0 maximum dans r0o2.
					maximum=r0o2[key]; //Je stocke cette valeur dans maximum.
                    cle=key; //Je stocke l'indice de cette valeur dans cle. 
					}
                	if(key!=cle){ //Si je ne suis pas sur le mobile qui a la distance initiale maximum. 
						mobilefactor[key]=mobilefactor[cle]*(r0o2[key]/r0o2[cle]); //J'attribue à chaque mobile une échelle en fonction du rapport de leur distance initiale sur la distance initiale maximum. 
                	}
           		}
            ifUneFois=false; //Je fais en sorte de ne plus revenir dans cette condition.
        	}
    	}

		//--------------------------------Calcul de la trajectoire en elle-même--------------------------------

		A_part = A_init; //Je stocke dans A_part ce qui est actuellement mobile.vr.
    	mobile["A_part"]=A_part; 
    	r_part = r_init; //Je stocke dans r_part ce qui est actuellement la distance initiale du mobile.
    	mobile["r_part"]=r_part; 
		r_init_obs = mobile.r0; 
		r_part_obs=r_init_obs;
		mobile["r_part_obs"]=r_part_obs;
		A_init_obs = mobile.vr*(1-rs/mobile.r0)/mobile.E; //Je multiplie par dτ/dt pour passer le dr/dτ en observateur. 
		A_part_obs=A_init_obs; 
		mobile["A_part_obs"]=A_part_obs; 
	
    	temps_particule = 0; //J'initialise le temps dans le référentiel du mobile. 
    	mobile["temps_particule"]=temps_particule;
   		temps_observateur_distant = 0; //J'initialise le temps dans le référentiel de l'observateur distant. 
    	mobile["temps_observateur_distant"]=temps_observateur_distant;

    	clavierEvenement(true); //Permet une fois démarrée de gérer la simulation avec les touches du clavier.
	
		dtau=rmax/c*1e-3; //Je fixe le pas de temps à une fraction de la distance radiale maximal. 
		mobile["dtau"]=dtau;

		//--------------------------------Positions de départ du mobile--------------------------------

    	x1part = mobilefactor[compteur] * mobile.r0 * Math.cos(mobile.phi) / rmax;  //x dans le référentiel du mobile.
    	y1part = mobilefactor[compteur] * mobile.r0 * Math.sin(mobile.phi) / rmax;  //y dans le référentiel du mobile.
    	x1obs = mobilefactor[compteur] * mobile.r0 * Math.cos(mobile.phi_obs) / rmax;  //x dans le référentiel de l'observateur distant.
    	y1obs = mobilefactor[compteur] * mobile.r0 * Math.sin(mobile.phi_obs) / rmax;  ////y dans le référentiel de l'observateur distant.

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

		/*Méthode des prédecesseurs : un canvas est créé pour chaque boule bleue dans le html et tous les canvas sont superposés. 
		C'est une mauvaise manière de faire qui ralentit l'animation mais cela a été fait par faute de temps.
		Dans l'idéal il faudrait tout dessiner ou tout mettre à jour en même temps sur le même canvas.*/

   		mobile["canvas22"]= document.getElementById("myCanvasBoule"+compteur.toString());
    	mobile["context22"]=mobile["canvas22"].getContext("2d");

    	majFondFixe(); //J'efface le canvas et je le remplace par un fond blanc avec le texte visible sur la gauche avec les paramètres d'entrée. 
		majFondFixe44(mobile); //J'efface tout ce qui est lié au context22 du mobile, donc tout ce qui est lié à la trajectoire d'un mobile spécifique.
		
    	diametre_particule = DIAMETRE_PART; //Je fixe le diamètre de la particule.

		//Position du centre du canvas :
		posX3 = (canvas.width / 2.0);
		posY3 = (canvas.height / 2.0);

		    
		//Je définis la position du mobile sur le canvas, vis à vis de son centre, dans le référentiel du mobile :
    	posX1 = posX3 + x1part;
    	posY1 = posY3 + y1part;
    	mobile["positionspatio"]={posX1:posX1, posY1:posY1}


		//Je définis la position du mobile sur le canvas, vis à vis de son centre, dans le référentiel de l'observateur distant :
		posX2 = posX3 + x1obs;
		posY2 = posY3 + y1obs;
    	mobile["position"]={posX2:posX2, posY2:posY2} 
		
		new Timer(() => animate(compteur,mobile,mobilefactor),compteur, 1, -1); //Créé un nouvel objet Timer qui répète la fonction animate toutes les 1s indéfiniment. 
		//animate calcule les coordonnées de la particule à chaque instant.

		document.getElementById('enregistrer2').addEventListener('click', function() { //Lorsque l'on clique sur enregistrer cela permet d'avoir la boule de la particule sur l'enregistrement.
			element2z=document.getElementById('traject_type2');
			if (element2z.value != "mobile"){ //Dans le cas de l'observateur distant. 
				//Je dessine la boule du mobile :
				context3.beginPath();
				context3.fillStyle = COULEUR_BLEU;
				context3.arc(mobile.position.posX2, mobile.position.posY2 , 5, 0, Math.PI * 2);
				context3.lineWidth = "1";
				context3.fill();
			}
			else{ //Dans le cas du photon. 
				//Je dessine la boule du mobile :
				context3.beginPath();
				context3.fillStyle = COULEUR_BLEU;
				context3.arc(mobile.positionspatio.posX1, mobile.positionspatio.posY1 , 5, 0, Math.PI * 2);
				context3.lineWidth = "1";
				context3.fill();
			}
		}, false);

		//--------------------------------Gestion des boutons d'accélération/décélération--------------------------------

		document.getElementById('plusvite').removeEventListener('click',foncPourVitPlusAvantLancement,false); //Je désassocie la fonction foncPourVitAvantLancement du bouton pour accélérer une fois la simulation commencée.
		document.getElementById('moinsvite').removeEventListener('click',foncPourVitMoinsAvantLancement,false) //Je désassocie la fonction foncPourVitAvantLancement du bouton pour décélérer une fois la simulation commencée.

		Dtau1 = 1e8 * dtau ; //Pour permettre une accélération.
		mobile["Dtau1"]=Dtau1; //Pour associer ce Dtau1 à un mobile spécifique.
		Dtau2 = dtau/1e8  ; //Pour permettre une décélération.
		mobile["Dtau2"]=Dtau2; //Pour associer ce Dtau2 à un mobile spécifique.


		document.getElementById('plusvite').addEventListener('click', function() { //J'associe le bouton accélérer à la fonction suivante une fois la simulation lancée. 
			mobile=bouttons.vitesse(mobile,true); //J'accélère grâce à la fonction vitesse du fichier bouttons. 
			compteurVitesseAvantLancement+=1/nbredefusees;
			document.getElementById('nsimtxt').innerHTML= "simu="+ Math.round(compteurVitesseAvantLancement).toString(); //J'affiche le ns correspondant sur le site.
		}, false);


		document.getElementById('moinsvite').addEventListener('click', function() { //J'associe le bouton décélérer à la fonction suivante une fois la simulation lancée. 
			mobile=bouttons.vitesse(mobile,false); //Je décélère grâce à la fonction vitesse du fichier bouttons. 
			compteurVitesseAvantLancement-=1/nbredefusees;
			document.getElementById('nsimtxt').innerHTML= "simu="+ Math.round(compteurVitesseAvantLancement).toString(); //J'affiche le ns correspondant sur le site.
		}, false);


		if(compteurVitesseAvantLancement>=0){ //Permet de prendre en compte tous les clics sur accélérer fait avant le début de la simulation. 
			for(i=0;i<(compteurVitesseAvantLancement);i++){
				mobile=bouttons.vitesse(mobile,true)
			}
		}
		else{ //Permet de prendre en compte tous les clics sur décélérer fait avant le début de la simulation.
			for(i=0;i>(compteurVitesseAvantLancement);i--){
				mobile=bouttons.vitesse(mobile,false)
			}
		}

		//--------------------------------Gestion des boutons de zoom--------------------------------

		document.getElementById('moinszoom').removeEventListener('click',foncPourZoomMoinsAvantLancement, false); //Je désassocie foncPourZoomMoinsAvantLancement du bouton pour dézoomer une fois la simulation commencée.
		document.getElementById('pluszoom').removeEventListener('click',foncPourZoomPlusAvantLancement, false); //Je désassocie foncPourZoomPlusAvantLancement du bouton pour zoomer une fois la simulation commencée.

		document.getElementById('moinszoom').addEventListener('click', function() { //J'associe le bouton dézoomer à la fonction suivante une fois la simulation lancée.
			var retour=bouttons.zoom(false,mobile,canvas,mobilefactor,compteur); //Utilise la fonction zoom du fichier bouttons.
			mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
			mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle.
			factGlobalAvecClef /= Math.pow(1.2,1/nbredefusees); //Je dézoome de 20%. 
			majFondFixe44(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile.
			rafraichir2(context,mobilefactor,rmaxjson,maximum,compteur); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom-=1/nbredefusees;
			document.getElementById('nzoomtxt').innerHTML= "zoom="+ Math.round(nzoom).toString(); //Mets à jour l'affichage du zoom sur le site. 
		}, false);


		document.getElementById('pluszoom').addEventListener('click', function() { //J'associe le bouton zoomer à la fonction suivante une fois la simulation lancée.     
			var retour=bouttons.zoom(true,mobile,canvas,mobilefactor,compteur); //Utilise la fonction zoom du fichier bouttons.
			mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
			mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle. 
			factGlobalAvecClef *= Math.pow(1.2,1/nbredefusees); //Je zoome de 20%.
			majFondFixe44(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile.
			rafraichir2(context,mobilefactor,rmaxjson,maximum,compteur); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche.
			nzoom+=1/nbredefusees;
			document.getElementById('nzoomtxt').innerHTML= "zoom="+ Math.round(nzoom).toString(); //Mets à jour l'affichage du zoom sur le site. 
		}, false);


		document.getElementById('initialiser').addEventListener('click', function() { //Associe le bouton pour initialiser le zoom à la fonction suivante. 
			var retour=bouttons.initialiser(nbredefusees,mobilefactor,mobile,compteur,canvas); //Utilise la fonction initialiser du fichier bouttons. 
			mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
			mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle.
			factGlobalAvecClef = fact_defaut; //Le zoom redevient celui initial de la simulation. 
			majFondFixe44(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile.
			rafraichir2(context,mobilefactor,rmaxjson,maximum,compteur); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom=0;
			document.getElementById('nzoomtxt').innerHTML= "zoom="+ nzoom.toString(); //Mets à jour l'affichage du zoom sur le site. 
		}, false);


		//--------------------------------Graphe du potentiel--------------------------------

		document.getElementById("bloc_resultats").style.display= "block"; //Permet d'afficher le graphe du potentiel en-dessous de la simulation de la trajectoire.

		function DisparitionGraphesPotentiels() { //Fonction qui permet de faire disparaître tous les graphes de potentiel lorsque la case est décochée. 
			for (countt = 1; countt <= nbredefusees; countt += 1) {
				var node = document.getElementById("grsvg_"+countt.toString()+"");
            	if(node){
					if (node.parentNode){
						node.parentNode.removeChild(node);
					}
				}
			}
		}

		if (document.getElementById("toggle").checked==false) { //Lorsque la case pour afficher les graphes de potentiel est décochée j'appelle la fonction définie précédemment. 
			DisparitionGraphesPotentiels();
		}


		//--------------------------------Gestion du canvas--------------------------------

    	document.getElementById('clear').addEventListener('click', function() { //Lorsque j'appuie sur le bouton reset la fenêtre est rechargée. 
    		location.reload();  //rafraichir
    	}, false);

		//Partie qui permet de mettre à l'échelle le dessin de l'astre et du rayon de SCH vis à vis des zooms avant le lancement de la simulation : 
		if (nz_avant_lancement < 0) {
			for (incr = 0; incr > nz_avant_lancement; incr -= 1) {
				mobilefactor[cle] = mobilefactor[cle] / 1.2;
			}
		} else if (nz_avant_lancement > 0) {
			for (incr = 0; incr < nz_avant_lancement; incr += 1) {
				mobilefactor[cle] = mobilefactor[cle] * 1.2;
			}
		}

    	creation_blocs(context,mobilefactor,rmaxjson,maximum,compteur); //Je trace le rayon et SCH et si besoin l'astre. 
								   
		setInterval(function(){ //Fonction qui permet d'avoir un graphe de potentiel dynamique. Ce graphe est renouvelé toutes les 300ms.  
	  		$('#grsvg_'+compteur.toString()).empty();  //Je vide le contenue du canvas du potentiel.											   
    		data1=[];
    		data2=[];

			if (element2.value != "mobile"){  //Dans le cas de l'observateur distant.

    			dr=mobile.r_part_obs*0.6/50; //Je calcule l'incrément dr.
		
				for (r = 0.7*mobile.r_part_obs; r < 1.3*mobile.r_part_obs ; r += dr) { //Je parcours une gamme de valeurs de r centrée autour de mobile.r_part_obs en incrémentant de mobile.dr . 
      				V = Vr_obs(mobile.E,mobile.L,r) ; //Pour afficher de manière plus pertinente le graphe. 
      				data1.push({date: r,close: V}); //Je stocke dans data1 les valeurs de r et V.
    			}

				V = Vr_obs(mobile.E,mobile.L,mobile.r_part_obs); //Je calcule le potentiel à la position actuelle.
				data2.push({date: mobile.r_part_obs,close: V}); //Je stocke dans data2 les valeurs de r et V de la position actuelle.
				mobile.point = graphique_creation_pot(0,data1,data2,compteur,mobile); //Trace le graphe du potentiel.
	
			}else{ //Dans le cas du photon je procède de manière identique.
		
				dr=mobile.r_part*0.6/50;
		
  	  			for (r = 0.7*mobile.r_part; r < 1.3*mobile.r_part ; r += dr) { 
      				V = Vr_mob(mobile.L,r) ;
      				data1.push({date: r,close: V});  	
				}

				V = Vr_mob(mobile.L,mobile.r_part);
				data2.push({date: mobile.r_part,close: V}); 
				mobile.point = graphique_creation_pot(0,data1,data2,compteur,mobile);
			} 
	   },300);	 
								  
  	}
	else { //Dans le cas où ce n'est pas le début de la simulation et où je ne suis pas en pause. 
    	new Timer(() => animate(compteur,mobile,mobilefactor),compteur, 1, -1); //Créé un nouvel objet Timer qui répète la fonction animate toutes les 1s indéfiniment. 
		//animate calcule les coordonnées de la particule à chaque instant. 
	}

	
	document.getElementById('start').style.display = "none"; //Une fois la simulation démarrée le bouton start/débuter disparaît.
	document.getElementById('pause/resume').style.display ="inline-block"; //Une fois la simulation démarrée le bouton pause/resume apparaît.

} 

// -------------------------------------{animate}--------------------------------------------
/**
 * Fonction qui s'occupe de l'animation, tracé et calculs en cours, elle est appelé dans trajectoire() en utilisant un Timer. 
 * @param {*} compteur : Numero du mobile 
 * @param {*} mobile   : mobile en cours de calcul
 * @param {*} mobilefactor : liste des facteurs pour l'echelle
 */
function animate(compteur,mobile,mobilefactor) {

	element = document.getElementById('traject_type'); // on recupere le boutton de type de trajectoire
	var isrebond = document.getElementById("boutton_ammorti").value; // on recupere la valeur de la barre rebond		
	element2=document.getElementById('traject_type2');		//on recupere le boutton de observateur ou mobile

	mobilefactor[compteur] = factGlobalAvecClef //facteur pour l'echelle
	SurTelephone();	//on verifie si on est sur telephone ou ordinateur										 
	choixTrajectoire(compteur,context,mobilefactor,rmaxjson,maximum); // on vérifie le type de trajectoire sélectionné

	/*----------------------------------------------------------{{{{  CAS_OBSERVATEUR  }}}-----------------------------------------------------------*/

	if (element2.value != "mobile") 
	//Tout ce qui est dans cette condition concerne le cas du referentiel de l'observateur
	{
		/* La condition suivante c'est pour arreter le calcul à rs vu que R_phy > rs toujours : */
		if (mobile.condition_trace)
		{	
			/*Cette condition gere la partie trou noir (R_phy=0), dans le cas d'un observateur lointain, on fait les calculs
			jusqu'a rs puis au dela on met les valeurs aux quelles tendent les variables quand r tend vers rs. L'affichage et le tracé
			s'arretent c'est pour ça que ya une variable pour cette condition, ya que temps_observateur qui continue*/
			if (mobile.r_part_obs >rs*1.001) //pas exactement rs pour eviter les problemes de calculs 
			{
				//-----------------------------------------------------PARTIE CALCULE-------------------------------------------------

				val_obs = rungekutta_general(mobile.dtau, mobile.A_part_obs, mobile.r_part_obs, mobile.E, mobile.L, derivee_seconde_Schwarzchild_photon_obs);
				mobile.r_part_obs = val_obs[0];///valeur de r calculée par RK (Runge Kutta)
				mobile.A_part_obs = val_obs[1];//valeur de dr/dtau calculée par RK

				/*Calcul des vitesses dans metrique externe de SCH qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
				Fonctions_utilitaires_trajectoire):*/
				resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part_obs,rs,true);
				 // calcul de v_tot
				vtotal=resultat[0];
				// calcul de v_r en utilisant la fontion de calcul des vitesse en prennant en compte le signe de la derivée donné par l'equation differentielle
				vr_2_obs=resultat[1]*Math.sign(mobile.A_part_obs);
				vp_2_obs=resultat[2]; //resulatas de v_phi avec le fichier de calcul de vitesses

				varphi_obs = c * mobile.L * mobile.dtau*(1-rs/mobile.r_part_obs) / Math.pow(mobile.r_part_obs, 2)/mobile.E;//Calcul de la variation de l'angle phi pour l'ajouter à la valeur antérieure
				mobile.phi_obs=mobile.phi_obs+varphi_obs; //on met à jour le l'angle phi apres avoir calculé le var_phi

				/*Calcul de la postion [X,Y] (noramilisées) pour dessiner dans le canva (tracé) */
				mobile.position.posX2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.cos(mobile.phi_obs) / rmax) + (canvas.width / 2.);  
				mobile.position.posY2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.sin(mobile.phi_obs) / rmax) + (canvas.height / 2.);	

			}

			else /* La condition pour s'arreter à rs */
			{
				/*Cette conditions arrete les calculs et attribue les dernieres valeurs qu'il faut */
				if(mobile.r_part_obs!=rs) //Comme ça on rentre qu'une seule fois dans cette condition 
				{
					mobile.r_part_obs=rs; //condition pour que r soit excatement rs 
					/*Pour ce qui suit on met ça à la main car on sait que theoriquement ça tend vers ces valeurs */
					vp_2_obs=0 ;
					vtotal=vr_2_obs=c; 
					mobile.condition_trace=false; //on met cette condition à false pour le mobile pour l'arreter le tracé,calculs,et affichage à rs 
				}
			}
			//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------
			
			/*Affichage de toutes les variables dans le tableau */
			document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part_obs.toExponential(3);//rayon
			document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3);//temps photon (nul des le debut pas de calcul)
			document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_2_obs.toExponential(3); //vitesse angulaire (v_phi)
			document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_2_obs.toExponential(3);//vitesse radiale (v_r)
			document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(8); // vitesse totale (module)

			//-----------------------------------------------------PARTIE TRACÉ-------------------------------------------------
			//Dessin du tracé derriere la particule
			context.beginPath();//on ouvre le context
			context.fillStyle = mobile.couleur;//on choisit la couleur pour remplir parce que c'est fill
			context.rect(mobile.position.posX2, mobile.position.posY2, 1, 1); //on dessine le tracé
			context.lineWidth = "1";//en choisissant la bonne largeur des traits
			context.fill();//on le met sur le canva

			majFondFixe44(mobile);// on efface l'ancienne position de la boule
			
		    //On dessine la boule bleue avec les meme etapes
			mobile["context22"].beginPath();
			mobile["context22"].fillStyle = COULEUR_BLEU;
			mobile["context22"].arc(mobile.position.posX2, mobile.position.posY2 , 5, 0, Math.PI * 2);
			mobile["context22"].lineWidth = "1";
			mobile["context22"].fill();
		
			//-----------------------------------------------------PARTIE TRACÉ POTENTIEL -------------------------------------------------

			V = Vr_obs(mobile.E,mobile.L,mobile.r_part_obs);//on stocke la valeur du (Poteniel-1) avec les valeurs actuelles
			data2 = [];//on vide la liste qu'on va à la fonction update_graphique_2()
			data2.push({date: mobile.r_part_obs, close: V }); //on mets les les valeurs  dans data2 
			if(mobile.point !== undefined){update_graphique_2(mobile.point,data2,mobile);}//puis on les dessine si le point est defini

			//-----------------------------------------------------GESTION REBOND-------------------------------------------------
			
			if (mobile.r_part_obs <= r_phy ) 
			{
				/*Si ya un rebond on change de sens pour la vitesse */
				if (isrebond == 1 && r_phy > 0)
				{
					mobile.A_part_obs = -mobile.A_part_obs ;
				} 
				/*Si ya pas de rebond on stope le mobile sur l'astre*/
				if(isrebond == 0 && r_phy!=0 && mobile.r_part_obs <= r_phy)
				{
					Timer.instances[compteur].stop(); //on stope le Timer du mobile concerné 	

				}	
				
			}
			
		}

		/*Le temps observateur est calculé meme quand on rentre dans le trou noir ( r < rs ) */
		mobile.temps_observateur_distant += mobile.dtau //le calcul temps observateur est toujours calculé et affiché sauf si la simulation s'arrete
		document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3); //affichage
			
	}

	/*----------------------------------------------------------{{{{  CAS_PHOTON }}}-----------------------------------------------------------*/
	else
	//Tout ce qui est dans cette condition concerne le cas du referentiel du photon
	{
		if (mobile.r_part > 0) 
		{
			//-----------------------------------------------------PARTIE CALCULE-------------------------------------------------
			//MEMES ETAPES QUE LA PARTIE OBSERVATEUR

			val = rungekutta_general(mobile.dtau, mobile.A_part, mobile.r_part, null, mobile.L, derivee_seconde_Schwarzchild_photon);
		
			mobile.r_part = val[0]; //calcul de r
			mobile.A_part = val[1]; //calcul de sa derivée
			/*Calcul des vitesses avec le fichier fonctions utilitaires*/
			resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part,rs,true); /// voir fichier fonctions.j 
			
			vtotal=resultat[0]; //vitesse totale (module)
			vr_2=resultat[1]*Math.sign(mobile.A_part); //vitesse radiale  
			vp_2=resultat[2]; //vitesse angulaire

			mobile.phi = mobile.phi + c * mobile.L * mobile.dtau / Math.pow(mobile.r_part, 2);//calcul de l'angle

			/*Calcul de la postion [X,Y] (noramilisées) pour dessiner dans le canva (tracé) */
			mobile.positionspatio.posX1 = mobilefactor[compteur] * mobile.r_part * (Math.cos(mobile.phi) / rmax) + (canvas.width / 2.);  // rmax pas mobile.rmax <-----  JPC
			mobile.positionspatio.posY1 = mobilefactor[compteur] * mobile.r_part * (Math.sin(mobile.phi) / rmax) + (canvas.height / 2.);  // rmax pas mobile.rmax <-----  JPC

			mobile.temps_observateur_distant += mobile.dtau //calcul temps_observateur

			//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------
		    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AVANT RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			if(mobile.r_part>rs*1.000001) //pas exactement rs pour eviter les problemes de calculs 
			{
				document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3);//temps mobile
				document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3);//temps observateur
				document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part.toExponential(3); //rayon
				document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_2.toExponential(3);//vitesse radiale (v_r)
				document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_2.toExponential(3);//vitesse angulaire (v_phi)
				document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(8);// vitesse totale (module)
			}
			
            //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> APRES RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			
			/*On affiche les valeurs aux quelles tendent les variables theoriquement:*/
			else
			{
				document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part.toExponential(3);
				document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML="";
				document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML="";  
				document.getElementById("v_tot"+compteur.toString()).innerHTML ="";
				document.getElementById("to"+compteur.toString()).innerHTML = 1/0;
				document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3);
			}
	
			//-----------------------------------------------------PARTIE TRACÉ-------------------------------------------------
			//Dessin du tracé derriere la particule
			context.beginPath();//on ouvre le context
			context.fillStyle = mobile.couleur;//on choisit la couleur pour remplir parce que c'est fill
			/*On dessine avec ce qu'on a calculé que si r n'est pas negatif (audela de rs ça donne n'importe quoi) */
			if(mobile.r_part>1){context.rect(mobile.positionspatio.posX1, mobile.positionspatio.posY1, 1, 1);}
			else{context.rect((canvas.width / 2.0), (canvas.height / 2.0), 1, 1);}

			context.lineWidth = "1";//en choisissant la bonne largeur des traits
			context.fill();//on le met sur le canva
			
			majFondFixe44(mobile);// on efface l'ancienne position de la boule

			//On dessine la boule bleue avec les meme etapes
			mobile["context22"].beginPath();
			mobile["context22"].fillStyle = COULEUR_BLEU;
			/*On dessine avec ce qu'on a calculé que si r n'est pas negatif (audela de rs ça donne n'importe quoi) */
			if(mobile.r_part>1){mobile["context22"].arc(mobile.positionspatio.posX1, mobile.positionspatio.posY1 , 5, 0, Math.PI * 2);}
			else{mobile["context22"].arc((canvas.width / 2.0), (canvas.height / 2.0) , 5, 0, Math.PI * 2);}
			
			mobile["context22"].lineWidth = "1";
			mobile["context22"].fill();

			//-----------------------------------------------------PARTIE TRACÉ POTENTIEL -------------------------------------------------
			V = Vr_mob(mobile.L,mobile.r_part);//on stocke la valeur du (Poteniel-1) avec les valeurs actuelles
			data2 = [];//on vide la liste qu'on va à la fonction update_graphique_2()
			data2.push({date: mobile.r_part, close: V });//on mets les les valeurs  dans data2 
			if(mobile.point !== undefined){update_graphique_2(mobile.point,data2,mobile);}	//puis on les dessine si le point est defini
		}
		else 
		{
			//quand on arrive à la singularité on veut que r=0 
			mobile.r_part=0;
			document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part.toExponential(3); //et on l'affiche
			//vu que dans le trou noir les equations font un peu n'importe quoi, du coup on efface la derrniére  position
			mobile["context22"].clearRect(mobile.positionspatio.posX1, mobile.positionspatio.posY1 , 5, 0, Math.PI * 2);
			//on stop la simulation quand on arrive à r=0
			Timer.instances[compteur].stop();
			
		}  

		if (mobile.r_part <= r_phy || mobile.r_part==0) 
		{
			/*Si ya un rebond on change de sens pour la vitesse */
			if (isrebond == 1 && r_phy > 0) 
			{
				mobile.A_part = -mobile.A_part ;
			}	
			/*Si ya pas de rebond on stope le mobile sur l'astre*/
			if(isrebond == 0 && r_phy!=0 && mobile.r_part <= r_phy)
			{
				Timer.instances[compteur].stop(); //on stope le Timer du mobile concerné 	

			}	     
		}

	}
	/*si tout les Timers relié aux mobiles sont supprimés on sait que ya plus de calculs en cours alors on met qu'on a fini la simulation*/
	if (Object.keys(Timer.instances).length === 0) 
	{
		document.getElementById("indic_calculs").innerHTML=texte.pages_trajectoire.calcul_termine; //on met que le calculé est fini (voir le Json)
		document.getElementById("pause/resume").style.display='none';  //on enleve les 2 buttons pause
		document.getElementById('bouton_pause').style.display='none'; 
	}

}  

// -------------------------------------{fonction Vr_mob}--------------------------------------------

// Expression du potentiel divisé par c^2

function Vr_mob(L,r) {
	return potentiel_Schwarzchild_photon(L,r);
}

// -------------------------------------{fonction Vr_obs}--------------------------------------------

function Vr_obs(E,L,r) {
	return Math.pow(E,2)-( 1-potentiel_Schwarzchild_photon(L,r)/Math.pow(E,2) )*Math.pow(1-rs/r,2)  ;
}

// -------------------------------------{fonction Vr}--------------------------------------------

function Vr(L,r) {
	return potentiel_Schwarzchild_photon(L,r);
}

// -------------------------------------{fonction potentiel_Schwarzschild_photon}--------------------------------------------

function potentiel_Schwarzchild_photon(L,r) {
	return (1 - rs / r) * Math.pow(L / r, 2);
}

// -------------------------------------{fonction derivee_seconde_Schwarzschild_photon}--------------------------------------------

function derivee_seconde_Schwarzchild_photon(L, r) {
	return Math.pow(c, 2)/(2*Math.pow(r, 4)) * Math.pow(L, 2)*(2*r-3*rs);
}				

// -------------------------------------{fonction derivee_seconde_Schwarzschild_photon_obs}--------------------------------------------

function derivee_seconde_Schwarzchild_photon_obs(E,L,r) {
	return c*c*(r-rs)*(2*E*E*r*r*r*rs + 2*L*L*r*r - 7*L*L*r*rs + 5*L*L*rs*rs)/(2*Math.pow(r,6)*E*E); 
}

// -------------------------------------{fonction calcul_rmax}--------------------------------------------

function calcul_rmax(L,E,vr,r0,rmax1ou2){
	//eq3d(L,m,E); dans le cas avec particule massive
	if (E > 1) {
		rmax = 5 * r0;
	}
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
		if (Vr_mob(L,r0) <= Vr_mob(L,r1) && r0 > r1) {
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
			} 
			else if (r3 < r0) {
				rmax = r0;
			}
		} 
		else {
			rmax = r0;
		}
	}
}

// -------------------------------------{fonction pausee}--------------------------------------------

// Fonction bouton pause

//cette fonction a ete changé par Khaled en ajoutant la variable qui pause la Timer créé en haut
function pausee() {
    if (!Timer.paused) {
		Timer.paused = true;  
		mobile.pause = true; //je laisse cette variable comme ça pour l'intant pour ne pas changer la structure du code
		document.getElementById("pau").src = "Images/lecture.png";
		document.getElementById("pau").title = texte.pages_trajectoire.bouton_lecture;
        document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_enpause;
        document.getElementById("pause/resume").innerHTML =texte.pages_trajectoire.bouton_resume;
	} 
    else{
		    Timer.paused = false;
			mobile.pause = false;
            document.getElementById("pause/resume").innerHTML = texte.pages_trajectoire.bouton_pause;
			document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours;
			document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
			document.getElementById("pau").src = "Images/pause.png";
		}
	}

// -------------------------------------{fonction rafraichir2}--------------------------------------------

function rafraichir2(context,mobilefactor,rmaxjson,r0ou2,compteur) {
	majFondFixe();
	creation_blocs(context,mobilefactor,rmaxjson,r0ou2,compteur);
}

// -------------------------------------{fonction rafraichir}--------------------------------------------

function rafraichir() {
	window.location.reload();
	element2.value="observateur";
	// obligé de le préciser car sinon, c'est la dernière valeur qui est conservée et non la valeur par défaut
	document.getElementById("boutton_ammorti").value="0";
}

// -------------------------------------{fonction enregistrer}--------------------------------------------

function enregistrer() {
	var texte = o_recupereJson();

	if (document.getElementById('trace_present').value === "true") {
		// Demander à l'utilisateur le nom du fichier
		var nomFichier = prompt(texte.pages_trajectoire.message_nomFichier, "traject_Schaw_B_P");

		if (nomFichier !== null && nomFichier.trim() !== '') {
			canvas3 = document.getElementById("myCanvas3three");
			context3 = canvas3.getContext("2d");
			context3.drawImage(canvas, 0, 0);

		//Dessiner le logo en bas :
		var logo = new Image() //ManonLogo
		logo.src='Images/CosmoGravity_logo.png'; //ManonLogo
		logo.onload = function() {
		var largeurLogo = 100; //ManonLogo
		var hauteurLogo = (logo.height / logo.width) * largeurLogo; //ManonLogo
		var x = canvas3.width - largeurLogo; // Position en x pour le coin inférieur droit
		var y = canvas3.height - hauteurLogo; // Position en y pour le coin inférieur droit
		context3.drawImage(logo,x,y, largeurLogo, hauteurLogo); //ManonLogo

			document.getElementById("enregistrer2").click();
			canvasToImage(canvas3, {
				name: nomFichier.trim(),
				type: 'png'
			});
			majFondFixe3();};
		} else {
			alert(texte.pages_trajectoire.alerte_nomFichier);
		}
	} else {
		alert(texte.pages_trajectoire.message_enregistrer);
	}
}


// -------------------------------------{fonction majFondFixe}--------------------------------------------

function majFondFixe(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Ajout d'un fond blanc pour l'exportation
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = "15pt bold";
	context.fillStyle = "black";
	context.fillText(texte.page_trajectoire_photon.titre3,5,40);
	context.font = "13pt bold";
	context.fillText(texte.pages_trajectoire.entrees,5,70);
	context.font = "11pt normal";
	context.fillText("M = "+M.toExponential(3)+" kg",5,90);
	context.fillText("r\u209A\u2095\u1D67 = "+r_phy.toExponential(3)+" m",5,110);
	if (document.getElementById("boutton_ammorti").value == 1){context.fillText(texte.page_trajectoire_massive.amortissement+" = 0",5,130)};
	if(document.getElementById('traject_type2').value=="observateur"){
		context.fillText(texte.pages_trajectoire.observateur,5,150);
	} 
	else { context.fillText(texte.pages_trajectoire.photon,5,150); }

	context.fillText("mobile1:",5,170);
	context.fillText("r\u2080 = "+(r0o2[1]).toExponential(3)+" m",5,190);
	context.fillText("V\u2080 = "+vphiblab.toExponential(3)+" m.s\u207B\u00B9",5,210);
	context.fillText("\u03C6\u2080 = "+vrblab.toExponential(3)+" °",5,230);
 

	nombeuhreudefusees = Number(document.getElementById("nombredefusees").value);


	if (nombeuhreudefusees>=2) {
		context.fillText("mobile2:",5,250);
		context.fillText("r\u2080 = "+r0o2[2].toExponential(3)+" m",5,270);
		context.fillText("V\u2080 = "+vphi2i.toExponential(3)+" m.s\u207B\u00B9",5,290);
		context.fillText("\u03C6\u2080= "+vr2i.toExponential(3)+" °",5,310);
	}
}

// -------------------------------------{fonction majFondFixe44}--------------------------------------------

function majFondFixe44(mobile){
	mobile["context22"].clearRect(0, 0, canvas.width, canvas.height);
}

// -------------------------------------{fonction majFondFixe22}--------------------------------------------

function majFondFixe22(){
	context22.clearRect(0, 0, canvas.width, canvas.height);
	}

// -------------------------------------{fonction majFondFixe3}--------------------------------------------

function majFondFixe3(){
	context3.clearRect(0, 0, canvas.width, canvas.height);
}

// -------------------------------------{fonction text_inte}--------------------------------------------

// Fonction de verification par rapport à R_phy r0 et rs avant lancement 
function test_inte() {

	var texte = o_recupereJson(); //recuperer le texte du json

	/*variables pours verifier 3 conditions differentes:*/
	var onebol=false;
	var twobol=false;
	var threebol=false;
	var fourbol=false;

	/*On boucle sur tout les fusees pour voir si tout est bon:*/
	var nombre_de_fusees = Number(document.getElementById("nombredefusees").value);
	for (count = 1; count <= nombre_de_fusees; count += 1) {
		var r0testinte = Number(document.getElementById("r0"+count.toString()+"").value); 
		if(r0testinte<0){
			onebol=true;
		}
		if(r0testinte<=rs){
			twobol=true;
		}
		if(r0testinte<r_phy){
			threebol=true;
		}
		if(vr==0 && dphi_sur_dlambda==0){
			fourbol=true;
		}
  }

	/*Si la condition r>r_phy>rs n'est pas verifié on renvoie un message d'erreur adapté à la situation*/
	if (r_phy < 0 || onebol) {
		return texte.pages_trajectoire.rayon_neg;
	} else if (r_phy <= rs && r_phy!=0)   {
		return texte.pages_trajectoire.rayonPhyInfHorz;
	} else if (twobol) {
		return texte.pages_trajectoire.rayonHorzInfRayonSchw;
	} else if(threebol){
		return texte.pages_trajectoire.lancerInterdit;
	}
	else if(fourbol) {
		return texte.pages_trajectoire.vitesses_initiales_nulles;
	}
	//sinon on revoit un true pour lancer la simulation
	else
	{
		return true;
	}
  
}

// -------------------------------------{fonction creation_blocs}--------------------------------------------

// crée les différentes couches visuelles
function creation_blocs(context,mobilefactor,rmaxjson,r0ou2,compteur){
	r2bis=(80*r0ou2)/(factGlobalAvecClef);
	r1bis=Math.round((80*r0ou2)/(factGlobalAvecClef*10**testnum(r2bis)));
	ech=r1bis*10**testnum(r2bis);

	context.lineWidth = "1";
	context.fillStyle = COULEUR_NOIR;
	if ((factGlobalAvecClef * m / rmaxjson[cle]) < 3) {
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
		context.strokeStyle = COULEUR_RS;
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, ((factGlobalAvecClef * 2 * m / rmaxjson[cle])), 0, Math.PI * 2);
		context.stroke();
	}
	if (m < r_phy) {
		context.beginPath();
		context.fillStyle = COULEUR_RPHY;
		context.setLineDash([]);
		context.arc(posX3, posY3, (factGlobalAvecClef * r_phy / rmaxjson[cle]), 0, Math.PI * 2);
		context.fill();
		context.beginPath();
		context.strokeStyle = COULEUR_RS;
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, ((factGlobalAvecClef * 2 * m / rmaxjson[cle])), 0, Math.PI * 2); 
		context.stroke();
	}
	context.fillStyle = 'white';

	context.fillStyle = COULEUR_RS;
	context.fillText(ech.toExponential(1)+" m",605,90);
	context.stroke();
	context.beginPath();      // Début du chemin
	context.strokeStyle = COULEUR_RS;
	context.setLineDash([]);
	context.moveTo(600,110);
	context.lineTo(600+((r1bis*10**testnum(r2bis))*factGlobalAvecClef)/r0ou2,110);
	context.moveTo(600,105);
	context.lineTo(600,115);
	context.moveTo(600+((r1bis*10**testnum(r2bis))*factGlobalAvecClef)/r0ou2,105);
	context.lineTo(600+((r1bis*10**testnum(r2bis))*factGlobalAvecClef)/r0ou2,115);
	// Fermeture du chemin (facultative)
	context.stroke();

}

// -------------------------------------{fonction canvasAvantLancement}--------------------------------------------

function canvasAvantLancement(){
	nbrFusee = document.getElementById("nombredefusees").value
	cle = -1

	if(ifUneFois3){
	if(nbrFusee ==1){
		maximum=r0o2[1]
		cle = 1;
	}
	else{
		cle=0;
		for (key = 1; key <= nbrFusee; key += 1) {
			if(r0o2[key]>=maximum){
				maximum=r0o2[key];
				cle=key;
			}
		}
	}

	facteurDeMalheur = [] // Je suis désespéré
	
	for (key = 1; key <= nbrFusee; key += 1) {
		facteurDeMalheur[key] = Number(document.getElementById("scalefactor").value);  	
	
	}
	for (key = 1; key <= nbrFusee; key += 1) {
		if(key!=cle){
			facteurDeMalheur[key] = Number(document.getElementById("scalefactor").value)/(r0o2[cle]/r0o2[key]);
		}
	}

	factGlobalAvecClef = facteurDeMalheur[cle]
	fact_defaut= facteurDeMalheur[cle];

	ifUneFois3 = false
    }



	canvas = document.getElementById("myCanvas");
    if (!canvas) {
		alert(texte.pages_trajectoire.impossible_canvas);
		return;
    }

	canvas.style = "margin: auto;";
	

    context = canvas.getContext("2d");
    if (!context) {
		alert(texte.pages_trajectoire.impossible_context);
		return;
    } 
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.lineWidth = "1";


	//Texte 
	context.font = "11pt normal"; 
	r2bis=(80*maximum)/(factGlobalAvecClef);
	r1bis=Math.round((80*maximum)/(factGlobalAvecClef*10**testnum(r2bis)));
	ech=r1bis*10**testnum(r2bis);
	context.beginPath();
	context.fillStyle = COULEUR_RS;
	context.fillText(ech.toExponential(1)+" m",605,90);
	context.stroke();

	//Barre
	context.strokeStyle = COULEUR_RS;
	context.beginPath(); // Début du chemin
	context.setLineDash([]);

	context.moveTo(600,105);
	context.lineTo(600,115);

	context.moveTo(600,110);
	context.lineTo(600+((r1bis*10**testnum(r2bis))*factGlobalAvecClef)/maximum,110);

	context.moveTo(600+((r1bis*10**testnum(r2bis))*factGlobalAvecClef)/maximum,105);
	context.lineTo(600+((r1bis*10**testnum(r2bis))*factGlobalAvecClef)/maximum,115);

	context.stroke();


}

// -------------------------------------{fonction MAJGraphePotentiel}--------------------------------------------

function MAJGraphePotentiel(data1,data2,compteur,mobile){
	data1 = []
	for (r = 0.7*mobile.r_part; r < 1.3*mobile.r_part; r += mobile.dr) {
		V = Vr_mob(r,mobile.E,mobile.L)-1;
		data1.push({date: r,close: V});
	}
	
	graphique_creation_pot(0,data1,data2,compteur,mobile);

}


/**
 * Fonction qui permet de préparer le canvas de la simulation en fonction de si on choisit une trajectoire complète ou simple. 
 * @param {Number} compteur : numéro de la fusée entre 0 et le nombre de fusées total, sans dimension. 
 * @param {object} context : objet de contexte de rendu 2D obtenu à partir d'un élément <canvas> en HTML. Cet objet de contexte de rendu 2D contient toutes les méthodes et propriétés nécessaires pour dessiner la simulation en terme de graphes.
 * @param {Number} mobilefactor : le facteur d'échelle lié à ce mobile, sans dimension.
 * @param {Number} rmaxjson : valeur maximale de la coordonnée radiale, en m.   
 * @param {Number} r0ou2 : distance initiale au centre de l'astre qui est la plus grande parmi les différentes mobiles, en m.  
 */
function choixTrajectoire(compteur,context,mobilefactor,rmaxjson,r0ou2) {
    if (element.value == 'simple') {
		majFondFixe();
        creation_blocs(context,mobilefactor,rmaxjson,r0ou2,compteur);
		diametre_particule = DIAMETRE_PART*2;
	}else if (element.value=='complete'){
        diametre_particule = DIAMETRE_PART;
    }
}

//----------------------------------------------------{recuperation}----------------------------------------------------

/**
 * Fonction qui sert à faire fonctionner le bouton valeurs précédentes lorsque aucune simulation n'a été démarrée. 
 */
function recuperation(){

	if(document.getElementById('trace_present').value!="true"){ //Dans le cas où aucune simulation n'a demarée.
		load_schwarshild_photon(); //Récupère les valeurs de la dernière simulation.
		var lenbdefusees = Number(document.getElementById("nombredefusees").value); //Récupère le nombre de mobiles.
		initialisationGenerale(lenbdefusees); //Permet le calcul et l'affichage du tableau fixe de constantes avant le début de la simulation. 
	}

}
