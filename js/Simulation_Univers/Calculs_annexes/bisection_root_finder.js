/*                                                      ---------------------  CALCULS INVERSES POUR LE DM ------------------------------------                            */

//executing function

function inverse(){

	//AU=149597870700;
	c = Number(document.getElementById("c_p").value);
	G = Number(document.getElementById("G_p").value);
	h = Number(document.getElementById("h_p").value);
	k = Number(document.getElementById("k_p").value);
	h0 = Number(document.getElementById("H0").value);
	omegam0 = Number(document.getElementById("omegam0").value);
	omegalambda0 = Number(document.getElementById("omegalambda0").value);
	omegak0=(1-omegam0-omegalambda0-Or);
	H0parsec = h0*1000/((AU*(180*3600))/Math.PI*Math.pow(10, 6));
	z_negatif_inverse = document.getElementById("z_negatif_check").checked;

//definition du type d'annee
	if(typeannee == "Sidérale"){
		nbrjours = 365.256363051;
		}else if(typeannee == "Julienne"){
		nbrjours = 365.25;
		}else if(typeannee == "Tropique (2000)"){
		nbrjours = 365.242190517;
		}else{
		nbrjours = 365.2425;
	}

	//calcul de h0 par secondes et par gigaannees
	H0parsec = h0*1000/((AU*(180*3600))/Math.PI*Math.pow(10, 6));
	H0enannee = H0parsec*(3600*24*nbrjours);
	H0engannee = H0enannee*Math.pow(10, 9);


	Or = 0;
	if (document.getElementById("resultat_omegar0_annexes").value=="Matière, Lambda, RFC et Neutrinos") {
		sigma = (2*Math.pow(Math.PI, 5)*Math.pow(k, 4))/(15*Math.pow(h, 3)*Math.pow(c, 2));
		rho_r = (4*sigma*Math.pow(t0, 4))/(Math.pow(c, 3));
		Or =(8*Math.PI*G*rho_r)/(3*Math.pow(H0parsec, 2));
		Or=1.6913*Or;
		Or = Or.toExponential();
	} else if (document.getElementById("resultat_omegar0_annexes").value=="Matière, Lambda et RFC") {
		sigma = (2*Math.pow(Math.PI, 5)*Math.pow(k, 4))/(15*Math.pow(h, 3)*Math.pow(c, 2));
		rho_r = (4*sigma*Math.pow(t0, 4))/(Math.pow(c, 3));
		Or =(8*Math.PI*G*rho_r)/(3*Math.pow(H0parsec, 2));
		Or = Or.toExponential();
	} else {
		Or = 0;
	}



	eps = 1e-6;    //tolérence d'erreur pour les intégrales

	get_root_dm();
	get_root_t();
}

// même fonction mais pour les monofluides
function inverseMono(){

	//calcu(0); // de préférence, à optimiser à l'avenir, le calcul complet n'est pas nécessaire
    //remplacé par lance_calc(0) parce que sinon le stop_spin() dans calcu essaie de stopper le spin qui n'est pas défini
    lance_calc(0) 
    //le spinner lancer est en dessous du calcul normal, car le div gif est en dessous du calcul. Quand on appuie sur tracer pour univers(pas monofluide) c'est la meme chose. Probleme ou pas?/subjectif
	eps = 1e-6; 
	get_root_dm();
	get_root_t();
}

//#######################################     GET_ROOT_DM fonction suprême qui ordonne le calcul de "dm". récupère les paramètres de la page HTML Calculs


