// -------------------------------------{Variables globales}--------------------------------------------

const DIAMETRE_PART = 1;
var z=0;
var z_obs=0;

var title = "V(r)/c²";		  
var clicks = 0;
var nzoom=0;
var ns_avant_lancement=0;
var facteurDeMalheur;
var fact_defaut;

var factGlobalAvecClef ;//pour l'échelle avant lancement
var compteurVitesseAvantLancement = 0;


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
    constructor(funct, delayMs, times) {
        if (times === undefined) times = -1;
        if (delayMs === undefined) delayMs = 10;

        this.funct = funct;
        this.times = times;
        this.timesCount = 0;
        this.ticks = (delayMs / 10) | 0;
        this.count = 0;
        Timer.instances.push(this);
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
        const index = Timer.instances.indexOf(this);
        Timer.instances.splice(index, 1);
    }
}

Timer.instances = [];
Timer.paused = false;


Timer.ontick = function () {
    if (!Timer.paused) {
        for (const instance of Timer.instances) {
            instance.tick();
        }
    }
};

window.setInterval(Timer.ontick, 1);
//-----------------------------------------------------------KHALED--------------------------------------------------

// -------------------------------------{fonction initialisationGenerale}-------------------------------------------

function initialisationGenerale(fuseecompteur){
    c = 299792458;
    G = 6.67385 * Math.pow(10, -11);
    M = Number(document.getElementById("M").value);
    r_phy = Number(document.getElementById("r_phy").value);
    m = G * M / Math.pow(c, 2); 
    rs=2*m;

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
			newlabel.innerHTML =" "+ htmlDecode("&phi;")+"<sub>0</sub>° =";
			span.appendChild(newlabel);
		}
		var newinput = document.createElement("Input");
		newinput.setAttribute("id","phi0"+countt.toString()+"");
		newinput.setAttribute("value","-10");
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
		newinput.setAttribute("onChange","verifnbr();initialisationGenerale("+nbredefuseesgenere.toString()+")");
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
					<th id="v_total`+countt.toString()+`" class="tg-aicv">V<SUB>physique</SUB> (m.s<sup>-1</sup>)</th>
					<th id="distance_metrique`+countt.toString()+`" title="" class="tg-aicv" style="display: none;"></th>`; //ManonGeneralisation

		var newRow2=document.getElementById('tableauresultatsimu').insertRow();

		newRow2.innerHTML =       `<tr id="tg2ggb`+countt.toString()+`">
					<td class="tg-3ozo" id="r_par`+countt.toString()+`">res</td>
					<td class="tg-3ozo" id="tp`+countt.toString()+`">res</td>
					<!--<td class="tg-3ozo" id="ga`+countt.toString()+`">res</td>-->
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

// -------------------------------------{fonction initialisation}--------------------------------------------

