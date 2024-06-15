
// variables globales
var title = "V(r)/c² - 1";
var clicks = 0;
var nbRebonds = 0;
const DIAMETRE_PART = 1;
var observateur=0;
var vtotal=0;
var nzoom=0
var ns_avant_lancement=0;
var facteurDeMalheur=[];
var cle;
var fact_defaut;
var temps_observateur_distant=0
testouille=true; //ManonV5
testouilleV2=true; //ManonV5
var c = 299792458;
var G = 6.67385 * Math.pow(10, -11);

testouille=true; //ManonV5
testouilleV2=true; //ManonV5

// liste de couleurs en hexa
const COULEUR_ORANGE = '#ffb407';
const COULEUR_NOIR = '#2F2D2B';
const COULEUR_BLEU = '#4080A4';
const COULEUR_CYAN = '#008B8B';
const COULEUR_BLANC = '#ffffff';
const COULEUR_ROUGE = '#ff0000';
const COULEUR_ROUGE_COSMO= '#b54b3a';
const COULEUR_GRIS = '#CCCCCC';
const COULEUR_MARRON = '#673B15';

// couleurs rayons et particule
const COULEUR_PART = COULEUR_ROUGE_COSMO;
const COULEUR_RS = COULEUR_BLEU;
const COULEUR_RPHY = COULEUR_GRIS;
const COULEUR_BLEU_MARINE='#1A03FF'


ifUneFois=true // booleen qui permet plus bas d'utiliser la condition if une seule fois durant la simulation
ifUneFois2=true
ifUneFois3=true 

var factGlobalAvecClef //pour l'échelle avant lancement
var compteurVitesseAvantLancement = 0
//variable globale, key value
//objets json
var rmaxjson = {};
var mobilefactor = {};
var r0o2 ={};

var maximum;
var cle;
var fuseecompteur;
var listejsonfusees={};


var z=0;
/**
 * Le decalage spectrale
 * @type {float}
 */
var z_obs=0;
var nombre_de_g_calcul_memo =0 // pour le g ressenti 
var nombre_de_g_calcul=0


var expl1 =new Image();
var expl2 =new Image();
var expl3 =new Image();
var expl4 =new Image();
var expl5 =new Image();
var expl6 =new Image();
expl1.src='./Images/explose/expl1.png';
expl2.src='./Images/explose/expl2.png';
expl3.src='./Images/explose/expl3.png';
expl4.src='./Images/explose/expl4.png';
expl5.src='./Images/explose/expl5.png';
expl6.src='./Images/explose/expl6.png';


///variables globales pour les calculs
var c = 299792458;
var G = 6.67385 * Math.pow(10, -11);


//----------------------------------------------------{Timer}----------------------------------------------------

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


//----------------------------------------------------{initialisationGenerale}----------------------------------------------------

function initialisationGenerale(fuseecompteur){
    c = 299792458;
    G = 6.67385 * Math.pow(10, -11);				  
    M = Number(document.getElementById("masse_input").value);
    r_phy = Number(document.getElementById("rayon_phy_input").value);
    m = G * M / Math.pow(c, 2); 
    rs=2*m;

	for (compteur = 1; compteur <= fuseecompteur; compteur += 1) {
	    listejsonfusees[compteur]=initialisation(compteur);  
	}
  
}

//----------------------------------------------------{lancerDeFusees}----------------------------------------------------

