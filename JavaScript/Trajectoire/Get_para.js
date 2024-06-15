/*
		Fonctions gerant la sauvegarde de l'experience passee
*/

function save_nbfusees() {
	savenbfusees = document.getElementById("nombre_de_fusees_input").value;
	sessionStorage.setItem("nombre_de_fusees_input", savenbfusees);
	//console.log(sessionStorage.getItem("nombre_de_fusees_input"),"log");
}


function save_nbfusees_recupvaleurs() {
	savenbfuseesrecupvaleurs = document.getElementById("nombre_de_fusees_input").value;
	sessionStorage.setItem("nombredefuseesrecupvaleurs", savenbfuseesrecupvaleurs);
    //console.log(sessionStorage.getItem("nombredefuseesrecupvaleurs"),"second log");
}

function save_schwarshild_massif(nbrderockets) {
	// recuperation des variables de la page simulation
	r_phy = document.getElementById("rayon_phy_input").value;
	M = document.getElementById("masse_input").value;
	boutton_ammorti = document.getElementById("boutton_ammorti").value;
	reb = document.getElementById("reb").value;
	traject_type = document.getElementById("traject_type").value;
	traject_type2 = document.getElementById("traject_type2").value;
	temps_allumage = document.getElementById("temps_allumage").value; //ManonV3
	puissance_reacteur = document.getElementById("puissance_reacteur").value; //ManonV3

	var graph_check = true;
	if (document.getElementById("toggle").checked == false) {
		graph_check = false;
	}

	for (count = 1; count <= nbrderockets; count += 1) {
		r0 = document.getElementById("r0"+count.toString()+"").value;
		v0 = document.getElementById("v0"+count.toString()+"").value;
		phi0= document.getElementById("phi0"+count.toString()+"").value;
		teta = document.getElementById("teta"+count.toString()+"").value;
		sessionStorage.setItem("r0"+count.toString()+"", r0);
		sessionStorage.setItem("v0"+count.toString()+"", v0);
		sessionStorage.setItem("phi0"+count.toString()+"", phi0);
		sessionStorage.setItem("teta"+count.toString()+"", teta);
		
	}

	// Stockage des valeurs
	sessionStorage.setItem("rayon_phy_input", r_phy);
	sessionStorage.setItem("masse_input", M);
	sessionStorage.setItem("boutton_ammorti", boutton_ammorti);
	sessionStorage.setItem("reb", reb);
	sessionStorage.setItem("traject_type", traject_type);
	sessionStorage.setItem("traject_type2", traject_type2);
	sessionStorage.setItem("graph_check", graph_check);
	sessionStorage.setItem("temps_allumage", temps_allumage); //ManonV3
	sessionStorage.setItem("puissance_reacteur", puissance_reacteur); //ManonV3

}

