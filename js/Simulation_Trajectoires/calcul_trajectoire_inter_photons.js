// variables globales
var z=0;
var z_obs=0;
var title = "V(r)/c² - 1";
var clicks = 0;
const DIAMETRE_PART = 1;
var c = 299792458;
var nzoom=0;
var ns_avant_lancement=0;
var facteurDeMalheur;
var fact_defaut;
var G = 6.6742 * Math.pow(10, -11);

// liste de couleurs en hexa
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


ifUneFois=true // booleen qui permet plus bas d'utiliser la condition if une seule fois durant la simulation
ifUneFois2=true
ifUneFois3=true

var factGlobalAvecClef = 280 //pour l'échelle avant lancement
var compteurVitesseAvantLancement = 0
//variable globale, key value
var rmaxjson = {};
var mobilefactor = {};
var r0o2 ={};

var maximum;
var cle;
var fuseecompteur;
var listejsonfusees={};


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


function initialisationGenerale(fuseecompteur){
    G = 6.67385 * Math.pow(10, -11);
    M = Number(document.getElementById("M").value);
    r_phy = Number(document.getElementById("r_phy").value);
    m = G * M / Math.pow(c, 2); 
    rs=2*m;

	for (compteur = 1; compteur <= fuseecompteur; compteur += 1) {
	    listejsonfusees[compteur]=initialisation(compteur);  
	}

}

