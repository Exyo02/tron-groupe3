**Le Serveur attends :**

//Paquet de Login à faire ( on fera plus tard).

Lorsqu'un joueur est prêt à jouer ( du style il clique sur commencer partie ):

```json
{
    type:"enterLoby"
}
```

Lorsqu'un joueur change de direction pendant une partie :

```json
    {
        type: "changeDirection",
        changeDirection: laDirection
    }
```

**Le Serveur envoit :**

Lorsqu'il y a suffisament de joueur le serveur envoit aux deux joueurs ce paquet :

```json
 {
    type: "startGame",
    numeroDuJoueur: 1 ou 2 selon ordre d'arrivé dans loby,
    //pour savoir si on est J1 ou J2 ce qui définira l'emplacement
    // on peut à chaque partie être donc soit J1 soit J2
  }
```

A chaque gameLoop le serveur envoit :

```json
    {
        type: "direction",
        joueur1: directionDuJoueur1,
        joueur2: directionDuJoueur2,
    }

    //Valeur sont soit { haut, bas, gauche, droite }
    // Comme ça le client peut mettre à jour la position suivantes des deux joueurs (lui & l'autre)
```


A la fin d'une partie :

```json
{
    type:"endGame",
    egalite: true ou false
    gagnant: 1 ou 2,
    perdant: 1 ou 2,
    // si egalite pas besoin de préciser gagnant et perdant
}
//  
```

