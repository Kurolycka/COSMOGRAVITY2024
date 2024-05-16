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
var input=0;//si on entre rien dans l'entrée nzoom 
var compteurVitesseAvantLancement = 0;
var distance_parcourue_totale=0; //Manon

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

//khaled a ajouté ça pour les graphiques
const couleur_grahique_bleu='#0078CE'; 
const couleur_grahique_mauve='#AF40EA'; 
const couleur_grahique_vert='#17B350'; 
const couleur_grahique_rouge='#FF344F';
const couleur_grahique_jaune='#F6EB1B'; 



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


																											
			   
				

function testnum(a){
	for (var i = -30; i < 30; i++) {
		resu=a/(10**i);
		if (resu >=1 && resu <=10){ z=i; return z;}
	}
}
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

function initialisation(){
	c = 299792458;
	G = 6.67385 * Math.pow(10, -11);
	r0 = Number(document.getElementById("r0").value);
	M = Number(document.getElementById("M").value);
	//vphi = Number(document.getElementById("vphi").value); 
	//vr = Number(document.getElementById("vr").value);
	teta = Number(document.getElementById("teta").value); //angle de la vitess

	phi0=Number(document.getElementById("phi0").value);  // angle de départ
	phi0=phi0*Math.PI/180;



	J = Number(document.getElementById("J").value);
	a = J / (c * M);
	m = G * M / Math.pow(c, 2); //moitié du rayon de Schwarzchild
	rs = 2 * G * M / Math.pow(c, 2);
	
	vr=c*Math.cos(teta*Math.PI/180)*Math.sqrt(delta(r0)/(r0*(r0-rs)));
	vphi=c*Math.sin(teta*Math.PI/180)*r0/Math.sqrt(delta(r0));
	if(teta==180){vphi=0;}
	if(teta==90){vr=0;}
	rh = G * M / Math.pow(c, 2) * (1 + Math.sqrt(1 - Math.pow(J * c / (G * M * M), 2))); //rayon de Kerr
	rhp = 0.5 * ( (2 * G * M / Math.pow(c, 2)) + Math.sqrt(Math.pow( (2 * G * M / Math.pow(c, 2)), 2) - 4 * Math.pow( (J / (c * M)) , 2)));     //RH+
	rhm = 0.5 * ( (2 * G * M / Math.pow(c, 2)) - Math.sqrt(Math.pow( (2 * G * M / Math.pow(c, 2)), 2) - 4 * Math.pow( (J / (c * M)) , 2)));     //RH-
	gravSurface = 0.5 * Math.pow(c, 2) * (Math.pow(rhp, 2) - Math.pow(a, 2)) / (Math.pow(rhp, 2) + Math.pow(a, 2))*rhp; 			//gravité de surface Kerr
	
	E = (vr * vr * (r0 - rs) * Math.pow(r0, 3) + Math.pow(delta(r0), 2) * vphi * vphi) / (delta(r0) * Math.pow(c * r0, 2));
	E=Math.sqrt(Math.abs(E));
	L = (delta(r0) * vphi / c - rs * a * E) / (r0 - rs);

	textegravetetc_Kerr();				   
	document.getElementById("a").innerHTML = a.toExponential(3);
	document.getElementById("m").innerHTML = rs.toExponential(3);
	document.getElementById("L").innerHTML = L.toExponential(3);
	document.getElementById("E").innerHTML = E.toExponential(3);

	if (isNaN(rhp)){document.getElementById("rhp").innerHTML = 0;}
	else {  document.getElementById("rhp").innerHTML = rhp.toExponential(3);}

	if (isNaN(rhm)){document.getElementById("rhm").innerHTML = 0;}
	else { document.getElementById("rhm").innerHTML = rhm.toExponential(3);;}

	document.getElementById("gravS").innerHTML = gravSurface.toExponential(3);
	boutonAvantLancement();

}