function lancerDeFusees(fuseecompteur){
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

function genereHtml(){
	var nbredefuseesgenere = Number(document.getElementById("nombredefusees").value);
	lenbdefusees = nbredefuseesgenere;
	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		var span = document.createElement("span");
		span.setAttribute("id","rayon"+countt.toString()+"");

		var divchampsr = document.getElementById('champs_a_remplir');

		divchampsr.appendChild(span);
		if(countt==1){
		var newlabel = document.createElement("Label");
		//newlabel.setAttribute("title","Distance initiale du projectile au centre de l'astre");
		newlabel.setAttribute("id","ctreastre");
		newlabel.setAttribute("title","");										 
		newlabel.setAttribute("for","r01");
		newlabel.innerHTML = " r<sub>0</sub> (m) =";
		span.appendChild(newlabel);}

		var newinput = document.createElement("Input");
		newinput.setAttribute("id","r0"+countt.toString()+"");
		newinput.setAttribute("value","5e3");
		newinput.setAttribute("align","left");

		newinput.setAttribute("maxlength","20");

		newinput.setAttribute("type","text");

		newinput.setAttribute("size","10");

		newinput.setAttribute("onChange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");

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
			newlabel.innerHTML = " "+htmlDecode(" &phi;")+"<sub>0</sub>° =";
			span.appendChild(newlabel);
		}
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","phi0"+countt.toString()+"");
		newinput.setAttribute("value","0");

		newinput.setAttribute("maxlength","10");

		newinput.setAttribute("type","text");

		newinput.setAttribute("size","10");

		newinput.setAttribute("onChange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");

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
			newlabel.setAttribute("for","teta");
			newlabel.innerHTML = " "+htmlDecode("&#632;")+"<sub>0</sub>° =";      //  &#632; c'est phi majuscule
			span.appendChild(newlabel);
		}
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","teta"+countt.toString()+"");
		newinput.setAttribute("value","120");
		newinput.setAttribute("maxlength","10");
		newinput.setAttribute("type","text");
		newinput.setAttribute("size","10");
		newinput.setAttribute("onChange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
		span.appendChild(newinput);
	}
		var newRow=document.getElementById('tableauconstanteslers').insertRow();
        var jstring = '<tr id="tgggg1" >'
        for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
            jstring += '<th class="tg-aicv">$L'+countt.toString()+'(m)$</th>';
		}

        for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
            jstring += '<th class="tg-aicv">$E'+countt.toString()+'$</th>';
        }

		for (countt=1; countt <= nbredefuseesgenere; countt +=1) {
			jstring += '<th class="tg-aicv" style="display: none;" id="rayon_orb_circ_ext_photon_nonBar'+countt.toString()+'" title="">$rcirc ext'+countt.toString()+'$</th>'; //Manon
		}

		for (countt=1; countt <= nbredefuseesgenere; countt +=1) {
			jstring += '<th class="tg-aicv" style="display: none;" id="rayon_orb_circ_int_photon_nonBar'+countt.toString()+'" title="">$rcirc int'+countt.toString()+'$</th>'; //Manon
		}

    //pour katex il faux mettre un antislash devant le antislash 
        jstring +='<th class="tg-6l4m" id="rayonschwars"  title="" >$rs=\\frac{2GM}{c^{2}}(m)$</th>';
		jstring +='<th class="tg-6l4m" style="display: none;"  id="gravtxt" title="">$grav=\\frac{GM}{R^{2}}\\frac{1}{9.81}(g)$</th>';
		jstring +='<th class="tg-6l4m" style="display: none;" id="vitesseLibéra" title="">$Vlib=c(\\frac{rs}{R})^{1/2}(m.s^{-1}) $</th>';
        //jstring +='<th class="tg-6l4m" id="TempTrouNoirtxt" title="">$T=6.15*10^{-8}\\frac{M\\odot}{M}(K)$</th>';
        //jstring +='<th class="tg-6l4m" id="tempsEvaporationTrouNoirtxt" title="">$t=6.6*10^{74}(\\frac{M}{M\\odot})^{3}(s)$</th>';
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

		for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
            jstring += '<td class="tg-3ozo" style="display: none;" id="r_circ_ext_res'+countt.toString()+'">0</td>'; //Manon
		}

		for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
            jstring += '<td class="tg-3ozo" style="display: none;" id="r_circ_int_res'+countt.toString()+'">0</td>'; //Manon
		}

        jstring +='<td class="tg-3ozo" id="m">0</td>';
		jstring +='<td class="tg-3ozo" style="display: none;" id="g">0</td>';	
		jstring +='<td class="tg-3ozo" style="display: none;" id="Vlib">0</td>';	
		//jstring +='<td class="tg-3ozo" id="TempTN">0</td>';
		//jstring +='<td class="tg-3ozo" id="tempsEvapTN">0</td>';											
        jstring +='</tr>';

        newRow2.innerHTML = jstring;

	for (countt = 1; countt <= nbredefuseesgenere; countt += 1) {
		var newRow=document.getElementById('tableauresultatsimu').insertRow();
		// il faudrait songer a la sécurité ici, 'never trust user input', serait il possible pour un utilisateur de prendre le controle avec ses user input?
		//<th id="acceleration`+countt.toString()+`" title="Différence des dérivées seconde de r" class="tg-6l4m"></th>
		//<td class="tg-3ozo" id="ga`+countt.toString()+`"></td>
		newRow.innerHTML = `<tr id="tg2gga`+countt.toString()+`">
					<th class="tg-aicv">r(m)</th>
					<th id="temps_ecoule`+countt.toString()+`" class="tg-aicv"></th>
					<!--<th id="acceleration`+countt.toString()+`" title="Différence des dérivées seconde de r" class="tg-6l4m"></th>-->
					<th id="vitesseur`+countt.toString()+`" title="" class="tg-aicv"  >V<SUB>r</SUB>(m.s<sup>-1</sup>) </th>
					<th id="vitesseuphi`+countt.toString()+`" title="" class="tg-aicv"  >V<SUB>&phi;</SUB>(m.s<sup>-1</sup>)</th>
					<th id="temps_obs`+countt.toString()+`" class="tg-aicv"></th>
					<th id="v_total`+countt.toString()+`" title="" class="tg-aicv">  V<SUB>physique</SUB> (m.s<sup>-1</sup>)</th>
					<th id="distance_metrique`+countt.toString()+`" title="" class="tg-aicv" style="display: none;"></th>`; //ManonGeneralisation

		var newRow2=document.getElementById('tableauresultatsimu').insertRow();

		newRow2.innerHTML =       `<tr id="tg2ggb`+countt.toString()+`">
					<td class="tg-3ozo" id="r_par`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="tp`+countt.toString()+`">res</td>
					<!--<td class="tg-3ozo" id="ga`+countt.toString()+`"></td>-->
					<td class="tg-3ozo" id="vr_sc_mas`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="vp_sc_mas`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="to`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="v_tot`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="distance_parcourue`+countt.toString()+`" style="display: none;">res</td>`; //ManonGeneralisation

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

	texteTrajectoirePhotonNonBar(nbredefuseesgenere);
	notationvitesseree1();
	infobulleobservateurdistant();
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

	var texte = o_recupereJson(); //Cela me permettra de récupérer le texte pour les infobulles. 

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

	E=1; //La constante d'intégration sans dimension E.

	if(r0 > r_phy) {//Dans le cas de la métrique extérieure :
		dphi_sur_dlambda=Math.sin(teta)*c/(Math.sqrt(1-rs/r0)*r0); //Je calcule dphi/dlambda.
		vr=Math.cos(teta)*c; //Je calcule dr/dlambda. 
	} 
	else{ //Dans le cas de la métrique intérieure : 
		dphi_sur_dlambda=Math.sin(teta)*c/(beta(r0)*r0); //Je calcule dphi/dlambda.
		vr=Math.cos(teta)*Math.sqrt(alpha(r0))*c/beta(r0); //Je calcule dr/dlambda. 
	}

	L = (dphi_sur_dlambda*(r0**2))/c; //Je calcule L la constante d'intégration.

	//Limites vis à vis de r_phy pour qu'on ai une orbite circulaire à l'intérieure : 
	limite_haute = (3/2)*rs; 
	limite_basse = (9/8)*rs;  

	//Je récupère les cases associées à la distance r pour qu'on ai une orbite circulaire à l'intérieure de l'astre : 
	rCircIntResCell = document.getElementById("r_circ_int_res"+compteur.toString());
	rCircIntLabelCell = document.getElementById("rayon_orb_circ_int_photon_nonBar"+compteur.toString());

	if (r_phy > limite_basse && r_phy < limite_haute){ //Dans ce cas on peut avoir une orbite circulaire. 
		//Je calcule cette distance à l'astre pour avoir l'orbite circulaire et je l'affiche dans une case visible : 
		r_circ_int = (1/3)*r_phy*((Math.sqrt(r_phy*(8*r_phy - 9*rs)))/(Math.sqrt(rs*(r_phy-rs))));
		document.getElementById("r_circ_int_res"+compteur.toString()).innerHTML = r_circ_int.toExponential(10);
		document.getElementById("r_circ_int_res"+compteur.toString()).title = texte.pages_trajectoire.orbite_circulaire_stable;
		rCircIntLabelCell.style.display='';
		rCircIntResCell.style.display='';
	}else{ //On ne peut pas avoir une orbite circulaire à l'intérieur.
		//Je ne fais pas apparaître les cases liées :
		r_circ_int="";
		document.getElementById("r_circ_int_res"+compteur.toString()).innerHTML = r_circ_int;
		document.getElementById("r_circ_int_res"+compteur.toString()).removeAttribute("title");
		rCircIntLabelCell.style.display='none';
		rCircIntResCell.style.display='none';
	}

	//Je récupère les cases associées à la distance r pour qu'on ai une orbite circulaire à l'extérieure de l'astre : 
	rCircExtResCell = document.getElementById("r_circ_ext_res"+compteur.toString());
	rCircExtLabelCell = document.getElementById("rayon_orb_circ_ext_photon_nonBar"+compteur.toString());

	r_circ_ext = (3/2)*rs; //Je calcule cette distance r.

	if (r_circ_ext >= r_phy){ //Si je suis bien à l'extérieure de l'astre j'affiche cette distance r. 
		document.getElementById("r_circ_ext_res"+compteur.toString()).innerHTML = r_circ_ext.toExponential(10);
		document.getElementById("r_circ_ext_res"+compteur.toString()).title = texte.pages_trajectoire.orbite_circulaire_instable;
		rCircExtLabelCell.style.display='';
		rCircExtResCell.style.display='';
	}else{ //Si ce n'est pas le cas alors je ne fais pas apparaître les cases liées :
		document.getElementById("r_circ_ext_res"+compteur.toString()).innerHTML = "";
		document.getElementById("r_circ_ext_res"+compteur.toString()).removeAttribute("title");
		rCircExtLabelCell.style.display='none';
		rCircExtResCell.style.display='none';
	}

	//J'affiche dans le tableau les valeurs calculée de L, E, rs :
	document.getElementById("L"+compteur.toString()).innerHTML = L.toExponential(3);
	document.getElementById("E"+compteur.toString()).innerHTML = E.toExponential(3);
	document.getElementById("m").innerHTML = rs.toExponential(3);

	//Je récupère mon facteur d'échelle : 
	scale_factor = Number(document.getElementById("scalefactor").value);

	//Je calcule la distance radiale maximale que je pourrais atteindre : 
	if( E==1 && (L >= 2*rs || L <=-2*rs ) ){ 
		rmax=r0;
		if(rmax<r0) {rmax=2*r0;}
	}else {
		calcul_rmax(L,E,vr,r0,1) ;  
		if(rmax<r0) {rmax=r0 ;} 
	} 
	if(r0 < r_phy) {rmax=1.5*r_phy;}

	//--------------------------------Initialisation de mon objet mobile--------------------------------

	mobile = { r0:r0, dphi_sur_dlambda:dphi_sur_dlambda, vr:vr, L:L, E:E , phi0 : phi0}; //Je créé un objet mobile dans lequel je stocke différentes valeurs initiales associées à ce mobile.
	
	//J'associe à mon mobile des strings associés à mon graphe de potentiel : 
	mobile["pointsvg"]="pointg"+compteur.toString();
	mobile["graphesvg"]="#grsvg_"+compteur.toString();

	//J'associe les variables permettant de déclarer si je suis arrêtée ou pas et si je peux relancer la simulation à mon objet mobile :
	mobile["onestarrete"]=0;
	mobile["peuxonrelancer"]=true;

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

	boutonAvantLancement(); //J'associe aux différents boutons les fonctions associées d'avant le lancement. 
	canvasAvantLancement(); //J'affiche l'échelle du canvas avant le début de la simulation. 

	return mobile; //Je récupère au final de cette fonction l'objet mobile correctement initialisé.
} 