function lancerDeFusees(fuseecompteur){
    c = 299792458;
    G = 6.67385 * Math.pow(10, -11);				  
	M = Number(document.getElementById("masse_input").value);
	r_phy = Number(document.getElementById("rayon_phy_input").value);
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


//----------------------------------------------------{supprHtml}----------------------------------------------------

//supprHtml et genereHtml sont les fonctions qui generent le html de maniere dynamique
function supprHtml(){
	var nbrfuseesuppr = sessionStorage.getItem("nombre_de_fusees_input");
	document.getElementById('tableau-sortie').innerHTML = ''; 
	document.getElementById('tableau-sortie-2').innerHTML = ''; 
	document.getElementById('tableauresultatsimu').innerHTML = ''; 



	if (sessionStorage.getItem("nombre_de_fusees_input")){
		var nbrfuseesuppr = sessionStorage.getItem("nombre_de_fusees_input");
	}

	var elementcanvasasuppr = document.getElementById("myCanvas");
	elementcanvasasuppr.parentNode.removeChild(elementcanvasasuppr);
	var canvaswh = document.getElementById("canvaswidthheight").value;

	for (count = 1; count <= nbrfuseesuppr; count += 1) {
		var elementrayonasuppr = document.getElementById("rayon"+count.toString()+"");
		elementrayonasuppr.parentNode.removeChild(elementrayonasuppr);
		var elementvpasuppr = document.getElementById("vitesseu"+count.toString()+"");
		elementvpasuppr.parentNode.removeChild(elementvpasuppr);
		var elementvrasuppr = document.getElementById("idphie"+count.toString()+"");
		elementvrasuppr.parentNode.removeChild(elementvrasuppr);
		var elementvrasuppr = document.getElementById("tetaid"+count.toString()+"");
		elementvrasuppr.parentNode.removeChild(elementvrasuppr);

		var elementcanvasbouleasuppr = document.getElementById("myCanvasBoule"+count.toString()+"");
		elementcanvasbouleasuppr.parentNode.removeChild(elementcanvasbouleasuppr);

		if(canvaswh=="750"){
			var elementgrapheasuppr = document.getElementById("grsvg_"+count.toString()+"");
			elementgrapheasuppr.parentNode.removeChild(elementgrapheasuppr);
		}

	}
	var elementcanvas3asuppr = document.getElementById("myCanvas3three");
	elementcanvas3asuppr.parentNode.removeChild(elementcanvas3asuppr);

}

//----------------------------------------------------{genereHtml}----------------------------------------------------

function genereHtml(){
	var nbredefuseesgenere = Number(document.getElementById("nombre_de_fusees_input").value);
	var divchamp_a_remplir= document.getElementById('champs_a_remplir');
	
	lenbdefusees = nbredefuseesgenere;
	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {

		var newlabel = document.createElement("Label_mobile_entree");
		newlabel.innerHTML = "Mobile "+countt.toString();
		divchamp_a_remplir.appendChild(newlabel);

		var	divchampsr = document.createElement("div");
		divchampsr.setAttribute("class",'form-container');
		divchamp_a_remplir.appendChild(divchampsr);

		
		
		var span = document.createElement("span");
		span.setAttribute("id","rayon"+countt.toString()+"");
		span.setAttribute("class",'input-group');
		divchampsr.appendChild(span);
		
		
		var newlabel = document.createElement("Label");
		//newlabel.setAttribute("title","Distance initiale du projectile au centre de l'astre");
		newlabel.setAttribute("id","ctreastre");
		newlabel.setAttribute("title","");
		newlabel.setAttribute("for","r01");
		newlabel.innerHTML = " r<sub>0</sub> (m)";
		span.appendChild(newlabel);
		
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","r0"+countt.toString()+"");
		newinput.setAttribute("value","2e13");
		newinput.setAttribute("align","left");
		newinput.setAttribute("maxlength","18");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","5");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		span.appendChild(newinput);
	
		var span = document.createElement("span");
		span.setAttribute("id","vitesseu"+countt.toString()+"");
		span.setAttribute("class",'input-group');
		divchampsr.appendChild(span);
		
		var newlabel = document.createElement("Label");
		newlabel.setAttribute("id","vitesseurlabel");
		newlabel.setAttribute("title","");
		newlabel.setAttribute("for","v01");
		newlabel.innerHTML = " v<sub>0</sub> (m/s)";
		span.appendChild(newlabel);
		
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","v0"+countt.toString()+"");
		newinput.setAttribute("value","7.75e7");
		newinput.setAttribute("maxlength","25");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","5");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		span.appendChild(newinput);
	
	
		var span = document.createElement("span");
		span.setAttribute("class",'input-group');
		span.setAttribute("id","idphie"+countt.toString()+"");
		divchampsr.appendChild(span);
		
		var newlabel = document.createElement("Label");
		newlabel.setAttribute("id","philabel");
		newlabel.setAttribute("title","");
		newlabel.setAttribute("for","phi01");
		newlabel.innerHTML =" "+htmlDecode("&phi;")+"<sub>0</sub>°";
		span.appendChild(newlabel);
		
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","phi0"+countt.toString()+"");
		newinput.setAttribute("value","0");
		newinput.setAttribute("maxlength","10");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","5");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		span.appendChild(newinput);
	
		var span = document.createElement("span");
		span.setAttribute("class",'input-group');
		span.setAttribute("id","tetaid"+countt.toString()+"");
		divchampsr.appendChild(span);
		
		var newlabel = document.createElement("Label");
		newlabel.setAttribute("id","thetalabel");
		newlabel.setAttribute("title","");
		newlabel.setAttribute("for","teta1");
		newlabel.innerHTML = " "+htmlDecode("&#632;")+"<sub>0</sub>°";      //  &#632; c'est phi majuscule
		span.appendChild(newlabel);
		
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","teta"+countt.toString()+"");
		newinput.setAttribute("value","90");
		newinput.setAttribute("maxlength","10");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","5");
		newinput.setAttribute("onchange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		span.appendChild(newinput);
	
	}

	var newRow_sortie=document.getElementById('tableau-sortie').insertRow();
	var jstring_sortie = '<tr id="tgggg1" >'
	//pour katex il faux mettre un antislash devant le antislash
	jstring_sortie +='<th  id="rayonschwars" title="" >$rs=\\frac{2GM}{c^{2}}(m)$</th>';
	jstring_sortie +='<th  style="display: none;" id="gravtxt" title="">$grav=\\frac{GM}{R^{2}}\\frac{1}{9.81}(g)$</th>';
	jstring_sortie +='<th  style="display: none;" id="vitesseLibéra" title="">$Vlib=c(\\frac{rs}{R})^{1/2}(m.s^{-1}) $</th>';     //  <---------JPC
	jstring_sortie +='<th  style="display: none;" id="TempTrouNoirtxt" title="">$T=6.15*10^{-8}\\frac{M\\odot}{M}(K)$</th>';
	jstring_sortie +='<th  style="display: none;" id="tempsEvaporationTrouNoirtxt" title="">$t=6.6*10^{74}(\\frac{M}{M\\odot})^{3}(s)$</th>';
	jstring_sortie +='</tr>';
	
	newRow_sortie.innerHTML = jstring_sortie;

	var newRow_sortie2=document.getElementById('tableau-sortie').insertRow();
	var jstring_sortie2 = '<tr id="tgggg2" >'
	jstring_sortie2 +='<td class="tg-3ozo" id="rayonschwarsValue">0</td>';
	jstring_sortie2 +='<td class="tg-3ozo" style="display: none;" id="g">0</td>';
	jstring_sortie2 +='<td class="tg-3ozo" style="display: none;" id="Vlib">0</td>';
	jstring_sortie2 +='<td class="tg-3ozo" style="display: none;" id="TempTN">0</td>';
	jstring_sortie2 +='<td class="tg-3ozo" style="display: none;" id="tempsEvapTN">0</td>';
	jstring_sortie2 +='</tr>';
	newRow_sortie2.innerHTML = jstring_sortie2;


	
	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		
		var newRow=document.getElementById('tableau-sortie-2').insertRow();
		var newRow2=document.getElementById('tableau-sortie-2').insertRow();
		var newRow3=document.getElementById('tableau-sortie-2').insertRow();
		
		var jstring = '<tr class="label-row">'
		jstring += '<th colspan="4" > Mobile'+countt.toString()+ '</th></tr>';
		newRow.innerHTML = jstring;

		var jstring = '<tr id="tgggg2" >'
		jstring += '<th >$L'+countt.toString()+'(m)$</th>';
	
		jstring += '<th >$E'+countt.toString()+'$</th>';
	
		jstring += '<th  id="vitesse_orb_circ'+countt.toString()+'" title="">$Vcirc'+countt.toString()+' (m/s)$</th>'; //ManonCirculaire
	
		newRow2.innerHTML = jstring;

		var jstring = '<tr id="tgggg3" >'

		jstring += '<td id="L'+countt.toString()+'">0</td>';

		jstring += '<td id="E'+countt.toString()+'">0</td>';

		jstring += '<td id="Vcirc'+countt.toString()+'">0</td>'; 
		
		newRow3.innerHTML = jstring;
		
	}
	



	//element2=document.getElementById('traject_type2');  <------------------------------------JPC

	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		var newRow=document.getElementById('tableauresultatsimu').insertRow();
		// il faudrait songer a la sécurité ici, 'never trust user input', serait il possible pour un utilisateur de prendre le controle avec ses user input?

		newRow.innerHTML = `<tr id="tg2gga`+countt.toString()+`">
		<th >r(m)</th>
		<th id="temps_ecoule`+countt.toString()+`" ></th>
		<th id="acceleration`+countt.toString()+`" title="" > Gradient (m.s<sup>-2)</sup>)</th>
		<th id="vitesseur`+countt.toString()+`" title=""   >V<SUB>r</SUB>(m.s<sup>-1</sup>) </th>
		<th id="vitesseuphi`+countt.toString()+`" title=""   >V<SUB>&phi;</SUB>(m.s<sup>-1</sup>)</th>
		<th id="temps_obs`+countt.toString()+`" ></th>
		<th id="decal_spect`+countt.toString()+`" title="" ></th>
		<th id="v_total`+countt.toString()+`" title="" >   V<SUB>physique</SUB> (m.s<sup>-1</sup>) </th>
		<th id="distance_metrique`+countt.toString()+`" title="" ></th> 
		<th id="nb_g`+countt.toString()+`" title=""  style="display: none;"></th>
		<th id="dernier_g`+countt.toString()+`" title=""  style="display: none;"></th>
		<th id ="puissance_consommee_label`+countt.toString()+`" title=""  style="display: none;"></th>`; //ManonV3
		

		var newRow2=document.getElementById('tableauresultatsimu').insertRow();

		newRow2.innerHTML = `<tr id="tg2ggb`+countt.toString()+`">
		<td id="r_par`+countt.toString()+`">res</td>
		<td id="tp`+countt.toString()+`">res</td>
		<td id="ga`+countt.toString()+`">res</td>
		<td id="vr_sc_mas`+countt.toString()+`">res</td>
		<td id="vp_sc_mas`+countt.toString()+`">res</td>
		<td id="to`+countt.toString()+`">res</td>
		<td id="decal`+countt.toString()+`">res</td>
		<td id="v_tot`+countt.toString()+`">res</td>
		<td id="distance_parcourue`+countt.toString()+`">res</td>
		<td id="g_ressenti`+countt.toString()+`" style="display: none;">0</td>
		<td id="dernier_g_res`+countt.toString()+`" style="display: none;">0</td>
		<td id="puissance_consommee`+countt.toString()+`" style="display: none;">0</td>`; //ManonV3
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

	texteTrajectoireMassive(nbredefuseesgenere);

	//notationvitesseree2();
	//infobulleobservateurdistant();
	//textegravetetc();
	//pour le bon affichage du katex
	renderMathInElement(document.body, {
		// ...options...
		delimiters:[
			{left:"$",right:'$',display: false},
		]
	});
	 
}// fin fonction genereHtml

//----------------------------------------------------{initialisation}----------------------------------------------------

/**
 * Fonction qui permet la récupération des valeurs remplies par l'utilisateur et en fonction le calcul et l'affichage du premier tableau fixe de constantes avant le début de la simulation.
 * @param {Number} compteur : renseigne sur le numéro du mobile qu'on initialise.
 * @returns {Object} mobile : objet contenant toutes les informations sur un mobile/fusée/particule... 
 */
function initialisation(compteur){

	var texte = o_recupereJson(); //Cela me permettra de récupérer le texte pour les infobulles. 
			
	//Je récupère les différentes valeurs rentrées par l'utilisateur :
	M = Number(document.getElementById("masse_input").value); //Masse de l'astre.
	r_phy = Number(document.getElementById("rayon_phy_input").value); //Rayon physique de l'astre.
	r0 = Number(document.getElementById("r0"+compteur.toString()).value); //Distance initiale au centre de l'astre.
	v0= Number(document.getElementById("v0"+compteur.toString()).value); //Vitesse initiale du mobile.
	phi0 = Number(document.getElementById("phi0"+compteur.toString()).value); //Angle initiale phi de la position du mobile.
	teta = Number(document.getElementById("teta"+compteur.toString()).value); // Angle initiale phi de la vitesse du mobile.

	teta1=teta; //Je garde une trace de l'angle en degrés avant de le convertir en radians.
	//Je convertis les deux angles obtenus en degrés en radians :
	phi0=(phi0*Math.PI)/180;
	teta=(teta*Math.PI)/180;

	//Je calcule le rayon de Schwarzschild correspondant : 
	m = G * M / Math.pow(c, 2); 
	rs=2*m;

	if(v0>c){ //Je vérifie si la vitesse initiale est supérieure à la vitesse de la lumière.
		alert(texte.pages_trajectoire.alerte_v0_superieure_c); //Si c'est le cas j'ai une alerte et la simulation ne peut pas débuter.
		return;
	}
    
	E=Math.sqrt(1-rs/r0)/Math.sqrt(1-v0**2/c**2); //Je calcule la constante d'intégration sans dimension E.
	dphi_sur_dtau=Math.sin(teta)*v0*E/(Math.sqrt(1-rs/r0)*r0); //Je calcule dphi/dtau. 
	vr=Math.cos(teta)*v0*E; //Je calcule dr/dtau
	L = (dphi_sur_dtau*(r0**2))/c; //Je calcule L la constante d'intégration. 
	
	deltam_sur_m = 0; //J'initialise la valeur du rapport d'énergie consommée pendant le pilotage.
	puissance_consommee_calcul=0; //J'initialise la valeur de la puissance consommée pendant le pilotage.
	nombre_de_g_calcul = 0; // Pareil pour le nombre de g ressenti. 
	vitesse_precedente_nombre_g = 0; //Pareil pour la vitesse précédent le pilotage. 

	v_rotation = c*Math.sqrt(rs/(2*(r0-rs))); //Calcul de la vitesse pour une orbite circulaire à ce r0.

	//J'affiche dans le tableau les valeurs calculée de L, E, rs, la vitesse pour une orbite circulaire :
	document.getElementById("L"+compteur.toString()).innerHTML = L.toExponential(3);
	document.getElementById("E"+compteur.toString()).innerHTML = E.toExponential(3);
	document.getElementById("Vcirc"+compteur.toString()).innerHTML = v_rotation.toExponential(5); 
	document.getElementById("rayonschwarsValue").innerHTML = rs.toExponential(3);

	//Je prépare le fait qu'initialement aucune énergie n'a été consommée : 
	document.getElementById("decal"+compteur.toString()).innerHTML = "";

	if (v_rotation>= (c/2)){ //En fonction d'une condition de stabilité j'affiche une infobulle sur la vitesse pour l'orbite circulaire.
		document.getElementById("Vcirc"+compteur.toString()).title=texte.pages_trajectoire.orbite_circulaire_instable; //Si elle est instable.
	}else{
		document.getElementById("Vcirc"+compteur.toString()).title=texte.pages_trajectoire.orbite_circulaire_stable; //Si elle est stable. 
	}

	//Je récupère mon facteur d'échelle : 
	scale_factor = Number(document.getElementById("scalefactor").value);  

	//Je calcule la distance radiale maximale que je pourrais atteindre : 
  	if( (E>0.99999 & E<1.00001) && (L >= 2*rs || L <=-2*rs ) ){ 
		rmax=1.1*r0;
   	} 	
   	else if (E==1 && L==0) {rmax=2*r0; } 
  	else {
		rmax=calcul_rmax(L,E,vr,r0,1);  
		if(rmax<r0) {rmax=r0 ;}
	}   

	//--------------------------------Initialisation de mon objet mobile--------------------------------

	mobile = { r0:r0, dphi_sur_dtau:dphi_sur_dtau, vr:vr, L:L, E:E , phi0:phi0  };  //Je créé un objet mobile dans lequel je stocke différentes valeurs initiales associées à ce mobile.

	//J'associe à mon mobile des strings associés à mon graphe de potentiel : 
	mobile["pointsvg"]="pointg"+compteur.toString();
	mobile["graphesvg"]="#grsvg_"+compteur.toString();

	//J'initialise et j'associe d'autres variables à mon objet mobile : 
	mobile["rmax"]=rmax; //Ma position radiale maximale atteinte. 
	mobile["blups"]=0;
	mobile["pause"]=true; //Si je suis en pause, initialement oui. 
	mobile["debut"]=true; //Si je suis au début de ma simulation, initialement oui.

	mobile["condition_trace"]=true //Cette condition c'est pour arreter le tracer et l'affichage quand on en a besoin.

	couleurs = generateurCouleur();
	mobile["couleur"]="rgb("+couleurs[0]+", "+couleurs[1]+", "+couleurs[2]+")";//La couleur générée aléatoirement associée à mon mobile.
	//Les nombres rgb associés à cette couleurs : 
	mobile["red"]=couleurs[0];
	mobile["green"]=couleurs[1];
	mobile["blue"]=couleurs[2];

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
		vphiblab=v0; //Je récupère la vitesse initiale.
		vrblab=phi0*180/Math.PI; //Je récupère l'angle de la position initiale en degrés. 
	}
	if(compteur==2){
		vphi2i = v0; //Je récupère la vitesse initiale. 
		vr2i = phi0*180/Math.PI; //Je récupère l'angle de la position initiale en degrés. 
	}

	boutonAvantLancement(); //J'associe aux différents boutons les fonctions associées d'avant le lancement. 
	canvasAvantLancement(); //J'affiche l'échelle du canvas avant le début de la simulation. 

	return mobile; //Je récupère au final de cette fonction l'objet mobile correctement initialisé.
} 

