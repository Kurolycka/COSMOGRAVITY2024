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
 * Fonction de debounce pour retarder l'exécution d'une fonction
 */
function updateUniversDelais(func, delay) {
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * Fonction qui permet de rafraichir les valeurs du site pour chaque changement effectué
 */
function ajouterEcouteurs() {
    const elements = document.querySelectorAll('input, select, list');
    const UpdateDelais = updateUniversDelais(updateUnivers, 1000);
    elements.forEach(element => {
        element.addEventListener('input', UpdateDelais);
        element.addEventListener('change', UpdateDelais);
    });
}

window.onload = ajouterEcouteurs;

/**
 * Fonction qui permet de rafraîchir les éléments importants de la page univers
 */
function updateUnivers(fractionDigits) {
    document.getElementById("Omégak0").value = Omega_k(0).toExponential(4)

    if (document.getElementById("Omégal0")) {
        document.getElementById("Omégal0").value = Omega_l(0).toExponential(4)
    }

    if (document.getElementById("OmégaDE0")) {
        document.getElementById("OmégaDE0").value = Omega_DE(0).toExponential(4)
    }

    document.getElementById("Omégar0").value = Omega_r(0).toExponential(4)

    document.getElementById("Omégam0").value = Omega_m(0).toExponential(4)
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