// -------------------------------------{fonction verifnbr}--------------------------------------------

function verifnbr() {//fonction qui affiche un message d'erreur si des valeurs ne sont pas donnée dans l'une des cases
  
	r_phy = document.getElementById("r_phy").value;
	M = document.getElementById("M").value;

	var onebolean=false;
	var twobolean=false;
	var threebolean=false;
  	var sddsdsddss = Number(document.getElementById("nombredefusees").value);

  	for (countetttt = 1; countetttt <= sddsdsddss; countetttt += 1) {
		var r0verifnbr = Number(document.getElementById("r0"+countetttt.toString()+"").value); 
		var vphiverifnbr = Number(document.getElementById("phi0"+countetttt.toString()+"").value);
		var vrverifnbr = Number(document.getElementById("teta"+countetttt.toString()+"").value);
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

  	if (mobile.pause || mobile.debut) {

		document.getElementById("tg2").style.display = "table"; //Fait apparaître le tableau des résultats.
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

		var distance_metrique_cell = document.querySelectorAll('[id^="distance_metrique"]'); //Permet d'identifier toutes les cellules de label de la distance métrique.
		var distance_metrique_res_cell = document.querySelectorAll('[id^="distance_parcourue"]'); //Permet d'identifier toutes les cellules de la distance métrique.

		if (element2.value == "mobile") { //Si en mode photon, permet de révéler les cases de la distance métrique.
			distance_metrique_cell.forEach(function(cell) { 
				cell.style.display = ''; 
			});
			distance_metrique_res_cell.forEach(function(cell) {
				cell.style.display = ''; 
			});
		} else {
			distance_metrique_cell.forEach(function(cell) {
				cell.style.display = 'none';
			});
			distance_metrique_res_cell.forEach(function(cell) {
				cell.style.display = 'none'; 
			});
		}
		

    	document.getElementById('trace_present').value="true"; //Permet de déclarer qu'il y a un tracé. 

    	mobile.pause = false; //Permet de dire que nous ne sommes pas en pause.
    	mobile.debut = false; //Permet de dire que nous ne sommes plus au début de la simulation. 

		//--------------------------------Calcul de la trajectoire en elle-même--------------------------------

    	mobile["phi"]=mobile.phi0; //J'attribue à l'élement phi du mobile la valeur de phi0 du mobile. 
    	mobile["phi_obs"]=mobile.phi0;

    	temps_chute_libre = Math.PI * rmax * Math.sqrt(rmax / (2 * G * M)) / 2; //Calcul du temps de chute libre. 
	
    	A_init = mobile.vr; //Dans A_init je mets la valeur initiale de vr du mobile.
    	r_init = mobile.r0; //Dans r_init je mets la valeur initiale de r du mobile qui est r0. 

		//--------------------------------Récupération de la distance initiale maximum--------------------------------

		if (nbredefusees==1) {//Si je n'ai que un seul mobile.
			if(ifUneFois2){ //On ne passe dans cette condition que une fois. 
				maximum=r0o2[1]; //Je stocke dans la variable maximum la distance initiale la plus grande. 
				cle = 1; //Je récupère l'indice qui correspond à ce maximum dans la liste r0o2 qui contient les r0 de tous les mobiles. 
				ifUneFois2=false; //Je fais en sorte de ne plus revenir dans cette condition. 
			}
		}else if(nbredefusees>=2){ //Si j'ai plusieurs mobiles.
        	if(ifUneFois){	//On ne passe dans cette condition que une fois.	
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

    	if(mobile.r0 > r_phy){ //Quand on débute à l'extérieure de l'astre.
			r_init_obs = mobile.r0; 
			r_part_obs=r_init_obs;
       		mobile["r_part_obs"]=r_part_obs; 
			A_init_obs = mobile.vr*(1-rs/mobile.r0)/mobile.E; //Je multiplie par dτ/dt pour passer le dr/dτ en observateur dans la métrique extérieure.
			A_part_obs=A_init_obs; 
        	mobile["A_part_obs"]=A_part_obs; 
		}
		else{ //Quand on débute à l'intérieur de l'astre
			r_init_obs = mobile.r0; 
        	r_part_obs=r_init_obs;
        	mobile["r_part_obs"]=r_part_obs; 
			A_init_obs = mobile.vr*Math.pow(beta(mobile.r0),2)/mobile.E; //Je multiplie par dτ/dt pour passer le dr/dτ en observateur dans la métrique intérieure.
			A_part_obs=A_init_obs; 
        	mobile["A_part_obs"]=A_part_obs; 					
		}

		distance_parcourue_totale=0; //J'initialise la distance parcourue totale par le mobile dans son propre référentiel. 
		mobile["distance_parcourue_totale"]=distance_parcourue_totale; //La distance totale parcourue devient une valeur spécifique au mobile. 

    	temps_particule = 0; //J'initialise le temps dans le référentiel du mobile. 
    	mobile["temps_particule"]=temps_particule;
    	temps_observateur_distant = 0; //J'initialise le temps dans le référentiel de l'observateur distant. 
    	mobile["temps_observateur_distant"]=temps_observateur_distant;

    	clavierEvenement(true);	//Permet une fois démarrée de gérer la simulation avec les touches du clavier.
	
		dtau=rmax/c*1e-3; //Je fixe le pas de temps à une fraction de la distance radiale maximale.
		mobile["dtau"]=dtau;

		//--------------------------------Positions de départ du mobile--------------------------------
	
		x1part = mobilefactor[compteur] * mobile.r0 * Math.cos(mobile.phi) / rmax; //x dans le référentiel du mobile.
    	y1part = mobilefactor[compteur] * mobile.r0 * Math.sin(mobile.phi) / rmax; //y dans le référentiel du mobile.
    	x1obs = mobilefactor[compteur] * mobile.r0 * Math.cos(mobile.phi_obs) / rmax; //x dans le référentiel de l'observateur distant.
    	y1obs = mobilefactor[compteur] * mobile.r0 * Math.sin(mobile.phi_obs) / rmax; //y dans le référentiel de l'observateur distant. 

		//--------------------------------Gestion du canvas--------------------------------

    	canvas = document.getElementById("myCanvas");
    	if (!canvas) { //Si je n'ai pas de canvas récupérable pour la simulation alors message d'alerte et simulation impossible.
			alert(texte.pages_trajectoire.impossible_canvas);
    	}

    	context = canvas.getContext("2d");
    	if (!context) { //Si je n'ai pas de context de récupérable (interface permettant de dessiner sur le canvas) alors message d'alerte et simulation impossible. 
    		alert(texte.pages_trajectoire.impossible_context);
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
    	mobile["positionspatio"]={posX1:posX1, posY1:posY1}//mobile.positionspatio.posX1

		//Je définis la position du mobile sur le canvas, vis à vis de son centre, dans le référentiel de l'observateur distant :
    	posX2 = posX3 + x1obs;
    	posY2 = posY3 + y1obs;
    	mobile["position"]={posX2:posX2, posY2:posY2} //mobile.position.posX2

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

		document.getElementById('plusvite').removeEventListener('click',foncPourVitAvantLancement,false) //Je désassocie la fonction foncPourVitAvantLancement du bouton pour accélérer une fois la simulation commencée.
		document.getElementById('moinsvite').removeEventListener('click',foncPourVitAvantLancement,false) //Je désassocie la fonction foncPourVitAvantLancement du bouton pour décélérer une fois la simulation commencée.


    	Dtau1 = 1e8 * mobile.dtau ; //Pour permettre une accélération.
    	mobile["Dtau1"]=Dtau1; //Pour associer ce Dtau1 à un mobile spécifique.
    	Dtau2 = mobile.dtau / 1e8; //Pour permettre une décélération.
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
			factGlobalAvecClef /= Math.pow(1.2,1/nbredefusees ); //Je dézoome de 20%. 
        	majFondFixe44(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile. 
        	rafraichir2(context,mobilefactor,rmaxjson,maximum,compteur); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom-=1/nbredefusees;
			document.getElementById('nzoomtxt').innerHTML= "nz="+ Math.round(nzoom).toString(); //Mets à jour l'affichage du zoom sur le site. 
    	}, false);


    	document.getElementById('pluszoom').addEventListener('click', function() { //J'associe le bouton zoomer à la fonction suivante une fois la simulation lancée.     
			var retour=bouttons.zoom(true,mobile,canvas,mobilefactor,compteur); //Utilise la fonction zoom du fichier bouttons.
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
			document.getElementById('nzoomtxt').innerHTML= "nz="+ Math.round(nzoom).toString(); //Mets à jour l'affichage du zoom sur le site. 
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
																		  
		setInterval(function(){  //Fonction qui permet d'avoir un graphe de potentiel dynamique. Ce graphe est renouvelé toutes les 300ms.  
	  		$('#grsvg_'+compteur.toString()).empty();  // //Je vide le contenue du canvas du potentiel. 																				  
    		data1=[]; 
			data2=[];					

			if (element2.value != "mobile"){ //Dans le cas de l'observateur distant. 
	
				dr=mobile.r_part_obs*0.6/50; //Je calcule l'incrément dr.
   
     			for (r = 0.7*mobile.r_part_obs; r < 1.3*mobile.r_part_obs ; r += dr) { //Je parcours une gamme de valeurs de r centrée autour de mobile.r_part_obs en incrémentant de mobile.dr .
      				V = Vr_obs(r,mobile.E,mobile.L); //Pour afficher de manière plus pertinente le graphe. 
      				data1.push({date: r,close: V}); //Je stocke dans data1 les valeurs de r et V.
    			}

				V = Vr_obs(mobile.r_part_obs,mobile.E,mobile.L); //Je calcule le potentiel à la position actuelle.
    			data2.push({date: mobile.r_part_obs,close: V}); //Je stocke dans data2 les valeurs de r et V de la position actuelle.
    			mobile.point = graphique_creation_pot(0,data1,data2,compteur,mobile); //Trace le graphe du potentiel.

			}else{  //Dans le cas du mobile je procède de manière identique.
	
				dr=mobile.r_part*0.6/50;
	
				for (r = 0.7*mobile.r_part; r < 1.3*mobile.r_part; r += dr) { 
      				V = Vr_mob(r,mobile.E,mobile.L);
      				data1.push({date: r,close: V});
    			}
		
				V = Vr_mob(mobile.r_part,mobile.E,mobile.L);
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



//----------------------------------------------------{animate}----------------------------------------------------
/**
 * Fonction qui s'occupe de l'animation, tracé et calculs en cours, elle est appelé dans trajectoire() en utilisant un Timer. 
 * @param {*} compteur : Numero du mobile 
 * @param {*} mobile   : mobile en cours de calcul
 * @param {*} mobilefactor : liste des facteurs pour l'echelle
 */

function animate(compteur,mobile,mobilefactor) {

	element = document.getElementById('traject_type');// on recupere le boutton de type de trajectoire
	element2=document.getElementById('traject_type2');//on recupere le boutton de observateur ou mobile

	mobilefactor[compteur] = factGlobalAvecClef //facteur pour l'echelle
	
	SurTelephone(); //on verifie si on est sur telephone ou ordinateur
	choixTrajectoire(compteur,context,mobilefactor,rmaxjson,maximum);// on vérifie le type de trajectoire sélectionné

	/*----------------------------------------------------------{{{{  CAS_OBSERVATEUR  }}}-----------------------------------------------------------*/
	if(element2.value != "mobile")
	//Tout ce qui est dans cette condition concerne le cas du referentiel de l'observateur
	{ 
		//-----------------------------------------------------PARTIE CALCULE---------------------------------------------------------------------

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< METRIQUE EXTERIEURE ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
		if(mobile.r_part_obs > r_phy) 
		{   
			//calcul de l'equation differentielle avec RK4 ça donne le r et dr/dlamda
			val = rungekutta_externe_photon_obs(mobile.dtau, mobile.r_part_obs, mobile.A_part_obs,mobile.E,mobile.L);
			mobile.r_part_obs = val[0]; //valeur de r calculée par RK (Runge Kutta)
			mobile.A_part_obs = val[1]; //valeur de dr/dlamda calculée par RK

			/*Calcul des vitesses dans metrique externe de SCH qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
			Fonctions_utilitaires_trajectoire):*/
			resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part_obs,rs,true); 
			vtotal=resultat[0]; //calcul du module de la vitesse 
			//resulatas de v_r avec le fichier de calcul de vitesses en prenant en compte le signe de la drivée calculée avec RK
			vr_1_obs=resultat[1]*Math.sign(mobile.A_part_obs); 
			vp_1_obs=resultat[2]; //resulatas de v_phi avec le fichier de calcul de vitesses

			//Calcul de la variation de l'angle phi pour l'ajouter à la valeur antérieure
			varphi_obs = c * mobile.L * mobile.dtau*(1-rs/mobile.r_part_obs) / Math.pow(mobile.r_part_obs, 2)/mobile.E; 
			mobile.phi_obs=mobile.phi_obs+varphi_obs;  //on met à jour le l'angle phi apres avoir calculé le var_phi

		}
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< METRIQUE INTERIEURE ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
		else
		{    
			//calcul de l'equation differentielle avec RK4 ça donne le r et dr/dlamda
			val = rungekutta_interne_photon_obs(mobile.dtau, mobile.r_part_obs, mobile.A_part_obs,mobile.E,mobile.L);
			mobile.r_part_obs = val[0]; //valeur de r calculée par RK (Runge Kutta)
			mobile.A_part_obs = val[1]; //valeur de dr/dlamda calculée par RK

			/*Calcul des vitesses dans metrique interne de SCH qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
			Fonctions_utilitaires_trajectoire):*/
			var vitess_phys=calculs.MSC_In_vitess(mobile.E,mobile.L,mobile.r_part_obs,rs,r_phy,true);
			vtotal=vitess_phys[0]; //calcul du module de la vitesse 
			//resulatas de v_r avec le fichier de calcul de vitesses en prenant en compte le signe de la drivée calculée avec RK
			vr_1_obs=vitess_phys[1]*Math.sign(mobile.A_part_obs);
			vp_1_obs=vitess_phys[2]; //resulatas de v_phi avec le fichier de calcul de vitesses

			//Calcul de la variation de l'angle phi pour l'ajouter à la valeur antérieure
			varphi_obs = c * mobile.L * mobile.dtau*Math.pow(beta(mobile.r_part_obs),2) / Math.pow(mobile.r_part_obs, 2)/mobile.E; 
			mobile.phi_obs= mobile.phi_obs+varphi_obs; //on met à jour le l'angle phi apres avoir calculé le var_phi
						
			//on calcule cette position pour eviter le bug du rebond au milieu de l'astre
			mobile.posintero= mobilefactor[compteur] * mobile.r_part_obs * (Math.cos(mobile.phi_obs) / rmax);

			//Avec cette condition on veille à regler les bugs qui des fois donnent à r negatif
			if(mobile.r_part_obs <= r_phy*5e-3 && varphi_obs <= 1e-3)
			{
				if(mobile.posintero > 0) 
				{
					mobile.phi_obs=Math.PI; //on met l'angle à 180°
					mobile.A_part_obs=-mobile.A_part_obs; //on change inverse le signe de dr/dlamda
				}
				else
				{
					mobile.phi_obs=0; //on met l'angle à 0°
					mobile.A_part_obs=-mobile.A_part_obs; //on change inverse le signe de dr/dlamda
				}
				
			}

		}  
		mobile.temps_observateur_distant+=mobile.dtau; //calcul du temps de l'observateur distant

		/*Calcul de la postion [X,Y] (noramilisées) pour dessiner dans le canva (tracé) */
		mobile.position.posX2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.cos(mobile.phi_obs) / rmax) + (canvas.width / 2.);
		mobile.position.posY2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.sin(mobile.phi_obs) / rmax) + (canvas.height / 2.);

		//on arrete le Timer associé au mobile dés que ya des r non defini et on met une alerte
		if (isNaN(mobile.r_part_obs) )
		{ 
			Timer.instances[compteur].stop();
			alert(texte.pages_trajectoire.alerte_singularite_non_baryonique);

		}
		
		//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------
		
		/*Affichage de toutes les variables dans le tableau */	
		document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3); // temps observateur
		document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3); //temps particule
		document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part_obs.toExponential(3); //rayon
		document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_1_obs.toExponential(3); //vitesse radiale
		document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_1_obs.toExponential(3); //vitesse angulaire
		document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(8); //vitesse total (module)
		document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3); //distance parcourue
	
		//-----------------------------------------------------PARTIE TRACÉ PARTICULE-------------------------------------------------
		//Dessin du tracé derriere la particule
		context.beginPath();//on ouvre le context
		context.fillStyle = mobile.couleur; //on choisit la couleur pour remplir parce que c'est fill
		context.rect(mobile.position.posX2, mobile.position.posY2, 1, 1); //on dessine le tracé
		context.lineWidth = "1"; //en choisissant la bonne largeur des traits
		context.fill(); //on le met sur le canva

		majFondFixe44(mobile);  // on efface l'ancienne position de la boule

		//On dessine la boule bleue avec les meme etapes
		mobile["context22"].beginPath();
		mobile["context22"].fillStyle = COULEUR_BLEU;
		mobile["context22"].arc(mobile.position.posX2, mobile.position.posY2 , 5, 0, Math.PI * 2);
		mobile["context22"].lineWidth = "1";
		mobile["context22"].fill();

		//-----------------------------------------------------PARTIE TRACÉ POTENTIEL-------------------------------------------------
		V = Vr_obs(mobile.r_part_obs,mobile.E,mobile.L); //on stocke la valeur du (Poteniel-1) avec les valeurs actuelles
		data2 = []; //on vide la liste qu'on va à la fonction update_graphique_2()
		data2.push({date: mobile.r_part_obs, close: V });   //on mets les les valeurs  dans data2 
		if(mobile.point !== undefined){update_graphique_2(mobile.point,data2,mobile);} //puis on les dessine si le point est defini
		
	}

	/*----------------------------------------------------------{{{{  CAS_SPATIONAUTE  }}}-----------------------------------------------------------*/
	else
	//Tout ce qui est dans cette condition concerne le cas du referentiel du spationaute
	{
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< METRIQUE EXTERIEURE ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
		if(mobile.r_part > r_phy) 
		{																																									   
			//calcul de l'equation differentielle avec RK4 ça donne le r et dr/dlamda
			val = rungekutta_externe_photon(mobile.dtau, mobile.r_part, mobile.A_part,mobile.L);
			mobile.r_part = val[0];//valeur de r calculée par RK (Runge Kutta)
			mobile.A_part = val[1];//valeur de dr/dlamda calculée par RK
			
			/*Calcul des vitesses dans metrique externe de SCH qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
			Fonctions_utilitaires_trajectoire):*/
			resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part,rs,true); 
			vtotal=resultat[0]; //calcul du module de la vitesse 
			//resulatas de v_r avec le fichier de calcul de vitesses en prenant en compte le signe de la drivée calculée avec RK
			vr_1=resultat[1]*Math.sign(mobile.A_part);
			vp_1=resultat[2]; //resulatas de v_phi avec le fichier de calcul de vitesses

			/*Condition pour gerer la vitesse radiale qui peut devenir non definie */
			if (isNaN(vr_1))
			{
				vr_1=0;
				vtotal=c;
			} 
			//Calcul de la variation de l'angle phi pour l'ajouter à la valeur antérieure
			varphi = c * mobile.L * mobile.dtau / Math.pow(mobile.r_part, 2);
			mobile.phi = mobile.phi + varphi; //on met à jour le l'angle phi apres avoir calculé le var_phi
		}

		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>< METRIQUE INTERIEURE ><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
		else 
		{ 
			//calcul de l'equation differentielle avec RK4 ça donne le r et dr/dlamda
			val = rungekutta_interne_photon(mobile.dtau, mobile.r_part, mobile.A_part,mobile.E,mobile.L);
			mobile.r_part = val[0];	//valeur de r calculée par RK (Runge Kutta)
			mobile.A_part = val[1]; //valeur de dr/dlamda calculée par RK
			
			/*Calcul des vitesses dans metrique interne de SCH qui retourne une liste de [v_tot,v_r,v_phi]  (Regarder le fichier 
			Fonctions_utilitaires_trajectoire):*/
			var vitess_phys=calculs.MSC_In_vitess(mobile.E,mobile.L,mobile.r_part,rs,r_phy,true);
			vtotal=vitess_phys[0]; //calcul du module de la vitesse 
			//resulatas de v_r avec le fichier de calcul de vitesses en prenant en compte le signe de la drivée calculée avec RK
			vr_1=vitess_phys[1]*Math.sign(mobile.A_part);
			vp_1=vitess_phys[2];  //resulatas de v_phi avec le fichier de calcul de vitesses

			//Calcul de la variation de l'angle phi pour l'ajouter à la valeur antérieure
			varphi = c * mobile.L*mobile.dtau/ Math.pow(mobile.r_part, 2);
			mobile.phi = mobile.phi + varphi; //on met à jour le l'angle phi apres avoir calculé le var_phi

			//on calcule cette position pour eviter le bug du rebond au milieu de l'astre
			mobile.posinterm= mobilefactor[compteur] * mobile.r_part*(Math.cos(mobile.phi) / rmax);

			//Avec cette condition on veille à regler les bugs qui des fois donnent à r negatif
			if(mobile.r_part <= r_phy*5e-3 && varphi <= 1e-3) 
			{ 
				if(mobile.posinterm > 0) 
				{
					mobile.phi=mobile.phi+Math.PI; //on ajoute 180° à l'angle 
					mobile.A_part=-mobile.A_part; //on change inverse le signe de dr/dlamda
				}
				else
				{
					mobile.phi=0; //on met l'angle à 0°
					mobile.A_part=-mobile.A_part; //on change inverse le signe de dr/dlamda
				}

			}
			
		}
		mobile.temps_observateur_distant+=mobile.dtau;//calcul du temps de l'observateur distant

		/*Calcul de la postion [X,Y] (noramilisées) pour dessiner dans le canva (tracé) */
		mobile.positionspatio.posX1 = mobilefactor[compteur] * mobile.r_part * (Math.cos(mobile.phi) / rmax) + (canvas.width / 2.);
		mobile.positionspatio.posY1 = mobilefactor[compteur] * mobile.r_part * (Math.sin(mobile.phi) / rmax) + (canvas.height / 2.);
		
	
		//on arrete le Timer associé au mobile dés que ya des r non defini et on met une alerte
		if (isNaN(mobile.r_part) )
		{ 
			Timer.instances[compteur].stop();//puis on stope la simulation
			alert(texte.pages_trajectoire.alerte_singularite_non_baryonique);

		}

		//-----------------------------------------------------PARTIE AFFICHAGE-------------------------------------------------
		
		/*Affichage de toutes les variables dans le tableau */	
		mobile.temps_observateur_distant+=mobile.dtau;
		document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3); // temps observateur
		document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3); //temps particule
		document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part.toExponential(3);  //rayon
		document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_1.toExponential(3);	//vitesse radiale
		document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_1.toExponential(8);	//vitesse angulaire
		document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(8); 	//vitesse total (module)
		document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3);	//distance parcourue

		//-----------------------------------------------------PARTIE TRACÉ PARTICULE-------------------------------------------------
		//Dessin du tracé derriere la particule
		context.beginPath();//on ouvre le context
		context.fillStyle = mobile.couleur; //on choisit la couleur pour remplir parce que c'est fill
		context.rect(mobile.positionspatio.posX1, mobile.positionspatio.posY1, 1, 1); //on dessine le tracé
		context.lineWidth = "1"; //en choisissant la bonne largeur des traits
		context.fill();//on le met sur le canva

		majFondFixe44(mobile);  // on efface l'ancienne position de la boule

		//On dessine la boule bleue avec les meme etapes
		mobile["context22"].beginPath();
		mobile["context22"].fillStyle = COULEUR_BLEU;
		mobile["context22"].arc(mobile.positionspatio.posX1, mobile.positionspatio.posY1 , 5, 0, Math.PI * 2);
		mobile["context22"].lineWidth = "1";
		mobile["context22"].fill();

		//-----------------------------------------------------PARTIE TRACÉ POTENTIEL -------------------------------------------------

		V = Vr_mob(mobile.r_part,mobile.E,mobile.L);//on stocke la valeur du (Poteniel-1) avec les valeurs actuelles
		data2 = [];  //on vide la liste qu'on va à la fonction update_graphique_2()
		data2.push({date: mobile.r_part, close: V });  //on mets les les valeurs  dans data2 
		if(mobile.point !== undefined){update_graphique_2(mobile.point,data2,mobile);}	//puis on les dessine si le point est defini
	
	}

	/*si tout les Timers relié aux mobiles sont supprimés on sait que ya plus de calculs en cours alors on met qu'on a fini la simulation*/
	if (Object.keys(Timer.instances).length === 0) 
	{
		document.getElementById("indic_calculs").innerHTML=texte.pages_trajectoire.calcul_termine; //on met que le calculé est fini (voir le Json)
		document.getElementById("pause/resume").style.display='none';  //on enleve les 2 buttons pause
		document.getElementById('bouton_pause').style.display='none'; 
			
	}


}  //fin fonction animate

