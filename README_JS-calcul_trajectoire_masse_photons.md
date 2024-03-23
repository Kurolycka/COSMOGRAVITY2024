# README associé au fichier JS-calcul_trajectoire_masse_photons.js

Etant donné l'impossibilité de mettre des commentaires dans les fichiers de code JavaScript dû à un soucis d'optimisation du code nous avons décidé de créer des fichiers en markdown pour chaque fichier JavaScript. Le code sera ainsi bien plus aisé à comprendre pour nos successeurs. 

Si vous apportez des modifications au code associé à ce README veuillez modifier ce README pour les années suivantes. 

Ce README est associé au fichier JS-calcul_trajectoire_masse_photons.js lui même associé à la page "Masse baryonique et photon" de la partie Trajectoires.

Nous suivrons la syntaxe du code pour pouvoir l'expliquer. Etant donnés que la promotion qui a écrit de README (2024) n'est pas celle ayant créé la majorité de ces fonctions nous n'en garantissons pas ni la logique ni la fonctionnalité. Ce README est simplement une tentative d'explication de ce qui a été fait précédemment. 

## Pistes d'amélioration :
mettre c et G en variables globales
faire le calcul de rs au départ parce que là il le refait plusieurs fois dans plusieurs fonctions différentes
ils font le calul de rs dans des fonctions mais ne s'en servent pas ???
que sont tableauconstanteslers et tableauresultatsimu

## Variables globales

La première chose qui est faites dans ce code est de déclarer les variables globales. Voici à quoi nous avons compris qu'elles étaient associées :

**DIAMETRE_PART** = semble correspondre au diamètre des particules. 
**z** = 
**z_obs**
**title** 
**clicks**
**nzoom**
**facteurDeMalheur**
**fact_defaut**
**factGlobalAvecClef**
**compteurVitesseAvantLancement**

## Variables globales, key values

**rmaxjson**
**mobilefactor**
**r0o2**=
**maximum**
**cle**
**fuseecompteur**
**listejsonfusees**

## Liste de couleur en hexa

Fixe des couleurs dans des constantes à l'aide des couleurs hexadécimales. Les couleurs hexadécimales sont composées de 6 chiffres hexadécimaux qui représent les intensités des composantes rouge, verte et bleue de la couleur. Chaque paire de chiffres hexadécimaux représente une valeur de 0 à 255 pour chaque composante, allant de l'absence de couleur (0) à sa pleine intensité (255).
Ainsi pour le rouge pur on a le code hexadécimal #FF0000 et pour le vert pur on a #00FF00.

