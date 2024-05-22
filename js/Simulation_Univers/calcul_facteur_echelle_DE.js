/**
 * Première fonction facilitant l'écriture des expression dans le cas du modlèle DE.
 * @param x {number} Paramètre de la fonction
 * @return {number} Valeur de la fonction
 */
function fonction_Y(x) {
    let w0 = Number(document.getElementById("omega0").value)
    let w1 = Number(document.getElementById("omega1").value)

    // On calcule les termes 1 à 1 par soucis de clareté
    let terme_1 = -3 * ( 1 + w0 + w1 ) * Math.log(x);
    let terme_2 = -3 * w1 * (1 - x)

    return Math.exp(terme_1 + terme_2)
}

/**
 * Dérivée analytique de la fonction Y(x). On aurait pu utiliser une approximation numérique mais
 * ça aurait été moins précis
 * @param x {number} Paramètre de la fonction
 * @return {number} Valeur de la fonction
 */
function derivee_fonction_Y(x) {
    let w0 = Number(document.getElementById("omega0").value)
    let w1 = Number(document.getElementById("omega1").value)

    return -3 * (1 + w0 + w1) * fonction_Y(x)
}

/**
 * Deuxième fonction facilitant l'écriture des expression dans le cas du modlèle DE.
 * @param x {number} Paramètre de la fonction
 * @return {number} Valeur de la fonction
 */
function fonction_F(x) {
    let Omegam0 = Number(document.getElementById("omegam0").value)
    let OmegaDE0 = Number(document.getElementById("omegaDE0").value)
    let Omegak0 = Number(document.getElementById("resultat_omegak0").value)
    let Omegar0 = Number(document.getElementById("resultat_omegar0").value)

    let terme_1 = Omegak0 * Math.pow(1 + x, 2)
    let terme_2 = Omegam0 * Math.pow(1 + x, 3)
    let terme_3 = Omegar0 * Math.pow(1 + x, 4)
    let terme_4 = OmegaDE0 * fonction_Y(Math.pow(1 + x, -1))

    return terme_1 + terme_2 + terme_3 + terme_4
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
    let Omegam0 = Number(document.getElementById("omegam0").value)
    let OmegaDE0 = Number(document.getElementById("omegaDE0").value)
    let Omegak0 = Number(document.getElementById("resultat_omegak0").value)
    let Omegar0 = Number(document.getElementById("resultat_omegar0").value)

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
    let Omegam0 = Number(document.getElementById("omegam0").value)
    let OmegaDE0 = Number(document.getElementById("omegaDE0").value)
    let Omegar0 = Number(document.getElementById("resultat_omegar0").value)

    console.log(OmegaDE0, Omegar0, Omegam0)

    let a_carre = a * a
    let a_cube = a * a * a
    let terme_1 = - (Omegar0 / a_cube)
    let terme_2 = - 0.5 * (Omegam0 / a_carre)
    let terme_3 = OmegaDE0 * (a * fonction_Y(a) + 0.5 * a_carre * derivee_fonction_Y(a))

    return terme_1 + terme_2 + terme_3
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
 * @param fonction_simplifiant_1 Fonction utilisé dans l'expression de F et des équations différentielles
 * @param fonction_simplifiant_2 Fonction utilisée dans le calcul des âges.
 * @return Liste des abscisses ou la fonction a été calculée et liste des valeurs de la fonction.
 */
function calcul_facteur_echelle_DE(equa_diff_1, equa_diff_2, fonction_simplifiant_1, fonction_simplifiant_2) {
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
        let pas;
        let tau_init = 0;
        let a_init = 1;
        let ap_init = 1;

        let t_0 = calcul_ages(fonction_simplifiant_1, H0parGAnnee, 0, 1e12)

        let z_min = (1 - a_min) / a_min
        let t_min = calcul_ages(fonction_simplifiant_1, H0parGAnnee, z_min, 1e12)
        let tau_min = H0parGAnnee * (t_min - t_0)

        let z_max = (1 - a_max) / a_max
        let t_max = calcul_ages(fonction_simplifiant_1, H0parGAnnee, z_max, 1e12)
        let tau_max = H0parGAnnee * (t_max - t_0)

        if (a_min > 1 && !isNaN(tau_min)) {
            tau_init = tau_min
            a_init = a_min
            ap_init = equa_diff_1(tau_min, a_init)
        }

        if (a_max < 1 && !isNaN(tau_max)) {
            tau_init = tau_max
            a_init = a_max
            ap_init = equa_diff_1(tau_max, a_init)
        }

        // On calcule le pas qui sera utilisé
        if ( (isNaN(tau_min) || isNaN(tau_max)) && !isNaN(t_0)) {
            console.log("Pas calculé avec t_0")
            pas = t_0 * 1e-3
        } else {
            pas = 1e-2
        }

        if (!isNaN(tau_min) && !isNaN(tau_max)) {
            console.log("Pas calculé avec tau_min - tau_max")
            pas = Math.abs(tau_max - tau_min) * 1e-3
        }

        console.log("les taus :", t_min, t_0, t_max)

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
        console.log(set_solution)
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
        console.log(set_solution)
    }

    // On calcule le temps associé à l'instant présent et si il n'est pas définis on le met à zéro
    let t_0 = calcul_ages(fonction_simplifiant_1, H0parsec, 0, 1e12);
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

    Plotly.newPlot("graphique_sombre", donnee, apparence);
}

function affichage_site_DE() {
    let donnee = calcul_facteur_echelle_DE(equa_diff_1_DE, equa_diff_2_DE, fonction_F, fonction_Y)
    graphique_facteur_echelle(donnee)
}
