/*
Ce fichier javascript a pour but de rassembler toutes les fonctions qui sont utilisé dans les javascript
"calcul_facteur_echelle_xxx et calculette_xxx"
 */


// Variables globales, utilisées un peu partout
const AU = 149597870700; // en mètres

let T0 = Number(document.getElementById("T0").value)
let H0 = Number(document.getElementById("H0").value);
let c = Number(document.getElementById("c_p").value);
let h = Number(document.getElementById("h_p").value);
let G = Number(document.getElementById("G_p").value);
let k = Number(document.getElementById("k_p").value);


/**
 * Fonction permettant de récupérer le nombre de jours par ans en fonction du type d'année sélectionné
 * @return {number} Le nombre de jour par ans
 */
function nbrJours() {
    typeAnnee = document.getElementById("typeannee").value
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
        omega_r = ( 8 * Math.PI * G * rho_r) / ( 3 * Math.pow(H0, 3) )
    }
    else {
        omega_r = ( Omega_r(0) * Math.pow(1 + z, 4) ) / fonction_E(z);
    }


    if (document.getElementById("liste").options[0].selected) {
        omega_r = omega_r * 1.6913
    }
    if (document.getElementById("liste").options[2].selected) {
        omega_r = 0
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
        omega_m = Number(document.getElementById("omegam0").value)
    }
    else {
        omega_m = Omega_m(0) * Math.pow(1 + z, 3) / fonction_E(z);
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
        omega_l = Number(document.getElementById("omegalambda0").value)
    }
    else {
        omega_l = Omega_l(0) / fonction_E(z);
    }

    if (document.getElementById("univ_plat").checked) {
        omega_l = 1 - Omega_m(z) - Omega_r(z)
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
        omega_de = Number(document.getElementById("omegaDE0").value)
    }
    else {
        omega_de = Omega_DE(0) *  fonction_Y(z) * (1/(1+z))	/ fonction_F(z);
    }

    if (document.getElementById("univ_plat").checked) {
        omega_de = 1 - Omega_m(z) - Omega_r(z)
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

    if (document.getElementById("omegalambda0")) {
        omega_k = 1 - Omega_r(z) - Omega_l(z) - Omega_m(z)
    }

    if (document.getElementById("omegaDE0")) {
        omega_k = 1 - Omega_r(z) - Omega_DE(z) - Omega_m(z)
    }

    if (document.getElementById("univ_plat").checked) {
        omega_k = 0
    }

    return omega_k
}

/**
 * Fonction facilitant l'écriture des expression dans le cas du modlèle LCDM. On a fait la substitution u = 1 / (1 + x)
 * afin que les bornes d'intégrations soient finies
 * @param u {number} Paramètre de la fonction
 * @return {number} Valeur de la fonction
 */
function fonction_E(u) {
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let Omegal0 = Omega_l(0)

    // On calcule les terme 1 à 1 par soucis de clareté
    let terme_1 = Omegar0 * Math.pow(u, -4);
    let terme_2 = Omegam0 * Math.pow(u, -3);
    let terme_3 = (1 - Omegam0 - Omegal0 - Omegar0) * Math.pow(u, -2);
    return terme_1 + terme_2 + terme_3 + Omegal0;
}

/**
 * Première fonction facilitant l'écriture des expression dans le modèle DE.
 * Par défaut, w0 = -1, w1 = 0.
 * @param x {number} Paramètre de la fonction
 * @return {number} Valeur de la fonction
 */
function fonction_Y(x) {
    let w0 = Number(document.getElementById("omega0").value) // sans unité
    let w1 = Number(document.getElementById("omega1").value) // sans unité

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
    let w0 = Number(document.getElementById("omega0").value) // sans unité
    let w1 = Number(document.getElementById("omega1").value) // sans unité

    let terme_1 = - 3 * (1 + w0 + w1) * (1 / x)
    let terme_2 = 3 * w1
    return ( terme_1 + terme_2 ) * fonction_Y(x)
}

/**
 * Deuxième fonction facilitant l'écriture des expression dans le cas du modlèle DE. On a fait la substitution u = 1 / (1 + x)
 * @param u {number} Paramètre de la fonction
 * @return {number} Valeur de la fonction
 */
function fonction_F(u) {
    let Omegak0 = Omega_k(0)
    let Omegam0 = Omega_m(0)
    let Omegar0 = Omega_r(0)
    let OmegaDE0 = Omega_DE(0)

    let terme_1 = Omegak0 * Math.pow(u, -2)
    let terme_2 = Omegam0 * Math.pow(u, -3)
    let terme_3 = Omegar0 * Math.pow(u, -4)
    let terme_4 = OmegaDE0 * fonction_Y(u)

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
 * Fonction permettant de tracer le facteur d'échelle en fonction du temps.
 * @param solution {[number[], number[]]} Liste contenant la liste des temps et les valeurs du facteur d'échelle
 */
function graphique_facteur_echelle(solution) {
    let abscisse = solution[0];
    let ordonnee = solution[1];

    let donnee = [{
        x: abscisse,
        y: ordonnee,
        type: "scatter", // Change 'line' to 'scatter'
        mode: "lines", // Change 'line' to 'lines'
        name: "Facteur d'échelle",
        line: {color: 'purple'} // Change 'marker' to 'line' for line color
    }];

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
            title: "Temps en milliard d'année",
            autorange: true
        },
        yaxis: {
            title: "facteur d'échelle réduit",
            autorange: true
        }
    };

    if (document.getElementById("graphique")) {
        Plotly.newPlot("graphique", donnee, apparence);
    }

    if (document.getElementById("graphique_sombre")) {
        Plotly.newPlot("graphique_sombre", donnee, apparence);
    }
}

