# Instructions pour la collaboration sur GitLab

## Cloner le repository GitLab

1. Choisissez votre répertoire.

2. Ouvrez le terminal dans votre répertoire et tapez le code suivant:

```
$ git clone https://gitlab.etu.umontpellier.fr/cosmogravity/cosmogravity2023.git
$ git checkout -b <nom-de-votre-branche>
```
Remplacez `<nom-de-votre-branche>` par le nom de la branche que vous voulez créer.

3. Vous pouvez maintenant travailler sur votre branche.

## Enregistrer les modifications

Une fois que vous avez terminé de modifier les fichiers dans votre branche locale, enregistrez vos modifications en suivant les étapes ci-dessous:

1. Ajoutez les modifications à l'index avec la commande:

```
$ git add -A

```
2. Faites un commit de vos modifications avec la commande:

```
$ git commit -m "Message de commit"
```

Remplacez "Message de commit" par un court message décrivant les modifications que vous avez apportées.

## Créer une branche sur GitLab

Votre branche n'existe que sur votre machine locale. Si vous souhaitez créer une branche sur GitLab pour permettre aux autres collaborateurs d'examiner et de fusionner votre travail, suivez les étapes ci-dessous:

1. Utilisez la commande suivante pour créer une branche sur GitLab à partir de votre branche locale:


```
$ git push -u origin <nom-de-votre-branche>:<nom-de-votre-branche>
```


Remplacez `<nom-de-votre-branche>` par le nom de la branche que vous avez créée dans la section précédente.

2. Vous pouvez maintenant voir votre branche sur la page principale de votre repository GitLab.

## Mettre à jour le repository GitLab

Une fois que vous avez enregistré vos modifications et créé une branche sur GitLab, vous pouvez mettre à jour le repository GitLab en suivant les étapes ci-dessous:

1. Utilisez la commande suivante pour pousser vos modifications sur GitLab:

```
$ git push origin <nom-de-votre-branche>
```

Remplacez `<nom-de-votre-branche>` par le nom de la branche que vous avez créée dans la section précédente.

2. Vous pouvez maintenant ouvrir une demande de fusion (merge request) pour que vos modifications soient examinées et fusionnées avec la branche principale du repository GitLab.