function get_root_dm(){
	var texte = o_recupereJson();  //intégralité des textes du projet
	// on cherche la plus grande valeur de dm  en supposant z=1e10
	z_max=1e10;
	eps=1e-6;
	if (omegak0>0){ //valeur de dm en fonction de z dans la théorie
		integ_1 = Math.sqrt( Math.abs(omegak0)) * simpson(0,z_max, fonction_dm, omegam0, Number(omegalambda0), Number(Or),eps);
		dm_max=(c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sin(integ_1);
		}
	else if (omegak0==0 ){
		dm_max=(c/(H0parsec) * simpson(0,z_max , fonction_dm, omegam0, Number(omegalambda0), Number(Or),eps));
		}
	else {
		integ_1 = Math.sqrt( Math.abs(omegak0)) * simpson(0, z_max, fonction_dm, omegam0, Number(omegalambda0), Number(Or),eps);
		dm_max=(c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sinh(integ_1);
	}
	//récupère les constants nécessaires pour les calculs
	dm = document.getElementById("dm_racine_dm").value;
	
	if(dm>=dm_max){
		messagebox(texte.page_univers_calculs.erreur,texte.page_univers_calculs.dm_trop_grand + "\u0020(" + dm_max.toExponential(4) + "  m)");
		z=NaN;
	}else{
		z = bisection_method_dm(dm, omegam0, omegalambda0, Or, eps);  
	}
	document.getElementById("z_racine_dm").innerHTML= z;


}


/*                                                      ---------------------  CALCULS INVERSES POUR LE TEMPS  ------------------------------------            */
//#######################################     GET_ROOT_T fonction suprême qui ordonne le calcul inverse. récupère les paramètres de la page HTML Calculs
function get_root_t(){// omega est omegalambda0 en cas de constante cosmo et omegeDE0 cas d'energie sombre de meme fonctiom_integral ==> fonctiom_integral_EN
	var texte = o_recupereJson();
	eps=1e-6;
	t_max=simpson_simple_degre2(fonction_integrale, 0, omegam0, Number(omegalambda0), Number(Or));
	t_em = (document.getElementById("t_racine_em").value);
	if(t_em <=0 ){
		messagebox(texte.page_univers_calculs.erreur,"te" + texte.page_univers_calculs.t_negatif);z_em=NaN;}/*Remy a enlever
	else if (t_em > t_max-1){
		messagebox(texte.page_univers_calculs.erreur,texte.page_univers_calculs.t_trop_grand + "\u0020(" + (t_max).toExponential(4) + "  a)");
		z_em=NaN;}*/
	else{//remy change le bisection par sa fonction
		//z_em = bisection_method_t(t_em, omegam0, omegalambda0, Or, eps);
		z_em = calcul_t_inverse(t_em,fonction_E) ;
	}
	document.getElementById("z_racine_t_em").innerHTML= z_em.toExponential(5);
	
	t_rec = (document.getElementById("t_racine_rec").value);
	if(t_rec <=0){
		messagebox(texte.page_univers_calculs.erreur, "tr" + texte.page_univers_calculs.t_negatif);z_rec=NaN;}/*
	else if(t_rec > t_max-1){
		messagebox(texte.page_univers_calculs.erreur,texte.page_univers_calculs.t_trop_grand + "\u0020(" + (t_max).toExponential(4) + "  a)");
		z_rec=NaN;}*/
	else{
		//z_rec = bisection_method_t(t_rec, omegam0, omegalambda0, Or, eps);
		z_rec = calcul_t_inverse(t_rec,fonction_E);
	}
	document.getElementById("z_racine_t_rec").innerHTML= z_rec.toExponential(5);
}


//#######################################     BISECTION_METHOD_DM prépare les variables et mène des vérifications nécessaires avant de lancer l'algorithme de dicothomie

function bisection_method_dm (dm, omegam0, omegalambda0, Or, eps){
	f_x = formule_z(omegak0);

	za = 0;
	reconditionneur = espacedefinie(omegam0, omegalambda0, Or);
	if (z_negatif_inverse){
		zb=-.999999999;
	}else{
		zb = Number(reconditionneur[0])-0.0001;
	}

	ex = 0.00001; //indicateur de tolérence d'erreur de l'interpolation/dichotomie

	//vérification des valeurs permisent
	//cette variable possède 2 valeurs [nouveau_zb, contrainte] contrainte =0 ou 1. 0 pour absence de contrainte

	contrainte = Number(reconditionneur[1]);
	dm_za = f_x(za, omegam0, omegalambda0, Or, eps);
	dm_zb = f_x(zb, omegam0, omegalambda0, Or, eps);
	if (Number(dm)===0){
		return 0;
	}

	if (omegak0 <=0){
		limit = 0;
		if (contrainte ==0){
			while (dm > dm_zb && limit<100){
				zb = zb*10;
				dm_zb = f_x(zb, omegam0, omegalambda0, Or, eps);
				limit+=1;
			}
			if (limit>=100){
				return NaN;
			}
		}
		//la fonction "fonction_dm" est monotone pour omegak <=0. Si dm est supérieur à  dm_zb et que zb est fixé à  une valeur maximal permise alors aucune solution ne peut être trouvé
		if (dm>dm_zb){
			return NaN;
		}
		if (z_negatif_inverse){
			Z = dichotomie(zb, za, f_x, dm, ex);
		}else{
			Z = dichotomie(za, zb, f_x, dm, ex);
		}
		
		return Z;
	}
	//la condition de else est omegak0 >0
	else{
		//amplitude A de la fonction composée de sin(integral)       Sk_sin_x
		A = (c/(H0parsec*Math.sqrt( Math.abs(omegak0) )))
		if (dm > A){
			return NaN;
		}
		integB = Math.sqrt( Math.abs(omegak0)) * simpson(0, zb, fonction_dm, omegam0, Number(omegalambda0), Number(Or), eps);
		//dans cette situation, sin(integrale) est monotone sur l'intervalle [za; zb]
		if (integB<Math.PI/2){
			//on vérifie que dm n'est pas supérieur à  dm_zb car dm_zb< A   ici l'integral du dm_zb est dans [0;PI/2]
			if (dm > dm_zb){
				return NaN;
			}
			return dichotomie(0, zb, f_x, dm, ex);
		}else if((integB>Math.PI/2) && (integB<Math.PI)){
			z_Pi_div_2 = dichotomie(0, zb, Integral_dm, Math.PI/2, ex);
			z_sol_1 = dichotomie(0, z_Pi_div_2, f_x, dm, ex);
			if (dm>dm_zb){ 
				z_sol_2 = dichotomie(z_Pi_div_2, zb, f_x, dm, ex);
				return (z_sol_1+", " + z_sol_2);
			}
			return z_sol_1;
		}
		else{
			z_Pi_div_2 = Number(dichotomie(0, zb, Integral_dm, Math.PI/2, ex));              
			z_Pi = Number(dichotomie(0, 5e10, Integral_dm, Math.PI, ex));
			z_sol_1 = dichotomie(0, z_Pi_div_2, f_x, dm, ex);
			z_sol_2 = dichotomie(z_Pi_div_2, z_Pi, f_x, dm, ex);
			z_f2 = z_sol_1+", " + z_sol_2;
			return z_f2;
		}
	}
}


//########### ESPACE_DEFINIE fonction qui intervient pour vérifier si les paramètres omegas posent des contraintes à  leur fonction associé.
//                    si cette fonction signale la présence de régions de valeurs interdites pour les intégrales, elle désactive l'application de

function espacedefinie(omegam0, omegalambda0, Or){

	var za = 0;
	var zb = 5e10;
	ex = 0.000001;
	eps=0.0001;

	a = Or;
	b= 4*Or + omegam0;
	C = 5*Or + 2*omegam0 -omegalambda0 +1;
	d = 2*Or + omegam0 -2*omegalambda0 +2;
	e = 1;
	
	// Ce sont les coefficients de la fonction E (voir théorie expression 14) considérée comme  polynôme du quatième degré  en x

	//ON CHERCHE LES RACINES DE CE POLYNÔME D'ORDRE 4 QUAND Or "ASSEZ GRAND"
	
	if (a!=0 && (Math.abs(a/b)>1e-3 || Math.abs(a/c)>1e-3)){
		racines = fourth_order_solver(omegam0, omegalambda0, Or);
		//racines existantes
		if (racines.length>=2){
			//au moins 2 solutions existent sur l'axe des abscisses possitive. Celle qui est inférieur délimite la zone pour la distance métrique
			if ((racines[0]>0) && (racines[1]>0)){
				res = [racines[1],1];
				return res;
			}
			//au moins 2 solutions existent sur l'axe des abscisses. Une est positive, l'autre est négative. Celle qui est possitive délimite la zone pour la distance métrique
			else if ((racines[0]>0) && (racines[1]<0)){
				res = [racines[0],1];
				return res;
			}
			//les solutions sont toutes négatives
			else{
				res = [zb,0];
				return res;
			}
		}
		//aucunes racines/solutions existantes
		else{
			res = [zb,0];
			return res;
		}
	}
	//ON CHERCHE LES RACINES DU POLYNÔME D'ORDRE 3  EN SUPPOSANT Or=0
	
	else{
		//z_prime est la racine de la dérivé de E(x)  (E'(x)) sur [0, infini). c'est donce l'extremum (minimum) de E(x) sur [0, infini)

		//on vérifie à  l'avance si E'(x) coupe l'axe des abscisses sur [0;infini)
		D_prime_za = derive_fonction_E(za,omegam0, omegalambda0, Or);

		D_prime_zb = derive_fonction_E(zb,omegam0, omegalambda0, Or);

		if (D_prime_za*D_prime_zb<0){
			z_prime = Number(dichotomie(0, zb,derive_fonction_E,0,ex));
			//si on a E(z_prime)>0 alors E(x) n'a pas de racines et donc aucune contrainte se manifèste pour les intégrales. On conserve zb
			if (fonction_E(z_prime,omegam0, omegalambda0, Or)>0){

				res = [zb,0];    //0 va être un indicateur qu'on utilisera plus tard qui confirme l'absence des contraintes possibles.
				return res;
			}

			//si on a E(z_prime)=0 alors E(x) possède une racine. Une contrainte se manifèste, zb->z_prime les intégrales sont définit sur [0, z_prime)
			else if(fonction_E(z_prime,omegam0, omegalambda0, Or)==0){
				res = [z_prime, 1]; //1 va confirmer la présence de contraintes
				return res;
			}

			////si on a E(z_prime)<0 alors E(x) possède 2 racines. On prend la première z_pr. intégrales sont définit sur [0, z_pr)
			else{
				z_pr = Number(dichotomie(0, z_prime,fonction_E,0,ex));
				res = [z_pr,1];
				return res;
			}
		}

		//si E'(x) ne coupe pas l'axe des abscisses sur [0;infini) alors on conserve la valeur de zb et on indique l'absence de contraintes.
		else{
			if(fonction_E(za,omegam0, omegalambda0, Or)*fonction_E(zb,omegam0, omegalambda0, Or)<0){
				z_pr = Number(dichotomie(za, zb,fonction_E,0,ex));
				res = [z_pr,1];
				return res;
			}
			else{
				return res = [zb,0];
			}
		}
	}
}



//########### DICHOTOMIE     outil mathématique fondamental:   DICHOTOMIE  POUR "T"

function dichotomie(BornInf, BornSup, fonction, cible, ex){
    z_inf = BornInf;
    z_sup = BornSup;
    dm_z_inf = fonction(z_inf, omegam0, omegalambda0, Or, ex);
    dm_z_sup = fonction(z_sup, omegam0, omegalambda0, Or, ex);

    max_iterations = 500;
    j = 0;
    while (j<500){
		zc = (z_inf+z_sup)/2.0;

		dm_zc = fonction(zc, omegam0, omegalambda0, Or, ex);
		//alert("za : " + za + " dm_za: " + dm_za + " zb: " + zb + " dm_zb: " + dm_zb + " zc: " + zc+ " ex: " + ex);
		if (((z_sup-z_inf)/2)<ex){
			if (Math.abs(zc/ex) < 100){

				ex = ex*1e-5;
			}
			else{
				zc = zc.toExponential(5);
				return zc;
			}
		}
		else if(isNaN(dm_zc)){
			return NaN;
		}

		else if ((dm_zc-cible)*(dm_z_sup-cible)< 0){
			z_inf = zc;
			dm_z_inf = dm_zc;
			j+=1;
		}
		else{
			z_sup = zc;
			dm_z_sup = dm_zc;
			j+=1;
		}
	};
}

//fonction définit du produit de  l'intégral de la fonction "fonction_dm" avec abs(omegak0)^0.5   Ceci sert à  trouver le z correspondant a pi/2 ou pi pour cette fonction

function Integral_dm(bornSup, omegam0, omegalambda0, Or, eps){
	omegak0=(1-omegam0-omegalambda0-Or);
	return Math.sqrt( Math.abs(omegak0)) * simpson(0, bornSup, fonction_dm, omegam0, Number(omegalambda0), Number(Or), eps);
}


//formules pour dm basé sur omegak0
function Sk_sin_x(bornSup, omegam0, omegalambda0, Or, eps){

    integ = Math.sqrt( Math.abs(omegak0)) * simpson(0, bornSup, fonction_dm, omegam0, Number(omegalambda0), Number(Or), eps);
    return (c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sin(integ);
  }

function Sk_x(bornSup, omegam0, omegalambda0, Or, eps){
    return (c/(H0parsec) * simpson(0, bornSup, fonction_dm, omegam0, Number(omegalambda0), Number(Or), eps));
  }

function Sk_sinh_x(bornSup, omegam0, omegalambda0, Or, eps){
    integ = Math.sqrt( Math.abs(Number(omegak0))) * simpson(0, Number(bornSup), fonction_dm, Number(omegam0), Number(omegalambda0), Number(Or), eps);
    return (c/(H0parsec*Math.sqrt( Math.abs(Number(omegak0)) ))) * Math.sinh(integ);
  }


//choix de la formule pour calculer dm
function formule_z(omegak0){
		//dé¨ermine les formules qui sont utilent pour la distance metrique, omegak positif 0 ou negatif
	if (omegak0>0){
	  return Sk_sin_x;

		}
	else if (omegak0===0){
	  return Sk_x;

		}
	else{

	  return Sk_sinh_x;
	}
}
/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------*/









//########### DICHOTOMIE     outil mathématique fondamental:   DICHOTOMIE  POUR "T"   zc varie et le choix de la fonction_integrale dépend de la valeur z

function dichotomie_L(BornInf, BornSup, cible, ex){
	z_inf = BornInf;
    z_sup = BornSup;

	initial_a = Number(z_inf);
	dm_z_inf = simpson(0, 0.99999, cv_fonction_integrale, omegam0, Number(omegalambda0), Number(Or),Eps);

	initial_a = Number(z_sup);
	dm_z_sup = simpson(0, 0.99999, cv_fonction_integrale, omegam0, Number(omegalambda0), Number(Or),Eps);

	j = 0;
	while (j<500){
		zc = (z_inf+z_sup)/2.0;

		initial_a = Number(zc);
		dm_zc = simpson(0, 0.99999, cv_fonction_integrale, omegam0, Number(omegalambda0), Number(Or),Eps);
		//alert("za : " + z_inf + " dm_za: " + dm_z_inf + " zb: " + z_sup + " dm_zb: " + dm_z_sup + " zc: " + zc+ "  dm_zc " + dm_zc +"    " +(1./H0enannee));
		if (((z_sup-z_inf)/2)<ex){
			if (Math.abs(zc/ex) < 100){

				ex = ex*1e-5;
			}
			else{
				zc = zc.toExponential(5);
				return zc;
			}
		}
		else if(isNaN(dm_zc)){
			return NaN;
		}

		else if ((dm_zc-cible)*(dm_z_sup-cible)< 0){
			z_inf = zc;
			dm_z_inf = dm_zc;
			j+=1;
		}
		else{
			z_sup = zc;
			dm_z_sup = dm_zc;
			j+=1;
		}
}
	if (j==500){
	return "non existant";
	}
}








//#######################################     BISECTION_METHOD_T prépare les variables et mène des vérifications nécessaires avant de lancer l'algorithme de dicothomie



function bisection_method_t (t, omegam0, omegalambda0, Or, eps){
	if(t>1e4){
		omegak0=(1-omegam0-omegalambda0-Or);
		var za = 0;
		var zb = 1e6; //valeur par default
		ext = 0.00001;//indicateur de tolérence d'erreur dichotomie temporelle
		Eps = 1e-6;

		initial_a = Number(zb);
		t_zb = simpson(0, 0.999999, cv_fonction_integrale, omegam0, Number(omegalambda0), Number(Or),eps);
		initial_a = Number(za);
		t_za = simpson(0, 0.999999, cv_fonction_integrale, omegam0, Number(omegalambda0), Number(Or),eps);
		reconditionneur_t  = espace_definie(omegam0, omegalambda0, Or);
		contrainte_t = Number(reconditionneur_t[1]);

		//une contrainte se manifèste, za n'est plus égal à 0
		if (contrainte_t==1){
			za = reconditionneur_t[0]+0.01;
			//il faut recalculer l'image de za à travers la bonne fonction du temps cosmique
			initial_a = Number(za);
			t_za = simpson(0, 0.99999, cv_fonction_integrale, omegam0, Number(omegalambda0), Number(Or),eps);
		}

		//Les integrales convergent. Ici uncalculable signale si le calcul inverse est impossible. Le code qui suit ajuste
		//l'intervalle dans laquelle la solution peut se trouver
		if (t>t_za || t==0 || t<0){

			return NaN;        

		}else if(t<t_zb){
			ind = 0;
			while(t<t_zb && ind<100){
				zb*=10;

				initial_a = Number(zb);
				t_zb = simpson(0, 0.99999, cv_fonction_integrale, omegam0, Number(omegalambda0), Number(Or),eps);
				ind+=1;
			}
			if (ind==100){
				return NaN;
			}

		}

		return dichotomie_L(za, zb, t, ext);

	}else{
		h0 = Number(document.getElementById("H0").value);  //  em km par seconde et par mégaparsec
		typeannee = document.getElementById("typeannee").value;
		switch (typeannee) {
			case 'Sidérale':
				nbrJours = 365.256363051;
			case 'Julienne':
				nbrJours =365.25;
			case 'Tropique (2000)':
				nbrJours = 365.242190517;
			default:
				nbrJours = 365.2425;
		}
		H0parsec = h0 * 1000 / ((AU * (180 * 3600)) / Math.PI * Math.pow(10, 6));
		H0enannee = H0parsec * (3600 * 24 * nbrJours);
		if(Or===0){
			return((Math.pow(2/(3*H0enannee*t*Math.pow(omegam0,1/2)),2/3)-1).toExponential(4))
		}
		else{
			return((Math.pow(1/(2*t*H0enannee*Math.pow(Or,1/2)),1/2)-1).toExponential(4))
		}
	}
}




//########### ESPACE_DEFINIE fonction qui intervient pour vérifier si les paramètres omegas posent des contraintes à  leur fonction associé.
//                    si cette fonction signale la présence de régions de valeurs interdites pour les intégrales, elle désactive l'application de

function espace_definie(omegam0, omegalambda0, Or){

	var za = 0;
	var zb = 5e10;
	ex = 0.0000001;


	a = Or;
	b= 4*Or + omegam0;
	C = 5*Or + 2*omegam0 -omegalambda0 +1;
	d = 2*Or + omegam0 -2*omegalambda0 +2;
	e = 1;

	//on cherche les racines d'un polynôme d'ordre 4
	if (a!=0 && (Math.abs(a/b)>1e-3 || Math.abs(a/C)>1e-3 )){
		racines = fourth_order_solver(omegam0, omegalambda0, Or);
		//racines existantes
		if (racines.length>=2){
			//au moins 2 solutions existent sur l'axe des abscisses possitive. Celle qui est supérieur délimite la zone pour le temps cosmologiques
			if ((racines[0]>0) && (racines[1]>0)){
				res = [racines[0],1];
				return res;
			}
			//au moins 2 solutions existent sur l'axe des abscisses. Une est possitive, l'autre est négative. Cela implique que le temps cosmologiques ne peut être calculés
			else if ((racines[0]>0) && (racines[1]<0)){
				res = [1/0,1];
				return res;
			}
			//les solutions sont toutes négatives
			else{
				res = [za,0];
				return res;
			}
		}
		//aucunes racines/solutions existantes
		else{
			res = [za,0];
			return res;
		}
	}
	//on cherche les racines d'un polynôme d'ordre 3
	else{
		D_prime_za = derive_fonction_E(za,omegam0, omegalambda0, Or);
		D_prime_zb = derive_fonction_E(zb,omegam0, omegalambda0, Or);
		if (D_prime_za*D_prime_zb<0){
			//z_prime est la racine de la dérivé de E(x)  (E'(x)) sur [0, infini). c'est donce l'extremum (minimum) de E(x) sur [0, infini)
			z_prime = Number(dichotomie(0, zb,derive_fonction_E,0,ex))-0.001;

			//si on a E(z_prime)>0 alors E(x) n'a pas de racines et donc aucune contrainte se manifèste pour les intégrales. On conserve zb
			if (fonction_E(z_prime,omegam0, omegalambda0, Or)>0){
				res = [za,0];    //0 va être un indicateur qu'on utilisera plus tard qui confirme l'absence des contraintes possibles.
				return res;
			}

			//si on a E(z_prime)=0 alors E(x) possède une racine. Une contrainte se manifèste, zb->z_prime les intégrales sont définit sur [0, z_prime)
			else if(fonction_E(z_prime,omegam0, omegalambda0, Or)==0){
				res = [z_prime, 1]; //1 va confirmer la présence de contraintes
				return res;
			}

			////si on a E(z_prime)<0 alors E(x) possède 2 racines. On prend la première z_pr. intégrales sont définit sur [0, z_pr)
			else{
				z_pr = Number(dichotomie(z_prime, zb,fonction_E,0,ex))-0.001;
				res = [z_pr,1];
				return res;
			}
		}
		else{
			//le temps cosmologiques ne peut être calculés
			if(fonction_E(za,omegam0, omegalambda0, Or)*fonction_E(zb,omegam0, omegalambda0, Or)<0){
				z_pr = Number(dichotomie(za, zb,fonction_E,0,ex));
				res = [1/0,1];
				return res;
			}
			else{
				return res = [za,0];
			}
		}
	}
}



// Recherches de racines


function fourth_order_solver(omegam0, omegalambda0, Or){
	omegam0 = omegam0;
	omegalambda0 = omegalambda0;
	Or = Or;
	a = Or;
	b= 4*Or + omegam0;
	C = 5*Or + 2*omegam0 -omegalambda0 +1;
	d = 2*Or + omegam0 -2*omegalambda0 +2;
	e = 1;

	p = -3*Math.pow(b/a,2)/8 +C/a;
	q = Math.pow(b/a,3)/8 -(C/a)*(b/a)/2 +d/a;
	r = -3*Math.pow(b/a,4)/256 +(C/a)*Math.pow(b/a,2)/16 -(d/a)*(b/a)/4 + e/a;

	U1 = cubic_root_searcher();

	z1 = (-Math.pow(U1-p,0.5)+Math.pow((U1-p)-4*(0.5*U1 - q/(2*Math.pow(U1-p,0.5))),0.5))/2
	z2 = (-Math.pow(U1-p,0.5)-Math.pow((U1-p)-4*(0.5*U1 - q/(2*Math.pow(U1-p,0.5))),0.5))/2
	z3 = (Math.pow(U1-p,0.5)+Math.pow((U1-p)-4*(0.5*U1 + q/(2*Math.pow(U1-p,0.5))),0.5))/2
	z4 = (Math.pow(U1-p,0.5)-Math.pow((U1-p)-4*(0.5*U1 + q/(2*Math.pow(U1-p,0.5))),0.5))/2

	x1 = z1-0.25*(b/a);
	x2 = z2-0.25*(b/a);
	x3 = z3-0.25*(b/a);
	x4 = z4-0.25*(b/a);
	array_roots = [x1, x2, x3, x4];

	for(var i = array_roots.length - 1; i >= 0; i--) {
		if(isNaN(array_roots[i])) {
			array_roots.splice(i, 1);
		}
	}
	array_roots.sort(function(a, b){return b-a});
	return array_roots;

}


//équivalent de la fonction Espace définie mais pour une autre équation
function cubic_root_searcher(){
	var Ua = -2*p/6;    
	var Ub = 5e10;
	ex = 0.0000001;
	eps=1e-6;
	//z_prime est la racine de la dérivé de F(U)  (F'(U)) sur [0, infini). c'est donce l'extremum (minimum) de F(x) sur [0, infini)

	//on vérifie à  l'avance si F'(U) coupe l'axe des abscisses sur [0;infini)
	Dev_Ua = derive_fonction_u(Ua);
	Dev_Ub = derive_fonction_u(Ub);

	if (Dev_Ua*Dev_Ub<0){
		extremum = Number(dichotomie(Ua, Ub,derive_fonction_u,0,ex));
		//si on a U(extremum)>0 alors F(U) n'a peut-être pas de racines
		if (fonction_u(extremum)>0){
			if(fonction_u(0)*fonction_u(Ub)<0){
				u_root= Number(dichotomie(0, Ub,fonction_u,0,ex));
				return u_root;
			}
			else if(fonction_u(0)*fonction_u(-Ub)<0){
				u_root= Number(dichotomie(-Ub, 0,fonction_u,0,ex));
				return u_root;
			}
			else{
				return NaN
			}
		}

		//si on a E(z_prime)=0 alors E(x) possède une racine. Une contrainte se manifèste, zb->z_prime les intégrales sont définit sur [0, z_prime)
		else if(fonction_u(extremum, omegam0, omegalambda0, Or)==0){
			return extremum;
		}

		////si on a E(z_prime)<0 alors E(x) possède 2 racines. On prend la première z_pr. intégrales sont définit sur [0, z_pr)
		else{
			u_root= Number(dichotomie(extremum, Ub,fonction_u,0,ex));
			return u_root;
		}
	}
	else{
		if(fonction_u(0)*fonction_u(Ub)<0){
			u_root= Number(dichotomie(0, Ub,fonction_u,0,ex));
			return u_root;
		}
		else if(fonction_u(0)*fonction_u(-Ub)<0){
			u_root= Number(dichotomie(-Ub, 0,fonction_u,0,ex));
			return u_root;
		}
		else{
			return NaN
		}
	}
}


function fonction_u(u, omegam0, omegalambda0, Or, eps){
	return (u*u*u -p*u*u -4*r*u +(4*p*r-q*q));
}



function derive_fonction_u(u, omegam0, omegalambda0, Or, eps){
	return (3*u*u -2*p*u -4*r);
}
