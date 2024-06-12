/*
Ce fichier javascript a pour but de rassembler toutes les fonctions qui sont utilisé dans les javascript
"calcul_facteur_echelle_xxx et calculette_xxx"
 */


// Variables globales, utilisées un peu partout
const AU = 149597870700; // en mètres

let T0 = Number(document.getElementById("T0").value)
let H0 = Number(document.getElementById("H0").value);
let c = Number(document.getElementById("c").value);
let h = Number(document.getElementById("h").value);
let G = Number(document.getElementById("G").value);
let k = Number(document.getElementById("k").value);


/**
 * Fonction permettant de récupérer le nombre de jours par ans en fonction du type d'année sélectionné
 * @return {number} Le nombre de jour par ans
 */
function nbrJours() {
    typeAnnee = document.getElementById("typeAnnee").value
    switch (typeAnnee) {
        case 'Sidérale':
            return 365.256363051;
        case 'Julienne':
            return 365.25;
        case 'Tropique (2000)':
            return 365.242190517;
        default:
            return 365.2425;
    }
}

/**
 * Fonction permettant de convertir H0 des km / s / Mpc vers les s
 * @param H0 {number} H0 en kilomètre par seconde par Mégaparsec
 * @return {number} H0 en par secondes
 */
function H0_parSecondes(H0) {
    // Conversion des kilomètre en mètre
    let H0_convertis = H0 * 1000

    // Conversion des Mégaparsec en mètres
    H0_convertis = H0_convertis / ( (648000 / Math.PI ) * AU * 1000000)

    return H0_convertis
}

/**
 * Fonction permettant de convertir H0 des km / s / Mpc vers les Ga
 * @param H0 {number} H0 en kilomètre par seconde par Mégaparsec
 * @return {number} H0 en par GigaAnnées
 */
function H0_parGAnnees(H0) {
    // Conversion des kilomètre en mètre
    let H0_convertis = H0 * 1000

    // Conversion des Mégaparsec en mètres
    H0_convertis = H0_convertis / ( (648000 / Math.PI ) * AU * 1000000)

    // Conversion des secondes en GAnnées
    let nombreDeJours = nbrJours()
    let secondesParAns = nombreDeJours * 24 * 3600 * Math.pow(10, 9)
    H0_convertis = H0_convertis * secondesParAns

    return H0_convertis
}


/**
 * Fonction permettant de calculer Oméga_r en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_r(z) {
    let omega_r

    // Si z = 0 on renvoie le calcul direct de omega_r0 sinon on le calcule en fonction de omega_r0
    let sigma = ( 2 * Math.pow(Math.PI, 5) * Math.pow(k, 4) ) / ( 15 * Math.pow(h, 3) * Math.pow(c, 2) );
    if (z === 0) {
        let rho_r = ( 4 * sigma * Math.pow(T0, 4) ) / Math.pow(c, 3)
        omega_r = ( 8 * Math.PI * G * rho_r) / ( 3 * Math.pow(H0_parSecondes(H0), 2) )
    }
    else {
        omega_r = ( Omega_r(0) * Math.pow(1 + z, 4) ) / fonction_E(z);
    }


    if (document.getElementById("optionsOmégar0").options[0].selected) {
        omega_r = omega_r * 1.6913
    }
    if (document.getElementById("optionsOmégar0").options[2].selected) {
        omega_r = 0
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionR") {
            omega_r = 1
        } else {
            omega_r = 0
        }
    }

    return omega_r
}


/**
 * Fonction permettant de calculer Oméga_m en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_m(z) {
    let omega_m;

    if (z === 0) {
        omega_m = Number(document.getElementById("Omégam0").value)
    }
    else {
        omega_m = Omega_m(0) * Math.pow(1 + z, 3) / fonction_E(z);
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionM") {
            omega_m = 1
        } else {
            omega_m = 0
        }
    }

    return omega_m
}


/**
 * Fonction permettant de calculer Oméga_l en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_l(z) {
    let omega_l;

    if (z === 0) {
        omega_l = Number(document.getElementById("Omégal0").value)
    }
    else {
        omega_l = Omega_l(0) / fonction_E(z);
    }

    if (document.getElementById("OptionsOmégak0").checked) {
        omega_l = 1 - Omega_m(z) - Omega_r(z)
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionLDE") {
            omega_l = 1
        } else {
            omega_l = 0
        }
    }

    return omega_l
}


/**
 * Fonction permettant de calculer Oméga_DE en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_DE(z) {
    let omega_de;

    if (z === 0) {
        omega_de = Number(document.getElementById("OmégaDE0").value)
    }
    else {
        omega_de = Omega_DE(0) *  fonction_Y(z) * (1/(1+z))	/ fonction_F(z);
    }

    if (document.getElementById("OptionsOmégak0").checked) {
        omega_de = 1 - Omega_m(z) - Omega_r(z)
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionLDE") {
            omega_de = 1
        } else {
            omega_de = 0
        }
    }

    return omega_de
}


/**
 * Fonction permettant de calculer Oméga_k en fonction du décalage spectral
 * @param z {number} décalage spectral
 * @return {number} la valeur du oméga
 */