function load_schwarshild_massif() {

	if (sessionStorage.getItem("nombredefuseesrecupvaleurs")){
		var nbfuseesrecupvaldesession = sessionStorage.getItem("nombredefuseesrecupvaleurs");
		nbrderockets= nbfuseesrecupvaldesession;
		//console.log(nbfuseesrecupvaldesession,"nombre de fusees recuperees valeur session");
		document.getElementById("nombre_de_fusees_input").value = sessionStorage.getItem("nombredefuseesrecupvaleurs");
	}
	supprHtml();
	genereHtml();
	save_nbfusees();
	updatenbredefusees();

	if (sessionStorage.getItem("r01")) {
		for (count = 1; count <= nbrderockets; count += 1) {
			document.getElementById("r0"+count.toString()+"").value=sessionStorage.getItem("r0"+count.toString()+"");
			document.getElementById("v0"+count.toString()+"").value=sessionStorage.getItem("v0"+count.toString()+"");
			document.getElementById("phi0"+count.toString()+"").value=sessionStorage.getItem("phi0"+count.toString()+"");
			document.getElementById("teta"+count.toString()+"").value=sessionStorage.getItem("teta"+count.toString()+"");
		}

		document.getElementById("rayon_phy_input").value = sessionStorage.getItem("rayon_phy_input");
		document.getElementById("masse_input").value = sessionStorage.getItem("masse_input");
		document.getElementById("boutton_ammorti").value = sessionStorage.getItem("boutton_ammorti");
		document.getElementById("reb").value = sessionStorage.getItem("reb");
		document.getElementById("traject_type").value = sessionStorage.getItem("traject_type");
		document.getElementById("traject_type2").value = sessionStorage.getItem("traject_type2");
		document.getElementById("temps_allumage").value = sessionStorage.getItem("temps_allumage"); //ManonV3
		document.getElementById("puissance_reacteur").value = sessionStorage.getItem("puissance_reacteur"); //ManonV3
		var graph_check = sessionStorage.getItem("graph_check");
		if (graph_check == "false") {
			document.getElementById("toggle").checked = false;
		}

		if (document.getElementById("traject_type").value == "simple") {
			pressionBouttonTrajectoireSimple();
		} else if (document.getElementById("traject_type").value == "complete") {
			pressionBouttonTrajectoireComplete();
		}
		if (document.getElementById("boutton_ammorti").value == "1") {
			document.getElementById("rebond").className = "myButton";
			document.getElementById("barre_reb").style.display = "block";
			document.getElementById('ammorti').innerHTML = document.getElementById("reb").value / 100;
		} 
		else if (document.getElementById("boutton_ammorti").value == "0") {
			document.getElementById("rebond").className = "myButton2";
			document.getElementById("barre_reb").style.display = "none";
			document.getElementById('ammorti').innerHTML = document.getElementById("reb").value / 100;
		}


		/*Pour savoir si on affiche ou pas le bouton de rebond dans le cas d'un trou noir */
		if (document.getElementById("rayon_phy_input").value == "0" || document.getElementById("rayon_phy_input").value == "" ) {document.getElementById("rebond").style.display="none";} 
		else{document.getElementById("rebond").style.display="inline";}

		var inputNbfusees = document.getElementById("nombre_de_fusees_input"); //manon
		var labelNbfusees = document.getElementById("labelnumberfusees"); //manon
		var labelTempsAllumage = document.getElementById("label_temps_allumage"); //ManonV3
		var inputTempsAllumage = document.getElementById("temps_allumage"); //ManonV3
		var labelPuissanceReacteur = document.getElementById("label_puissance_reacteur"); //ManonV3
		var inputPuissanceReacteur = document.getElementById("puissance_reacteur"); //ManonV3

		if (document.getElementById("traject_type2").value == "observateur") {
			pressionBouttonObservateur();
			inputNbfusees.style.display = "inline"; //manon
			labelNbfusees.style.display = "inline"; //manon
			labelTempsAllumage.style.display ="none"; //ManonV3
			inputTempsAllumage.style.display = "none"; //ManonV3
			labelPuissanceReacteur.style.display = "none"; //ManonV3
			inputPuissanceReacteur.style.display = "none"; //ManonV3
		} 
		else if (document.getElementById("traject_type2").value == "mobile") {
			pressionBouttonMobile();
			inputNbfusees.style.display = "none"; //manon
			labelNbfusees.style.display = "none"; //manon
			labelTempsAllumage.style.display = "inline"; //ManonV3
			inputTempsAllumage.style.display = "inline"; //ManonV3
			labelPuissanceReacteur.style.display = "inline"; //ManonV3
			inputPuissanceReacteur.style.display = "inline"; //ManonV3

		}

	
  	}
}





