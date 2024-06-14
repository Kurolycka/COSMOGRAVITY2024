
/**
 * fonction_integrale === Enoire_temps ==fonction_integrale_EN
 * 
 * 
 * 
 * 
 * 
 */


const ORDRE_ARRONDI=4;
const LUMIERE = 9460730472580800;  // une année lumière en mètres
const LUMIERE_INV= 1/LUMIERE;
var dz1
var dz2
var Hz1enannee
var Hz2enannee

function lance_calc() {
  chargement();
  //var calculDiamElement = document.getElementById("Calcul_Diam"); //afficher le box de calcul de diametre puisqu'il ne donne des resultat qu'apres cliquer sur le bouton calcule! 
  //calculDiamElement.style.display = "block";
  calculs +=1;

  setTimeout(calc_energie_noire, 100);
}

function messagebox(titre,message){
  Swal.fire({
  title: titre,
  text: message,
  background: '#f0f0f0',
  confirmButtonText: 'OK',
  confirmButtonColor: '#b54b3a',
width:  550,
  //height: 800,
  buttonsStyling: true,}
)}
// fonction utilisee pour le message d'avertissement
function recuperePuissance10(chiffre){
  var tampon=chiffre;
  tampon=Math.trunc(tampon);
  var puissance=0;
  if(tampon>=1){
    while(Number.isInteger(tampon)){
      tampon=tampon*Math.pow(10,-1);
      puissance++;
    }
    puissance--;
  }
  else if(tampon<1){
    while(!Number.isInteger(tampon)){
      tampon=tampon*Math.pow(10,1);
      puissance++;
    }
  }
  return puissance;
}

function avertissement() {
  var texte = o_recupereJson();
  var difference;

  
  // permet de faire une différence sur les puissances de 10 pour limiter la casse au niveau du temps de calcul
  difference=Math.abs(recuperePuissance10(z2)-recuperePuissance10(z1));
  // j'ai mis 13 car au delà, j'ai du temps de chargement
  if (difference>13){
    messagebox("Error",texte.page_univers_calculs.message_valeur_critique);
    z1 = NaN;
    z2 = NaN;
  }
}

function calc_energie_noire() {
	var texte = o_recupereJson();

	time_affiche = document.getElementById("resul_tps");
	time_affiche.style.display = "none";
	deb = new Date().getTime();
	fin = 0;

  
  //recuperation des valeurs
  c = Number(document.getElementById("c_p").value);
  G = Number(document.getElementById("G_p").value);
  h = Number(document.getElementById("h_p").value);
  k = Number(document.getElementById("k_p").value);
  typeannee = document.getElementById("typeannee").value;
  t0 = Number(document.getElementById("T0").value);
  h0 = Number(document.getElementById("H0").value);
  omegam0 = Number(document.getElementById("omegam0").value);
  omegaDE0 = Number(document.getElementById("omegaDE0").value);
  omegak0 = Number(document.getElementById("resultat_omegak0_annexes").innerHTML);
  Ie = Number(document.getElementById("i_e").value);
  
  document.getElementById("tempsEmission_alert").innerHTML = "";
  document.getElementById("tempsReception_alert").innerHTML = "";
  
  //Energie Noire
  w0 = Number(document.getElementById("omega0").value);
  w1 = Number(document.getElementById("omega1").value);


  //création d'une liste qui va prendre les résultats des calculs avant qu'elles soient arrondis
  arr = [];
  arr_bool = true;

  Or = 0;
  //definition du type d'annee
  if (typeannee == "Sidérale") {
    nbrjours = 365.256363051;
  } else if (typeannee == "Julienne") {
    nbrjours = 365.25;
  } else if (typeannee == "Tropique (2000)") {
    nbrjours = 365.242190517;
  } else {
    nbrjours = 365.2425;
  }
  au = 149597870700;
  H0parsec = h0 * 1000 / ((au * (180 * 3600)) / Math.PI * Math.pow(10, 6));
  H0enannee = H0parsec * (3600 * 24 * nbrjours);
  H0engannee = H0enannee * Math.pow(10, 9);
  a = document.getElementById("Orr");
  if (document.getElementById("resultat_omegar0_annexes").value=="Matière, Lambda, RFC et Neutrinos") {
    sigma = (2 * Math.pow(Math.PI, 5) * Math.pow(k, 4)) / (15 * Math.pow(h, 3) * Math.pow(c, 2));
    rho_r = (4 * sigma * Math.pow(t0, 4)) / (Math.pow(c, 3));
    Or = (8 * Math.PI * G * rho_r) / (3 * Math.pow(H0parsec, 2));
    Or = 1.6913 * Or;
    Or = Or.toExponential(3);
  } else if (document.getElementById("resultat_omegar0_annexes").value=="Matière, Lambda et RFC") {
    sigma = (2 * Math.pow(Math.PI, 5) * Math.pow(k, 4)) / (15 * Math.pow(h, 3) * Math.pow(c, 2));
    rho_r = (4 * sigma * Math.pow(t0, 4)) / (Math.pow(c, 3));
    Or = (8 * Math.PI * G * rho_r) / (3 * Math.pow(H0parsec, 2));
    Or = Or.toExponential(3);
  } else {
    Or = 0;
  }
  a.value = Or;
  a.innerHTML = Or;


//on recupere les valeurs de z1 et z2
z1 = Number(document.getElementById("z1").value);
z2 = Number(document.getElementById("z2").value);
  if (z1<=-1) {stop_spin();//Ce pour arrêter le GIF spin à côté du bouton calcule
return messagebox(texte.page_univers_calculs.message_z1_incorrect,"z1 >-1");}
if (z2<=-1) {stop_spin();
return messagebox(texte.page_univers_calculs.message_z2_incorrect,"z2 >-1");}
avertissement();


  // dm ........................................................................

  // permet de contourner le problème du dm (tend vers la même valeur sur l'infini)
  if(z1>1e13){
    zz1=1e13;
  }
  else{
    zz1 = z1;
  }
  if(z2>1e13){
    zz2=1e13;
  }
  else{
    zz2 = z2;
  }

  Eps = Number(0.0001);
  //calcul de h0 par secondes et par gigaannees

  if (omegak0 > 0) {
    integ_1 = Math.sqrt(Math.abs(omegak0)) * simpson_EN(0, Number(zz1), fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), Eps,w0,w1);
    dm1 = (c / (H0parsec * Math.sqrt(Math.abs(omegak0)))) * Math.sin(integ_1);

    integ_2 = Math.sqrt(Math.abs(omegak0)) * simpson_EN(0, Number(zz2), fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), Eps,w0,w1);
    dm2 = (c / (H0parsec * Math.sqrt(Math.abs(omegak0)))) * Math.sin(integ_2);

    integ_between = Math.sqrt(Math.abs(omegak0)) * simpson_EN(Number(z1), Number(z2), fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), Eps,w0,w1);
    dm = (c / (H0parsec * Math.sqrt(Math.abs(omegak0)))) * Math.sin(integ_between);

  } else if (omegak0 == 0) {

    dm1 = (c / (H0parsec) * simpson_EN(0, Number(zz1), fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), Eps,w0,w1));
    dm2 = (c / (H0parsec) * simpson_EN(0, Number(zz2), fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), Eps,w0,w1));
    dm = (c / (H0parsec) * simpson_EN(Number(z1), Number(z2), fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), Eps,w0,w1));

  } else {
    integ_1 = Math.sqrt(Math.abs(omegak0)) * simpson_EN(0, Number(zz1), fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), Eps,w0,w1);
    dm1 = (c / (H0parsec * Math.sqrt(Math.abs(omegak0)))) * Math.sinh(integ_1);

    integ_2 = Math.sqrt(Math.abs(omegak0)) * simpson_EN(0, Number(zz2), fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), Eps,w0,w1);
    dm2 = (c / (H0parsec * Math.sqrt(Math.abs(omegak0)))) * Math.sinh(integ_2);

    integ_between = Math.sqrt(Math.abs(omegak0)) * simpson_EN(Number(z1), Number(z2), fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), Eps,w0,w1);
    dm = (c / (H0parsec * Math.sqrt(Math.abs(omegak0)))) * Math.sinh(integ_between);
  }

  dda = dm1 / (1 + Number(z1));
  dl = dm * (1 + (z2 - z1));


  // TEMPS ................................................
  Eps = Number(0.001);

  // Calcul du temps de réception
  if (Number(z2) <= 1e12) {
    tempsReception = simpson_simple_degre2_EN(fonction_integrale_EN, Number(z2), omegam0, Number(omegaDE0), Number(Or),w0,w1);
  }

  else {
    // nécessaire car l'ordre 4 de E(x) est lié à Or, on prend donc l'ordre 3
    if (Or==0){
      tempsReception=2/(3*Math.pow(omegam0,1/2)*H0enannee*Math.pow(Number(z2)+1,3/2));
    }
    else{
      tempsReception = 1 / (Math.pow(1 + Number(z2), 2) * 2 * Math.pow(Or, 0.5) * H0enannee);
    }
  }
  if (isNaN(tempsReception)) {
    tempsReception = NaN;
  }

  // Calcul du temps d'émission
  if (Number(z1) <= 1e12) {
    tempsEmission = simpson_simple_degre2_EN(fonction_integrale_EN, Number(z1), omegam0, Number(omegaDE0), Number(Or),w0,w1);
  }

  else {
    // nécessaire car l'ordre 4 de E(x) est lié à Or, on prend donc l'ordre 3
    if (Or==0){
      tempsEmission=2/(3*Math.pow(omegam0,1/2)*H0enannee*Math.pow(Number(z1)+1,3/2));
    }
    else{
      tempsEmission = 1 / (Math.pow(1 + Number(z1), 2) * 2 * Math.pow(Or, 0.5) * H0enannee);
    }
  }

  if (isNaN(tempsEmission)) {
    tempsEmission = NaN;
  }

  tempsReception_sec = tempsReception *H0enannee / H0parsec; //<--------------------------
  tempsEmission_sec = tempsEmission *H0enannee / H0parsec; //<-----------------------

  // t2-t1

  // cas Lambda et Matiere avec des z>1e12
    if(Or==0 && (z1>=1e12 && z2>=1e12) ){
      agebetween=2/(3*Math.pow(omegam0,1/2)*H0enannee)*( Math.pow(Number(z2)+1,-3/2)
        -Math.pow(Number(z1)+1,-3/2) );
    }
  // formule analytique pour les cas hors Lambda et Matiere pour les z>1e12
    else if(Or!=0 && (z1>=1e12 && z2>=1e12) ){
    agebetween=(1/(2*Math.pow(Or,0.5)*H0enannee))*(Math.pow(1+Number(z2),-2)
        -Math.pow(1+Number(z1),-2));
    }
  // autres cas
    else{
    	agebetween=tempsReception-tempsEmission;
    }

    agebetween_sec=agebetween*H0enannee/H0parsec;

