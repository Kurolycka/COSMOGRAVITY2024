/**
 * Linear Scale
 * @param {*} zmin 
 * @param {*} zmax 
 * @param {*} nb_pts 
 * @returns points for the x-axis
 */
function linear_scale(zmin, zmax, nb_pts) {
	let step = (zmax - zmin) / nb_pts;
	let abscissa = [];
	for (let i=zmin; i<=zmax; i+=step) {
		abscissa.push(i);
	}
	if(abscissa[abscissa.length - 1] != zmax){ //Pour gérér le cas particulier ou zmax n'apparait pas dans la liste par la faute du pas
		abscissa.push(zmax)
	}

	return abscissa;
};


function affichage_des_z(fonction_EouF){
    start_temps=Date.now();
    let H0 = Number(document.getElementById("H0").value);
    z1 = Number(document.getElementById("z1").value);
    z2 = Number(document.getElementById("z2").value);
    if (z1<=-1) {
        return messagebox(texte.page_univers_calculs.message_z1_incorrect,"z1 >-1");}
    if (z2<=-1) {
        return messagebox(texte.page_univers_calculs.message_z2_incorrect,"z2 >-1");
    };

    //! Partie géometrie ---------------------
    //? Calcul des Distances métriques
    if (z1<0){
        dm1=DistanceMetrique(fonction_EouF,z1,0,true,);
    }else{
        dm1=DistanceMetrique(fonction_EouF,0,z1,true);
    };
    if (z2<0){
        dm2=DistanceMetrique(fonction_EouF,z2,0,true,);
    }else{
        dm2=DistanceMetrique(fonction_EouF,0,z2,true);
    };
    let delta_dm=Math.abs(DistanceMetrique(fonction_EouF,z1,z2,true));

    document.getElementById('dm1').value=arrondie_affichage(dm1);
    document.getElementById('dm1_pc').value=arrondie_affichage(m_vers_pc(dm1));
    document.getElementById('dm1_lum').value=arrondie_affichage(m_vers_AL(dm1));
    document.getElementById('dm2').value=arrondie_affichage(dm2);
    document.getElementById('dm2_pc').value=arrondie_affichage(m_vers_pc(dm2));
    document.getElementById('dm2_lum').value=arrondie_affichage(m_vers_AL(dm2));
    document.getElementById('dm').value=arrondie_affichage(delta_dm);
    document.getElementById('dm_pc').value=arrondie_affichage(m_vers_pc(delta_dm));
    document.getElementById('dm_diff_lum').value=arrondie_affichage(m_vers_AL(delta_dm));
    

    
    //? Calcul des temps
    let t1=calcul_ages(fonction_EouF,H0_parSecondes(H0),1e-30,1/(1+z1));
    let t2=calcul_ages(fonction_EouF,H0_parSecondes(H0),1e-30,1/(1+z2));
    let delta_t=calcul_ages(fonction_EouF,H0_parSecondes(H0),1/(1+z1),1/(1+z2));
    document.getElementById('tempsEmission_sec').value=arrondie_affichage(t1);
    document.getElementById('tempsEmission').value=arrondie_affichage(seconde_vers_annee(t1));
    document.getElementById('tempsReception_sec').value=arrondie_affichage(t2);
    document.getElementById('tempsReception').value=arrondie_affichage(seconde_vers_annee(t2));
    document.getElementById('agebetween').value=arrondie_affichage(delta_t);
    document.getElementById('agebetween_sec').value=arrondie_affichage(seconde_vers_annee(delta_t));


    //! Partie paramètre cosmologique ------------------
    let T0 = Number(document.getElementById("T0").value);
    let Omega_r0 = Number(document.getElementById("Orr").innerHTML);//changer
    let Omega_m0 = Number(document.getElementById("omegam0").value);
    let Omega_k0 = Number(document.getElementById("resultat_omegak0_annexes").innerHTML);
    if (fonction_EouF.name===fonction_E){
        let Omega_l0 = Number(document.getElementById("omegalambda0").value);
    }else if (fonction_EouF.name===fonction_F){
        let Omega_l0 = Number(document.getElementById("omegaDE0").value);
    };

    //temperature
    let Tz1 = T0 * (1 + z1);
    let Tz2 = T0 * (1 + z2);
    //taux d'expansion
    let Hz1 = H0 * Math.pow(fonction_EouF(z1,true),0.5);
    let Hz2 = H0 * Math.pow(fonction_EouF(z1,true),0.5);
    //Omegas 
    let Omega_rz1 = Omega_r0*Math.pow((1+z1),4)/fonction_EouF(z1,true);
    let Omega_rz2 = Omega_r0*Math.pow((1+z2),4)/fonction_EouF(z2,true);
    let Omega_mz1 = Omega_m0*Math.pow((1+z1),3)/fonction_EouF(z1,true);
    let Omega_mz2 = Omega_m0*Math.pow((1+z2),3)/fonction_EouF(z2,true);
    let Omega_kz1 = Omega_k0*Math.pow((1+z1),2)/fonction_EouF(z1,true);
    let Omega_kz2 = Omega_k0*Math.pow((1+z2),2)/fonction_EouF(z2,true);
    if (fonction_EouF.name===fonction_E){
        let Omega_lz1 = Omega_l0/fonction_E(z1,true);
        let Omega_lz2 = Omega_l0/fonction_E(z2,true);
    }else if (fonction_EouF.name===fonction_F){
        let Omega_DEz1=omegaDE0/fonction_F(z1,true);
        let Omega_DEz2=omegaDE0/fonction_F(z2,true);
        let Omega_DENz1=omegaDE0*fonction_Y(z1,true)/fonction_F(z1,true);
        let Omega_DENz2=omegaDE0*fonction_Y(z1,true)/fonction_F(z2,true);
    };
    // dz1/t0 et dz2/t0
    let dz1= (1+z1)*H0_parSecondes(H0) - H0_parSecondes(Hz1);
    let dz2= (1+z2)*H0_parSecondes(H0) - H0_parSecondes(Hz2);

    
    //! Partie photometrie -------------------
    Ie = Number(document.getElementById("i_e").value);
    //distance diamètre apparent
	var dda1 = dm1 / (1 + z1);
    var dda2 = dm2 / (1 + z2);

    // distance luminosité
	let dl1 = dm1 * (1 + z1);	
	let dl2 = dm2 * (1 + z2);

    //luminosité de l'astre
	let Le = 4 * pi() * Ie;
    //Eclat des 2 astres
	let Ee = Le / (4 * pi() * Math.pow(dl,2));
	let Ee_2 = Le / (4* pi() * Math.pow(dl_2,2));
    //module de distance
    let mu1 = -5 + 5* Math.log10(m_vers_pc(dl1));
    let mu2 = -5 + 5* Math.log10(m_vers_pc(dl2));

    //documentgetby compagnie

    duree_calcul=Date.now()-start_temps;
    //time_affiche.innerHTML = "Le calcul a duré : " + duree_calcul + " millisecondes !";
};

