/**
 * Fonction permettant d'afficher ou de cacher les panneaux d'entrée et sortie de la page univers
 * @param IDpanel {string} Id du panneau à cacher
 */
function toggleEntreeSortie (IDpanel) {
    const panneau = document.getElementById(IDpanel)
    panneau.classList.toggle("cache")

    const grillePrincipale = document.querySelector(".grillePrincipale")
    let entreeCachee = document.getElementById("panneauEntree").classList.contains("cache")
    let sortieCachee = document.getElementById("panneauSortie").classList.contains("cache")

    if (entreeCachee && sortieCachee) {
        grillePrincipale.style.gridTemplateColumns = '1fr';
        grillePrincipale.style.gridTemplateAreas = '' +
            '"Nav"' +
            '"Graphe"';
    } else if (entreeCachee) {
        grillePrincipale.style.gridTemplateColumns = '3fr 1fr';
        grillePrincipale.style.gridTemplateAreas = '' +
            '"Nav Nav"' +
            '"Graphe Sortie"';
    } else if (sortieCachee) {
        grillePrincipale.style.gridTemplateColumns = '1fr 3fr';
        grillePrincipale.style.gridTemplateAreas = '' +
            '"Nav Nav"' +
            '"Entree Graphe"';
    } else {
        grillePrincipale.style.gridTemplateColumns = '1fr 2fr 1fr';
        grillePrincipale.style.gridTemplateAreas = '' +
            '"Nav Nav Nav"' +
            '"Entree Graphe Sortie"';
    }

    if (IDpanel === "panneauEntree") {
        document.getElementById("flecheGauche").classList.toggle("tournee");
    } else {
        document.getElementById("flecheDroite").classList.toggle("tournee");
    }

    ajustementGraphique()
}

/**
 * Fonction permettant d'ouvrir la fenêtre ou la gestion des constantes à lieu
 */
function fenetreConstantes() {
    let url = "./constantes_universelles.html"
    window.open(url, "_blank", "width=500,height=250,resizable=no");
}

/**
 * Fonction permettant d'ouvrir la fenêtre contenant la calculette cosmologique
 */
function fenetreCalculette() {
    window.location.href = "Calculette_cosomologique.html"
}

/**
 * Fonction permettant d'ouvrir la fenêtre contenant la calculette cosmologique
 */
function fenetreFacteur() {
    if (document.getElementById("Omégal0")) {
        window.location.href = "Univers_LCDM.html"
    } else {
        window.location.href = "Univers_DE.html"
    }
}


/**
 * Fonction qui décide de quoi faire des instructions entrée en fonction du boutton utilisé
 * @param nomBoutton {string} Le nom du boutton pressé
 */
function envoisConstantes(nomBoutton) {
    let texte = o_recupereJson()

    let c = document.getElementById("c").value
    let G = document.getElementById("G").value
    let k = document.getElementById("k").value
    let h = document.getElementById("h").value
    let typeAnnee = document.getElementById("typeAnnee").value
    if (window.opener) {
        if (nomBoutton === "enregistrer") {
            window.opener.document.getElementById("c").value = c;
            window.opener.document.getElementById("G").value = G;
            window.opener.document.getElementById("k").value = k;
            window.opener.document.getElementById("h").value = h;
            window.opener.document.getElementById("typeAnnee").value = typeAnnee;
            window.close()
        }

        if (nomBoutton === "reset") {
            window.opener.document.getElementById("c").value = 299792458;
            window.opener.document.getElementById("G").value = 6.67385e-11;
            window.opener.document.getElementById("k").value = 1.38064852e-23;
            window.opener.document.getElementById("h").value = 6.62607004e-34;
            window.opener.document.getElementById("typeAnnee").value = "Grégorienne";
            window.close()
        }

        if (nomBoutton === "retour") {
            window.close()
        }
    } else {
        alert(texte.constante.alerteConstante)
        window.close()
    }
}

let timeoutId = null;