// CAS NON BARYONIQUE
function save_schwarshild_massif_nonBar(nbrderockets) {
	// recuperation des variables de la page simulation
	r_phy = document.getElementById("rayon_phy_input").value;
	M = document.getElementById("masse_input").value;
	traject_type = document.getElementById("traject_type").value;
	traject_type2 = document.getElementById("traject_type2").value;
	temps_allumage = document.getElementById("temps_allumage").value; //ManonV3
	puissance_reacteur = document.getElementById("puissance_reacteur").value; //ManonV3

	var graph_check = true;
	if (document.getElementById("toggle").checked == false) {
		graph_check = false;
	}

	for (count = 1; count <= nbrderockets; count += 1) {
		r0 = document.getElementById("r0"+count.toString()+"").value;
		v0= document.getElementById("v0"+count.toString()+"").value;
		teta = document.getElementById("teta"+count.toString()+"").value;
		phi0 = document.getElementById("phi0"+count.toString()+"").value;
		sessionStorage.setItem("r0"+count.toString()+"", r0);
		sessionStorage.setItem("v0"+count.toString()+"", v0 );
		sessionStorage.setItem("teta"+count.toString()+"", teta);
		sessionStorage.setItem("phi0"+count.toString()+"", phi0);
	}

	// Stockage des valeurs
	sessionStorage.setItem("rayon_phy_input", r_phy);
	sessionStorage.setItem("masse_input", M);
	sessionStorage.setItem("traject_type", traject_type);
	sessionStorage.setItem("traject_type2", traject_type2);
	sessionStorage.setItem("graph_check", graph_check);
	sessionStorage.setItem("temps_allumage", temps_allumage); //ManonV3
	sessionStorage.setItem("puissance_reacteur", puissance_reacteur); //ManonV3

}

function save_schwarshild_photon_nonBar(nbrderockets) {
	// recuperation des variables de la page simulation
	r_phy = document.getElementById("rayon_phy_input").value;
	M = document.getElementById("masse_input").value;
	traject_type = document.getElementById("traject_type").value;
	traject_type2 = document.getElementById("traject_type2").value;
	var graph_check = true;
	if (document.getElementById("toggle").checked == false) {
		graph_check = false;
	}
	for (count = 1; count <= nbrderockets; count += 1) {
		r0 = document.getElementById("r0"+count.toString()+"").value;
		teta = document.getElementById("teta"+count.toString()+"").value;
		phi0 = document.getElementById("phi0"+count.toString()+"").value;
		sessionStorage.setItem("r0"+count.toString()+"", r0);
		sessionStorage.setItem("teta"+count.toString()+"", teta);
		sessionStorage.setItem("phi0"+count.toString()+"", phi0);
	}
	// Stockage des valeurs
	sessionStorage.setItem("rayon_phy_input", r_phy);
	sessionStorage.setItem("masse_input", M);
	sessionStorage.setItem("traject_type", traject_type);
	sessionStorage.setItem("traject_type2", traject_type2)
	sessionStorage.setItem("graph_check", graph_check);
}


function save_schwarshild_photon(nbrderockets) {
	// recuperation des variables de la page simulation
	boutton_ammorti = document.getElementById("boutton_ammorti").value;
	r_phy = document.getElementById("rayon_phy_input").value;
	M = document.getElementById("masse_input").value;
	traject_type = document.getElementById("traject_type").value;
	traject_type2 = document.getElementById("traject_type2").value;
	var graph_check = true;
	if (document.getElementById("toggle").checked == false) {
		graph_check = false;
	}
	for (count = 1; count <= nbrderockets; count += 1) {
		r0 = document.getElementById("r0"+count.toString()+"").value;
		teta = document.getElementById("teta"+count.toString()+"").value;
		phi = document.getElementById("phi0"+count.toString()+"").value;
		sessionStorage.setItem("r0"+count.toString()+"", r0);
		sessionStorage.setItem("teta"+count.toString()+"", teta);
		sessionStorage.setItem("phi0"+count.toString()+"", phi);
	}
	// Stockage des valeurs
	sessionStorage.setItem("rayon_phy_input", r_phy);
	sessionStorage.setItem("masse_input", M);
	sessionStorage.setItem("traject_type", traject_type);
	sessionStorage.setItem("traject_type2", traject_type2)
	sessionStorage.setItem("graph_check", graph_check);
	sessionStorage.setItem("boutton_ammorti", boutton_ammorti);

}


