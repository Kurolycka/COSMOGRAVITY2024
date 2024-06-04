const PATH_JSON_FR = "./JavaScript/Langues/fr.json";
const PATH_JSON_EN = "./JavaScript/Langues/en.json";

const PATH_UNIV_THEORIE_FR = "./Fichiers/Théorie/theorie_univers-FR.pdf";
const PATH_UNIV_THEORIE_EN = "./Fichiers/Théorie/theorie_univers_EN.pdf";

const PATH_TRAJ_THEO_FR = "./Fichiers/Théorie/theorie_trajectoires_FR.pdf";
const PATH_TRAJ_THEO_EN = "./Fichiers/Théorie/theorie_trajectoires_EN.pdf";

const PATH_UNIV_TUTO_FR = "./Fichiers/Tutoriels/Tuto-Univ-FR.pdf";
const PATH_UNIV_TUTO_EN = "./Fichiers/Tutoriels/Tuto-Univ-EN.pdf";

const PATH_TRAJ_TUTO_FR = "./Fichiers/Tutoriels/Tuto-Traj-FR.pdf";
const PATH_TRAJ_TUTO_EN = "./Fichiers/Tutoriels/Tuto-Traj-EN.pdf";


/**
 * Fonction qui rafraîchi la page
 */
function rafraichirPage() {
    document.location.reload(true);
}

/**
 * Fonction qui permet de choisir la langue FR et de la stocker localement dans un item nommé LANGUE
 */
function choixLangueFr() {
    var langue = "fr";
    sessionStorage.setItem("LANGUE", langue);
}

/**
 * Fonction qui permet de choisir la langue EN et de la stocker localement dans un item nommé LANGUE
 */
function choixLangueEn() {
    var langue = "en";
    sessionStorage.setItem("LANGUE", langue);
}

/**
 * Fonction qui permet de vérifier la langue choisie et renvoie le fichier JSON correspondant
 * @return {string} Chemin du fichier JSON
 */
function s_testLangueJson() {
    if (sessionStorage.getItem("LANGUE")) {
        var langue = sessionStorage.getItem("LANGUE");
        if (langue === "fr") {
            return PATH_JSON_FR;
        } else {
            return PATH_JSON_EN;
        }
    } else {
        // recupere la langue du navigateur par defaut
        var userLang = navigator.language || navigator.userLanguage;
        if (userLang === "fr" || userLang === "fr-FR" || userLang === "fr-fr") {
            userLang === "fr";
            return PATH_JSON_FR;
        } else {
            userLang === "en"
            return PATH_JSON_EN;
        }
        sessionStorage.setItem("LANGUE", userLang);
    }
}

/**
 * Fonction qui permet de vérifier la langue choisie et renvoie l'accronyme correspondant
 * @return {string} fr pour français et en pour anglais
 */
function s_testLangue() {
    var langue;
    if (sessionStorage.getItem("LANGUE")) {
        langue = sessionStorage.getItem("LANGUE");
        return langue;
    } else {
        langue = navigator.language || navigator.userLanguage;
        if (langue === "fr" || langue === "fr-FR" || langue === "fr-fr"){
            langue="fr";
        }
        else{
            langue="en";
        }
        sessionStorage.setItem("LANGUE", langue);
        return langue;
    }
}

/**
 * Fonction permettant d'avoir la bonne langue pour la page de tutoriel Univers
 */
function langageTutorielUnivers() {
    if (s_testLangue() === "fr") {
        window.open(PATH_UNIV_TUTO_FR, "_blank");
    } else if (s_testLangue() === "en") {
        window.open(PATH_UNIV_TUTO_EN, "_blank");
    }
}

/**
 * Fonction permettant d'avoir la bonne langue pour la page de tutoriel Trajectoire
 */
function langageTutorielTrajectoires() {
    if (s_testLangue() === "fr") {
        window.open(PATH_TRAJ_TUTO_FR, "_blank");
    } else if (s_testLangue() === "en") {
        window.open(PATH_TRAJ_TUTO_EN, "_blank");
    }
}


/**
 * Fonction permettant d'avoir la bonne langue pour la page de théorie Univers
 */
function langageTheorieUnivers() {
    if (s_testLangue() === "fr") {
        window.open(PATH_UNIV_THEORIE_FR, "_blank");
    } else if (s_testLangue() === "en") {
        window.open(PATH_UNIV_THEORIE_EN, "_blank");
    }
}

/**
 * Fonction permettant d'avoir la bonne langue pour la page de théorie Trajectoire
 */
function langageTheorieTrajectoire() {
    if (s_testLangue() === "fr") {
        window.open(PATH_TRAJ_THEO_FR, "_blank");
    } else if (s_testLangue() === "en") {
        window.open(PATH_TRAJ_THEO_EN, "_blank");
    }
}