function verifnbr() {
	r0 = document.getElementById("r0").value;
	vphi = document.getElementById("phi0").value;
	vr = document.getElementById("teta").value;
	M = document.getElementById("M").value;
	J = document.getElementById("J").value;

	
	if (isNaN(r0)){
		alert ("Veuillez vérifier vos saisie en r0");}
	if (isNaN(vr)){
		alert ("Veuillez vérifier vos saisie en Vr"); }
	if (isNaN(vphi)){
		alert ("Veuillez vérifier vos saisie en Vphi");  
	}
	if (isNaN(M)){
		alert ("Veuillez vérifier vos saisie en M");																						 							  																														  	  														   
	}
	if (isNaN(J)){
		alert ("Veuillez vérifier vos saisie en J");
	}						   
}


function trajectoire() {
	texte = o_recupereJson();
	if (pause || debut) {
		document.getElementById("tg2").style.display = "table";
		$("#grsvg_2").empty();
		document.getElementById("indic_calculs").innerHTML = texte.pages_trajectoire.calcul_encours;

		// pour rendre visible le panneau de contrôle pause et vitesse de la simu
		//document.getElementById("panneau_mobile").style.visibility='visible';

		//Pour rendre visible le paneau de zoom.
		//document.getElementById("panneau_mobile2").style.visibility='visible';
		estUnMobile();
		// permet de griser les cases de saisie pour éviter de changer les valeurs pendant la simulation
		// conseillé car toutes les exceptions ne sont pas gérées
		document.getElementById('M').disabled = true;
		document.getElementById('r0').disabled = true;
		document.getElementById('J').disabled = true;
		//document.getElementById('vphi').disabled = true;
		//document.getElementById('vr').disabled = true;
		document.getElementById('teta').disabled = true;
		document.getElementById('phi0').disabled = true;   

		//empecher de passer d'observateur a mobile ou inversement pendant la simulation
		document.getElementById('r3').disabled = true;
		document.getElementById('r4').disabled = true;
		// permet de controler si il y a un tracé ou non pour l'enregistrement
		document.getElementById('trace_present').value="1";
		pause = false;
		debut = false;
		scale_factor = 280;
		initialisation();
		//--------------------------------------------------------------------------------------//
		//Cette Partie traite le calcul de la trajectoire de la particule, dans son référentiel propre, et aussi dans celui de l'observateur//

		teta_spherique=Math.PI/2; //ajoute par khaled pour generaliser les coordonnees
		phi = phi0;
		phi_obs = phi0;
		temps_chute_libre = (Math.PI * r0 * Math.sqrt(r0 / (2 * G * M)) / 2);
		A_init = vr;
		r_init = r0;
		A_part = A_init;
		r_part = r_init;			 
		A_init_obs = vr*delta(r0)/( (Math.pow(r0,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r0)*E - rs*a*L/r0 );
		A_part_obs=A_init_obs;												
		r_init_obs = r0; r_part_obs=r_init_obs;					 
		vrobs=A_init_obs; vphiobs=vphi*(1-rs/r0)/E;
		//data1 = [];
		//data2 = [];
		temps_particule = 0;
		temps_observateur = 0;
		bool = true;
		confirme = false;
		// permet de gérer les touches du clavier pour certaines actions
		clavierEvenement();

    /* ----- */

    /* Calcul de rmax */
    calcul_rmax();
	
	element2=document.getElementById('traject_type2');


     	dtau= 1e-3*rmax/c ;
	
	
    /*L'enjeu ici est donc de calculer pour chaque itérations les coordonnées de la particule x2_part y2_part, x2_obs y2_obs
    on a donc d'abord besoin de calculer r_part et r_obs par Runge-Kutta, puis d'en déduire le calucl de phi et phi2, le
    tout nous permettra donc de calculer x2 et y2 et les autres paramètres comme la force de marée en chaque point de la trajectoire
    */

	x1part = scale_factor * Math.sqrt(r0**2+a**2) * Math.cos(phi)*Math.sin(teta_spherique) / rmax;
	y1part = scale_factor * Math.sqrt(r0**2+a**2) * Math.sin(phi)*Math.sin(teta_spherique) / rmax;
	x1obs = scale_factor * Math.sqrt(r0**2+a**2) * Math.cos(phi_obs)*Math.sin(teta_spherique) / rmax;
	y1obs = scale_factor * Math.sqrt(r0**2+a**2) * Math.sin(phi_obs)*Math.sin(teta_spherique) / rmax;


    canvas = document.getElementById("myCanvas");
    if (!canvas) {
		alert(texte.pages_trajectoire.impossible_canvas);
		return;
    }

    context = canvas.getContext("2d");
    if (!context) {
		alert(texte.pages_trajectoire.impossible_context);
		return;
    }

    canvas22 = document.getElementById("myCanvas22");
    if (!canvas22) {
		alert(texte.pages_trajectoire.impossible_canvas);
		return;
    }

    context22 = canvas22.getContext("2d");
    if (!context22) {
		alert(texte.pages_trajectoire.impossible_context);
		return;

    }

    majFondFixe();
    majFondFixe22();

    diametre_particule = DIAMETRE_PART;

    // La position de départ est le milieu de la fenêtre d'affichage auquel on ajoute la position initiale de la particule.

    posX1 = (canvas.width / 2.0) + x1part;  
    posY1 = (canvas.height / 2.0) + y1part;
	//si jamais vous trouver des lignes comme ça pour "pos" en commentaire c'est Khaled qui l'a fait 
	//Car ce ne sert pas à grand chose dans trajectoire() vu que ça se renouvele dans animate()

    posX2 = (canvas.width / 2.0) + x1obs;
    posY2 = (canvas.height / 2.0) + y1obs;
																		 

    posX3 = (canvas.width / 2.0);
    posY3 = (canvas.height / 2.0);

    // Ici on va créer l'animation avec setinerval, laquelle prend comme paramètres la fonction animate() définie ci-après et qui calcul les coordonnées de la particule à chaque instant.

    // les dtau1 et 2 permettent de contenir le dtau pour obtenir une simulation hors controle
    // à voir, l'utilisation du settimeout à la place de setinterval. Ca permettrait de remplacer le 10/6 par une variable dt_simu pouvant être modifiée à la place du pas dtau utilisé dans rungekutta
    // lorsqu'on est dans le setinterval, il est impossible ce modifier ce 10/6 par une variable qu'on pourrait incrémenter. Il utilise la valeur initiale avant l'entrée dans setinterval
    myInterval = setInterval(animate, 1000 / 300);
   // var Dtau1 = 1e8*temps_chute_libre ;
   // var Dtau2 = temps_chute_libre / 1e8;
     Dtau1 = 1e8 * dtau;  
    Dtau2 = dtau/1e8 ; 
    document.getElementById('bouton_pause').addEventListener('click', function() {
    	pausee();
    }, false);

	document.getElementById('plusvite').removeEventListener('click',foncPourVitAvantLancement,false)

	document.getElementById('moinsvite').removeEventListener('click',foncPourVitAvantLancement,false)


    document.getElementById('plusvite').addEventListener('click', function() {
		if (dtau >= Dtau1) {
			dtau = Dtau1;
      	} 
	 	else {
			dtau += dtau;
			clicks += 1 ;
      	}
		  document.getElementById('nsimtxt').innerHTML= "ns="+ clicks.toString();

    }, false);

    document.getElementById('moinsvite').addEventListener('click', function() {
	    if (dtau <= Dtau2) {
        	dtau = Dtau2;
        } 
        else {					   
          	dtau /= 2;
	        clicks -= 1 ;  }
			document.getElementById('nsimtxt').innerHTML= "ns="+ clicks.toString();

    }, false);

	if(compteurVitesseAvantLancement>=0){
		for(i=0;i<compteurVitesseAvantLancement;i++){
			if (dtau >= Dtau1) {
				dtau = Dtau1;
			} 
			else {
				dtau += dtau;
				clicks += 1 ;
			}
		}
	}
	else{
		for(i=0;i>compteurVitesseAvantLancement;i--){
			if (dtau <= Dtau2) {
				dtau = Dtau2;
			} else {
				dtau /= 2;
				clicks -= 1 ;
			}
		}
	}

	if(Number.isInteger(input))
			{
				if(input>0){
				scale_factor*= math.pow(1.2,input);	
				}
				else{
				scale_factor/=math.pow(1.2,-input);	;
				}
			}

			/*posX1 = scale_factor * Math.sqrt(r_part **2+a**2) * (Math.sin(teta_spherique) * Math.cos(phi) / rmax) + (canvas.width / 2); //khaled
			posY1 = scale_factor * Math.sqrt(r_part **2+a**2) * (Math.sin(teta_spherique) *Math.sin(phi) / rmax) + (canvas.height / 2);
			posX2 = scale_factor * Math.sqrt(r_part_obs**2+a**2)* (Math.sin(teta_spherique) *Math.cos(phi_obs) / rmax) + (canvas.width / 2);
			posY2 = scale_factor * Math.sqrt(r_part_obs**2+a**2) * (Math.sin(teta_spherique) *Math.sin(phi_obs) / rmax) + (canvas.height / 2);*/


	document.getElementById('moinszoom').removeEventListener('click',foncPourZoomMoinsAvantLancement, false);

	document.getElementById('pluszoom').removeEventListener('click',foncPourZoomPlusAvantLancement, false);

	document.getElementById('moinszoom').addEventListener('click', function() {
        scale_factor /= 1.2;
        /*posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2);
        posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2);
        posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2);
        posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2);
        */
	    majFondFixe22();																				   
        rafraichir2();
		input-=1;
		document.getElementById('nzoomtxt').innerHTML= "nz="+ input.toString();
		
    }, false);

    document.getElementById('pluszoom').addEventListener('click', function() {
        scale_factor *= 1.2;
        /*posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2);
        posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2);
		posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2);
        posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2);
        */majFondFixe22();																				  
        rafraichir2();
		input+=1;
		document.getElementById('nzoomtxt').innerHTML= "nz="+ input.toString();
    }, false);

    document.getElementById('initialiser').addEventListener('click', function() {
    //majEchelle();
		scale_factor =280 ;
		/*posX1 = scale_factor * r_part * (Math.cos(phi) / rmax) + (canvas.width / 2);
		posY1 = scale_factor * r_part * (Math.sin(phi) / rmax) + (canvas.height / 2);
		posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2);
		posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2);	
		*/
		majFondFixe22();																			   
		rafraichir2();
        input=0;
		document.getElementById('nzoomtxt').innerHTML= "nz="+ input.toString();
    }, false);
	
    function rafraichir2() {
		majFondFixe();
		creation_blocs(context); 
	}
	//Pour ouvrir le pop up qui nous si on veut afficher le graphe de potentiel ou pas
	function CentrerPopPotentiel() {
		document.getElementById("bloc_resultats").style.display= "block";
		var node = document.getElementById('grsvg_2');
		if (node.parentNode){
			node.parentNode.removeChild(node);
		}
	}
	if (document.getElementById("toggle").checked==false) {
		CentrerPopPotentiel();
	}
    //Ici le bout de code pour le bouton Reset, quand on clique dessus, la fonction appelé efface le canvas en entier.
    document.getElementById('clear').addEventListener('click', function() {location.reload();}, false);

    // Tracé du Rayon de Schwarzchild.
    context.fill();
    creation_blocs(context);

    $(document.params.traj[0]).change(function() {
		// Tracé du Rayon de Schwarzchild si on change en cours de simulation
		creation_blocs(context);
    });

	

	element2=document.getElementById('traject_type2');												  
															
//  on trace le graphe du potentiel
		setInterval(function(){  	// <----------------------------------
	  $('#grsvg_2').empty();  // <------------------------													   
    data1=[];
    data2=[];

	if (element2.value != "mobile"){  //observateur
			   
								   

    dr=r_part_obs*0.6/50;
		
	for (r = 0.7*r_part_obs; r < 1.3*r_part_obs ; r += dr) { 
      V = Vr_obs(r) ;
      data1.push({date: r,close: V});
    	}

		V = Vr_obs(r_part_obs);
		data2.push({date: r_part_obs,close: V});
		graphique_creation_pot();  
	
	}else{  // spationaute
		
		dr=r_part*0.6/50;
		
  	  for (r = 0.7*r_part; r < 1.3*r_part ; r += dr) { 
      V = Vr_mob(r) ;
      data1.push({date: r,close: V});  	
		}
		V = Vr_mob(r_part);
		data2.push({date: r_part,close: V}); 
		graphique_creation_pot();
	} 
	   },300);	 
		

   } else {															 
    
        myInterval = setInterval(animate, 10 / 6);		  
    }  //  fin if(pause....
	document.getElementById("pause/resume").addEventListener("click", function() {
        pausee()}); 
	// apres start on affiche le bouton pause/resume avec la fonction pausee
	document.getElementById('start').style.display = "none";
	document.getElementById('pause/resume').style.display ="inline-block";
	//infobulle de reset	
	document.getElementById("clear").title = texte.pages_trajectoire.bouton_stop_bulleInfo;
	
  }  // fin fonction trajectoire


// tracé de la particule

function animate() {
    onestarrete=0;
    estUnMobile();
    element = document.getElementById('traject_type');
    choixTrajectoire();
    element2=document.getElementById('traject_type2');

    if (r0 != 0.0) {
		if (element2.value != "mobile"){
			val_obs = rungekutta_obs(dtau, r_part_obs, A_part_obs);
			r_part_obs = val_obs[0];
			varphi_obs = c *dtau* ( rs*a*E/r_part_obs + (1-rs/r_part_obs)*L )/( (Math.pow(r_part_obs,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r_part_obs)*E - rs*a*L/r_part_obs ); 
			phi_obs=phi_obs+varphi_obs;
			if(r_part_obs<rhp*1.001) { r_part_obs=rhp;}
			A_part_obs = val_obs[1];
			resulta=calculs.MK_vitess(E,L,a,r_part_obs,rs,true);
			vtot=resulta[0];
			vr_3_obs=resulta[1]*Math.sign(A_part_obs);
			if(r_part_obs<rhp*1.0001) { vr_3_obs=0;}
			vp_3_obs=resulta[2]; // r_part_obs*varphi_obs/dtau;
			posX2 = scale_factor * r_part_obs * (Math.cos(phi_obs) / rmax) + (canvas.width / 2.);
			posY2 = scale_factor * r_part_obs * (Math.sin(phi_obs) / rmax) + (canvas.height / 2.);

			if(r_part_obs<rs){
				vtot=NaN
				vp_3_obs=NaN
				vr_3_obs=NaN
				distance_parcourue_totale=NaN //Manon
			}
		}
		else{
			varphi = c *dtau* ( rs*a*E/r_part + (1-rs/r_part)*L )/delta(r_part);
			phi = phi + varphi;
        	val = rungekutta(dtau, r_part, A_part);
        	r_part = val[0];
        	A_part = val[1];
			resulta=calculs.MK_vitess(E,L,a,r_part,rs,true);
			vtot=resulta[0];
			vr_3=resulta[1]*Math.sign(A_part);
        	vp_3=resulta[2];

			posX1 = scale_factor * Math.sqrt(r_part **2+a**2) * (Math.sin(teta_spherique) * Math.cos(phi) / rmax) + (canvas.width / 2); //khaled
			posY1 = scale_factor * Math.sqrt(r_part **2+a**2) * (Math.sin(teta_spherique) *Math.sin(phi) / rmax) + (canvas.height / 2);

			if(r_part<rs){
				vtot=NaN
				vp_3_obs=NaN
				vr_3_obs=NaN
				distance_parcourue_totale=NaN //Manon
			}

		}

        if (element2.value != "mobile"){	
			V = Vr_obs(r_part_obs);
			data2 = [];
			data2.push({date: r_part_obs, close: V });
			update_graphique_2();
        }
		else{
			V = Vr_mob(r_part);
			data2 = [];
			data2.push({date: r_part, close: V });
			update_graphique_2();		
        }									

        if(r_part<=0){ r_part=0;}				   
                        
    //Tracé de la particule

        if (element2.value != "mobile"){
			if (r_part_obs >= rhp){
				context.beginPath();
				context.fillStyle = COULEUR_NOIR;
				context.rect(posX2, posY2, 1, 1);
				context.lineWidth = "1";
				context.fill();
				majFondFixe22();
				context22.beginPath();
				context22.fillStyle = COULEUR_BLEU;
				context22.arc(posX2, posY2 , 5, 0, Math.PI * 2);
				context22.lineWidth = "1";
				context22.fill();

			}
        }
		else{
			context.beginPath();
			context.fillStyle = COULEUR_ROUGE_COSMO;
			context.rect(posX1, posY1, 1, 1);
			context.lineWidth = "1";
			context.fill();
			majFondFixe22();
			context22.beginPath();
			context22.fillStyle = COULEUR_BLEU;
			if (r_part==0){context22.arc((canvas.width / 2.), (canvas.height / 2.) , 5, 0, Math.PI * 2);} //Manon
			else{ //Manon
				context22.arc(posX1, posY1 , 5, 0, Math.PI * 2);}//Manon
			context22.lineWidth = "1";
						
			context22.fill();

        }

    //console.log("r part et rhp",r_part,rhp);
    if(element2.value == "mobile"){
        if(r_part<=rhp && ! document.getElementById("depasser").checked){
                textesfinarret_kerrphoton();
                onestarrete=1;
                alert(texte.page_trajectoire_massive.particule_atteint_rh);
                arretkerr();
                peuxonrelancer=false;
        }	
    }

        // gradient d'accélération

		if (element2.value != "mobile"){
			gm = derivee_seconde_Kerr_photon_obs(r_part_obs);
			gmp = derivee_seconde_Kerr_photon_obs(r_part_obs + 1);
			fm = Math.abs(gm - gmp);
		}
		else{fm = 0;}

        if (element2.value != "mobile"){
            if(r_part_obs >= rhp){
                temps_particule=0;
				document.getElementById("tp").innerHTML = temps_particule.toExponential(3);
				//document.getElementById("ga").innerHTML = '';
				document.getElementById("r_par").innerHTML = r_part_obs.toExponential(3);
				document.getElementById("vrkp").innerHTML = vr_3_obs.toExponential(3);
				document.getElementById("vpkp").innerHTML = vp_3_obs.toExponential(3);
				document.getElementById("v_tot").innerHTML = vtot.toExponential(8);
				document.getElementById("distance_parcourue").innerHTML=distance_parcourue_totale.toExponential(3); //Manon
			}

			if(isNaN(vtot)){ //Manon
				var textou = o_recupereJson();
				document.getElementById("v_tot").innerHTML = textou.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("vrkp").innerHTML = textou.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("vpkp").innerHTML = textou.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("distance_parcourue").innerHTML = textou.page_trajectoire_photon_kerr.vitesse_pas_définie; //Manon
				}
        }
		else{    
            if (r_part>=0){
                temps_particule+=0;
                document.getElementById("tp").innerHTML = temps_particule.toExponential(3); 
                //document.getElementById("ga").innerHTML = '';
                document.getElementById("r_par").innerHTML = r_part.toExponential(3);
                document.getElementById("vrkp").innerHTML = vr_3.toExponential(3);
                if(J==0) {vp_3= c*L/r_part;}
                if(r_part<=rhp && J!=0) {vp_3=1/0;}
                document.getElementById("vpkp").innerHTML = vp_3.toExponential(3);
				document.getElementById("v_tot").innerHTML = vtot.toExponential(8);	
				console.log(vtot)
				
				document.getElementById("distance_parcourue").innerHTML=distance_parcourue_totale.toExponential(3); //Manon
				
            }

			if(isNaN(vtot)){ //Manon
				var textou = o_recupereJson();
				document.getElementById("v_tot").innerHTML = textou.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("vrkp").innerHTML = textou.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("vpkp").innerHTML = textou.page_trajectoire_photon_kerr.vitesse_pas_définie;
				document.getElementById("distance_parcourue").innerHTML = textou.page_trajectoire_photon_kerr.vitesse_pas_définie; //Manon
				}

        }


        if (element2.value != "mobile"){
            temps_observateur += dtau;
            document.getElementById("to").innerHTML = temps_observateur.toExponential(3);	
        }
		else{
            if(r_part > rhp) {
                temps_observateur+=dtau*( (Math.pow(r_part,2)+Math.pow(a,2)+rs*Math.pow(a,2)/r_part)*E - rs*a*L/r_part )/delta(r_part); 
            }
			else{ 
                temps_observateur=1/0;   //infini
            }
            document.getElementById("to").innerHTML = temps_observateur.toExponential(3);
        }
    }// fin r0!=0
}//  fin fonction animate

// Fonction pour garder les dernieres valeurs de vr et vphi au moment du pause.  
function testvaleur(x) {
	if (isNaN(x)) {
		return 'Not a Number!';
	}
	return x ;
}							
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
	
function rungekutta(h, r, A){
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_Kerr_photon(r);
	k[1] = derivee_seconde_Kerr_photon(r + 0.5 * h * A);
	k[2] = derivee_seconde_Kerr_photon(r + 0.5 * h * A + 0.25 * h * h * k[0]);
	k[3] = derivee_seconde_Kerr_photon(r + h * A + 0.5 * h * h * k[1]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3])
	r = r + h * A;
	return [r, A];
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
			  
function rungekutta_obs(h, r, A) {
	k = [0, 0, 0, 0];
	k[0] = derivee_seconde_Kerr_photon_obs(r);
	k[1] = derivee_seconde_Kerr_photon_obs(r + 0.5 * h * A);
	k[2] = derivee_seconde_Kerr_photon_obs(r + 0.5 * h * A + 0.25 * h * h * k[0]);
	k[3] = derivee_seconde_Kerr_photon_obs(r + h * A + 0.5 * h * h * k[1]);
	r = r + h * A + (1 / 6) * h * h * (k[0] + k[1] + k[2]);
	A = A + (h / 6) * (k[0] + 2 * (k[1] + k[2]) + k[3]);
	return [r, A];
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
			myInterval = setInterval(animate, 1000 / 300);
		}
	}
}

