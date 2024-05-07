/**
 * Première équation caractéristique du facteur d'échelle. La dérivée première de a à un temps t
 * @param a {number} La valeur de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée de a en ce temps
 */
function equa_diff_1(t, a) {
    // Déclaration des variables globales
    let c = Number(document.getElementById("c_p").value);
    let G = Number(document.getElementById("G_p").value);
    let h = Number(document.getElementById("h_p").value);
    let k = Number(document.getElementById("k_p").value);
    let T0 = document.getElementById("T0").value;
    let H0 = document.getElementById("H0").value;
    let texte = o_recupereJson();
    let H0parsec = calcul_H0parsec(H0);

    // On récupère les valeurs des omégas
    let Omegam0 = Number(document.getElementById("omegam0").value);
    let Omegal0 = Number(document.getElementById("omegalambda0").value);
    let Omegar0 = Number(calcul_Omegar(h, c, k, T0, H0parsec));
    let Omegak0 = Number(document.getElementById("resultat_omegak0").innerHTML);

    let a_carre = Math.pow(a, 2);

    let temp = -(Omegar0 / a_carre) + (Omegam0 / a) + Omegal0 * a_carre + Omegak0;
    return Math.pow(temp, 1/2);
}

/**
 * Deuxième équation caractéristique du facteur d'échelle. La dérivée seconde de a à un temps t
 * @param a {number} La valeur de a au temps indiqué
 * @param ap {number} La valeur de la dérivée de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée seconde de a en ce temps
 */
function equa_diff_2(t, a, ap) {
    // Déclaration des variables globales
    let c = Number(document.getElementById("c_p").value);
    let G = Number(document.getElementById("G_p").value);
    let h = Number(document.getElementById("h_p").value);
    let k = Number(document.getElementById("k_p").value);
    let T0 = document.getElementById("T0").value;
    let H0 = document.getElementById("H0").value;
    let texte = o_recupereJson();
    let H0parsec = calcul_H0parsec(H0);

    // On récupère les valeurs des omégas
    let Omegam0 = Number(document.getElementById("omegam0").value);
    let Omegal0 = Number(document.getElementById("omegalambda0").value);
    let Omegar0 = calcul_Omegar(h, c, k, T0, H0parsec);

    let a_carre = Math.pow(a, 2);
    let a_cube = Math.pow(a,3);
    return -(Omegar0 / a_cube) - 0.5 * (Omegam0 / a_carre) + Omegal0 * a_carre;
}

/**
 * Permet de convertir les tau en temps
 * @param tau {Number} valeur de tau
 * @param H0 {Number} taux d'expansion actuel
 * @param t0 {Number} temps actuel
 * @return {Number} valeur du temps
 */
function tau_to_temps(tau, H0, t0) {
    return  (tau / H0) + t0;
}

/**
 * Fonction permettant de calculer l'âge de l'univers
 * @param fonction {function} La fonction qui permet de simplifier l'écriture des relations,
 * ne doit dépendre que d'une variable
 * @param H0 {number} taux d'expansion actuel
 * @return {number} âge de l'univers.
 */
function calcul_age_univers(fonction, H0) {
    function integrande(x) {
        let terme_1 = Math.pow((1 + x), -1)
        let terme_2 = Math.sqrt(fonction(x))

        return terme_1 * Math.pow(terme_2 , -1);
    }
    return (1 / H0) * simpson_composite(integrande, 0, 1000, 100);
}

/**
 * Fonction permettant de calculer le facteur d'échelle en fonction du temps
 * @param equa_diff_1 {function} Fonction qui décrit la première dérivée du facteur d'échelle en fonction de tau
 * @param equa_diff_2 {function} Fonction qui décrit la deuxième dérivée du facteur d'échelle en fonction de tau
 * @return Liste des abscisses ou la fonction a été calculée et liste des valeurs de la fonction.
 */
