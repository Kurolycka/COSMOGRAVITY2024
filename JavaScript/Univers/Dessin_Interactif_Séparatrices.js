const omegaM0Min = 0;
const omegaM0Max = 3;

const omegaL0Min = -1.5;
const omegaL0Max = 3;

window.onload = function() {
    update_graphe_interactif();
};

window.onresize = function() {
    update_graphe_interactif();
};

function resizeCanvas() {
    let canvas = document.getElementById("canvas");
    let container = document.getElementById("conteneurCanvas");

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

// Ol est dans le sens des x
/**
 * Fonction permettant de convertir une valeur de oméga lambda en pixel
 * @param value {number} Valeur de oméga
 * @return {number} Valeur de oméga convertis en pixel sur le canvas
 */
function omegal0_to_px(value) {
    let canvas = document.getElementById("canvas");
    let echelle = (canvas.width - 30) / Math.abs(omegaL0Max - omegaL0Min);
    return echelle * (value - omegaL0Min) + 15;
}

// Om est dans le sens des y
/**
 * Fonction permettant de convertir une valeur de oméga matière en pixel
 * @param value {number} Valeur de oméga
 * @return {number} Valeur de oméga convertis en pixel sur le canvas
 */
function omegam0_to_px(value) {
    let canvas = document.getElementById("canvas");
    let echelle = (canvas.height - 30) / Math.abs(omegaM0Max - omegaM0Min);
    return (canvas.height - 15) - (echelle * (value - omegaM0Min));
}

function update_graphe_interactif() {
    resizeCanvas()

    let texte = o_recupereJson()
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);


    // Dessiner les axes
    context.beginPath();
    context.moveTo(omegal0_to_px(omegaL0Min), omegam0_to_px(0));
    context.lineTo(omegal0_to_px(omegaL0Max), omegam0_to_px(0));
    context.lineTo(omegal0_to_px(omegaL0Max), omegam0_to_px(omegaM0Max));
    context.lineTo(omegal0_to_px(omegaL0Min), omegam0_to_px(omegaM0Max));
    context.lineTo(omegal0_to_px(omegaL0Min), omegam0_to_px(0));

    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.stroke();

    // Ajout des labels aux axes
    context.font = '14px Arial';
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.save()
    context.translate(canvas.width - 20, omegam0_to_px(0));
    context.rotate(Math.PI / 2)
    context.fillText("ΩΛ0", -10, -20);
    context.restore()
    context.textAlign = 'left';
    context.fillText("Ωm0", omegal0_to_px(omegaL0Min), 0);  // Label pour l'axe y

    // Dessiner les marqueurs des valeurs
    context.font = '12px Arial';
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.textBaseline = 'middle';

    for (let marqueur = omegaL0Min; marqueur <= omegaL0Max; marqueur = marqueur + 1) {
        context.beginPath();
        context.moveTo(omegal0_to_px(marqueur), omegam0_to_px(0) - 5);
        context.lineTo(omegal0_to_px(marqueur), omegam0_to_px(0) + 5);
        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        context.stroke();
        context.textAlign = 'center';
        context.fillText(marqueur.toFixed(1), omegal0_to_px(marqueur), omegam0_to_px(0) + 10);
    }

    for (let marqueur = omegaM0Min; marqueur <= omegaM0Max; marqueur = marqueur + 1) {
        context.beginPath();
        context.moveTo(omegal0_to_px(omegaL0Min) - 5, omegam0_to_px(marqueur));
        context.lineTo(omegal0_to_px(omegaL0Min) + 5, omegam0_to_px(marqueur));
        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        context.stroke();
        context.textAlign = 'center';
        if (marqueur !== 0) {
            context.save();
            context.translate(omegal0_to_px(omegaL0Min) - 7, omegam0_to_px(marqueur));
            context.rotate(-Math.PI / 2);
            context.textAlign = 'center';
            context.fillText(marqueur.toFixed(1), 0, 0);
            context.restore();
        }
    }

    // Tracé de la séparatrice univers fermé / ouvert et affichage des textes
    context.beginPath();
    context.strokeStyle = "#fa2076";

    for (let omegal = 1; omegal >= omegaL0Min - 0.1; omegal -= 0.1) {
        let omegam = 1 - omegal; // Calcul de Ωm pour chaque ΩΛ
        let x = omegal0_to_px(omegal); // Conversion en coordonnées x
        let y = omegam0_to_px(omegam); // Conversion en coordonnées y

        if (omegal === 1) {
            context.moveTo(x, y); // Point de départ
        } else {
            context.lineTo(x, y); // Relier les points
        }
    }
    context.stroke(); // Tracer la séparatrice

    context.save();
    context.translate(omegal0_to_px(-0.75), omegam0_to_px(1.75));
    context.rotate(Math.PI / 4.25);
    context.fillStyle = "#fa2076"
    context.fillText(texte.grapheSéparatrices.plat, 0, 0);
    context.fillText(texte.grapheSéparatrices.ouvert, -50, 10);
    context.fillText(texte.grapheSéparatrices.ferme, 50, -10);
    context.restore();

    // Tracé de la séparatrice univers avec / sans bigCrunch et affichage des textes
    context.beginPath();
    context.strokeStyle = "#06a106";

    for (let omegam = 0.75; omegam <= omegaM0Max + 0.01; omegam = omegam + 0.01) {
        let terme_1 = 4 * omegam
        let terme_2 = (1 / omegam) - 1
        let terme_3 = Math.cos(1/3 * Math.acos(terme_2) + 4 * Math.PI / 3 )
        let omegal = terme_1 * Math.pow(terme_3, 3); // Calcul de Ωm pour chaque ΩΛ
        let x = omegal0_to_px(omegal); // Conversion en coordonnées x
        let y = omegam0_to_px(omegam); // Conversion en coordonnées y

        if (omegal === 1) {
            context.moveTo(x, y); // Point de départ
        } else {
            context.lineTo(x, y); // Relier les points
        }
    }
    context.moveTo(omegal0_to_px(0), omegam0_to_px(0.75))
    context.lineTo(omegal0_to_px(0), omegam0_to_px(0));
    context.stroke(); // Tracer la séparatrice

    context.save();
    context.translate(omegal0_to_px(0.16), omegam0_to_px(3));
    context.fillStyle = "#06a106"
    context.fillText(texte.grapheSéparatrices.BC,-40 ,10 );
    context.fillText(texte.grapheSéparatrices.pBC, +60, 10);
    context.restore();

    // Tracé de la séparatrice univers avec / sans Big Bang et affichage des textes
    context.beginPath();
    context.strokeStyle = "#34b8b2";

// Première portion de la courbe (cosh)
    for (let omegam = 0; omegam <= 0.5; omegam += 0.01) {
        let terme_1 = 4 * omegam;
        let terme_2 = (1 / omegam) - 1;
        let terme_3 = Math.sqrt((terme_2 * terme_2) - 1);
        let terme_4 = Math.cosh(Math.log(terme_2 + terme_3) / 3);
        let omegal = terme_1 * Math.pow(terme_4, 3); // Calcul de ΩΛ pour chaque Ωm
        let x = omegal0_to_px(omegal); // Conversion en coordonnées x
        let y = omegam0_to_px(omegam); // Conversion en coordonnées y

        if (omegam === 0) {
            context.moveTo(x, y); // Point de départ
        } else {
            context.lineTo(x, y); // Relier les points
        }
    }

    // On assure la continuité de la séparatrice
    let omegam = 0.5;
    let terme_1 = 4 * omegam;
    let terme_2 = (1 / omegam) - 1;
    let terme_3 = Math.acos(terme_2) / 3;
    let omegal = terme_1 * Math.pow(Math.cos(terme_3), 3); // Calcul de ΩΛ pour chaque Ωm
    let x = omegal0_to_px(omegal); // Conversion en coordonnées x
    let y = omegam0_to_px(omegam); // Conversion en coordonnées y
    context.lineTo(x, y); // Relier les points

// Deuxième portion de la courbe (acos)
    for (let omegam = 0.5; omegam <= omegaM0Max; omegam += 0.01) {
        let terme_1 = 4 * omegam;
        let terme_2 = (1 / omegam) - 1;
        let terme_3 = Math.acos(terme_2) / 3;
        let omegal = terme_1 * Math.pow(Math.cos(terme_3), 3); // Calcul de ΩΛ pour chaque Ωm
        if (omegal <= omegaL0Max) {
            let x = omegal0_to_px(omegal); // Conversion en coordonnées x
            let y = omegam0_to_px(omegam); // Conversion en coordonnées y

            context.lineTo(x, y); // Relier les points
        }
    }

    context.stroke(); // Tracer la séparatrice

    context.save();
    context.translate(omegal0_to_px(2.2), omegam0_to_px(0.6));
    context.fillStyle = "#34b8b2"
    context.rotate(-Math.PI / 4.9);
    context.fillText(texte.grapheSéparatrices.BB, 0, -15);
    context.fillText(texte.grapheSéparatrices.BB, 0, 15);
    context.fillText(texte.grapheSéparatrices.pBB, 0, 5);
    context.restore();

    update_point()
}