//----------------------------------------------------{verifnbr}----------------------------------------------------

function verifnbr() {//fonction qui affiche un message d'erreur si des valeurs ne sont pas donnée dans l'une des cases
	
	r_phy = document.getElementById("rayon_phy_input").value;
	M = document.getElementById("masse_input").value;
	var onebolean=false;
	var twobolean=false;
	var threebolean=false;

	var nbrdefuseesverifnbr = Number(document.getElementById("nombre_de_fusees_input").value);
	for (count = 1; count <= nbrdefuseesverifnbr; count += 1) {
			var r0verifnbr = Number(document.getElementById("r0"+count.toString()+"").value); 
			var vphiverifnbr = Number(document.getElementById("phi0"+count.toString()+"").value); //vphi; <-------- JPC
			var vrverifnbr = Number(document.getElementById("teta"+count.toString()+"").value); //vr;  <----------- JPC
			if(isNaN(r0verifnbr)){
				onebolean=true;
			}
			if(isNaN(vphiverifnbr)){
				twobolean=true;
			}
			if(isNaN(vrverifnbr)){
				threebolean=true;
			}
	}

	if (onebolean){
		alert ("Veuillez vérifier vos saisie en r0");}

	if (twobolean){
		alert ("Veuillez vérifier vos saisie en Vphi");
	}
	if (threebolean){
		alert ("Veuillez vérifier vos saisie en Vr");
	}
	if (isNaN(r_phy)){
		alert ("Veuillez vérifier vos saisie en r physique");
	}
	if (isNaN(M)){
		alert ("Veuillez vérifier vos saisie en M");															
	}

}

//----------------------------------------------------{trajectoire}----------------------------------------------------

/**
 * Première étape qui lance la partie calculatoire.
 * @param {Number} compteur : numéro du mobile si il y en a plusieurs.
 * @param {Object} mobile : objet baryonique peut être un spationaute ou autre.
 * @returns 
 */