function Omega_k(z) {
    let omega_k;

    if (document.getElementById("Omégal0")) {
        omega_k = 1 - Omega_r(z) - Omega_l(z) - Omega_m(z)
    }

    if (document.getElementById("OmégaDE0")) {
        omega_k = 1 - Omega_r(z) - Omega_DE(z) - Omega_m(z)
    }

    if (document.getElementById("OptionsOmégak0").checked) {
        omega_k = 0
    }

    let option = document.getElementById("optionsMonofluide").value
    if ( option !== "optionNull" ) {
        if (option === "optionK") {
            omega_k = 1
        } else {
            omega_k = 0
        }
    }

    return omega_k
}

/**
 * Fonction facilitant l'écriture des expression dans le cas du modlèle LCDM. On a fait la substitution u = 1 / (1 + x)
 * afin que les bornes d'intégrations soient finies
 * @param u {number} Paramètre de la fonction
 * @param z_utilisé {Boolean} Pour choisir si le calcul se fait avec les a (false par defaut) ou z (true)
 * @return {number} Valeur de la fonction
 */
function fonction_E(u, z_utilisé=false) {
    let Omegam0 = Omega_m(0);
    let Omegar0 = Omega_r(0);
    let Omegal0 = Omega_l(0);
    let terme_1;
    let terme_2;
    let terme_3;

    // On calcule les terme 1 à 1 par soucis de clareté
    if (z_utilisé){
        terme_1 = Omegar0 * Math.pow(1+u, 4);
        terme_2 = Omegam0 * Math.pow(1+u, 3);
        terme_3 = (1 - Omegam0 - Omegal0 - Omegar0) * Math.pow(1+u, 2);
    }else{
        terme_1 = Omegar0 * Math.pow(u, -4);
        terme_2 = Omegam0 * Math.pow(u, -3);
        terme_3 = (1 - Omegam0 - Omegal0 - Omegar0) * Math.pow(u, -2);
    };
    return terme_1 + terme_2 + terme_3 + Omegal0;
}

/**
 * Première fonction facilitant l'écriture des expression dans le modèle DE.
 * Par défaut, w0 = -1, w1 = 0.
 * @param x {number} Paramètre de la fonction
 * @return {number} Valeur de la fonction
 */
function fonction_Y(x) {
    let w0 = Number(document.getElementById("w0").value) // sans unité
    let w1 = Number(document.getElementById("w1").value) // sans unité

    // On calcule les termes 1 à 1 par soucis de clareté
    let terme_1 = -3 * ( 1 + w0 + w1 ) * Math.log(x);
    let terme_2 = -3 * w1 * (1 - x)

    return Math.exp(terme_1 + terme_2)
}

/**
 * Dérivée analytique de la fonction Y(x). On aurait pu utiliser une approximation numérique mais
 * ça aurait été moins précis
 * @param x {number} Paramètre de la fonction
 * @param w0 {number} Premier coefficient
 * @param w1 {number} Deuxième coefficient
 * @return {number} Valeur de la fonction
 */
function derivee_fonction_Y(x) {
    let w0 = Number(document.getElementById("w0").value) // sans unité
    let w1 = Number(document.getElementById("w1").value) // sans unité

    let terme_1 = - 3 * (1 + w0 + w1) * (1 / x)
    let terme_2 = 3 * w1
    return ( terme_1 + terme_2 ) * fonction_Y(x)
}