// Expression du potentiel divisée par c^2

function Vr_mob(r,E,L) {
	if(r > r_phy) { return potentiel_externe_photon(r,L);}
	else{ return potentiel_interne_photon(r,E,L);}
}

function Vr_obs(r,E,L) {
	if(r > r_phy) { return Math.pow(E,2)-( 1-potentiel_externe_photon(r,L)/Math.pow(E,2) )*Math.pow(1-rs/r,2) ;}
	else{ return Math.pow(E,2)- Math.pow(beta(r),4)*( 1-potentiel_interne_photon(r,E,L)/Math.pow(E,2) ); } 
}
			
function potentiel_interne_photon(r,E,L) {
	return Math.pow(E,2) - alpha(r)* (Math.pow(E/beta(r),2)- Math.pow(L / r, 2));
}

function potentiel_externe_photon(r,L) {
	return (1 - rs / r) * Math.pow(L / r, 2);
}

function rungekutta_externe_photon(h, r, A, L) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_externe_photon(r,L);
	k[1] = derivee_seconde_externe_photon(r + 0.5 * h * A,L);
	k[2] = derivee_seconde_externe_photon(r + 0.5 * h * A + 0.25 * h * h * k[0],L);
	k[3] = derivee_seconde_externe_photon(r + h * A + 0.5 * h * h * k[1],L);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
}

