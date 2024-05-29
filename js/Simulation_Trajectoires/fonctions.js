/// Document pour metre des fonctions de calcul

//Okay pour l'observateur distance et l'angle à 0 mais pas à 90
//Okay pour le spationaute et l'angle à 0 mais pas à 90

var calculs = calculs || (function() {
    let c=299792458;
    return {
        ///Calcule la vitess réel en m/s pour la métrique de Schwarzchild
         /**
         *
         * @param {*} E constant de la metrique 
         * @param {*} L constant de la metrique 
         * @param {*} r position de la particule en r
         * @param {*} rs rayon de schwarschild
         * @param {*} ra rayon de la masse central
         * @param {*} ref choix du réferentiel
         * @returns 
         */

        //dans ce qui suit si vous trouvez des math.abs , c'est Khaled qui les a mit pour eviter que 
        //les termes dans les racines soient negatifs mais c'est le cas photon-externe-sch qui posait pb au debut
        MSC_Ex_vitess : function (E,L,r,rs,photon) {
            var vtot=0;
            dt=E/(1-(rs/r)); //dt/dtau ou dt/dlambda pour photon
            dphi=c*L/(r**2);// dphi/dtau ou dphi/dlambda pour photon
            vphi=  r*dphi/dt*Math.sqrt(1/(1-rs/r));
            if(photon){ // calcule photon
                dr=E**2-(1-rs/r)*((L/r)**2);   //dr=(c/E)**2*(1-rs/r)**2*(E**2-(1-rs/r)*((L/r)**2));
                vr=c/E*Math.sqrt(Math.abs(dr));    //vr=Math.sqrt(dr/((1-rs/r)**2));
            }
            else{ // calcul particule
                dr=E**2-(1-rs/r)*(1+(L/r)**2);  //dr=(c/E)**2*(1-rs/r)**2*(E**2-(1-rs/r)*(1+(L/r)**2));
                vr=c/E*Math.sqrt(Math.abs(dr));   //vr=Math.sqrt(dr)/(1-rs/r);
				
            }
            vtot=Math.sqrt(vphi**2+vr**2);  

            return [vtot,vr,vphi];
        },

        /**Calcule la vitess réel en m/s pour la métrique de Schwarzchild pour une intéraction non barionique à l'intérieur de l'astre
         * 
         * @param {*} E constant de la metrique 
         * @param {*} L constant de la metrique 
         * @param {*} r position de la particule en r
         * @param {*} rs rayon de schwarschild
         * @param {*} ra rayon de la masse central
         * @param {*} ref choix du réferentiel
         * @returns 
         */
        
        MSC_In_vitess : function(E,L,r,rs,ra,photon){
            alpha_=1-((r**2)*rs)/(ra**3); /// alpha pour la métrique de Schawr interne
            beta_=(3/2)*Math.sqrt(Math.abs(1-rs/ra))-(1/2)*Math.sqrt(Math.abs(alpha_));/// beta pour la métrique de Schawr interne
            vphi=Math.sqrt(Math.abs((r**2/beta_**2)*(c*L*beta_**2/(E*r**2))**2));
            if(photon){
                dr=((c/E)**2)*alpha_*(beta_**4)*((E/beta_)**2-(L/r)**2);
                vr=Math.sqrt(Math.abs(dr/(alpha_*beta_**2)));
            }
            else{
                dr=((c/E)**2)*alpha_*(beta_**4)*((E/beta_)**2-(L/r)**2-1);
                vr=Math.sqrt(Math.abs(dr/(alpha_*beta_**2)));
            }
            vtot=Math.sqrt(vphi**2+vr**2);

            return [vtot,vr,vphi];
        },
        
        /**
         * Calcule de la vitess dans la métrique de Kerr
         * @param {*} E constante
         * @param {*} l constante
         * @param {*} a constante 
         * @param {*} r position de la particule en r
         * @param {*} rs rayon de schwarschild
         * @param {*} ref choix référentiel 
         * @returns 
         */
        MK_vitess :function(E,l,a,r,rs,photon){

            //alert(a);
            delta_=(r**2)-(rs*r)+(a**2); ///delta dans la metric de kerr
            dphi=c*((rs*a*E)/r+(1-rs/r)*l)/((r**2+a**2+(rs/r)*(a**2))*E-rs*a*l/r);   //  OK
            vphie=delta_*(dphi**2)/((1-(rs/r)+rs*a*(dphi)/(c*r))**2);       // OK
            vphie=Math.sqrt(vphie);

            if(photon){
                dr=(c**2)*(E**2+((a**2)*(E**2)-l**2)/(r**2)+rs*(((l-a*E)**2)/(r**3)));
                dr*=(delta_**2)/(((r**2+a**2+(rs/r)*a**2)*E-rs*a*l/r)**2);
                vr=(1-rs/r)*((r**2)*dr/delta_)/(1-(rs/r)+rs*a*(dphi)/(c*r))**2;
                vr=Math.sqrt(Math.abs(vr));
                //alert(vr);
                
            }
            else{
                partie1= E**2 - 1 + rs/r + ((a**2)*(E**2 - 1)-l**2)/(r**2) + (rs*((l-a*E)**2))/(r**3); //Manon
                partie2= (a**2 + r**2 - r*rs)**2; //Manon
                partie3= ((r**2 + a**2 + (a**2)*(rs/r))*E - (rs*a*l)/r)**2; //Manon

                dr2= (c**2)*((partie1*partie2)/(partie3)); //Manon

                vr_au_carre=(1-rs/r)*(((r**2)*dr2)/delta_)/((1-(rs/r)+rs*a*(dphi)/(c*r))**2);   //Manon
                vr=Math.sqrt(Math.abs(vr_au_carre));
            }
            vtot=Math.sqrt(vr**2+vphie**2);
            //alert(vtot);
            return [vtot,vr,vphie];
        }
    }

})()
