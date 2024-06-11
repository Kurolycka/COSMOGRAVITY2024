function update_graphe_interactif() {
    let texte = o_recupereJson()
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    let omegaM0Max = 3;
    let omegaM0Min = 0;
    let omegaL0Max = 3;
    let omegaL0Min = -1.5;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Ol est dans le sens des x
    function omegal0_to_px(value) {
        let echelle = (canvas.width - 30) / Math.abs(omegaL0Max - omegaL0Min);
        return echelle * (value - omegaL0Min) + 15;
    }

    // Om est dans le sens des y
    function omegam0_to_px(value) {
        let echelle = (canvas.height - 30) / Math.abs(omegaM0Max - omegaM0Min);
        return (canvas.height - 15) - (echelle * (value - omegaM0Min));
    }

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
    context.translate(omegal0_to_px(omegaL0Min) + 65, omegam0_to_px(1.5) + 15);
    context.rotate(Math.PI / 5.25);
    context.fillStyle = "#fa2076"
    context.fillText(texte.grapheSéparatrices.plat, 5, -10);
    context.fillText(texte.grapheSéparatrices.ouvert, -50, 0);
    context.fillText(texte.grapheSéparatrices.ferme, +80, -20);
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
    context.translate(omegal0_to_px(0), omegam0_to_px(3));
    context.fillStyle = "#06a106"
    context.fillText(texte.grapheSéparatrices.BC, -30, 15);
    context.fillText(texte.grapheSéparatrices.pBC, 60, 15);
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
    context.translate(omegal0_to_px(omegaL0Min) + 230, omegam0_to_px(1.5) + 25);
    context.fillStyle = "#34b8b2"
    context.rotate(-Math.PI / 4.9);
    context.fillText(texte.grapheSéparatrices.BB, 0, -10);
    context.fillText(texte.grapheSéparatrices.BB, 0, 22);
    context.fillText(texte.grapheSéparatrices.pBB, 0, 12);
    context.restore();
}
