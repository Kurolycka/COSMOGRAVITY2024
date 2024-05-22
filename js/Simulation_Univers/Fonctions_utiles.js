// Variables globales, utilisées un peu partout
const AU = 149597870000;

let w0 = Number(document.getElementById("omega0").value)
let w1 = Number(document.getElementById("omega1").value)

let c = Number(document.getElementById("c_p").value);
let h = Number(document.getElementById("h_p").value);
let k = Number(document.getElementById("k_p").value);
let T0 = document.getElementById("T0").value;
let H0 = document.getElementById("H0").value;

function Omega_r(z) {
    if (z === 0) {

    }
}

/**
 * Première fonction facilitant l'écriture des expression.
 * Par défaut, w0 = -1, w1 = 0. Cela correspond au modèle LCDM
 * @param x {number} Paramètre de la fonction
 * @param w0 {number} Premier coefficient
 * @param w1 {number} Deuxième coefficient
 * @return {number} Valeur de la fonction
 */
function fonction_Y(x, w0 = -1, w1 = 0) {
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
function derivee_fonction_Y(x, w0 = -1, w1 = 0) {
    return -3 * (1 + w0 + w1) * fonction_Y(x)
}

function fonction_F(x, w0 = -1, w1 = 0) {

}