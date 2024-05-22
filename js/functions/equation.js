const {pow}=Math; //pour ameliorer la lisibilité en remplacent Math.pow(x,y) par pow(x,y) (oui je chipote)

/** Simplification des calculs des omegas utilisés pour les calcules des durée et des distances
 * (Univers,simple et monofluide)
 * @param {*} z décalage spectral
 * @param {*} OmegaR0 paramètre de densité de rayonnement au temps t0
 * @param {*} OmegaM0 paramètre de densité de matière au temps t0
 * @param {*} OmegaLambda0 paramètre de densité de lambda au temps t0
 * @returns 
 */
function E(z,OmegaR0=OmegaR0,OmegaM0=OmegaM0,OmegaLambda0=OmegaLambda0){
    return OmegaR0*pow(1+z,4)+OmegaM0*pow(1+z,3)+(1-OmegaM0-OmegaR0-OmegaLambda0)*pow(1+z,2)+OmegaLambda0;
};

/** renvoie la fonction Sk pour calculer les distances cosmologiques en fontion de la courbure de l'espace
 * (Univers,simple,DarkEnergy et monofluide)
 * @param {*} x Paramètre d'entré
 * @param {*} OmegaK paramètre de densité de courbure
 * @returns 
 */
function Sk(x,OmegaK=OmegaK0){
    if (OmegaK>0) { //si k=-1 alors omegaK positif
        return Math.sinh(x);
    }else if(OmegaK<0){//si k=1 alors omegaK négatif
        return Math.sin(x);
    }else{//si k=0 alors omegaK est nul
        return x;
    }
};  

/** renvoie la distance métrique entre un photon émis avec un Zemission et recu a une coordonné r avec un Zreception \
 * pour avoir la distance d'un objet observé avec un certain décalge Zemission=0 \
 * pour avoir l'horizon cosmologique des particules Zreception=infini \
 * pour avoir l'horizon cosmologique des évenement Zemission=-1 (dans le futur) \
 * (Univers,simple) \
 * Si les omega et H0 sont définis dans la page pas besoin de les mettre en paramètre : DistanceMetrique(Zemission,Zreception)
 * @param {*} Zemission décalage spectral au moment ou le photon est émis
 * @param {*} Zreception décalage spectral au moment ou le photon est reçu
 * @param {*} H0 
 * @param {*} OmegaK0 
 * @param {*} OmegaR0 
 * @param {*} OmegaM0 
 * @param {*} OmegaLambda0 
 * @returns 
 */
function DistanceMetrique(Zemission,Zreception,H0=H0,OmegaK0=OmegaK0,OmegaR0=OmegaR0,OmegaM0=OmegaM0,OmegaLambda0=OmegaLambda0){
    function fonction_a_integrer(x){
        return pow(E(x,OmegaR0,OmegaM0,OmegaLambda0),-0.5);
    }
    return c/(H0*pow(Math.abs(OmegaK0),0.5))*Sk(pow(Math.abs(OmegaK0),0.5)*simpson_composite(fonction_a_integrer,Zemission,Zreception,1e7),OmegaK0)
};