function load_schwarshild_massif_nonBar() {

	if (sessionStorage.getItem("nombredefuseesrecupvaleurs")){
		var nbfuseesrecupvaldesession = sessionStorage.getItem("nombredefuseesrecupvaleurs");
		nbrderockets= nbfuseesrecupvaldesession;
		//console.log(nbfuseesrecupvaldesession,"nombre de fusees recuperees valeur session");
		document.getElementById("nombre_de_fusees_input").value = sessionStorage.getItem("nombredefuseesrecupvaleurs");
	}

	supprHtml();
	genereHtml();
	save_nbfusees();
	updatenbredefusees();

  	if (sessionStorage.getItem("r01")) {
		for (count = 1; count <= nbrderockets; count += 1) {
			document.getElementById("r0"+count.toString()+"").value=sessionStorage.getItem("r0"+count.toString()+"");
			document.getElementById("v0"+count.toString()+"").value=sessionStorage.getItem("v0"+count.toString()+"");
			document.getElementById("teta"+count.toString()+"").value=sessionStorage.getItem("teta"+count.toString()+"");
			document.getElementById("phi0"+count.toString()+"").value=sessionStorage.getItem("phi0"+count.toString()+"");
		}

		document.getElementById("rayon_phy_input").value = sessionStorage.getItem("rayon_phy_input");
		document.getElementById("masse_input").value = sessionStorage.getItem("masse_input");
		document.getElementById("traject_type").value = sessionStorage.getItem("traject_type");
		document.getElementById("traject_type2").value = sessionStorage.getItem("traject_type2");
		document.getElementById("temps_allumage").value = sessionStorage.getItem("temps_allumage"); //ManonV3
		document.getElementById("puissance_reacteur").value = sessionStorage.getItem("puissance_reacteur"); //ManonV3

		var graph_check = sessionStorage.getItem("graph_check");
		if (graph_check == "false") {
			document.getElementById("toggle").checked = false;
		}

		if (document.getElementById("traject_type").value == "simple") {
			pressionBouttonTrajectoireSimple();
    	} 
		else if (document.getElementById("traject_type").value == "complete") {
			pressionBouttonTrajectoireComplete();
		}


		var inputNbfusees = document.getElementById("nombre_de_fusees_input"); //manon
		var labelNbfusees = document.getElementById("labelnumberfusees"); //manon

		if (document.getElementById("traject_type2").value == "observateur") {
			pressionBouttonObservateur();
			inputNbfusees.style.display = "inline"; //manon
			labelNbfusees.style.display = "inline"; //manon
		} 
		else if (document.getElementById("traject_type2").value == "mobile") {
			pressionBouttonMobile();
			inputNbfusees.style.display = "none"; //manon
			labelNbfusees.style.display = "none"; //manon
		}

		var inputNbfusees = document.getElementById("nombre_de_fusees_input"); //manon
		var labelNbfusees = document.getElementById("labelnumberfusees"); //manon
		var labelTempsAllumage = document.getElementById("label_temps_allumage"); //ManonV3
		var inputTempsAllumage = document.getElementById("temps_allumage"); //ManonV3
		var labelPuissanceReacteur = document.getElementById("label_puissance_reacteur"); //ManonV3
		var inputPuissanceReacteur = document.getElementById("puissance_reacteur"); //ManonV3

		if (document.getElementById("traject_type2").value == "observateur") {
			pressionBouttonObservateur();
			inputNbfusees.style.display = "inline"; //manon
			labelNbfusees.style.display = "inline"; //manon
			labelTempsAllumage.style.display ="none"; //ManonV3
			inputTempsAllumage.style.display = "none"; //ManonV3
			labelPuissanceReacteur.style.display = "none"; //ManonV3
			inputPuissanceReacteur.style.display = "none"; //ManonV3
		} 
		else if (document.getElementById("traject_type2").value == "mobile") {
			pressionBouttonMobile();
			inputNbfusees.style.display = "none"; //manon
			labelNbfusees.style.display = "none"; //manon
			labelTempsAllumage.style.display = "inline"; //ManonV3
			inputTempsAllumage.style.display = "inline"; //ManonV3
			labelPuissanceReacteur.style.display = "inline"; //ManonV3
			inputPuissanceReacteur.style.display = "inline"; //ManonV3

		}

  	}
}