function rungekutta_interne_photon(h, r, A,E,L) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_interne_photon(r,E,L);
	k[1] = derivee_seconde_interne_photon(r + 0.5 * h * A,E,L);
	k[2] = derivee_seconde_interne_photon(r + 0.5 * h * A + 0.25 * h * h * k[0],E,L);
	k[3] = derivee_seconde_interne_photon(r + h * A + 0.5 * h * h * k[1],E,L);
	r = r + h * A+ (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	
	return [r, A];
}

function rungekutta_externe_photon_obs(h, r, A,E,L) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_externe_photon_obs(r,E,L);
	k[1] = derivee_seconde_externe_photon_obs(r + 0.5 * h * A,E,L);
	k[2] = derivee_seconde_externe_photon_obs(r + 0.5 * h * A + 0.25 * h * h * k[0],E,L);
	k[3] = derivee_seconde_externe_photon_obs(r + h * A + 0.5 * h * h * k[1],E,L);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
}

function rungekutta_interne_photon_obs(h, r, A,E,L) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_interne_photon_obs(r,E,L);
	k[1] = derivee_seconde_interne_photon_obs(r + 0.5 * h * A,E,L);
	k[2] = derivee_seconde_interne_photon_obs(r + 0.5 * h * A + 0.25 * h * h * k[0],E,L);
	k[3] = derivee_seconde_interne_photon_obs(r + h * A + 0.5 * h * h * k[1],E,L);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
}

