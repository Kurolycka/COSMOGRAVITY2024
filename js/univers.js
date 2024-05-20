function affichagegraph(){
    var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    type: 'scatter'
    };
    
    
    var trace2 = {
    x: [1, 2, 3, 4],
    y: [16, 5, 11, 9],
    type: 'scatter'
    };
    
    var data = [trace1, trace2];
    
    Plotly.newPlot('graph_univers', data);
}

affichagegraph();
/*
graph = $("#grap_univers");
Plotly.purge(graph);
graph.empty();
wid = graph.width();
if (window.innerWidth > 1700) {
    hei = wid * 0.5;
} else {
    hei = wid * 2 / 3;
}
document.getElementById("graph_univers").style.height = 500 + "px";*/