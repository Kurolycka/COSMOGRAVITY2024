function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    panel.classList.toggle('collapsed');
}

function affichagemessage(idtexte){
    texte=document.getElementById(idtexte);
    texte.classList.toggle('visible');
}