function alpha(r){
	return 1-(Math.pow(r, 2)*rs) / Math.pow(r_phy, 3);
}


function beta(r){
	return 1.5 * Math.sqrt(Math.abs(1-(rs/r_phy))) - 0.5 *Math.sqrt(1-(Math.pow(r, 2)*rs)/Math.pow(r_phy, 3));
}

// fonctions utilisées pour Runge Kutta

function derivee_seconde_interne_photon(r,E,L) {
	/*-(Math.pow(c, 2)*r*rs) / Math.pow(r_phy, 3)*(Math.pow(E,2)/Math.pow(beta(r), 2)- Math.pow(L, 2)/Math.pow(r, 2) )
   +  Math.pow(c, 2)* alpha(r)/2 * ( 2* Math.pow(L, 2)/Math.pow(r, 3)-(Math.pow(E,2)*r*rs)/(Math.pow(beta(r), 3)*Math.sqrt(alpha(r))*Math.pow(r_phy, 3)));
	*/
	resulta=-(c**2 * r * rs / r_phy**3) * (Math.pow(E /beta(r), 2) - Math.pow(L / r, 2))
		+ c**2 * alpha(r) * 0.5 * (-(E**2 * r * rs) / ((beta(r) * r_phy)**3 * Math.sqrt(alpha(r))) + 2 * L**2 / r**3);
	//console.log("al"+alpha(r));
	//resulta=cc*El+ca*el2;
	return resulta ;
}