Dans le code sont ainsi codées 9 couleurs : **COULEUR_NOIR** (#2F2D2B), **COULEUR_BLEU** (#4080A4), **COULEUR_CYAN** (#008B8B), **COULEUR_BLANC** (#FFFFFF), **COULEUR_ROUGE** (#FF0000), **COULEUR_GRIS** (#CCCCCC), **COULEUR_MARRON** (#673B15), **COULEUR_ROUGE_COSMO** (#B54B3A) et **COULEUR_BLEU_MARINE** (#1A03FF).

## Couleurs rayons et particules

**COULEUR_PART** = couleur de la particule à laquelle on attribue la couleur **COULEUR_ROUGE_COSMO**.
**COULEUR_RS** = couleur du rayon de Schwarzchild à laquelle on attribue la couleur **COULEUR_BLEU**.
**COULEUR_RPHY** = couleur du rayon physique à laquelle on attribue la couleur **COULEUR_GRIS**. 

## Autres variables

**ifUneFois**
**ifUneFois2**
**ifUneFois3**

## Fonctions

### fonction testnum

**Paramètres** : a 

**Rôle** : Cette fonction chercher à déterminer l'exposant de la puissance de 10 nécessaire pour ramener un nombre (a) donné dans l'intervalle [1,10].

**Fonctionnement** : Je fais varier une variable i dans l'intervalle [-30,29[ et pour chaque valeur de i je divise a par 10 exposant i. Si le résultat est compris dans [1,10] alors je retourne la valeur de i correspondante.

### fonction testvaleur

**Paramètres** : x

**Rôle** : Cette fonction vérifie si le paramètre x est un nombre. Si c'est le cas, elle le renvoie, sinon elle retourne la chaîne de caractères 'Not a Number!'. 

**Informations** : isNaN est une fonction en JavaScript qui permet de déterminer si la valeur fournie n'est pas un nombre. Si elle retourne 'true' alors la valeur fournie n'est pas un nombre. isNaN(123) par exemple va retourner false alors que isNaN('hello') va retourner true.

### fonction generateurCouleur

**Paramètres** : N/A 

**Rôle** : Cette fonction génère et retourne de manière aléatoire une couleur RGB sous la forme d'un tableau contenant les valeurs des composantes rouge, verte et bleue.

**Informations** : Math.random() retourne un nombre aléatoire dans l'intervalle [0,1[ et Math.floor() arrondit un nombre à l'entier inférieur le plus proche. 

### fonction initialisationGenerale

ATTENTION UNE ERREUR DE LOGIQUE A ETE REPEREE ICI : calculer rs sert à rien

**Paramètres** : fuseecompteur

**Rôle**: Cette fonction sert à initialiser plusieurs valeurs à partir des informations récupérées sur la page html.
Elle ne retourne rien.

**Fonctionnement** : 
* On commence par fixer les constantes c (*vitesse de la lumière en m/s*) et G la constante gravitationnelle.
* Puis on récupère les valeurs de M (*Mass de l'astre en kg*) et de r_phy (*Rayon physique de l'astre en m*) que l'utilisateur a renseigné et on les convertis en nombres.
* On calcule ensuite le rayon de Schwarzschild rs en deux étapes. D'abord en calculant (G*M)/c² puis en multipliant ce résultat, stocké dans une variable m, par 2. 
* La dernière chose que cette fonction fait est d'itérer sur les valeurs d'une variable compteur de 1 à la valeur de fuseecompteur inclu. pour chaque valeur de compteur elle rempli la valeur de listejsonfusees d'indice correspondant avec ce que retourne la fonction **initialisation()** qui prend comme paramètre la valeur de compteur.

**Informations** : Math.pow() sert à calculer la puissance d'un nombre. Elle prend en arguments la base et l'exposant.

**Problème** : pourquoi calculer rs si ce n'est pas utiliser dans la fonction ? Et que renvoie cette fonction au final ? 
Qu'est fuseecompteur ?

### fonction lancerdeFusees

ATTENTION UNE ERREUR DE LOGIQUE A ETE REPEREE ICI : calculer rs sert à rien 

**Paramètres** : fuseecompteur

**Rôle** : Cette fonction utilise les données récupérées depuis des éléments HTML et des constantes prédéfinies pour lancer des fusées en appelant la fonction **trajectoire()** pour chaque fusée. 

**Fonctionnement :**
* Je commence par fixer des constantes telles que c (*vitesse de la lumière en m/s*) et G (*constante gravitationnelle en SI*).
* Puis on récupère les valeurs de M (*Mass de l'astre en kg*) et de r_phy (*Rayon physique de l'astre en m*) que l'utilisateur a renseigné et on les convertis en nombres.
* On calcule ensuite le rayon de Schwarzschild rs en deux étapes. D'abord en calculant (G*M)/c² puis en multipliant ce résultat, stocké dans une variable m, par 2. 
* Pour une variable compteur itérée de 1 à fuseecompteur inclu on calcule la foncton **trajectoire** prenant comme paramètre la valeur de compteur et la valeur de listejsonfusee[compteur] calculée dans la fonction initialisationGenerale. 

### fonction supprHtml

ATTENTION UNE ERREUR DE LOGIQUE A ETE REPEREE ICI : initialisée nbrfuseesuppr et ENSUITE vérifier que ce que on a stocké dedans existe encore

**Paramètres** : N/A

**Rôle** : Supprimer des éléments HTML de la page web. 

**Fonctionnement** : 
* Je commence par mettre dans la variable nbrfuseesuppr la valeur de nombredefusees récupérée à partir de sessionStorage, où sont stockées les données de la session en cours.
* Je supprime ensuite le contenu des éléments HTML avec les identifiants *tableauconstanteslers* et *tableauresultatsimu*.
* Je vérifie si la variable nombredefusees existe dans sessionStorage et si c'est le cas je stocke cette valeur dans nbrfuseesuppr
* Je récupère un élément HTML avec l'identifiant "myCanvas" en me servant de la méthode **document.getElementByID()** qui récupère un élément HTML à partir de son identifiant unique (ID) dans le document HTML. Et je stocke cet élément dans la variable elementcanvasasuppr.
* Je supprime elementcanvasasuppr de la page.
* Je récupère la valeur d'un élément de formulaire HTML avec l'ID "canvaswidthheight" et stocke cette valeur dans la variable "canvaswh".
* Ensuite j'itère la variable countt de 1 à la valeur de nbrfuseesuppr incluse et pour chaque valeur de count je supprime plusieurs éléments de la page HTML : le rayon de toutes les fusées, les vitesser et les vitessep ainsi que myCanvasBoule de toutes les fusées et les graphes d'ID "grsvg_{countt}". 
* Une fois l'itération finie je supprime de la page HTML l'élement d'ID "myCanvas3three".

### fonction htmlDecode

**Paramètres** : input (chaîne de texte)

**Rôle** : Cette fonction prend en entrée une chaîne de texte qui est supposée être du texte encodé en HTML et retourne la version décodée de ce texte. 

**Fonctionnement** :
* Je mets dans la variable doc un objet DOM qui représente le contenu HTML de input.
* Je retourne tout le texte de la structure HTML de doc en ignorant les éléments de code HTML. 

### fonction genereHtml

**Paramètres** : N/A

**Rôle** : Cette fonction génère du contenu HTML en fonction de ce qui a été saisi par l'utilisateur dans un champ de formulaire avec l'identifiant "nombredefusees".
Cela va aider à générer les tableaux qui apparaissent sur la page web. Celui avant le début de la simulation et celui également après la simulation. La taille des tableaux sera adaptée en fonction du nombre de mobiles.

**Fonctionnement simplifié** : 
* Je récupère la valeur de "nombredefusees" à partir du formulaire.
* Je génère plusieurs éléments HTML comme des étiquettes (labels) et des champs de saisie (inputs) en fonction du nombre de fusées qui a été spécifié.
* J'attribue des ID uniques à chaque élément généré en utilisant une boucle for.
* J'insère les éléments générés dans un conteneur avec l'identifiant "champs_a_remplir" dans le document HTML.
* Je créé une ligne de tableau avec des en-têtes contenant des étiquettes numérotées et les insère dans un tableau avec l'identifiant "**tableauconstanteslers**".
* Dans ce tableau il y aura les constantes d'intégration E et L pour chaque mobile (voir la partie théorique), le rayon de Schwarzschild, la gravité, la vitesse de libération, la température d'un trou noir et le temps d'évaporation d'un trou noir.
* Dans cette fonction on crée aussi un nouveau tableau cette fois sous l'identifiant "**tableauresultatsimu**" où seront rangés les résultats de la simulation pour chaque mobile. Pour chaque mobile on aura des résultats spécifiques comme la position le temps écoilé etc. La taille de ce tableau (le nombre de canvas) sera adapté en fonction du nombre de fusées.

**Informations** : Les fonctions **texteTrajectoirePhoton(nbredefuseesgenere)**, **notationvitesseree1()**, **textegravetetc()**, **infobilleobservateurdistant()** sont utilisées. Ainsi que d'autres fonctions servant au bon affichage du katex qui permet d'avoir de belles formules LateX sur le site.

## fonction initialisation

ATTENTION UNE ERREUR DE LOGIQUE A ETE REPEREE ICI : pourquoi une condition sur theta=90 ou 180° ?? Et pourquoi faire les calculs avant d'avoir vérifié les conditions ??? phi0 convertit en degrés puis en radians à nouveau ???

**Paramètres :** compteur

**Rôle** : Cette fonction effectue plusieurs calculs et actions pour initialiser les données d'un mobile/fusée spécifique dans la simulation.

**Fonctionnement détaillé :**
1. Je fixe mes variables de la vitesse de la lumière en m/s (*c*) et de la constante gravitationnelle G en SI.
2. Je récupère la masse de l'astre en kg rentrée par l'utilisateur dans la variable M et le rayon physique de l'astre en m rentré par l'utilisateur dans la variable r_phy.
3. Je calcule la valeur du rayon de Schwarzschild et je le stocke dans la variable rs.
4. Je récupère la valeur de la distance initiale du projectile au centre de l'astre (en m) pour le mobile donné par le paramètre compteur et je stocke cette valeur dans la variable r0.
5. Je récupère la valeur de l'angle de départ φ du mobile considéré par le paramètre compteur et je stocke cette valeur dans la variable phi0. 
6. Je récupère la valeur de l'angle de départ de la vitesse θ du mobile considéré par le paramètre compteur et je stocke cette valeur dans la variable teta.
7. Je stocke dans la variable teta1 la valeur de teta.
8. Je convertis phi0 et teta en radians.
9. Je calcule la valeur de la vitesse tangentielle vφ pour ce mobile et je stocke cette valeur dans la variable vphi.
10. Je calcule la valeur de la vitesse radiale vr pour ce mobile et je stocke cette valeur dans la variable vr.
11. Je déclare que si mon angle θ fait 180° alors vφ sera nule et si il fait 90° alors vr sera nulle.
12. Je calcule les constantes d'intégrations L et E que je stocke respectivement dans les variable L et E. 
13. Je mets à jour les contenus des éléments HTML avec les identifiants "L", "E" et "rs" avec les valeurs que je viens de calculée dans cette fonction avec une notation exponentielle à 3 chiffres significatifs.
14. Je récupère la valeur de l'élément HTML avec l'ID "scalefactor" et je la convertit en nombre plus la stocke dans la variable "scale_factor".
15. Je créé un nouvel objet JavaScript appelé "mobile" et je lui attribu plusieurs propriétés : les valeurs r0, vphi, vr, L, E et phi0 que je viens de calculer ou récupérer.
16. J'ajoute à l'objet "mobile" une nouvelle propriété "pointsvg" consitutée de la chaîne de caracètre "pointg" suivie du paramètre compteur (le numéro de mobile) considéré.
17. J'ajoute à l'objet "mobile" une nouvelle propriété "graphesvg" constitué de la chaine de caratère "#grsvg_" suivie du paramètre compteur (le numéro de mobile) considéré.
18. J'ajoute à l'objet "mobile" une nouvelle propriété "onestarrete" avec comme valeur initiale 0. Probablement pour savoir si le mobile est arrêté ou non.
19. J'ajoute à l'objet "mobile" une nouvelle propriété "peuxonrelancer" avec comme valeur initiale true. Probablement pour savoir si on peut continuer la trajectoire après un arrête ou non.
20. J'effectue le calcul de rmax avec la fonction **calcul_rmax(L,E,vr,r0,1)** et je rajoute cette valeur de rmax comme propriété à l'objet mobile sous le nom "rmax".
21. J'ajoute à l'objet "mobile" une nouvelle propriété "blups" avec comme valeur initiale 0.
22. Je stocke la valeur de rmax dans un tableau "rmaxjason" à l'index spécifié par le paramètre compteur.
23. Je stocke la valeur de "scale_factor" dans un tableau "mobilefactor" à l'index spécifé par le paramètre compteur. 
24. Je stocke la valeur de r0 dans un tableau "r0o2" à l'index spécifié par le paramètre compteur.
25. J'initiale la propriété "pause" de l'objet "mobile" avec la valeur true.
26. J'initialise la propriété "début" de l'objet "mobile" avec la valeur true.
27. J'ajoute à l'objet "mobile" des paramètres pour y associer une couleur générée de manière aléatoire grâce à la fonction generateCouleur().
28. Je calcule la valeur de la gravité g et si la valeur du rayon physique r_phy de l'astre est nulle je mets à jour le contenu HTML de l'élément avec l'ID "g" avec une chaîne vide. Par contre si r_phy est différent de 0 alors je mets à jour l'élément "g" avec la valeur de g que je viens de calculer.
29. Si le rayon de Schwarzschild rs est plus grand que le rayon physique de l'astre rs alors je calcule la température du trou noir et je mets à jour le contenu HTML de l'élément avec l'ID "TempTN" avec cette valeur calculée stockée dans la variable Temp_trouNoir. Et je calcule également de manière simplifié le temps d'évaporation de Hawking que je stocke dans la variable tempsEvaporation_trouNoir et je mets à jour le contenu HTML de l'élément avec l'ID "tempsEvapTN" avec la valeur de tempsEvaporation_touNoir. Mais si la condition du rayon de Schwarzschild n'est pas vérifiée alors je mets à jours les deux éléments cités précédemment avec une chaîne vide car cela signifie qu'il n'y a pas de trou noir.
31. Je calcule la vitesse de libération à la surface de l'astre et je stocke ce calcul dans la variable vlib. Si le rayon physique de l'astre r_phy est plus grand ou égal au rayon de Schwarzschild (si on a pas un trou noir) alors je mets à jour le contenu HTML de l'élément avec l'ID "Vlib" avec la valeur de la variable vlib et dans le cas contraire je le mets à jour avec une chaîne de caractère vide.
32. Si le paramètre compteur est égal à 1 alors je stocke dans une variable "vphiblab" la valeur de la vitesse de la lumière c et dans "vrblab" la valeur de phi0 en degrés. 
33. Si le paramètre compteur est égal à 2 alors je stocke dans une variable "phi2i" la valeur de la vitesse de la lumière c et dans une variable "vr2i" la valeur de phi0 en degrés. 
34. J'appelle les fonctions **boutonAvantLancement()** et **canvasAvantLancement()**.


**Informations** : Cette fonction utilise les autres fonctions **calcul_rmax()**, **generateCouleur()**, **boutonAvantLancement()** et **canvasAvantLancement()**. 

## fonction verifnbr

**Paramètres** : N/A

**Rôle** : Cette fonction alerte l'utilisateur si des champs obligatoires ne sont pas remplis ou bien si ils contiennent des valeurs incorrectes. 

**Fonctionnement simplifié** :
* Je récupère les valeurs de la masse de l'astre en kg (stockée dans M) , du rayon physique de l'astre (stockée dans r_phy) et du nombre de mobiles (stockée dans sddsdsdds) renseignés par l'utilisateur. 
* Pour chacun des mobiles je récupère la valeur de la distance initiale du projectile au centre de l'astre en m (stockée dans r0verifnbf), la valeur de la vitesse tangentielle vphi (stockée dans vphiverifnbr) et la valeur de la vitesse radiale vr (stockée dans vrverifnbr).
* Je vérifie si r0verifnbr, vphiverifnbr et vrverifnbr pour tous les mobiles sont des nombres et si ce n'est pas le cas j'affiche des messages d'erreur en conséquence.
* Je vérifie que r_phy et M soient des nombres et si ce n'est pas le cas j'affiche des messages d'erreur en conséquence.

## fonction pressionBouttonObservateur

**Paramètres** : N/A

**Rôle** : Changer les classes CSS des boutons avec les identifiants "r3" et "r4" si on appuie sur le bouton "r3". 

**Fonctionnement** :
* Je regarde si la classe du bouton avec l'identifiant "r3" est égale à "myButton2" et si c'est le cas alors cela veut dire que le bouton est activé. Dans ce cas je change la classe du bouton "r3" en "myButton" et celle du bouton "r4" en "myButton2". 

## fonction pressionBouttonMobile

**Paramètres** : N/A

**Rôle** : Changer les classes CSS des boutons avec les identifiants "r3" et "r4" si on appuie sur le boutton "r4". 

**Fonctionnement** :
* Je regarde si la classe du bouton avec l'identifiant "r4" est égale à "myButton2" et si c'est le cas alors cela veut dire que le bouton est activé. Dans ce cas je change la classe du bouton "r4" en "myButton" et celle du bouton "r3" en "myButton2". 

## fonction trajectoire 

ATTENTION : FONCTION TRES LONGUE DE PLUS DE 300 LIGNES DONC TRES GRANDE EXPLICATION DE FONCTIONNEMENT
VARIABLE NOMMEE BLYO POUR LE NOMBRE DE MOBILE puis nbredefusees dans laquelle y a exactement la même chose

**Paramètres** : compteur, mobile

**Fonctionnement détaillé**:
1. Je stocke dans la variable "texte" ce que me retourne la fonction **o_recupereJson()**.
2. Je vérifie si la trajectoire est en pause ou bien si elle vient de démarrer et si une de ces conditions est vérifiée alors j'effectue différentes action : 
->  La couleur du champ de saisie de r0 est modifiée en fonction des composantes de couleurs définies dans l'objet mobile (de la couleur qui est associée à ce mobile) et la couleur du texte est ajustée en noir ou blanc en fonction de la luminosité du champ de saisie.
-> L'élément avec l'ID "tg2" est modifié pour afficher le style de table. (Affichage d'un élément HTML sous forme de tableau.) Et le contenu de l'élement avec l'ID "indic_caluls" est remplacé par le texte récupéré à partir de **texte.pages_trajectoire.calculs_encours**, ce qui semble être un indicateur visuel pour l'utilisateur indiquant que des calculs sont en cours.
-> La fonction **estUnMobile()** est appellée.
-> Certains éléments de saisie dans le document HTML sont désactivés pour éviter que l'utilisateur ne modifie les valeurs pendant la simulation. Les éléments affectés sont la masse de l'astre (M), le rayon physique de l'astre (r_phy) et le nombre de mobiles (nombredefusees). 
-> Je récupère le nombre de mobiles que l'utilisateur a rentré et je stocke cette valeur convertie en nombre dans la variable blyo. 
-> Je boucle et pour tous les mobiles je désactive les champs de saisie associés à r0, phi0 et teta pour ne pas que l'utilisateur ne modifie les valeurs pendant la simulation.
-> Je désactive les boutons qui permettent  de passer d'observateur à photon et vice-versa. Ainsi l'utilisateur ne peut pas les changer en pleine simulation.
-> Je définis la valeur de l'élément avec l'ID "trace_present" à "1" pour contrôler si il y a un tracé pendant la simulation ou non pour l'enregistrement.
-> Je définis les propriétés "pause" et "début" de l'objet "mobile" à false. Cela indique ainsi que la simulation n'est ni en pause ni au début.
-> J'initialise les valeurs des angles "phi" et "phi_obs" dans l'objet "mobile" avec la valeur phi0 de l'objet mobile.
-> Je calcule le temps de chute libre ("temps_chute_libre") de la particule.
-> J'ajoute la propriété "temps_chute_libre" à l'objet "mobile" et je l'initialise avec la valeur de ma variable temps_chute_libre que je viens de calculer.
-> Je stocke dans la variable "A_init" la valeur de vr du mobile et dans la variable "r_init" la valeur de r0 du mobile.
-> Je stocke dans la variable "nbredefusees" la même chose que dans la variable "blyo".
-> Si le nombre de mobile est égale à 1 et que "ifUneFois2" (initialisée à true au début du programme) est égale à true alors on stocke dans la variable maximum la valeur de rmax associée à l'indice 1 de la liste r0o2. Et puis on stocke dans la variable "cle" la valeur 1 et dans la variable ifUneFois2 la valeur false.
-> Si le nombre de mobile est plus grand ou égal à 2 et que "ifUneFois" (initialisée à true au début du programme) est égale à true (première fois que cette condition est rencontrée) alors on fait plusieurs choses. Tout d'abord on cherche le mobile ayant le rayon le plus élevé (rmax) parmi tous les mobiles et on stocke la valeur de rmax de ce mobile dans la variable "maximum" et le numéro de ce mobile dans la variable "cle". Ensuite je parcours à nouveau toutes les fusées et j'ajuste les facteurs de mise à l'échelle ("mobilefactor") pour qu'ils soient proportionnels au rayon du mobile le plus grand. Pour finir je mets la variable "ifUneFois" à false.
-> On stocke dans la variable "A_part" la valeur de "A_init" et dans la variable "r_part" la valeur de "r_init".
-> J'ajoute à l'objet "mobile" les propriétés "A_part" et "r_part" que j'initialise avec les variables aux noms correspondant.
-> Je calcule la vitesse radiale vr du mobile observée que je stocke dans la variable "A_init_obs", je stocke ensuite également cette valeur dans la variable "A_part_obs" et j'ajoute à l'objet "mobile" une propriété "A_part_obs" que j'initialise avec A_part_obs.
-> Je stocke dans la variable "vrobs" la valeur de la variable "A_init_obs".
-> Je calcule la valeur de la vitesse tangentielle observée que je stocke dans la variable "vphiobs".
-> Je stocke dans les variable "r_init_obs" et "r_part_obs" la valeur de la distance initiale du mobile au centre de l'astre r0 du mobile.Et puis j'ajoute à l'objet "mobile" la propriété "r_part_obs" que j'initialise avec r_part_obs.
-> J'initialise le temps de la particule (temps_particule) et le temps de l'observateur (temps_observateur) à 0 et j'ajoute à l'objet "mobile" les propriétés "temps_particule" et "temps_observateur" que j'initialise avec mes nouvelles variables.
-> J'appelle la fonction clavierEvenement().
-> Je récupère dans la variable "element2" l'élément HTML avec l'ID "traject_type2".
-> Je calcule la valeur de dτ que je stocke dans la variable "dtau" et puis j'ajoute à l'objet "mobile" la propriété "dtau" que j'initialise avec ma nouvelle variable.
-> Je calcule la position initiale de la particule (x1part et y1part) en ajustant la taille de la trajectoire sur le canva et en normalisant la position par rapport à la taille maximale de la trajectoire.
-> Je calcule la position initiale de l'observateur dans le référentiel propre (x1obs et y1obs) en ajustant la taille de la trajectoire sur le canva et en normalisant la position par rapport à la taille maximale de la trajectoire.
-> Je récupère l'élément HTML avec l'ID "myCanvas" et je le stocke dans la variable canvas. Puis je vérifie si canvas est défini et si ce n'est pas le cas j'affiche un message d'erreur contenue dans **texte.pages_trajectoire.impossible_canvas**.
-> Je récupère le contexte de rendu 2D du canvas et je le stocke dans la variable context. Si context n'est pas défini alors j'affiche un message d'erreur contenue dans **texte.pages_trajectoire.impossible_context**. 
-> J'ajoute à l'objet "mobile" la propriété "canvas22" qui est initialisée avec un élément canvas avec l'ID "myCanvasBoule"+{numéro du Mobile}. 
-> J'ajoute à l'objet "mobile" la propriété "context22" qui est initialisée avec le contexte de rendu 2D.
-> J'appelle la fonction **majFondFixe()** et la fonction **majFondFixe44()** avec le paramètre mobile. 
-> Je stocke dans la variable diametre_particule la valeur DIAMETRE_PART qui a été initialisée au début du programme. 
-> Je modifie le style de l'élément HTML ayant l'ID "bloc_resultats" pour afficher ce bloc en tant que block. Donc l'élélement HTML avec cet ID sera rendu visible sur la page web.
-> Je défini une fonction appellée **CentrerPopPotentiel()** qui ne prend pas de paramètres et qui affiche d'abord un élément HTML avec l'ID "bloc_resultats" en le rendant visible sur la page ensuite elle parcourt une série d'élements HTML ayant des IDs de la forme "grsvg_{numéro du mobile}" et pour chaque élément trouvé elle le supprime du DOM s'il existe et a un parent. Enfin, si la case à cocher ayant l'ID "toggle" est décochée alors la fonction **CentrerPopPotentiel()** est appellée. Cette fonction permet donc de nettoyer et de réinitialiser certaines parties de la page lorsque l'utilisateur décoche une cas à cocher.
-> Je calcule la position de la particule sur le canvas avec les variables x1part et y1 part puis je stocke ces positions dans une propriété "positionspatio" de l'objet "mobile".
-> Je calcule la position de l'observateur sur le canvas avec les variable x1obs et y1obs puis je stocke ces positions dans une propriété "position" de l'objet "mobile". 
-> Je calcule la position centrale du canvas (la moitié de sa largeur et la moitié de sa hauteur) et je la stocke dans les variable "posX3" et "posY3".
-> J'anime la simulation en appelant la fonction **animate()** à intervalles réguliers en en lui fournissant les arguments "compteur", "mobile" et "mobilefactor". 
-> Je stocke dans les propriétés "Dtau1" et "Dtau2" du mobile les valeurs de Dtau à la puissante 8 (*1e8) (Dtau1) et de Dtau à la puissance -8 (/1e8) (Dtau2).
-> J'associe un événement de clic à un bouton ayant l'ID "bouton_pause". Lorsque ce bouton est cliqué, la fonction **pausee()** est appellée prenant comme arguments "compteur", "mobile" et "mobilefactor".
-> Je supprime un écouteur d'événements associé au bouton d'ID "plusvite" et un autre écouteur d'événement associé au bouton d'ID "moinsvite". 
-> J'ajoute un nouvel écouteur d'évenement au bouton "plusvite" qui lorsqu'il est cliqué va faire que la vitesse de la simulation est augmentée à l'aide de la fonction **bouttons.vitesse(mobile,true)** et la variable "compteurVitesseAvantLancement" est également mise à jour pour refléter la nouvelle vitesse de la simulation.
-> J'ajoute un nouvel écouteur d'événement au bouton "moinsvite" qui lorsqu'il est cliqué va faire que la vitesse de la simulation va baisser à l'aide de la fonction **bouttons.vitesse(mobile, false)** et la variable "compteurVitesseAvantLancement" est également mis à jour pour refléter la nouvelle vitesse de la simulation. 
-> J'ajuste la vitesse de simulation en fonction du nombre de clics sur les boutons "plusvite" ou "moinsvite".
-> Lorsque l'on clique sur le bouton d'ID "enregistrer2" alors une action est déclenchée. On récupère l'élément d'ID "traject_type2" et si cette valeur n'est pas "mobile" alors ça veut dire que l'observateur est sélectionné et dans de cas on dessine un cercle bleu sur le canvas à la position actuelle de l'observateur. Si la valeur est "mobile" alors cela veut dire que la particule est sélectionnée et dans de cas on dessine un cercle bleu sur le canvas à la position actuelle de la particule.
-> Les écouteurs d'événements associés aux boutons d'ID "moinszoom" et "pluszoom" sont supprimés pour éviter les doublons, au cas où ils auraient déjà été ajoutés précédemment.
-> Un nouvel écouteur d'événement est ajouté au bouton "moinzoom". Lorsque ce bouton est cliqué la fonction **bouttons.zoom(false, mobile, canvas, mobilefactor, compteur)** est appelée pour réduire le zoom. Puis les facteurs de zoom et les valeurs associées sont mis à jour et la fonction **majFondFixe44(mobile)** est appelée pour mettre à jour le fond fixe. Pour finir la fonction **rafraichir2(context, mobilefactor, rmaxjson, maximum, compteur)** est appelée pour rafraîchir le canvas et le texte affichant le niveau de zoom est mis à jour.
-> Un écouteur d'évenement similaire est ajouté au bouton "pluszoom" mais cette fois pour augmenter le zoom.
-> Un dernier écouteur d'événement est ajouter au bouton d'ID "initialiser" qui réinitialise les paramètres de la simulation lorsque le bouton est cliqué. Cela inclut la réinitialisation des facteurs de zoom, l'appel de la fonction **majFondFixe44(mobile)** pour mettre à jour le fond fixe, le rafraichissement du canvas et la réinitialisation du texte affichant le niveau de zoom.
-> J'ajoute un écouteur d'événement au bouton d'ID "clear". Lorsque ce bouton est cliqué, la page est rechargée ce qui a pour effet d'effacer le contenu du canvas en entier puisque tout le script sera relancé.
-> La fonction **creation_blocs(context, mobilefactor, rmaxjson, maximum, compteur)** est appelée et semble être responsable du tracé du rayon de Schwarzchild.
-> On stocke dans une variable "element2" l'élément dont l'ID est "traject_type2".
-> Je créé un intervalle d'exécution qui exécute la fonction anonyme toutes les 300 milisecondes, ceci va être utilisé pour des mises à jour en temps réel ou des animations. Ce bloc de code va être responsable de la mise à jour périodique du graphe du potentiel en fonction du type de trajectoire sélectionné (observateur ou spationaute).
-> Voici ce que fais cette fonction anonyme : Elle commence par vider l'élément SVG identifié par "grsvg_" suivi du numéro de compteur. Cela permet de nettoyer le contenu SVG avant de dessiner de nouveaux éléments.Ensuite elle initialise deux tableaux de données vide "data1" et "data2". Puis elle vérifie si la valeur de l'élément "element2" n'est pas mobile et si c'est le cas elle calcule le pas de variation "dr" pour le tracé du graphe en fonction du rayon de la particule observée, calcule les valeur du potentiel gravitationnel pour différents pourcentages de rayon du rayon de la particule observée et les stocke dans "data1", calcule la valeur du potentiel gravitationnel au rayon de la particule observée et la stocke dans "data2", puis appelle la fonction **graphique_creation_pot(0, data1, data2, compteur, mobile)** pour créer le graphe du potentiel avec les données calculée et le stocke dans mobile.point. Si la valeur de "element2" est "mobile" alors le processus est similaire mais les calculs sont basés sur le rayon de la particule plutôt que sur celui de la particule observée.
3. Si la trajectoire n'est pas en pause ou vient de démarrer alors on créé un intervalle qui exécute la fonction **animate.bind(null, compteur, mobile, mobilefactor)** périodiquement et on stocke cet intervalle dans mobile.myInterval. 10/6 est l'intervalle de temps en miliseconde entre chaque appel de la fonction **animate()**.
4. Un événement est ajouté au bouton d'ID "pause/resume" de sorte que lorsque ce bouton est cliqué la fonction **pausee(compteur, mobile, mobilefactor)** est appellée.
5. Le bouton d'ID "start" est masqué une fois que l'animation est lancée.
6. Le bouton d'ID "pause/resume" est affiché une fois que l'animation est lancée.
7. Une info-bulle est ajoutée au bouton d'ID "clear" avec le texte spécifié dans **texte.pages_trajectoire.bouton_stop_bulleInfo**.


**Informations** : Cette fonction utilise les autres fonctions **o_recupereJson()**, **texte.pages_trajectoire.calculs_encours**, **estUnMobile()**, **clavierEvenement()**, **texte.pages_trajectoire.impossible_canvas**, **texte.pages_trajectoire.impossible_context**, **majFondFixe()**, **majFondFixe44()**, **animate()**, **pausee()**, **vitesse()** et **zoom()** liées au fichier **bouttons.js**, **rafraichir2()**, **creation_blocs()**, **graphique_creation_pot()**, **pausee()**, **texte.pages_trajectoire.bouton_stop_bulleInfo**.
Le **DOM** est une représentation hiérarchique sous forme d'arbdre de tous les éléments d'une page web où chaque élément est un noeud dans cet arbre.

## fonction animate 

ATTENTION PROBLEME DE LOGIQUE : pourquoi une fonction testvaleur(x) est redéfinie dans cette fonction alors qu'elle l'a déjà été faites en dehors ? Il y a un += 0 ???? J'ai un /0 à la ligne 1056 ??????

**Paramètres** : compteur, mobile, mobilefactor

**Rôle** : Cette fonction gère l'animation de la trajectoire d'une particule autour d'un trou noir, à la fois dans le référentiel propre de la particule et dans celui de l'observateur.

**Fonctionnement détaillé** :
1. J'initialise la variable "onestarrete" de l'objet "mobil" à 0 pour indiquer que la particule n'est pas arrêtée.
2. Je met à jour le facteur de zoom de la trajectoire de la particule dans le tableau "mobilefactor" à l'indice "compteur" avec la valeur de la variable "factGlobalAvecClef".
3. J'appelle la fonction **estUnMobile()**.
4. Je récupère l'élément HTML avec l'ID "traject_type" que je stocke dans la variable "element"
5. J'appelle la fonction **choixTrajectoire(compteur, context, mobile, mobilefactor, rmaxjson, maximum)** pour probablement choisir le type de trajectoire à afficher en fonction de certains paramètres passés en arguments.
6. Je récupère la valeur de l'élément HTML avce l'ID "boutton_ammorti" que je stocke dans la variable "isrebond".
7. Je vérifie si r0 (la distance initiale du mobile au centre de l'astre) est différente de 0.0 ou non et si c'est le cas :
-> Si la valeur de "element2" est "mobile" alors la fonction **rungekutta(mobile.L, mobile.dtau, mobile.r_part, mobile.A_part)**  qui semble utiliser la méthode de Runge-Kutta est appelée pour calculer les nouvelles positions et vitesses de la particule mobile puis stocke les résultats dans les propriétés "rpart" et "A_part" de l'objet "mobile". Je stocke ensuite dans la variable resultat ce que retourne la fonction **calculs.MSC_Ex_vitess(mobile.e, mobile.L, mobile.r_part, rs, true)**. Ensuite je stocke dans la variable "vtotal" le résultat resultat[0] (probablement la vitesse totale de la particule), dans "vp_2" le resultat[2] (probablement la vitesse tangentielle de la particule) et dans "vr_2" le resultat[1]xMath.sign(mobile.A_part) (probablement la vitesse radiale de la particule).
-> Sinon j'effectue des calculs assez similaires pour le cas où l'"element2" n'est pas "mobile". Les noms de variables changeront par contre avec un "_obs" qui apparaît à la fin et on utilisera non pas **rungekutta()** mais **rungekutta_obs()**.
-> Je vérifie si la valeur de l'élément "element2" n'est pas "mobile" et en fonction :
---------> Soit  Si "element2" n'est pas "mobile" et que le "r_part_obs" est supérieur ou égal à "rs" alors on trace la trajectoire de la particule. On dessine un petit rectangle représentatnt la particule sur le canvas et les coordonnées de la particule sont données par "mobile.position.posX2" et "mobile.position.posY2". Ensuite le code met à jour le contexte mobile["context22"] pour dessiner un cercle autour de la particule, pour la distinguer sur le deuxième canva.
---------> Ou bien si "element2" est "mobile" on est dans le référentiel de la particule et le même processus est réalisé mais cette fois les coordonnées de la particule sont "mobile.positionspation.posX1" et "mobile.positionspatio.posY1"
-> Si on a "element2" qui n'est pas "mobile" et donc qu'on est dans le référentiel de l'observateur et que "r_part_obs" est plus petit ou égal à "r_phy"  alors si l'option de rebond est activé (isrebond=1) et que le "r_phy" > 0  alors on inverse le signe de "mobile.A_part_obs" .Si par contre le rebond est désactivé (isrebond=0), que r_phy est différent de 0 et que "mobile.r_part_obs" est plus petit ou égale à "r_phy" alors on met la variable "mobile.onestarrete" à 1, on appelle la fonction arret(mobile) et on met la variable "mobile.peuxonrelancer" à false.
-> Si par contre on a "element2" qui est "mobile" et que donc on est dans le référentiel de la particule et que "mobile.r_part" est plus petit ou égal à "r_phy" ou bien que mobile.r_part==0 alors on a deux cas de figure. Soit l'option de rebond est activé et r_phy >  et dans ce cas on inverse le signe de mobile.A_part. Ou bien l'option rebond est désactivée et r_phy n'est pas nulle et mobile.r_part <= r_phy et dans ce cas on fait les mêmes choses que dans le deuxième cas du point 9.
->  Ensuite on met à jour les positions de la particule dans son référentiel et dans le référentiel de l'observateur sur le canva en fonction de leur position radiale et angulaire.
->  Si le choix de la trajectoire (element2.value) n'est pas"mobile" alors on utilise la fonction **Vr_obs(mobile.E,mobile.L,mobile.r_part_obs)** pour calculer le potentiel gravitationnel et le résultat est stocké dans la variable V. Ensuite, une nouvelle liste de données ("data2") est créée, contenant une seule entrée avec dans "date" la variable "mobile.r_part_obs" et dans "close" la variable "V". Et puis si la variable "mobile.point" est définie alors on appelle la fonction **update_graphique_2(mobile.point,data2,mobile)**.
->  Si "element2" est égal à "mobile" alors on utilise la fonction **Vr_mob(mobile.L,mobile.r_part)** pour calculer le potentiel gravitationnel qui est stocké dans "V" et de la même manière on créé une liste de donnée "data2" sauf que cette fois dans "date" on met la variable "mobile.r_part". Et puis on on procède de la même manière que dans 12.
->  Je vérifie si mobile.rpart est négatif ou pas et si c'est le cas je le remets à 0. Ceci est fait pour ne pas avoir de mauvaises surprises sur le dernier calcul avant la fin.
->  Je défini ensuite une fonction **testvaleur(x)** qui vérifie si le paramètre x qui lui est donné est un nombre ou non et si c'est un nombre alors la fonction le retourne et si ce n'est pas le cas elle affiche un message d'erreur.
->  Je vérifie si "element2" est égal à "mobile" (référentiel de l'observateur) ou pas (référentiel du photon). Et puis je vérifie quelques conditions supplémentaires comme par exemple si "mobile.r_part_obs" >= rs * 1.000001 ou si "mobile.r_part">0 et en fonction des conditions qui sont remplie ou non je mets à jours les valeurs HTML des éléments d'ID "to{compteur}", "r_par{compteur}", "tp{compteur}", "vp_sc_mas{compteur}", "vr_sc_mas{compteur}", "v_tot{compteur}", "ga{compteur}".
-> Si on est dans le référentiel de la particule et que "mobile.r_part" > rs*1.00001 alors on rajouter à la valeur "mobile.temps_observateur" la valeur de "mobile.dtau". Et si on ne vérifie pas la condition "mobile.r_part" > rs*1.00001 alors "mobile.temps_observateur" prend la valeur 1/0. **GROS PROBLEME A CET ENDROIT**.Je mets ensuite à jour la valeur de l'élément HTML qui a pour ID "to{compteur}" peu importe si la condition est vérifiée ou non.

**Informations** : Cette fonction utilise les autres fonctions **estUnMobile()**, **choixTrajectoire()**, **rungekutta()**, **MSC_Ex_vitesse()** liée au fichier **calculs**, **rungekutta_obs()**, **arret()**, **Vr_obs()**, **update_graphique_2()**

## fonction Vr_mob

ATTENTION PROBLEME DE LOGIQUE : juste POURQUOI ???

**Paramètres** : L, r

**Rôle** : Cette fonction retourne la valeur que donne la fonction **potentiel_Schwarzschild_photon(L,r)**.