/**
 * Fonction qui permet de récupérer le json correspondant à la langue choisie
 * @return {*} Json
 */
function o_recupereJson() {
    var req = new XMLHttpRequest();
    var texte;
    req.open("GET", s_testLangueJson(), false);
    req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
            texte = JSON.parse(req.responseText);
        }
    };
    req.overrideMimeType('application/json');
    req.send();
    return texte;
}

// Fonctions chargeant le texte pour chaque page

function texte_navigation() {
    var texte = o_recupereJson();
    document.getElementById("txt-acceuil").innerHTML = texte.nav.acceuil
    document.getElementById("txt-univers").insertAdjacentHTML("beforeend", texte.nav.univers)
    document.getElementById("txt-théorieUnivers").insertAdjacentHTML("beforeend", texte.nav.theorie)
    document.getElementById("txt-théorieTrajectoire").insertAdjacentHTML("beforeend", texte.nav.theorie)
    document.getElementById("txt-tutoUnivers").insertAdjacentHTML("beforeend", texte.nav.tutoriel)
    document.getElementById("txt-tutoTrajectoire").insertAdjacentHTML("beforeend", texte.nav.tutoriel)
    document.getElementById("txt-simulationUnivers").insertAdjacentHTML("beforeend", texte.nav.simulation)
    document.getElementById("txt-simulationTrajectoire").insertAdjacentHTML("beforeend", texte.nav.simulation)
    document.getElementById("txt-modeleLCDM").insertAdjacentHTML("beforeend", texte.nav.modeleLCDM)
    document.getElementById("txt-modeleDE").insertAdjacentHTML("beforeend", texte.nav.modeleDE)
    document.getElementById("txt-trajectoire").insertAdjacentHTML("beforeend", texte.nav.trajectoire)
    document.getElementById("txt-metriqueSCH").insertAdjacentHTML("beforeend", texte.nav.SCH)
    document.getElementById("txt-metriqueK").insertAdjacentHTML("beforeend", texte.nav.K)
    document.getElementById("txt-BBSCH").insertAdjacentHTML("beforeend", texte.nav.BBSCH)
    document.getElementById("txt-BPSCH").insertAdjacentHTML("beforeend", texte.nav.BPSCH)
    document.getElementById("txt-nBnBSCH").insertAdjacentHTML("beforeend", texte.nav.nBnBSCH)
    document.getElementById("txt-nBPSCH").insertAdjacentHTML("beforeend", texte.nav.nBPSCH)
    document.getElementById("txt-BK").insertAdjacentHTML("beforeend", texte.nav.BK)
    document.getElementById("txt-PK").insertAdjacentHTML("beforeend", texte.nav.PK)
    document.getElementById("txt-langue").insertAdjacentHTML("beforeend", texte.nav.langue)
    document.getElementById("txt-propos").insertAdjacentHTML("beforeend", texte.nav.propos)
    document.getElementById("txt-LUPM").insertAdjacentHTML("beforeend", texte.nav.LUPM)
}