function calcul_facteur_echelle_LCDM(equa_diff_1, equa_diff_2, fonction_simplifiant) {
    // Déclaration des variables globales
    let c = Number(document.getElementById("c_p").value);
    let G = Number(document.getElementById("G_p").value);
    let h = Number(document.getElementById("h_p").value);
    let k = Number(document.getElementById("k_p").value);
    let T0 = document.getElementById("T0").value;
    let H0 = document.getElementById("H0").value;
    let texte = o_recupereJson();
    let H0parsec = calcul_H0parsec(H0);

    //on recupere les valeurs des variables
    let a_min = Number(document.getElementById("ami").value);
    let a_max = Number(document.getElementById("ama").value);


    // On initie les listes qui vont stocker les solutions et autres variables
    let tau;
    let facteur_echelle;

    // Valeur de tau initial
    let tau_init = 0;
    // Valeur de a à tau initial
    let a_init = 1;
    // Dérivée de a à tau initial
    let ap_init = 1;

    // On calcule t0 pour en déduire un pas raisonnable
    let t_0 = calcul_age_univers(fonction_simplifiant, H0parsec);
    t_0 = t_0 / (365.25 * 24 * 3600 * Math.pow(10, 9))
    console.log(t_0)
    let pas = 0.0001 * t_0;

    /* on crée des solutions sur un gros intervalle de a pour estimer :
        - l'âge maximal de l'univers
        - une condition initiale qui correspond si jamais celle de base ne va pas
     */
    let Solutions_neg = RungeKutta_D1_D2(-pas, tau_init, a_init, ap_init, equa_diff_1, equa_diff_2, 0, 100);
    let Solutions_pos = RungeKutta_D1_D2(pas, tau_init, a_init, ap_init, equa_diff_1, equa_diff_2, 0, 100);
    let Solutions = fusion_solutions(Solutions_neg, Solutions_pos);

    tau = Solutions[0];
    facteur_echelle = Solutions[1];

    let facteur_echelle_original = facteur_echelle;
    let facteur_echelle_reversed = facteur_echelle.reverse();

    // On fait les changements nécessaires sur la condition initiale si besoin
    for (const t of tau) {
        let index = tau.indexOf(t);
        let a_sensPos = facteur_echelle_original[index];
        let a_sensNeg = facteur_echelle_reversed[index];

        //tau[index] = tau_to_temps(t, H0parsec, t_0);

        if (a_min > 1 && a_sensPos > a_min) {
            tau_init = tau[index];
            a_init = a_sensPos;
            ap_init = equa_diff_1(tau_init, a_init);
        }

        if (a_max < 1 && a_sensNeg < a_max) {
            tau_init = tau[index];
            a_init = a_sensNeg;
            ap_init = equa_diff_1(tau_init, a_init);
        }
    }

    Solutions_neg = RungeKutta_D1_D2(-pas, tau_init, a_init, ap_init, equa_diff_1, equa_diff_2, a_min, a_max);
    Solutions_pos = RungeKutta_D1_D2(pas, tau_init, a_init, ap_init, equa_diff_1, equa_diff_2, a_min, a_max);
    return fusion_solutions(Solutions_neg, Solutions_pos);
}

/**
 * Fonction permettant de tracer le facteur d'échelle en fonction du temps dans le cas du modlèle LCDM.
 * @param solution {[number[], number[]]} Liste contenant la liste des temps et les valeurs du facteur d'échelle
 */
function graphique_facteur_echelle(solution) {
    // Déclaration des variables globales
    let c = Number(document.getElementById("c_p").value);
    let G = Number(document.getElementById("G_p").value);
    let h = Number(document.getElementById("h_p").value);
    let k = Number(document.getElementById("k_p").value);
    let T0 = document.getElementById("T0").value;
    let H0 = document.getElementById("H0").value;
    let texte = o_recupereJson();
    let H0parsec = calcul_H0parsec(H0);

    let abscisse = temps;
    let ordonnee = solution[1];

    let donnee = [{
        x: abscisse,
        y: ordonnee,
        type: "line",
        mode: "line",
        name: "Facteur d'échelle",
        marker: {color: 'purple'}
    }]

    let apparence = [{
        title: "Tracé du facteur d'échelle réduit en fonction du temps",
        xaxis: {title: "Temps en milliard d'année"},
        yaxis: {title: "facteur d'échelle réduit"}
    }]

    Plotly.newPlot("test.graphique", donnee, apparence)
}

function affichage_site() {
    /**
     * Fonction facilitant l'écriture des expression dans le cas du modlèle LCDM
     * @param x {number} Paramètre de la fonction
     * @return {number} Valeur de la fonction
     */
    function fonction_E(x) {
        let Omegam0 = Number(document.getElementById("omegam0").value);
        let Omegal0 = Number(document.getElementById("omegalambda0").value);
        let Omegar0 = Number(document.getElementById("resultat_omegar0").innerHTML);
        let Omegak0 = Number(document.getElementById("resultat_omegak0").innerHTML);

        // On calcule les terme 1 à 1 par soucis de clareté
        let terme_1 = Omegar0 * Math.pow((1 + x), 4);
        let terme_2 = Omegam0 * Math.pow((1 + x), 3);
        let terme_3 = (1 - Omegam0 - Omegal0 - Omegar0) * Math.pow((1 + x), 2);
        return terme_1 + terme_2 + terme_3 + Omegal0;
    }

    let donnee = calcul_facteur_echelle_LCDM(equa_diff_1, equa_diff_2, fonction_E)
    graphique_facteur_echelle(donnee)
}
