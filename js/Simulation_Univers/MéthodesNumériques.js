/**
 * Méthode de résolution d'équations différentielles d'ordre 1 grâce à la méthode de Runge-Kutta d'ordre 4
 * @param {number} pas pas utilisé pour la méthode
 * @param x0 {number} paramètre initial ou on connait la valeur de la fonction à déterminer
 * @param y0 {number} valeur de la fonction à déterminer au paramètre initial. Cette valeur doit être
 * comprise entre a_min et a_max
 * @param fonctionCarac {function} Équation caractéristique du système qui ne doit dépendre que :
 *      - Du paramètre de la fonction inconnue
 *      - De la fonction inconnue
 * Dans cet ordre, pas plus pas moins.
 * @param y_min {number} valeur maximale que la fonction à déterminer peut prendre
 * @param y_max {number} valeur minimale que la fonction à déterminer peut prendre
 * @return liste des valeurs de la fonction inconnue et des abscisses ou elle a été calculée
 */
function RungeKuttaEDO1(pas, x0, y0, fonctionCarac,
                        y_min= 0, y_max = 5) {
    // Liste stockant les valeurs des abscisses ou on calcule la fonction inconnue
    let ListeX = [x0];
    // Liste stockant les valeurs de la fonction inconnue
    let ListeY = [y0];

    // Les 4 paramètre de runge kutta
    let k1 = 0;
    let k2 = 0;
    let k3 = 0;
    let k4 = 0;

    // Initialisation des variables permettant le calcul
    let xn = x0;
    let yn = y0;
    let yn1 = 0;


    while (ListeY[ListeY.length-1] > y_min && ListeY[ListeY.length-1] < y_max) {
        xn = ListeX[ListeX.length-1];
        yn = ListeY[ListeY.length-1];

        k1 = fonctionCarac(xn, yn);
        k2 = fonctionCarac(xn + pas/2, yn + 0.5 * pas * k1);
        k3 = fonctionCarac(xn + pas/2, yn + 0.5 * pas * k2);
        k4 = fonctionCarac(xn + pas, yn + pas * k3);

        yn1 = yn + (pas / 6) * (k1 + 2*k2 + 2*k3 + k4);

        ListeX.push(xn + pas)
        ListeY.push(yn1)
    }
    return [ListeX, ListeY]
}

/**
 * Méthode de résolution d'équations différentielles d'ordre 2 grâce à la méthode de Runge-Kutta d'ordre 4
 * @param {number} pas pas utilisé pour la méthode
 * @param x0 {number} paramètre initial ou on connait la valeur de la fonction à déterminer
 * @param y0 {number} valeur de la fonction à déterminer au paramètre initial. Cette valeur doit être
 * comprise entre a_min et a_max
 * @param yp0 {number} valeur de la dérivée fonction à déterminer au paramètre initial.
 * @param fonctionCarac {function} Équation caractéristique du système qui ne doit dépendre que :
 *      - Du paramètre de la fonction inconnue
 *      - De la fonction inconnue
 *      - De la dérivée de la fonction inconnue
 * Dans cet ordre, pas plus pas moins.
 * déterminer, de sa dérivée première et de son paramètre, pas plus pas moins.
 * @param y_min {number} valeur maximale que la fonction à déterminer peut prendre
 * @param y_max {number} valeur minimale que la fonction à déterminer peut prendre
 * @return liste des valeurs de la fonction inconnue et des abscisses ou elle a été calculée
 */
