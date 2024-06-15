/**
 * Méthode de résolution d'équations différentielles d'ordre 2 grâce à la méthode de Runge-Kutta d'ordre 4
 * @param {number} pas pas utilisé pour la méthode
 * @param xn {number} paramètre initial ou on connait la valeur de la fonction à déterminer
 * @param yn {number} valeur de la fonction à déterminer au paramètre initial. Cette valeur doit être
 * comprise entre a_min et a_max
 * @param ypn {number} valeur de la dérivée fonction à déterminer au paramètre initial.
 * @param fonctionCarac {function} Équation caractéristique du système qui ne doit dépendre que :
 *      - Du paramètre de la fonction inconnue
 *      - De la fonction inconnue
 *      - De la dérivée de la fonction inconnue
 * Dans cet ordre, pas plus pas moins.
 * déterminer, de sa dérivée première et de son paramètre, pas plus pas moins.

 * @return liste de 3 valeurs : [x_n+1, y_n+1, y'_n+1]
 */
function RungeKuttaEDO2(pas, xn, yn, ypn, fonctionCarac) {
    let k1 = 0;
    let k2 = 0;
    let k3 = 0;
    let k4 = 0;

    let yn1 = 0;
    let ypn1 = 0;
    let xn1 = 0

    k1 = fonctionCarac(xn, yn, ypn);
    k2 = fonctionCarac(xn + pas/2, yn + 0.5 * pas * ypn, ypn + 0.5 * pas * k1);
    k3 = fonctionCarac(xn + pas/2, yn + 0.5 * pas * ypn + pas * pas * 0.25 * k1, ypn + 0.5 * pas * k2);
    k4 = fonctionCarac(xn + pas, yn + pas * ypn + pas * pas * 0.5 * k2, ypn + pas * k3);

    ypn1 = ypn + (pas / 6) * (k1 + 2*k2 + 2*k3 + k4);
    yn1 = yn + pas * ypn + (pas * pas / 6) * (k1 + k2 + k3);
    xn1 = xn + pas

    return [xn1, yn1, ypn1]
}


/**
 * Fonction qui permet de fusionner les solutions qui ont un pas négatif avec les solutions qui ont un pas positif
 * @param solutions_neg {[number[], number[]]} solution avec un pas négatif
 * @param solutions_pos {[number[], number[]]} solution avec un pas positif
 * @returns {*[]} solution avec un pas négatif et positif
 */
function fusion_solutions(solutions_neg, solutions_pos) {
    solutions_neg[0].reverse()
    solutions_neg[0].pop()
    solutions_neg[1].reverse()
    solutions_neg[1].pop()
    return [solutions_neg[0].concat(solutions_pos[0]),
            solutions_neg[1].concat(solutions_pos[1])]
}

/**
 * Méthode d'intégration de simpson qui divise l'intervalle d'intégration en subdivision et interpole un polynôme
 * dans chacune de ces subdivisions.
 * @param fonction {function} Fonction ne dépendant que d'un seul paramètre
 * @param borne_inf {number} Borne inférieure d'intégration.
 * @param borne_sup {number} Borne supérieure d'intégration
 * @param subdivisions {number} Nombre de subdivisions à créer
 * @returns {number} Valeur de l'intégrale
 */
function simpson_composite(fonction, borne_inf, borne_sup, subdivisions=100) {
    let pas = (borne_sup - borne_inf) / subdivisions;
    let x = borne_inf;
    let integrale = 0;
    for (let j = 0; j < subdivisions; j = j + 1) {
        integrale = integrale + fonction(x) + 4 * fonction(x + (pas / 2)) + fonction(x + pas);
        x = x + pas;
    }
    return (pas / 6) * integrale;
}

function secante(fonction, x0, x1, precision) {
    let xn = x0;
    let xn1 = x1;
    let xn2;

    let deltaX, deltaF;
    let fn = fonction(xn) * fonction(xn);
    let fn1 = fonction(xn1) * fonction(xn1);
    let iteration = 0

    while (iteration < 20 && Math.abs(fn) > precision) {
        console.log("les x", xn, xn1)
        fn = fonction(xn)
        fn1 = fonction(xn1)
        console.log("les f", fn, fn1)
        deltaX = xn1 - xn
        deltaF = fn1 - fn
        xn2 = xn1 - ( (deltaX / deltaF) * fn1 )

        xn = xn1
        xn1 = xn2
        iteration = iteration + 1
    }
    return xn2
}

//faudra changer le nom quand j'aurais supprimer le bisection root finder nul
function Dichotomie_Remy(fonction, cible, borneDebut, borneFin, precision){
    let iterations_max=200;
    let iterations=0

    if (fonction(borneDebut)<fonction(borneFin)){
        while (Math.abs(borneFin - borneDebut) > precision && iterations<iterations_max){
            iterations = iterations+1;
            var milieu = (borneDebut+borneFin)/2;
            let dm_milieu=fonction(milieu);

            if (cible>dm_milieu){
                borneDebut= milieu;
            }else if (cible<dm_milieu){
                borneFin = milieu;
            }else{
                return milieu
            };
        };
    }else{//pour le cas où la fonction est décroissante
        
        while (Math.abs(borneFin - borneDebut) > precision && iterations<iterations_max){
            iterations = iterations+1;
            var milieu = (borneDebut+borneFin)/2;
            let dm_milieu=fonction(milieu);
            
            if (cible<dm_milieu){
                borneDebut= milieu;
            }else if (cible>dm_milieu){
                borneFin = milieu;
            }else{
                return milieu
            };
        };
        
    };
    return milieu;
};
