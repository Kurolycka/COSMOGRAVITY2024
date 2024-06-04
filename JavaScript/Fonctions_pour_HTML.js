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
}
