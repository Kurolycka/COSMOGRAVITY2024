//1 récuperer valeurs paramètres comsologiques
//?same que sur le graph donc pas besoin de modifier
    //2 Entrées
        /* 
        T0
        H0
        omegaM
        omegalambda
        type univers
        universplat
        */
    //2 Sorties
        /*
        omegaK
        omegaR
        rhoLambda
        rhoM
        rhoR
        */


function affichage_des_z(){
    start_temps=Date.now();
    //on recupere les valeurs de z1 et z2
    z1 = Number(document.getElementById("z1").value);
    z2 = Number(document.getElementById("z2").value);
    if (z1<=-1) {
        return messagebox(texte.page_univers_calculs.message_z1_incorrect,"z1 >-1");}
    if (z2<=-1) {
        return messagebox(texte.page_univers_calculs.message_z2_incorrect,"z2 >-1");
    };

    //! Partie géometrie ---------------------
    //? Calcul des Distances métriques
    //distance metrique des deux z ainsi que la distance entre eux
    dm1=DistanceMetrique(fonction_E,1/(1+z1),1);
    dm2=DistanceMetrique(fonction_E,1/(1+z2),1);
    delta_dm=Math.abs(DistanceMetrique(fonction_E,1/(1+z1),1/(1+z2)));
    
    //? Calcul des temps
    t1_sec=calcul_ages(fonction_E,H0_parSecondes(H0),1e-15,1/(1+z1));
    t2_sec=calcul_ages(fonction_E,H0_parSecondes(H0),1e-15,1/(1+z2));
    delta_t=calcul_ages(fonction_E,H0_parSecondes(H0),1/(1+z1),1/(1+z2));



    //! Partie paramètre cosmologique ------------------
    T0 = Number(document.getElementById("T0").value);
    H0 = Number(document.getElementById("H0").value);
    Omega_r0 = Number(document.getElementById("Orr").innerHTML);//changer
    Omega_m0 = Number(document.getElementById("omegam0").value);
    Omega_k0 = Number(document.getElementById("resultat_omegak0_annexes").innerHTML);
    Omega_l0 = Number(document.getElementById("omegalambda0").value);

    //temperature
    Tz1 = T0 * (1 + z1);
    Tz2 = T0 * (1 + z2);
    //taux d'expansion
    Hz1 = H0 * Math.pow(fonction_E(z1,true),0.5);
    Hz2 = H0 * Math.pow(fonction_E(z1,true),0.5);
    //Omegas 
    Omega_rz1 = Omega_r0*Math.pow((1+z1),4)/fonction_E(z1,true);
    Omega_rz2 = Omega_r0*Math.pow((1+z2),4)/fonction_E(z2,true);
    Omega_mz1 = Omega_m0*Math.pow((1+z1),3)/fonction_E(z1,true);
    Omega_mz2 = Omega_m0*Math.pow((1+z2),3)/fonction_E(z2,true);
    Omega_kz1 = Omega_k0*Math.pow((1+z1),2)/fonction_E(z1,true);
    Omega_kz2 = Omega_k0*Math.pow((1+z2),2)/fonction_E(z2,true);
    Omega_lz1 = Omega_l0/fonction_E(z1,true);
    Omega_lz2 = Omega_l0/fonction_E(z2,true);
    // dz1/t0 et dz2/t0
    dz1= (1+z1)*H0_parSecondes(H0) - H0_parSecondes(Hz1);
    dz2= (1+z2)*H0_parSecondes(H0) - H0_parSecondes(Hz2);

    
    //! Partie photometrie -------------------
    Ie = Number(document.getElementById("i_e").value);
    //distance diamètre apparent
	dda1 = dm1 / (1 + z1);
    dda2 = dm2 / (1 + z2);

    // distance luminosité
	dl1 = dm1 * (1 + z1);	
	dl2 = dm2 * (1 + z2);

    //luminosité de l'astre
	Le = 4 * pi() * Ie;
    //Eclat des 2 astres
	Ee = Le / (4 * pi() * Math.pow(dl,2));
	Ee_2 = Le / (4* pi() * Math.pow(dl_2,2));
    //module de distance
    mu1 = -5 + 5* Math.log10(m_vers_pc(dl1));
    mu2 = -5 + 5* Math.log10(m_vers_pc(dl2));

    //documentgetby compagnie

    duree_calcul=Date.now()-start_temps;
    //time_affiche.innerHTML = "Le calcul a duré : " + duree_calcul + " millisecondes !";
};


function generer_graphique_distance(ordonnee_t=false,log=false){
    //on récupère les variables utiles pour les calcules
    let T0 = Number(document.getElementById("T0").value);
    let H0 = Number(document.getElementById("H0").value);
    let Omega_r0 = Number(document.getElementById("Orr").innerHTML);//changer
    let Omega_m0 = Number(document.getElementById("omegam0").value);
    let Omega_k0 = Number(document.getElementById("resultat_omegak0_annexes").innerHTML);
    let Omega_l0 = Number(document.getElementById("omegalambda0").value);
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
        let dm=DistanceMetrique(fonction_E,1/(i+1),1,false,1e2);
        let da=dm/(1+i);
        let dl=dm*(1+i);
        let temps = calcul_ages(fonction_E,H0_parSecondes(H0),1e-12,1/(1+i));
        dlt = temps * c;
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
        xaxis_title="t";
        document.getElementById("graph_container_d_t").style.display = "contents";// afficher le graph
        graphdivid="graphique_d_t"
        abscisse=abscisse.map((x) => calcul_ages(fonction_E,H0_parAnnees(H0),1e-15,1/(1+x)));
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
}



    
//1 Calcul inverse
    //2 avec dm
    //2 avec t


//1 Calcul horizons cosmologiques
    //2 particules et evenements