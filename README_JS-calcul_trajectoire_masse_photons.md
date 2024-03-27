# README associé au fichier JS-calcul_trajectoire_masse_photons.js

Etant donné l'impossibilité de mettre des commentaires dans les fichiers de code JavaScript dû à un soucis d'optimisation du code nous avons décidé de créer des fichiers en markdown pour chaque fichier JavaScript. Le code sera ainsi bien plus aisé à comprendre pour nos successeurs. 

⚠️ Si vous apportez des modifications au code associé à ce README veuillez modifier ce README pour les années suivantes. 

📍 Ce README est associé au fichier JS-calcul_trajectoire_masse_photons.js lui même associé à la page "Masse baryonique et photon" de la partie Trajectoires.

Nous suivrons la syntaxe du code pour pouvoir l'expliquer. Etant donnés que la promotion qui a écrit ce README (2024) n'est pas celle ayant créé la majorité de ces fonctions nous n'en garantissons pas ni la logique ni la fonctionnalité. Ce README est simplement une tentative d'explication de ce qui a été fait précédemment. 

## Variables globales

La première chose qui est faites dans ce code est de déclarer les variables globales. Voici à quoi nous avons compris qu'elles étaient associées :

**DIAMETRE_PART** = semble correspondre au diamètre des particules. 
**z** = 🚧 *pas utilisée du tout dans le programme*.
**z_obs** = 🚧 *pas utilisée du tout dans le programme*.
**title** = variable pour les textes de titre. 
**clicks** = 🚧 *pas utilisée du tout dans le programme*.
**nzoom** = variable pour la valeur du zoom. 
**facteurDeMalheur** = liste de facteurs d'échelle de l'animation pour les différents mobiles.
**fact_defaut** = facteur d'échelle de l'animation.
**factGlobalAvecClef** = facteur d'échelle de l'animation.
**compteurVitesseAvantLancement** = valeur qui comptabiliser le nombre de fois où on appuyer sur accélérer et ralentir.

## Variables globales, key values

**rmaxjson** = initialisée vide. 
**mobilefactor** = facteurs de mise à l'échelle.
**r0o2** = liste des distances initiales des projectiles au centre de l'astre. Initialisée vide.
**maximum** = valeur de la distance initiale d'un projectile au centre de l'astre qui est la plus grande comparée aux autres projectiles.
**cle** = utilisé plusieurs fois au cours du programme pour stocker des indices de liste ou autres indices.
**fuseecompteur** = nombre de projectiles choisi par l'utilisateur.
**listejsonfusees** = résultats de la fonction **initialisation** pour chaque fusée. Initialisée vide.

## Liste de couleur en hexa

Fixe des couleurs dans des constantes à l'aide des couleurs hexadécimales. Les couleurs hexadécimales sont composées de 6 chiffres hexadécimaux qui représent les intensités des composantes rouge, verte et bleue de la couleur. Chaque paire de chiffres hexadécimaux représente une valeur de 0 à 255 pour chaque composante, allant de l'absence de couleur (0) à sa pleine intensité (255).
Ainsi pour le rouge pur on a le code hexadécimal #FF0000 et pour le vert pur on a #00FF00.

