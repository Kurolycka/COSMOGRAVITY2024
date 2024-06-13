

function arrondie_affichage(nombre, chiffre_significatif){
    if (nombre<1e4){
        return nombre.toFixed(4)
    }else{
        return nombre.toExponential(chiffre_significatif);
    }
}

//!Converions
function annee_vers_seconde(valeur){
    return valeur*nbrJours()*24*3600;
}
function seconde_vers_annee(valeur){
    return valeur/nbrJours()*24*3600;
}
function gigaannee_vers_seconde(valeur){
    return valeur*nbrJours()*24*3600*1e9;
}
function seconde_vers_gigaannee(valeur){
    return valeur/(nbrJours()*24*3600*1e9);
}
function m_vers_AU(valeur){
    return valeur/149597870700;
}
function AU_vers_m(valeur){
    return valeur*149597870700;
}
function AL_vers_m(valeur){
    return c*annee_vers_seconde(valeur);
}
function m_vers_AL(valeur){
    return valeur/AL_vers_m(1);
}
function pc_vers_m(valeur){
    return 648000/Math.PI*AU_vers_m(valeur);
}
function m_vers_pc(valeur){
    return m_vers_AU(valeur)/(648000/Math.PI);
}
