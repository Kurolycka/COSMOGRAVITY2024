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
        omega_r = ( 8 * Math.PI * G * rho_r) / ( 3 * Math.pow(H0, 3) )
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
 * Fonction permettant de déterminer si l'univers à un début ou une fin. Si ce n'est pas le cas, renvoie un string
 * précisant pourquoi il n'y a pas de début/fin de l'univers
 * @param equa_diff {function} Fonction caractéristique de l'EDO2 du modèle
 * @param t_0 {number} Age actuel de l'univers
 * @return Soit les temps de naissance/mort soit un string explicant pourquoi il n'y a pas de naissance/mort
 */
function debut_fin_univers(equa_diff, t_0) {
    let H0 = Number(document.getElementById("H0").value);

    // Déclaration des variables et des valeurs retournée
    let set_solution = [0, 1 ,1]
    let save_set_solution;
    let pas = 1e-4 * H0 / Math.abs(H0)
    let limite_derivee = Math.abs(100000 / pas)
    let nombre_point = 0

    let naissance_univers;
    let mort_univers;
    let age_debut;
    let age_fin;


    // Recherche a = 0 / da/dtau = Infinity dans le sens négatif
    while (set_solution[1] >= 0 && (Math.abs(set_solution[1]) <= +Infinity || Math.abs(set_solution[2]) <= +Infinity) && nombre_point <= 5/Math.abs(pas)) {
        save_set_solution = set_solution
        set_solution = RungeKuttaEDO2(-pas, set_solution[0], set_solution[1], set_solution[2], equa_diff)
        nombre_point = nombre_point + 1
    }

    // Si le dernier set de solution contient des valeurs non définies on utilise celui du pas précédent
    if ( (isNaN(set_solution[1]) && isNaN(set_solution[2])) ) {
        console.log("Le set de solution saved a été utilisé (sens neg)", set_solution, save_set_solution)
        set_solution = save_set_solution
    }
    console.log(set_solution)

    /*
    Si :
        la valeur de a est plus grande que 1 (arbitraire)
        et
        la valeur de da/dtau est 10^11 fois plus grande que le pas
    on :
        Dit que l'univers n'a pas de point de naissance

    sinon :
        On récupère le tau du set de solution et on le transforme en temps
        Si :
            c'est la valeur de a qui est plus petite ou égale a 1
        on :
            Dit que l'univers a commencé avec un BigBang

        Si :
            c'est la valeur de da/dtau qui est trop grande
        on :
            Dit que l'univers a commencé avec un BigFall
    */
    if ( set_solution[1] > 1 && (Math.abs(set_solution[1]) <= limite_derivee || Math.abs(set_solution[2]) <= limite_derivee)) {
        naissance_univers = "Pas de naissance de l'univers"
    }
    else {
        age_debut = set_solution[0] / H0_parGAnnees(H0)

        if (set_solution[1] <= 1) {
            naissance_univers = "L'univers est né il y a " + Math.abs(age_debut).toExponential(4) + " Milliard d'année (BigBang)"
        }

        if ((Math.abs(set_solution[1]) >= limite_derivee || Math.abs(set_solution[2]) >= limite_derivee)) {
            naissance_univers = "L'univers est né il y a " + Math.abs(age_debut).toExponential(4) + " Milliard d'année (BigFall)"
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
        console.log("Le set de solution saved a été utilisé (sens pos)", set_solution, save_set_solution)
        set_solution = save_set_solution
        set_solution = save_set_solution
    }
    console.log(set_solution)

    /*
    Si :
        la valeur de a est plus grande que 1 (arbitraire)
        et
        la valeur de da/dtau est 10^11 fois plus grande que le pas
    on :
        Dit que l'univers n'a pas de point de mort

    sinon :
        On récupère le tau du set de solution et on le transforme en temps
        Si :
            c'est la valeur de a qui est plus petite ou égale a 1
        on :
            Dit que l'univers se finit avec un BigCrunch

        Si :
            c'est la valeur de da/dtau qui est trop grande
        on :
            Dit que l'univers se finit avec un BigRip
    */
    if ( set_solution[1] > 1 && (Math.abs(set_solution[1]) <= limite_derivee || Math.abs(set_solution[2]) <= limite_derivee)) {
        mort_univers = "Pas de mort de l'univers"
    }
    else {
        age_fin = set_solution[0] / H0_parGAnnees(H0)

        if (set_solution[1] <= 1) {
            mort_univers = "L'univers va mourir dans " + Math.abs(age_fin).toExponential(4) + " Milliard d'année (BigCrunch)"
        }

        if ((Math.abs(set_solution[1]) >= limite_derivee || Math.abs(set_solution[2]) >= limite_derivee)) {
            mort_univers = "L'univers va mourir dans " + Math.abs(age_fin).toExponential(4) + " Milliard d'année (BigRip)"
        }
    }

    return [naissance_univers, mort_univers, age_debut, age_fin]
}

/**
 * Fonction permettant de transformer les taux en temps
 * @param listeTaus {[number]} Liste des taux sous forme de nombre
 * @param t_debut {number} age de naissance de l'univers
 * @param t_fin {number} age de mort de l'univers
 * @param t_0 {number} age théorique actuel de l'univers
 * @return La liste des temps
 */
function tauEnTemps(listeTaus, t_debut) {
    let H0 = Number(document.getElementById("H0").value);
    let H0parGAnnee = H0_parGAnnees(H0);

    for (let index = 0; index < listeTaus.length; index = index + 1) {
        listeTaus[index] = listeTaus[index] / H0parGAnnee

        if (t_debut) {
            listeTaus[index] = listeTaus[index] + Math.abs(t_debut)
        }
    }

    return listeTaus
}

/**
 * Fonction permettant de tracer le facteur d'échelle en fonction du temps.
 * @param solution {[number[], number[]]} Liste contenant la liste des temps et les valeurs du facteur d'échelle
 * @param t_debut
 * @param t_fin
 */
function graphique_facteur_echelle(solution, t_debut, t_fin) {
    let H0 = Number(document.getElementById("H0").value);
    let abscisse = solution[0];
    let ordonnee = solution[1];

    let facteur_debut;
    let facteur_fin;
    if (H0 > 0) {
        facteur_debut = ordonnee[0]
        facteur_fin = ordonnee[ordonnee.length - 1]
    } else {
        facteur_debut = ordonnee[ordonnee.length - 1]
        facteur_fin = ordonnee[0]
    }

    // Pour corriger l'erreur numérique
    if (t_debut && abscisse[0] < 0) {
        let offset = Math.abs(abscisse[0]);
        for (let index = 0; index < abscisse.length; index++) {
            abscisse[index] = abscisse[index] + offset;
        }
    }

    if (t_debut && facteur_debut < 0.5) {
        console.log("correction ordonnée gauche")
        if (H0 > 0) {
            ordonnee[0] = 0
        } else {
            ordonnee[ordonnee.length - 1] = 0
        }
    }

    if (t_fin && facteur_fin < 0.5) {
        console.log("correction ordonné droite")
        if (H0 > 0) {
            ordonnee[ordonnee.length - 1] = 0
        } else {
            ordonnee[0] = 0
        }
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

    if (t_debut && facteur_debut > 0.5) {
        console.log("test assymptote 1", t_debut, facteur_debut)
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

    if (t_fin && facteur_fin > 0.5) {
        console.log("test assymptote 2", t_debut, Math.abs(ordonnee[ordonnee.length - 1]))
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
}


