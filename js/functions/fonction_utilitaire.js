//! Constantes globals
/*
const c = 299792458;
const G = 6.67385e-11;
const h = 6.62607004e-34;
const k = 1.38064852e-23;
*/

/**
 * Renvoie un float du nombre de jours contenus dans une année en fonction de 4 cas (Gregorienne,sidérale, Julienne et Topique) à partir d'une balise html nommé "typeannee" contenant cette valeur
 * @returns nombre de jour dans une année en fonction du cas 
 */
function nbJoursParAn() {  
    var typeannee = document.getElementById("typeannee").value;
    switch (typeannee) {
        case 'Sidérale':
            return 365.256363051;
        case 'Julienne':
            return 365.25;
        case 'Tropique (2000)':
            return 365.242190517;
        default:
            return 365.2425;
    }
}

function arrondie_affichage(nombre){
    if (0.1<nombre && nombre<1e4){
        return nombre.toFixed(4)
    }else{;
        return nombre.toExponential(5);
    };
}

/**
 * Linear Scale
 * @param {*} zmin 
 * @param {*} zmax 
 * @param {*} nb_pts 
 * @returns points for the x-axis
 */
function linear_scale(zmin, zmax, nb_pts) {
	let pas = (zmax - zmin) / nb_pts;
	let abscisse = [];
	for (let i=zmin; i<=zmax; i+=pas) {
		abscisse.push(i);
	}
	if(abscisse[abscisse.length - 1] != zmax){ //Pour gérér le cas particulier ou zmax n'apparait pas dans la liste par la faute du pas
		abscisse.push(zmax)
	}

	return abscisse;
}


//!Converions
function annee_vers_seconde(valeur){
    return valeur*nbJoursParAn()*24*3600;
};
function seconde_vers_annee(valeur){
    return valeur/nbJoursParAn()*24*3600;
};
function gigaannee_vers_seconde(valeur){
    return valeur*nbJoursParAn()*24*3600*1e9;
};
function seconde_vers_gigaannee(valeur){
    return valeur/(nbJoursParAn()*24*3600*1e9);
};
function m_vers_AU(valeur){
    return valeur/149597870700;
};
function AU_vers_m(valeur){
    return valeur*149597870700;
};
function AL_vers_m(valeur){
    return c*annee_vers_seconde(valeur);
};
function m_vers_AL(valeur){
    return valeur/AL_vers_m(1);
};
function pc_vers_m(valeur){
    return 648000/Math.PI*AU_vers_m(valeur);
};
function m_vers_pc(valeur){
    return m_vers_AU(valeur)/(648000/Math.PI);
};