Dans le code sont ainsi codées 9 couleurs : **COULEUR_NOIR** (#2F2D2B), **COULEUR_BLEU** (#4080A4), **COULEUR_CYAN** (#008B8B), **COULEUR_BLANC** (#FFFFFF), **COULEUR_ROUGE** (#FF0000), **COULEUR_GRIS** (#CCCCCC), **COULEUR_MARRON** (#673B15), **COULEUR_ROUGE_COSMO** (#B54B3A) et **COULEUR_BLEU_MARINE** (#1A03FF).

## Couleurs rayons et particules

**COULEUR_PART** = couleur de la particule à laquelle on attribue la couleur **COULEUR_ROUGE_COSMO**.
**COULEUR_RS** = couleur du rayon de Schwarzchild à laquelle on attribue la couleur **COULEUR_BLEU**.
**COULEUR_RPHY** = couleur du rayon physique à laquelle on attribue la couleur **COULEUR_GRIS**. 

## Autres variables

**ifUneFois**, **ifUneFois2**, **ifUneFois3** sont des booléens utilisés pour des vérifications et ils sont initialisés à **true**.

## Glossaire des fonctions

#1 : testnum
#2 : testvaleur
#3 : generateur
#4 : initialisationGenerale
#5 : lancerDeFusees
#6 : supprHtml
#7 : htmlDecode
#8 : generateHtml
#9 : initialisation
#10 : verifnbr
#11 : pressionBouttonObservateur
#12 : pressionBouttonMobile
#13 : trajectoire
#14 : animate
#15 : Vr_mob
#16 : Vr_obs
#17 : Vr
#18 : potentiel_Schwarzschild_photon
#19 : derivee_seconde_Schwarzschild_photon
#20 : derivee_seconde_Schwarzschild_photon_obs
#21 : rungekutta
#22 : rungekutta_obs
#23 : calcul_rmax
#24 : pausee
#25 : clavierEvenement
#26 : rafraichir2
#27 : rafraichir
#28 : enregistrer
#29 : siTrajectoireSimple
#30 :traceEstAbsent
#31 : siTrajectoireComplete
#32 : choixTrajectoire
#33 : estUnMobile
#34 : commandes
#35 : majFondFixe
#36 : majFondFixe44
#37 : majFondFixe22
#38 : majFondFixe3
#39 : text_inte
#40 : creation_blocs
#41 : canvasAvantLancement
#42 : boutonAvantLancement
#43 : foncPourZoomPlusAvantLancement
#44 : foncPourZoomMoinsAvantLancement
#45 : foncPourVitAvantLancement
#46 : MAJGraphePotentiel

## Fonctions

### #1 : fonction testnum
🔧 **Paramètres** : a 

💡 **Rôle** : Cette fonction chercher à déterminer l'exposant de la puissance de 10 nécessaire pour ramener un nombre (a) donné dans l'intervalle [1,10].

📑 **Fonctionnement** : Je fais varier une variable i dans l'intervalle [-30,29[ et pour chaque valeur de i je divise a par 10 exposant i. Si le résultat est compris dans [1,10] alors je retourne la valeur de i correspondante.

### #2 : fonction testvaleur

🔧 **Paramètres** : x

💡 **Rôle** : Cette fonction vérifie si le paramètre x est un nombre. Si c'est le cas, elle le renvoie, sinon elle retourne la chaîne de caractères 'Not a Number!'. 

📰 **Informations** : isNaN est une fonction en JavaScript qui permet de déterminer si la valeur fournie n'est pas un nombre. Si elle retourne 'true' alors la valeur fournie n'est pas un nombre. isNaN(123) par exemple va retourner false alors que isNaN('hello') va retourner true.

### #3 : fonction generateurCouleur

🔧 **Paramètres** : N/A 

💡 **Rôle** : Cette fonction génère et retourne de manière aléatoire une couleur RGB sous la forme d'un tableau contenant les valeurs des composantes rouge, verte et bleue.

📰 **Informations** : Math.random() retourne un nombre aléatoire dans l'intervalle [0,1[ et Math.floor() arrondit un nombre à l'entier inférieur le plus proche. 

### #4 : fonction initialisationGenerale

🚧 *Calculer rs sert à rien*

🔧 **Paramètres** : fuseecompteur

💡 **Rôle**: Cette fonction sert à initialiser plusieurs valeurs à partir des informations récupérées sur la page html.
Elle ne retourne rien.

📑 **Fonctionnement** : 
1. On commence par fixer les constantes c (*vitesse de la lumière en m/s*) et G la constante gravitationnelle.
2. Puis on récupère les valeurs de M (*Mass de l'astre en kg*) et de r_phy (*Rayon physique de l'astre en m*) que l'utilisateur a renseigné et on les convertis en nombres.
3. On calcule ensuite le rayon de Schwarzschild rs en deux étapes. D'abord en calculant (G*M)/c² puis en multipliant ce résultat, stocké dans une variable m, par 2. 
4. La dernière chose que cette fonction fait est d'itérer sur les valeurs d'une variable compteur de 1 à la valeur de fuseecompteur inclu. pour chaque valeur de compteur elle rempli la valeur de listejsonfusees d'indice correspondant avec ce que retourne la fonction **initialisation()** qui prend comme paramètre la valeur de compteur.

📰 **Informations** : Math.pow() sert à calculer la puissance d'un nombre. Elle prend en arguments la base et l'exposant.

### #5 : fonction lancerdeFusees

🚧 *calculer rs sert à rien*

🔧 **Paramètres** : fuseecompteur

💡 **Rôle** : Cette fonction utilise les données récupérées depuis des éléments HTML et des constantes prédéfinies pour lancer des fusées en appelant la fonction **trajectoire()** pour chaque fusée. 

📑 **Fonctionnement :**
1. Je commence par fixer des constantes telles que c (*vitesse de la lumière en m/s*) et G (*constante gravitationnelle en SI*).
2. Puis on récupère les valeurs de M (*Mass de l'astre en kg*) et de r_phy (*Rayon physique de l'astre en m*) que l'utilisateur a renseigné et on les convertis en nombres.
3. On calcule ensuite le rayon de Schwarzschild rs en deux étapes. D'abord en calculant (G*M)/c² puis en multipliant ce résultat, stocké dans une variable m, par 2. 
4. Pour une variable compteur itérée de 1 à fuseecompteur inclu on calcule la foncton **trajectoire** prenant comme paramètre la valeur de compteur et la valeur de listejsonfusee[compteur] calculée dans la fonction initialisationGenerale. 

### #6 : fonction supprHtml

🚧 *Problème initialiser nbrfuseesuppr et ENSUITE vérifier que ce que on a stocké dedans existe encore*

🔧 **Paramètres** : N/A

💡 **Rôle** : Supprimer des éléments HTML de la page web. 

📑 **Fonctionnement** : 
1. Je commence par mettre dans la variable nbrfuseesuppr la valeur de nombredefusees récupérée à partir de sessionStorage, où sont stockées les données de la session en cours.
2. Je supprime ensuite le contenu des éléments HTML avec les identifiants *tableauconstanteslers* et *tableauresultatsimu*.
3. Je vérifie si la variable nombredefusees existe dans sessionStorage et si c'est le cas je stocke cette valeur dans nbrfuseesuppr
4. Je récupère un élément HTML avec l'identifiant "myCanvas" en me servant de la méthode **document.getElementByID()** qui récupère un élément HTML à partir de son identifiant unique (ID) dans le document HTML. Et je stocke cet élément dans la variable elementcanvasasuppr.
5. Je supprime elementcanvasasuppr de la page.
6. Je récupère la valeur d'un élément de formulaire HTML avec l'ID "canvaswidthheight" et stocke cette valeur dans la variable "canvaswh".
7. Ensuite j'itère la variable countt de 1 à la valeur de nbrfuseesuppr incluse et pour chaque valeur de count je supprime plusieurs éléments de la page HTML : le rayon de toutes les fusées, les vitesser et les vitessep ainsi que myCanvasBoule de toutes les fusées et les graphes d'ID "grsvg_{countt}". 
8. Une fois l'itération finie je supprime de la page HTML l'élement d'ID "myCanvas3three".

### #7 : fonction htmlDecode

🔧 **Paramètres** : input (chaîne de texte)

💡 **Rôle** : Cette fonction prend en entrée une chaîne de texte qui est supposée être du texte encodé en HTML et retourne la version décodée de ce texte. 

📑 **Fonctionnement** :
1. Je mets dans la variable doc un objet DOM qui représente le contenu HTML de input.
2. Je retourne tout le texte de la structure HTML de doc en ignorant les éléments de code HTML. 

### #8 : fonction genereHtml

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction génère du contenu HTML en fonction de ce qui a été saisi par l'utilisateur dans un champ de formulaire avec l'identifiant "nombredefusees".
Cela va aider à générer les tableaux qui apparaissent sur la page web. Celui avant le début de la simulation et celui également après la simulation. La taille des tableaux sera adaptée en fonction du nombre de mobiles.

📑 **Fonctionnement simplifié** : 
1. Je récupère la valeur de "nombredefusees" à partir du formulaire.
2. Je génère plusieurs éléments HTML comme des étiquettes (labels) et des champs de saisie (inputs) en fonction du nombre de fusées qui a été spécifié.
3. J'attribue des ID uniques à chaque élément généré en utilisant une boucle for.
4. J'insère les éléments générés dans un conteneur avec l'identifiant "champs_a_remplir" dans le document HTML.
5. Je créé une ligne de tableau avec des en-têtes contenant des étiquettes numérotées et les insère dans un tableau avec l'identifiant "**tableauconstanteslers**".
6. Dans ce tableau il y aura les constantes d'intégration E et L pour chaque mobile (voir la partie théorique), le rayon de Schwarzschild, la gravité, la vitesse de libération, la température d'un trou noir et le temps d'évaporation d'un trou noir.
7. Dans cette fonction on crée aussi un nouveau tableau cette fois sous l'identifiant "**tableauresultatsimu**" où seront rangés les résultats de la simulation pour chaque mobile. Pour chaque mobile on aura des résultats spécifiques comme la position le temps écoilé etc. La taille de ce tableau (le nombre de canvas) sera adapté en fonction du nombre de fusées.

📰 **Informations** : Les fonctions **texteTrajectoirePhoton(nbredefuseesgenere)**, **notationvitesseree1()**, **textegravetetc()**, **infobilleobservateurdistant()** sont utilisées. Ainsi que d'autres fonctions servant au bon affichage du katex qui permet d'avoir de belles formules LateX sur le site.

## #9 : fonction initialisation

🚧 *Pourquoi une condition sur theta=90 ou 180° ? Et pourquoi faire les calculs avant d'avoir vérifié les conditions ? phi0 convertit en degrés puis en radians à nouveau ?*

🔧 **Paramètres :** compteur

💡 **Rôle** : Cette fonction effectue plusieurs calculs et actions pour initialiser les données d'un mobile/fusée spécifique dans la simulation.

📑 **Fonctionnement détaillé :**
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


📰 **Informations** : Cette fonction utilise les autres fonctions **calcul_rmax()**, **generateCouleur()**, **boutonAvantLancement()** et **canvasAvantLancement()**. 

## #10 : fonction verifnbr

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction alerte l'utilisateur si des champs obligatoires ne sont pas remplis ou bien si ils contiennent des valeurs incorrectes. 

📑 **Fonctionnement simplifié** :
1. Je récupère les valeurs de la masse de l'astre en kg (stockée dans M) , du rayon physique de l'astre (stockée dans r_phy) et du nombre de mobiles (stockée dans sddsdsdds) renseignés par l'utilisateur. 
2. Pour chacun des mobiles je récupère la valeur de la distance initiale du projectile au centre de l'astre en m (stockée dans r0verifnbf), la valeur de la vitesse tangentielle vphi (stockée dans vphiverifnbr) et la valeur de la vitesse radiale vr (stockée dans vrverifnbr).
3. Je vérifie si r0verifnbr, vphiverifnbr et vrverifnbr pour tous les mobiles sont des nombres et si ce n'est pas le cas j'affiche des messages d'erreur en conséquence.
4. Je vérifie que r_phy et M soient des nombres et si ce n'est pas le cas j'affiche des messages d'erreur en conséquence.

## #11 : fonction pressionBouttonObservateur

🔧 **Paramètres** : N/A

💡 **Rôle** : Changer les classes CSS des boutons avec les identifiants "r3" et "r4" si on appuie sur le bouton "r3". 

📑 **Fonctionnement** :
* Je regarde si la classe du bouton avec l'identifiant "r3" est égale à "myButton2" et si c'est le cas alors cela veut dire que le bouton est activé. Dans ce cas je change la classe du bouton "r3" en "myButton" et celle du bouton "r4" en "myButton2". 

## #12 : fonction pressionBouttonMobile

🔧 **Paramètres** : N/A

💡 **Rôle** : Changer les classes CSS des boutons avec les identifiants "r3" et "r4" si on appuie sur le boutton "r4". 

📑 **Fonctionnement** :
* Je regarde si la classe du bouton avec l'identifiant "r4" est égale à "myButton2" et si c'est le cas alors cela veut dire que le bouton est activé. Dans ce cas je change la classe du bouton "r4" en "myButton" et celle du bouton "r3" en "myButton2". 

## #13 : fonction trajectoire 

🚧 *Variable nommée BLYO pour le nombre de mobiles puis nbredefusees dans laquelle y a exactement la même chose*

🔧 **Paramètres** : compteur, mobile

💡 **Rôle** : Etablir la trajectoire de la particule.

📑 **Fonctionnement détaillé**:
1. Je stocke dans la variable "texte" ce que me retourne la fonction **o_recupereJson()**.
2. Je vérifie si la trajectoire est en pause ou bien si elle vient de démarrer et si une de ces conditions est vérifiée alors j'effectue différentes action : <br>
🔹  La couleur du champ de saisie de r0 est modifiée en fonction des composantes de couleurs définies dans l'objet mobile (de la couleur qui est associée à ce mobile) et la couleur du texte est ajustée en noir ou blanc en fonction de la luminosité du champ de saisie. <br>
🔹 L'élément avec l'ID "tg2" est modifié pour afficher le style de table. (Affichage d'un élément HTML sous forme de tableau.) Et le contenu de l'élement avec l'ID "indic_caluls" est remplacé par le texte récupéré à partir de **texte.pages_trajectoire.calculs_encours**, ce qui semble être un indicateur visuel pour l'utilisateur indiquant que des calculs sont en cours. <br>
🔹 La fonction **estUnMobile()** est appellée. <br>
🔹 Certains éléments de saisie dans le document HTML sont désactivés pour éviter que l'utilisateur ne modifie les valeurs pendant la simulation. Les éléments affectés sont la masse de l'astre (M), le rayon physique de l'astre (r_phy) et le nombre de mobiles (nombredefusees). <br>
🔹 Je récupère le nombre de mobiles que l'utilisateur a rentré et je stocke cette valeur convertie en nombre dans la variable blyo. <br>
🔹 Je boucle et pour tous les mobiles je désactive les champs de saisie associés à r0, phi0 et teta pour ne pas que l'utilisateur ne modifie les valeurs pendant la simulation. <br>
🔹 Je désactive les boutons qui permettent  de passer d'observateur à photon et vice-versa. Ainsi l'utilisateur ne peut pas les changer en pleine simulation. <br>
🔹 Je définis la valeur de l'élément avec l'ID "trace_present" à "1" pour contrôler si il y a un tracé pendant la simulation ou non pour l'enregistrement. <br>
🔹 Je définis les propriétés "pause" et "début" de l'objet "mobile" à false. Cela indique ainsi que la simulation n'est ni en pause ni au début. <br>
🔹 J'initialise les valeurs des angles "phi" et "phi_obs" dans l'objet "mobile" avec la valeur phi0 de l'objet mobile. <br>
🔹 Je calcule le temps de chute libre ("temps_chute_libre") de la particule. <br>
🔹 J'ajoute la propriété "temps_chute_libre" à l'objet "mobile" et je l'initialise avec la valeur de ma variable temps_chute_libre que je viens de calculer. <br>
🔹 Je stocke dans la variable "A_init" la valeur de vr du mobile et dans la variable "r_init" la valeur de r0 du mobile. <br>
🔹 Je stocke dans la variable "nbredefusees" la même chose que dans la variable "blyo". <br>
🔹 Si le nombre de mobile est égale à 1 et que "ifUneFois2" (initialisée à true au début du programme) est égale à true alors on stocke dans la variable maximum la valeur de rmax associée à l'indice 1 de la liste r0o2. Et puis on stocke dans la variable "cle" la valeur 1 et dans la variable ifUneFois2 la valeur false. <br>
🔹 Si le nombre de mobile est plus grand ou égal à 2 et que "ifUneFois" (initialisée à true au début du programme) est égale à true (première fois que cette condition est rencontrée) alors on fait plusieurs choses. Tout d'abord on cherche le mobile ayant le rayon le plus élevé (rmax) parmi tous les mobiles et on stocke la valeur de rmax de ce mobile dans la variable "maximum" et le numéro de ce mobile dans la variable "cle". Ensuite je parcours à nouveau toutes les fusées et j'ajuste les facteurs de mise à l'échelle ("mobilefactor") pour qu'ils soient proportionnels au rayon du mobile le plus grand. Pour finir je mets la variable "ifUneFois" à false. <br>
🔹 On stocke dans la variable "A_part" la valeur de "A_init" et dans la variable "r_part" la valeur de "r_init". <br>
🔹 J'ajoute à l'objet "mobile" les propriétés "A_part" et "r_part" que j'initialise avec les variables aux noms correspondant. <br>
🔹 Je calcule la vitesse radiale vr du mobile observée que je stocke dans la variable "A_init_obs", je stocke ensuite également cette valeur dans la variable "A_part_obs" et j'ajoute à l'objet "mobile" une propriété "A_part_obs" que j'initialise avec A_part_obs. <br>
🔹 Je stocke dans la variable "vrobs" la valeur de la variable "A_init_obs". <br>
🔹 Je calcule la valeur de la vitesse tangentielle observée que je stocke dans la variable "vphiobs". <br>
🔹 Je stocke dans les variable "r_init_obs" et "r_part_obs" la valeur de la distance initiale du mobile au centre de l'astre r0 du mobile.Et puis j'ajoute à l'objet "mobile" la propriété "r_part_obs" que j'initialise avec r_part_obs. <br>
🔹 J'initialise le temps de la particule (temps_particule) et le temps de l'observateur (temps_observateur) à 0 et j'ajoute à l'objet "mobile" les propriétés "temps_particule" et "temps_observateur" que j'initialise avec mes nouvelles variables. <br>
🔹 J'appelle la fonction clavierEvenement(). <br>
🔹 Je récupère dans la variable "element2" l'élément HTML avec l'ID "traject_type2". <br>
🔹 Je calcule la valeur de dτ que je stocke dans la variable "dtau" et puis j'ajoute à l'objet "mobile" la propriété "dtau" que j'initialise avec ma nouvelle variable. <br>
🔹 Je calcule la position initiale de la particule (x1part et y1part) en ajustant la taille de la trajectoire sur le canva et en normalisant la position par rapport à la taille maximale de la trajectoire. <br>
🔹 Je calcule la position initiale de l'observateur dans le référentiel propre (x1obs et y1obs) en ajustant la taille de la trajectoire sur le canva et en normalisant la position par rapport à la taille maximale de la trajectoire. <br>
🔹 Je récupère l'élément HTML avec l'ID "myCanvas" et je le stocke dans la variable canvas. Puis je vérifie si canvas est défini et si ce n'est pas le cas j'affiche un message d'erreur contenue dans **texte.pages_trajectoire.impossible_canvas**. <br>
🔹 Je récupère le contexte de rendu 2D du canvas et je le stocke dans la variable context. Si context n'est pas défini alors j'affiche un message d'erreur contenue dans **texte.pages_trajectoire.impossible_context**.  <br>
🔹 J'ajoute à l'objet "mobile" la propriété "canvas22" qui est initialisée avec un élément canvas avec l'ID "myCanvasBoule"+{numéro du Mobile}. <br>
🔹 J'ajoute à l'objet "mobile" la propriété "context22" qui est initialisée avec le contexte de rendu 2D. <br>
🔹 J'appelle la fonction **majFondFixe()** et la fonction **majFondFixe44()** avec le paramètre mobile. <br>
🔹 Je stocke dans la variable diametre_particule la valeur DIAMETRE_PART qui a été initialisée au début du programme. <br>
🔹 Je modifie le style de l'élément HTML ayant l'ID "bloc_resultats" pour afficher ce bloc en tant que block. Donc l'élélement HTML avec cet ID sera rendu visible sur la page web. <br>
🔹 Je défini une fonction appellée **CentrerPopPotentiel()** qui ne prend pas de paramètres et qui affiche d'abord un élément HTML avec l'ID "bloc_resultats" en le rendant visible sur la page ensuite elle parcourt une série d'élements HTML ayant des IDs de la forme "grsvg_{numéro du mobile}" et pour chaque élément trouvé elle le supprime du DOM s'il existe et a un parent. Enfin, si la case à cocher ayant l'ID "toggle" est décochée alors la fonction **CentrerPopPotentiel()** est appellée. Cette fonction permet donc de nettoyer et de réinitialiser certaines parties de la page lorsque l'utilisateur décoche une cas à cocher. <br>
🔹 Je calcule la position de la particule sur le canvas avec les variables x1part et y1 part puis je stocke ces positions dans une propriété "positionspatio" de l'objet "mobile". <br>
🔹 Je calcule la position de l'observateur sur le canvas avec les variable x1obs et y1obs puis je stocke ces positions dans une propriété "position" de l'objet "mobile". <br>
🔹 Je calcule la position centrale du canvas (la moitié de sa largeur et la moitié de sa hauteur) et je la stocke dans les variable "posX3" et "posY3". <br>
🔹 J'anime la simulation en appelant la fonction **animate()** à intervalles réguliers en en lui fournissant les arguments "compteur", "mobile" et "mobilefactor". <br>
🔹 Je stocke dans les propriétés "Dtau1" et "Dtau2" du mobile les valeurs de Dtau à la puissante 8 (*1e8) (Dtau1) et de Dtau à la puissance -8 (/1e8) (Dtau2).<br>
🔹 J'associe un événement de clic à un bouton ayant l'ID "bouton_pause". Lorsque ce bouton est cliqué, la fonction **pausee()** est appellée prenant comme arguments "compteur", "mobile" et "mobilefactor". <br>
🔹 Je supprime un écouteur d'événements associé au bouton d'ID "plusvite" et un autre écouteur d'événement associé au bouton d'ID "moinsvite". <br>
🔹 J'ajoute un nouvel écouteur d'évenement au bouton "plusvite" qui lorsqu'il est cliqué va faire que la vitesse de la simulation est augmentée à l'aide de la fonction **bouttons.vitesse(mobile,true)** et la variable "compteurVitesseAvantLancement" est également mise à jour pour refléter la nouvelle vitesse de la simulation. <br>
🔹 J'ajoute un nouvel écouteur d'événement au bouton "moinsvite" qui lorsqu'il est cliqué va faire que la vitesse de la simulation va baisser à l'aide de la fonction **bouttons.vitesse(mobile, false)** et la variable "compteurVitesseAvantLancement" est également mis à jour pour refléter la nouvelle vitesse de la simulation. <br>
🔹 J'ajuste la vitesse de simulation en fonction du nombre de clics sur les boutons "plusvite" ou "moinsvite".<br>
🔹 Lorsque l'on clique sur le bouton d'ID "enregistrer2" alors une action est déclenchée. On récupère l'élément d'ID "traject_type2" et si cette valeur n'est pas "mobile" alors ça veut dire que l'observateur est sélectionné et dans de cas on dessine un cercle bleu sur le canvas à la position actuelle de l'observateur. Si la valeur est "mobile" alors cela veut dire que la particule est sélectionnée et dans de cas on dessine un cercle bleu sur le canvas à la position actuelle de la particule. <br>
🔹 Les écouteurs d'événements associés aux boutons d'ID "moinszoom" et "pluszoom" sont supprimés pour éviter les doublons, au cas où ils auraient déjà été ajoutés précédemment. <br>
🔹 Un nouvel écouteur d'événement est ajouté au bouton "moinzoom". Lorsque ce bouton est cliqué la fonction **bouttons.zoom(false, mobile, canvas, mobilefactor, compteur)** est appelée pour réduire le zoom. Puis les facteurs de zoom et les valeurs associées sont mis à jour et la fonction **majFondFixe44(mobile)** est appelée pour mettre à jour le fond fixe. Pour finir la fonction **rafraichir2(context, mobilefactor, rmaxjson, maximum, compteur)** est appelée pour rafraîchir le canvas et le texte affichant le niveau de zoom est mis à jour. <br>
🔹 Un écouteur d'évenement similaire est ajouté au bouton "pluszoom" mais cette fois pour augmenter le zoom. <br>
🔹 Un dernier écouteur d'événement est ajouter au bouton d'ID "initialiser" qui réinitialise les paramètres de la simulation lorsque le bouton est cliqué. Cela inclut la réinitialisation des facteurs de zoom, l'appel de la fonction **majFondFixe44(mobile)** pour mettre à jour le fond fixe, le rafraichissement du canvas et la réinitialisation du texte affichant le niveau de zoom. <br>
🔹 J'ajoute un écouteur d'événement au bouton d'ID "clear". Lorsque ce bouton est cliqué, la page est rechargée ce qui a pour effet d'effacer le contenu du canvas en entier puisque tout le script sera relancé. <br>
🔹 La fonction **creation_blocs(context, mobilefactor, rmaxjson, maximum, compteur)** est appelée et semble être responsable du tracé du rayon de Schwarzchild. <br>
🔹 On stocke dans une variable "element2" l'élément dont l'ID est "traject_type2". <br>
🔹 Je créé un intervalle d'exécution qui exécute la fonction anonyme toutes les 300 milisecondes, ceci va être utilisé pour des mises à jour en temps réel ou des animations. Ce bloc de code va être responsable de la mise à jour périodique du graphe du potentiel en fonction du type de trajectoire sélectionné (observateur ou spationaute). <br>
🔹 Voici ce que fais cette fonction anonyme : Elle commence par vider l'élément SVG identifié par "grsvg_" suivi du numéro de compteur. Cela permet de nettoyer le contenu SVG avant de dessiner de nouveaux éléments.Ensuite elle initialise deux tableaux de données vide "data1" et "data2". Puis elle vérifie si la valeur de l'élément "element2" n'est pas mobile et si c'est le cas elle calcule le pas de variation "dr" pour le tracé du graphe en fonction du rayon de la particule observée, calcule les valeur du potentiel gravitationnel pour différents pourcentages de rayon du rayon de la particule observée et les stocke dans "data1", calcule la valeur du potentiel gravitationnel au rayon de la particule observée et la stocke dans "data2", puis appelle la fonction **graphique_creation_pot(0, data1, data2, compteur, mobile)** pour créer le graphe du potentiel avec les données calculée et le stocke dans mobile.point. Si la valeur de "element2" est "mobile" alors le processus est similaire mais les calculs sont basés sur le rayon de la particule plutôt que sur celui de la particule observée. <br>
3. Si la trajectoire n'est pas en pause ou vient de démarrer alors on créé un intervalle qui exécute la fonction **animate.bind(null, compteur, mobile, mobilefactor)** périodiquement et on stocke cet intervalle dans mobile.myInterval. 10/6 est l'intervalle de temps en miliseconde entre chaque appel de la fonction **animate()**.
4. Un événement est ajouté au bouton d'ID "pause/resume" de sorte que lorsque ce bouton est cliqué la fonction **pausee(compteur, mobile, mobilefactor)** est appellée.
5. Le bouton d'ID "start" est masqué une fois que l'animation est lancée.
6. Le bouton d'ID "pause/resume" est affiché une fois que l'animation est lancée.
7. Une info-bulle est ajoutée au bouton d'ID "clear" avec le texte spécifié dans **texte.pages_trajectoire.bouton_stop_bulleInfo**.


📰 **Informations** : Cette fonction utilise les autres fonctions **o_recupereJson()**, **texte.pages_trajectoire.calculs_encours**, **estUnMobile()**, **clavierEvenement()**, **texte.pages_trajectoire.impossible_canvas**, **texte.pages_trajectoire.impossible_context**, **majFondFixe()**, **majFondFixe44()**, **animate()**, **pausee()**, **vitesse()** et **zoom()** liées au fichier **bouttons.js**, **rafraichir2()**, **creation_blocs()**, **graphique_creation_pot()**, **pausee()**, **texte.pages_trajectoire.bouton_stop_bulleInfo**.
Le **DOM** est une représentation hiérarchique sous forme d'arbdre de tous les éléments d'une page web où chaque élément est un noeud dans cet arbre.

## #14 : fonction animate 

🚧 *Pourquoi une fonction testvaleur(x) est redéfinie dans cette fonction alors qu'elle l'a déjà été faites en dehors ? Il y a un += 0 ? J'ai un /0 à la ligne 1056 ?*

🔧 **Paramètres** : compteur, mobile, mobilefactor

💡 **Rôle** : Cette fonction gère l'animation de la trajectoire d'une particule autour d'un trou noir, à la fois dans le référentiel propre de la particule et dans celui de l'observateur.

📑 **Fonctionnement détaillé** :
1. J'initialise la variable "onestarrete" de l'objet "mobil" à 0 pour indiquer que la particule n'est pas arrêtée.
2. Je met à jour le facteur de zoom de la trajectoire de la particule dans le tableau "mobilefactor" à l'indice "compteur" avec la valeur de la variable "factGlobalAvecClef".
3. J'appelle la fonction **estUnMobile()**.
4. Je récupère l'élément HTML avec l'ID "traject_type" que je stocke dans la variable "element"
5. J'appelle la fonction **choixTrajectoire(compteur, context, mobile, mobilefactor, rmaxjson, maximum)** pour probablement choisir le type de trajectoire à afficher en fonction de certains paramètres passés en arguments.
6. Je récupère la valeur de l'élément HTML avce l'ID "boutton_ammorti" que je stocke dans la variable "isrebond".
7. Je vérifie si r0 (la distance initiale du mobile au centre de l'astre) est différente de 0.0 ou non et si c'est le cas :<br>
🔹 Si la valeur de "element2" est "mobile" alors la fonction **rungekutta(mobile.L, mobile.dtau, mobile.r_part, mobile.A_part)**  qui semble utiliser la méthode de Runge-Kutta est appelée pour calculer les nouvelles positions et vitesses de la particule mobile puis stocke les résultats dans les propriétés "rpart" et "A_part" de l'objet "mobile". Je stocke ensuite dans la variable resultat ce que retourne la fonction **calculs.MSC_Ex_vitess(mobile.e, mobile.L, mobile.r_part, rs, true)**. Ensuite je stocke dans la variable "vtotal" le résultat resultat[0] (probablement la vitesse totale de la particule), dans "vp_2" le resultat[2] (probablement la vitesse tangentielle de la particule) et dans "vr_2" le resultat[1]xMath.sign(mobile.A_part) (probablement la vitesse radiale de la particule). <br>
🔹 Sinon j'effectue des calculs assez similaires pour le cas où l'"element2" n'est pas "mobile". Les noms de variables changeront par contre avec un "_obs" qui apparaît à la fin et on utilisera non pas **rungekutta()** mais **rungekutta_obs()**. <br>
🔹 Je vérifie si la valeur de l'élément "element2" n'est pas "mobile" et en fonction : <br>
🔹🔹🔹 Soit  Si "element2" n'est pas "mobile" et que le "r_part_obs" est supérieur ou égal à "rs" alors on trace la trajectoire de la particule. On dessine un petit rectangle représentatnt la particule sur le canvas et les coordonnées de la particule sont données par "mobile.position.posX2" et "mobile.position.posY2". Ensuite le code met à jour le contexte mobile["context22"] pour dessiner un cercle autour de la particule, pour la distinguer sur le deuxième canva.<br>
🔹🔹🔹 Ou bien si "element2" est "mobile" on est dans le référentiel de la particule et le même processus est réalisé mais cette fois les coordonnées de la particule sont "mobile.positionspation.posX1" et "mobile.positionspatio.posY1"<br>
🔹 Si on a "element2" qui n'est pas "mobile" et donc qu'on est dans le référentiel de l'observateur et que "r_part_obs" est plus petit ou égal à "r_phy"  alors si l'option de rebond est activé (isrebond=1) et que le "r_phy" > 0  alors on inverse le signe de "mobile.A_part_obs" .Si par contre le rebond est désactivé (isrebond=0), que r_phy est différent de 0 et que "mobile.r_part_obs" est plus petit ou égale à "r_phy" alors on met la variable "mobile.onestarrete" à 1, on appelle la fonction arret(mobile) et on met la variable "mobile.peuxonrelancer" à false.<br>
🔹 Si par contre on a "element2" qui est "mobile" et que donc on est dans le référentiel de la particule et que "mobile.r_part" est plus petit ou égal à "r_phy" ou bien que mobile.r_part==0 alors on a deux cas de figure. Soit l'option de rebond est activé et r_phy >  et dans ce cas on inverse le signe de mobile.A_part. Ou bien l'option rebond est désactivée et r_phy n'est pas nulle et mobile.r_part <= r_phy et dans ce cas on fait les mêmes choses que dans le deuxième cas du point 9.<br>
🔹  Ensuite on met à jour les positions de la particule dans son référentiel et dans le référentiel de l'observateur sur le canva en fonction de leur position radiale et angulaire.<br>
🔹  Si le choix de la trajectoire (element2.value) n'est pas"mobile" alors on utilise la fonction **Vr_obs(mobile.E,mobile.L,mobile.r_part_obs)** pour calculer le potentiel gravitationnel et le résultat est stocké dans la variable V. Ensuite, une nouvelle liste de données ("data2") est créée, contenant une seule entrée avec dans "date" la variable "mobile.r_part_obs" et dans "close" la variable "V". Et puis si la variable "mobile.point" est définie alors on appelle la fonction **update_graphique_2(mobile.point,data2,mobile)**.<br>
🔹  Si "element2" est égal à "mobile" alors on utilise la fonction **Vr_mob(mobile.L,mobile.r_part)** pour calculer le potentiel gravitationnel qui est stocké dans "V" et de la même manière on créé une liste de donnée "data2" sauf que cette fois dans "date" on met la variable "mobile.r_part". Et puis on on procède de la même manière que dans 12.<br>
🔹  Je vérifie si mobile.rpart est négatif ou pas et si c'est le cas je le remets à 0. Ceci est fait pour ne pas avoir de mauvaises surprises sur le dernier calcul avant la fin. <br>
🔹  Je défini ensuite une fonction **testvaleur(x)** qui vérifie si le paramètre x qui lui est donné est un nombre ou non et si c'est un nombre alors la fonction le retourne et si ce n'est pas le cas elle affiche un message d'erreur. <br>
🔹  Je vérifie si "element2" est égal à "mobile" (référentiel de l'observateur) ou pas (référentiel du photon). Et puis je vérifie quelques conditions supplémentaires comme par exemple si "mobile.r_part_obs" >= rs * 1.000001 ou si "mobile.r_part">0 et en fonction des conditions qui sont remplie ou non je mets à jours les valeurs HTML des éléments d'ID "to{compteur}", "r_par{compteur}", "tp{compteur}", "vp_sc_mas{compteur}", "vr_sc_mas{compteur}", "v_tot{compteur}", "ga{compteur}". <br>
🔹 Si on est dans le référentiel de la particule et que "mobile.r_part" > rs*1.00001 alors on rajouter à la valeur "mobile.temps_observateur" la valeur de "mobile.dtau". Et si on ne vérifie pas la condition "mobile.r_part" > rs*1.00001 alors "mobile.temps_observateur" prend la valeur 1/0. **GROS PROBLEME A CET ENDROIT**.Je mets ensuite à jour la valeur de l'élément HTML qui a pour ID "to{compteur}" peu importe si la condition est vérifiée ou non. <br>

📰 **Informations** : Cette fonction utilise les autres fonctions **estUnMobile()**, **choixTrajectoire()**, **rungekutta()**, **MSC_Ex_vitesse()** liée au fichier **calculs**, **rungekutta_obs()**, **arret()**, **Vr_obs()**, **update_graphique_2()**

## #15 : fonction Vr_mob

🚧 *Pourquoi ?*

🔧 **Paramètres** : L, r

💡 **Rôle** : Cette fonction retourne la valeur que donne la fonction **potentiel_Schwarzschild_photon(L,r)** qui devrait être le potentiel gravitationnel dans le référentiel de la particule.

## #16 : Fonction Vr_obs

🔧 **Paramètres** : E,L,R

💡 **Rôle** : Cette fonction retourne le potentiel gravitationnel dans le référentiel de l'observateur en utilisant la fonction **potentiel_Schwarzschild_photon(L,r)**, la constante d'intégration E ainsi que r et le rayon de Schwarzschild rs.

## #17 : fonction Vr

🚧 *Pourquoi ?*

🔧 **Paramètres** : L, r

💡 **Rôle** : Cette fonction retourne la valeur que donne la fonction **potentiel_Schwarzschild_photon(L,r)** qui devrait être le potentiel gravitationnel.

## #18 : fonction potentiel_Schwarzschild_photon

🔧 **Paramètres** : L, r

💡 **Rôle** : Cette fonction retourne le potentiel gravitationnel en métrique de Schwarzschild pour le photon. Pour cela elle se sert du rayon de Schwarzschild rs.

## #19 : fonction derivee_seconde_potentiel_Schwarzschild_photon

🔧 **Paramètres** : L, r

💡 **Rôle** : Cette fonction retourne la dérivée seconde selon r du potentiel effectif en métrique de Schwarzschild pour le photon. Pour cela elle se sert du rayon de Schwarzschild rs.

## #20 : fonction derivee_seconde_potentiel_Schwarzschild_photon

🔧 **Paramètres** : E, L, r

💡 **Rôle** : Cette fonction retourne la dérivée seconde selon r du potentiel effectif en métrique de Schwarzschild pour le photon dans le référentiel de l'observateur. Pour cela elle se sert du rayon de Schwarzschild rs.

## #21 : fonction rungekutta

🔧 **Paramètre** : L, h, r, A

💡 **Rôle** : Cette fonction utilise la méthode de Runge-Kutta d'analyse numérique d'approximation d'équations différentielles. Cette méthode est utilisée ici pour résoudre l'équation différentielle associée au mouvement d'un photon dans le potentiel gravitationnel de Schwarzschild.

## #22 : fonction rungekutta_obs

🔧 **Paramètre** : L, h, r, A, E.

💡 **Rôle** : Cette fonction utilise la méthode de Runge-Kutta d'analyse numérique d'approximation d'équations différentielles. Cette méthode est utilisée ici pour résoudre l'équation différentielle associée au mouvement d'un photon dans le potentiel gravitationnel de Schwarzschild dans le référentiel de l'observateur.

## #23 : fonction calcul_rmax 

🔧 **Paramètres** : L, E, vr, r0, rmax1ou2

💡 **Rôle** : Cette fonction semble calculer le rayon maximale de l'orbite avec diverses conditions.

📑 **Fonctionnement simplifié**: Il semble il y a voir plusieurs cas de figures : 
1. Dans le cas où L<2*sqrt(3)*m on a rmax=r0.
2. Dans le cas où L <= 4*m et L>2*sqrt(3)*m on à nouveau plusieurs cas de figure :<br>
🔹 Si Vr_mob(L,r0)<=Vr_mob(L,r1) et r0>r1 alors on a à nouveau deux autres cas de figure : si r3 > r0 alors rmax=r3 et si r3 < r0 on a rmax=r0. <br>
🔹 Sinon rmax=r0.<br>
3. Dans le cas où L > 4*m on a rmax=r0.

📰 **Informations** : Cette fonction utilise la fonction **Vr_mob()**.

## #24 : fonction pausee

🔧 **Paramètres** : compteur, mobile, mobilefactor

💡 **Rôle** : Cette fonction semble gérer le fonctionnement du bouton pause. Elle gère la mise en pause et la reprise de l'animation.

📑 **Fonctionnement** :
1. Dans le cas où l'animation n'est pas en pause avant qu'on appuie sur le bouton cela la met en pause. L'icône du bouton de pause est changée, le texte du bouton de pause est changé en "Reprendre", le message d'indication sur l'état du calcul est mis à jour pour montrer que le calcul est en pause et l'intervalle d'animation est effacé.
2. Dans le cas où l'animation était en pause avant que l'on appuie sur le bouton cela la remet en marche. L'icône du bouton de pause est changée, le texte du bouton de pause est changé en "Pause", le message d'indication du calcul est mis à jour pour montrer qu'il est à nouveau en cours et un nouvel intervalle d'animation est créé. 

## #25 : fonction clavierEvenement

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction permet à l'utilisateur d'effectuer certaines actions de l'interface en utilisant les touches du clavier au lieu de la souris.

📑 **Fonctionnement** :
1. La fonction détecte lorsque l'utilisateur presse une touche du clavier.
2. A chaque fois qu'une touche est pressée elle vérifie quelle touche à été pressée.
3. Ensuite il y a plusieurs actions en fonction da la touche pressée :<br>
🔹 Pour "z" : déclenche un clic sur l'événement avec l'ID "r1". <br>
🔹 Pour "e" : déclenche un clic sur l'événement avec l'ID "rebondd".<br>
🔹 Pour "q" : déclenche un clic sur l'événement avec l'ID "start".<br>
🔹 Pour "s" : déclenche un clic sur l'événement avec l'ID "clear".<br>
🔹 Pour "d" : déclenche un clic sur l'événement avec l'ID "boutton_enregis".<br>
🔹 Pour "f" : déclenche un clic sur l'événement avec l'ID "boutton_recup".<br>
🔹 Pour "w" : déclenche un clic sur l'événement avec l'ID "moinsvite".<br>
🔹 Pour "x" : déclenche un clic sur l'événement avec l'ID "pau".<br>
🔹 Pour "c" : déclenche un clic sur l'événement avec l'ID "plusvi".<br>

## #26 : fonction rafraichir2

🔧 **Paramètres** : context, mobilefactor, rmaxjson, r0ou2, compteur

💡 **Rôle** : Cette fonction est responsable de mettre à jour certains éléments de l'interface grafique en fonction des arguments fournis.

📑 **Fonctionnement** :
1. Cette fonction commence par faire appel à la fonction **majFondFixe()**.
2. Puis ensuite elle fait l'appel à la fonction **creation_blocs(context, mobilefactor, rmaxjson, r0ou2, compteur)**.

📰 **Informations** : Cette fonction utilise les autres fonctions : **majFondFixe()** et **creation_blocs**.

## #27 : fonction rafraichir

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction a pour rôle de rafraichir la page en rechargeant complètement son contenu et en réinitialisant le mode à "observateur distant" et en elevant le rebond.

📑 **Fonctionnement** :
1. Tout d'abord la fonction recharge la page actuelle.
2. Puis elle met le mode à "observateur distant".
3. Le bouton "Rebond" n'est plus pressé.

## #28 : fonction enregistrer

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction a pour rôle d'enregistrer une image de la trajectoire d'un photon dans la métrique de Scwharzschild. 

📑 **Fonctionnement** :
1. Elle commence par vérifier si une trajectoire a bien été tracée et si c'est le cas : <br>
🔹 Elle copie le contenu du canvas principal 'canvas' sur un autre canvas 'canvas3'. <br>
🔹 Elle utilise la fonction **canvasToImage(canvas3, {name: 'Trajectoire_photon_Schwar', type: 'png'})** pour enregistrer le canvas3 sous forme d'image PNG avec un nom spécifié 'Trajectoire_photon_Schwar'.<br>
🔹 Elle appelle une fonction **majFondFixe3()** pour sûrement mettre à jour un élément.<br>
2. Dans le cas contraire elle affiche une alerte avec un message récupéré à partir de **o_recupereJson()** qui est **texte.pages_trajectoire.message_enregistrer**.

📰 **Informations** : Cette fonction utilise les autres fonctions : **canvasToImage()** qui vient de **canvas-to-image.js**, **majFondFixe3()** et **o_recupereJson()**.

## #29 : fonction siTrajectoireSimple

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction gère des actions à effectuer si le type de la trajectoire est défini comme "simple".

📑 **Fonctionnement** :
1. La fonction commence par vérifier si la valeur de l'élément d'ID "element" est égal à 'simple' et si c'est le cas elle fait plusieurs choses.
2. Dans ce cas elle commence par appeler la fonction **majFondFixe()**.
3. Ensuite elle appelle la fonction **creation_blocs(context)**.
4. Puis elle multiplie par 2 le diamètre de la particule.

📰 **Informations** : Cette fonction utilise les autres fonctions **majFondFixe()** et **creation_blocs()**.

## #30 : fonction traceEstAbsent

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction indique que la trajectoire n'a pas été tracée.

📑 **Fonctionnement** : Elle affecte la valeur "0" à l'élément avec l'ID "trace_present".

## #31 : fonction siTrajectoireComplete

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction gère des actions à effectuer si le type de la trajectoire est défini comme "complete".

📑 **Fonctionnement** : Si l'élément avec l'ID "element" est égal à 'complete' alors le diametre de la particule "diametre_particule" prend la valeur "DIAMETRE_PART" qui est une des variables globales définit au début du fichier.

## #32 : fonction choixTrajectoire

🚧 *Cette fonction regroupe juste les fonctions **siTrajectoireComplete()** et une version légèrement différente se **siTrajectoireSimple()**.*

🔧 **Paramètres** : compteur, context, mobile, mobilefactor, rmaxjson, r0ou2

💡 **Rôle** : Cette fonction gère le choix entre deux type de trajectoires : soit une trajectoire "simple" soit une trajectoire complète ("complete").

📑 **Fonctionnement** :
1. Si l'élément d'ID "element" a la valeur 'simple' alors : <br>
🔹 La fonction **majFondFixe()** est appellée. <br>
🔹 La fonction **creation_blocs(context, mobilefactor, rmaxjson, r0ou2, compteur)** est appelée. <br>
🔹 Le diamètre de la particule (diametre_particule) est doublé de sa valeur initiale (DIAMETRE_PART).<br>
2. Si l'élément d'ID "element" a la valeur 'complete' :
🔹 Le diamètre de la particule (diametre_particule) garde sa valeur initiale (DIAMETRE_PART).<br>

📰 **Informations** : Cette fonction utilise les autres fonctions : **majFondFixe()** et **creation_blocs()**.

## #33 : fonction estUnMobile

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction est utilisée pour déterminer si l'utilisateur accède à COSMOGRAVITY depuis un téléphone portable ou non et ce en vérifiant la largeur maximale de la fenêtre.

📑 **Fonctionnement** :
1. Cette fonction stocke dans une variable x une requête pour une fenêtre avec une largeur maximale de 960 pixels.
2. Si la requête correspondante est vraie alors elle cache le bouton ayant l'ID "bouton_info".
3. Si le requête correspondante n'est pas vrai alors elle rend le bouton ayant l'ID "bouton_info" visible.

## #34 : fonction commandes

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction sert à afficher une alerte spécifique associée au texte **texte.pages_trajectoire.commandes_horsSchwarMassif** que l'on doit récupérer à l'aide de la fonction **o_recupereJson()**.

📰 **Informations** : Cette fonction utilise une autre fonction **o_recupereJson()**.

## #35 : fonction majFondFixe

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction est utilisée pour mettre à jour et afficher des informations contextuelles sur le canvas utilisé dans COSMOGRAVITY.

📑 **Fonctionnement**:
1. Cette fonction commence par effacer le contenu du canvas.
2. Elle remplit ensuite le canvas avec une couleur de fond blanc.
3. Elle utilise différentes tailles de police et couleurs pour afficher des textes spécifiques sur le canvas : **texte.page_trajectoire_photon.titre**, **texte.page_trajectoire.entrees**. 
4. Elle affiche les informations actuelles du système : le rayon physique de l'astre r et la masse de l'astre M. 
5. Elle vérifie la valeur du bouton d'ID "boutton_ammorti" et si elle est égale à 1 elle affiche le texte **texte.page_trajectoire_massive.amortissement**.
6. Elle vérifie la valeur de l'élément d'ID "traject_type2" et si elle est égale à "observateur" elle affiche **texte.pages_trajectoire.observateur** et sinon elle affiche **texte.pages_trajectoire.photon**.
7. Elle affiche des informations spécifiques aux mobiles/fusées comme la distance initiale du projectile au centre de l'astre, la vitesse tangentielle et la vitesse radiale.

## #36 : fonction majFondFixe44

🔧 **Paramètres** : mobile

💡 **Rôle** : Cette fonction sert à effacer le contenu du canvas associé à un mobile spécifique.

## #37 : fonction majFondFixe22

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction sert à effacer le contenu du canvas associé au contexte graphique "context22".

## #38 : fonction majFondFixe3

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction sert à effacer le contenu du canvas associé au contexte graphique "context3".

## #39 : fonction test_inte

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction sert à vérifier la validité des paramètres fournis avant de lancer la simulation.

📑 **Fonctionnement** : Voici les différentes vérifications qui sont effectuées : <br>
🔹 Si le rayon physique de l'astre est négatif ou que la distance initiale du projectile au centre de l'astre est négative alors une alerte s'affiche avec le texte **texte.pages_trajectoire.rayon_neg**. <br>
🔹 Si le rayon physique de l'astre est plus petit ou égal au rayon de Schwarzschild et qu'il est différent de 0 alors une alerte s'affiche avec le texte **texte.pages_trajectoire.rayonPhyInfHorz**.<br>
🔹 Si la distance initiale du projectile au centre de l'astre est plus petite ou égale au rayon de Scwharzschild alors une alerte s'affiche avec le texte **texte.pages_trajectoire.rayonHorzInfRayonSchw**.<br>
🔹 Si la distance initiale du projectile au centre de l'astre est plus petite au rayon physique de l'astre alors une alerte s'affiche avec le texte **texte.pages_trajectoire.lancerInterdit**.<br>
🔹 Si la vitesse radiale et la vitesse tangentielle sont nulles alors une alerte s'affiche avec le texte **texte.pages_trajectoire.vitesses_initiales_nulles**.<br>

📰 **Informations** : Cette fonction utilise une autre fonction **o_recupereJson()**.

## #40 : fonction creation_blocs

🔧 **Paramètres** : context, mobilefactor, rmaxjson, r0ou2, compteur

💡 **Rôle** : Cette fonction a pour rôle le tracé visuel de différents éléments graphique liés au rayon de Schwarzschild et aux dimensions du canvas.

📑 **Fonctionnement** :
1. Cette fonction dessine un cercle représentant le rayon de Schwarzschild avec différentes configurations en fonction de si factGlobalAvecClef * m / rmaxjson[cle]) < 3.
2. Elle dessine éventuellement une zone colorée pour représenter le rayon physique de l'astre si m < r_phy (le rayon physique de l'astre).
3. Elle ajouter des étiquettes et des lignes pour indiquer les dimensions et l'échelle sur le canvas. 

📰 **Informations** : Cette fonction utilise les couleurs prédifinies **COULEUR_RS** et **COULEUR_PHY**.

## #41 : fonction canvasAvantLancement

🚧 *Les deux premiers for peuvent être réunis en un seul.*

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction a pour rôle la configuration et la préparation du canvas (avec la mise à l'échelle) avant le lancement de la simulation.

📑 **Fonctionnement simplifié** :
1. Cette fonction commence par calculer les facteurs de mise à l'échelle pour chacun des mobiles en fonction du rapport de la distance initiale du mobile au centre de l'astre par rapport au rayon maximal entre tous les mobiles. Ce sont ces facteurs de mise à échelle qui sont stockés dans le tableau "facteurDeMalheur."
2. Elle choisit le facteur de mise à l'échelle global à utiliser en se basant sur la fusée avec la distance initiale au centre de l'astre la plus grande. 
3. Elle récupère le canvas et le contexte et les initialise pour le dessin en définissant le style de la ligne et en effaçant tout dessin précédent.
4. Elle affiche le texte indiquant l'échelle actuelle sur le canvas, puis dessine une barre d'échelle pour illustrer visuellement cette échelle.

## #42 : fonction boutonAvantLancement

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction gére l'affichage et le fonctionnement des boutons et des panneaux avant le lanchement de la simulation.

📑 **Fonctionnement** : 
1. Cette fonction commence par cacher l'élément d'ID "panneau_mobile" qui semble être pour l'accélération et la déccélération de la simulation.
2. Puis elle cache l'élément d'ID "panneau_mobile2" qui semble être pour les zoom.
3. Si le bouton pour zoomer est cliqué la fonction **foncPourZoomMoinsAvantLancement()** est appelée.
4. Si le bouton pour dézoomer est cliqué la fonction **foncPourZoomPlusAvantLancement()** est appelée.
5. Si le bouton pour aller plus vite est cliqué la fonction **foncPourVitAvantLancement()** est appelée et la propriété "myParam" de l'élément avec l'ID "plusvite" est mise à la valeur true.
6. Si le bouton pour aller plus vite est cliqué la fonction **foncPourVitAvantLancement()** est appelée et la propriété "myParam" de l'élément avec l'ID "moinsvite" est mise à la valeur false.

📰 **Informations** : Cette fonction utilise les autres fonctions **foncPourZoomMoinsAvantLancement()**, **foncPourZoomPlusAvantLancement()** et **foncPourVitAvantLancement()**.

## #43 : fonction foncPourZoomPlusAvantLancement

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction permet d'augmenter progressivement le facteur de zoom du canvas lorsque l'utilisateur clique sur le bouton pour zoomer. Elle met aussi à jour l'affichage de la valeur du zoom (le nombre de fois où on a cliqué sur le zoom).

📑 **Fonctionnement** : Le facteur de zoom augmente de 20% à chaque clic sur le bouton zoom et la fonction **canvasAvantLancement()** est appelée pour mettre à jour le canvas en fonction. Et chaque fois que le bouton de zoom est cliqué la valeur de nz est incrémentée de +1.

📰 **Informations**: Cette fonction utilise l'autre fonction **canvasAvantLancement()**.

## #44 : fonction foncPourZoomMoinsAvantLancement

🔧 **Paramètres** : N/A

💡 **Rôle** : Cette fonction permet de réduire progressivement le facteur de zoom du canvas lorsque l'utilisateur clique sur le bouton pour dézoomer. Elle met aussi à jour l'affichage de la valeur du zoom (le nombre de fois où on a cliqué sur le dézoom).

📑 **Fonctionnement** : Le facteur de zoom diminue de 20% à chaque clic sur le bouton zoom et la fonction **canvasAvantLancement()** est appelée pour mettre à jour le canvas en fonction. Et chaque fois que le bouton de dézoom est cliqué la valeur de nz est incrémentée de -1.

📰 **Informations**: Cette fonction utilise l'autre fonction **canvasAvantLancement()**.

## #45 : fonction foncPourVitAvantLancement

🔧 **Paramètres** : accelerer

💡 **Rôle** : Cette fonction permet à l'utilisateur d'ajuster la vitesse de la simulation avant son lancement en cliquant sur les boutons d'accélération et décélération. Elle met aussi à jour l'affichage de la vitesse.

📑 **Fonctionnement** : 
1. En fonction de si l'utilisateur a cliqué sur le bouton pour accélérer ou ralentir elle fait différentes choses.
2. Si l'utilisateur a cliqué sur le bouton pour accélérer alors la valeur de compteurVitesseAvantLancement est incrémentée de 1.
3. Si l'utilisateur à cliqué sur le bouton pour ralentir alors la valeur de compteurVitesseAvantLancement est décrémentée de 1.
4. La valeur affichée de ns est mise à jour pour refléter la nouvelle valeur de la vitesse.

## #46 : fonction MAJGraphePotentiel

🔧 **Paramètres** : data1, data2, compteur, mobile

💡 **Rôle** : Cette fonction met à jour les données du graphique de potentiel en fonction des nouvelles valeurs calculées pour "data1" puis met à jour le graphique en lui-même.

📑 **Fonctionnement** :
1. Cette fonction commence par réinitialiser le tableau data1 à une liste vide.
2. Puis pour une valeur de r entre 0.7 fois celui de la particule et 1.3 fois celui de la particule avec un pas de "mobile.dr" la valeur du potentiel V est calculée. Pour calculer la valeur du potentiel la fonction **Vr_mob(r, mobile.E, mobile.L)** à laquelle on soustrait 1 est utilisée.
3. Chaque nouvelle valeur du potentielle est ainsi ajoutée comme un objet contenant la paire '(r,V)' à la liste "data1".
4. Puis pour finir une fonction **graphique_creation_pot(0,data1,data2,compteur,mobile)** est appelée. 

📰 **Informations** : Cette fonction utilise l'autre fonction **Vr_mob()**.