/**
 * Fonction pour retarder l'exécution d'une fonction
 */
function delaisUpdate(func, delay) {
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

function universMonofluides() {
    let option = document.getElementById("optionsMonofluide").value
    let elementOmegaM = document.getElementById("Omégam0")
    let elementOmegaR = document.getElementById("Omégar0")
    let elementOmegaK = document.getElementById("Omégak0")

    let elementOmegaL;
    let elementOmegaDE;
    if ( document.getElementById("Omégal0") ) {
        elementOmegaL = document.getElementById("Omégal0")
    }

    if ( document.getElementById("OmégaDE0") ) {
        elementOmegaDE = document.getElementById("OmégaDE0")
    }

    if (option === "optionNull") {
        elementOmegaM.disabled = false;
        elementOmegaR.disabled = false;
        elementOmegaK.disabled = false;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.disabled = false;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.disabled = false;
        }

    } else {
        elementOmegaM.disabled = true;
        elementOmegaR.disabled = true;
        elementOmegaK.disabled = true;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.disabled = true;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.disabled = true;
        }
    }

    if (option === "optionM") {
        elementOmegaM.value = 1;
        elementOmegaR.value = 0;
        elementOmegaK.value = 0;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.value = 0;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.value = 0;
        }
    }

    if (option === "optionR") {
        elementOmegaM.value = 0;
        elementOmegaR.value = 1;
        elementOmegaK.value = 0;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.value = 0;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.value = 0;
        }
    }

    if (option === "optionLDE") {
        elementOmegaM.value = 0;
        elementOmegaR.value = 0;
        elementOmegaK.value = 0;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.value = 1;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.value = 1;
        }
    }

    if (option === "optionK") {
        elementOmegaM.value = 0;
        elementOmegaR.value = 0;
        elementOmegaK.value = 1;
        if ( document.getElementById("Omégal0") ) {
            elementOmegaL.value = 0;
        }

        if ( document.getElementById("OmégaDE0") ) {
            elementOmegaDE.value = 0;
        }
    }
}

/**
 * Fonction qui permet de rafraichir les valeurs du site pour chaque changement effectué
 */
function ajouterEcouteurs(fonctionUpdate) {
    const elements = document.querySelectorAll('input, select, list');
    const UpdateDelais = delaisUpdate(fonctionUpdate, 100);
    elements.forEach(element => {
        element.addEventListener('input', UpdateDelais);
        element.addEventListener('change', UpdateDelais);
    });
}

if (window.location.pathname==="/Calculette_cosomologique.html"){
    window.onload = ajouterEcouteurs(updateCalculette);
} else {
    window.onload = ajouterEcouteurs(updateUnivers);
}

/**
 * Fonction qui permet de rafraîchir les éléments importants de la page univers
 */