function RungeKuttaEDO2(pas, x0, y0, yp0, fonctionCarac,
                        y_min= 0, y_max = 5) {
    let ListeX = [x0];
    let ListeY = [y0];
    let ListeYp = [yp0];
    let k1 = 0;
    let k2 = 0;
    let k3 = 0;
    let k4 = 0;

    let xn = x0;
    let yn = y0;
    let ypn = yp0;
    let yn1 = 0;
    let ypn1 = 0;

    while (ListeY[ListeY.length-1] > y_min && ListeY[ListeY.length-1] < y_max) {
        xn = ListeX[ListeX.length-1];
        yn = ListeY[ListeY.length-1];
        ypn = ListeYp[ListeYp.length-1];

        k1 = fonctionCarac(xn, yn, ypn);
        k2 = fonctionCarac(xn + pas/2, yn + 0.5 * pas * ypn, ypn + 0.5 * pas * k1);
        k3 = fonctionCarac(xn + pas/2, yn + 0.5 * pas * ypn + pas * pas * 0.25 * k1, ypn + 0.5 * pas * k2);
        k4 = fonctionCarac(xn + pas, yn + pas * ypn + pas * pas * 0.5 * k2, ypn + pas * k3);

        ypn1 = ypn + (pas / 6) * (k1 + 2*k2 + 2*k3 + k4);
        yn1 = yn + pas * ypn + (pas * pas / 6) * (k1 + k2 + k3);

        ListeX.push(xn + pas);
        ListeY.push(yn1);
        ListeYp.push(ypn1);
    }
    return [ListeX, ListeY]
}

/**
 * Méthode de résolution d'équations différentielles d'ordre 2 grâce à la méthode de Runge-Kutta d'ordre 4. Cette
 * méthode est à utiliser si on connait la dérivée première et seconde de la fonction à calculer.
 * @param {number} pas pas utilisé pour la méthode
 * @param x0 {number} paramètre initial ou on connait la valeur de la fonction à déterminer
 * @param y0 {number} valeur de la fonction à déterminer au paramètre initial. Cette valeur doit être
 * comprise entre a_min et a_max
 * @param yp0 {number} valeur de la dérivée fonction à déterminer au paramètre initial.
 * @param derivee_premiere {function} dérivée première de la fonction à calculer. Ne doit dépendre que :
 *      - Du paramètre de la fonction à calculer
 *      - De la fonction à calculer
 * Dans cet ordre, pas plus pas moins.
 * @param derivee_seconde {function} dérivée seconde de la fonction à calculer. Ne doit dépendre que :
 *      - Du paramètre de la fonction à calculer
 *      - De la fonction à calculer
 *      - De la dérivée première de la fonction à calculer
 * Dans cet ordre, pas plus pas moins.
 * @param y_min {number} valeur maximale que la fonction à déterminer peut prendre
 * @param y_max {number} valeur minimale que la fonction à déterminer peut prendre
 * @return liste des valeurs de la fonction inconnue et des abscisses ou elle a été calculée
 */
function RungeKutta_D1_D2(pas, x0, y0, yp0, derivee_premiere, derivee_seconde,
                          y_min= 0, y_max = 5) {
    let ListeX = [x0];
    let ListeY = [y0];
    let k1 = 0;
    let k2 = 0;
    let k3 = 0;
    let k4 = 0;

    let xn = x0;
    let yn = y0;
    let ypn = derivee_premiere(x0, y0);
    let yn1 = 0;

    while (ListeY[ListeY.length-1] > y_min && ListeY[ListeY.length-1] < y_max) {
        xn = ListeX[ListeX.length-1];
        yn = ListeY[ListeY.length-1];
        ypn = derivee_premiere(xn, yn);

        k1 = derivee_seconde(xn, yn, ypn);
        k2 = derivee_seconde(xn + pas/2, yn + 0.5 * pas * ypn, ypn + 0.5 * pas * k1);
        k3 = derivee_seconde(xn + pas/2, yn + 0.5 * pas * ypn + pas * pas * 0.25 * k1, ypn + 0.5 * pas * k2);
        k4 = derivee_seconde(xn + pas, yn + pas * ypn + pas * pas * 0.5 * k2, ypn + pas * k3);

        yn1 = yn + pas * ypn + (pas * pas / 6) * (k1 + k2 + k3);

        ListeX.push(xn + pas);
        ListeY.push(yn1);
    }
    return [ListeX, ListeY]
}

/**
 * Fonction qui permet de fusionner les solutions qui ont un pas négatif avec les solutions qui ont un pas positif
 * @param solutions_neg {[number[], number[]]} solution avec un pas négatif
 * @param solutions_pos {[number[], number[]]} solution avec un pas positif
 * @returns {*[]} solution avec un pas négatif et positif
 */
function fusion_solutions(solutions_neg, solutions_pos) {
    solutions_neg[0] = solutions_neg[0].reverse()
    solutions_neg[0].pop()
    solutions_neg[1] = solutions_neg[1].reverse()
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