function load_schwarshild_photon() {
 
   if (sessionStorage.getItem("nombredefuseesrecupvaleurs")){
		var nbfuseesrecupvaldesession = sessionStorage.getItem("nombredefuseesrecupvaleurs");
		nbrderockets= nbfuseesrecupvaldesession;
		//console.log(nbfuseesrecupvaldesession,"nombre de fusees recuperees valeur session");
		document.getElementById("nombre_de_fusees_input").value = sessionStorage.getItem("nombredefuseesrecupvaleurs");
	}

	supprHtml();
	genereHtml();
	save_nbfusees();
	updatenbredefusees();

	if (sessionStorage.getItem("r01")) {
		for (count = 1; count <= nbrderockets; count += 1) {
			document.getElementById("r0"+count.toString()+"").value=sessionStorage.getItem("r0"+count.toString()+"");
			//document.getElementById("v0"+count.toString()+"").value=sessionStorage.getItem("v0"+count.toString()+"");
			document.getElementById("teta"+count.toString()+"").value=sessionStorage.getItem("teta"+count.toString()+"");
			document.getElementById("phi0"+count.toString()+"").value=sessionStorage.getItem("phi0"+count.toString()+"");
		}
		document.getElementById("rayon_phy_input").value = sessionStorage.getItem("rayon_phy_input");
		document.getElementById("masse_input").value = sessionStorage.getItem("masse_input");
		document.getElementById("boutton_ammorti").value = sessionStorage.getItem("boutton_ammorti");
		document.getElementById("traject_type").value = sessionStorage.getItem("traject_type");
		document.getElementById("traject_type2").value = sessionStorage.getItem("traject_type2");
		var graph_check = sessionStorage.getItem("graph_check");
		if (graph_check == "false") {
			document.getElementById("toggle").checked = false;
		}

		if (document.getElementById("traject_type").value == "simple") {
			pressionBouttonTrajectoireSimple();
		} else if (document.getElementById("traject_type").value == "complete") {
			pressionBouttonTrajectoireComplete();
		}

		var inputNbfusees = document.getElementById("nombre_de_fusees_input"); //manon
		var labelNbfusees = document.getElementById("labelnumberfusees"); //manon

		if (document.getElementById("traject_type2").value == "observateur") {
			pressionBouttonObservateur();
			inputNbfusees.style.display = "inline"; //manon
			labelNbfusees.style.display = "inline"; //manon
		} else if (document.getElementById("traject_type2").value == "mobile") {
			pressionBouttonMobile();
			inputNbfusees.style.display = "none"; //manon
			labelNbfusees.style.display = "none"; //manon

		}

		if (document.getElementById("boutton_ammorti").value == "1") {
			document.getElementById("rebond").className = "myButton";
		} 
		else if (document.getElementById("boutton_ammorti").value == "0") {
			document.getElementById("rebond").className = "myButton2";
		}

		/*Pour savoir si on affiche ou pas le bouton de rebond dans le cas d'un trou noir */
		if (document.getElementById("rayon_phy_input").value == "0" || document.getElementById("rayon_phy_input").value == "" ) {document.getElementById("rebond").style.display="none";} 
		else{document.getElementById("rebond").style.display="inline";}
	}
}