function updateUnivers() {
    document.getElementById("Omégak0").value = Omega_k(0).toExponential(4)
    document.getElementById("Ok_enregistrer").innerHTML = "&Omega;<sub>k<sub>0</sub></sub> = " + Omega_k(0).toExponential(4)

    if (document.getElementById("Omégal0")) {
        document.getElementById("Omégal0").value = Omega_l(0).toExponential(4)
        document.getElementById("Ol_enregistrer").innerHTML = "&Omega;<sub>&Lambda;<sub>0</sub></sub> = " + Omega_l(0).toExponential(4)
    }

    if (document.getElementById("OmégaDE0")) {
        document.getElementById("OmégaDE0").value = Omega_DE(0).toExponential(4)
        document.getElementById("ODE_enregistrer").innerHTML = "&Omega;<sub>DE<sub>0</sub></sub> = " + Omega_DE(0).toExponential(4)
    }

    document.getElementById("Omégar0").value = Omega_r(0).toExponential(4)
    document.getElementById("Or_enregistrer").innerHTML = "&Omega;<sub>r<sub>0</sub></sub> = " + Omega_r(0).toExponential(4)

    document.getElementById("Omégam0").value = Omega_m(0).toExponential(4)
    document.getElementById("Om_enregistrer").innerHTML = "&Omega;<sub>m<sub>0</sub></sub> = " + Omega_m(0).toExponential(4)

    document.getElementById("tdébut_enregistrer").innerHTML = "t<sub>i</sub> = " + document.getElementById("début").innerHTML
    document.getElementById("tfin_enregistrer").innerHTML = "t<sub>f</sub> = " + document.getElementById("fin").innerHTML

    let fonction_simplifiante;
    if (document.getElementById("Omégal0")) {
        fonction_simplifiante = fonction_E
    } else {
        fonction_simplifiante = fonction_F
    }

    let dm_horizon_particule = calcul_horizon_particule(fonction_simplifiante);
    dm_horizon_particule = m_vers_AL(dm_horizon_particule)/1e9;
    document.getElementById("resultat_DmHorizonEvenement").innerHTML = dm_horizon_particule.toExponential(4)
    document.getElementById("hp_enregistrer").innerHTML = "d<sub>p<sub>0</sub></sub> = " + dm_horizon_particule.toExponential(4) + " GAL"
    document.getElementById("")

    let dm_horizon_evenement = calcul_horizon_evenements(fonction_simplifiante);
    dm_horizon_evenement = m_vers_AL(dm_horizon_evenement)/1e9;
    document.getElementById("resultat_DmHorizonParticule").innerHTML = dm_horizon_evenement.toExponential(4);
    document.getElementById("he_enregistrer").innerHTML = "d<sub>e<sub>0</sub></sub> = " + dm_horizon_evenement.toExponential(4) + " GAL"

    if (document.getElementById("Omégal0")) {
        update_graphe_interactif()
    }
}
/**
 * Fonction qui permet de rafraîchir les éléments importants de la page calculette
 */
function updateCalculette() {
    document.getElementById("Omégak0").value = Omega_k(0).toExponential(4)

    if (document.getElementById("Omégal0")) {
        document.getElementById("Omégal0").value = Omega_l(0).toExponential(4)
    }

    if (document.getElementById("OmégaDE0")) {
        document.getElementById("OmégaDE0").value = Omega_DE(0).toExponential(4)
    }

    document.getElementById("Omégar0").value = Omega_r(0).toExponential(4)

    document.getElementById("Omégam0").value = Omega_m(0).toExponential(4)

    let fonction_simplifiante;
    if (document.getElementById("Omégal0")) {
        fonction_simplifiante = fonction_E
    } else {
        fonction_simplifiante = fonction_F
    }
}

/**
 * fonction permettant de changer la taille du graphique dynamiquement, elle est utilisé dans un Event listener
 */
function ajustementGraphique() {
    if (document.getElementById("graphique_LCDM")) {
        Plotly.Plots.resize(document.getElementById("graphique_LCDM"));
    }
    if (document.getElementById("graphique_DE")) {
        Plotly.Plots.resize(document.getElementById("graphique_DE"));
    }
}
window.addEventListener('resize', ajustementGraphique());

/**
 * Fonction qui permet de détecter un click sur le panneau d'avertissement
 */
function avertissement() {
    let message = document.getElementById('avertissementUnivers');
    if (message.style.display === 'none') {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
    }
    ajustementGraphique()
}

/**
 * Fonction qui permet d'enregistrer un élément html sous plusieurs formats
 */
function enregistrer() {
    let format = document.getElementById("optionsEnregistrement").value
    let nom = document.getElementById("nom_fichier").value
    let element;
    if (document.getElementById("graphique_LCDM")) {
        element = document.getElementById("panneauGraphe")
    }

    if (document.getElementById("graphique_DE")) {
        element = document.getElementById("panneauGraphe")
    }

    html2canvas(element).then(canvas => {
        const URLimage = canvas.toDataURL("image/"+format)
        const lien = document.createElement("a")
        lien.href = URLimage
        lien.download = nom+"."+format

        lien.click()
    })
}