function generer_graphique_distance(fonction_EouF,ordonnee_t=false,log=false){
    //on récupère les variables utiles pour les calcules
    let T0 = Number(document.getElementById("T0").value);
    let H0 = Number(document.getElementById("H0").value);
    let Omega_r0 = Number(document.getElementById("Orr").innerHTML);//changer
    let Omega_m0 = Number(document.getElementById("omegam0").value);
    let Omega_k0 = Number(document.getElementById("resultat_omegak0_annexes").innerHTML);
    let Omega_l0 = Number(document.getElementById("omegalambda0").value);
    //Si il n'y a pas de big bang impossible a calculer
    if (isNaN(debut_fin_univers(equa_diff_2_LCDM, T0)[2])){
        return;
    };
    //paramètre pour le tracer
    let zmin = Number(document.getElementById("zmin").value);
	let zmax = Number(document.getElementById("zmax").value);
	let pas = Number(document.getElementById("pas_pour_z").value);
    
    // valeur des abscisses
    let abscisse = linear_scale(zmin,zmax,pas)
    // valeurs des ordonnées
    let dmArr = [];    //distance metrique
    let daArr = [];   //distance diamètre apparent
    let dlArr = [];    //distance luminosité
    let dltArr = [];   //distance temps lumière

    //calculs des longueurs
    abscisse.forEach(i => {
        if (i<0){
            dm=DistanceMetrique(fonction_EouF,i,0,true,1e2);
        }else{
            dm=DistanceMetrique(fonction_EouF,1/(i+1),1,false,1e2);
        }
        let da=dm/(1+i);
        let dl=dm*(1+i);
        let temps = calcul_ages(fonction_EouF,H0_parSecondes(H0),1e-15,1/(1+i));
        let dlt = temps * c;
        dmArr.push(m_vers_AL(dm));
        daArr.push(m_vers_AL(da));
        dlArr.push(m_vers_AL(dl));
        dltArr.push(m_vers_AL(dlt));
    });

    //affichage des omega0 sous le titre
    let annots = [{xref: 'paper',
		yref: 'paper',
		x: 0.725,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text:'T<sub>0</sub>: '+T0.toExponential(3)+'   H<sub>0</sub>:'+H0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+Omega_m0.toExponential(3)+'   \Ω<sub>Λ0</sub>:  '+Omega_l0+'   \Ω<sub>r0</sub>: ' +Omega_r0+'  \Ω<sub>k0</sub>:   '+Omega_k0.toExponential(3),
		showarrow: false}];

    
    if (ordonnee_t){
        plot_title = "d<sub>i</sub>(t)";
        xaxis_title=xaxis_temps;
        document.getElementById("graph_container_d_t").style.display = "contents";// afficher le graph
        graphdivid="graphique_d_t"
        abscisse=abscisse.map((x) => calcul_ages(fonction_EouF,H0_parAnnees(H0),1e-15,1/(1+x)));
    }else{
        plot_title = "d<sub>i</sub>(z)";
        xaxis_title = "z";
        graphdivid="graphique_d_z"
        document.getElementById("graph_container_d_z").style.display = "contents";// afficher le graph
    };

    if (log){
        plot_type="log"
    }else{
        plot_type="scatter"
    }

    //tracer des 4 courbes 
    let data = [
        {
            x : abscisse,
            y : dmArr,
            name :'<b>d<sub>m</sub><b>',type:'scatter'
        },
        {
            x : abscisse,
            y : daArr,
            name :'<b>d<sub>a</sub><b>',type:'scatter'
        },
        {
            x : abscisse,
            y : dlArr,
            name :'<b>d<sub>L</sub><b>',type:'scatter'
        },
        {
            x : abscisse,
            y : dltArr,
            name :'<b>d<sub>LT</sub><b>',type:'scatter'
        }
    ];
    //configuration de la fenetre plotly
    let layout = {  width: 1325 , height:450 , 
        title: plot_title,
        titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
        xaxis: {
            autorange: true,
            type : plot_type,
            title: xaxis_title,
            titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
            showline: true
        },

        yaxis: {
            rangemode: 'tozero',
            autorange: true,
            type : plot_type,
            title: yaxis_distance,
            titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
            showline: true
        },
        annotations: annots,
    };

    graph = $('#'+graphdivid);
    Plotly.purge(graph);
    graph.empty();
    Plotly.newPlot(graphdivid,data,layout,{displaylogo: false});
};

