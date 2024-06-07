//1 récuperer valeurs paramètres comsologiques
//?same que sur le graph donc pas besoin de modifier
    //2 Entrées
        /* 
        T0
        H0
        omegaM
        omegalambda
        type univers
        universplat
        */
    //2 Sorties
        /*
        omegaK
        omegaR
        rhoLambda
        rhoM
        rhoR
        */

//1 valeur valeur de paramètre de z1 z2
    //2 paramètre cosmologiques 
        //3 T H Omegas
    //2 géometrie
        //3 distance métrique 
        //3 temps   
        //3 dz/dt
    //2 photometrie

function affichage_des_z(){
    //on recupere les valeurs de z1 et z2
    z1 = Number(document.getElementById("z1").value);
    z2 = Number(document.getElementById("z2").value);
    if (z1<=-1) {
        return messagebox(texte.page_univers_calculs.message_z1_incorrect,"z1 >-1");}
    if (z2<=-1) {
        return messagebox(texte.page_univers_calculs.message_z2_incorrect,"z2 >-1");}}


function parametre_cosmologique_des_z(z1,z2){

}

function geometrie_des_z(z1,z2){
    //200 calcul du dm
    dm1=DistanceMetrique(fonction_E,0,z1,true);
    dm2=DistanceMetrique(fonction_E,0,z2,true);
    //223
    //calcul de la distance du diametre apparent et distance lumiere
	dda = dm1 / (1 + Number(z1));
	dl = dm1 * (1 + (z1));

	dda_2 = dm2 / (1+ Number(z2));
	dl_2 = dm2 * (1+ Number(z2));

	Le = 4 * pi() * Ie;
	Ee = Le / (4 * pi() * Math.pow(dl,2));
	Ee_2 = Le / (4* pi() * Math.pow(dl_2,2));

    
}

function photometrie_des_z(z1,z2){

}


//1 diamètre apparent
    //2 pareil cherche pas

//1 photometrie
    //2 pareil cherche pas

//1 Calcul inverse
    //2 avec dm
    //2 avec t

//1 generateur de graphique
    //2 distance
    //2 omegas
    //2 t(z) z(t)

//1 Calcul horizons cosmologiques
    //2 particules et evenements