function load_schwarshild_photon_nonBar() {
	if (sessionStorage.getItem("nombredefuseesrecupvaleurs")){
		var nbfuseesrecupvaldesession = sessionStorage.getItem("nombredefuseesrecupvaleurs");
		nbrderockets= nbfuseesrecupvaldesession;
		//console.log(nbfuseesrecupvaldesession,"nombre de fusees recuperees valeur session");
		document.getElementById("nombre_de_fusees_input").value = sessionStorage.getItem("nombredefuseesrecupvaleurs");
	}

	supprHtml();
	genereHtml();
	save_nbfusees();
	updatenbredefusees();

  	if (sessionStorage.getItem("r01")) {
		for (count = 1; count <= nbrderockets; count += 1) {
			document.getElementById("r0"+count.toString()+"").value=sessionStorage.getItem("r0"+count.toString()+"");
			//document.getElementById("v0"+count.toString()+"").value=sessionStorage.getItem("v0"+count.toString()+"");
			document.getElementById("teta"+count.toString()+"").value=sessionStorage.getItem("teta"+count.toString()+"");
			document.getElementById("phi0"+count.toString()+"").value=sessionStorage.getItem("phi0"+count.toString()+"");
		}

		document.getElementById("rayon_phy_input").value = sessionStorage.getItem("rayon_phy_input");
		document.getElementById("masse_input").value = sessionStorage.getItem("masse_input");
		document.getElementById("traject_type").value = sessionStorage.getItem("traject_type");
		document.getElementById("traject_type2").value = sessionStorage.getItem("traject_type2");
		var graph_check = sessionStorage.getItem("graph_check");
		if (graph_check == "false") {
			document.getElementById("toggle").checked = false;
		}

		if (document.getElementById("traject_type").value == "simple") {
			pressionBouttonTrajectoireSimple();
		} 
		else if (document.getElementById("traject_type").value == "complete") {
			pressionBouttonTrajectoireComplete();
		}

		var inputNbfusees = document.getElementById("nombre_de_fusees_input"); //manon
		var labelNbfusees = document.getElementById("labelnumberfusees"); //manon

		if (document.getElementById("traject_type2").value == "observateur") {
			pressionBouttonObservateur();
			inputNbfusees.style.display = "inline"; //manon
			labelNbfusees.style.display = "inline"; //manon
		} else if (document.getElementById("traject_type2").value == "mobile") {
			pressionBouttonMobile();
			inputNbfusees.style.display = "none"; //manon
			labelNbfusees.style.display = "none"; //manon

		}
	}
}

// CAS METRIQUE DE KERR
function save_kerr_massif() {
	// recuperation des variables de la page simulation
	r0 = document.getElementById("r0").value;
	J = document.getElementById("J").value;
	M = document.getElementById("masse_input").value;
	v0= document.getElementById("v0").value;
	teta = document.getElementById("teta").value;
	phi0 = document.getElementById("phi0").value;
	traject_type = document.getElementById("traject_type").value;
	traject_type2 = document.getElementById("traject_type2").value;
	temps_allumage = document.getElementById("temps_allumage").value; //ManonV3
	puissance_reacteur = document.getElementById("puissance_reacteur").value; //ManonV3

	var graph_check = true;
	if (document.getElementById("toggle").checked == false) {
		graph_check = false;
	}

	// Stockage des valeurs
	sessionStorage.setItem("r0", r0);
	sessionStorage.setItem("J", J);
	sessionStorage.setItem("v0", v0);
	sessionStorage.setItem("teta", teta);
	sessionStorage.setItem("phi0", phi0);
	sessionStorage.setItem("masse_input", M);
	sessionStorage.setItem("traject_type", traject_type);
	sessionStorage.setItem("traject_type2", traject_type2)
	sessionStorage.setItem("graph_check", graph_check);
	sessionStorage.setItem("temps_allumage", temps_allumage); //ManonV3
	sessionStorage.setItem("puissance_reacteur", puissance_reacteur); //ManonV3

}