// permet de gérer les touches du clavier pour certaines actions
function clavierEvenement(){
	$(document).keyup(function(event) { // the event variable contains the key pressed
		if(event.which == 65) { // touche a
			$('#r1').click();
		}
		if(event.which == 90) { // touche z
			$('#r2').click();
		}
									
		if(event.which == 81) { // touche q
			$('#start').click();
		}
		if(event.which == 83) { // touche s
			$('#clear').click();
		}
		if(event.which == 68) { // touche d
			$('#boutton_enregis').click();
		}
		if(event.which == 70) { // touche f
			$('#boutton_recup').click();
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
	});
}

function rafraichir() {
	window.location.reload(); 						   
	element2.value="non";
}


function siTrajectoireSimple() {
	if (element.value == 'simple') {
		majFondFixe();
		// Tracé du Rayon de Schwarzchild,...
		creation_blocs(context);
		diametre_particule = DIAMETRE_PART*2;
	}
}



function enregistrer(){
	// ces 2 fonctions sont issues des biblios saveSvgAsPng.js et canvas-to-image.js
	var texte = o_recupereJson();

	if(document.getElementById('trace_present').value=="1") {
		var nomFichier = prompt(texte.pages_trajectoire.message_nomFichier, "traject_Kerr_B_P");

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





function traceEstAbsent(){
	document.getElementById('trace_present').value="0";
}

function siTrajectoireComplete() {
	if (element.value == 'complete') {
		diametre_particule = DIAMETRE_PART;
	}
}

function choixTrajectoire() {
	siTrajectoireSimple();
	siTrajectoireComplete();
}

function estUnMobile(){
	var x = window.matchMedia("(max-width: 960px)")
	if(x.matches){
		document.getElementById("bouton_info").style.visibility='hidden';
	}
	else{
		document.getElementById("bouton_info").style.visibility='visible';
	}
}

function commandes(){
	var texte = o_recupereJson();
	alert(texte.pages_trajectoire.commandes_horsSchwarMassif);
}

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
	//console.log(canvas.width, canvas.height);
}

function majFondFixe3(){
	context3.clearRect(0, 0, canvas.width, canvas.height);
	//console.log(canvas.width, canvas.height);
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
	if(vr==0 && vphi==0) {	
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
	save_kerr_photon();
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
		//dans ce qui suit Khaled a modifié tout les rayons des cercles pour adapter aux coordonnées utilisés (chercher posX1)

		context.beginPath();
		context.setLineDash([]);
		context.fillStyle = couleur_grahique_jaune;//COULEUR_ERGOS;
		context.arc((canvas.width / 2.0), (canvas.height / 2.0), ((scale_factor * Math.sqrt(rs**2+a**2) / rmax)), 0, Math.PI * 2);
		context.fill();
		context.beginPath();
		context.setLineDash([5, 5]);
		context.arc((canvas.width / 2.0), (canvas.height / 2.0), ((scale_factor * Math.sqrt(rhp**2+a**2) / rmax)), 0, Math.PI * 2);
		context.fillStyle = 'white';
		context.fill();
		context.beginPath();
		context.setLineDash([5, 5]);
		context.arc((canvas.width / 2.0), (canvas.height / 2.0), ((scale_factor * Math.sqrt(rhp**2+a**2) / rmax)), 0, Math.PI * 2);
		context.strokeStyle = COULEUR_RS;
		context.stroke();
		// tracé de RH- en bleue
		context.strokeStyle = couleur_grahique_vert;
		context.beginPath()
		var posX3 = (canvas.width / 2.0);
		var posY3 = (canvas.height / 2.0);
		context.setLineDash([5, 5]);

		context.arc(posX3, posY3, (Math.sqrt(rhm**2+a**2)* scale_factor)/rmax, 0, 2 * Math.PI);
		context.stroke();
		// tracé de RH+ en rouge
		context.strokeStyle = couleur_grahique_rouge;
		context.beginPath();
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, (Math.sqrt(rhp**2+a**2) * scale_factor)/rmax, 0, 2 * Math.PI);
		context.stroke();
		context.closePath();
		context.closePath();
		context.strokeStyle = couleur_grahique_bleu;
		context.beginPath();
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, (Math.sqrt(rs**2+a**2) * scale_factor)/rmax, 0, 2 * Math.PI);
		context.stroke();
		context.closePath();
		context.closePath();

		//khaled a rajouté ça pour dessiner un cercle de rayon a
		context.strokeStyle = couleur_grahique_mauve;
		context.beginPath();
		context.setLineDash([5, 5]);
		context.arc(posX3, posY3, (Math.sqrt(a**2+a**2) * scale_factor)/rmax, 0, 2 * Math.PI);
		context.stroke();
		context.closePath();
		context.closePath();
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
	
	function foncPourZoomPlusAvantLancement(){
		
			input +=1
			document.getElementById('nzoomtxt').innerHTML= "nz="+ input.toString();
		
	}
	
	function foncPourZoomMoinsAvantLancement(){
		
			input -= 1
			document.getElementById('nzoomtxt').innerHTML= "nz="+ input.toString();
	}
	
	function foncPourVitAvantLancement(accelerer){
		if(accelerer.currentTarget.myParam){
			compteurVitesseAvantLancement += 1
		}
		else{
			compteurVitesseAvantLancement -= 1
		}
		document.getElementById('nsimtxt').innerHTML= "ns="+ compteurVitesseAvantLancement.toString();

	}
	