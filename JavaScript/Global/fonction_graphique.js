function togglePanel(panel) {
    const leftPanel = document.querySelector('.Entree');
    const centerPanel = document.querySelector('.Graphe');
    const rightPanel = document.querySelector('.Sortie');

    /* regardez pas ça pique les yeux
    if (panel === 'left') {
        if (leftPanel.classList.contains('collapsed')){
            leftPanel.classList.remove('hidden');
            leftPanel.classList.remove('collapsed');
        }else{
            leftPanel.classList.add('collapsed');
            leftPanel.addEventListener('transitionend', () =>{
                leftPanel.classList.add('hidden');
            },{ once: true });
        };
        if (rightPanel.classList.contains('collapsed')){
            centerPanel.classList.toggle('expanded');
        }else{
            centerPanel.classList.toggle('mid_expanded');
        };

    }

    if (panel === 'right') {
        if (rightPanel.classList.contains('collapsed')){
            rightPanel.classList.remove('hidden');
            rightPanel.classList.remove('collapsed');
        }else{
            rightPanel.classList.add('collapsed');
            rightPanel.addEventListener('transitionend', () =>{
                rightPanel.classList.add('hidden');
            },{ once: true });
        };
        if (leftPanel.classList.contains('collapsed')){
            centerPanel.classList.toggle('expanded');
        }else{
            centerPanel.classList.toggle('mid_expanded');
        };
    }
    */

    if (panel === 'left'){
        leftPanel.classList.toggle('collapsed');
        if (rightPanel.classList.contains('collapsed')){
            centerPanel.classList.toggle('expanded');
        }else{
            centerPanel.classList.toggle('mid_expanded');
        };
    };

    if (panel === 'right'){
        rightPanel.classList.toggle('collapsed');
        if (leftPanel.classList.contains('collapsed')){
            centerPanel.classList.toggle('expanded');
        }else{
            centerPanel.classList.toggle('mid_expanded');
        };
    };
}