function generer_graphique_Omega(fonction_EouF,ordonnee_t=false,log=false){
    console.log(fonction_EouF.name);
    //Si il n'y a pas de big bang impossible a calculer
    let T0 = Number(document.getElementById("T0").value);
    if (isNaN(debut_fin_univers(equa_diff_2_LCDM, T0)[2])){
        return;
    };
    //paramètre pour le tracer
    let zmin = Number(document.getElementById("zmin").value);
	let zmax = Number(document.getElementById("zmax").value);
	let pas = Number(document.getElementById("pas_pour_z").value);
    
    // valeur des abscisses
    let abscisse = linear_scale(zmin,zmax,pas)
    // valeurs des ordonnées
    let OrArr = [];    //Paramètre de densité de rayonement
    let OmArr = [];   //Paramètre de densite de matière
    let OkArr = [];    //Paramètre de densite de courbure
    let OlArr = [];   //Paramètre de densite lambda

    //calculs des longueurs
    abscisse.forEach(i => {
        Or = Omega_r(i);
        Om = Omega_m(i);
        Ok = Omega_k(i);
        if (fonction_EouF.name===fonction_E){
            Ol = Omega_l(i);
        }else if (fonction_EouF.name===fonction_F){
            Ol = Omega_DE(i); 
        }
        

        OrArr.push(Or);
        OmArr.push(Om);
        OkArr.push(Ok);
        OlArr.push(Ol);
    });

    //affichage des omega0 sous le titre
    let annots = [{xref: 'paper',
		yref: 'paper',
		x: 0.725,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text:'T<sub>0</sub>: '+T0.toExponential(3)+'   H<sub>0</sub>:'+H0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+Omega_m(0).toExponential(3)+'   \Ω<sub>Λ0</sub>:  '+Omega_l(0)+'   \Ω<sub>r0</sub>: ' +Omega_r(0)+'  \Ω<sub>k0</sub>:   '+Omega_k(0).toExponential(3),
		showarrow: false}];

    
    if (ordonnee_t){
        plot_title = "&#x3A9;<sub>i</sub>(t)";
        xaxis_title=xaxis_temps;
        document.getElementById("graph_container_omega_t").style.display = "contents";// afficher le graph
        graphdivid="graphique_omega_t"
        abscisse=abscisse.map((x) => calcul_ages(fonction_EouF,H0_parAnnees(H0),1e-15,1/(1+x)));
    }else{
        plot_title = "&#x3A9;<sub>i</sub>(z)";
        xaxis_title = "z";
        graphdivid="graphique_omega_z"
        document.getElementById("graph_container_omega_z").style.display = "contents";// afficher le graph
    };

    if (log){
        plot_type="log"
    }else{
        plot_type="scatter"
    }

    //tracer des 4 courbes 
    let data = [
        {
            x : abscisse,
            y : OrArr,
            name :'<b>&#x3A9;<sub>R</sub><b>',type:'scatter'
        },
        {
            x : abscisse,
            y : OmArr,
            name :'<b>&#x3A9;<sub>M</sub><b>',type:'scatter'
        },
        {
            x : abscisse,
            y : OkArr,
            name :'<b>&#x3A9;<sub>K</sub><b>',type:'scatter'
        },
        {
            x : abscisse,
            y : OlArr,
            name :'<b>&#x3A9;<sub>&#x39B;</sub><b>',type:'scatter'
        }
    ];
    //configuration de la fenetre plotly
    let layout = {  width: 1325 , height:450 , 
        title: plot_title,
        titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
        xaxis: {
            autorange: true,
            type : plot_type,
            title: xaxis_title,
            titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
            showline: true
        },

        yaxis: {
            rangemode: 'tozero',
            autorange: true,
            type : plot_type,
            title: yaxis_distance,
            titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
            showline: true
        },
        annotations: annots,
    };

    graph = $('#'+graphdivid);
    Plotly.purge(graph);
    graph.empty();
    Plotly.newPlot(graphdivid,data,layout,{displaylogo: false});
};

