/***************************************************
 * Notes importants ! 05/23
 * ici on a cree un nouveau fichier qui contient presque les memes fonctions sauf les fonctions generalises pour tous les cas
 * c'est pas pratique il faut avoir des fichiers generalisé pour tous les cas 
 * mais c'etait pas possible car il y a beacoup des fautes de programmation, des parametres, les noms de fonctions ...
 * En Type script cùest deja fait, en fait, avec w0=-1 et w1=0 les equations f(x)=E(x) ...
 * je note aussi que pour l'instant nous n'avons pas compris derive_fonction_u sa utilité et comment mettre une fonction pareil pour lenergie noir !
 * 
 */
//  fonction pour l'Enegrie sombre 
function inverse_EN(){

	au=149597870700;
	c = Number(document.getElementById("c_p").value);
	G = Number(document.getElementById("G_p").value);
	h = Number(document.getElementById("h_p").value);
	k = Number(document.getElementById("k_p").value);
	h0 = Number(document.getElementById("H0_annexes").value);
	omegam0 = Number(document.getElementById("omegam0_annexes").value);
	omegaDE0 = Number(document.getElementById("omegaDE0_annexes").value);

	omegak0=(1-omegam0-omegaDE0-Or);
	H0parsec = h0*1000/((au*(180*3600))/Math.PI*Math.pow(10, 6));

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
	H0parsec = h0*1000/((au*(180*3600))/Math.PI*Math.pow(10, 6));
	H0parsec = H0parsec;
	H0enannee = H0parsec*(3600*24*nbrjours);
	H0engannee = H0enannee*Math.pow(10, 9);


	Or = 0;
	if (document.getElementById("resultat_omegar0_annexes").value=="Matière, Lambda, RFC et Neutrinos") {
		sigma = (2*Math.pow(Math.PI, 5)*Math.pow(k, 4))/(15*Math.pow(h, 3)*Math.pow(c, 2));
		rho_r = (4*sigma*Math.pow(t0, 4))/(Math.pow(c, 3));
		Or =(8*Math.PI*G*rho_r)/(3*Math.pow(H0parsec, 2));
		Or=1.68*Or;
		Or = Or.toExponential();
		} else if (document.getElementById("resultat_omegar0_annexes").value=="Matière, Lambda et RFC") {
		sigma = (2*Math.pow(Math.PI, 5)*Math.pow(k, 4))/(15*Math.pow(h, 3)*Math.pow(c, 2));
		rho_r = (4*sigma*Math.pow(t0, 4))/(Math.pow(c, 3));
		Or =(8*Math.PI*G*rho_r)/(3*Math.pow(H0parsec, 2));
		Or = Or.toExponential();
		} else {
			Or = 0;
	}


	  eps = 1e-6;    //tolÃ©rence d'erreur pour les intÃ©grales

	get_root_dm_EN();
	get_root_t_EN(); //en fait, c'est fonction_integrale et cv_fonction_integrale ==>cv_Enoire_temps
}





function get_root_dm_EN(){//Enoire === 1sursqrtF ==fonction_dm_EN
	var texte = o_recupereJson();
	// on cherche la plus grande valeur de dm  en supposant z=1e10
	z_max=1e10
	eps=1e-6;	
	let w0 = Number(document.getElementById("omega0_annexes").value);
	let w1 = Number(document.getElementById("omega1_annexes").value);
   
	if (omegak0>0){ 
		integ_1 = Math.sqrt( Math.abs(omegak0)) * simpson_EN(0,z_max, fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or),eps,w0,w1);
		dm_max=(c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sin(integ_1);
		}
	else if (omegak0==0 ){
		dm_max=(c/(H0parsec) * simpson_EN(0,z_max , fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or),eps,w0,w1));
		}
	else {
		integ_1 = Math.sqrt( Math.abs(omegak0)) * simpson_EN(0, z_max, fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or),eps,w0,w1);
		dm_max=(c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sinh(integ_1);
	}
	//rÃ©cupÃ¨re les constants nÃ©cessaires pour les calculs
	dm = document.getElementById("dm_racine_dm").value;
	
	if(dm>=dm_max){
		messagebox(texte.page_univers_calculs.erreur,texte.page_univers_calculs.dm_trop_grand + "\u0020(" + dm_max.toExponential(4) + "  m)");
		z=NaN;
		}else{
		z = bisection_method_dm_EN(dm, omegam0, omegaDE0, Or, eps);
	}
	document.getElementById("z_racine_dm").innerHTML= z;


}