function texte_univers_LCDM() {
    var texte = o_recupereJson();
    document.getElementById("Entrées").innerHTML = texte.univers.Entrées;
    document.getElementById("infoT0").title = texte.univers.infoT0
    document.getElementById("infoH0").title = texte.univers.infoH0
    document.getElementById("infoTypeUnivers").title = texte.univers.infoTypeUnivers
    document.getElementById("Monofluide_optionNull").innerHTML = texte.univers.monofluide_null
    document.getElementById("Monofluide_optionM").innerHTML = texte.univers.monofluide_M
    document.getElementById("Monofluide_optionR").innerHTML = texte.univers.monofluide_R
    document.getElementById("Monofluide_optionLDE").innerHTML = texte.univers.monofluide_LDE
    document.getElementById("Monofluide_optionK").innerHTML = texte.univers.monofluide_K
    document.getElementById("infoOmégam0").title = texte.univers.infoOmégam0
    document.getElementById("infoOmégaLDE0").title = texte.univers.infoOmégaLDE0
    document.getElementById("label_optionsOmégar0").insertAdjacentHTML("beforeend", texte.univers.label_Omégar0)
    document.getElementById("infoOmégaR0").title = texte.univers.infoOmégaR0
    document.getElementById("Omégar0_optionRFC_et_Neutrinos").innerHTML = texte.univers.Omégar0_RFC_et_Neutrinos
    document.getElementById("Omégar0_optionRFC").innerHTML = texte.univers.Omégar0_RFC
    document.getElementById("Omégar0_optionRien").innerHTML = texte.univers.Omégar0_Rien
    document.getElementById("infoOmégaK0").title = texte.univers.infoOmégaK0
    document.getElementById("label_optionsOmégak0").insertAdjacentHTML("beforeend", texte.univers.label_Omégak0)

    document.getElementById("Tracé").innerHTML = texte.univers.Tracé;
    document.getElementById("infoAmin").title = texte.univers.infoAmin;
    document.getElementById("infoAmax").title = texte.univers.infoAmax;
    document.getElementById("bouttonTracer").innerHTML = texte.univers.bouttonTracer;


    document.getElementById("headGraphiqueLCDM").innerHTML = texte.univers.headGraphiqueLCDM


    document.getElementById("Sorties").innerHTML = texte.univers.Sorties
    document.getElementById("Omégas").innerHTML = texte.univers.Omégas
    document.getElementById("infoOmégar0Sortie").title = texte.univers.infoOmégaR0Sortie
    document.getElementById("infoOmégak0Sortie").title = texte.univers.infoOmégaK0Sortie
    document.getElementById("Temps").innerHTML = texte.univers.Temps

    document.getElementById("Enregistrer").innerHTML = texte.univers.Enregistrer
    document.getElementById("infoNomFichier").title = texte.univers.infoNomFichier
    document.getElementById("labelNom_fichier").insertAdjacentHTML("beforeend", texte.univers.labelNom)
    document.getElementById("nom_fichier").value = texte.univers.nomDéfautLCDM
    document.getElementById("bouttonEnregistrer").value = texte.univers.bouttonEnregistrer


}


function texte_univers_DE() {
    var texte = o_recupereJson();
    document.getElementById("Entrées").innerHTML = texte.univers.Entrées;
    document.getElementById("infoT0").title = texte.univers.infoT0
    document.getElementById("infoH0").title = texte.univers.infoH0
    document.getElementById("infoTypeUnivers").title = texte.univers.infoTypeUnivers
    document.getElementById("Monofluide_optionNull").innerHTML = texte.univers.monofluide_null
    document.getElementById("Monofluide_optionM").innerHTML = texte.univers.monofluide_M
    document.getElementById("Monofluide_optionR").innerHTML = texte.univers.monofluide_R
    document.getElementById("Monofluide_optionLDE").innerHTML = texte.univers.monofluide_LDE
    document.getElementById("Monofluide_optionK").innerHTML = texte.univers.monofluide_K
    document.getElementById("infoOmégam0").title = texte.univers.infoOmégam0
    document.getElementById("infoOmégaLDE0").title = texte.univers.infoOmégaLDE0
    document.getElementById("label_optionsOmégar0").insertAdjacentHTML("beforeend", texte.univers.label_Omégar0)
    document.getElementById("infoOmégaR0").title = texte.univers.infoOmégaR0
    document.getElementById("Omégar0_optionRFC_et_Neutrinos").innerHTML = texte.univers.Omégar0_RFC_et_Neutrinos
    document.getElementById("Omégar0_optionRFC").innerHTML = texte.univers.Omégar0_RFC
    document.getElementById("Omégar0_optionRien").innerHTML = texte.univers.Omégar0_Rien
    document.getElementById("infoOmégaK0").title = texte.univers.infoOmégaK0
    document.getElementById("label_optionsOmégak0").insertAdjacentHTML("beforeend", texte.univers.label_Omégak0)

    document.getElementById("Tracé").innerHTML = texte.univers.Tracé;
    document.getElementById("infoAmin").title = texte.univers.infoAmin;
    document.getElementById("infoAmax").title = texte.univers.infoAmax;
    document.getElementById("bouttonTracer").innerHTML = texte.univers.bouttonTracer;


    document.getElementById("headGraphiqueDE").innerHTML = texte.univers.headGraphiqueDE


    document.getElementById("Sorties").innerHTML = texte.univers.Sorties
    document.getElementById("Omégas").innerHTML = texte.univers.Omégas
    document.getElementById("infoOmégar0Sortie").title = texte.univers.infoOmégaR0Sortie
    document.getElementById("infoOmégak0Sortie").title = texte.univers.infoOmégaK0Sortie
    document.getElementById("Temps").innerHTML = texte.univers.Temps

    document.getElementById("Enregistrer").innerHTML = texte.univers.Enregistrer
    document.getElementById("infoNomFichier").title = texte.univers.infoNomFichier
    document.getElementById("labelNom_fichier").insertAdjacentHTML("beforeend", texte.univers.labelNom)
    document.getElementById("nom_fichier").value = texte.univers.nomDéfautDE
    document.getElementById("bouttonEnregistrer").value = texte.univers.bouttonEnregistrer
}