// z1
	Tz1 = t0 * (1 + Number(z1));
	Tz1 = Tz1.toExponential(8);
	Omz1 = omegam0 * Math.pow(1 + Number(z1), 3) / fonction_F(Number(z1), omegam0, Number(omegaDE0), Or,w0,w1);
	Omz1 = Omz1.toExponential(8);
	Olz1 = Number(omegaDE0/fonction_F(1/(1+z1)));
	Olz1 = Olz1.toExponential(8);
	Orz1 = Or * Math.pow(1 + Number(z1), 4) / fonction_F(Number(z1), omegam0, Number(omegaDE0), Or,w0,w1);
	Orz1 = Orz1.toExponential(8);
	Okz1 = omegak0 * Math.pow(1 + Number(z1), 2) / fonction_F(Number(z1), omegam0, Number(omegaDE0), Or,w0,w1);
	Okz1 = Okz1.toExponential(8);
	Hz1 = h0 * Math.pow(fonction_F(Number(z1), omegam0, Number(omegaDE0), Or,w0,w1),0.5);
	Hz1 = Hz1.toExponential(8);

	ODEn1= Number(omegaDE0) * fonction_Y(1/(1+z1)) / fonction_F(1/(1+z1));
	ODEn1=ODEn1.toExponential(8);

//z2
	Tz2 = t0 * (1 + Number(z2));
	Tz2 = Tz2.toExponential(8);
	Omz2 = omegam0 * Math.pow(1 + Number(z2), 3) / fonction_F(Number(z2), omegam0, Number(omegaDE0), Or,w0,w1);
	Omz2 = Omz2.toExponential(8);
	Olz2 = Number(omegaDE0/fonction_F(1/(1+z2)));
	Olz2 = Olz2.toExponential(8);
	Orz2 = Or * Math.pow(1 + Number(z2), 4) / fonction_F(Number(z2), omegam0, Number(omegaDE0), Or,w0,w1);
	Orz2 = Orz2.toExponential(8);
	Okz2 = omegak0 * Math.pow(1 + Number(z2), 2) / fonction_F(Number(z2), omegam0, Number(omegaDE0), Or,w0,w1);
	Okz2 = Okz2.toExponential(8);
	Hz2 = h0 * Math.pow(fonction_F(Number(z2), omegam0, Number(omegaDE0), Or,w0,w1), 0.5);
	Hz2 = Hz2.toExponential(8);

	ODEn2= Number(omegaDE0) * fonction_Y(1/(1+z2)) / fonction_F(1/(1+z2));
	ODEn2=ODEn2.toExponential(8);

   //calcul de la distance du diametre apparent et distance lumiere(dm et photometrie)
  dda = dm1 / (1 + Number(z1));
  dda=dda.toExponential(8);

  dl = dm1 * (1 + (z1));
  dl=dl.toExponential(8);

  dda_2 = dm2 / (1+ Number(z2));
  dda_2=dda_2.toExponential(8);

  dl_2 = dm2 * (1+ Number(z2));
  dl_2=dl_2.toExponential(8);
  
  
  Le = 4 * pi() * Ie;
  Le=Le.toExponential(8);

  Ee = Le / (4 * pi() * Math.pow(dl,2));
  Ee=Ee.toExponential(8);
  
  Ee_2 = Le / (4* pi() * Math.pow(dl_2,2));
  Ee_2=Ee_2.toExponential(8);
 
  Eps = Number(0.001);

  Hz1enannee = (Hz1 * (1000 / ((au * (180 * 3600)) / Math.PI * Math.pow(10, 6))) *(3600 * 24 * nbrjours));
  Hz2enannee=  (Hz2 * (1000 / ((au * (180 * 3600)) / Math.PI * Math.pow(10, 6))) *(3600 * 24 * nbrjours));
	
	// dz1/t0 et dz2/t0
  dz1= (1+Number(z1))*H0enannee - Hz1enannee
  dz2= (1+Number(z2))*H0enannee - Hz2enannee
  



  
		

        document.getElementById("show_plot1").style.display = "contents";
        document.getElementById("show_plot2").style.display = "contents";
		document.getElementById("show_dl").style.display = "contents";
		document.getElementById("show_da").style.display = "contents";
		document.getElementById("show_dl_2").style.display = "contents";
		document.getElementById("show_da_2").style.display = "contents";
		document.getElementById("show_E_e").style.display = "contents";
		document.getElementById("show_E_e_2").style.display = "contents";
		document.getElementById("show_L_e").style.display = "contents";
		document.getElementById("show_dz1").style.display = "contents";
		document.getElementById("show_dz2").style.display = "contents";
		document.getElementById("show_mu_1").style.display = "contents";
		document.getElementById("show_mu_2").style.display = "contents";
  //les distances sont positives
  dm = Math.abs(dm);
	dm1 = Math.abs(dm1);
	dm2 = Math.abs(dm2);
	dda = Math.abs(dda);
	dl = Math.abs(dl);
	dda_2 = Math.abs(dda_2);
	dl_2 = Math.abs(dl_2);


  //En parsec 
  dm_pc = dm * 3.2407557442396 * Math.pow(10, -17);
 
	dm1_pc = dm1 * 3.2407557442396 * Math.pow(10, -17);
  
	dm2_pc = dm2 * 3.2407557442396 * Math.pow(10, -17);
  
	da_pc = dda * 3.2407557442396 * Math.pow(10, -17);
  da_pc =da_pc .toExponential(8);
	dl_pc = dl * 3.2407557442396 * Math.pow(10, -17);
  dl_pc =	dl_pc .toExponential(8);
	da2_pc = dda_2 * 3.2407557442396 * Math.pow(10, -17);
  da2_pc=da2_pc.toExponential(8);
	dl2_pc = dl_2 * 3.2407557442396 * Math.pow(10, -17);
  dl2_pc=dl2_pc.toExponential(8);

  //annÃ©es lumiÃ¨re
  lumie = 9460730472580800;
  dm1_lum = (dm1 / lumie);
  
  dm2_lum = (dm2 / lumie);
  
  dif_lum = (dm / lumie);
 
  da_lum = (dda / lumie);
  da_lum=da_lum.toExponential(8);
	dl_lum = (dl / lumie);
  dl_lum=dl_lum.toExponential(8);
	da2_lum = (dda_2 / lumie);
  da2_lum=da2_lum.toExponential(8);
	dl2_lum = (dl_2 / lumie);
  dl2_lum=dl2_lum.toExponential(8);

  	mu_1 = (-5 + 5* Math.log10(dl_pc)).toExponential(8)
	mu_2 = (-5 + 5* Math.log10(dl2_pc)).toExponential(8)


  arr.push(dm1, dm2, dm, dm1_pc, dm2_pc, dm_pc,da_pc, dl_pc, dm1_lum, dm2_lum, dif_lum, da_lum, dl_lum, tempsEmission, tempsReception, agebetween, tempsEmission_sec, tempsReception_sec, agebetween_sec);

  //on ajuste le nombre de decimale apres la virgule
  if (dm != 0) {
    dm = dm.toExponential(8);
  }
  if (dm1 != 0) {
    dm1 = dm1.toExponential(8);
  }
  if (dm2 != 0) {
    dm2 = dm2.toExponential(8);
  }
  if (dm_pc != 0) {
    dm_pc = dm_pc.toExponential(8);
  }
  if (dm1_pc != 0) {
    dm1_pc = dm1_pc.toExponential(8);
  }
  if (dm2_pc != 0) {
    dm2_pc = dm2_pc.toExponential(8);
  }
  if (dm1_lum != 0) {
    dm1_lum = dm1_lum.toExponential(8);
  }
  if (dm2_lum != 0) {
    dm2_lum = dm2_lum.toExponential(8);
  }
  if (dif_lum != 0) {
    dif_lum = dif_lum.toExponential(8);
  }

  if (agebetween != 0) {
    agebetween = agebetween.toExponential(8);
  }
  if (tempsReception != 0) {
    tempsReception = tempsReception.toExponential(8);
  }
  if (tempsEmission != 0) {
    tempsEmission = tempsEmission.toExponential(8);
  }
  if (agebetween_sec != 0) {
    agebetween_sec = agebetween_sec.toExponential(8);
  }
  if (tempsReception_sec != 0) {
    tempsReception_sec = tempsReception_sec.toExponential(8);
  }
  if (tempsEmission_sec != 0) {
    tempsEmission_sec = tempsEmission_sec.toExponential(8);
  }
  if (dz1 != 0) {
    dz1 = dz1.toExponential(8);
  } 
  if (dz2 != 0) {
    dz2 = dz2.toExponential(8);
  }

  //on change les champs pour informer l'utilisateur des resultats trouvÃ©s


  document.getElementById("dm").innerHTML = dm;
  document.getElementById("dm1").innerHTML = dm1;
  document.getElementById("dm2").innerHTML = dm2;
  document.getElementById("dm_pc").innerHTML = dm_pc;
  document.getElementById("dm1_pc").innerHTML = dm1_pc;
  document.getElementById("dm2_pc").innerHTML = dm2_pc;
  document.getElementById("dm1_lum").innerHTML = dm1_lum;
  document.getElementById("dm2_lum").innerHTML = dm2_lum;
  document.getElementById("dm_diff_lum").innerHTML = dif_lum;
  document.getElementById("agebetween").innerHTML = agebetween;
  document.getElementById("tempsReception").innerHTML = tempsReception;
  document.getElementById("tempsEmission").innerHTML = tempsEmission;
  document.getElementById("agebetween_sec").innerHTML = agebetween_sec;
  document.getElementById("tempsReception_sec").innerHTML = tempsReception_sec;
  document.getElementById("tempsEmission_sec").innerHTML = tempsEmission_sec;
  document.getElementById("dz1").innerHTML = dz1;
  document.getElementById("dz2").innerHTML = dz2;
  
  // en z1
  document.getElementById("Tz1").innerHTML = Tz1;
  document.getElementById("Omz1").innerHTML = Omz1;
  document.getElementById("Olz1").innerHTML = Olz1;
  document.getElementById("ODEn1").innerHTML = ODEn1;
  document.getElementById("Orz1").innerHTML = Orz1;
  document.getElementById("Okz1").innerHTML = Okz1;
  document.getElementById("Hz1").innerHTML = Hz1;