function initialisation(compteur){
	

	c = 299792458;
	G = 6.67385 * Math.pow(10, -11);
	M = Number(document.getElementById("M").value);
	r_phy = Number(document.getElementById("r_phy").value);
	m = G * M / Math.pow(c, 2); 
	rs=2*m;
	r0 = Number(document.getElementById("r0"+compteur.toString()).value);
	phi0 = Number(document.getElementById("phi0"+compteur.toString()).value);
	teta = Number(document.getElementById("teta"+compteur.toString()).value);
	teta1=teta;
	phi0=(phi0*Math.PI)/180;
	teta=(teta*Math.PI)/180;

	vphi=Math.sin(teta)*c/Math.sqrt(1-rs/r0);
	vr=Math.cos(teta)*c;
	if(teta1==180){vphi=0;}
	if(teta1==90){vr=0;}
	L = vphi * r0 / c;
	E = Math.sqrt(Math.pow(vr / c, 2) + (1 - rs / r0)* Math.pow(L / r0, 2));

	rayon_orbite = (3/2)*rs; //ManonCirculaire

	document.getElementById("L"+compteur.toString()).innerHTML = L.toExponential(3);
	document.getElementById("E"+compteur.toString()).innerHTML = E.toExponential(3);
	document.getElementById("m").innerHTML = rs.toExponential(3);
	document.getElementById("rayon_orbite_circ_res"+compteur.toString()).innerHTML = rayon_orbite.toExponential(5); //ManonCirculaire

	scale_factor = Number(document.getElementById("scalefactor").value);
	mobile = { r0:r0, vphi:vphi, vr:vr, L:L, E:E, phi0:phi0 }; 
	mobile["pointsvg"]="pointg"+compteur.toString();
	mobile["graphesvg"]="#grsvg_"+compteur.toString();
	mobile["onestarrete"]=0;
	mobile["peuxonrelancer"]=true;


	/* Calcul de rmax */
	calcul_rmax(L,E,vr,r0,1) 

	mobile["rmax"]=rmax; //mobile.rmax
	mobile["blups"]=0;
	rmaxjson[compteur]=rmax;
	mobilefactor[compteur]=scale_factor;
	r0o2[compteur] = r0;
	mobile["pause"]=true; //mobile.pause
	mobile["debut"]=true; //mobile.debut
  
	couleurs = generateurCouleur();
	mobile["couleur"]="rgb("+couleurs[0]+", "+couleurs[1]+", "+couleurs[2]+")";//mobile.couleur
	mobile["red"]=couleurs[0];
	mobile["green"]=couleurs[1];
	mobile["blue"]=couleurs[2];


	//calcul de grav
	gCell = document.getElementById("g");
	gLabelCell = document.getElementById("gravtxt");

	g=(G*M)/(Math.pow(r_phy,2)*9.81);
	if(r_phy==0){
		document.getElementById("g").innerHTML=" ";
		gCell.style.display='none';
		gLabelCell.style.display='none';
	}
	else{
		document.getElementById("g").innerHTML=g.toExponential(3);
		gCell.style.display='';
		gLabelCell.style.display='';
	}

	// Rayonnement de Hawking d’un trou noir

	var TempTNLabelCell = document.getElementById("TempTrouNoirtxt");
	var TempTNCell = document.getElementById("TempTN");
	var tempsEvapLabelCell = document.getElementById("tempsEvaporationTrouNoirtxt");
	var tempsEvapCell = document.getElementById("tempsEvapTN");

	// 1. calcul température du trou noir
	if (rs>r_phy){
	M_soleil = 1.989e30						;		//masse du soleil en kg
	Temp_trouNoir = 6.5e-8 * M_soleil/M		;		//en Kelvin
	document.getElementById("TempTN").innerHTML=Temp_trouNoir.toExponential(3);

	// 2. calcul temps d'évaporation de Hawking (calcul simplifié)
	tempsEvaporation_trouNoir = 6.6e74*((M/M_soleil)**3); 		//en secondes
	document.getElementById("tempsEvapTN").innerHTML=tempsEvaporation_trouNoir.toExponential(3);
	TempTNCell.style.display='';
	TempTNLabelCell.style.display='';
	tempsEvapCell.style.display='';
	tempsEvapLabelCell.style.display='';
    }

	else{//pas trou noir 
		document.getElementById("TempTN").innerHTML=" ";
		document.getElementById("tempsEvapTN").innerHTML = " ";
		TempTNCell.style.display='none';
		TempTNLabelCell.style.display='none';
		tempsEvapCell.style.display='none';
		tempsEvapLabelCell.style.display='none';
	}
	
	// calcule de vitesse de liberation 
	VlibLabelCell = document.getElementById("vitesseLibéra");
	VlibCell = document.getElementById("Vlib");

	Vlib=c*Math.pow(rs/r_phy,1/2);
	if(r_phy>=rs){
	  document.getElementById("Vlib").innerHTML=Vlib.toExponential(3);
	  VlibCell.style.display='';
	  VlibLabelCell.style.display='';
	}
	else{document.getElementById("Vlib").innerHTML=" ";
		VlibCell.style.display='none';
		VlibLabelCell.style.display='none';
	}

	if (compteur==1){
		vphiblab=c;
		vrblab=phi0*180/Math.PI;
	}
	if(compteur==2){
		vphi2i = c;
		vr2i = phi0*180/Math.PI;
	}

	boutonAvantLancement();
	canvasAvantLancement();

  	return mobile;
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
			var vphiverifnbr = vphi;
			var vrverifnbr = vr;
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

		estUnMobile(); //Affichage de l'information sur les touches claviers en fonction de la taille de l'écran.

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

		distance_parcourue_totale=0; //J'initialise la distance parcourue totale par le mobile dans son propre référentiel. 
		mobile["distance_parcourue_totale"]=distance_parcourue_totale; //La distance totale parcourue devient une valeur spécifique au mobile. 
	
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
		
		new Timer(() => animate(compteur,mobile,mobilefactor), 1, -1); //Créé un nouvel objet Timer qui répète la fonction animate toutes les 1s indéfiniment. 
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

		document.getElementById('plusvite').removeEventListener('click',foncPourVitAvantLancement,false); //Je désassocie la fonction foncPourVitAvantLancement du bouton pour accélérer une fois la simulation commencée.
		document.getElementById('moinsvite').removeEventListener('click',foncPourVitAvantLancement,false) //Je désassocie la fonction foncPourVitAvantLancement du bouton pour décélérer une fois la simulation commencée.

		Dtau1 = 1e8 * dtau ; //Pour permettre une accélération.
		mobile["Dtau1"]=Dtau1; //Pour associer ce Dtau1 à un mobile spécifique.
		Dtau2 = dtau/1e8  ; //Pour permettre une décélération.
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
			factGlobalAvecClef /= Math.pow(1.2,1/nbredefusees); //Je dézoome de 20%. 
			majFondFixe44(mobile); //Je mets à jour tout ce qui est relié au dessin du mobile.
			rafraichir2(context,mobilefactor,rmaxjson,maximum,compteur); //Redessine le rayon de SCH et si besoin l'astre sur un fond blanc avec les entrées à gauche. 
			nzoom-=1/nbredefusees;
			document.getElementById('nzoomtxt').innerHTML= "nz="+ Math.round(nzoom).toString(); //Mets à jour l'affichage du zoom sur le site. 
		}, false);


		document.getElementById('pluszoom').addEventListener('click', function() { //J'associe le bouton zoomer à la fonction suivante une fois la simulation lancée.     
			var retour=bouttons.zoom(true,mobile,canvas,mobilefactor,compteur); //Utilise la fonction zoom du fichier bouttons.
			mobile=retour[0]; //Récupère le mobile avec les nouvelles positions sur le canvas.
			mobilefactor=retour[1]; //Récupère le nouveau facteur d'échelle. 
			factGlobalAvecClef *= Math.pow(1.2,1/nbredefusees); //Je zoome de 20%.
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
    	new Timer(() => animate(compteur,mobile,mobilefactor), 1, -1); //Créé un nouvel objet Timer qui répète la fonction animate toutes les 1s indéfiniment. 
		//animate calcule les coordonnées de la particule à chaque instant. 
	}

	
	document.getElementById('start').style.display = "none"; //Une fois la simulation démarrée le bouton start/débuter disparaît.
	document.getElementById('pause/resume').style.display ="inline-block"; //Une fois la simulation démarrée le bouton pause/resume apparaît.

} 