/**
 * Deuxième fonction facilitant l'écriture des expression dans le cas du modlèle DE. On a fait la substitution u = 1 / (1 + x)
 * @param u {number} Paramètre de la fonction
 * @param z_utilisé {Boolean} Pour choisir si le calcul se fait avec les a (false par defaut) ou z (true)
 * @return {number} Valeur de la fonction
 */
function fonction_F(u,z_utilisé) {
    let Omegak0 = Omega_k(0)
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let OmegaDE0 = Omega_DE(0)
    let terme_1;
    let terme_2;
    let terme_3;
    let terme_4;

    if (z_utilisé){
        terme_1 = Omegak0 * Math.pow(1+u, 2)
        terme_2 = Omegam0 * Math.pow(1+u, 3)
        terme_3 = Omegar0 * Math.pow(1+u, 4)
        terme_4 = OmegaDE0 * fonction_Y(Math.pow(1+u, -1))
    }else{
        terme_1 = Omegak0 * Math.pow(u, -2)
        terme_2 = Omegam0 * Math.pow(u, -3)
        terme_3 = Omegar0 * Math.pow(u, -4)
        terme_4 = OmegaDE0 * fonction_Y(u)
    };
    return terme_1 + terme_2 + terme_3 + terme_4
}

/**
 * Première équation caractéristique du facteur d'échelle. La dérivée première de a à un temps t. Dans le cas LCDM
 * @param a {number} La valeur de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée de a en ce temps
 */
function equa_diff_1_LCDM(t, a) {
    let Omegak0 = Omega_k(0)
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let Omegal0 = Omega_l(0)

    let a_carre = a * a;
    let terme_1 = (Omegar0 / a_carre)
    let terme_2 = (Omegam0 / a)
    let terme_3 = Omegal0 * a_carre
    let terme_4 = Omegak0;

    return Math.sqrt(terme_1 + terme_2 + terme_3 + terme_4);
}

/**
 * Deuxième équation caractéristique du facteur d'échelle. La dérivée seconde de a à un temps t. Dans le cas LCDM
 * @param a {number} La valeur de a au temps indiqué
 * @param ap {number} La valeur de la dérivée de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée seconde de a en ce temps
 */
function equa_diff_2_LCDM(t, a, ap) {
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let Omegal0 = Omega_l(0)

    let a_carre = a * a;
    let a_cube = a * a * a;

    let terme_1 = - (Omegar0 / a_cube)
    let terme_2 = - 0.5 * (Omegam0 / a_carre)
    let terme_3 = Omegal0 * a;

    return terme_1 + terme_2 + terme_3;
}

/**
 * Première équation caractéristique du facteur d'échelle dans le cas DE.
 * C'est la dérivée première de a à un temps t
 * @param a {number} La valeur de a au temps indiqué
 * @param t {number} La valeur du temps
 * Ne doit dépendre que d'un paramètre
 * @returns {number} La valeur de la dérivée de a en ce temps
 */
function equa_diff_1_DE(t, a) {
    let Omegak0 = Omega_k(0)
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let OmegaDE0 = Omega_DE(0)

    let a_carre = a * a

    let terme_1 = Omegar0 / a_carre
    let terme_2 = Omegam0 / a
    let terme_3 = OmegaDE0 * a_carre * fonction_Y(a)
    let terme_4 = Omegak0

    return Math.sqrt(terme_1 + terme_2 + terme_3 + terme_4)
}

/**
 * Deuxième équation caractéristique du facteur d'échelle dans le cas DE.
 * C'est la dérivée seconde de a à un temps t
 * @param a {number} La valeur de a au temps indiqué
 * @param ap {number} La valeur de la dérivée de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée seconde de a en ce temps
 */
function equa_diff_2_DE(t, a, ap) {
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let OmegaDE0 = Omega_DE(0)


    let a_carre = a * a
    let a_cube = a * a * a
    let terme_1 = - (Omegar0 / a_cube)
    let terme_2 = - 0.5 * (Omegam0 / a_carre)
    let terme_3 = OmegaDE0 * (a * fonction_Y(a) + 0.5 * a_carre * derivee_fonction_Y(a))

    return terme_1 + terme_2 + terme_3
}

/**
 * Fonction permettant de déterminer si l'univers à un début ou une fin. Si ce n'est pas le cas, renvoie un string
 * précisant pourquoi il n'y a pas de début/fin de l'univers
 * @param equa_diff {function} Fonction caractéristique de l'EDO2 du modèle
 * @return Soit les temps de naissance/mort soit un string explicant pourquoi il n'y a pas de naissance/mort
 */
