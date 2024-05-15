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


    while (ListeY[ListeY.length-1] >= y_min && ListeY[ListeY.length-1] <= y_max) {
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

    while (ListeY[ListeY.length-1] >= y_min && ListeY[ListeY.length-1] <= y_max) {
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
        console.log("xn1 et yn1 =", xn+pas, yn1)
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

    while (ListeY[ListeY.length-1] >= y_min && ListeY[ListeY.length-1] <= y_max) {
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
 * Méthode de RungeKutta adaptative. Cette fonction utilise la méthode adaptative de Runge-Kutta-Fehlberg qui utilise
 * la méthode RK4 comme méthode d'ordre p = 4 et RK5 comme méthode d'ordre p + 1 = 5.
 * @param tolerance {number} tolérance d'erreur. Plus se paramètre est faible plus les calculs seront long à effectuer.
 * Doit être positive.
 * @param x0 {number} paramètre initial ou on connait la valeur de la fonction à déterminer
 * @param y0 {number} valeur de la fonction à déterminer au paramètre initial. Cette valeur doit être
 * comprise entre a_min et a_max
 * @param fonctionCarac {function} Équation caractéristique du système qui ne doit dépendre que :
 *      - Du paramètre de la fonction inconnue
 *      - De la fonction inconnue
 * Dans cet ordre, pas plus pas moins.
 * déterminer, de sa dérivée première et de son paramètre, pas plus pas moins.
 * @param y_min {number} valeur maximale que la fonction à déterminer peut prendre
 * @param y_max {number} valeur minimale que la fonction à déterminer peut prendre
 * @return liste des valeurs de la fonction inconnue et des abscisses ou elle a été calculée
 */
function RungeKuttaAdaptative_EDO1(tolerance, x0, y0, fonctionCarac,
                                   y_min= 0, y_max = 5) {
    // La méthode de RKF adaptative faisant intervenir beaucoup de coefficients on les définit au préalable par soucis de clareté.

    // Coefficients à ajouter au paramètre x (paramètre de la fonction y)
    const coeffsX = [0, 1/4, 3/8, 12/13, 1, 1/2]

    // Coefficents à ajouter à la fonction inconnue y
    const coeffsY = [
        [1/4],
        [3/32, 9/32],
        [1932/2197, -7200/2197, 7296/2197],
        [439/216, -8, 3680/513, -845/4104],
        [-8/27, 2, -3544/2565, 1859/4104, -11/40]
    ]

    // Coefficients de pondération des différents k pour obtenir y_n+1
    const coeffsPonderation = [16/135, 0, 6656/12825, 28561/56430, -9/50, 2/55]

    //Coefficients de pondération des différents k pour obtenir l'erreur
    const coeffsErreur = [-1/360, 0, 	128/4275, 2197/75240, -1/50, -2/55]

    // Le calcul des coefficients k se fait de la manière suivante :
    // k[i] = h * f(x + coeffsA[i] * h, y + somme( B[i][n] * k[n] ))
    // i allant de 1 à 5 et n de 0 à i-1

    let ListeX = [x0]
    let ListeY = [y0]
    let K = [0, 0, 0, 0, 0, 0]

    let xn = x0
    let yn = y0
    let hn = -1e-3

    let yn1;
    let hn1;

    let erreur;

    while ( (ListeY[ListeY.length-1] >= y_min && ListeY[ListeY.length-1] <= y_max) && !( isNaN(hn) ) ) {
        xn = ListeX[ListeX.length-1];
        yn = ListeY[ListeY.length-1];

        // Calculs des coefficients k
        K[0] = hn * fonctionCarac(
            xn + coeffsX[0] * hn,
            yn
        )

        K[1] = hn * fonctionCarac(
            xn + coeffsX[1] * hn,
            yn + coeffsY[0][0] * K[0]
        )

        K[2] = hn * fonctionCarac(
            xn + coeffsX[2] * hn,
            yn + coeffsY[1][0] * K[0] + coeffsY[1][1] * K[1]
        )

        K[3] = hn * fonctionCarac(
            xn + coeffsX[3] * hn,
            yn + coeffsY[2][0] * K[0] + coeffsY[2][1] * K[1] + coeffsY[2][2] * K[2]
        )

        K[4] = hn * fonctionCarac(
            xn + coeffsX[4] * hn,
            yn + coeffsY[3][0] * K[0] + coeffsY[3][1] * K[1] + coeffsY[3][2] * K[2] + coeffsY[3][3] * K[3]
        )

        K[5] = hn * fonctionCarac(
            xn + coeffsX[5] * hn,
            yn + coeffsY[4][0] * K[0] + coeffsY[4][1] * K[1] + coeffsY[4][2] * K[2] + coeffsY[4][3] * K[3] + coeffsY[4][4] * K[4]
        )

        console.log("xn et yn =", xn, yn)

        // Calcul de l'erreur
        erreur = Math.abs(
            coeffsErreur[0] * K[0] + coeffsErreur[1] * K[1] + coeffsErreur[2] * K[2]
            + coeffsErreur[3] * K[3] + coeffsErreur[4] * K[4] + coeffsErreur[5] * K[5]
        )

        hn1 = 0.9 * hn * Math.pow(tolerance / erreur, 1/5)

        // console.log("Avant le test on a :", erreur, tolerance, hn)
        if (erreur <= tolerance) {
            yn1 = (
                yn
                + coeffsPonderation[0] * K[0] + coeffsPonderation[1] * K[1] + coeffsPonderation[2] * K[2]
                + coeffsPonderation[3] * K[3] + coeffsPonderation[4] * K[4] + coeffsPonderation[5] * K[5]
            )

            ListeX.push(xn + hn);
            hn = hn1
            ListeY.push(yn1);
        }
        else {
            hn = hn1
        }
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