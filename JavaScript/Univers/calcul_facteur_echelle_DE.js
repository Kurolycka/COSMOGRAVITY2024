/*
Ce fichier est le javascript principal de la page constante cosmologique de la partie univers. Elle permet de calculer
le facteur d'échelle dans le cas du modèle DE.
 */


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
    let texte = o_recupereJson();

    let H0 = document.getElementById("H0").value;
    let H0parGAnnee = H0_parGAnnees(H0)

    //on recupere les valeurs des variables
    let a_min = Number(document.getElementById("a_min").value);
    let a_max = Number(document.getElementById("a_max").value);

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

        let t_0 = calcul_ages(fonction_simplifiant_1, H0parGAnnee, 1e-10, 1)

        let t_min = calcul_ages(fonction_simplifiant_1, H0parGAnnee, 1e-10, a_min)
        let tau_min = H0parGAnnee * (t_min - t_0)

        let t_max = calcul_ages(fonction_simplifiant_1, H0parGAnnee, 1e-10, a_max)
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
        if ( (isNaN(tau_min) || isNaN(tau_max)) && !isNaN(t_0) ) {
            console.log("Pas calculé avec t_0")
            pas = t_0 * 1e-3
        } else {
            console.log("Pas calculé grossèrement")
            pas = 1e-3
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
    let nombre_point = 0;

    // Résolution dans le sens négatif
    while (set_solution[1] >= a_min && set_solution[1] <= a_max && nombre_point <= 10/Math.abs(pas)) {
        set_solution = RungeKuttaEDO2(-pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
        if (set_solution[1] >= a_min && set_solution[1] <= a_max) {
            taus.push(set_solution[0])
            facteur_echelle.push(set_solution[1])
        }
        nombre_point = nombre_point + 1
        console.log(set_solution, nombre_point)
    }

    // On inverse pour que les listes commencent avec le tau le plus petit puis on réinitialise les conditions initiales
    taus.reverse()
    facteur_echelle.reverse()
    set_solution = [params[0], params[1], params[2]];
    nombre_point = 0;

    // Résolution dans le sens positif
    while (set_solution[1] >= a_min && set_solution[1] <= a_max && nombre_point <= 10/Math.abs(pas)) {
        set_solution = RungeKuttaEDO2(pas, set_solution[0], set_solution[1], set_solution[2], equa_diff_2)
        if (set_solution[1] >= a_min && set_solution[1] <= a_max) {
            taus.push(set_solution[0])
            facteur_echelle.push(set_solution[1])
        }
        nombre_point = nombre_point + 1
        console.log(set_solution, nombre_point)
    }

    // On calcule le temps associé à l'instant présent et si il n'est pas définis on le met à zéro
    let t_0 = calcul_ages(fonction_simplifiant_1, H0parGAnnee, 1e-10, 1);

    if (isNaN(t_0) || Math.abs(t_0) === Infinity) {
        console.log("t0 théorique est NaN")
        t_0 = 0
    } else {
        console.log("t0 n'est pas NaN")
        t_0 = t_0 / (nbrJours() * 24 * 3600 * 1e9)
    }

    let debutEtFin = debut_fin_univers(equa_diff_2, t_0)

    taus = tauEnTemps(taus, debutEtFin[2])


    console.log("Liste temps :", taus)
    console.log("Liste facteur :", facteur_echelle)

    return [[taus, facteur_echelle], t_0, debutEtFin]
}

function affichage_site_DE() {
    let equa_diff_1 = equa_diff_1_DE
    let equa_diff_2 = equa_diff_2_DE
    let fonction_1 = fonction_F
    let fonction_2 = fonction_Y

    let sorties = calcul_facteur_echelle_DE(equa_diff_1, equa_diff_2, fonction_1, fonction_2)
    let donnee = sorties[0]

    let age_univers = sorties[1]
    let debutEtFin = sorties[2]
    console.log("Timeline :", debutEtFin, age_univers)
    console.log("Omega DE/k/m/r :", Omega_DE(0), Omega_k(0), Omega_m(0), Omega_r(0))

    graphique_facteur_echelle(donnee, debutEtFin[2], debutEtFin[3])
}