function trajectoire(compteur,mobile) {
	
  	texte = o_recupereJson();

  	if (mobile.pause || mobile.debut){

		document.getElementById("tg2").style.display = "table"; //Fait apparaître le tableau des résultats.
		document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours; //Affiche que le calcul est en cours.

		SurTelephone(); //Affichage de l'information sur les touches claviers en fonction de la taille de l'écran.

		//Interdiction de changer les valeurs de M, r_phy et le nombre de fusées une fois la simulation lancée : 
		document.getElementById('masse_input').disabled = true; 
		document.getElementById('rayon_phy_input').disabled = true;
		document.getElementById('nombre_de_fusees_input').disabled = true; 

		var nbredefusees = Number(document.getElementById("nombre_de_fusees_input").value); //Récupère la valeur du nombre de fusées.

		for (countt = 1; countt <= nbredefusees; countt += 1) { //Pour toutes les fusées :
			//Interdiction de changer les valeurs de r0, phi0, v0 et teta une fois la simulation lancée.
			document.getElementById('r0'+countt.toString()+'').disabled = true; 
			document.getElementById('phi0'+countt.toString()+'').disabled = true;
			document.getElementById('teta'+countt.toString()+'').disabled = true;
			document.getElementById('v0'+countt.toString()+'').disabled = true;  
   		}

		//Interdiction de changer les valeurs des modes observateur et spationaute une fois la simulation lancée : 
		document.getElementById('observateur').disabled = true; //Observateur.
		document.getElementById('spationaute').disabled = true; //Spationaute.

		element2=document.getElementById('traject_type2'); //Récupère la valeur de si on est en mode observateur ou en mode spationaute.

		rendreVisibleNbG() //Permet si on est en mode spationaute d'afficher les cases concernant le nombre de g ressenti. 

		if(nbredefusees == 1 && element2.value == "mobile") { //Si on a une seule fusée et que on est en mode spationaute on affiche le pilotage. 
			document.getElementById("joyDiv").style.visibility='visible';
		}

		document.getElementById('trace_present').value="true"; //Permet de déclarer qu'il y a un tracé. 

	
    	mobile.pause = false; //Permet de dire que nous ne sommes pas en pause.
    	mobile.debut = false; //Permet de dire que nous ne sommes plus au début de la simulation. 

		//--------------------------------Calcul de la trajectoire en elle-même--------------------------------

		mobile["phi"]=mobile.phi0 //J'attribue à l'élement phi du mobile la valeur de phi0 du mobile. 
		mobile["phi_obs"]=mobile.phi0 //J'attribue à l'élément phi_obs du mobile la valeur de phi0 du mobile. 

		temps_chute_libre = Math.PI * rmax * Math.sqrt(rmax / (2 * G * M)) / 2; //Calcul du temps de chute libre. 
		mobile["temps_chute_libre"]=temps_chute_libre; //J'attribue à l'élément temps_chute_libre du mobile la valeur de temps_chute_libre.

		A_init = mobile.vr; //Dans A_init je mets la valeur initiale de vr du mobile.
    	r_init = mobile.r0; //Dans r_init je mets la valeur initiale de r du mobile qui est r0. 

		//--------------------------------Récupération de la distance initiale maximum--------------------------------

		if (nbredefusees==1){//Si je n'ai que un seul mobile.
			if(ifUneFois2){ //On ne passe dans cette condition que une fois. 
				maximum=r0o2[1]; //Je stocke dans la variable maximum la distance initiale la plus grande. 
				cle = 1; //Je récupère l'indice qui correspond à ce maximum dans la liste r0o2 qui contient les r0 de tous les mobiles. 
				ifUneFois2=false; //Je fais en sorte de ne plus revenir dans cette condition. 
			}
		}else if(nbredefusees>=2){ //Si j'ai plusieurs mobiles.
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

		distance_parcourue_totale=0; //J'initialise la distance parcourue totale par le mobile dans son propre référentiel. 
		mobile["distance_parcourue_totale"]=distance_parcourue_totale; //La distance totale parcourue devient une valeur spécifique au mobile. 

    	temps_particule = 0; //J'initialise le temps dans le référentiel du mobile. 
    	mobile["temps_particule"]=temps_particule;
   		temps_observateur_distant = 0; //J'initialise le temps dans le référentiel de l'observateur distant. 
    	mobile["temps_observateur_distant"]=temps_observateur_distant;

		Rebond = document.getElementById("reb").value / 100.0; //Je récupère la valeur du rebond remplie par l'utilisateur et je la divise par 100.
    	mobile["Rebond"]=Rebond;

    	clavierEvenement(true); //Permet une fois démarrée de gérer la simulation avec les touches du clavier.
   
		//dtau=temps_chute_libre/1e3;	//Je fixe le pas de temps à une fraction du temps de chute libre. 

		/* MARCHE BIEN MASI TEMPORAIRE:*/
		dtau3=temps_chute_libre/10**Math.floor(Math.log10(temps_chute_libre));	//on prend que la partie sans puissance
		//dtau=r0*c**2*rs/(2*G*M*v0*1e1);
		dtau=r0*rs*c**2/M/1e1; //marche pas mal

		dtau=dtau3*10**Math.floor(Math.log10(dtau)) //on multiplie fois la partie puissance de dtau pour adapter le pas en fonction des parametres
	
    	mobile["dtau"]=dtau;

		//--------------------------------Positions de départ du mobile--------------------------------

    	x1part = mobilefactor[compteur] * mobile.r0 * Math.cos(mobile.phi) / rmax;   //x dans le référentiel du mobile.
    	y1part = mobilefactor[compteur] * mobile.r0 * Math.sin(mobile.phi) / rmax;  //y dans le référentiel du mobile.
    	x1obs = mobilefactor[compteur] * mobile.r0 * Math.cos(mobile.phi_obs) / rmax;  //x dans le référentiel de l'observateur distant.
    	y1obs = mobilefactor[compteur] * mobile.r0 * Math.sin(mobile.phi_obs) / rmax;  //y dans le référentiel de l'observateur distant. 

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
			else{ //Dans le cas du spationaute. 
				//Je dessine la boule du mobile :
				context3.beginPath();
				context3.fillStyle = COULEUR_BLEU;
				context3.arc(mobile.positionspatio.posX1, mobile.positionspatio.posY1 , 5, 0, Math.PI * 2);
				context3.lineWidth = "1";
				context3.fill();
			}
    	}, false);

		//--------------------------------Gestion du pilotage--------------------------------

		var temps_allumage_reacteur = Number(document.getElementById("temps_allumage").value); //Récupération du temps d'allumage des réacteurs à chaque click. 
		temps_allumage_reacteur = temps_allumage_reacteur*0.001; //Conversion des ms du temps d'allumage des réacteurs en s. 
		var puissance_reacteur = Number(document.getElementById("puissance_reacteur").value); //Récupération de la puissance des réacteurs en W/kg. 

		var temps_total_reacteur=0; //Initialisation du temps total d'allumage des réacteurs au cours du pilotage. 


		if(element2.value == "mobile" ) { //Dans le cas où j'ai un seul mobile et où je suis en mode spationaute. 
		setInterval(function(){ //Fonction effectuée toutes les 50 ms, qui est le temps de réaction du système fixé. 
			if(joy.GetPhi()!=0){ 

					vitesse_precedente_nombre_g = vtotal //Stockage de la vitesse précédent l'accélération pour le calcul du nombre de g ressenti. 

					Delta_E_sur_E = joy.GetPhi()*(puissance_reacteur*temps_allumage_reacteur)/Math.pow(c,2); //Calcul du ΔE/E en fonction de la puissance et du temps d'allumage des réacteurs.
					Delta_L = ((mobile.E)/(mobile.L))*Math.pow(mobile.r_part,2)*Delta_E_sur_E*mobile.E*(1/(1-rs/mobile.r_part));

					//Delta_L_sur_L = Delta_E_sur_E; //ΔL/L en fonction de ΔE/E. 

					//mobile.L = mobile.L + mobile.L*Delta_L_sur_L; //Calcul du nouveau L associé à ce mobile.
					//mobile.E = mobile.E + mobile.E*Delta_E_sur_E; //Calcul du nouveau E associé à ce mobile. 

					mobile.L = mobile.L + Delta_L;
					mobile.E = mobile.E + mobile.E*Delta_E_sur_E;
					deltam_sur_m = deltam_sur_m + Math.abs(Delta_E_sur_E); //Calcul de l'énergie ΔE/E consommée au total. 
					temps_total_reacteur = Math.abs(joy.GetPhi()*temps_allumage_reacteur); //Calcul du temps total durant lequel les réacteurs sont allumés.
					puissance_consommee_calcul = (deltam_sur_m/temps_total_reacteur)*Math.pow(c,2); //Calcul de la puissance consommée au total en W/kg. 
									
					document.getElementById("E"+compteur.toString()).innerHTML = mobile.E.toExponential(3); //Affichage sur le site du nouveau E. 
					document.getElementById("L"+compteur.toString()).innerHTML = mobile.L.toExponential(3); //Affichage sur le site du nouveau L. 
					document.getElementById("decal"+compteur.toString()).innerHTML = deltam_sur_m.toExponential(3); //Affichage sur le site de l'énergie consommée. 
					document.getElementById("puissance_consommee"+compteur.toString()).innerHTML = puissance_consommee_calcul.toExponential(3); //Affichage sur le site de la puissance consommée.
			}
		}, 50);}
		
		//--------------------------------Gestion des boutons d'accélération/décélération--------------------------------

		document.getElementById('plusvite').removeEventListener('click',foncPourVitAvantLancement,false) //Je désassocie la fonction foncPourVitAvantLancement du bouton pour accélérer une fois la simulation commencée.
		document.getElementById('moinsvite').removeEventListener('click',foncPourVitAvantLancement,false) //Je désassocie la fonction foncPourVitAvantLancement du bouton pour décélérer une fois la simulation commencée.

		Dtau1 = 1e8 * dtau ;  //Pour permettre une accélération.
		mobile["Dtau1"]=Dtau1; //Pour associer ce Dtau1 à un mobile spécifique.
		Dtau2 = dtau/1e8  ;  //Pour permettre une décélération.
		mobile["Dtau2"]=Dtau2; //Pour associer ce Dtau2 à un mobile spécifique.

    	document.getElementById('plusvite').addEventListener('click', function() { //J'associe le bouton accélérer à la fonction suivante une fois la simulation lancée. 
			mobile=bouttons.vitesse(mobile,true); //J'accélère grâce à la fonction vitesse du fichier bouttons. 
			compteurVitesseAvantLancement+=1/nbredefusees;
			document.getElementById('nsimtxt').innerHTML= "ns="+ Math.round(compteurVitesseAvantLancement).toString(); //J'affiche le ns correspondant sur le site.
    	}, false);

    	document.getElementById('moinsvite').addEventListener('click', function() { //J'associe le bouton décélérer à la fonction suivante une fois la simulation lancée. 
			mobile=bouttons.vitesse(mobile,false); //Je décélère grâce à la fonction vitesse du fichier bouttons. 
			compteurVitesseAvantLancement-=1/nbredefusees;
			document.getElementById('nsimtxt').innerHTML= "ns="+ Math.round(compteurVitesseAvantLancement).toString(); //J'affiche le ns correspondant sur le site.
    	}, false);

	
		if(compteurVitesseAvantLancement>=0){ //Permet de prendre en compte tous les clics sur accélérer fait avant le début de la simulation. 
			for(i=0;i<(compteurVitesseAvantLancement);i++){
				mobile=bouttons.vitesse(mobile,true)
			}
		}else{ //Permet de prendre en compte tous les clics sur décélérer fait avant le début de la simulation.
			for(i=0;i>(compteurVitesseAvantLancement);i--){
				mobile=bouttons.vitesse(mobile,false)
			}
		}

		//--------------------------------Gestion des boutons de zoom--------------------------------
	
		document.getElementById('moinszoom').removeEventListener('click',foncPourZoomMoinsAvantLancement, false); //Je désassocie foncPourZoomMoinsAvantLancement du bouton pour dézoomer une fois la simulation commencée.
		document.getElementById('pluszoom').removeEventListener('click',foncPourZoomPlusAvantLancement, false); //Je désassocie foncPourZoomPlusAvantLancement du bouton pour zoomer une fois la simulation commencée.

    	document.getElementById('moinszoom').addEventListener('click',function(){//J'associe le bouton dézoomer à la fonction suivante une fois la simulation lancée.
      		var retour=bouttons.zoom(false,mobile,canvas,mobilefactor,compteur);  //Utilise la fonction zoom du fichier bouttons.
    		mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
    		mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle. 
			factGlobalAvecClef /= Math.pow(1.2,1/nbredefusees ); //Je dézoome de 20%. 
			majFondFixe44(mobile);  //Je mets à jour tout ce qui est relié au dessin du mobile. 
        	rafraichir2(context,mobilefactor,rmaxjson,maximum,compteur); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom-=1/nbredefusees; 
			document.getElementById('nzoomtxt').innerHTML= "nz="+ Math.round(nzoom).toString(); //Mets à jour l'affichage du zoom sur le site. 
    	}, false);


		document.getElementById('pluszoom').addEventListener('click', function() {//J'associe le bouton zoomer à la fonction suivante une fois la simulation lancée.
    		var retour=bouttons.zoom(true,mobile,canvas,mobilefactor,compteur);  //Utilise la fonction zoom du fichier bouttons.
   			mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
    		mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle. 
			factGlobalAvecClef *= Math.pow(1.2,1/nbredefusees ); //Je zoome de 20%.
			majFondFixe44(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile.
			rafraichir2(context,mobilefactor,rmaxjson,maximum,compteur); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom+=1/nbredefusees;
			document.getElementById('nzoomtxt').innerHTML= "nz="+ Math.round(nzoom).toString(); //Mets à jour l'affichage du zoom sur le site. 
		}, false);
  

    	document.getElementById('initialiser').addEventListener('click', function() { //Associe le bouton pour initialiser le zoom à la fonction suivante. 
			var retour=bouttons.initialiser(nbredefusees,mobilefactor,mobile,compteur,canvas); //Utilise la fonction initialiser du fichier bouttons. 
			mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
			mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle. 
			factGlobalAvecClef = fact_defaut; //Le zoom redevient celui initial de la simulation. 
       		majFondFixe44(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile.
			rafraichir2(context,mobilefactor,rmaxjson,maximum,compteur); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom=0;
			document.getElementById('nzoomtxt').innerHTML= "nz="+ nzoom.toString(); //Mets à jour l'affichage du zoom sur le site. 
    	}, false);

		//--------------------------------Graphe du potentiel--------------------------------

   		document.getElementById("bloc_resultats").style.display= "block"; //Permet d'afficher le graphe du potentiel en-dessous de la simulation de la trajectoire. 

		function DispartionGraphesPotentiels() { //Fonction qui permet de faire disparaître tous les graphes de potentiel lorsque la case est décochée. 
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
			DispartionGraphesPotentiels();
		}

		//--------------------------------Gestion du canvas--------------------------------

    	document.getElementById('clear').addEventListener('click', function() {//Lorsque j'appuie sur le bouton reset la fenêtre est rechargée et le mode observateur est choisit par défaut. 
      		rafraichir();
    	}, false);

		//Partie qui permet de mettre à l'échelle le dessin de l'astre et du rayon de SCH vis à vis des zooms avant le lancement de la simulation : 
		if (ns_avant_lancement < 0) {
			for (incr = 0; incr > ns_avant_lancement; incr -= 1) {
				mobilefactor[cle] = mobilefactor[cle] / 1.2;
			}
		} else if (ns_avant_lancement > 0) {
			for (incr = 0; incr < ns_avant_lancement; incr += 1) {
				mobilefactor[cle] = mobilefactor[cle] * 1.2;
			}
		}

    	creation_blocs(context,mobilefactor,rmaxjson,maximum,compteur); //Je trace le rayon et SCH et si besoin l'astre. 

		setInterval(function(){ //Fonction qui permet d'avoir un graphe de potentiel dynamique. Ce graphe est renouvelé toutes les 300ms.  
			$('#grsvg_'+compteur.toString()).empty(); //Je vide le contenue du canvas du potentiel.  
			data1=[]; 
			data2=[]; 

			if (element2.value != "mobile"){ //Dans le cas de l'observateur distant. 
	
   				mobile.dr=mobile.r_part_obs*0.6/50; //Je calcule l'incrément dr.
   
				for (r = 0.7*mobile.r_part_obs; r < 1.3*mobile.r_part_obs; r += mobile.dr) { //Je parcours une gamme de valeurs de r centrée autour de mobile.r_part_obs en incrémentant de mobile.dr .
					V = Vr_obs(mobile.E,mobile.L,r)-1 ; //Pour afficher de manière plus pertinente le graphe. 
					data1.push({date: r,close: V}); //Je stocke dans data1 les valeurs de r et V.
				}

				V = Vr_obs(mobile.E,mobile.L,mobile.r_part_obs)-1; //Je calcule le potentiel à la position actuelle.
				data2.push({date: mobile.r_part_obs,close: V}); //Je stocke dans data2 les valeurs de r et V de la position actuelle.

			} else{ //Dans le cas du mobile je procède de manière identique.

				mobile.dr=mobile.r_part*0.6/50; 

				for (r = 0.7*mobile.r_part; r < 1.3*mobile.r_part; r += mobile.dr) { 
					V = Vr_mob(mobile.L,r)-1; 
					data1.push({date: r,close: V}); 
				}
				
				V = Vr_mob(mobile.L,mobile.r_part)-1; 
				data2.push({date: mobile.r_part,close: V}); 
			}

			mobile.point = graphique_creation_pot(0,data1,data2,compteur,mobile); //Trace le graphe du potentiel.

		},300);  
  	} 
	else { //Dans le cas où ce n'est pas le début de la simulation et où je ne suis pas en pause. 
		new Timer(() => animate(compteur,mobile,mobilefactor),compteur, 1, -1); //Créé un nouvel objet Timer qui répète la fonction animate toutes les 1s indéfiniment. 
		//animate calcule les coordonnées de la particule à chaque instant. 
	} 
    
	document.getElementById('start').style.display = "none"; //Une fois la simulation démarrée le bouton start/débuter disparaît.
	document.getElementById('pause/resume').style.display ="inline-block"; //Une fois la simulation démarrée le bouton pause/resume apparaît. 
  
}
	
//----------------------------------------------------{animate}----------------------------------------------------

/**
 * Fonction qui s'occupe de l'animation, tracé et calculs en cours, elle est appelé dans trajectoire() en utilisant un Timer. 
 * @param {*} compteur : Numero du mobile 
 * @param {*} mobile   : mobile en cours de calcul
 * @param {*} mobilefactor : liste des facteurs pour l'echelle
 */

function animate(compteur,mobile,mobilefactor) 
{
	element = document.getElementById('traject_type'); // on recupere le boutton de type de trajectoire
	var element2=document.getElementById('traject_type2');   //on recupere le boutton de observateur ou mobile
	var isrebond = document.getElementById("boutton_ammorti").value; // on recupere la valeur de la barre rebond	  								   

	mobilefactor[compteur] = factGlobalAvecClef //facteur pour l'echelle

	SurTelephone(); //on verifie si on est sur telephone ou ordinateur
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
			if (mobile.r_part_obs >rs*1.000001)//pas exactement rs pour eviter les problemes de calculs 
			{
				//-----------------------------------------------------PARTIE CALCULE-------------------------------------------------
				//calcul de l'equation differentielle avec RK4 ça donne le r et dr/dt
				val_obs = rungekutta_obs(mobile.E,mobile.L,mobile.dtau, mobile.r_part_obs, mobile.A_part_obs);
				mobile.r_part_obs = val_obs[0]; 		//valeur de r calculée par RK (Runge Kutta)
				mobile.A_part_obs = val_obs[1]; 		//valeur de dr/dtau calculée par RK

				/*Calcul des vitesses dans metrique externe de SCH qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
				Fonctions_utilitaires_trajectoire):*/
				resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part_obs,rs,false);  
				
				/*Les commentaires suivant ont ete ajoutés par M Cordoni parce qu'il y a parfois des problemes avec les calculs des 
				vitesse et du coup on prefere avoir plutot la vitesse avec RK4 parce qu'elle est plus correcte: */

				//vtotal=resultat[0]; //peut servir si jamais ya un probleme dans le calcul des vitesse
				//vr_1_obs=resultat[1]*Math.sign(mobile.A_part_obs);   // <------------JPC  Remarque quand E très proche de 1 calculs.MSC_Ex_vitess donne un résultat[1] faux 
				
				vp_1_obs=resultat[2]; //resulatas de v_phi avec le fichier de calcul de vitesses
				vr_1_obs=mobile.A_part_obs/(1-rs/(mobile.r_part_obs))  // calcul de v_r en utilisant le resultat de l'eqaution differentielle
				vtotal=Math.sqrt(vr_1_obs*vr_1_obs + vp_1_obs*vp_1_obs) ; //calcul du module de la vitesse 

				//Calcul de la variation de l'angle phi pour l'ajouter à la valeur antérieure
				varphi_obs = c * mobile.L * mobile.dtau *(1-rs/mobile.r_part_obs) / Math.pow(mobile.r_part_obs, 2)/mobile.E; 
				mobile.phi_obs=mobile.phi_obs+varphi_obs; //on met à jour le l'angle phi apres avoir calculé le var_phi

				mobile.temps_particule += mobile.dtau*(1-rs/mobile.r_part_obs)/(mobile.E); //calcul du temps propre de du mobile

				z_obs= Math.pow(1-((vr_1_obs*vr_1_obs + vp_1_obs*vp_1_obs)/(c*c)),(-1/2))*Math.pow(1-rs/mobile.r_part_obs,-(1/2))-1 ;//calcul du decalage spectrale
				if(isNaN(z_obs)){z_obs=1/0}
				/*Tres proche de rs les vitesses calculées sont NAN, surtout quand on aceelere, c'est pour cela on fait gaffe de ne pas les prendre*/
				if (mobile.r_part_obs > r_phy && !isNaN(vtotal))       {mobile.distance_parcourue_totale += vtotal*(mobile.dtau*(1-rs/mobile.r_part_obs)/(mobile.E));} //Calcul de la distance parcourue dans le referentiel du mobile 

				/* Calcul du gradient : */
				gm = derivee_seconde_Schwarzchild_massif_obs(mobile.E,mobile.L,mobile.r_part_obs);
				gmp = derivee_seconde_Schwarzchild_massif_obs(mobile.E,mobile.L,mobile.r_part_obs + 1);
				fm = Math.abs(gm - gmp); 

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
					vp_1_obs=0 ;
					vtotal=vr_1_obs=c; 
					z_obs=1/0;
					mobile.condition_trace=false; //on met cette condition à false pour le mobile pour l'arreter le tracé,calculs,et affichage à rs 
					mobile.distance_parcourue_totale += vtotal*(mobile.dtau*(1-rs/mobile.r_part_obs)/(mobile.E)); //Calcul de la derniere valeur de la distance parcourue 
				
				}
			}
	
			//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------
			
			/*Affichage de toutes les variables dans le tableau */
			document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3); //temps mobile
			document.getElementById("ga"+compteur.toString()).innerHTML = fm.toExponential(3); //gradient
			document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part_obs.toExponential(3); //rayon
			document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_1_obs.toExponential(3); //vitesse radiale (v_r)
			document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_1_obs.toExponential(3); //vitesse angulaire (v_phi)
			document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(3);	// vitesse totale (module)
			document.getElementById("decal"+compteur.toString()).innerHTML=z_obs.toExponential(3); //decalage spectral
			document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3); //Distance parcourue

			//-----------------------------------------------------PARTIE TRACÉ PARTICULE-------------------------------------------------
			//Dessin du tracé derriere la particule
			context.beginPath(); //on ouvre le context
			context.fillStyle = mobile.couleur; //on choisit la couleur pour remplir parce que c'est fill
			context.rect(mobile.position.posX2, mobile.position.posY2, 1, 1); //on dessine le tracé
			context.lineWidth = "1"; //en choisissant la bonne largeur des traits
			context.fill();		//on le met sur le canva
			
			majFondFixe44(mobile); // on efface l'ancienne position de la boule

			//On dessine la boule bleue avec les meme etapes
			mobile["context22"].beginPath();
			mobile["context22"].fillStyle = COULEUR_BLEU;
			mobile["context22"].arc(mobile.position.posX2, mobile.position.posY2 , 5, 0, Math.PI * 2);
			mobile["context22"].lineWidth = "1";
			mobile["context22"].fill();

			//-----------------------------------------------------PARTIE TRACÉ POTENTIEL-------------------------------------------------
			
			V = Vr_obs(mobile.E,mobile.L,mobile.r_part_obs)-1; //on stocke la valeur du (Poteniel-1) avec les valeurs actuelles
			data2 = []; //on vide la liste qu'on va à la fonction update_graphique_2()
			data2.push({date: mobile.r_part_obs, close: V }); //on mets les les valeurs  dans data2 
			if(mobile.point !== undefined){update_graphique_2(mobile.point,data2,mobile);} //puis on les dessine si le point est defini

			//-----------------------------------------------------GESTION REBOND-------------------------------------------------
			if (mobile.r_part_obs <= r_phy ) 
			{
				if (mobile.Rebond != 1 && isrebond == 1 && r_phy > 0) 
				{
					nbRebonds += 1; //on compte le nombre de rebond
					/*puis on calcule les varibles affectées par le rebond :*/
					a = mobile.Rebond; 
					e = Math.sqrt(1 - a); 

					varphi_choc=c * mobile.L * mobile.dtau*(1-rs/mobile.r_part_obs) / Math.pow(mobile.r_part_obs, 2)/mobile.E; 
					mobile.L = mobile.L * e;
					mobile.r_part_obs = r_phy; 

					A_part_obs_init=mobile.A_part_obs;
					mobile.A_part_obs=  -mobile.A_part_obs *e;

					if (Math.abs(A_part_obs_init)>300) 
					{
						//On dessine l'explosion comme un GIF si ya pas d'amortissement 
						setTimeout(function(){mobile["context22"].drawImage(expl1,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},200);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},390);
						setTimeout(function(){mobile["context22"].drawImage(expl2,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},400);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},590);
						setTimeout(function(){mobile["context22"].drawImage(expl3,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},600);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},790);
						setTimeout(function(){mobile["context22"].drawImage(expl4,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},800);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},990);
						setTimeout(function(){mobile["context22"].drawImage(expl5,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},1000);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},1190);
						setTimeout(function(){mobile["context22"].drawImage(expl6,mobile.position.posX2-50,mobile.position.posY2-50,100,100);},1200);
						setTimeout(function(){mobile["context22"].clearRect(mobile.position.posX2-50,mobile.position.posY2-50,100,100);},1390);
						Timer.instances[compteur].stop();//puis on stope la simulation 
						
						
					}        
		
					if (nbRebonds == 1) 
					{
						A_init_obs = A_part_obs_init; //on ré-initialise A_init à la valeur d'accélération au premier rebond
						varphi_init=c * mobile.L * mobile.dtau*(1-rs/r_phy) / Math.pow(r_phy,2)/mobile.E; //on calcule le varphi_init 
					}
					
					V2_init=A_init_obs*A_init_obs+(r_phy*varphi_init*r_phy*varphi_init);

					if (mobile.A_part_obs*mobile.A_part_obs+mobile.r_part_obs*varphi_obs*mobile.r_part_obs*varphi_obs <= V2_init*0.03) //si on rebondit avec 10% de l'accélération du premier rebond, le calcul s'arrête	
					{
						Timer.instances[compteur].stop();//on stope le Timer du mobile concerné 
						textesfinarret();
					}
				}

				else 
				{
					// condition qui gere l'arret à l'astre (R_physique)
					if (r_phy != 0)
					{
						Timer.instances[compteur].stop(); //on stope le Timer du mobile concerné 	
					}
				} 
			}	
			
		}

		/*Le temps observateur est calculé meme quand on rentre dans le trou noir ( r < rs ) */
		mobile.temps_observateur_distant += mobile.dtau //le calcul temps observateur est toujours calculé et affiché sauf si la simulation s'arrete
		document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3); //affichage
		
	}

	/*----------------------------------------------------------{{{{  CAS_SPATIONAUTE  }}}-----------------------------------------------------------*/
	else     
	//Tout ce qui est dans cette condition concerne le cas du referentiel du spationaute
	{   
		if (mobile.r_part >= 0) 
		{
			//-----------------------------------------------------PARTIE CALCULE-------------------------------------------------

			var temps_allumage_reacteur = Number(document.getElementById("temps_allumage").value); //Recuperer la valeur du temps d'allumage du boutton html
			/*Ce qui suit verifie si on a appuyé pour accelerer et adapte le pas de calcul pour RK:*/
			if (joy.GetPhi()!=0)
			{ 
				/*Calcul avec RK4 avec un dtau de temps d'allumages des reacteurs dans le cas d'une acceleration de la part du spationaute */
				val = rungekutta(mobile.L, temps_allumage_reacteur, mobile.r_part, mobile.A_part); 
			} 
			else           
			{ 
				//calcul avec RK4 avec le dtau par defaut
				val = rungekutta(mobile.L,mobile.dtau, mobile.r_part, mobile.A_part); 
			} 

			mobile.r_part = val[0]; //valeur de r calculée par RK
			mobile.A_part = val[1]; //valeur de dr/dtau calculée par RK
			
			resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part,rs,false); //Calcul des vitesses comme dans le cas de l'observateur mais avec le r dans le referentiel du mobile 
	
			/*MEME REMARQUE QUE LE CAS DE L'OBSERVATEUR POUR CE QUI SUIT */
			//vtotal=resultat[0];
			//vr_1=resultat[1]*Math.sign(mobile.A_part);   // <------------JPC  Remarque quand E très proche de 1 calculs.MSC_Ex_vitess donne un résultat[1] faux 
			
			vp_1=resultat[2]; //calcul de v_phi avec le fichier de calcul de vitesses
			vr_1=mobile.A_part/(1-rs/(mobile.r_part));  //calcul de v_r avec le resultat de RK
			vtotal=Math.sqrt(vr_1*vr_1 + vp_1*vp_1) ;	//calcul de v_tot (module de la vitesse)

			varphi = c * mobile.L * mobile.dtau / Math.pow(mobile.r_part, 2); //calcul de la variation de l'angle 
			mobile.phi = mobile.phi + varphi; //calcul de la nouvelle valeur de l'angle

			
			mobile.temps_particule+=mobile.dtau  //calcul du temps propre de la particule
			mobile.temps_observateur_distant += mobile.dtau*mobile.E/(1-rs/mobile.r_part);//calcul du temps observateur

			/*Calcul du gradient*/
			gm = derivee_seconde_Schwarzchild_massif(mobile.L,mobile.r_part);
			gmp = derivee_seconde_Schwarzchild_massif(mobile.L,mobile.r_part + 1);
			fm = Math.abs(gm - gmp);

			/*Calcul de la postion [X,Y] (noramilisées) pour dessiner dans le canva (tracé) */
			mobile.positionspatio.posX1 = mobilefactor[compteur] * mobile.r_part * (Math.cos(mobile.phi) / rmax) + (canvas.width / 2.);  
			mobile.positionspatio.posY1 = mobilefactor[compteur] * mobile.r_part * (Math.sin(mobile.phi) / rmax) + (canvas.height / 2.);
			/*Calcul de la distance parcourue*/
			mobile.distance_parcourue_totale+=vtotal*mobile.dtau; 

			if(joy.GetPhi()!=0)
			{ 
				nombre_de_g_calcul = (Math.abs(vtotal-vitesse_precedente_nombre_g)/temps_allumage_reacteur)/9.80665 
				
				nombre_de_g_calcul_memo = nombre_de_g_calcul;
			}

			else
			{
				nombre_de_g_calcul_memo = 0;	
			}

			//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------

			//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> AVANT RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			
			if(mobile.r_part>rs*1.000001)//pas exactement rs pour eviter les problemes de calculs 
			{
				
				document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3); //temps mobile
				document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3); //temps observateur
				document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part.toExponential(20);//rayon
				document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_1.toExponential(3); //vitesse angulaire (v_phi)
				document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_1.toExponential(3); //vitesse radiale (v_r)
				document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(3); //vitesse totale
				document.getElementById("ga"+compteur.toString()).innerHTML = fm.toExponential(3);//gradient
				document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3); //distance parcourue
				document.getElementById("g_ressenti"+compteur.toString()).innerHTML = nombre_de_g_calcul_memo.toExponential(3); //nombre de g ressenti par le pilote
				document.getElementById("dernier_g_res"+compteur.toString()).innerHTML = nombre_de_g_calcul.toExponential(3);//dernier nombre de g affiché
			}
		    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> APRES RS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			else
			{
				document.getElementById("r_par"+compteur.toString()).innerHTML =mobile.r_part.toExponential(3); 
				document.getElementById("to"+compteur.toString()).innerHTML = 1/0; //temps observateur
				document.getElementById("ga"+compteur.toString()).innerHTML =1/0;
				document.getElementById("v_tot"+compteur.toString()).innerHTML ="";
				document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = "";
				document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = "";
				document.getElementById("g_ressenti"+compteur.toString()).innerHTML = ""; 		 
				document.getElementById("distance_parcourue"+compteur.toString()).innerHTML= texte.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("g_ressenti"+compteur.toString()).innerHTML = nombre_de_g_calcul_memo.toExponential(3); 
			}

			//-----------------------------------------------------PARTIE TRACÉ-------------------------------------------------
			//on dessine le trait derriere le mobile
			context.beginPath();
			context.fillStyle = mobile.couleur;
			/*On dessine avec ce qu'on a calculé que si r n'est pas negatif (audela de rs ça donne n'importe quoi) */
			if(mobile.r_part>1){context.rect(mobile.positionspatio.posX1, mobile.positionspatio.posY1, 1, 1);}
			else{context.rect((canvas.width / 2.0), (canvas.height / 2.0), 1, 1);}
			context.lineWidth = "1";
			context.fill();

			majFondFixe44(mobile); // on efface l'ancienne position de la boule
			//on dessine le mobile au bout du trait
			mobile["context22"].beginPath();
			mobile["context22"].fillStyle = COULEUR_BLEU;
			/*On dessine avec ce qu'on a calculé que si r n'est pas negatif (audela de rs ça donne n'importe quoi) */
			if(mobile.r_part>1){mobile["context22"].arc(mobile.positionspatio.posX1, mobile.positionspatio.posY1 , 5, 0, Math.PI * 2);}
			else{mobile["context22"].arc((canvas.width / 2.0), (canvas.height / 2.0) , 5, 0, Math.PI * 2);}

			mobile["context22"].lineWidth = "1";
			mobile["context22"].fill();

			//-----------------------------------------------------PARTIE TRACÉ POTENTIEL -------------------------------------------------
			V = Vr_mob(mobile.L,mobile.r_part)-1;//on stocke la valeur du (Poteniel-1) avec les valeurs actuelles
			data2 = [];  //on vide la liste qu'on va à la fonction update_graphique_2()
			data2.push({date: mobile.r_part, close: V }); //on mets les les valeurs  dans data2 
			if(mobile.point !== undefined) {update_graphique_2(mobile.point,data2,mobile);}//puis on les dessine si le point est defini
			
		}

		else
		{
			mobile.r_part=0; // on met quand on s'approche du milieu
			//on affiche les derniéres valeurs avant l'arret de la simulation
			document.getElementById("r_par"+compteur.toString()).innerHTML =mobile.r_part.toExponential(3); 
			//on stop la simulation quand on arrive à r=0
			Timer.instances[compteur].stop();
			
		}
		
		//-----------------------------------------------------GESTION REBOND-------------------------------------------------

		if (mobile.r_part <= r_phy || mobile.r_part==0) 
		{
			if (mobile.Rebond != 1 && isrebond == 1 && r_phy > 0) 
			{
				nbRebonds += 1;//on compte le nombre de rebond
				/*puis on calcule les varibles affectées par le rebond :*/
				a = mobile.Rebond; 
				e = Math.sqrt(1 - a);        
				varphi_choc = c * mobile.L * mobile.dtau / Math.pow(mobile.r_part, 2);
				mobile.L = mobile.L * e;
				mobile.r_part = r_phy;
				A_part_init=mobile.A_part;
				mobile.A_part = -mobile.A_part * e;   

				if (Math.abs(A_part_init)>300) 
				{
					//On dessine l'explosion comme un GIF si ya pas d'amortissement 
					setTimeout(function(){mobile["context22"].drawImage(expl1,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},200);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},390);
					setTimeout(function(){mobile["context22"].drawImage(expl2,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},400);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},590);
					setTimeout(function(){mobile["context22"].drawImage(expl3,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},600);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},790);
					setTimeout(function(){mobile["context22"].drawImage(expl4,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},800);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},990);
					setTimeout(function(){mobile["context22"].drawImage(expl5,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},1000);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},1190);
					setTimeout(function(){mobile["context22"].drawImage(expl6,mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},1200);
					setTimeout(function(){mobile["context22"].clearRect(mobile.positionspatio.posX1-50,mobile.positionspatio.posY1-50,100,100);},1390);          
					Timer.instances[compteur].stop();	//puis on stope la simulation 
				} 

				if (nbRebonds == 1) 
				{
					A_init = A_part_init; //on ré-initialise A_init à la valeur d'accélération au premier rebond
					varphi_init=c * mobile.L * mobile.dtau /Math.pow(r_phy,2);
				}
		
				V2_init=A_init*A_init+(r_phy*varphi_init*r_phy*varphi_init);

				if (mobile.A_part*mobile.A_part+mobile.r_part*varphi*mobile.r_part*varphi <= V2_init*0.03) //si on rebondit avec 10% de l'accélération du premier rebond, le calcul s'arrête	
				{
					Timer.instances[compteur].stop();//on stope le timer concerné
					textesfinarret();
				}		
			}

			else 
			{
				// condition qui gere l'arret à l'astre (R_physique)
				if (r_phy != 0)
				{
					Timer.instances[compteur].stop(); //on stope le Timer du mobile concerné 	
				}
			}

		}
			
		//-----------------------------------------------------AFFICHAGE DES DIODES------------------------------------------------

		/* Diode pour le gradient 
			gradient < 1 ------- vert
			1< gradient < 7 ------- jaune
			gradient > 7 -------  rouge
		*/

		if (Number(fm) <= 1) 
		{
			document.getElementById('DivClignotante'+compteur.toString()).innerHTML = " <img src='./Images/diodever.gif' height='14px' />";
			document.getElementById('DivClignotante'+compteur.toString()).style.color = "green";
		} 
		else if (1 < Number(fm) && Number(fm) < 7) 
		{
			document.getElementById('DivClignotante'+compteur.toString()).innerHTML = " <img src='./Images/diodejaune.gif' height='14px' />";
			document.getElementById('DivClignotante'+compteur.toString()).style.color = "yellow";
		} 
		else if (Number(fm) >= 7)
		{
			document.getElementById('DivClignotante'+compteur.toString()).innerHTML = " <img src='./Images/dioderouge.gif' height='14px' />";
			document.getElementById('DivClignotante'+compteur.toString()).style.color = "red";
		} 
		
		/* Diode pour le decalage spectrale
			decalage < 0.3 ------- vert
			0.3< decalage < 0.5 ------- jaune
			decalage > 0.5 -------  rouge
		*/
		if (Number(deltam_sur_m) <= 0.3) 
		{
			document.getElementById('DivClignotantePilot'+compteur.toString()).innerHTML = " <img src='./Images/diodever.gif' height='14px' />";
			document.getElementById('DivClignotantePilot'+compteur.toString()).style.color = "green";
		} 
		else if (0.3 < Number(deltam_sur_m) && Number(deltam_sur_m) < 0.5) 
		{
			document.getElementById('DivClignotantePilot'+compteur.toString()).innerHTML = " <img src='./Images/diodejaune.gif' height='14px' />";
			document.getElementById('DivClignotantePilot'+compteur.toString()).style.color = "yellow";
		} 
		else if (Number(deltam_sur_m) >= 0.5) 
		{
			document.getElementById('DivClignotantePilot'+compteur.toString()).innerHTML = " <img src='./Images/dioderouge.gif' height='14px' />";
			document.getElementById('DivClignotantePilot'+compteur.toString()).style.color = "red";
		} 
	
		/* Diode pour le nombre de g ressenti
			g_ressenti < 4 ------- vert
			4 < g_ressenti < 9------- jaune
			g_ressenti > 9 -------  rouge
		*/ 
		if (nombre_de_g_calcul_memo <= 4) 
		{
			document.getElementById('DivClignotanteNbG'+compteur.toString()).innerHTML = " <img src='./Images/diodever.gif' height='14px' />";
			document.getElementById('DivClignotanteNbG'+compteur.toString()).style.color = "green";
		} 
		else if (4 < nombre_de_g_calcul_memo && nombre_de_g_calcul_memo <= 9) 
		{
			document.getElementById('DivClignotanteNbG'+compteur.toString()).innerHTML = " <img src='./Images/diodejaune.gif' height='14px' />";
			document.getElementById('DivClignotanteNbG'+compteur.toString()).style.color = "yellow";
		} 
		else if (nombre_de_g_calcul_memo > 9) 
		{
			document.getElementById('DivClignotanteNbG'+compteur.toString()).innerHTML = " <img src='./Images/dioderouge.gif' height='14px' />";
			document.getElementById('DivClignotanteNbG'+compteur.toString()).style.color = "red";
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

//----------------------------------------------------{Vr_mob}----------------------------------------------------

// Expression du potentiel divisé par c^2
function Vr_mob(L,r) {
	return potentiel_Schwarzchild_massif(L,r);
}

//----------------------------------------------------{Vr_obs}----------------------------------------------------

function Vr_obs(E,L,r) {
	return Math.pow(E,2)-( 1-potentiel_Schwarzchild_massif(L, r)/Math.pow(E,2) )*Math.pow(1-rs/r,2)  ;
}

//----------------------------------------------------{potentiel_Schwarzschild_massif}----------------------------------------------------

function potentiel_Schwarzchild_massif(L, r) {
	return (1 - rs / r) * (1 + Math.pow(L / r, 2));
}

//----------------------------------------------------{derivee_seconde_Schwarzschild_massif}----------------------------------------------------

function derivee_seconde_Schwarzchild_massif(L, r) {
		return Math.pow(c, 2)/(2*Math.pow(r, 4)) *  (-rs*Math.pow(r,2) + Math.pow(L, 2)*(2*r-3*rs));
}

//----------------------------------------------------{rungekutta}----------------------------------------------------

function rungekutta(L, h, r, A) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_Schwarzchild_massif(L,r);
	k[1] = derivee_seconde_Schwarzchild_massif(L,r + 0.5 * h * A);
	k[2] = derivee_seconde_Schwarzchild_massif(L,r + 0.5 * h * A + 0.25 * h * h * k[0]);
	k[3] = derivee_seconde_Schwarzchild_massif(L,r + h * A + 0.5 * h * h * k[1]);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
}