// Fonction pour convertir les coordonnées de pixels en valeurs Omega
function px_to_omegam0(y) {
    const pxMin = omegam0_to_px(omegaM0Min); // Position y du bord supérieur du graphique en pixels
    const pxMax = omegam0_to_px(omegaM0Max); // Position y du bord inférieur du graphique en pixels

    // Conversion des pixels en valeurs Omega
    return omegaM0Min + ((y - pxMin) / (pxMax - pxMin)) * (omegaM0Max - omegaM0Min);
}

function px_to_omegalambda0(x) {
    const pxMin = omegal0_to_px(omegaL0Min); // Position x du bord gauche du graphique en pixels
    const pxMax = omegal0_to_px(omegaL0Max); // Position x du bord droit du graphique en pixels

    // Conversion des pixels en valeurs Omega
    return omegaL0Min + ((x - pxMin) / (pxMax - pxMin)) * (omegaL0Max - omegaL0Min);
}

function update_point() {
    console.log("Point mis à jour")
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    const omegam0 = parseFloat(document.getElementById("Omégam0").value);
    let omegalDE0 = parseFloat(document.getElementById("Omégal0").value);

    const x = omegal0_to_px(omegalDE0);
    const y = omegam0_to_px(omegam0);

    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI);
    context.fillStyle = "#df1b1b";
    context.fill();
}