function generer_graphique_TempsDecalage(fonction_EouF,ordonnee_t=false,log=false){
    //Si il n'y a pas de big bang impossible a calculer
    let T0 = Number(document.getElementById("T0").value);
    if (isNaN(debut_fin_univers(equa_diff_2_LCDM, T0)[2])){
        return;
    };
    //paramètre pour le tracer
    let zmin = Number(document.getElementById("zmin").value);
	let zmax = Number(document.getElementById("zmax").value);
	let pas = Number(document.getElementById("pas_pour_z").value);
    
    // valeur des abscisses
    let abscisse = linear_scale(zmin,zmax,pas)
    // valeurs des ordonnées
    let zArr = [];

    //calculs des longueurs
    abscisse.forEach(i => {
        let zdet = calcul_ages(fonction_EouF,H0_parAnnees(H0),1e-15,1/(1+i));

        zArr.push(zdet);
    });

    //affichage des omega0 sous le titre
    let annots = [{xref: 'paper',
		yref: 'paper',
		x: 0.725,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text:'T<sub>0</sub>: '+T0.toExponential(3)+'   H<sub>0</sub>:'+H0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+Omega_m(0).toExponential(3)+'   \Ω<sub>Λ0</sub>:  '+Omega_l(0)+'   \Ω<sub>r0</sub>: ' +Omega_r(0)+'  \Ω<sub>k0</sub>:   '+Omega_k(0).toExponential(3),
		showarrow: false}];

    
    if (ordonnee_t){
        yaxis_TempsDecalage=yaxis_decalage;
        plot_title = "z(t)";
        xaxis_title=xaxis_temps;
        graphdivid="graphique_z"
        document.getElementById("graph_container_z").style.display = "contents";// afficher le graph
        let abscisse_temp=zArr; //inverser les deux axes
        zArr=abscisse;
        abscisse=abscisse_temp;
    }else{
        yaxis_TempsDecalage=yaxis_temps;
        plot_title = "t(z)";
        xaxis_title = "z";
        graphdivid="graphique_t"
        document.getElementById("graph_container_t").style.display = "contents";// afficher le graph
    };

    if (log){
        plot_type="log"
    }else{
        plot_type="scatter"
    }

    //tracer des 4 courbes 
    let data = [
        {
            x : abscisse,
            y : zArr,
            name :'<b>&#x3A9;<sub>R</sub><b>',type:'scatter'
        }
    ];
    //configuration de la fenetre plotly
    let layout = {  width: 1325 , height:450 , 
        title: plot_title,
        titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
        xaxis: {
            autorange: true,
            type : plot_type,
            title: xaxis_title,
            titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
            showline: true
        },

        yaxis: {
            rangemode: 'tozero',
            autorange: true,
            type : plot_type,
            title: yaxis_TempsDecalage,
            titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
            showline: true
        },
        annotations: annots,
    };

    graph = $('#'+graphdivid);
    Plotly.purge(graph);
    graph.empty();
    Plotly.newPlot(graphdivid,data,layout,{displaylogo: false});
};