//----------------------------------------------------{derivee_seconde_Schwarzschild_massif_obs}----------------------------------------------------

function derivee_seconde_Schwarzchild_massif_obs(E,L,r) {
	return c*c*(r-rs)*(2*E*E*r*r*r*rs + 2*L*L*r*r - 7*L*L*r*rs 
	+ 5*L*L*rs*rs - 3*r*r*r*rs + 3*r*r*rs*rs)/(2*Math.pow(r,6)*E*E);
}

//----------------------------------------------------{rungekutta_obs}----------------------------------------------------

function rungekutta_obs(E,L,h, r, A) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_Schwarzchild_massif_obs(E,L,r);
	k[1] = derivee_seconde_Schwarzchild_massif_obs(E,L,r + 0.5 * h * A);
	k[2] = derivee_seconde_Schwarzchild_massif_obs(E,L,r + 0.5 * h * A + 0.25 * h * h * k[0]);
	k[3] = derivee_seconde_Schwarzchild_massif_obs(E,L,r + h * A + 0.5 * h * h * k[1]);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
}

//----------------------------------------------------{calcul_rmax}----------------------------------------------------

function calcul_rmax(L,E,vr,r0,rmax1ou2){
	
	r1 = (L * (L - Math.sqrt(Math.pow(L, 2) - 12 * Math.pow(m, 2))) / (2 * m));
	r2 = (L * (L + Math.sqrt(Math.pow(L, 2) - 16 * Math.pow(m, 2))) / (4 * m));
	ra = 2 * m * Math.pow(L, 2);
	rb = ((2 * m / r0) - 1) * Math.pow(L, 2);
	X0 = 1 / r0;
	rc = 2 * m - Math.pow(L, 2) * X0 + 2 * m * Math.pow(L * X0, 2);
	DELTA = Math.pow(rb, 2) - 4 * ra * rc;
	r3 = (-rb - Math.sqrt(DELTA)) / (2*ra);
	// la particule tombe au centre
	if (L < 2 * Math.sqrt(3) * m) {
		rmax = r0;
	}
	else if ( (L <= 4*m) && (L > 2*Math.sqrt(3)*m) ) {
	// dans ce cas, r varie entre 2 valeurs r0 et r3
		if ( (Vr_mob(L,r0) <= Vr_mob(L,r1)) && (r0 > r1) ) {
			if (r3 > r0) {
				rmax = r3;
			}
			else if (r3 < r0) {
				rmax = r0;
			}
		}
	// comprend les cas r0<=r1 et V(r0)>V(r1) où la particule tombe au centre
		else {
			rmax = r0;
		}
	}
	// dans ce cas r varie entre les 2 valeurs r0 et r3
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
	return rmax;
}

