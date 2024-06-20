/**
 * fonction pour renvoyer une liste de point de zmin a zmax avec nb_pts
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

/**
 * fonction pour l'affichage de toutes les valeurs correspondant au z1,z2 et luminosité
 * @param {*} fonction_EouF Fonction_E pour univers LCDM Fonction_F pour univers DarkEnergy
 * @returns 
 */
function affichage_des_z(fonction_EouF){
    let start_temps=Date.now(); //commencer le timer pour savoir combien de temps les calculs prennent
    let H0 = Number(document.getElementById("H0").value);
    z1 = Number(document.getElementById("z1").value);
    z2 = Number(document.getElementById("z2").value);
    if (z1<=-1) {//cas ou z1 et z2 sont en dessous de -1 impossible
        return messagebox(texte.page_univers_calculs.message_z1_incorrect,"z1 >-1");}
    if (z2<=-1) {
        return messagebox(texte.page_univers_calculs.message_z2_incorrect,"z2 >-1");
    };

    //! ____________________________________________________Partie géometrie___________________________________________________________
    //? ----------Calcul des Distances métriques-----------
    if (z1<0){//si z négatif alors on integre de z à 0
        dm1=DistanceMetrique(fonction_EouF,z1,0,true,);
    }else{//si z positif alors on integre de 0 à z
        dm1=DistanceMetrique(fonction_EouF,0,z1,true);
    };
    if (z2<0){
        dm2=DistanceMetrique(fonction_EouF,z2,0,true,);
    }else{
        dm2=DistanceMetrique(fonction_EouF,0,z2,true);
    };
    let delta_dm=Math.abs(DistanceMetrique(fonction_EouF,z1,z2,true)); //distance entre les deux z

    //on affiche toutes les valeurs de distances ainsi que leurs conversions
    document.getElementById('output_dm1').value=arrondie_affichage(dm1);
    document.getElementById('output_dm1_pc').value=arrondie_affichage(m_vers_pc(dm1));
    document.getElementById('output_dm1_al').value=arrondie_affichage(m_vers_AL(dm1));
    document.getElementById('output_dm2').value=arrondie_affichage(dm2);
    document.getElementById('output_dm2_pc').value=arrondie_affichage(m_vers_pc(dm2));
    document.getElementById('output_dm2_al').value=arrondie_affichage(m_vers_AL(dm2));
    document.getElementById('output_delta_dm').value=arrondie_affichage(delta_dm);
    document.getElementById('output_delta_dm_pc').value=arrondie_affichage(m_vers_pc(delta_dm));
    document.getElementById('output_delta_dm_al').value=arrondie_affichage(m_vers_AL(delta_dm));
    

    
    //? -----------Calcul des temps----------------$
    let t1;
    let t2;
    if (z1<0){
        t1=calcul_ages(fonction_EouF,H0_parSecondes(H0),z2,0,true); //calcul des temps en seconde grâce a la formule de théorie
    }else{
        t1=calcul_ages(fonction_EouF,H0_parSecondes(H0),1e-30,1/(1+z1)); //calcul des temps en seconde grâce a la formule de théorie
    }
    if (z2<0){
        t2=calcul_ages(fonction_EouF,H0_parSecondes(H0),z2,0,true); //calcul des temps en seconde grâce a la formule de théorie
    }else{
        t2=calcul_ages(fonction_EouF,H0_parSecondes(H0),1e-30,1/(1+z2)); //calcul des temps en seconde grâce a la formule de théorie
    }
    let delta_t=calcul_ages(fonction_EouF,H0_parSecondes(H0),1/(1+z1),1/(1+z2));
    document.getElementById('output_t1').value=arrondie_affichage(t1);
    document.getElementById('output_t1_annee').value=arrondie_affichage(seconde_vers_annee(t1));
    document.getElementById('output_t2').value=arrondie_affichage(t2);
    document.getElementById('output_t2_annee').value=arrondie_affichage(seconde_vers_annee(t2));
    document.getElementById('output_delta_t').value=arrondie_affichage(delta_t);
    document.getElementById('output_delta_t_annee').value=arrondie_affichage(seconde_vers_annee(delta_t));


    //! __________________________________________________________________Partie paramètre cosmologique_____________________________________________
    let T0 = Number(document.getElementById("T0").value);
    let Omega_r0 = Number(document.getElementById("Omégar0").value);//changer les noms des id (pas compréhensible)
    let Omega_m0 = Number(document.getElementById("Omégam0").value);
    let Omega_k0 = Number(document.getElementById("Omégak0").value);
    let Omega_l0;
    if (fonction_EouF.name==="fonction_E"){//si univers LCDM alors omegaL0 reste tel quel
        Omega_l0 = Number(document.getElementById("Omégal0").value);
    }else if (fonction_EouF.name==="fonction_F"){//si univers DE alors omegaL0 devien omegaDE
        omegaDE0 = Number(document.getElementById("OmégaDE0").value);
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
    let Omega_lz1; //définis dans le if suivant
    let Omega_lz2;
    let Omega_DEz1;
    let Omega_DEz2;
    let Omega_DENz1;
    let Omega_DENz2;

    if (fonction_EouF.name==="fonction_E"){
        Omega_lz1 = Omega_l0/fonction_E(z1,true);
        Omega_lz2 = Omega_l0/fonction_E(z2,true);
    }else if (fonction_EouF.name==="fonction_F"){
        Omega_DEz1=omegaDE0/fonction_F(z1,true);
        Omega_DEz2=omegaDE0/fonction_F(z2,true);
        Omega_DENz1=omegaDE0*fonction_Y(1/(1+z1))/fonction_F(z1,true);
        Omega_DENz2=omegaDE0*fonction_Y(1/(1+z2))/fonction_F(z2,true);
    };
    // dz1/t0 et dz2/t0
    let dz1= (1+z1)*H0_parSecondes(H0) - H0_parSecondes(Hz1);
    let dz2= (1+z2)*H0_parSecondes(H0) - H0_parSecondes(Hz2);


    document.getElementById("T_z1").value = arrondie_affichage(Tz1);
    document.getElementById("H_z1").value = arrondie_affichage(Hz1);
    document.getElementById("omegaR_z1").value = arrondie_affichage(Omega_rz1);
    document.getElementById("omegaM_z1").value = arrondie_affichage(Omega_mz1);
    document.getElementById("omegaK_z1").value = arrondie_affichage(Omega_kz1);
    if (fonction_EouF.name==="fonction_E"){
        document.getElementById("omegaL_z1").value = arrondie_affichage(Omega_lz1);
        document.getElementById("omegaTotal_z1").value=arrondie_affichage(Omega_rz1+Omega_mz1+Omega_kz1+Omega_lz1);
    }else if (fonction_EouF.name==="fonction_F"){
        document.getElementById("omegaDE_z1").value = arrondie_affichage(Omega_DEz1);
        document.getElementById("omegaDEN_z1").value = arrondie_affichage(Omega_DENz1);
        document.getElementById("omegaTotal_z1").value=arrondie_affichage(Omega_rz1+Omega_mz1+Omega_kz1+Omega_DENz1);
    };
    document.getElementById("output_dz1dt").value = arrondie_affichage(dz1);

    document.getElementById("T_z2").value = arrondie_affichage(Tz2);
    document.getElementById("H_z2").value = arrondie_affichage(Hz2);
    document.getElementById("omegaR_z2").value = arrondie_affichage(Omega_rz2);
    document.getElementById("omegaM_z2").value = arrondie_affichage(Omega_mz2);
    document.getElementById("omegaK_z2").value = arrondie_affichage(Omega_kz2);
    if (fonction_EouF.name==="fonction_E"){
        document.getElementById("omegaL_z2").value = arrondie_affichage(Omega_lz2);
        document.getElementById("omegaTotal_z2").value=arrondie_affichage(Omega_rz2+Omega_mz2+Omega_kz2+Omega_lz2);
    }else if (fonction_EouF.name==="fonction_F"){
        document.getElementById("omegaDE_z2").value = arrondie_affichage(Omega_DEz2);
        document.getElementById("omegaDEN_z2").value = arrondie_affichage(Omega_DENz2);
        document.getElementById("omegaTotal_z2").value=arrondie_affichage(Omega_rz2+Omega_mz2+Omega_kz2+Omega_DENz2);
    };
    document.getElementById("output_dz2dt").value = arrondie_affichage(dz2);

    
    //! Partie photometrie -------------------
    Ie = Number(document.getElementById("ie").value);
    //distance diamètre apparent
	var dda1 = dm1 / (1 + z1);
    var dda2 = dm2 / (1 + z2);

    // distance luminosité
	let dl1 = dm1 * (1 + z1);	
	let dl2 = dm2 * (1 + z2);

    //luminosité de l'astre
	let Le = 4 * Math.PI * Ie;
    //Eclat des 2 astres
	let Ee1 = Le / (4 * Math.PI * Math.pow(dl1,2));
	let Ee2 = Le / (4* Math.PI * Math.pow(dl2,2));
    //module de distance
    let mu1 = -5 + 5* Math.log10(m_vers_pc(dl1));
    let mu2 = -5 + 5* Math.log10(m_vers_pc(dl2));

    document.getElementById("output_Le").value = arrondie_affichage(Le);
    document.getElementById("output_dL1").value = arrondie_affichage(dl1);
    document.getElementById("output_dL1_pc").value = arrondie_affichage(m_vers_pc(dl1));
    document.getElementById("output_dL1_al").value = arrondie_affichage(m_vers_AL(dl1));
    document.getElementById("output_dL2").value = arrondie_affichage(dl2);
    document.getElementById("output_dL2_pc").value = arrondie_affichage(m_vers_pc(dl2));
    document.getElementById("output_dL2_al").value = arrondie_affichage(m_vers_AL(dl2));
    document.getElementById("output_da1").value = arrondie_affichage(dda1);
    document.getElementById("output_da1_pc").value = arrondie_affichage(m_vers_pc(dda1));
    document.getElementById("output_da1_al").value = arrondie_affichage(m_vers_AL(dda1));
    document.getElementById("output_da2").value = arrondie_affichage(dda2);
    document.getElementById("output_da2_pc").value = arrondie_affichage(m_vers_pc(dda2));
    document.getElementById("output_da2_al").value = arrondie_affichage(m_vers_AL(dda2));
    document.getElementById("output_E1").value = arrondie_affichage(Ee1);
    document.getElementById("output_E2").value = arrondie_affichage(Ee2);
    document.getElementById("output_mu1").value = arrondie_affichage(mu1);
    document.getElementById("output_mu2").value = arrondie_affichage(mu2);

    duree_calcul=Date.now()-start_temps;
    document.getElementById('resul_tps').innerHTML = "Le calcul a duré : " + duree_calcul + " millisecondes !";
};


function generer_graphique_distance(fonction_EouF){
    start_temps=Date.now();
    ordonnee_t=document.getElementById('radio_fonction_t').checked;
    log_abs=document.getElementById('check_log_abs').checked;
    log_ord=document.getElementById('check_log_ord').checked;
    //on récupère les variables utiles pour les calcules
    let T0 = Number(document.getElementById("T0").value);
    let H0 = Number(document.getElementById("H0").value);
    let Omega_r0 = Number(document.getElementById("Omégar0").value);//changer
    let Omega_m0 = Number(document.getElementById("Omégam0").value);
    let Omega_k0 = Number(document.getElementById("Omégak0").value);

    if (fonction_EouF.name==="fonction_E"){
        let Omega_l0 = Number(document.getElementById("Omégal0").value);
        text_omegal0_graph ='   \Ω<sub>Λ0</sub>:  '+Omega_l0;
        w0w1="";
        equa_diff_2=equa_diff_2_LCDM;
    }else if (fonction_EouF.name==="fonction_F"){
        let Omega_DE0 = Number(document.getElementById('OmégaDE0').value);
        text_omegal0_graph ='   \Ω<sub>DE0</sub>:  '+Omega_DE0;
        w0w1="  w<sub>0</sub>: "+document.getElementById("w0").value+"  w<sub>1</sub>: "+document.getElementById("w1").value;
        equa_diff_2=equa_diff_2_DE;
    };

    //Si il n'y a pas de big bang impossible a calculer
    if (isNaN(debut_fin_univers(equa_diff_2, T0)[2])){
        return;
    };
    //paramètre pour le tracer
    let zmin = Number(document.getElementById("graphique_z_min").value);
	let zmax = Number(document.getElementById("graphique_z_max").value);
	let pas = Number(document.getElementById("graphique_pas").value);
    
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
		x: 0.95,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text:'T<sub>0</sub>: '+T0.toExponential(3)+'   H<sub>0</sub>:'+H0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+Omega_m0.toExponential(3)+text_omegal0_graph+'   \Ω<sub>r0</sub>: ' +Omega_r0+'  \Ω<sub>k0</sub>:   '+Omega_k0.toExponential(3)+w0w1,
		showarrow: false}];

    
    if (ordonnee_t){
        plot_title = "d<sub>i</sub>(t)";
        xaxis_title=xaxis_temps;
        graphdivid="graphique_d_t"
        abscisse=abscisse.map((x) => calcul_ages(fonction_EouF,H0_parAnnees(H0),1e-15,1/(1+x)));
        document.getElementById('check_distance_t').checked=true;
    }else{
        plot_title = "d<sub>i</sub>(z)";
        xaxis_title = "z";
        graphdivid="graphique_d_z"
        document.getElementById('check_distance_z').checked=true;
    };

    if (log_abs){
        plot_type_abs="log"
    }else{
        plot_type_abs="scatter"
    };
    if (log_ord){
        plot_type_ord="log"
    }else{
        plot_type_ord="scatter"
    };

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
    let layout = {  width: 900 , height:450 , 
        title: plot_title,
        titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
        xaxis: {
            autorange: true,
            type : plot_type_abs,
            title: xaxis_title,
            titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
            showline: true
        },

        yaxis: {
            rangemode: 'tozero',
            autorange: true,
            type : plot_type_ord,
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

    document.getElementById("temps_calcul_graph").innerHTML = "Le calcul a duré : " + (Date.now()-start_temps) + " millisecondes !";
};

function generer_graphique_Omega(fonction_EouF){
    start_temps=Date.now();
    ordonnee_t=document.getElementById('radio_fonction_t').checked;
    log_abs=document.getElementById('check_log_abs').checked;
    log_ord=document.getElementById('check_log_ord').checked;

    //paramètre pour le tracer
    let zmin = Number(document.getElementById("graphique_z_min").value);
	let zmax = Number(document.getElementById("graphique_z_max").value);
	let pas = Number(document.getElementById("graphique_pas").value);
    
    // valeur des abscisses
    let abscisse = linear_scale(zmin,zmax,pas)



    if (fonction_EouF.name==="fonction_E"){
        //Si il n'y a pas de big bang impossible a calculer
        let T0 = Number(document.getElementById("T0").value);
        if (isNaN(debut_fin_univers(equa_diff_2_LCDM, T0)[2])){
            return;
        };
        text_omegal0_graph ='   \Ω<sub>Λ0</sub>:  '+Omega_l(0); //texte et titre dans lequel omegalambda ou omegaDE apparait
        titre_omegal='<b>&#x3A9;<sub>&#x39B;</sub><b>';
        w0w1="";
        // valeurs des ordonnées
        OrArr = [];    //Paramètre de densité de rayonement
        OmArr = [];    //Paramètre de densite de matière
        OkArr = [];    //Paramètre de densite de courbure
        OlArr = [];    //Paramètre de densite lambda ou DE

        //calculs des omegas
        abscisse.forEach(i => {
            Or = Omega_r(i);
            Om = Omega_m(i);
            Ok = Omega_k(i);
            Ol = Omega_l(i);        

            OrArr.push(Or);
            OmArr.push(Om);
            OkArr.push(Ok);
            OlArr.push(Ol);
        });
    }else if (fonction_EouF.name==="fonction_F"){
        //Si il n'y a pas de big bang impossible a calculer
        let T0 = Number(document.getElementById("T0").value);
        if (isNaN(debut_fin_univers(equa_diff_2_DE, T0)[2])){
            return;
        };
        text_omegal0_graph ='   \Ω<sub>DE0</sub>:  '+Omega_DE(0); //texte et titre dans lequel omegalambda ou omegaDE apparait
        titre_omegal='<b>&#x3A9;<sub>DE</sub><b>';
        w0w1="  w<sub>0</sub>: "+document.getElementById("w0").value+"  w<sub>1</sub>: "+document.getElementById("w1").value;
    
        // valeurs des ordonnées
        OrArr = [];    //Paramètre de densité de rayonement
        OmArr = [];    //Paramètre de densite de matière
        OkArr = [];    //Paramètre de densite de courbure
        OlArr = [];    //Paramètre de densite lambda ou DE

        //calculs des omegas
        abscisse.forEach(i => {
            Or = Omega_r(i);
            Om = Omega_m(i);
            Ok = Omega_k(i);
            if (document.getElementById('omegaDE_normalise').checked){
                Ol=Omega_DE(i)
            }else{
                Ol= Omega_DE(0) / fonction_F(i,true);
            };  

            OrArr.push(Or);
            OmArr.push(Om);
            OkArr.push(Ok);
            OlArr.push(Ol);
        });
    };

    //affichage des omega0 sous le titre
    let annots = [{xref: 'paper',
		yref: 'paper',
		x: 0.95,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text:'T<sub>0</sub>: '+T0.toExponential(3)+'   H<sub>0</sub>:'+H0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+Omega_m(0).toExponential(3)+text_omegal0_graph+'   \Ω<sub>r0</sub>: ' +Omega_r(0).toExponential(3)+'  \Ω<sub>k0</sub>:   '+Omega_k(0).toExponential(3)+w0w1,
		showarrow: false}];

    
    if (ordonnee_t){
        plot_title = "&#x3A9;<sub>i</sub>(t)";
        xaxis_title=xaxis_temps;
        graphdivid="graphique_omega_t"
        abscisse=abscisse.map((x) => calcul_ages(fonction_EouF,H0_parAnnees(H0),1e-15,1/(1+x)));
        document.getElementById('check_omega_t').checked=true;
    }else{
        plot_title = "&#x3A9;<sub>i</sub>(z)";
        xaxis_title = "z";
        graphdivid="graphique_omega_z"
        document.getElementById('check_omega_z').checked=true;
    };

    if (log_abs){
        plot_type_abs="log"
    }else{
        plot_type_abs="scatter"
    };
    if (log_ord){
        plot_type_ord="log"
    }else{
        plot_type_ord="scatter"
    };

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
            name :titre_omegal,type:'scatter'
        }
    ];
    //configuration de la fenetre plotly
    let layout = {  width: 900 , height:450 , 
        title: plot_title,
        titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
        xaxis: {
            autorange: true,
            type : plot_type_abs,
            title: xaxis_title,
            titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
            showline: true
        },

        yaxis: {
            rangemode: 'tozero',
            autorange: true,
            type : plot_type_ord,
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

    document.getElementById("temps_calcul_graph").innerHTML = "Le calcul a duré : " + (Date.now()-start_temps) + " millisecondes !";
};

function generer_graphique_TempsDecalage(fonction_EouF){
    start_temps=Date.now();
    ordonnee_t=document.getElementById('radio_fonction_t').checked;
    log_abs=document.getElementById('check_log_abs').checked;
    log_ord=document.getElementById('check_log_ord').checked;

    if (fonction_EouF.name==="fonction_E"){
        text_omegal0_graph ='   \Ω<sub>Λ0</sub>:  '+Omega_l(0);
        equa_diff_2=equa_diff_2_LCDM;
        w0w1="";
    }else if (fonction_EouF.name==="fonction_F"){
        text_omegal0_graph ='   \Ω<sub>DE0</sub>:  '+Omega_DE(0);
        w0w1="  w<sub>0</sub>: "+document.getElementById("w0").value+"  w<sub>1</sub>: "+document.getElementById("w1").value;
        equa_diff_2=equa_diff_2_DE;
    };


    //Si il n'y a pas de big bang impossible a calculer
    let T0 = Number(document.getElementById("T0").value);
    if (isNaN(debut_fin_univers(equa_diff_2, T0)[2])){
        return;
    };
    //paramètre pour le tracer
    let zmin = Number(document.getElementById("graphique_z_min").value);
	let zmax = Number(document.getElementById("graphique_z_max").value);
	let pas = Number(document.getElementById("graphique_pas").value);
    
    // valeur des abscisses
    let abscisse = linear_scale(zmin,zmax,pas)
    // valeurs des ordonnées
    let zArr = [];

    //calculs des longueurs
    abscisse.forEach(i => {
        let zdet
        if (i<0){
            zdet = calcul_ages(fonction_EouF,H0_parAnnees(H0),i,0,true);
        }else{
            zdet = calcul_ages(fonction_EouF,H0_parAnnees(H0),1e-15,1/(1+i));
        }

        zArr.push(zdet);
    });

    //affichage des omega0 sous le titre
    let annots = [{xref: 'paper',
		yref: 'paper',
		x: .95,
		xanchor: 'right',
		y: 1,
		yanchor: 'bottom',
		text:'T<sub>0</sub>: '+T0.toExponential(3)+'   H<sub>0</sub>:'+H0.toExponential(3)+ '   \Ω<sub>m0</sub>: '+Omega_m(0).toExponential(3)+text_omegal0_graph+'   \Ω<sub>r0</sub>: ' +Omega_r(0)+'  \Ω<sub>k0</sub>:   '+Omega_k(0).toExponential(3)+w0w1,
		showarrow: false}];

    
    if (ordonnee_t){
        yaxis_TempsDecalage=yaxis_decalage;
        plot_title = "z(t)";
        xaxis_title=xaxis_temps;
        graphdivid="graphique_z_t"
        let abscisse_temp=zArr; //inverser les deux axes
        zArr=abscisse;
        abscisse=abscisse_temp;
        document.getElementById('check_t_z').checked=true;
    }else{
        yaxis_TempsDecalage=yaxis_temps;
        plot_title = "t(z)";
        xaxis_title = "z";
        graphdivid="graphique_t_z"
        
        document.getElementById('check_z_t').checked=true;
    };

    if (log_abs){
        plot_type_abs="log"
    }else{
        plot_type_abs="scatter"
    };
    if (log_ord){
        plot_type_ord="log"
    }else{
        plot_type_ord="scatter"
    };

    //tracer des 4 courbes 
    let data = [
        {
            x : abscisse,
            y : zArr,
            name :'<b>&#x3A9;<sub>R</sub><b>',type:'scatter'
        }
    ];
    //configuration de la fenetre plotly
    let layout = {  width: 900 , height:450 , 
        title: plot_title,
        titlefont:{family:"Time New Roman, sans-serif",size:20,color:"#111111"},
        xaxis: {
            autorange: true,
            type : plot_type_abs,
            title: xaxis_title,
            titlefont:{family:"Time New Roman, sans-serif",size:16,color:"#111111"},
            showline: true
        },

        yaxis: {
            rangemode: 'tozero',
            autorange: true,
            type : plot_type_ord,
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

    document.getElementById("temps_calcul_graph").innerHTML = "Le calcul a duré : " + (Date.now()-start_temps) + " millisecondes !";
};

//-----------------Calcul diamètre---------
/**
 * Fonction qui permet d'acchier en direct la conversion du m vers le kpc pour les diamètres
 * @param {*} identree id html de l'entrée pour savoir dans quel sens faire la conversion
 */
function afficher_seconde_valeur(identree){
    if (identree==="Diametre_m"){
        let diametrekpc = m_vers_pc(document.getElementById("Diametre_m").value)/1e3
        document.getElementById("Diametre_kpc").value=arrondie_affichage(diametrekpc);
    }else if (identree==="Diametre_kpc"){
        let diametre = pc_vers_m(document.getElementById("Diametre_kpc").value*1e3)
        document.getElementById("Diametre_m").value=arrondie_affichage(diametre);
    }
};

/**
 * Calcul la valeur de theta grace au diametre en metre
 */
function calcul_diamtre_vers_theta(){
    diametre_input = document.getElementById("Diametre_m").value;
    if (document.getElementById("select_z1_diametre").checked){
        dda=document.getElementById("output_da1").value;
    }else{
        dda=document.getElementById("output_da2").value;
    };
    let angle_diametre = (206265 * diametre_input/dda);

    document.getElementById('theta').value=arrondie_affichage(angle_diametre);
};

/**
 * calcul inverse du précedent pour calculer le diametre en metre et indirectement en kpc grace a theta
 */
function calcul_theta_vers_diametre(){
    theta_input = document.getElementById("theta").value;
    if (document.getElementById("select_z1_diametre").checked){
        dda=document.getElementById("output_da1").value;
    }else {
        dda=document.getElementById("output_da2").value;
    };
    let diametre = theta_input*dda/206265;
    document.getElementById("Diametre_m").value = arrondie_affichage(diametre);
    document.getElementById("Diametre_kpc").value = arrondie_affichage(m_vers_pc(diametre)/1e3);
};

/**
 * renvoie différente valeur des horizon cosmologique des evenementes et particule en fonction d'un temps
 * @param {*} fonction_EouF 
 */
function calcul_horizons_annexe(fonction_EouF){
	let t_pour_horizon= Number(document.getElementById("t_pour_calcul_horizon").value);
	if (t_pour_horizon<=0){
		document.getElementById("resultat_dm_particule_t").value=NaN;
		document.getElementById("resultat_dm_evenement_t").value=NaN;
	}else{
		z_pour_horizon=calcul_t_inverse(t_pour_horizon,fonction_EouF,H0_parSecondes(H0));
		let dm_horizon_particule_m=calcul_horizon_particule(fonction_EouF,z_pour_horizon);
		let dm_horizon_particule_pc=m_vers_pc(dm_horizon_particule_m);
		let dm_horizon_particule_al=m_vers_AL(dm_horizon_particule_m);
		let dm_horizon_evenement_m=calcul_horizon_evenements(fonction_EouF,z_pour_horizon);
		let dm_horizon_evenement_pc=m_vers_pc(dm_horizon_evenement_m);
		let dm_horizon_evenement_al=m_vers_AL(dm_horizon_evenement_m);
		document.getElementById("resultat_dm_particule_m").value=arrondie_affichage(dm_horizon_particule_m);
		document.getElementById("resultat_dm_particule_pc").value=arrondie_affichage(dm_horizon_particule_pc);
		document.getElementById("resultat_dm_particule_al").value=arrondie_affichage(dm_horizon_particule_al);
		document.getElementById("resultat_dm_evenement_m").value=arrondie_affichage(dm_horizon_evenement_m);
		document.getElementById("resultat_dm_evenement_pc").value=arrondie_affichage(dm_horizon_evenement_pc);
		document.getElementById("resultat_dm_evenement_al").value=arrondie_affichage(dm_horizon_evenement_al);
        };
};

//--------------------Calcul inverse-------------------
/**
 * Permet d'obtenir le ou les valeurs de z correspondant a un dm grace a la méthode de dichotomie
 * Fonction la plus compliqué de la calculette a cause des cas particulier
 * @param {*} fonction_EouF 
 * @returns 
 */
function calcul_dm_inverse(fonction_EouF){
    z_negatif=document.getElementById('z_negatif_dm_inverse').checked; //savoir si on cherche un z négatif car il existe un z negatif (ou plus) et un z positif (ou plus) pour chaque valeur de dm
    dm_input = document.getElementById("dm_inverse").value; 



    if (z_negatif){ //cas z negatif
        function interieur_SK_distance(x){ //fonction representant l'interieur de de la fonctin SK() dans la théorie sur la distance metrique, permet de savoir si l'univers sphérique l'est assez pour avoir plusieurs z
            function fonction_integ_distance(x){
                return Math.pow(fonction_EouF(x,true),-0.5);
            };
            return Math.pow(Math.abs(Omega_k(0)),0.5)*simpson_composite( fonction_integ_distance, x,0,1e3);
        };

        if (Omega_k(0)>=0 || interieur_SK_distance(-1)<Math.PI/2){//cas classique univers plat ou pas trop sphérique -> 1 un seul z
            function fonction_dm_dichotomie(x){ //equation de la distance metrique avec seulement z comme variable
                return DistanceMetrique(fonction_EouF,x,0,true);
            };
            z=Dichotomie(fonction_dm_dichotomie,dm_input,-1,0,1e-30);
            document.getElementById("output_z_dm").value=arrondie_affichage(z);



        }else{//cas plus particulier ou l'univers est hyperspherique et le paramètre de courbe est assez important pour dépasser le sin(pi/2) dans l'equation de la distance metrique, il y a donc 2 solution maxmimum (pas pour tout les dm si l'interieur du sin est en dessous de pi)
            dmmax=c/(H0_parSecondes(H0)*Math.pow(Math.abs(Omega_k(0)),0.5));
            if (dm_input>dmmax){
                console.log("valeur dm trop haute (>"+dmmax+")"); //a changer en erreur
                return;
            };

            function fonction_dm_dichotomie(x){ //equation de la distance metrique avec seulement z comme variable
                return DistanceMetrique(fonction_EouF,x,0,true);
            };

            let amax=Dichotomie(interieur_SK_distance,Math.PI/2,-1,0,1e-30);//on calcule le pique de la fonction sinus 
            let dmlimit=DistanceMetrique(fonction_EouF,-.999999999999,0,true);//correspond à la valeur vers laquelle tend dans le cas ou pi/2<interieur sk <pi
            
            if (interieur_SK_distance(-1)>=Math.PI || dm_input>dmlimit){//le premier cas est celui ou l'interieur de sk est superieur a pi donc forcement 2 solution, et le second cas est celui ou il existe une solution en dessous de l'asymptote et 2 au dessus donc on ne renvoie qu'une valeur si en dessous
                let z1=Dichotomie(fonction_dm_dichotomie,dm_input,amax,0,1e-30);
                let z2=Dichotomie(fonction_dm_dichotomie,dm_input,-1,amax,1e-30);
                document.getElementById("output_z_dm").value=arrondie_affichage(z1)+", "+arrondie_affichage(z2); //résultat z
            }else{
                let z=Dichotomie(fonction_dm_dichotomie,dm_input,amax,1,1e-30);
                document.getElementById("output_z_dm").value=arrondie_affichage(z); //résultat z
            };
        };



    }else{
        function interieur_SK_distance(x){//fonction representant l'interieur de de la fonctin SK() dans la théorie sur la distance metrique, permet de savoir si l'univers sphérique l'est assez pour avoir plusieurs z
            function fonction_integ_distance(x){
                return Math.pow(fonction_EouF(x),-0.5)/Math.pow(x,2);
            };
            return Math.pow(Math.abs(Omega_k(0)),0.5)*simpson_composite( fonction_integ_distance, x,1,1e3);
        };



        if (Omega_k(0)>=0 || interieur_SK_distance(1e-15)<Math.PI/2){ //cas classique où l'univers n'est pas une hypersphère ou alors le rayon de courbure de cette sphère est trop petit  -> qu'une seule solution en positif et une négative
            function fonction_dm_dichotomie(x){
                return DistanceMetrique(fonction_EouF,x,1,false);
            };
            let a=Dichotomie(fonction_dm_dichotomie,dm_input,0,1,1e-30);
            z=(1-a)/a;
            if (z<1e-10){//cas très particulier où le z est tellement petit que le (a) correspondant devient imprécis numériquement à cause du nombre de flottant (0.999999999 est approximer à 1 ce qui fausse le calcul) on utilise donc le calcul avec z car vu que z très petit pas besoin de s'inquiéter que la bonne valeur ne soit pas comprise dans les bornes 
                function fonction_dm_dichotomie(x){
                    return DistanceMetrique(fonction_EouF,0,x,true);
                };
                z=Dichotomie(fonction_dm_dichotomie,dm_input,0,1,1e-30);
            };
            document.getElementById("output_z_dm").value=arrondie_affichage(z); //résultat z



        }else{//cas plus particulier ou l'univers est hyperspherique et le paramètre de courbe est assez important pour dépasser le sin(pi/2) dans l'equation de la distance metrique, il y a donc 2 solution maxmimum (pas pour tout les dm si l'interieur du sin est en dessous de pi)
            function fonction_dm_dichotomie(x){
                return DistanceMetrique(fonction_EouF,x,1);
            };
            let amax=Dichotomie(interieur_SK_distance,Math.PI/2,1e-15,1,1e-30);//on calcule le pique de la fonction sinus 
            let dmlimit=calcul_horizon_particule(fonction_EouF);//correspond à la valeur vers laquelle tend dans le cas ou pi/2<interieur sk <pi
            if (interieur_SK_distance(1e-15)>=Math.PI || dm_input>dmlimit){//le premier cas est celui ou l'interieur de sk est superieur a pi donc forcement 2 solution, et le second cas est celui ou il existe une solution en dessous de l'asymptot et 2 au dessus
                let a1=Dichotomie(fonction_dm_dichotomie,dm_input,amax,1,1e-30);
                let a2=Dichotomie(fonction_dm_dichotomie,dm_input,1e-15,amax,1e-30);
                z1=(1-a1)/a1;
                z2=(1-a2)/a2;
                document.getElementById("output_z_dm").value=arrondie_affichage(z1)+", "+arrondie_affichage(z2); //résultat z
            }else{
                let a=Dichotomie(fonction_dm_dichotomie,dm_input,amax,1,1e-30);
                z=(1-a)/a;
                document.getElementById("output_z_dm").value=arrondie_affichage(z); //résultat z
            };
        };
    };
};

/**
 * Renvoie la valeur d'un z correspondant a un temps, si le temps est supérieur a celui de l'age de l'univers alors le z est negatif
 * Beaucoup plus simple que la fonction précedente car toujours strictement monotone (j'espere)
 * @param {*} fonction_EouF 
 */
function affichage_t_inverse(fonction_EouF){
    temps_em_input=document.getElementById("tem_inverse").value;
    temps_rec_input=document.getElementById("trec_inverse").value;
    if (temps_em_input<0.01){
        z_em=NaN;
    }else{
        z_em=calcul_t_inverse(temps_em_input,fonction_EouF,H0_parAnnees(H0));
    }
    if(temps_rec_input<0.01){
        z_rec=NaN;
    }else{
        z_rec=calcul_t_inverse(temps_rec_input,fonction_EouF,H0_parAnnees(H0));
    };
    

    document.getElementById('output_z_tem').value=arrondie_affichage(z_em);
    document.getElementById('output_z_trec').value=arrondie_affichage(z_rec);
};