//-----------------Calcul diamètre---------
function afficher_seconde_valeur(identree){
    if (identree==="diametre"){
        let diametrekpc = m_vers_pc(document.getElementById("diametre").value)/1e3
        document.getElementById("diametrekpc").value=arrondie_affichage(diametrekpc);
    }else if (identree==="diametrekpc"){
        let diametre = pc_vers_m(document.getElementById("diametrekpc").value*1e3)
        document.getElementById("diametre").value=arrondie_affichage(diametre);
    }
};

function calcul_diamtre_vers_theta(){
    checked= true; //modifier avec bouton radio
    diametre_input = document.getElementById("diametre");
    if (checked===true){
        dda=document.getElementById("dda");
    }else {
        dda=document.getElementById("dda2");
    };
    let angle_diametre = (206265 * diametre_input/dda);
    document.getElementById('theta').value=angle_diametre;
};

function calcul_theta_versdiametre(){
    checked= true; //modifier avec bouton radio
    theta_input = document.getElementById("theta");
    if (checked===true){
        dda=document.getElementById("dda");
    }else {
        dda=document.getElementById("dda2");
    };
    let diametre = theta_input*dda/206265;
    document.getElementById("diametre").value = diametre;
    document.getElementById("diametrekpc").value = m_vers_pc(diametre)/1e3;
};