function bisection_method_dm_EN (dm, omegam0, omegaDE0, Or, eps){
	f_x = formule_z_EN(omegak0);
	za = 0;
	zb = 10;
	ex = 0.00001; //indicateur de tolÃ©rence d'erreur de l'interpolation/dichotomie
	let w0 = Number(document.getElementById("omega0_annexes").value);
	let w1 = Number(document.getElementById("omega1_annexes").value);
   
	dm_za = f_x(za, omegam0, omegaDE0, Or, eps,w0,w1);
	dm_zb = f_x(zb, omegam0, omegaDE0, Or, eps,w0,w1);
	//vÃ©rification des valeurs permisent
	//cette variable possÃ¨de 2 valeurs [nouveau_zb, contrainte] contrainte =0 ou 1. 0 pour absence de contrainte
	reconditionneur = espacedefinie_EN(omegam0, omegaDE0, Or,w0,w1);
	zb = Number(reconditionneur[0])-0.0001;
	contrainte = Number(reconditionneur[1]);
	dm_za = f_x(za, omegam0, omegaDE0, Or, eps,w0,w1);
	dm_zb = f_x(zb, omegam0, omegaDE0, Or, eps,w0,w1);

	if (Number(dm)===0){
	  return 0;
	}

	if (omegak0 <=0){
		limit = 0;
		if (contrainte ==0){
			while (dm > dm_zb && limit<100){
				zb = zb*10;
				dm_zb = f_x(zb, omegam0, omegaDE0, Or, eps);
				limit+=1;
			}
			if (limit>=100){
				return NaN;
			}
		}
		//la fonction "fonction_dm" est monotone pour omegak <=0. Si dm est supÃ©rieur Ã  dm_zb et que zb est fixÃ© Ã  une valeur maximal permise alors aucune solution ne peut Ãªtre trouvÃ©
		if (dm>dm_zb){
			return NaN;
		}
		Z = dichotomie_EN(za, zb, f_x, dm, ex,w0,w1);
		return Z;
	}
	//la condition de else est omegak0 >0
	else{
		//amplitude A de la fonction composÃ©e de sin(integral)       Sk_sin_x
		A = (c/(H0parsec*Math.sqrt( Math.abs(omegak0) )))
		if (dm > A){
			return NaN;
		}
		integB = Math.sqrt( Math.abs(omegak0)) * simpson_EN(0, zb, fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), eps,w0,w1);
		//dans cette situation, sin(integrale) est montone sur l'intervalle [za; zb]
		if (integB<Math.PI/2){
			//on vÃ©rifie que dm n'est pas supÃ©rieur Ã  dm_zb car dm_zb< A   ici l'integral du dm_zb est dans [0;PI/2]
			if (dm > dm_zb){
				return NaN;
			}
			return dichotomie_EN(0, zb, f_x, dm, ex,w0,w1);
		}
		else if((integB>Math.PI/2) && (integB<Math.PI)){
			z_Pi_div_2 = dichotomie_EN(0, zb, Integral_dm_EN, Math.PI/2, ex);
			z_sol_1 = dichotomie_EN(0, z_Pi_div_2, f_x, dm, ex,w0,w1);
			if (dm>dm_zb){
				z_sol_2 = dichotomie_EN(z_Pi_div_2, zb, f_x, dm, ex,w0,w1);
				return (z_sol_1+", " + z_sol_2);
			}
			return z_sol_1;
		}
		else{
			z_Pi_div_2 = Number(dichotomie_EN(0, zb, Integral_dm_EN, Math.PI/2, ex,w0,w1));
			z_Pi = Number(dichotomie_EN(0, 5e10, Integral_dm_EN, Math.PI, ex,w0,w1));
			z_sol_1 = dichotomie_EN(0, z_Pi_div_2, f_x, dm, ex,w0,w1);
			z_sol_2 = dichotomie_EN(z_Pi_div_2, z_Pi, f_x, dm, ex,w0,w1);
			z_f2 = z_sol_1+", " + z_sol_2;
			return z_f2;
		}
	}
}


