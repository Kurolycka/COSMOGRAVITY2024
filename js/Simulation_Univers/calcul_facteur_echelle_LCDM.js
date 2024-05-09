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
    function integrande(u) {
        let terme_1 = Math.pow(u, -1)
        let terme_2 = Math.sqrt(fonction(u))

        return terme_1 * Math.pow(terme_2 , -1);
    }
    return (1 / H0) * simpson_composite(integrande, 0.00000001, 0.999999999, 100);
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

    // On calcule t0 pour en déduire un pas raisonnable pour la résolution grossière
    let t_0 = calcul_age_univers(fonction_simplifiant, H0parsec);
    t_0 = t_0 / (365.25 * 24 * 3600 * 1e9)
    console.log("t0 =", t_0)
    let pas = 0.001 * t_0;

    /* on crée des solutions sur un gros intervalle de a pour estimer :
        - l'âge maximal de l'univers
        - une condition initiale qui correspond si jamais celle de base ne va pas
     */
    let Solution_neg = RungeKutta_D1_D2(-pas, tau_init, a_init, ap_init, equa_diff_1, equa_diff_2, 0, 100);
    let Solution_pos = RungeKutta_D1_D2(pas, tau_init, a_init, ap_init, equa_diff_1, equa_diff_2, 0, 100);
    let Solution = fusion_solutions(Solution_neg, Solution_pos);
    tau = Solution[0];
    facteur_echelle = Solution[1];

    // on créer une liste des facteurs d'échelle inversée pour faire les tests dans les 2 sens en même temps
    let facteur_echelle_original = facteur_echelle;
    let facteur_echelle_reversed = facteur_echelle.slice().reverse();


    // On fait les changements nécessaires sur la condition initiale si besoin et on récupère un t_min et un t_max qui correspondent
    // à a_min et a_max
    let tau_max;
    let tau_max_recup = true
    let tau_min;
    let tau_min_recup = true
    let CI_recup = true
    for (const t of tau) {
        let index = tau.indexOf(t);
        let a_sensPos = facteur_echelle_original[index];
        let a_sensNeg = facteur_echelle_reversed[index];


        if (a_min > 1 && a_sensPos > a_min && CI_recup) {
            tau_init = tau[index];
            a_init = a_sensPos;
            ap_init = equa_diff_1(tau_init, a_init);
            CI_recup = false
            console.log("CI a_min > 1", tau_init, a_init, ap_init)
        }

        if (a_max < 1 && a_sensNeg < a_max && CI_recup) {
            tau_init = tau[index];
            a_init = a_sensNeg;
            ap_init = equa_diff_1(tau_init, a_init);
            CI_recup = false
            console.log("CI a_max < 1", tau_init, a_init, ap_init)
        }

        if (a_sensPos > a_max && tau_max_recup) {
            tau_max = tau[index - 1]
            console.log("tau_max=", tau_max)
            tau_max_recup = false

        }

        if (a_sensNeg < a_min && tau_min_recup) {
            tau_min = tau[tau.length - index]
            console.log("tau_min=", tau_min)
            tau_min_recup = false
        }
    }

    pas = (tau_max - tau_min) * 1e-3
    console.log(-pas, tau_init, a_init, ap_init, a_min, a_max)
    Solution_neg = RungeKutta_D1_D2(-pas, tau_init, a_init, ap_init, equa_diff_1, equa_diff_2, a_min, a_max);
    Solution_neg[0].pop()
    Solution_neg[1].pop()

    Solution_pos = RungeKutta_D1_D2(pas, tau_init, a_init, ap_init, equa_diff_1, equa_diff_2, a_min, a_max);
    Solution_pos[0].pop()
    Solution_pos[1].pop()
    
    Solution = fusion_solutions(Solution_neg, Solution_pos);

    for (let index = 0; index < Solution[0].length; index = index + 1) {
        Solution[0][index] = Solution[0][index] / (H0parsec * (365.25 * 24 * 3600 * 1e9))
        Solution[0][index] = Solution[0][index] + t_0
    }

    return Solution
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

    let abscisse = solution[0];
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
     * Fonction facilitant l'écriture des expression dans le cas du modlèle LCDM. On a fait la substitution u = 1 / (1 + x)
     * @param u {number} Paramètre de la fonction
     * @return {number} Valeur de la fonction
     */
    function fonction_E(u) {
        let Omegam0 = Number(document.getElementById("omegam0").value);
        let Omegal0 = Number(document.getElementById("omegalambda0").value);
        let Omegar0 = Number(document.getElementById("resultat_omegar0").innerHTML);
        let Omegak0 = Number(document.getElementById("resultat_omegak0").innerHTML);

        // On calcule les terme 1 à 1 par soucis de clareté
        let terme_1 = Omegar0 * Math.pow(u, -4);
        let terme_2 = Omegam0 * Math.pow(u, -3);
        let terme_3 = (1 - Omegam0 - Omegal0 - Omegar0) * Math.pow(u, -2);
        return terme_1 + terme_2 + terme_3 + Omegal0;
    }

    let donnee = calcul_facteur_echelle_LCDM(equa_diff_1, equa_diff_2, fonction_E)
    graphique_facteur_echelle(donnee)
}