function debut_fin_univers(equa_diff) {
    let texte = o_recupereJson()
    let H0 = Number(document.getElementById("H0").value);

    // Déclaration des variables et des valeurs retournée
    let set_solution = [0, 1 ,1]
    let save_set_solution;
    let pas = 1e-4 * H0 / Math.abs(H0)
    let limite = Math.abs(1000000 / pas)
    let nombre_point = 0
    let option = document.getElementById("optionsMonofluide").value

    let naissance_univers;
    let mort_univers;
    let age_debut;
    let age_fin;


    // Recherche a = 0 ou da/dtau = Infinity dans le sens négatif
    while (set_solution[1] >= 0 && (Math.abs(set_solution[1]) <= +Infinity || Math.abs(set_solution[2]) <= +Infinity) && nombre_point <= 5/Math.abs(pas)) {
        save_set_solution = set_solution
        set_solution = RungeKuttaEDO2(-pas, set_solution[0], set_solution[1], set_solution[2], equa_diff)
        nombre_point = nombre_point + 1
    }

    // Si le dernier set de solution contient des valeurs non définies on utilise celui du pas précédent
    if ( (isNaN(set_solution[1]) && isNaN(set_solution[2])) ) {
        set_solution = save_set_solution
    }

    // On récupère le maximum entre la valeur du facteur d'échelle et la dérivée du facteur d'échelle
    let max = Math.max(Math.abs(set_solution[1]), Math.abs(set_solution[2]))

    if ( option === "optionLDE" || ( max <= limite && set_solution[1] > 1 ) ) {
        naissance_univers = texte.univers.pasDebut
    }
    else {
        age_debut = set_solution[0] / H0_parGAnnees(H0)

        if (set_solution[1] <= 1) {
            naissance_univers = texte.univers.Debut + "BigBang " + Math.abs(age_debut).toExponential(4) + " Ga"
        }

        if ( max >= limite ) {
            naissance_univers = texte.univers.Debut + "BigFall " + Math.abs(age_debut).toExponential(4) + " Ga"
        }
    }






    // On réinitialise
    set_solution = [0, 1, 1];
    nombre_point = 0;

    // Recherche a = 0 / da/dtau = Infinity dans le sens positif
    while (set_solution[1] >= 0 && (Math.abs(set_solution[1]) <= +Infinity || Math.abs(set_solution[2]) <= +Infinity) && nombre_point <= 5/Math.abs(pas)) {
        save_set_solution = set_solution
        set_solution = RungeKuttaEDO2(pas, set_solution[0], set_solution[1], set_solution[2], equa_diff)
        nombre_point = nombre_point + 1
    }

    if ( isNaN(set_solution[1]) || isNaN(set_solution[2]) ) {
        set_solution = save_set_solution
        set_solution = save_set_solution
    }

    // On récupère le maximum entre la valeur du facteur d'échelle et la dérivée du facteur d'échelle
    max = Math.max(Math.abs(set_solution[1]), Math.abs(set_solution[2]))

    if ( option === "optionLDE" || ( max <= limite && set_solution[1] > 1 ) ) {
        mort_univers = texte.univers.pasMort
    }
    else {
        age_fin = set_solution[0] / H0_parGAnnees(H0)

        if (set_solution[1] <= 1) {
            mort_univers = texte.univers.Mort + "BigCrunch " + Math.abs(age_fin).toExponential(4) + " Ga"
        }

        if ( max >= limite ) {
            mort_univers = texte.univers.Mort + "BigRip " + Math.abs(age_fin).toExponential(4) + " Ga"
        }
    }

    return [naissance_univers, mort_univers, age_debut, age_fin]
}

/**
 * Fonction permettant de transformer les taux en temps
 * @param listeTaus {[number]} Liste des taux sous forme de nombre
 * @param t_debut {number} age de naissance de l'univers
 * @return La liste des temps
 */
function tauEnTemps(listeTaus, t_debut) {
    let H0 = Number(document.getElementById("H0").value);
    let H0parGAnnee = H0_parGAnnees(H0);

    for (let index = 0; index < listeTaus.length; index = index + 1) {
        listeTaus[index] = listeTaus[index] / H0parGAnnee

        if (t_debut) {
            listeTaus[index] = listeTaus[index] - t_debut
        }
    }

    return listeTaus
}

