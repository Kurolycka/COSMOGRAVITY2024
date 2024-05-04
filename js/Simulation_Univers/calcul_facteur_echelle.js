// Déclaration des variables globales
let c = Number(document.getElementById("c_p").value);
let G = Number(document.getElementById("G_p").value);
let h = Number(document.getElementById("h_p").value);
let k = Number(document.getElementById("k_p").value);
let T0 = document.getElementById("T0").value;
let H0 = document.getElementById("H0").value;
let texte = o_recupereJson();
let H0parsec = calcul_H0parsec(H0);

/**
 * Première équation caractéristique du facteur d'échelle. La dérivée première de a à un temps t
 * @param a {number} La valeur de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée de a en ce temps
 */
function equa_diff_1(t, a) {
    // On récupère les valeurs des omégas
    let Omegam0 = Number(document.getElementById("omegam0").value);
    let Omegal0 = Number(document.getElementById("omegalambda0").value);
    let Omegar0 = calcul_Omegar(h, c, k, T0, H0parsec);
    let Omegak0 = Number(document.getElementById("resultat_omegak0").innerHTML);

    let a_carre = math.pow(a, 2)

    let temp = -(Omegar0 / a_carre) + (Omegam0 / a) + Omegal0 * a_carre + Omegak0
    return math.pow(temp, 1/2)
}

/**
 * Deuxième équation caractéristique du facteur d'échelle. La dérivée seconde de a à un temps t
 * @param a {number} La valeur de a au temps indiqué
 * @param ap {number} La valeur de la dérivée de a au temps indiqué
 * @param t {number} La valeur du temps
 * @returns {number} La valeur de la dérivée seconde de a en ce temps
 */
function equa_diff_2(t, a, ap) {
    // On récupère les valeurs des omégas
    let Omegam0 = Number(document.getElementById("omegam0").value);
    let Omegal0 = Number(document.getElementById("omegalambda0").value);
    let Omegar0 = calcul_Omegar(h, c, k, T0, H0parsec);

    let a_carre = math.pow(a, 2)
    let a_cube = math.pow(a,3)
    return -(Omegar0 / a_cube) - 0.5 * (Omegam0 / a_carre) + Omegal0 * a_carre
}

function tau_to_temps(tau, H0) {
    return  (tau / H0) + t0
}

/**
 * Fonction permettant de calculer le facteur d'échelle en fonction du temps
 * @param equa_diff_1 {function} Fonction qui décrit la première dérivée du facteur d'échelle en fonction de tau
 * @param equa_diff_2 {function} Fonction qui décrit la deuxième dérivée du facteur d'échelle en fonction de tau
 * @return Liste des abscisses ou la fonction a été calculée et liste des valeurs de la fonction.
 */
function calcul_facteur_echelle(equa_diff_1, equa_diff_2) {
    //on recupere les valeurs des variables
    let a_min = Number(document.getElementById("a_min").value);
    let a_max = Number(document.getElementById("a_max").value);


    // On initie les listes qui vont stocker les solutions et autres variables
    let pas = 1e-6;
    let tau;
    let facteur_echelle;
    let tau_init = 0;
    // Valeur de a à tau initial
    let a_init = 1
    // Dérivée de a à tau initial
    let ap_init = 1;

    /* on crée des solutions sur un gros intervalle de a pour estimer :
        - L'âge minimal et l'âge maximal de l'univers
        - une condition initiale qui correspond si jamais celle de base ne va pas
     */
    let Solutions_neg = RungeKuttaEDO1(-pas, tau_init, a_init, equa_diff_1, 0, 1000);
    let Solutions_pos = RungeKuttaEDO1(pas, tau_init, a_init, equa_diff_1, 0, 1000);
    let Solutions = fusion_solutions(Solutions_neg, Solutions_pos)
    tau = Solutions[0];
    facteur_echelle = Solutions[1];

    // On fait les changements nécessaires sur la condition initiale si besoin
    if (a_min > 1) {
        for (const a of facteur_echelle) {
            if (a > a_min) {
                let index = facteur_echelle.indexOf(a)
                tau_init = tau[index]
                a_init = a
                ap_init = equa_diff_1(tau_init, a_init)
            }
        }
    }

    if (1 > a_max) {
        let facteur_echelle_reversed = facteur_echelle.reverse()
        for (const a of facteur_echelle_reversed) {
            if (a < a_max) {
                let index = facteur_echelle.indexOf(a)
                tau_init = tau[index]
                a_init = a
                ap_init = equa_diff_1(tau_init, a_init)
            }
        }
    }

    Solutions_neg = RungeKuttaEDO1(-pas, tau_init, a_init, equa_diff_1, a_min, a_max);
    Solutions_pos = RungeKuttaEDO1(pas, tau_init, a_init, equa_diff_1, a_min, a_max);
    return fusion_solutions(Solutions_neg, Solutions_pos)
}

