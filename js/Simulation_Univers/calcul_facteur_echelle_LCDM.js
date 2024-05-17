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

    let a_carre = a * a;
    let a_cube = a * a * a;
    return -(Omegar0 / a_cube) - 0.5 * (Omegam0 / a_carre) + Omegal0 * a;
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

/**
 * Fonction permettant de calculer le facteur d'échelle en fonction du temps
 * @param equa_diff_1 {function} Fonction qui décrit la première dérivée du facteur d'échelle en fonction de tau
 * @param equa_diff_2 {function} Fonction qui décrit la deuxième dérivée du facteur d'échelle en fonction de tau
 * @param fonction_simplifiant Fonction qui permet de simplifier l'écriture des expression dans le modèle LCDM
 * @return Liste des abscisses ou la fonction a été calculée et liste des valeurs de la fonction.
 */
function calcul_facteur_echelle_LCDM(equa_diff_1, equa_diff_2, fonction_simplifiant) {
    // Déclaration et initialisation des variables
    let c = Number(document.getElementById("c_p").value);
    let G = Number(document.getElementById("G_p").value);
    let h = Number(document.getElementById("h_p").value);
    let k = Number(document.getElementById("k_p").value);
    let T0 = document.getElementById("T0").value;
    let H0 = document.getElementById("H0").value;
    let texte = o_recupereJson();
    let H0parsec = calcul_H0parsec(H0);
    // On convertis H0 en GigaAnnée ^-1
    let H0parGAnnee = H0parsec * (365.25 * 24 * 3600 * 1e9)

    //on recupere les valeurs des variables
    let a_min = Number(document.getElementById("ami").value);
    let a_max = Number(document.getElementById("ama").value);

    // Valeur de tau initial
    let tau_init = 0;
    // Valeur de a à tau initial
    let a_init = 1;
    // Dérivée de a à tau initial
    let ap_init = 1;
    // Pas pour la résolution
    let pas;
    // Liste pour la solution
    let Solution;

    /**
     * Fonction qui permet de borner le temps en fonction des a_min et a_max ainsi que le type d'univers.
     * Cette fonction exécute simplement un RK4 très très grossier pour trouver les bornes sups et infs de tau qu'on
     * utilisera come tau_max et tau_min
     */
    function bornes_temps_CI() {

        // on commence par initier les conditions initiales
        let pas = 1e-1;
        let tau_init = 0;
        let a_init = 1;
        let ap_init = 1;

        // on recalcule les CI si nécéssaire donc dans le cas ou 1 n'est pas dans [a_min; a_max]
        let a_min_grossier;
        let a_max_grossier;
        let Solution_pos;
        let Solution_neg;

        if (a_min > 1) {
            a_min_grossier = 1
            Solution_pos = RungeKuttaEDO2(pas, tau_init, a_init, ap_init, equa_diff_2, a_min_grossier, a_min)
            tau_init = Solution_pos[0][Solution_pos[1].length - 1]
            a_init = Solution_pos[1][Solution_pos[1].length - 1]
            ap_init = equa_diff_1(tau_init, a_init)
        }

        if (a_max < 1) {
            a_max_grossier = 1
            Solution_neg = RungeKuttaEDO2(-pas, tau_init, a_init, ap_init, equa_diff_2, a_max, a_max_grossier)
            tau_init = Solution_neg[0][Solution_neg[0].length - 1]
            a_init = Solution_neg[1][Solution_neg[1].length - 1]
            ap_init = equa_diff_1(tau_init, a_init)
        }

        console.log("CI", pas,  tau_init, a_init, ap_init)

        Solution_neg = RungeKuttaEDO2(-pas, tau_init, a_init, ap_init, equa_diff_2, a_min, a_max)
        Solution_pos = RungeKuttaEDO2(pas, tau_init, a_init, ap_init, equa_diff_2, a_min, a_max)
        Solution = fusion_solutions(Solution_neg, Solution_pos)
        console.log(Solution)
        let tau_min = Solution[0][1]
        let tau_max = Solution[0][Solution[0].length - 2]

        pas = Math.abs(tau_max - tau_min) * 5e-3

        return [pas, tau_init, a_init, ap_init]
    }

    // On calcule le temps associé à l'instant présent
    let t_0 = calcul_ages(fonction_simplifiant, H0parsec, 1e-8, 0.999999999);
    t_0 = t_0 / (365.25 * 24 * 3600 * 1e9)

    // On détermine les bornes temporelle et conditions initiales
    let params = bornes_temps_CI()
    pas = params[0]
    tau_init = params[1]
    a_init = params [2]
    ap_init = params [3]

    let Solution_neg = RungeKuttaEDO2(-pas, tau_init, a_init, ap_init, equa_diff_2, a_min, a_max);
    Solution_neg[0].pop()
    Solution_neg[1].pop()

    let Solution_pos = RungeKuttaEDO2(pas, tau_init, a_init, ap_init, equa_diff_2, a_min, a_max);
    Solution_pos[0].pop()
    Solution_pos[1].pop()

    Solution = fusion_solutions(Solution_neg, Solution_pos)


    console.log("Solution", Solution)
    console.log("param", params, a_min, a_max)

    // Si le temps de l'instant présent est pas définis on convertis les tau en temps
    if ( !(isNaN(t_0)) ) {
        for (let index = 0; index < Solution[0].length; index = index + 1) {
            Solution[0][index] = Solution[0][index] / H0parGAnnee
            Solution[0][index] = Solution[0][index] + t_0
        }
    }

    console.log("Liste temps :", Solution[0])
    console.log("Liste facteur :", Solution[1])
    let t_min = calcul_ages(fonction_simplifiant, H0parGAnnee, 1e-10, a_min)
    let t_max = calcul_ages(fonction_simplifiant, H0parGAnnee, 1e-10, a_max)
    console.log("t_min et t_max et t_0", t_min, t_max, t_0)

    let a_derivee_nulle = secante(equa_diff_1, 0.1, 1, 1e-8)
    console.log("da/dt = 0", a_derivee_nulle)
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

        title: {
            text: "Tracé du facteur facteur d'échelle",
            font: {
                family: 'Arial black, sans-serif',
                size: 16,
                color: '#111111'
            },
            xref: 'paper',
            x: 0.55,

        },

        xaxis: {
            title: "Temps en milliard d'année",
            autorange: true,

        },
        yaxis: {
            title: "facteur d'échelle réduit",
            autorange: true,
        }
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