/**
 * Fonction permettant de calculer l'âge de l'univers
 * @param fonction {function} La fonction qui permet de simplifier l'écriture des relations,
 * ne doit dépendre que d'une variable
 * @param H0 {number} taux d'expansion actuel
 * @param a1 {number}
 * @param a2 {number}
 * @return {number} âge de l'univers.
 */
function calcul_ages(fonction, H0, a1, a2) {
    function integrande(u) {
        let terme_1 = Math.pow(u, -1)
        let terme_2 = Math.sqrt(fonction(u))

        return terme_1 * Math.pow(terme_2 , -1);
    }
    return (1 / H0) * simpson_composite(integrande, a1, a2, 100);
}

//Partie Remy
/** renvoie la fonction Sk pour calculer les distances cosmologiques en fontion de la courbure de l'espace
 * (Univers,simple,DarkEnergy et monofluide)
 * @param {*} x Paramètre d'entré
 * @param {*} OmegaK paramètre de densité de courbure
 * @returns
 */
function Sk(x,OmegaK){
    if (OmegaK>0) { //si k=-1 alors omegaK positif
        return Math.sinh(x);
    }else if(OmegaK<0){//si k=1 alors omegaK négatif
        return Math.sin(x);
    }else{//si k=0 alors omegaK est nul
        return x;
    }
}

/** renvoie la distance métrique entre un photon émis avec un Zemission et recu a une coordonné r avec un Zreception \
 * pour avoir la distance d'un objet observé avec un certain décalge Zemission=0 \
 * pour avoir l'horizon cosmologique des particules Zreception=infini \
 * pour avoir l'horizon cosmologique des évenement Zemission=-1 (dans le futur) \
 * (Univers,simple) \
 * Si les omega et H0 sont définis dans la page pas besoin de les mettre en paramètre : DistanceMetrique(Zemission,Zreception)
 * @param fonction {function} fonction_E ou fonction_F en fonction de si c'est lcdm ou de
 * @param Zemission {number} décalage spectral au moment ou le photon est émis
 * @param Zreception {number} décalage spectral au moment ou le photon est reçu
 * @param z_utilise {boolean} Pour savoir si le calcul est réalisé avec z ou a
 * @returns
 */
function DistanceMetrique(fonction, Zemission, Zreception, z_utilise=false){
    if (z_utilise){
        function fonction_a_integrer(x){
            return Math.pow(fonction(x,true),-0.5);
        }
    } else {
        function fonction_a_integrer(x){
            return Math.pow(fonction(x),-0.5)/Math.pow(x,2);
        }
    }
    return c/(H0_parSecondes(H0)*Math.pow(Math.abs(Omega_k(0)),0.5))*Sk(Math.pow(Math.abs(Omega_k(0)),0.5)*simpson_composite(fonction_a_integrer,Zemission,Zreception,1e4),Omega_k(0))
}

/**
 * Fonction qui renvoie la distance de l'horizon des particules cosmologiques (plus grande distance a laquelle on peut recevoir un signal emis à l'instant t)
 * @param fonction {function} Fonction simplifiant les expressions
 * @param {*} z_emission par defaut = 0 décalage spectral du moment où le signal est émis
 * @returns
 */
function calcul_horizon_particule(fonction,z_emission=0){
    let a_emission=1/(z_emission+1);
    //formule 21 dans la théorie du 20/05/2024
    return DistanceMetrique(fonction,1e-4,a_emission);
}

/**
 * Fonction qui renvoie la distance de l'horizon des évenements cosmologiques (plus grande distance a laquelle on peut envoyer un signal emis à l'instant t)
 * @param fonction {function} Fonction qui simplifie les expressions
 * @param z_reception {number} par defaut = 0 décalage spectral du moment où le signal est reçu
 * @returns
 */
function calcul_horizon_evenements(fonction,z_reception=0){
    //formule 23 dans la théorie du 20/05/2024
    return DistanceMetrique(fonction,-.99999999,z_reception,true);
}

/**
 * Inverse du calcul de l'age en fonction d'un z grâce a la fonction dichotomie (marche seulement pour des fonction absolument croissante)
 * @param {*} temps valeur t
 * @param {*} fonction fonction a rechercher
 * @returns valeur de z
 */