//----------------------------------------------------{pausee}----------------------------------------------------

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
		//clearInterval(mobile.myInterval);
	} 
    else {
		    Timer.paused = false;
			mobile.pause = false;
            document.getElementById("pause/resume").innerHTML = texte.pages_trajectoire.bouton_pause;
			document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours;
			document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
			document.getElementById("pau").src = "Images/pause.png";
			
		}
	}

//----------------------------------------------------{rafraichir2}----------------------------------------------------

function rafraichir2(context,mobilefactor,rmaxjson,r0ou2,compteur) {
	majFondFixe();
	creation_blocs(context,mobilefactor,rmaxjson,r0ou2,compteur);
}

//----------------------------------------------------{rafraichir}----------------------------------------------------

//ici  le rafraichir appeler avec reset element2 n'est pas defini donc il y a une erreur
function rafraichir() {
	window.location.reload();
	element2.value="observateur";
}

// -------------------------------------{enregistrer}--------------------------------------------

function enregistrer() {
	var texte = o_recupereJson();

	if (document.getElementById('trace_present').value === "true") {
		// Demander à l'utilisateur le nom du fichier
		var nomFichier = prompt(texte.pages_trajectoire.message_nomFichier, "traject_Schaw_B_B");

		if (nomFichier !== null && nomFichier.trim() !== '') {
			canvas3 = document.getElementById("myCanvas3three");
			context3 = canvas3.getContext("2d");

			//Contenu déjà existant :
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

			//Enregistrer le canvas avec le contenu et le logo
			document.getElementById("enregistrer2").click();
			canvasToImage(canvas3, {
				name: nomFichier.trim(),
				type: 'png'
			});
			majFondFixe3();
		};
		} else {
			alert(texte.pages_trajectoire.alerte_nomFichier);
		}
	} else {
		alert(texte.pages_trajectoire.message_enregistrer);
	}
}

