function toggleFenetre(IDfenetre) {
    const panel = document.getElementById(IDfenetre);
    panel.classList.toggle('ferme');
}

toggleFenetre("rightPanel"); //ouvre automatiquement les volets de paramètres sans passer par le html pour laisser de la place au graphique
toggleFenetre("leftPanel");

function affichagemessage(idtexte){
    texte=document.getElementById(idtexte);
    texte.classList.toggle('visible');
}