// en z2
  document.getElementById("Tz2").innerHTML = Tz2;
  document.getElementById("Omz2").innerHTML = Omz2;
  document.getElementById("Olz2").innerHTML = Olz2;
  document.getElementById("ODEn2").innerHTML = ODEn2;
  document.getElementById("Orz2").innerHTML = Orz2;
  document.getElementById("Okz2").innerHTML = Okz2;
  document.getElementById("Hz2").innerHTML = Hz2;

  
  // Photometrie

  document.getElementById("dm").innerHTML = dm;
	document.getElementById("dm1").innerHTML = dm1;
	document.getElementById("dm2").innerHTML = dm2;
	document.getElementById("dl").innerHTML = dl;
	document.getElementById("dda").innerHTML = dda;
	document.getElementById("dl_2").innerHTML = dl_2;
	document.getElementById("dda_2").innerHTML = dda_2;
  document.getElementById("L_e").innerHTML = Le;
	document.getElementById("E_e").innerHTML = Ee;
	document.getElementById("E_e_2").innerHTML = Ee_2;
	document.getElementById("mu_1").innerHTML = mu_1;
	document.getElementById("mu_2").innerHTML = mu_2;

  // Photometrie en parsec 

	document.getElementById("dm_pc").innerHTML = dm_pc;
	document.getElementById("dm1_pc").innerHTML = dm1_pc;
	document.getElementById("dm2_pc").innerHTML = dm2_pc;
	document.getElementById("dda_pc").innerHTML = da_pc;
	document.getElementById("dl_pc").innerHTML = dl_pc;
	document.getElementById("dda2_pc").innerHTML = da2_pc;
	document.getElementById("dl2_pc").innerHTML = dl2_pc;

  //Photometrie en années lumières

	document.getElementById("dm1_lum").innerHTML = dm1_lum;
	document.getElementById("dm2_lum").innerHTML = dm2_lum;
	document.getElementById("dm_diff_lum").innerHTML = dif_lum;
	document.getElementById("dda2_lum").innerHTML = da2_lum;
	document.getElementById("dl_lum").innerHTML = dl_lum;
	document.getElementById("dda_lum").innerHTML = da_lum;
	document.getElementById("dl2_lum").innerHTML = dl2_lum;

	


  fin = new Date().getTime() - deb;
  Chaine = "Le calcul a duré : " + fin + " millisecondes !";
  time_affiche.innerHTML = Chaine;
  time_affiche.style.display ="inline-block";
  stop_spin();

}

// ENERGIE Noire


function Enoire_norm(x, omegam0, omegaDE0, Or) {
  //omegak0 = 1 - Or - omegam0 - omegaDE0;
  omegak0 = Number(document.getElementById("resultat_omegak0_annexes").innerHTML);
  return (omegaDE0 * Ya(x) + omegak0 * (Math.pow((1. + x), 2)) + omegam0 * (Math.pow((1. + x), 3)) + Or * (Math.pow((1. + x), 4)));
}

function Enoire(x, omegam0, omegaDE0, Or) {
  omegak0 = 1 - Or - omegam0 - omegaDE0;
  return 1 / Math.pow((omegaDE0 * Ya(x) + omegak0 * (Math.pow((1. + x), 2)) + omegam0 * (Math.pow((1. + x), 3)) + Or * (Math.pow((1. + x), 4))), 1 / 2);

}

function Enoire_temps(x, omegam0, omegaDE0, Or) {
  return (1.0 / H0enannee) * Enoire(x, omegam0, omegaDE0, Or) / (1 + x);
}

function cv_Enoire_temps(l, omegam0, omegaDE0, Or) {
  x = initial_a + l / (1 - l);
  return Enoire_temps(x, omegam0, omegaDE0, Or) * 1 / Math.pow(1 - l, 2);

}


// Ya(x)

function Ya_a(x) {
  w0 = Number(document.getElementById("omega0").value);
  w1 = Number(document.getElementById("omega1").value);


  return Math.exp(-3 * (w1 + w0 + 1) * Math.log(x) - (3 * w1 * (1 - x)));
}

function Ya(x) {    
  w0 = Number(document.getElementById("omega0").value);
  w1 = Number(document.getElementById("omega1").value);

  return Math.exp(-3 * (w1 + w0 + 1) * Math.log(1 / (1 + x)) - (3 * w1 * (1 - (1 / (1 + x)))));
}