//fonction dÃ©finit du produit de  l'intÃ©gral de la fonction "fonction_dm_EN" avec abs(omegak0)^0.5   Ceci sert Ã  trouver le z correspondant a pi/2 ou pi pour cette fonction

function Integral_dm_EN(bornSup, omegam0, omegaDE0, Or, eps){
	var omegak0=(1-omegam0-omegaDE0-Or);
	return Math.sqrt( Math.abs(omegak0)) * simpson_EN(0, bornSup, fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), eps,w0,w1);
}

//########### ESPACE_DEFINIE fonction qui intervient pour vÃ©rifier si les paramÃ¨tres omegas posent des contraintes Ã  leur fonction associÃ©.
//                    si cette fonction signale la prÃ©sence de rÃ©gions de valeurs interdites pour les intÃ©grales, elle dÃ©sactive l'application de

function espacedefinie_EN(omegam0, omegaDE0, Or,w0,w1){

	var za = 0;
	var zb = 5e10;
	ex = 0.000001;
	eps=0.0001;

	a = Or;
	b= 4*Or + omegam0;
	C = 5*Or + 2*omegam0 -omegaDE0 +1;
	d = 2*Or + omegam0 -2*omegaDE0 +2;
	e = 1;

	//on cherche les racines d'un polynôme d'ordre 4
	if (a!=0 && (Math.abs(a/b)>1e-3 || Math.abs(a/c)>1e-3)){
		racines = fourth_order_solver(omegam0, omegaDE0, Or);
		//racines existantes
		if (racines.length>=2){
			//au moins 2 solutions existent sur l'axe des abscisses possitive. Celle qui est inférieur délimite la zone pour la distance métrique
			if ((racines[0]>0) && (racines[1]>0)){
				res = [racines[1],1];
				return res;
			}
			//au moins 2 solutions existent sur l'axe des abscisses. Une est possitive, l'autre est négative. Celle qui est possitive délimite la zone pour la distance métrique
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
	//on cherche les racines d'un polynôme d'ordre 3
	else{
		//z_prime est la racine de la dÃ©rivÃ© de E(x)  (E'(x)) sur [0, infini). c'est donce l'extremum (minimum) de E(x) sur [0, infini)

		//on vÃ©rifie Ã  l'avance si E'(x) coupe l'axe des abscisses sur [0;infini)
		D_prime_za = derive_fonction_F(za,omegam0, omegaDE0, Or,w0,w1);

		D_prime_zb = derive_fonction_F(zb,omegam0, omegaDE0, Or,w0,w1);

		if (D_prime_za*D_prime_zb<0){
			z_prime = Number(dichotomie_EN(0, zb,derive_fonction_F,0,ex,w0,w1));
			//si on a E(z_prime)>0 alors E(x) n'a pas de racines et donc aucune contrainte se manifÃ¨ste pour les intÃ©grales. On conserve zb
			if (fonction_F(z_prime,omegam0, omegaDE0, Or,w0,w1)>0){

                
				res = [zb,0];    //0 va Ãªtre un indicateur qu'on utilisera plus tard qui confirme l'absence des contraintes possibles.
				return res;
			}

			//si on a E(z_prime)=0 alors E(x) possÃ¨de une racine. Une contrainte se manifÃ¨ste, zb->z_prime les intÃ©grales sont dÃ©finit sur [0, z_prime)
			else if(fonction_F(z_prime,omegam0, omegaDE0, Or,w0,w1)==0){
				res = [z_prime, 1]; //1 va confirmer la prÃ©sence de contraintes
				return res;
			}

			////si on a E(z_prime)<0 alors E(x) possÃ¨de 2 racines. On prend la premiÃ¨re z_pr. intÃ©grales sont dÃ©finit sur [0, z_pr)
			else{
				z_pr = Number(dichotomie_EN(0, z_prime,fonction_F,0,ex,w0,w1));
				res = [z_pr,1];
				return res;
			}
		}

		//si E'(x) ne coupe pas l'axe des abscisses sur [0;infini) alors on conserve la valeur de zb et on indique l'absence de contraintes.
		else{
			if(fonction_F(za,omegam0, omegaDE0, Or,w0,w1)*fonction_F(zb,omegam0, omegaDE0, Or,w0,w1)<0){
				z_pr = Number(dichotomie_EN(za, zb,fonction_F,0,ex,w0,w1));
				res = [z_pr,1];
				return res;
			}
			else{
				return res = [zb,0];
			}
		}
	}
}


function dichotomie_EN(BornInf, BornSup, fonction, cible, ex,w0,w1){
    z_inf = BornInf;
    z_sup = BornSup;
	eps=ex;
    dm_z_inf = fonction(z_inf, omegam0, omegaDE0, Or, eps,w0,w1);
    dm_z_sup = fonction(z_sup, omegam0, omegaDE0, Or, eps,w0,w1);

    max_iterations = 500;
    j = 0;
    while (j<500){
            zc = (z_inf+z_sup)/2.0;

            dm_zc = fonction(zc, omegam0, omegaDE0, Or, eps,w0,w1);
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
        }
}
/*                                                      ---------------------  CALCULS INVERSES POUR LE TEMPS  ------------------------------------            */
//#######################################     GET_ROOT_T fonction suprÃªme qui ordonne le calcul inverse. rÃ©cupÃ¨re les paramÃ¨tres de la page HTML Calculs
function get_root_t_EN(){//  en cas de constante cosmo et cas d'energie sombre de meme fonctiom_integral ==> fonctiom_integral_EN
    var texte = o_recupereJson();
eps=1e-6;
w0 = Number(document.getElementById("omega0_annexes").value);
w1 = Number(document.getElementById("omega1_annexes").value);

t_max=simpson_simple_degre2_EN(fonction_integrale_EN, 0, omegam0, Number(omegaDE0), Number(Or),w0,w1);

t_em = (document.getElementById("t_racine_em").value);
if(t_em <=0 ){
    messagebox(texte.page_univers_calculs.erreur,"te" + texte.page_univers_calculs.t_negatif);z_em=NaN;}
else if (t_em > t_max-1){
    messagebox(texte.page_univers_calculs.erreur,texte.page_univers_calculs.t_trop_grand + "\u0020(" + (t_max).toExponential(4) + "  a)");
    z_em=NaN;}
else{
z_em = bisection_method_t_EN(t_em, omegam0, omegaDE0, Or, eps,w0,w1);
}
document.getElementById("z_racine_t_em").innerHTML= z_em;


t_rec = (document.getElementById("t_racine_rec").value);
if(t_rec <=0){
    messagebox(texte.page_univers_calculs.erreur,"tr" + texte.page_univers_calculs.t_negatif);z_rec=NaN;}
else if(t_rec > t_max-1){
    messagebox(texte.page_univers_calculs.erreur,texte.page_univers_calculs.t_trop_grand + "\u0020(" + (t_max).toExponential(4) + "  a)");
    z_rec=NaN;}
else{
z_rec = bisection_method_t_EN(t_rec, omegam0, omegaDE0, Or, eps,w0,w1);
}
document.getElementById("z_racine_t_rec").innerHTML= z_rec;
}




function bisection_method_t_EN(t, omegam0, omegaDE0, Or, eps,w0,w1){
	if(t>1e4){
	omegak0=(1-omegam0-omegaDE0-Or);
	var za = 0;
	var zb = 1e6; //valeur par default
	ext = 0.00001;//indicateur de tolÃ©rence d'erreur dichotomie temporelle
	Eps = 1e-6;

	initial_a = Number(zb);

	t_zb = simpson_EN(0, 0.999999, cv_fonction_integrale_EN, omegam0, Number(omegaDE0), Number(Or),eps,w0,w1);

	initial_a = Number(za);
	t_za = simpson_EN(0, 0.999999, cv_fonction_integrale_EN, omegam0, Number(omegaDE0), Number(Or),eps,w0,w1);
	reconditionneur_t  = espace_definie_EN(omegam0, omegaDE0, Or);
	contrainte_t = Number(reconditionneur_t[1]);

	//une contrainte se manifèste, za n'est plus égal à 0
	if (contrainte_t==1){
		za = reconditionneur_t[0]+0.01;
		//il faut recalculer l'image de za à travers la bonne fonction du temps cosmique
		initial_a = Number(za);
		t_za = simpson_EN(0, 0.99999, cv_fonction_integrale_EN, omegam0, Number(omegaDE0), Number(Or),eps,w0,w1);
	}

	//Les integrales convergent. Ici uncalculable signale si le calcul inverse est impossible. Le code qui suit ajuste
	//l'intervalle dans laquelle la solution peut se trouver
	if (t>t_za || t==0 || t<0){

		return NaN;        

	}

	else if(t<t_zb){
		ind = 0;
		while(t<t_zb && ind<100){
			zb*=10;

			initial_a = Number(zb);
			t_zb = simpson_EN(0, 0.99999, cv_fonction_integrale_EN, omegam0, Number(omegaDE0), Number(Or),eps,w0,w1);
			ind+=1;
		}
		if (ind==100){
			return NaN;
		}

	}

	return dichotomie_L_EN(za, zb, t, ext);}
	else{
		h0 = Number(document.getElementById("H0_annexes").value);  //  em km par seconde et par mégaparsec
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
		H0parsec = h0 * 1000 / ((au * (180 * 3600)) / Math.PI * Math.pow(10, 6));
		H0enannee = H0parsec * (3600 * 24 * nbrJours);

		if(Or==0){
			return((Math.pow(2/(3*H0enannee*t*Math.pow(omegam0,1/2)),2/3)-1).toExponential(4))
		}
		else{
			return((Math.pow(1/(2*t*H0enannee*Math.pow(Or,1/2)),1/2)-1).toExponential(4))
		}
	}
}





//########### ESPACE_DEFINIE fonction qui intervient pour vÃ©rifier si les paramÃ¨tres omegas posent des contraintes Ã  leur fonction associÃ©.
//                    si cette fonction signale la prÃ©sence de rÃ©gions de valeurs interdites pour les intÃ©grales, elle dÃ©sactive l'application de

function espace_definie_EN(omegam0, omegaDE0, Or){

	var za = 0;
	var zb = 5e10;
	ex = 0.0000001;


	a = Or;
	b= 4*Or + omegam0;
	C = 5*Or + 2*omegam0 -omegaDE0 +1;
	d = 2*Or + omegam0 -2*omegaDE0 +2;
	e = 1;

	//on cherche les racines d'un polynôme d'ordre 4
	if (a!=0 && (Math.abs(a/b)>1e-3 || Math.abs(a/c)>1e-3 )){
		racines = fourth_order_solver(omegam0, omegaDE0, Or);
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
	else{// derive_fonction_F est equiv a derive_fonction_E mais o=pour l'energie sombre F -- E 
		D_prime_za = derive_fonction_F(za,omegam0, omegaDE0, Or);
		D_prime_zb = derive_fonction_F(zb,omegam0, omegaDE0, Or);
		if (D_prime_za*D_prime_zb<0){
			//z_prime est la racine de la dÃ©rivÃ© de E(x)  (E'(x)) sur [0, infini). c'est donce l'extremum (minimum) de E(x) sur [0, infini)
			z_prime = Number(dichotomie_EN(0, zb,derive_fonction_F,0,ex,w0,w1))-0.001;

			//si on a E(z_prime)>0 alors E(x) n'a pas de racines et donc aucune contrainte se manifÃ¨ste pour les intÃ©grales. On conserve zb
			if (fonction_F(z_prime,omegam0, omegaDE0, Or,w0,w1)>0){
				res = [za,0];    //0 va Ãªtre un indicateur qu'on utilisera plus tard qui confirme l'absence des contraintes possibles.
				return res;
			}

			//si on a E(z_prime)=0 alors E(x) possÃ¨de une racine. Une contrainte se manifÃ¨ste, zb->z_prime les intÃ©grales sont dÃ©finit sur [0, z_prime)
			else if(fonction_F(z_prime,omegam0, omegaDE0, Or,w0,w1)==0){
				res = [z_prime, 1]; //1 va confirmer la prÃ©sence de contraintes
				return res;
			}

			////si on a E(z_prime)<0 alors E(x) possÃ¨de 2 racines. On prend la premiÃ¨re z_pr. intÃ©grales sont dÃ©finit sur [0, z_pr)
			else{
				z_pr = Number(dichotomdichotomie_ENie(z_prime, zb,fonction_F,0,ex))-0.001;
				res = [z_pr,1];
				return res;
			}
		}
		else{
			//le temps cosmologiques ne peut être calculés
			if(fonction_F(za,omegam0, omegaDE0, Or,w0,w1)*fonction_F(zb,omegam0, omegaDE0, Or,w0,w1)<0){
				z_pr = Number(dichotomie_EN(za, zb,fonction_F,0,ex,w0,w1));
				res = [1/0,1];
				return res;
			}
			else{
				return res = [za,0];
			}
		}
	}
}


//########### DICHOTOMIE     outil mathÃ©matique fondamental:   DICHOTOMIE  POUR "T"   zc varie et le choix de la fonction_integrale dÃ©pend de la valeur z

function dichotomie_L_EN(BornInf, BornSup, cible, ex){
	z_inf = BornInf;
    z_sup = BornSup;

	initial_a = Number(z_inf);
	dm_z_inf = simpson_EN(0, 0.99999, cv_fonction_integrale_EN, omegam0, Number(omegaDE0), Number(Or),Eps,w0,w1);

	initial_a = Number(z_sup);
   	dm_z_sup = simpson_EN(0, 0.99999, cv_fonction_integrale_EN, omegam0, Number(omegaDE0), Number(Or),Eps,w0,w1);

   	 j = 0;
   	 while (j<500){
   	         zc = (z_inf+z_sup)/2.0;

   	         initial_a = Number(zc);
   	         dm_zc = simpson_EN(0, 0.99999, cv_fonction_integrale_EN, omegam0, Number(omegaDE0), Number(Or),Eps,w0,w1);
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


//formules pour dm basÃ© sur omegak0
function Sk_sin_x_EN(bornSup, omegam0, omegaDE0, Or, eps,w0,w1){

    integ = Math.sqrt( Math.abs(omegak0)) * simpson_EN(0, bornSup, fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), eps,w0,w1);
    return (c/(H0parsec*Math.sqrt( Math.abs(omegak0) ))) * Math.sin(integ);
  }

function Sk_x_EN(bornSup, omegam0, omegaDE0, Or, eps,w0,w1){
    return (c/(H0parsec) * simpson_EN(0, bornSup, fonction_dm_EN, omegam0, Number(omegaDE0), Number(Or), eps,w0,w1));
  }

function Sk_sinh_x_EN(bornSup, omegam0, omegaDE0, Or, eps,w0,w1){
    integ = Math.sqrt( Math.abs(Number(omegak0))) * simpson_EN(0, Number(bornSup), fonction_dm_EN, Number(omegam0), Number(omegaDE0), Number(Or), eps,w0,w1);
    return (c/(H0parsec*Math.sqrt( Math.abs(Number(omegak0)) ))) * Math.sinh(integ);
  }


//choix de la formule pour calculer dm
function formule_z_EN(omegak0){
		//dé¨ermine les formules qui sont utilent pour la distance metrique, omegak positif 0 ou negatif
	if (omegak0>0){
	  return Sk_sin_x_EN;

		}
	else if (omegak0===0){
	  return Sk_x_EN;

		}
	else{

	  return Sk_sinh_x_EN;
	}
}



function fonction_F(x, omegam0, omegaDE0, Or,w0,w1){
	let omegak0 = 1 - Or - omegam0 - omegaDE0;
  return omegaDE0 *  Math.exp(-3 * (1 + w0 + w1) * Math.log(1/(1 + x)) - 3 * w1 * (1 - 1/(1 + x))) + omegak0 * (Math.pow((1 + x), 2)) + omegam0 * (Math.pow((1 + x), 3)) + Or * (Math.pow((1 + x), 4));
}


function fonction_integrale_EN(x, omegam0, omegaDE0, Or,w0,w1) {
	
	//let w0 = Number(document.getElementById("omega0_annexes").value);
	//let w1 = Number(document.getElementById("omega1_annexes").value);
   
	let omegak0 = 1 - Or - omegam0 - omegaDE0;
	return (1 / (H0enannee * (1.0 + x))) * Math.pow(omegaDE0 *  Math.exp(-3 * (1 + w0 + w1) * Math.log(1/(1 + x)) - 3 * w1 * (1 - 1/(1 + x))) + omegak0 * (Math.pow((1 + x), 2)) + omegam0 * (Math.pow((1 + x), 3)) + Or * (Math.pow((1 + x), 4)) ,(-1.0 / 2));
  }

function cv_fonction_integrale_EN(l, omegam0, omegaDE0, Or,w0,w1) {
	x = initial_a + l / (1 - l);
	return fonction_integrale_EN(x, omegam0, omegaDE0, Or,w0,w1) * 1 / Math.pow(1 - l, 2);
  }
  

function fonction_dm_EN(x, omegam0, omegaDE0, Or,w0,w1) { // c'est bizarre mais c'est F(x)^-1/2
	
	//let w0 = Number(document.getElementById("omega0_annexes").value);
	//let w1 = Number(document.getElementById("omega1_annexes").value);
	let omegak0 = 1 - Or - omegam0 - omegaDE0;

	return Math.pow(omegaDE0 *  Math.exp(-3 * (1 + w0 + w1) * Math.log(1/(1 + x)) - 3 * w1 * (1 - 1/(1 + x))) + omegak0 * (Math.pow((1 + x), 2)) + omegam0 * (Math.pow((1 + x), 3)) + Or * (Math.pow((1 + x), 4)) ,(-1.0 / 2));
  }
  

function derive_fonction_F(x, omegam0, omegaDE0, Or,w0,w1){
	//let w0 = Number(document.getElementById("omega0_annexes").value);
	//let w1 = Number(document.getElementById("omega1_annexes").value);
   
	let omegak0 = 1 - Or - omegam0 - omegaDE0;
  return omegaDE0 * (Math.exp(-3 * (1 + w0 + w1) * Math.log(1/(1 + x)) - 3 * w1 * (1 - 1/(1 + x)))*(x+1)*(3*(1+w0+w1)-3*w1*(x+1))) +2* omegak0 * (1 + x) + 3*omegam0 * (Math.pow((1 + x), 2)) + 4*Or * (Math.pow((1 + x), 3));

}




// les fonctions simpson en ajoutteant w0,w1, ligne 1 c'est expliqué pourquoi ! 
function simpson_EN(bornInf, bornSup, fonction, omegam0, omegalambda0, Or, eps,w0,w1) {
	var whole = inetgrate_area_simpson_EN(bornInf, bornSup, fonction, omegam0, omegalambda0, Or,w0,w1);
	return recursive_asr_EN(bornInf, bornSup, fonction, omegam0, omegalambda0, Or, eps, whole,w0,w1);
  }
  
  function inetgrate_area_simpson_EN(bornInf, bornSup, fonction, omegam0, omegalambda0, Or,w0,w1) {
  
	var centre = (bornInf + bornSup) / 2.0;
	var h3 = Math.abs(bornSup - bornInf) / 6.0;
	return h3 * (fonction(bornInf, omegam0, omegalambda0, Or,w0,w1) + 4.0 * fonction(centre, omegam0, omegalambda0, Or,w0,w1) + fonction(bornSup, omegam0, omegalambda0, Or,w0,w1));
  
  }
  
  function recursive_asr_EN(bornInf, bornSup, fonction, omegam0, omegalambda0, Or, eps, whole,w0,w1) {
	var centre = (bornInf + bornSup) / 2.0;
	var gauche = inetgrate_area_simpson_EN(bornInf, centre, fonction, omegam0, omegalambda0, Or,w0,w1);
	var droite = inetgrate_area_simpson_EN(centre, bornSup, fonction, omegam0, omegalambda0, Or,w0,w1);
	if (Math.abs(gauche + droite - whole) <= 15 * eps) {
	  return gauche + droite + (gauche + droite - whole) / 15.0;
	}
	else {
	  if (!isNaN(gauche + droite)) {
		return recursive_asr_EN(bornInf, centre, fonction, omegam0, omegalambda0, Or, eps / 2.0, gauche,w0,w1) + recursive_asr_EN(centre, bornSup, fonction, omegam0, omegalambda0, Or, eps / 2.0, droite,w0,w1);
	  }
	}
  }
  