// -------------------------------------{animate}--------------------------------------------

function animate(compteur,mobile,mobilefactor) {
	mobile.onestarrete=0;
	mobilefactor[compteur] = factGlobalAvecClef
	estUnMobile();
	element = document.getElementById('traject_type');
	choixTrajectoire(compteur,context,mobilefactor,rmaxjson,maximum);
	var isrebond = document.getElementById("boutton_ammorti").value;
	element2=document.getElementById('traject_type2');													 

	if (mobile.r0 != 0.0) {
		if (element2.value == "mobile"){ //photon
			
	
			
			val = rungekutta(mobile.L,mobile.dtau, mobile.r_part, mobile.A_part);
			mobile.r_part = val[0];
			mobile.A_part = val[1];
			resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part,rs,true); /// voir fichier fonctions.j 
			vtotal=resultat[0];
			mobile.phi = mobile.phi + c * mobile.L * mobile.dtau / Math.pow(mobile.r_part, 2);
			vr_2=resultat[1]*Math.sign(mobile.A_part);  
			vp_2=resultat[2];
			

		}
		else{
			varphi_obs = c * mobile.L * mobile.dtau*(1-rs/mobile.r_part_obs) / Math.pow(mobile.r_part_obs, 2)/mobile.E; 
			mobile.phi_obs=mobile.phi_obs+varphi_obs;
			val_obs = rungekutta_obs(mobile.E,mobile.L,mobile.dtau, mobile.r_part_obs, mobile.A_part_obs);
			mobile.r_part_obs = val_obs[0];
			mobile.A_part_obs = val_obs[1];
			resultat=calculs.MSC_Ex_vitess(mobile.E,mobile.L,mobile.r_part_obs,rs,true); /// voir fichier fonctions.j 
			vtotal=resultat[0];
			if(mobile.r_part_obs<rs*1.0001) { mobile.r_part_obs=rs;}
			vr_2_obs=resultat[1]*Math.sign(mobile.A_part_obs); 
			vp_2_obs=resultat[2]; 

			
		}
      

    //On ne devrait pas mettre a jour les positions x et y ici? au lieu de plus loin
    //Tracé de la particule

    if (element2.value != "mobile"){
		if (mobile.r_part_obs >= rs){
			context.beginPath();
			context.fillStyle = mobile.couleur;
			context.rect(mobile.position.posX2, mobile.position.posY2, 1, 1);
			context.lineWidth = "1";
			context.fill();
			majFondFixe44(mobile);
			mobile["context22"].beginPath();
			mobile["context22"].fillStyle = COULEUR_BLEU;
			mobile["context22"].arc(mobile.position.posX2, mobile.position.posY2 , 5, 0, Math.PI * 2);
			mobile["context22"].lineWidth = "1";
			mobile["context22"].fill();
    	}
    }
	else{
		context.beginPath();
		context.fillStyle = mobile.couleur;
		context.rect(mobile.positionspatio.posX1, mobile.positionspatio.posY1, 1, 1);
		context.lineWidth = "1";
		context.fill();
		majFondFixe44(mobile);
		mobile["context22"].beginPath();
		mobile["context22"].fillStyle = COULEUR_BLEU;
		mobile["context22"].arc(mobile.positionspatio.posX1, mobile.positionspatio.posY1 , 5, 0, Math.PI * 2);
		mobile["context22"].lineWidth = "1";
		mobile["context22"].fill();
    }


// conditions pour le rebond

	if(element2.value != "mobile"){
		if (mobile.r_part_obs <= r_phy ) {
			if (isrebond == 1 && r_phy > 0) {
		
				mobile.A_part_obs = -mobile.A_part_obs ;
			} 
			if(isrebond == 0 && r_phy!=0 && mobile.r_part_obs <= r_phy){
				//alert(texte.pages_trajectoire.particule_ecrasee);
				mobile.onestarrete=1;
				arret(mobile);
				mobile.peuxonrelancer=false;
			}	
		}
		
	}else{	
		if (mobile.r_part <= r_phy || mobile.r_part==0) {
			if (isrebond == 1 && r_phy > 0) {
				mobile.A_part = -mobile.A_part ;
			}	
			if(isrebond == 0 && r_phy!=0 && mobile.r_part <= r_phy){
				//alert(texte.pages_trajectoire.particule_ecrasee);
				mobile.onestarrete=1;
				arret(mobile);
				mobile.peuxonrelancer=false;
			}	     
		}
	}	
	mobile.positionspatio.posX1 = mobilefactor[compteur] * mobile.r_part * (Math.cos(mobile.phi) / rmax) + (canvas.width / 2.);  // rmax pas mobile.rmax <-----  JPC
    mobile.positionspatio.posY1 = mobilefactor[compteur] * mobile.r_part * (Math.sin(mobile.phi) / rmax) + (canvas.height / 2.);  // rmax pas mobile.rmax <-----  JPC
	mobile.position.posX2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.cos(mobile.phi_obs) / rmax) + (canvas.width / 2.);  // rmax pas mobile.rmax <-----  JPC
    mobile.position.posY2 = mobilefactor[compteur] * mobile.r_part_obs * (Math.sin(mobile.phi_obs) / rmax) + (canvas.height / 2.);	// rmax pas mobile.rmax <-----  JPC
	
	
	if (element2.value != "mobile"){	
		V = Vr_obs(mobile.E,mobile.L,mobile.r_part_obs);
		data2 = [];
		data2.push({date: mobile.r_part_obs, close: V });
		if(mobile.point !== undefined){
			update_graphique_2(mobile.point,data2,mobile);
		}

	}else{
		V = Vr_mob(mobile.L,mobile.r_part);
		data2 = [];
		data2.push({date: mobile.r_part, close: V });
		if(mobile.point !== undefined){update_graphique_2(mobile.point,data2,mobile);}	
	}


    // pour éviter d'avoir des surprises sur le dernier calcul avant la fin
    if(mobile.r_part<0){  
      mobile.r_part=0;
    }


 //  Les différents "temps" et autres valeurs à afficher
	if (element2.value != "mobile"){  //observateur
		if(mobile.r_part_obs >= rs*1.000001){
			mobile.temps_particule =0; 
			mobile.temps_observateur_distant+= mobile.dtau;
			document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3);
			document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part_obs.toExponential(3);
			document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3);
			document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_2_obs.toExponential(3);
			document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_2_obs.toExponential(3);
			document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(8);
			document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3); //ManonGeneralisation
			
		} else {
				mobile.temps_observateur_distant += mobile.dtau;
				mobile.r_part_obs=rs;
				vr_2_obs=c ; vp_2_obs=0 ; vtotal=c ;
				document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3);
				document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(8); 
				document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part_obs.toExponential(3);
				document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_2_obs.toExponential(3);
				document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_2_obs.toExponential(3); 
				document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3); //ManonGeneralisation

		}
	}
	else{  //photon
	
		if (mobile.r_part>0){
			mobile.temps_particule+=0;
			//document.getElementById("ga"+compteur.toString()).innerHTML = '';
			document.getElementById("tp"+compteur.toString()).innerHTML = mobile.temps_particule.toExponential(3);
			document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = vr_2.toExponential(3);
            document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = vp_2.toExponential(3);
			document.getElementById("v_tot"+compteur.toString()).innerHTML = vtotal.toExponential(8);
		    document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part.toExponential(3);
			document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3); //ManonGeneralisation
			
			if(mobile.r_part<=rs){
				document.getElementById("v_tot"+compteur.toString()).innerHTML ="";
				document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML = "";
				document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML = "";
				document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3); //ManonGeneralisation
			}
		} 
		else {
			mobile.r_part=0;
			document.getElementById("ga"+compteur.toString()).innerHTML = '';
			document.getElementById("r_par"+compteur.toString()).innerHTML = mobile.r_part.toExponential(3);
			if(mobile.L!=0) { 
				document.getElementById("vp_sc_mas"+compteur.toString()).innerHTML="";
				document.getElementById("vr_sc_mas"+compteur.toString()).innerHTML="";  
			}
			document.getElementById("distance_parcourue"+compteur.toString()).innerHTML=mobile.distance_parcourue_totale.toExponential(3); //ManonGeneralisation				
      	}  
	}
	
	
	if (element2.value == "mobile"){
	if(mobile.r_part > rs*1.00001) {
		mobile.temps_observateur_distant+=mobile.dtau; 
	}else{

		mobile.temps_observateur_distant=1/0;	} 
		document.getElementById("to"+compteur.toString()).innerHTML = mobile.temps_observateur_distant.toExponential(3);}
	
	

  	}  //fin r0!=0
}  // fin fonction animate

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