//----------------------------------------------------{commandes}----------------------------------------------------

function commandes(){
	var texte = o_recupereJson();
	alert(texte.page_trajectoire_massive.commandes);
}

//----------------------------------------------------{majFondFixe}----------------------------------------------------

function majFondFixe(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Ajout d'un fond blanc pour l'exportation
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = "15pt bold";
	context.fillStyle = "black";
	context.fillText(texte.page_trajectoire_massive.titre2,5,40);
	context.font = "13pt bold";
	context.fillText(texte.pages_trajectoire.entrees,5,70);
	context.font = "11pt normal";
	context.fillText("M = "+M.toExponential(3)+" kg",5,90);
	context.fillText("r\u209A\u2095\u1D67 = "+r_phy.toExponential(3)+" m",5,110);
	if (document.getElementById("boutton_ammorti").value == 1){context.fillText(texte.page_trajectoire_massive.amortissement+" = " +mobile.Rebond,5,130)};
	if(document.getElementById('traject_type2').value=="observateur"){
		context.fillText(texte.pages_trajectoire.observateur,5,150);
	} 
	else { context.fillText(texte.pages_trajectoire.mobile,5,150); }
		context.fillText("mobile1:",5,170);
		context.fillText("r\u2080 = "+(r0o2[1]).toExponential(3)+" m",5,190);
		context.fillText("V\u2080 = "+vphiblab.toExponential(3)+" m.s\u207B\u00B9",5,210);
		context.fillText("\u03C6\u2080 = "+vrblab.toExponential(3)+" °",5,230);
		nombeuhreudefusees = Number(document.getElementById("nombre_de_fusees_input").value);
	if (nombeuhreudefusees>=2) {
		context.fillText("mobile2:",5,250);
		context.fillText("r\u2080 = "+r0o2[2].toExponential(3)+" m",5,270);
		context.fillText("V\u2080 = "+vphi2i.toExponential(3)+" m.s\u207B\u00B9",5,290);
		context.fillText("\u03C6\u2080= "+vr2i.toExponential(3)+"°",5,310);
	}
}