function calcul_horizons_annexe(fonction_EouF){
	let t_pour_horizon= Number(document.getElementById("t_pour_calcul_horizon").value);
	if (t_pour_horizon<=0){
		document.getElementById("resultat_dm_particule_t").innerHTML=NaN;
		document.getElementById("resultat_dm_evenement_t").innerHTML=NaN;
	}else{
		z_pour_horizon=calcul_t_inverse(t_pour_horizon,fonction_EouF);
		console.log(z_pour_horizon);
		let dm_horizon_particule_m=calcul_horizon_particule(fonction_EouF,z_pour_horizon);
		let dm_horizon_particule_Ga=m_vers_AL(dm_horizon_particule_m)/1e9;
		let dm_horizon_evenement_m=calcul_horizon_evenements(fonction_EouF,z_pour_horizon);
		let dm_horizon_evenement_Ga=m_vers_AL(dm_horizon_evenement_m)/1e9;
		document.getElementById("resultat_dm_particule_t").innerHTML=dm_horizon_particule_Ga.toExponential(4);
		document.getElementById("resultat_dm_evenement_t").innerHTML=dm_horizon_evenement_Ga.toExponential(4);}
};
//---------------------------------------

//compliquée à lire j'avoue
function calcul_dm_inverse(fonction_EouF){
    z_negatif=true; //remplacer par le bouton check
    dm_input = document.getElementById("dm_racine_dm").value;


    if (z_negatif){
        function interieur_SK_distance(x){
            function fonction_integ_distance(x){
                return Math.pow(fonction_EouF(x,true),-0.5);
            };
            return Math.pow(Math.abs(Omega_k(0)),0.5)*simpson_composite( fonction_integ_distance, x,0,1e3);
        };
        if (Omega_k(0)>=0 || interieur_SK_distance(-1)<Math.PI/2){//cas classique univers plat ou pas trop sphérique
            function fonction_dm_dichotomie(x){
                return DistanceMetrique(fonction_EouF,x,0,true);
            };
            z=Dichotomie_Remy(fonction_dm_dichotomie,dm_input,-1,0,1e-30);
        }else{//cas plus particulier ou l'univers est hyperspherique et le paramètre de courbe est assez important pour dépasser le sin(pi/2) dans l'equation de la distance metrique, il y a donc 2 solution maxmimum (pas pour tout les dm si l'interieur du sin est en dessous de pi)
            dmmax=c/(H0_parSecondes(H0)*Math.pow(Math.abs(Omega_k(0)),0.5));
            console.log(interieur_SK_distance(-1));
            if (dm_input>dmmax){
                console.log("valeur dm trop haute (>"+dmmax+")");
                return;
            };
            function fonction_dm_dichotomie(x){
                return DistanceMetrique(fonction_EouF,x,0,true);
            };
            console.log(m_vers_AL(dm_input)/1e9);
            let amax=Dichotomie_Remy(interieur_SK_distance,Math.PI/2,-1,0,1e-30);//on calcule le pique de la fonction sinus 
            let dmlimit=DistanceMetrique(fonction_EouF,-.999999999999,0,true);//correspond à la valeur vers laquelle tend dans le cas ou pi/2<interieur sk <pi
            console.log(dmlimit);
            if (interieur_SK_distance(-1)>=Math.PI || dm_input>dmlimit){//le premier cas est celui ou l'interieur de sk est superieur a pi donc forcement 2 solution, et le second cas est celui ou il existe une solution en dessous de l'asymptot et 2 au dessus
                let z1=Dichotomie_Remy(fonction_dm_dichotomie,dm_input,amax,0,1e-30);
                let z2=Dichotomie_Remy(fonction_dm_dichotomie,dm_input,-1,amax,1e-30);
                document.getElementById("z_racine_dm").value=z1+", "+z2; //résultat z
            }else{
                let z=Dichotomie_Remy(fonction_dm_dichotomie,dm_input,amax,1,1e-30);
                document.getElementById("z_racine_dm").value=z; //résultat z
            };
        };


    }else{//fonction qui renvoie la valeur compris dans la fonction SK du calcul de la distance metrique
        function interieur_SK_distance(x){
            function fonction_integ_distance(x){
                return Math.pow(fonction_EouF(x),-0.5)/Math.pow(x,2);
            };
            return Math.pow(Math.abs(Omega_k(0)),0.5)*simpson_composite( fonction_integ_distance, x,1,1e3);
        };
        if (Omega_k(0)>=0 || interieur_SK_distance(1e-15)<Math.PI/2){ //cas classique où l'univers n'est pas une hypersphère ou alors le rayon de courbure de cette sphère est trop petit  -> qu'une seule solution en positif et une négative
            function fonction_dm_dichotomie(x){
                return DistanceMetrique(fonction_EouF,x,1,false);
            };
            let a=Dichotomie_Remy(fonction_dm_dichotomie,dm_input,0,1,1e-30);
            z=(1-a)/a;
            if (z<1e-10){//cas très particulier où le z est tellement petit que le (a) correspondant devient imprécis numériquement à cause du nombre de flottant (0.999999999 est approximer à 1 ce qui fausse le calcul) on utilise donc le calcul avec z car vu que z très petit pas besoin de s'inquiéter que la bonne valeur ne soit pas comprise dans les bornes 
                function fonction_dm_dichotomie(x){
                    return DistanceMetrique(fonction_EouF,0,x,true);
                };
                z=Dichotomie_Remy(fonction_dm_dichotomie,dm_input,0,1,1e-30);
            }
            document.getElementById("z_racine_dm").value=z; //résultat z
        }else{//cas plus particulier ou l'univers est hyperspherique et le paramètre de courbe est assez important pour dépasser le sin(pi/2) dans l'equation de la distance metrique, il y a donc 2 solution maxmimum (pas pour tout les dm si l'interieur du sin est en dessous de pi)
            function fonction_dm_dichotomie(x){
                return DistanceMetrique(fonction_EouF,x,1);
            };
            let amax=Dichotomie_Remy(interieur_SK_distance,Math.PI/2,1e-15,1,1e-30);//on calcule le pique de la fonction sinus 
            let dmlimit=calcul_horizon_particule(fonction_EouF);//correspond à la valeur vers laquelle tend dans le cas ou pi/2<interieur sk <pi
            if (interieur_SK_distance(1e-15)>=Math.PI || dm_input>dmlimit){//le premier cas est celui ou l'interieur de sk est superieur a pi donc forcement 2 solution, et le second cas est celui ou il existe une solution en dessous de l'asymptot et 2 au dessus
                let a1=Dichotomie_Remy(fonction_dm_dichotomie,dm_input,amax,1,1e-30);
                let a2=Dichotomie_Remy(fonction_dm_dichotomie,dm_input,1e-15,amax,1e-30);
                z1=(1-a1)/a1;
                z2=(1-a2)/a2;
                document.getElementById("z_racine_dm").value=z1+", "+z2; //résultat z
            }else{
                let a=Dichotomie_Remy(fonction_dm_dichotomie,dm_input,amax,1,1e-30);
                z=(1-a)/a;
                document.getElementById("z_racine_dm").value=z; //résultat z
            };
        };
    };
};

function affichage_t_inverse(fonction_EouF){
    temps_em_input=document.getElementById("t_racine_em").value;
    temps_rec_input=document.getElementById("t_racine_rec").value;
    
    z_em=calcul_t_inverse(temps_em_input,fonction_EouF);
    z_rec=calcul_t_inverse(temprs_rec_input,fonction_EouF);

    document.getElementById('z_racin_t_em').value=z_em;
    document.getElementById('z_racine_t_rec').value=z_rec;
};