function calcul_t_inverse(temps,fonction){
    //Remy test
    function a_dichotomer(x){
        return calcul_ages(fonction,H0enannee,1e-15,x);
    }
    age_univers=a_dichotomer(1);

    if (age_univers>=temps){
        a_t=Dichotomie_Remy(a_dichotomer,temps,1e-15,1,temps*1e-12);
    }else{
        a_t=Dichotomie_Remy(a_dichotomer,temps,1,1e7,1e-12);

    };

    return (1-a_t)/a_t;
}

/**
 * Fonction permettant de tracer le facteur d'échelle en fonction du temps.
 * @param solution {[number[], number[]]} Liste contenant la liste des temps et les valeurs du facteur d'échelle
 * @param t_debut
 * @param t_fin
 */
function graphique_facteur_echelle(solution, t_debut, t_fin) {
    let texte = o_recupereJson()
    let a_min = Number(document.getElementById("a_min").value)
    let a_max = Number(document.getElementById("a_max").value)

    let H0 = Number(document.getElementById("H0").value);
    let abscisse = solution[0];
    let ordonnee = solution[1];
    if (H0 < 0) {
        abscisse.reverse()
        ordonnee.reverse()
    }

    let facteur_debut = ordonnee[0]
    let facteur_fin = ordonnee[ordonnee.length - 1]


    // Pour corriger l'erreur numérique
    console.log("avant", abscisse)
    if (t_debut) {
        let offset = abscisse[0];
        for (let index = 0; index < abscisse.length; index++) {
            abscisse[index] = abscisse[index] - offset;
        }
    }
    console.log("après", abscisse)


    if ( t_debut && facteur_debut < Math.abs(a_max - a_min) * 1e-1 ) {
        abscisse[0] = 0
        ordonnee[0] = 0
    }

    if (a_min === 0 && t_fin && facteur_fin < Math.abs(a_max - a_min) * 1e-1 ) {
        ordonnee[ordonnee.length - 1] = 0
    }

    let max = ordonnee.reduce((a, b) => Math.max(a, b), -Infinity);
    let min = ordonnee.reduce((a, b) => Math.min(a, b), +Infinity);



    let donnee = [{
        x: abscisse,
        y: ordonnee,
        type: "scatter",
        mode: "lines",
        name: "Facteur d'échelle",
        line: { color: 'purple' }
    }];

    if (t_debut && facteur_debut > Math.abs(a_max - a_min) * 1e-1 ) {
        donnee.push({
            type: 'line',
            x:[0, 0],
            y:[min, max],
            line: {
                color: "black",
                simplify: false,
                shape: 'linear',
                dash: 'dash'
            },
        });
    }

    if (t_fin && facteur_fin > Math.abs(a_max - a_min) * 1e-1 ) {
        let x_assymptote;
        if (t_fin && t_debut) {
            x_assymptote = Math.abs(Math.abs(t_fin) + Math.abs(t_debut))
        } else {
            x_assymptote = t_fin
        }
        donnee.push({
            type: 'line',
            x:[x_assymptote, x_assymptote],
            y:[min, max],
            line: {
                color: "black",
                simplify: false,
                shape: 'linear',
                dash: 'dash'
            },
        });
    }

    let apparence = {
        title: {
            text: "Tracé du facteur d'échelle",
            font: {
                family: 'Arial black, sans-serif',
                size: 16,
                color: '#111111'
            },
            xref: 'paper',
            x: 0.55
        },
        xaxis: {
            title: "Temps en milliard d'années",
            gridcolor: "#b1b1b1",
            zerolinewidth: 2,
            zeroline: true
        },
        yaxis: {
            title: "facteur d'échelle réduit",
            gridcolor: "#b1b1b1",
            zerolinewidth: 2,
            zeroline: true
        },
        showlegend: false,

        autosize: true,
        margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
        },
        plot_bgcolor: "rgba(255,255,255,0)",
        paper_bgcolor: "rgba(255,255,255,0)"
    };

    let configuration = {
        responsive: true
    };

    if (document.getElementById("graphique_LCDM")) {
        Plotly.newPlot("graphique_LCDM", donnee, apparence, configuration);
    }

    if (document.getElementById("graphique_DE")) {
        Plotly.newPlot("graphique_DE", donnee, apparence, configuration);
    }

    updateUnivers()
}