// -------------------------------------{fonction rungekutta}--------------------------------------------
 
function rungekutta(L,h, r, A) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_Schwarzchild_photon(L,r);
	k[1] = derivee_seconde_Schwarzchild_photon(L,r + 0.5 * h * A);
	k[2] = derivee_seconde_Schwarzchild_photon(L,r + 0.5 * h * A + 0.25 * h * h * k[0]);
	k[3] = derivee_seconde_Schwarzchild_photon(L,r + h * A + 0.5 * h * h * k[1]);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
}

// -------------------------------------{fonction rungekutta_obs}--------------------------------------------
			  
function rungekutta_obs(E,L,h, r, A) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_Schwarzchild_photon_obs(E,L,r);
	k[1] = derivee_seconde_Schwarzchild_photon_obs(E,L,r + 0.5 * h * A);
	k[2] = derivee_seconde_Schwarzchild_photon_obs(E,L,r + 0.5 * h * A + 0.25 * h * h * k[0]);
	k[3] = derivee_seconde_Schwarzchild_photon_obs(E,L,r + h * A + 0.5 * h * h * k[1]);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
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
		//clearInterval(mobile.myInterval);
	} 
    else if(mobile.peuxonrelancer) {
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

// -------------------------------------{fonction commandes}--------------------------------------------

function commandes(){
	var texte = o_recupereJson();
	alert(texte.pages_trajectoire.commandes_horsSchwarMassif);
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

// Empeche le lancer si on part de l'interieur de l'horizon et si le rayon est négatif
function test_inte() {
	var texte = o_recupereJson();
	
	c = 299792458;
	G = 6.6742 * Math.pow(10, -11);
	M = Number(document.getElementById("M").value);
	r_phy = Number(document.getElementById("r_phy").value);
	m = G * M / Math.pow(c, 2); 
	rs=2*m;
	
	var onebol=false;
	var twobol=false;
	var threebol=false;
	var fourbol=false;


	var nbrdefuseestestinte = Number(document.getElementById("nombredefusees").value);
	for (countetttt = 1; countetttt <= nbrdefuseestestinte; countetttt += 1) {
		var r0testinte = Number(document.getElementById("r0"+countetttt.toString()+"").value); 
		var vrtestinte = vphi; 
		var vphitestinte = vr; 
		if(r0testinte<0){
			onebol=true;
		}
		if(r0testinte<=rs){
			twobol=true;
		}
		if(r0testinte<r_phy){
			threebol=true;
		}
		if(vrtestinte==0 && vphitestinte==0){
			fourbol=true;
		}
  }

	//le arret ici va etre appeler sans l'argument mobile et donc va crasher mais ce n'est pas grave, on ne veux pas lancer la simulation. 
	var texte = o_recupereJson();
	if (r_phy < 0 || onebol) {
		alert(texte.pages_trajectoire.rayon_neg);
		arret();
	} else if (r_phy <= rs && r_phy!=0)   {
		alert(texte.pages_trajectoire.rayonPhyInfHorz);
		arret();
	} else if (twobol) {
		alert(texte.pages_trajectoire.rayonHorzInfRayonSchw);
		arret();
	} else if(threebol){
		alert(texte.pages_trajectoire.lancerInterdit);
		arret();
	}
	if(fourbol) {
		alert(texte.pages_trajectoire.vitesses_initiales_nulles);
		arret();
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

// -------------------------------------{fonction foncPourZoomPlusAvantLancement}--------------------------------------------

function foncPourZoomPlusAvantLancement(){
	
		factGlobalAvecClef = factGlobalAvecClef*1.2;
		nzoom+=1;
		ns_avant_lancement+=1;
		document.getElementById('nzoomtxt').innerHTML= "nz="+ nzoom.toString();
		canvasAvantLancement();
	
}

// -------------------------------------{fonction foncPourZoomMoinsAvantLancement}--------------------------------------------

function foncPourZoomMoinsAvantLancement(){
	
		factGlobalAvecClef = factGlobalAvecClef/1.2;
		nzoom-=1;
		ns_avant_lancement-=1;
		document.getElementById('nzoomtxt').innerHTML= "nz="+ nzoom.toString();
		canvasAvantLancement();
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

// -------------------------------------{recuperation}--------------------------------------------

function recuperation(){
	if(document.getElementById('trace_present').value!="true"){
		load_schwarshild_photon();
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