function load_kerr_massif() {
	if (sessionStorage.getItem("r0")) {
		document.getElementById("r0").value = sessionStorage.getItem("r0");
		document.getElementById("J").value = sessionStorage.getItem("J");
		document.getElementById("masse_input").value = sessionStorage.getItem("masse_input");
		document.getElementById("v0").value = sessionStorage.getItem("v0");
		document.getElementById("teta").value = sessionStorage.getItem("teta");
		document.getElementById("phi0").value = sessionStorage.getItem("phi0");
		document.getElementById("traject_type").value = sessionStorage.getItem("traject_type");
		document.getElementById("traject_type2").value = sessionStorage.getItem("traject_type2");
		document.getElementById("temps_allumage").value = sessionStorage.getItem("temps_allumage"); //ManonV3
		document.getElementById("puissance_reacteur").value = sessionStorage.getItem("puissance_reacteur"); //ManonV3

		var graph_check = sessionStorage.getItem("graph_check");
		if (graph_check == "false") {
			document.getElementById("toggle").checked = false;
		}

		if (document.getElementById("traject_type").value == "simple") {
			pressionBouttonTrajectoireSimple();
		} else if (document.getElementById("traject_type").value == "complete") {
			pressionBouttonTrajectoireComplete();
		}

		var labelTempsAllumage = document.getElementById("label_temps_allumage"); //ManonV3
		var inputTempsAllumage = document.getElementById("temps_allumage"); //ManonV3
		var labelPuissanceReacteur = document.getElementById("label_puissance_reacteur"); //ManonV3
		var inputPuissanceReacteur = document.getElementById("puissance_reacteur"); //ManonV3

		if (document.getElementById("traject_type2").value == "observateur") {
			pressionBouttonObservateur();
			labelTempsAllumage.style.display ="none"; //ManonV3
			inputTempsAllumage.style.display = "none"; //ManonV3
			labelPuissanceReacteur.style.display = "none"; //ManonV3
			inputPuissanceReacteur.style.display = "none"; //ManonV3
		} 
		else if (document.getElementById("traject_type2").value == "mobile") {
			pressionBouttonMobile();
			labelTempsAllumage.style.display = "inline"; //ManonV3
			inputTempsAllumage.style.display = "inline"; //ManonV3
			labelPuissanceReacteur.style.display = "inline"; //ManonV3
			inputPuissanceReacteur.style.display = "inline"; //ManonV3

		}

	}
}

function save_kerr_photon() {
    // recuperation des variables de la page simulation
    r0 = document.getElementById("r0").value;
    J = document.getElementById("J").value;
    M = document.getElementById("masse_input").value;
	teta = document.getElementById("teta").value;
	phi0 = document.getElementById("phi0").value;
    traject_type = document.getElementById("traject_type").value;
    traject_type2 = document.getElementById("traject_type2").value;
    var graph_check = true;
    if (document.getElementById("toggle").checked == false) {
		graph_check = false;
    }

    // Stockage des valeurs
    sessionStorage.setItem("r0", r0);
    sessionStorage.setItem("J", J);
    sessionStorage.setItem("masse_input", M);
	sessionStorage.setItem("teta", teta);
	sessionStorage.setItem("phi0", phi0);
    sessionStorage.setItem("traject_type", traject_type);
    sessionStorage.setItem("traject_type2", traject_type2)
    sessionStorage.setItem("graph_check", graph_check);
}

function load_kerr_photon() {
	if (sessionStorage.getItem("r0")) {
		document.getElementById("r0").value = sessionStorage.getItem("r0");
		document.getElementById("J").value = sessionStorage.getItem("J");
		document.getElementById("masse_input").value = sessionStorage.getItem("masse_input");
		document.getElementById("teta").value = sessionStorage.getItem("teta");
		document.getElementById("phi0").value = sessionStorage.getItem("phi0");
		document.getElementById("traject_type").value = sessionStorage.getItem("traject_type");
		document.getElementById("traject_type2").value = sessionStorage.getItem("traject_type2");
		var graph_check = sessionStorage.getItem("graph_check");
		if (graph_check == "false") {
			document.getElementById("toggle").checked = false;
		}
		if (document.getElementById("traject_type").value == "simple") 
		{
			pressionBouttonTrajectoireSimple();
		}

		if (document.getElementById("traject_type2").value == "mobile") 
		{
			document.getElementById("r4").click(); //on clique sur le button du "mobile"(photon)
		}
	}
}