let canvas = document.getElementById("canvas");
canvas.addEventListener('click', function(event) {
    // Récupérer les coordonnées du clic
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convertir les coordonnées en valeurs Omega
    const omegam0 = px_to_omegam0(y);
    const omegalDE0 = px_to_omegalambda0(x);

    function update_omegas(omegalDE0, omegam0) {
        document.getElementById("Omégam0").value = omegam0.toExponential(4)
        if (document.getElementById("Omégal0")) {
            document.getElementById("Omégal0").value = omegalDE0.toExponential(4)
        } else {
            document.getElementById("OmégaDE0").value = omegalDE0.toExponential(4)
        }
    }

    update_graphe_interactif()
    if (omegaM0Min <= omegam0 && omegam0 <= omegaM0Max
        && omegaL0Min <= omegalDE0 && omegalDE0 <= omegaL0Max) {
        update_omegas(omegalDE0, omegam0)
    } else {
        // Pour les bords
        if (omegaM0Min > omegam0) {update_omegas(omegalDE0, omegaM0Min)}
        if (omegam0 > omegaM0Max) {update_omegas(omegalDE0, omegaM0Max)}
        if (omegaL0Min > omegalDE0) {update_omegas(omegaL0Min, omegam0)}
        if (omegalDE0 > omegaL0Max) {update_omegas(omegaL0Max, omegam0)}
        // Pour les coins
        if (omegaM0Min > omegam0 && omegaL0Min > omegalDE0) {update_omegas(omegaL0Min, omegaM0Min)}
        if (omegaM0Min > omegam0 && omegalDE0 > omegaL0Max) {update_omegas(omegaL0Max, omegaM0Min)}
        if (omegam0 > omegaM0Max && omegaL0Min > omegalDE0) {update_omegas(omegaL0Min, omegaM0Max)}
        if (omegam0 > omegaM0Max && omegalDE0 > omegaL0Max) {update_omegas(omegaL0Max, omegaM0Max)}
    }
    updateUnivers()
    if (document.getElementById("Omégal0")) {
        affichage_site_LCDM()
    } else {
        affichage_site_DE()
    }
    update_point()
});