function arrondir() {
  if (arr.length == 0) {
    return 0;
  } else if (arr_bool == true) {
    if (document.documentElement.lang.localeCompare("en") == 0) {
      document.getElementById("arr").innerHTML = "Round up";
    } else {
      document.getElementById("arr").innerHTML = "Arrondir";
    }
    arr_bool = false;

    document.getElementById("dm1").innerHTML = arr[0];
    document.getElementById("dm2").innerHTML = arr[1];
    document.getElementById("dm").innerHTML = arr[2];
    document.getElementById("dm1_pc").innerHTML = arr[3];
    document.getElementById("dm2_pc").innerHTML = arr[4];
    document.getElementById("dm_pc").innerHTML = arr[5];
    document.getElementById("dm1_lum").innerHTML = arr[6];
    document.getElementById("dm2_lum").innerHTML = arr[7];
    document.getElementById("dm_diff_lum").innerHTML = arr[8];

    document.getElementById("tempsEmission").innerHTML = arr[9];
    document.getElementById("tempsReception").innerHTML = arr[10];
    document.getElementById("agebetween").innerHTML = arr[11];

    document.getElementById("tempsEmission_sec").innerHTML = arr[12];
    document.getElementById("tempsReception_sec").innerHTML = arr[13];
    document.getElementById("agebetween_sec").innerHTML = arr[14];

    // Parametres cosmologiaues en z1
    document.getElementById("Tz1").innerHTML = arr[15];
    document.getElementById("Omz1").innerHTML = arr[16];
    document.getElementById("Olz1").innerHTML = arr[17];
    document.getElementById("Orz1").innerHTML = arr[18];
    document.getElementById("Okz1").innerHTML = arr[19];
    document.getElementById("Hz1").innerHTML = arr[20];

   // Parametres cosmologiaues en z2
   document.getElementById("Tz2").innerHTML = arr[21];
   document.getElementById("Omz2").innerHTML = arr[22];
   document.getElementById("Olz2").innerHTML = arr[23];
   document.getElementById("Orz2").innerHTML = arr[24];
   document.getElementById("Okz2").innerHTML = arr[25];
   document.getElementById("Hz2").innerHTML = arr[26];
  
   // Photometrie en metre 

   document.getElementById("dl").innerHTML = arr[27];
	 document.getElementById("dda").innerHTML = arr[28];
	 document.getElementById("dl_2").innerHTML = arr[29];
	 document.getElementById("dda_2").innerHTML = arr[30];
   document.getElementById("L_e").innerHTML = arr[31];
	 document.getElementById("E_e").innerHTML = arr[32];
	 document.getElementById("E_e_2").innerHTML = arr[33];

   //Photometrie en parsec
 
   document.getElementById("dda_pc").innerHTML = arr[34];
   document.getElementById("dl_pc").innerHTML = arr[35];
	 document.getElementById("dda2_pc").innerHTML = arr[36];
	 document.getElementById("dl2_pc").innerHTML = arr[37];

   //Photometrie en années lumières 

   document.getElementById("dda2_lum").innerHTML = arr[38];
	 document.getElementById("dl_lum").innerHTML = arr[39];
	 document.getElementById("dda_lum").innerHTML = arr[40];
	 document.getElementById("dl2_lum").innerHTML = arr[41];



  } else {
    if (document.documentElement.lang.localeCompare("en") == 0) {
      document.getElementById("arr").innerHTML = "Undo Round up";
    } else {
      document.getElementById("arr").innerHTML = "Ne pas Arrondir";
    }
    arr_bool = true;

    document.getElementById("dm1").innerHTML = arr[0].toExponential(8);
    document.getElementById("dm2").innerHTML = arr[1].toExponential(8);
    document.getElementById("dm").innerHTML = arr[2].toExponential(8);
    document.getElementById("dm1_pc").innerHTML = arr[3].toExponential(8);
    document.getElementById("dm2_pc").innerHTML = arr[4].toExponential(8);
    document.getElementById("dm_pc").innerHTML = arr[5].toExponential(8);
    document.getElementById("dm1_lum").innerHTML = arr[6].toExponential(8);
    document.getElementById("dm2_lum").innerHTML = arr[7].toExponential(8);
    document.getElementById("dm_diff_lum").innerHTML = arr[8].toExponential(8);

    document.getElementById("tempsEmission").innerHTML = arr[9].toExponential(8);
    document.getElementById("tempsReception").innerHTML = arr[10].toExponential(8);
    document.getElementById("agebetween").innerHTML = arr[11].toExponential(8);

    document.getElementById("tempsEmission_sec").innerHTML = arr[12].toExponential(8);
    document.getElementById("tempsReception_sec").innerHTML = arr[13].toExponential(8);
    document.getElementById("agebetween_sec").innerHTML = arr[14].toExponential(8);

    // Parametres cosmologiaues en z1
    document.getElementById("Tz1").innerHTML = arr[15].toExponential(8);
    document.getElementById("Omz1").innerHTML = arr[16].toExponential(8);
    document.getElementById("Olz1").innerHTML = arr[17].toExponential(8);
    document.getElementById("Orz1").innerHTML = arr[18].toExponential(8);
    document.getElementById("Okz1").innerHTML = arr[19].toExponential(8);
    document.getElementById("Hz1").innerHTML = arr[20].toExponential(8);

   // Parametres cosmologiques en z2
   document.getElementById("Tz2").innerHTML = arr[21].toExponential(8);
   document.getElementById("Omz2").innerHTML = arr[22].toExponential(8);
   document.getElementById("Olz2").innerHTML = arr[23].toExponential(8);
   document.getElementById("Orz2").innerHTML = arr[24].toExponential(8);
   document.getElementById("Okz2").innerHTML = arr[25].toExponential(8);
   document.getElementById("Hz2").innerHTML = arr[26].toExponential(8);
  
   // Photometrie en metre 

   document.getElementById("dl").innerHTML = arr[27].toExponential(8);
	 document.getElementById("dda").innerHTML = arr[28].toExponential(8);
	 document.getElementById("dl_2").innerHTML = arr[29].toExponential(8);
	 document.getElementById("dda_2").innerHTML = arr[30].toExponential(8);
   document.getElementById("L_e").innerHTML = arr[31].toExponential(8);
	 document.getElementById("E_e").innerHTML = arr[32].toExponential(8);
	 document.getElementById("E_e_2").innerHTML = arr[33].toExponential(8);

   //Photometrie en parsec
 
   document.getElementById("dda_pc").innerHTML = arr[34].toExponential(8);
   document.getElementById("dl_pc").innerHTML = arr[35].toExponential(8);
	 document.getElementById("dda2_pc").innerHTML = arr[36].toExponential(8);
	 document.getElementById("dl2_pc").innerHTML = arr[37].toExponential(8);

   //Photometrie en années lumières 

   document.getElementById("dda2_lum").innerHTML = arr[38].toExponential(8);
	 document.getElementById("dl_lum").innerHTML = arr[39].toExponential(8);
	 document.getElementById("dda_lum").innerHTML = arr[40].toExponential(8);
	 document.getElementById("dl2_lum").innerHTML = arr[41].toExponential(8);
  }
}

function calculD() {
  var z1 = document.getElementById("z1_checkbox").checked;
  var z2 = document.getElementById("z2_checkbox").checked;

  if (z1 && dda !=0){
    window.document.getElementById("diametre").value = (window.document.getElementById("theta").value / 206265 * Number(dda)).toExponential(2);
  }
  else if(z2 && dda_2 !=0){
    window.document.getElementById("diametre").value = (window.document.getElementById("theta").value / 206265 * Number(dda_2)).toExponential(2);
  }
}
function calcul1Dkpc(){
	var z1 = document.getElementById("z1_checkbox").checked;
	var z2 = document.getElementById("z2_checkbox").checked;

	if (z1 && dda !=0){
		window.document.getElementById("diametrekpc").value = ((window.document.getElementById("theta").value /
			206265 * Number(dda))* 3.24079* Math.pow(10, -20)).toExponential(2);
	}
	else if(z2 && dda_2 !=0){
		window.document.getElementById("diametrekpc").value = ((window.document.getElementById("theta").value /
			206265 * Number(dda_2))*3.24079* Math.pow(10, -20)).toExponential(2);
	}
}

function calculthetakpc() {
	var z1 = document.getElementById("z1_checkbox").checked;
	var z2 = document.getElementById("z2_checkbox").checked;

	if (z1 && dda !=0){
		window.document.getElementById("theta").value = (206265 * (window.document.getElementById("diametrekpc").value*3.0856*Math.pow(10,19)) /
			Number(dda)).toExponential(2);
	}
	else if(z2 && dda_2 !=0){
		window.document.getElementById("theta").value = (206265 * (window.document.getElementById("diametrekpc").value*3.0856*Math.pow(10,19)) /
			Number(dda_2)).toExponential(2);
	}
}