//----------------------------------------------------{majFondFixe44}----------------------------------------------------

function majFondFixe44(mobile){
	mobile["context22"].clearRect(0, 0, canvas.width, canvas.height);
	//console.log(canvas.width, canvas.height);
}

//----------------------------------------------------{majFondFixe22}----------------------------------------------------

function majFondFixe22(){
	context22.clearRect(0, 0, canvas.width, canvas.height);
	//console.log(canvas.width, canvas.height);
}

//----------------------------------------------------{majFondFixe3}----------------------------------------------------

function majFondFixe3(){
	context3.clearRect(0, 0, canvas.width, canvas.height);
	//console.log(canvas.width, canvas.height);
}

//----------------------------------------------------{test_inte}----------------------------------------------------

// Fonction de verification par rapport à R_phy r0 et rs avant lancement 
function test_inte() {
	
	/*variables pours verifier 3 conditions differentes:*/
	var onebol=false;
	var twobol=false;
	var threebol=false;
	var nombre_de_fusees = Number(document.getElementById("nombre_de_fusees_input").value);

	/*On boucle sur tout les fusees pour voir si tout est bon:*/
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
	}

	var texte = o_recupereJson();//recuperer le texte du json
	
	/*Si la condition r>r_phy>rs n'est pas verifié on renvoie un message d'erreur adapté à la situation*/
	if (r_phy < 0 || onebol) {
		return texte.pages_trajectoire.rayon_neg;
	} 
	else if (r_phy <= rs && r_phy!=0)   {
		return texte.pages_trajectoire.rayonPhyInfHorz;
	} 
	else if (twobol) {
		return texte.pages_trajectoire.rayonHorzInfRayonSchw;
	} 
	else if(threebol){
		return texte.pages_trajectoire.lancerInterdit;
	}
	//sinon on revoit un true pour lancer la simulation
	else
	{
		return true;
	}
}

//----------------------------------------------------{creation_blocs}----------------------------------------------------

// crée les différentes couches visuelles
function creation_blocs(context,mobilefactor,rmaxjson,r0ou2,compteur){
	r2bis=(80*r0ou2)/(factGlobalAvecClef);
	r1bis=Math.round((80*r0ou2)/(factGlobalAvecClef*10**testnum(r2bis)));
	ech=r1bis*10**testnum(r2bis);
	//console.log(r1bis,r2bis);
	context.lineWidth = "1";
	context.fillStyle = COULEUR_NOIR;
	if ((mobilefactor[cle] * m / rmaxjson[cle]) < 3) {
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
		context.arc(posX3, posY3, ((mobilefactor[cle] * 2 * m / rmaxjson[cle])), 0, Math.PI * 2);
		context.stroke();
  	}
	if (m < r_phy) {
		context.beginPath();
		context.fillStyle = COULEUR_RPHY;
		context.setLineDash([]);
		context.arc(posX3, posY3, (mobilefactor[cle] * r_phy / rmaxjson[cle]), 0, Math.PI * 2);
		context.fill();
		context.beginPath();
		context.strokeStyle = COULEUR_RS;
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, ((mobilefactor[cle] * 2 * m / rmaxjson[cle])), 0, Math.PI * 2); 
		context.stroke();
	}
	context.fillStyle = 'white';

// Ajout d'un fond blanc pour l'exportation
	context.font = "15pt bold";
	context.fillStyle = "black";
	context.fillText(texte.page_trajectoire_massive.titre2,5,40);
	context.font = "13pt bold";
	context.fillText(texte.pages_trajectoire.entrees,5,70);
	context.font = "11pt normal";
	context.fillStyle = COULEUR_RS;
	context.fillText(ech.toExponential(1)+" m",605,90);
	context.stroke();
	context.beginPath(); // Début du chemin
	context.strokeStyle = COULEUR_RS;
	//context.moveTo(canvas.width / 2.0,canvas.height / 2.0);    // Tracé test1
	//context.lineTo((canvas.width / 2.0)+280,canvas.height / 2.0);  // Tracé test2
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

//----------------------------------------------------{canvasAvantLancement}----------------------------------------------------

function canvasAvantLancement(){
	nbrFusee = document.getElementById("nombre_de_fusees_input").value
	//for (countt = 1; countt <= nbrFusee; countt += 1) {
	//	console.log(r0o2[countt])
	//}
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

	//facteurDeMalheur = [] // Je suis désespéré
	
	for (key = 1; key <= nbrFusee; key += 1) {
		facteurDeMalheur[key] = Number(document.getElementById("scalefactor").value);  	
	
	}
	for (key = 1; key <= nbrFusee; key += 1) {
		if(key!=cle){
			facteurDeMalheur[key] = Number(document.getElementById("scalefactor").value)/(r0o2[cle]/r0o2[key]);
		}
	}
	factGlobalAvecClef = facteurDeMalheur[cle];
	fact_defaut=facteurDeMalheur[cle];

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

function foncPourZoomMoinsAvantLancement(){
	
    factGlobalAvecClef = factGlobalAvecClef/1.2;
	ns_avant_lancement-=1;
    nzoom-=1;
    document.getElementById('nzoomtxt').innerHTML= "nz="+ nzoom.toString();
    canvasAvantLancement();
}

function foncPourZoomPlusAvantLancement(){
	
		factGlobalAvecClef = factGlobalAvecClef*1.2;
		ns_avant_lancement+=1;
		nzoom+=1;
		document.getElementById('nzoomtxt').innerHTML= "nz="+ nzoom.toString();
		canvasAvantLancement();
	
}

function recuperation(){
	if(document.getElementById('trace_present').value!="true"){
		load_schwarshild_massif();
		var lenbdefusees = Number(document.getElementById("nombre_de_fusees_input").value);
		initialisationGenerale(lenbdefusees);
	}
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
function choixTrajectoire(compteur,context,mobilefactor,rmaxjson,r0ou2) {
    if (element.value == 'simple') {
		majFondFixe();
        creation_blocs(context,mobilefactor,rmaxjson,r0ou2,compteur);
		diametre_particule = DIAMETRE_PART*2;
	}else if (element.value=='complete'){
        diametre_particule = DIAMETRE_PART;
    }
}