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
    // On convertis H0 en GigaAnnée ^ -1
    let H0parGAnnee = H0parsec * (365.25 * 24 * 3600 * 1e9)

    //on recupere les valeurs des variables
    let a_min = Number(document.getElementById("ami").value);
    let a_max = Number(document.getElementById("ama").value);

    /**
     * Fonction qui permet de :
     *      - Redéfinir les conditions initiales
     *      - Calcule l'intervale de temps de résolution et en déduis un pas raisonnable
     */
    function bornes_temps_CI() {

        // on commence par initier les conditions initiales
        let pas;
        let tau = 0;
        let a = 1;
        let ap = 1;

        // on recalcule les CI si nécéssaire donc dans le cas ou 1 n'est pas dans [a_min; a_max]
        let set_solution = [0, 1, 1];
        let a_depart = 1;

        if (a_min > 1) {
            console.log("Passage par a_min > 1")
            while (set_solution[1] >= 1 && set_solution[1] <= a_min) {
                set_solution = RungeKuttaEDO2(pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
                console.log(set_solution)
            }
        }

        if (a_max < 1) {
            console.log("Passage par a_max < 1")
            while (set_solution[1] >= a_max && set_solution[1] <= 1) {
                set_solution = RungeKuttaEDO2(-pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
                console.log(set_solution)
            }
        }

        // On conserve les valeurs des CI
        let tau_init = set_solution[0]
        let a_init = set_solution[1]
        let ap_init = set_solution[2]

        // On initialise et on récupère tau_min
        set_solution = [tau_init, a_init, ap_init]
        console.log("CI pour résolution grossière sens pos", set_solution)

        while (set_solution[1] >= a_min && set_solution[1] <= a_max) {
            set_solution = RungeKuttaEDO2(-pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
            console.log(set_solution)
        }
        let tau_min = set_solution[0]

        // On réinitialise et on récupère tau_max
        set_solution = [tau_init, a_init, ap_init]
        while (set_solution[1] >= a_min && set_solution[1] <= a_max) {
            set_solution = RungeKuttaEDO2(pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
            console.log(set_solution)
        }
        let tau_max = set_solution[0]

        // On calcule le pas qui sera utilisé
        pas = Math.abs(tau_max - tau_min) * 1e-3

        return [tau_init, a_init, ap_init, pas]
    }

    let params = bornes_temps_CI();
    console.log("Paramètres sortant de borne et CI", params)

    let set_solution = [params[0], params[1], params[2]];
    let pas = params[3];
    let taus = [set_solution[0]]
    let facteur_echelle = [set_solution[1]]

    // Résolution dans le sens négatif
    while (set_solution[1] >= a_min && set_solution[1] <= a_max) {
        set_solution = RungeKuttaEDO2(-pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
        taus.push(set_solution[0])
        facteur_echelle.push(set_solution[1])
    }

    // On inverse pour que les listes commencent avec le tau le plus petit puis on réinitialise les conditions initiales
    taus.reverse()
    facteur_echelle.reverse()
    set_solution = [params[0], params[1], params[2]];

    // Résolution dans le sens positif
    while (set_solution[1] >= a_min && set_solution[1] <= a_max) {
        set_solution = RungeKuttaEDO2(pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
        taus.push(set_solution[0])
        facteur_echelle.push(set_solution[1])
    }

    // On calcule le temps associé à l'instant présent et si il n'est pas définis on le met à zéro
    let t_0 = calcul_ages(fonction_simplifiant, H0parsec, 1e-8, 0.999999999);
    if (isNaN(t_0)) {
        console.log("t0 est NaN")
        t_0 = 0
    } else {
        console.log("t0 n'est pas NaN")
        t_0 = t_0 / (365.25 * 24 * 3600 * 1e9)
    }

    // On transforme les taux en temps
    for (let index = 0; index < taus.length; index = index + 1) {
        taus[index] = taus[index] / H0parGAnnee
        taus[index] = taus[index] + t_0
    }

    taus.pop()
    facteur_echelle.pop()

    taus.shift()
    facteur_echelle.shift()
    console.log("Liste temps :", taus)
    console.log("Liste facteur :", facteur_echelle)

    return [taus, facteur_echelle]
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
        type: "scatter", // Change 'line' to 'scatter'
        mode: "lines", // Change 'line' to 'lines'
        name: "Facteur d'échelle",
        line: {color: 'purple'} // Change 'marker' to 'line' for line color
    }];

    let apparence = {
        title: {
            text: "Tracé du facteur facteur d'échelle",
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

    Plotly.newPlot("test.graphique", donnee, apparence);
}

function affichage_site() {
    /**
     * Fonction facilitant l'écriture des expression dans le cas du modlèle LCDM. On a fait la substitution u = 1 / (1 + x)
     * afin que les bornes d'intégrations soient finies
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