function calcultheta() {
  var z1 = document.getElementById("z1_checkbox").checked;
  var z2 = document.getElementById("z2_checkbox").checked;
  if (z1 && dda !=0){
    window.document.getElementById("theta").value = (206265 * window.document.getElementById("diametre").value / Number(dda)).toExponential(2);
  }
  else if(z2 && dda_2 !=0){
    window.document.getElementById("theta").value = (206265 * window.document.getElementById("diametre").value / Number(dda_2)).toExponential(2);
  }
}

function onlyOne(checkbox) {
    var checkboxes = document.getElementsByName('z');
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false;
        window.document.getElementById("diametre").value = "";
        window.document.getElementById("theta").value = "";
    })
}
//



// fonctions des graphes ! 01/06/2023

function lance_calc2(path) {//Bon sang, quelle est cette ignominie
  calculs = calculs + 1; // je ne vois pas l'interet de ca !
  chargement();
  setTimeout(Tracer(path), 100);
}

function Tracer(path) {
  zmin = Number(document.getElementById("zmin").value);
	zmax = Number(document.getElementById("zmax").value);
	
  if (zmin<=-1 ){
    return messagebox(texte.page_univers_calculs.message_zmin_incorrect,"zmin >-1");}
  if (zmax<=-1 ){
    return messagebox(texte.page_univers_calculs.message_zmax_incorrect,"zmax >-1");}



	time_affiche = document.getElementById("resul_tps2");
	time_affiche.style.display = "none";
	deb = new Date().getTime();
	fin = 0;

  
	var texte = o_recupereJson();
	
	document.getElementById("tempsEmission_alert").innerHTML = "";
	document.getElementById("tempsReception_alert").innerHTML = "";

	//création d'une liste qui va prendre les résultats des calculs avant qu'ils soient arrondis
	arr = [];
  c = Number(document.getElementById("c_p").value);
  G = Number(document.getElementById("G_p").value);
  h = Number(document.getElementById("h_p").value);
  k = Number(document.getElementById("k_p").value);
  typeannee = document.getElementById("typeannee").value;
  t0 = Number(document.getElementById("T0").value);
  h0 = Number(document.getElementById("H0").value);
  omegam0 = Number(document.getElementById("omegam0").value);
  omegaDE0 = Number(document.getElementById("omegaDE0").value);
  omegak0 = Number(document.getElementById("resultat_omegak0_annexes").innerHTML);
  Ie = Number(document.getElementById("i_e").value);
  
  document.getElementById("tempsEmission_alert").innerHTML = "";
  document.getElementById("tempsReception_alert").innerHTML = "";

    //Energie Noire
	w0 = Number(document.getElementById("omega0").value);
	w1 = Number(document.getElementById("omega1").value);
  
	//recuperation des valeurs
  pas = Number(document.getElementById("pas_pour_z").value);

  
	var axeAbscicceEnZPlus1 = Boolean(false)
	if(zmin<0 || zmax<0){ //Seul cas de figure où l'on veut l'absicce en z+1 pour l'échelle logarithmique
		axeAbscicceEnZPlus1 = true
	}
	


	//definition du type d'annee
	nbrjours= nbJoursParAn();


	Eps = Number(0.001);

	//calcul de h0 par secondes et par gigaAnnees
	H0parsec = h0 * 1000 / ((au * (180 * 3600)) / Math.PI * Math.pow(10, 6));  //H0 en seconde moins 1

	H0enannee = H0parsec * (3600 * 24 * nbrjours);
	H0engannee = H0enannee * Math.pow(10, 9);
	Or = 0;
	if (document.getElementById("resultat_omegar0_annexes").value=="Matière, Lambda, RFC et Neutrinos") {
		sigma = (2 * Math.pow(Math.PI, 5) * Math.pow(k, 4)) / (15 * Math.pow(h, 3) * Math.pow(c, 2));
		rho_r = (4 * sigma * Math.pow(t0, 4)) / (Math.pow(c, 3));
		Or = (8 * Math.PI * G * rho_r) / (3 * Math.pow(H0parsec, 2));
		Or = 1.6913 * Or;
		Or = Or.toExponential(8);
	} else if (document.getElementById("resultat_omegar0_annexes").value=="Matière, Lambda et RFC") {
		sigma = (2 * Math.pow(Math.PI, 5) * Math.pow(k, 4)) / (15 * Math.pow(h, 3) * Math.pow(c, 2));
		rho_r = (4 * sigma * Math.pow(t0, 4)) / (Math.pow(c, 3));
		Or = (8 * Math.PI * G * rho_r) / (3 * Math.pow(H0parsec, 2));
		Or = Or.toExponential(8);
	} else {
		Or = 0;
	}
  //Display Results
	// modele sans big bang et sans big crunch
	modele=0;
	age_ans= simpson_simple_degre2_EN(fonction_integrale_EN, Number(0), Number(omegam0), Number(omegaDE0), Number(Or),w0,w1);  // age en annees ou bien NaN
	if(isNaN(age_ans)) {modele=1;}

	    if (path == 1 && modele==0) {

		titreAbscicce = "z" // peut changer si nécessaire(si : axeAbscicceEnZPlus1 = true)

		// Distance's charts in function of z
		d_checkbox = document.getElementById("d_checkbox");
		if(d_checkbox.checked) {
			document.getElementById("graph_container_log_d_z").style.display = "contents"; //display graph
			plot_title = "Échelle log d<sub>m</sub>  d<sub>L</sub>  d<sub>a</sub>  d<sub>LT</sub>"
			plot_type = 'log'

			var abscissa_d = log_scale(zmin, zmax, pas);  

			if(axeAbscicceEnZPlus1){//Ici on gère le cas où zmin est négatif 
				titreAbscicce = "z + 1"
			}

		}
		else{	
			document.getElementById("graph_container_d_z").style.display = "contents"; //display graph
			plot_title = "d<sub>m</sub>  d<sub>L</sub>  d<sub>a</sub>  d<sub>LT</sub>"
			plot_type = 'scatter'

			var abscissa_d = linear_scale(zmin, zmax, pas);  
		}


		let annots = [{xref: 'paper',yref: 'paper',x: 0.725,xanchor: 'right',y: 1,yanchor: 'bottom',
    text:'T<sub>0</sub>: '+t0.toExponential(3)+'   H<sub>0</sub>:'+h0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+omegam0.toExponential(3)+'   \Ω<sub>DE0</sub>:  '+omegaDE0+'   \Ω<sub>r0</sub>: ' +Or+'  \Ω<sub>k0</sub>:   '+omegak0.toExponential(3),
		showarrow: false}];		
		//console.log(abscissa_d)  ;
		let val_graph = calculDeDs_EN(abscissa_d);
		if(d_checkbox.checked && axeAbscicceEnZPlus1){	//gère le cas du décalage des absicces pour que tout tienne sur le graph quand on utilise l'échelle log
			for(i=0;i<val_graph[3].length;i++){//Dans val_graph[3] se trouve les z, les abscicces pour le tracé des graphes, on le décale ici
				val_graph[3][i] = abscissa_d[i] + 1
			}	
		}	
	
		let data = [
			{
				x: val_graph[3],
				y: val_graph[1],

				type: 'scatter',
				name: '<b>d<sub>a</sub><b>'
			},
			{
				x: val_graph[3],  
				y: val_graph[2],

				type: 'scatter',

				name: '<b>d<sub>m</sub><b>'
			},
			{
				x: val_graph[3],
				y: val_graph[0],

				type: 'scatter',

				name: '<b>d<sub>L</sub><b>'
			},
			{
				x: val_graph[3],
				y: val_graph[4],

				type: 'scatter',

				name: '<b>d<sub>LT</sub><b>'
			}
		];
		let layout = {  width: 1325 , height:450 , 

			title: "d<sub>m</sub>  d<sub>L</sub>  d<sub>a</sub>  d<sub>LT</sub>",

			title: plot_title,

			titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
			
			xaxis: {
				autorange: true,

				type : plot_type,

				title: titreAbscicce,
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},
	
			yaxis: {
				rangemode: 'tozero',
				autorange: true,

				type : "scatter",

				title: 'al',
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},
			annotations: annots,
		};


		if(d_checkbox.checked) {
			graphique_creation("graphique_log_d_z", ['graphique_log_d_z', data, layout, {displaylogo: false}]);
		}
		else{
			graphique_creation("graphique_d_z", ['graphique_d_z', data, layout, {displaylogo: false}]);
		}
		
	} else if (path == 2 && modele==0) {

		titreAbscicce = "z"
		// Omega's charts in function of z
		omega_checkbox = document.getElementById("omega_checkbox");
		if(omega_checkbox.checked) {
			document.getElementById("graph_container_log_omega_z").style.display = "contents"; //display graph
			plot_title = "Échelle log \Ω<sub>m</sub>  Ω<sub>DE</sub>  Ω<sub>r</sub>  Ω<sub>k</sub>";
			plot_type = 'log';
			
			var abscissa_omega = log_scale(zmin, zmax, pas);  

			if(axeAbscicceEnZPlus1){//Ici on gère le cas où zmin est négatif 
				titreAbscicce = "z + 1"
			}
		}
		else {
			document.getElementById("graph_container_omega_z").style.display = "contents"; //display graph
			plot_title = "\Ω<sub>m</sub>  Ω<sub>DE</sub>  Ω<sub>r</sub>  Ω<sub>k</sub>";
			plot_type = 'scatter';

			var abscissa_omega = linear_scale(zmin, zmax, pas);

		}

		

		let annots = [{xref: 'paper',
		yref: 'paper',
		x: 0.725,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text:'T<sub>0</sub>: '+t0.toExponential(3)+'   H<sub>0</sub>:'+h0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+omegam0.toExponential(3)+'   \Ω<sub>DE0</sub>:  '+omegaDE0+'   \Ω<sub>r0</sub>: ' +Or+'  \Ω<sub>k0</sub>:   '+omegak0.toExponential(3),
		showarrow: false}];
		let val_graph = calcul_omegas_EN(abscissa_omega);

		if(omega_checkbox.checked && axeAbscicceEnZPlus1){	//gère le cas du décalage des absicces pour que tout tienne sur le graph quand on utilise l'échelle log
			for(i=0;i<val_graph[4].length;i++){//Dans val_graph[4] se trouve les z, les abscicces pour le tracé des graphes, on le décale ici
				val_graph[4][i] = abscissa_omega[i] + 1
			}	
		}	


		let data = [
			{
				x: val_graph[4],
				y: val_graph[0],

				type: 'scatter',
				name: '<b>Ω<sub>m</sub><b>'
			},
			{
				x: val_graph[4],
				y: val_graph[1],

				type: 'scatter',

				name: '<b>Ω<sub>DE</sub><b>'
			},
			{
				x: val_graph[4],
				y: val_graph[2],

				type: 'scatter',

				name: '<b>Ω<sub>r</sub><b>'
			},
			{
				x: val_graph[4],
				y: val_graph[3],

				type: 'scatter',

				name: '<b>Ω<sub>k</sub><b>'
			}
		];
		let layout = {  width: 1325 , height:450 , 

			title: "\Ω<sub>m</sub>  Ω<sub>DE</sub>  Ω<sub>r</sub>  Ω<sub>k</sub>",

			title: plot_title,

			titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
	
			xaxis: {
				autorange: true,
				type : plot_type,
				title: titreAbscicce,
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},
	
			yaxis: {
				rangemode: 'tozero',
				autorange: true,

				title: '',

				type : "scatter",
				title: 'Paramètre de densité Ω<sub>i</sub>',
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},

				showline: true
			},
			annotations: annots,
		};

		if(omega_checkbox.checked) {
			graphique_creation("graphique_log_omega_z", ['graphique_log_omega_z', data, layout, {displaylogo: false}]);
		}
		else{
			graphique_creation("graphique_omega_z", ['graphique_omega_z', data, layout, {displaylogo: false}]);
		}

	} else if(path == 3 && modele==0){
		// Chart t(z)	
		titreAbscicce = "z"

		t_checkbox = document.getElementById("t_checkbox");				
		if(t_checkbox.checked) {
			document.getElementById("graph_container_log_t").style.display = "contents"; //display graph
			plot_title = "Échelle log t(z)"
			plot_type = 'log'

			var abscissa_t = log_scale(zmin, zmax, pas);
			
			if(axeAbscicceEnZPlus1){//Ici on gère le cas où zmin est négatif 
				titreAbscicce = "z + 1"
			}
		}
		else{
			document.getElementById("graph_container_t").style.display = "contents"; //display graph
			plot_title = "t(z)"
			plot_type = 'scatter'

			var abscissa_t = linear_scale(zmin, zmax, pas);
		}
	

		let annots = [{xref: 'paper',
		yref: 'paper',
		x: 0.725,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text: 'T<sub>0</sub>: '+t0.toExponential(3)+'   H<sub>0</sub>:'+h0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+omegam0.toExponential(3)+'   \Ω<sub>DE0</sub>:  '+omegaDE0+'   \Ω<sub>r0</sub>: ' +Or+'  \Ω<sub>k0</sub>:   '+omegak0.toExponential(3),
		showarrow: false}] ;
		let val_graph = new_calcul_temps(abscissa_t);

		if(t_checkbox.checked && axeAbscicceEnZPlus1){	//gère le cas du décalage des absicces pour que tout tienne sur le graph quand on utilise l'échelle log
			for(i=0;i<val_graph[0].length;i++){//Dans val_graph[0] se trouve les z, les abscicces pour le tracé des graphes, on le décale ici
				val_graph[0][i] = abscissa_t[i] + 1
			}	
		}	
		
		let data = [
			{
				x: val_graph[0],
				y: val_graph[1],

				type: 'scatter',

				line: {
					simplify: false
				},
				name: 't(z)'
			}
		];
		let layout = {  width: 1325 , height:450 , 

			title: "t(z)",
			titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
			xaxis: {

				type : plot_type,

				autorange: true,
				title: titreAbscicce,
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},

			yaxis: {
				type : "scatter",
				autorange: true,
				title: 'temps (a)',titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},

			newshape: {
			line: {
					width: 6
				},
			},

			annotations: annots,
		};

		if(t_checkbox.checked) {
			graphique_creation("graphique_log_t", ['graphique_log_t', data, layout, {displaylogo: false}]);
		}
		else{
			graphique_creation("graphique_t", ['graphique_t', data, layout, {displaylogo: false}]);
		}
		
	} else if(path == 4 && modele==0) {
		// Distance's charts d in function of t
		d_checkbox = document.getElementById("d_checkbox");
		if(d_checkbox.checked) {
			document.getElementById("graph_container_log_d_t").style.display = "contents"; //display graph
			plot_title = "Échelle log d<sub>m</sub>  d<sub>L</sub>  d<sub>a</sub>  d<sub>LT</sub>"
			plot_type = 'log'

			var abscissa_d = log_scale(zmin, zmax, pas);


		}
		else{
			document.getElementById("graph_container_d_t").style.display = "contents"; //display graph
			plot_title = "d<sub>m</sub>  d<sub>L</sub>  d<sub>a</sub>  d<sub>LT</sub>"
			plot_type = 'scatter'

			var abscissa_d = linear_scale(zmin, zmax, pas);
		}


		var val_abscissa = new_calcul_temps(abscissa_d);


		let val_graph = calculDeDs_EN(abscissa_d);
		let annots =  [{xref: 'paper',
		yref: 'paper',
		x: 0.725,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text:'T<sub>0</sub>: '+t0.toExponential(3)+'   H<sub>0</sub>:'+h0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+omegam0.toExponential(3)+'   \Ω<sub>DE0</sub>:  '+omegaDE0+'   \Ω<sub>r0</sub>: ' +Or+'  \Ω<sub>k0</sub>:   '+omegak0.toExponential(3),
		showarrow: false}];
		let data = [
			{
				x: val_abscissa[1],
				y: val_graph[1],

				type: 'scatter',

				name: '<b>d<sub>a</sub><b>'
			},
			{
				x: val_abscissa[1],
				y: val_graph[2],

				type: 'scatter',

				name: '<b>d<sub>m</sub><b>'
			},
			{
				x: val_abscissa[1],
				y: val_graph[0],

				type: 'scatter',

				name: '<b>d<sub>L</sub><b>'
			},
			{
				x: val_abscissa[1],
				y: val_graph[4],
				type: 'scatter',
				name: '<b>d<sub>LT</sub><b>'
			}
		];
		let layout = {  width: 1325 , height:450 , 

			title: "d<sub>m</sub>  d<sub>L</sub>  d<sub>a</sub>  d<sub>LT</sub>",

			titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
			
			xaxis: {
				autorange: true,

				type : plot_type,

				title: 't',
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},
	
			yaxis: {
				rangemode: 'tozero',
				autorange: true,

				type : "scatter",

				title: 'al',
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},
			annotations: annots,
		};

		if(d_checkbox.checked) {
			graphique_creation("graphique_log_d_t", ['graphique_log_d_t', data, layout, {displaylogo: false}]);
		}
		else{
			graphique_creation("graphique_d_t", ['graphique_d_t', data, layout, {displaylogo: false}]);
		}
		
	} else if(path == 5 && modele==0) {
		// Omega's charts in function of t
		omega_checkbox = document.getElementById("omega_checkbox");
		if(omega_checkbox.checked) {
			document.getElementById("graph_container_log_omega_t").style.display = "contents"; //display graph
			plot_title = "Échelle log \Ω<sub>m</sub>  Ω<sub>DE</sub>  Ω<sub>r</sub>  Ω<sub>k</sub>"
			plot_type = 'log'

			var abscissa_omega = log_scale(zmin, zmax, pas);
		}
		else{
			document.getElementById("graph_container_omega_t").style.display = "contents"; //display graph
			plot_title = "\Ω<sub>m</sub>  Ω<sub>DE</sub>  Ω<sub>r</sub>  Ω<sub>k</sub>"
			plot_type = 'scatter'
			

			var abscissa_omega = linear_scale(zmin, zmax, pas);
		}
	

		var val_abscissa = new_calcul_temps(abscissa_omega);

		let val_graph = calcul_omegas_EN(abscissa_omega);
		let annots = [{xref: 'paper',
		yref: 'paper',
		x: 0.725,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text:'T<sub>0</sub>: '+t0.toExponential(3)+'   H<sub>0</sub>:'+h0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+omegam0.toExponential(3)+'   \Ω<sub>DE0</sub>:  '+omegaDE0+'   \Ω<sub>r0</sub>: ' +Or+'  \Ω<sub>k0</sub>:   '+omegak0.toExponential(3),
		showarrow: false}]
		let data = [
			{
				x: val_abscissa[1],
				y: val_graph[0],

				type: 'scatter',

				name: '<b>Ω<sub>m</sub><b>'
			},
			{
				x: val_abscissa[1],
				y: val_graph[1],

				type: 'scatter',

				name: '<b>Ω<sub>DEN</sub><b>'
			},
			{
				x: val_abscissa[1],
				y: val_graph[2],

				type: 'scatter',

				name: '<b>Ω<sub>r</sub><b>'
			},
			{
				x: val_abscissa[1],
				y: val_graph[3],

				type: 'scatter',

				name: '<b>Ω<sub>k</sub><b>'
			}
		];
		let layout = {  width: 1325 , height:450 , 

			title: "\Ω<sub>m</sub>  Ω<sub>DE</sub>  Ω<sub>r</sub>  Ω<sub>k</sub>",

			title: plot_title,

			titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
	
			xaxis: {
				autorange: true,

				type : plot_type,

				title: 't',
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},
	
			yaxis: {
				rangemode: 'tozero',
				autorange: true,
				type : "scatter",
				title: 'Paramètre de densité Ω<sub>i</sub>',
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},

				showline: true
			},
			annotations: annots,
		};


		if(omega_checkbox.checked) {
			graphique_creation("graphique_log_omega_t", ['graphique_log_omega_t', data, layout, {displaylogo: false}]);
		}
		else{
			graphique_creation("graphique_omega_t", ['graphique_omega_t', data, layout, {displaylogo: false}]);
		}
		

	}
	else if(path == 6 && modele == 0){ //S modele=0 quand l'univers à un âge déf. (un bool serait préférable... ou au moins un nom de variable explicite :))
		//Il faut vraiment réduire tout ça à une seule checkbox ... la redondance du code pour chaque cas de figure rend le tout illisible( ou bien usage fonction, je sais pas?)
		t_checkbox = document.getElementById("t_checkbox");				
		if(t_checkbox.checked) {
			document.getElementById("graph_container_log_z").style.display = "contents"; //display graph
			plot_title = "Échelle log z(t)"
			plot_type = 'log'

			var abscissa_z = log_scale(zmin, zmax, pas);

		}
		else{
			document.getElementById("graph_container_z").style.display = "contents"; //display graph
			plot_title = "z(t)"
			plot_type = 'scatter'

			var abscissa_z = linear_scale(zmin, zmax, pas);
		} 

		let val_graph = new_calcul_temps(abscissa_z);
		let amin=1/(1+zmax);
		let amax=1/(1+zmin);
		let res = calcul_facteur_echelle_DE(amin,amax,equa_diff_1_DE, equa_diff_2_DE, fonction_F)[0];
		let ordonnee = res[1].map((x) => (1-x)/x);
		ordonnee=ordonnee.reverse();
		let abscisse = res[0].map((x) => x*1e9);
		abscisse=abscisse.reverse() ;

		let annots = [{xref: 'paper',
		yref: 'paper',
		x: 0.725,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text: 'T<sub>0</sub>: '+t0.toExponential(3)+'   H<sub>0</sub>:'+h0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+omegam0.toExponential(3)+'   \Ω<sub>DE0</sub>:  '+omegaDE0+'   \Ω<sub>r0</sub>: ' +Or+'  \Ω<sub>k0</sub>:   '+omegak0.toExponential(3),
		showarrow: false}] ;

		let data = [
			{
				x: val_graph[1],
				y: val_graph[0],

				type: 'scatter',

				line: {
					simplify: false
				},
				name: 'z(t)'
			}
		];
		let layout = {  width: 1325 , height:450 , 

			title: "z(t)",
			titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
			xaxis: {

				type : plot_type,

				autorange: true,
				title: 'temps (a)',
				titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},

			yaxis: {
				type : "scatter",
				autorange: true,
				title: 'z',titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
				showline: true
			},

			newshape: {
			line: {
					width: 6
				},
			},

			annotations: annots,
		};

		if(t_checkbox.checked) {
			graphique_creation("graphique_log_z", ['graphique_log_z', data, layout, {displaylogo: false}]);
		}
		else{
			graphique_creation("graphique_z", ['graphique_z', data, layout, {displaylogo: false}]);
		}






	


	}

	// Temps calcul
	fin = new Date().getTime() - deb;
	Chaine = "Le calcul a duré : " + fin + " millisecondes !";
	time_affiche.innerHTML = Chaine;
	time_affiche.style.display ="inline-block";
	stop_spin();

}