function derivee_seconde_externe_photon(r,L) {
	return Math.pow(c, 2)/(2*Math.pow(r, 4)) * (Math.pow(L, 2)*(2*r-3*rs));
}

function derivee_seconde_interne_photon_obs(r,E,L) {
	return - Math.pow(c, 2)*r*rs/Math.pow(E,2)/ Math.pow(r_phy, 3) * (Math.pow(E*beta(r),2)- Math.pow(L/r, 2)*Math.pow(beta(r),4) )
	+  0.5*Math.pow(c, 2)* alpha(r)/Math.pow(E,2) * ( 2* Math.pow(L, 2)*Math.pow(beta(r),4)/Math.pow(r, 3)- Math.pow(E,2)*r*rs*beta(r)/(Math.sqrt(alpha(r))*Math.pow(r_phy, 3)))
	+Math.pow(c, 2)*Math.sqrt(alpha(r))/Math.pow(E,2)/ Math.pow(r_phy, 3)*(Math.pow(E,2)*beta(r)- Math.pow(L/r, 2)*Math.pow(beta(r),3) )*r*rs;
}

function derivee_seconde_externe_photon_obs(r,E,L) {
	return   c*c*(r-rs)*(2*E*E*r*r*r*rs + 2*L*L*r*r - 7*L*L*r*rs + 5*L*L*rs*rs )/(2*Math.pow(r,6)*E*E);
}


