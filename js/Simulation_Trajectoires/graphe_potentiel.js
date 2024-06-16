/**
 * Fonction qui crée le graphe du potentiel à chaque fois qu'elle est appelée,
 pour pouvoir adapter la particule et le potentiel à la position acutelle
 * @param {*} Onresize : si on veut changer de zoom.
 * @param {*} data1 : liste qui contient la gamme qu'on doit dessiner.
 * @param {*} data2  : liste qui contient les valeurs à dessiner.
 * @param {*} compteur : pour savoir quel mobile c'est.
 * @param {*} mobile  : le mobile pour lequel on trace le potentiel.
 * @returns 
 */
function graphique_creation_pot(Onresize=0,data1,data2,compteur,mobile) 
{
  //on verifie que les données existent 
  if(data2 !== undefined && data1 !== undefined && data2[0]!==undefined)
  {
    var texte = o_recupereJson(); // on recupere le texte du json
    titre = texte.pages_trajectoire.titre_graphe //KERR
    graphe_svg="#grsvg_2"  //KERR
    graphe_point="line-point" //KERR
    //pour Kerr
    //condition ajouté par Khaled pour SCH
    if(mobile!=null)
    {
      titre = titre+" "+ compteur.toString() ;
      graphe_svg=mobile.graphesvg;
      graphe_point=mobile.pointsvg
      
    }
    //d3.selectAll("svg > *").remove();
    // Set the dimensions of the canvas / graph
    var margin = 
    {
      top: 30,
      right: 10,
      bottom: 50,
      left: 80
    };

    taille_carac = 14;
    wid_fen = window.innerWidth;
    hei_fen = window.innerHeight;

    // Valeurs de largeur et hauteur adaptées pour la version mobile / desktop

    if (wid_fen > 960 && wid_fen < 1200) 
    {
      width = wid_fen * 0.5;
      height = width * 2 / 3;
    }

    else if (wid_fen >= 1200 && wid_fen <= 1920) 
    {
      width = wid_fen * 0.2;
      height = width * 2 / 3;
    }
    else if (wid_fen > 1920) 
    {
      width = wid_fen * 0.15;
      height = width * 2 / 3;
    }
    else 
    {
      margin = 
      {
        top: 50,
        right: 0,
        bottom: 50,
        left: 70
      };

      width = wid_fen * 0.65;
      height = width * 2 / 3;
      taille_carac = 9;
    }
    
    width = 600 ;
    height = 500 ;
    
    data1.forEach(function(d) 
    {
      d.date = d.date;
      //le plus ici est pour convertir de string a int 
      d.close = +d.close;
    });

    data2.forEach(function(d) 
    {
      d.date = d.date;
      d.close = +d.close;
    });


    // Set the ranges
    x = d3.scale.linear().domain(d3.extent(data1, function(d) {return d.date;})).range([0, width]);

    var val;
    if(d3.max(data1, function(d) {return d.close;})>=0)
    {
        val=1.01;
    }
    else
    {
        val=0.99;
    }
    y = d3.scale.linear().domain([d3.min(data1, function(d) {return d.close;}), val*d3.max(data1, function(d) {return d.close;})]).range([height,0]); 
    // Define the line
    var valueline = d3.svg.line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.close);
      });

    // Adds the svg canvas

    var svg = d3.select(graphe_svg)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top * 2)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(5).tickFormat(d3.format(".1e"));

    var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5).tickFormat(d3.format(".1e"));


    // Scale the range of the data

    // Add the X Axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .style("font-size", ""+ taille_carac+"px")
    .selectAll("path, line")
    .style("stroke", "#000000") 
    .style("stroke-width", "1px"); // Applique l'épaisseur de trait aux lignes et au chemin de l'axe X


  // Ajouter l'axe Y
    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .style("font-size", ""+ taille_carac+"px")
    .selectAll("path, line")
    .style("stroke", "#000000") 
    .style("stroke-width", "1px"); // Applique l'épaisseur de trait aux lignes et au chemin de l'axe X

    
  // Ajouter un trait vertical dans le graphique
  svg.append("line")
      .attr("class", "vertical-line")
      .attr("x1", width)  // Coordonnée x du trait
      .attr("y1", 0)    // Coordonnée y de départ du trait
      .attr("x2", width)  // Coordonnée x de fin du trait (même que x1 pour un trait vertical)
      .attr("y2", height) // Coordonnée y de fin du trait
      .style("stroke", "#000000") // Couleur noire en hexadécimal
      .style("stroke-width", "1px");

  // Ajouter un trait horizontal dans le graphique
  svg.append("line")
      .attr("class", "horizontal-line")
      .attr("x1", 0)           // Coordonnée x de départ du trait (à gauche du graphique)
      .attr("y1", height*0.0001)      // Coordonnée y de départ du trait (au bas du graphique)
      .attr("x2", width)       // Coordonnée x de fin du trait (à droite du graphique)
      .attr("y2", height*0.0001)      // Coordonnée y de fin du trait (au même niveau que y1 pour un trait horizontal)
      .style("stroke", "#000000")    // Couleur noire en hexadécimal
      .style("stroke-width", "1px"); // Epaisseur du trait


  svg.selectAll("line.x")
      .data(x.ticks(5))
      .enter().append("line")
      .attr("class", "x")
      .attr("x1", x)
      .attr("x2", x)
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", "#ccc");
      

    svg.selectAll("line.y")
      .data(y.ticks(5))
      .enter().append("line")
      .attr("class", "y")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y)
      .attr("y2", y)
      .style("stroke", "#ccc");




  // Add the Y Axis
    svg.append("g")
      .attr("class", "y axis")
      .style("font-size", "" + taille_carac + "px")
      .call(yAxis); 

    svg.selectAll("dot")
      .data(data1)
      .enter().append("circle")
      .attr("r", 1.6)
      .attr("cx", function (d) { return x(d.date); })
      .attr("cy", function (d) { return y(d.close); })
      .attr("class", graphe_point);


    svg.append("text")
      .attr("class", "legend_titre")
      .attr("x", width / 2 -120)
      .attr("y", -margin.top / 2-5)
      .attr("dy", ".3em")
      .attr("transform", "rotate(0)")
      .style("font-size", "" + taille_carac * 1.5 + "px")
      .text(titre);

    svg.append("text")
      .attr("class", "legend_axe")
      .attr("x", width / 2 -30)
      .attr("y", height + margin.top / 0.75)
      .attr("dy", ".3em")
      .attr("transform", "rotate(0)")
      .style("font-size", "" + taille_carac + "px")
      .text("r (m)");

    svg.append("text")
      .attr("class", "legend_axe")
      .attr("x", -height / 2  )
      .attr("y", -margin.left*0.85- 5 )
      .attr("dy", ".3em")
      .attr("transform", "rotate(-90)")
      .style("font-size", "" + taille_carac + "px")
      .text(title);

    // Add the valueline path.
    svg.append("path")
      .attr("class", "line")
      .attr("d", valueline(data1))
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

    point = svg.append("g")
      .attr("class", graphe_point);

      
    point.selectAll('circle')
      .data(data2)
      .enter().append('circle')
      .attr("cx", x(data2[0].date))
      .attr("cy", y(data2[0].close))
      .attr("r", 4)
      .style("fill", "#FF001A")
      .attr('stroke', '#FF001A');

  }
  //condition ajouté par Khaled pour SCH
  if(mobile!=null)
    {
     mobile.point = [point,x,y];
     mobile.blups=1;
    }
    return [point,x,y];

}


function update_graphique_2(pointxy,data2,mobile) 
{
  if(pointxy[1](data2[0].date)>=0 && !isNaN(pointxy[1](data2[0].date)) && !isNaN(pointxy[2](data2[0].close))){
    $('.line-point').empty();    
    pointxy[0].selectAll('circle')
      .data(data2)
      .enter().append('circle')
      .attr("cx", pointxy[1](data2[0].date))
      .attr("cy", pointxy[2](data2[0].close))
      .attr("r", 4)
      .style("fill", "#FF001A")
      .attr('stroke', '#FF001A');
    } 
}