function calculDeDs_EN(abscissa) {
	Eps = Number(0.001);  //0.00001
//	var pas = (zmax - zmin)/dt;	
	var zArr = [];
//	var i = zmin;
	var daArr = [];
	var da;
	var dlArr = [];
	var dl;
	var dm1;
	var dmArr = [];
	var dlt;
	var dltArr = [];
	var max_graph;
	var min_graph;
	var integ_1;

	w0 = Number(document.getElementById("omega0").value);
	w1 = Number(document.getElementById("omega1").value);


		abscissa.forEach(i => {   
		
		// calcul de la distance mètrique 
		dm1=DistanceMetrique(fonction_F,0,i,true);

		//  temps en secondes
		temps = calcul_ages(fonction_F,H0parsec,.0000001,1/(1+i));

		dlt = temps * c;
		dlt = dlt * LUMIERE_INV;

		dm1 = Math.abs(dm1); // distances positives

		dm1 = dm1 * LUMIERE_INV;  //  distance mètrique en années lumière

		dm1 = Number(dm1.toExponential(3));
		da = dm1 / (1 + i);
		dl = dm1 * (1 + i);

		da = Number(da.toExponential(3));
		dl = Number(dl.toExponential(3));

		dmArr.push(dm1);
		daArr.push(da);
		dlArr.push(dl);
		dltArr.push(dlt);

		zArr.push(i); 
	});

	return [dlArr,daArr,dmArr,zArr,dltArr];
}