function calcul_rmax(L,E,vr,r0,rmax1ou2){
  // Vr different de 0
  //JPC mis en commentaire ici rmax = eq3d(L, m, E);
  // Vr=0
  //JPC et ici if (vr == 0) {
    r1 = (L * (L - Math.sqrt(Math.pow(L, 2) - 12 * Math.pow(m, 2))) / (2 * m));
    r2 = (L * (L + Math.sqrt(Math.pow(L, 2) - 16 * Math.pow(m, 2))) / (4 * m));
    ra = 2 * m * Math.pow(L, 2);
    rb = ((2 * m / r0) - 1) * Math.pow(L, 2);
    X0 = 1 / r0;
    rc = 2 * m - Math.pow(L, 2) * X0 + 2 * m * Math.pow(L * X0, 2);
    DELTA = Math.pow(rb, 2) - 4 * ra * rc;
    r3 = (-rb - Math.sqrt(DELTA)) / (2*ra);
	//console.log("r3",r3);
	//console.log("r0",r0);
    // la particule tombe au centre
    if (L < 2 * Math.sqrt(3) * m) {
    	rmax = r0;
    }
	else if ( (L <= 4*m) && (L > 2*Math.sqrt(3)*m) ) {
		// dans ce cas, r varie entre 2 valeurs r0 et r3
			if ( (Vr(r0) <= Vr(r1)) && (r0 > r1) ) {
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
	
}


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
    else{
		    Timer.paused = false;
			mobile.pause = false;
            document.getElementById("pause/resume").innerHTML = texte.pages_trajectoire.bouton_pause;
			document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours;
			document.getElementById("pau").title = texte.pages_trajectoire.bouton_pause;
			document.getElementById("pau").src = "Images/pause.png";
		}
	}

function rafraichir2(context,mobilefactor,rmaxjson,r0ou2,compteur) {
majFondFixe();
creation_blocs(context,mobilefactor,rmaxjson,r0ou2,compteur);
}

function rafraichir() {
	window.location.reload();
	element2.value="observateur";}


// -------------------------------------{fonction enregistrer}--------------------------------------------

function enregistrer() {
	var texte = o_recupereJson();

	if (document.getElementById('trace_present').value === "true") {
		// Demander à l'utilisateur le nom du fichier
		var nomFichier = prompt(texte.pages_trajectoire.message_nomFichier, "traject_Schaw_DM_P");

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

function commandes(){
	var texte = o_recupereJson();
	alert(texte.page_trajectoire_massive.commandes);
}

function majFondFixe(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Ajout d'un fond blanc pour l'exportation
	context.fillStyle = 'white';
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.font = "15pt bold";
	context.fillStyle = "black";
	context.fillText(texte.page_trajectoire_photon.non_baryonique_photon,5,40);
	context.font = "13pt bold";
	context.fillText(texte.pages_trajectoire.entrees,5,70);
	context.font = "11pt normal";
	context.fillText("M = "+M.toExponential(3)+" kg",5,90);
	context.fillText("r\u209A\u2095\u1D67 = "+r_phy.toExponential(3)+" m",5,110);
	if(document.getElementById('traject_type2').value=="observateur"){
		context.fillText(texte.pages_trajectoire.observateur,5,130);
	}
	else { context.fillText(texte.pages_trajectoire.photon,5,130); }

	context.fillText("mobile1:",5,150);
	context.fillText("r\u2080 = "+(r0o2[1]).toExponential(3)+" m",5,170);
	context.fillText("V\u2080 = "+vphiblab.toExponential(3)+" m.s\u207B\u00B9",5,190);
	context.fillText("\u03C6\u2080 = "+vrblab.toExponential(3)+" °",5,210);														
	nombeuhreudefusees = Number(document.getElementById("nombredefusees").value);

	if (nombeuhreudefusees>=2) {
		context.fillText("mobile2:",5,230);
		context.fillText("r\u2080 = "+r0o2[2].toExponential(3)+" m",5,250);
		context.fillText("V\u2080 = "+vphi2i.toExponential(3)+" m.s\u207B\u00B9",5,270);
		context.fillText("\u03C6\u2080= "+vr2i.toExponential(3)+" °",5,290);
	}
}

function majFondFixe44(mobile){
	mobile["context22"].clearRect(0, 0, canvas.width, canvas.height);
	//console.log(canvas.width, canvas.height);
}

function majFondFixe22(){
	context22.clearRect(0, 0, canvas.width, canvas.height);
	//console.log(canvas.width, canvas.height);
}

function majFondFixe3(){
	context3.clearRect(0, 0, canvas.width, canvas.height);
	//console.log(canvas.width, canvas.height);
}

// Fonction de verification par rapport à R_phy r0 et rs avant lancement 
function test_inte() {

	/*variables pours verifier 3 conditions differentes:*/
	var onebol=false;
	var twobol=false;
	var threebol=false;

	var nombre_de_fusees = Number(document.getElementById("nombredefusees").value);
	/*On boucle sur tout les fusees pour voir si tout est bon:*/
	for (count = 1; count <= nombre_de_fusees; count += 1) {
		var r0testinte = Number(document.getElementById("r0"+count.toString()+"").value); 
		if(r0testinte==0){
			onebol=true;
		}
		if(r0testinte<0){
			twobol=true;
		}

	}
	var texte = o_recupereJson();

	/*Si les conditions r>rs et r_phy pas tres proche de rs ne sont pas pas verifiées on renvoie un message d'erreur adapté à la situation*/
	if(onebol) {
		return texte.pages_trajectoire.r0egale0;
	}
	if (r_phy < 0 || twobol) {
		return texte.pages_trajectoire.rayon_neg;
	} 
	else if (r_phy <= rs ) {
		return texte.pages_trajectoire.rayonPhyInfHorz;
	} 
	else if(r_phy < 1.15*rs ){
		return texte.pages_trajectoire.rphysetrs;
	}
	if(threebol) {
		return texte.pages_trajectoire.vitesses_initiales_nulles;
	}
	//sinon on revoit un true pour lancer la simulation
	else
	{	
		return true;
	}
}

// crée les différentes couches visuelles
function creation_blocs(context,mobilefactor,rmaxjson,r0ou2,compteur){
	r2bis=(80*r0ou2)/(factGlobalAvecClef);
	r1bis=Math.round((80*r0ou2)/(factGlobalAvecClef*10**testnum(r2bis)));
	ech=r1bis*10**testnum(r2bis);

	context.lineWidth = "1";
	context.fillStyle = COULEUR_NOIR;
if ((mobilefactor[cle] * m / rmaxjson[cle]) < 3) {
		context.beginPath();
		context.strokeStyle = COULEUR_BLEU;
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
	} else {
		context.beginPath();
		context.strokeStyle = COULEUR_BLEU;
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, ((mobilefactor[cle] * 2 * m / rmaxjson[cle])), 0, Math.PI * 2);
		context.stroke();
	}
//	if (rs < r_phy) {
		context.beginPath();
		context.fillStyle = COULEUR_RPHY;
		context.setLineDash([]);
		context.arc(posX3, posY3, (factGlobalAvecClef * r_phy / rmaxjson[cle]), 0, Math.PI * 2);
		context.fill();
		context.beginPath();
		context.strokeStyle = COULEUR_GRIS;
		//context.setLineDash([5, 5]);
		//context.arc(posX3, posY3, ((mobilefactor[cle] * 2 * m / rmaxjson[cle])), 0, Math.PI * 2); 
		context.stroke();
//	}
	context.fillStyle = 'white';


	// Ajout d'un fond blanc pour l'exportation
	context.font = "15pt bold";
	context.fillStyle = "black"; 
	context.fillText(texte.page_trajectoire_photon.non_baryonique_photon,5,40);
	context.font = "13pt bold";
	context.fillText(texte.pages_trajectoire.entrees,5,70);
	context.font = "11pt normal";
	context.fillStyle = COULEUR_RS;
	context.fillText(ech.toExponential(1)+" m",605,90);
	context.stroke();
	context.beginPath();      // Début du chemin
	context.strokeStyle = COULEUR_RS;
	context.setLineDash([]);
	context.moveTo(600,110);
	context.lineTo(600+ech*factGlobalAvecClef/r0ou2,110);
	context.moveTo(600,105);
	context.lineTo(600,115);
	context.moveTo(600+ech*factGlobalAvecClef/r0ou2,105);
	context.lineTo(600+ech*factGlobalAvecClef/r0ou2,115);
	// Fermeture du chemin (facultative)
	context.stroke();
	
	
}

function canvasAvantLancement(){
	nbrFusee = document.getElementById("nombredefusees").value
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

	facteurDeMalheur = [] // Je suis désespéré
	
	for (key = 1; key <= nbrFusee; key += 1) {
		facteurDeMalheur[key] = Number(document.getElementById("scalefactor").value);  	
	
	}
	for (key = 1; key <= nbrFusee; key += 1) {
		if(key!=cle){
			facteurDeMalheur[key] = Number(document.getElementById("scalefactor").value)/(r0o2[cle]/r0o2[key]);
		}
	}

	factGlobalAvecClef = facteurDeMalheur[cle];
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

function foncPourZoomMoinsAvantLancement(){
	
		factGlobalAvecClef = factGlobalAvecClef/1.2;
		canvasAvantLancement();
		nzoom-=1;
		ns_avant_lancement-=1;
		document.getElementById('nzoomtxt').innerHTML= "nz="+ nzoom.toString();

}

function foncPourZoomPlusAvantLancement(){
	
	factGlobalAvecClef = factGlobalAvecClef*1.2;
	nzoom+=1;
	ns_avant_lancement+=1;
	document.getElementById('nzoomtxt').innerHTML= "nz="+ nzoom.toString();
	canvasAvantLancement();

}

function recuperation(){
	if(document.getElementById('trace_present').value!="true"){
		load_schwarshild_photon_nonBar();
		var lenbdefusees = Number(document.getElementById("nombredefusees").value);
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