function linear_scale(zmin, zmax, nb_pts) {
	let step = (zmax - zmin) / nb_pts;
	let abscissa = [];
	for (let i=zmin; i<=zmax; i+=step) {
		abscissa.push(i);
	}
	if(abscissa[abscissa.length - 1] != zmax){ //Pour gérér le cas particulier ou zmax n'apparait pas dans la liste par la faute du pas
		abscissa.push(zmax)
	}

	return abscissa;
}
function log_scale(zmin, zmax, nb_pts) {
	let zmin_10 = Math.log10(zmin + 1);
	let zmax_10 = Math.log10(zmax + 1);
	let abscissa = linear_scale(zmin_10, zmax_10, nb_pts);
	let abscissa_10 = [];
	for (let i = 0; i < abscissa.length; i++) {
		abscissa_10.push(10**abscissa[i] - 1);	
	}

	
	return abscissa_10;
}

function graphique_creation(id_document, params_to_plotly){
	/*
		This function create the graphics for calcul annexe using plotly lib
		id_document : id of the object on html page
		params_to_plotly : parameters that are passed to plotly
		return : nothing
	*/

	var graph = $("#"+id_document);
	Plotly.purge(graph);
	graph.empty();

	var wid = graph.width();
	if (window.innerWidth > 1000) {
		var hei = wid * 0.5;
	} else {
		var hei = wid * 2 / 3;
	}

	window.document.getElementById(id_document).style.clientHeigh = hei;
	
	Plotly.newPlot(params_to_plotly[0], params_to_plotly[1], params_to_plotly[2], params_to_plotly[3]);
	
}

function enre(format, graph) {
	if (format.options[0].selected) {
		Plotly.downloadImage(graph, {format: 'png', width: 1500, height: 500, filename: 'Graphique'});
	} else if (format.options[1].selected) {
		Plotly.downloadImage(graph, {format: 'jpeg', width: 1500, height: 500, filename: 'Graphique'});
	} else {
		Plotly.downloadImage(graph, {format: 'svg', width: 1500, height: 500, filename: 'Graphique'});
	}
	}


	
function calcul_temps_EN(abscissa){
	zArr = [];
	tempsArr=[];
	temps_0=0;
	w0 = Number(document.getElementById("omega0").value);
	w1 = Number(document.getElementById("omega1").value);

	h0 = Number(document.getElementById("H0").value); 
	if(h0<0) {temps_0=simpson_simple_degre2_EN(fonction_integrale_EN, 0, omegam0, Number(omegaDE0), Number(Or),w0,w1); temps_0=-temps_0;}
	
	abscissa.forEach(i => {

		if (Number(i) <= 1e12) {
			temps = simpson_simple_degre2_EN(fonction_integrale_EN, Number(i), omegam0, Number(omegaDE0), Number(Or),w0,w1);
			tempsArr.push(temps+temps_0);
		} else {
			// nécessaire car l'ordre 4 de E(x) est lié à Or, on prend donc l'ordre 3
			if (Or==0){
				temps=2/(3*Math.pow(omegam0,1/2)*H0enannee*Math.pow(Number(i)+1,3/2));
				temps=temps.toExponential(3)
				tempsArr.push(temps)
			}
			else{
				temps = 1 / (Math.pow(1 + Number(i), 2) * 2 * Math.pow(Or, 0.5) * H0enannee);
				temps=temps.toExponential(3)
				tempsArr.push(temps)
			}
		}
		zArr.push(i);
	});

	return [zArr,tempsArr];
}

//Remy 28/05/2024
function new_calcul_temps(abscissa){
	zArr=[];
	tempsArr=[];
	abscissa.forEach(i => {
		tempsArr.push(calcul_ages(fonction_F,H0enannee,0.000000001,1/(1+i)));
		zArr.push(i)
	});
	return [zArr,tempsArr];
};


function obtenir_linearScale_pour_t_EN(zArr,tArr,pas,omegam0,omegaDE0,Or,H0enannee,w0,w1){// Fonction utilisant la dérivé première et seconde de t(z) (Soit fonction intégrable et sa première dérivé) : fait pour ne marcher qu'ici
	tArr.sort(function(a, b){return a-b}); // Linéairement décroissante? ( t(z))
	tArrLinear = []
	zSortie_pour_tArrLinear = []
	
	if(zArr.length != tArr.length){
		//console.log("Les deux arrays doivent être de même taille")
		return -1
	}


	tArrLinear = 	linear_scale(tArr[0],tArr[tArr.length-1],pas)
	localisationDes_tArrLinear_surSegmentReduit = new Array(tArr.length-1)

	indexCourant_tArrLinear = 0
	for(i=0;i<tArr.length-1;i++){
		if(indexCourant_tArrLinear >= tArrLinear.length){
			possibleQueCaRentre = false
		}
		else{
		possibleQueCaRentre = true
		}

		listeAPush = []
		while(possibleQueCaRentre){

			if(tArrLinear[indexCourant_tArrLinear] >= tArr[i] && tArrLinear[indexCourant_tArrLinear] <= tArr[i+1]){
				listeAPush.push(tArrLinear[indexCourant_tArrLinear])
				indexCourant_tArrLinear += 1
			}
			else{
				possibleQueCaRentre = false
			}
		}

		if(listeAPush.length != 0){
		localisationDes_tArrLinear_surSegmentReduit[i] = (listeAPush)
		}

	}

	zArr.reverse() // car t(z) est strictement décroissant


	//Ci-dessous, on emploieune bisection

	for(k = 0; k < localisationDes_tArrLinear_surSegmentReduit.length;k++){
		if(localisationDes_tArrLinear_surSegmentReduit[k] != undefined){ //vérifie juste qu'il y a bien des t à trouver sur le segment de z considéré
			
			
			for(i = 0; i < localisationDes_tArrLinear_surSegmentReduit[k].length;i++){
				borneHauteZ = zArr[k+1] //t(z) strictement décroissant, la borne haute de z correspond au plus petit t
				borneBasseZ = zArr[k]
				

				
				while(Math.sqrt(((borneHauteZ-borneBasseZ)*(borneHauteZ-borneBasseZ))/2) >= 1E-5){
					tmid = simpson_simple_degre2_EN(fonction_integrale_EN, Number((borneHauteZ+borneBasseZ)/2), omegam0, Number(omegaDE0), Number(Or),w0,w1)
					

					if(tmid<localisationDes_tArrLinear_surSegmentReduit[k][i]){
						borneBasseZ = (borneBasseZ+borneHauteZ)/2
					}
					else{
						borneHauteZ = (borneBasseZ+borneHauteZ)/2
					}
				}
				zSortie_pour_tArrLinear.push((borneHauteZ+borneBasseZ)/2)

			}
			
		}
	}

	zSortie_pour_tArrLinear.reverse()
	return zSortie_pour_tArrLinear
}//


function calcul_omegas_EN(abscissa){
    zz=0. ;
    zArr = [];
    omArr = [];
    olArr = [];
    orArr = [];
    okArr = [];
	w0 = Number(document.getElementById("omega0").value);
	w1 = Number(document.getElementById("omega1").value);

    abscissa.forEach(i => {

        Omz = omegam0 * Math.pow(1 + Number(i), 3) / fonction_F(Number(i), true);
        Omz = Omz.toExponential(8);
        omArr.push(Omz);

		if (document.getElementById("omegade_normalise").checked){
			Olz = Number(omegaDE0) * fonction_Y(1/(1+i)) / fonction_F(Number(i),true);
		}else{
			Olz=Number(omegaDE0/fonction_F(Number(i),true));
		};
        Olz = Olz.toExponential(8); 
        olArr.push(Olz);

        Orz = Or * Math.pow(1 + Number(Number(i)), 4) / fonction_F(Number(i), true);
        Orz = Orz.toExponential(8);
        orArr.push(Orz);

        Okz = omegak0 * Math.pow(1 + Number(i), 2) / fonction_F(Number(i), true);
        Okz = Okz.toExponential(8);
        okArr.push(Okz);
        
        zArr.push(i);
    });

    return [omArr,olArr,orArr,okArr,zArr];
}

//Remy 27/05/2024
function calcul_horizons_annexe_noire(){
	if (t_pour_horizon<=0){
		document.getElementById("resultat_dm_particule_t").innerHTML=NaN;
		document.getElementById("resultat_dm_evenement_t").innerHTML=NaN;
	}else{
		z_pour_horizon=calcul_t_inverse(t_pour_horizon,fonction_F);
		let dm_horizon_particule_m=calcul_horizon_particule(fonction_F,z_pour_horizon);
		let dm_horizon_particule_Ga=m_vers_AL(dm_horizon_particule_m)/1e9;
		let dm_horizon_evenement_m=calcul_horizon_evenements(fonction_F,z_pour_horizon);
		let dm_horizon_evenement_Ga=m_vers_AL(dm_horizon_evenement_m)/1e9;
		document.getElementById("resultat_dm_particule_t").innerHTML=dm_horizon_particule_Ga.toExponential(4);
		document.getElementById("resultat_dm_evenement_t").innerHTML=dm_horizon_evenement_Ga.toExponential(4);}

}